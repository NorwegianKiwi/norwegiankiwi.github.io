#!/usr/bin/env python3
"""Generate a review candidate for world-map.js from Natural Earth shapefiles.

The output is deliberately written to a caller-supplied candidate path. This
script never replaces the checked-in runtime file automatically.
"""

import argparse
import json
import math
import struct
import sys
from pathlib import Path

from map_maintenance import (
    ROOT,
    code_for_source_row,
    find_dataset_file,
    load_countries,
    load_generated_map,
    load_manifest,
    read_dbf,
    resolve_capital_points,
)


WORLD_SIZE = (1000, 520)
QUIZ_SIZE = (1000, 650)
SILHOUETTE_MARKER_LIMIT = 8
PADDING = 8
REGION_COMPONENT_MARGIN_RATIO = 0.10
REGION_CAMERA_PADDING_RATIO = 0.06
REGION_MIN_CONTEXT_ASPECT = 0.75
REGION_MAX_CONTEXT_ASPECT = 2.4
REGION_SIMPLIFY_TOLERANCE = 0.28
REGION_ANTIPODE_GUARD_RADIUS = math.radians(150)
REGION_ANTIPODE_JUMP_DISTANCE = math.radians(30)


def read_shapefile(path):
    raw = path.read_bytes()
    if len(raw) < 100 or struct.unpack_from(">I", raw, 0)[0] != 9994:
        raise ValueError(f"Ugyldig shapefile: {path}")
    records = []
    position = 100
    while position + 8 <= len(raw):
        _, content_words = struct.unpack_from(">II", raw, position)
        position += 8
        content = raw[position : position + content_words * 2]
        position += content_words * 2
        shape_type = struct.unpack_from("<I", content, 0)[0]
        if shape_type == 0:
            records.append({"rings": [], "point": None})
        elif shape_type == 1:
            records.append(
                {"rings": [], "point": struct.unpack_from("<dd", content, 4)}
            )
        elif shape_type in (5, 15, 25):
            part_count, point_count = struct.unpack_from("<II", content, 36)
            parts = list(
                struct.unpack_from(
                    f"<{part_count}I", content, 44
                )
            )
            point_start = 44 + part_count * 4
            points = [
                struct.unpack_from("<dd", content, point_start + index * 16)
                for index in range(point_count)
            ]
            stops = parts[1:] + [point_count]
            records.append(
                {
                    "rings": [
                        points[start:stop]
                        for start, stop in zip(parts, stops)
                        if stop - start >= 3
                    ],
                    "point": None,
                }
            )
        else:
            raise ValueError(
                f"Formtype {shape_type} støttes ikke i {path.name}"
            )
    return records


def load_source_features(source_dir, dataset_key):
    manifest = load_manifest()
    dataset = manifest["datasets"][dataset_key]
    stem = Path(dataset["file"]).stem
    attributes = read_dbf(find_dataset_file(source_dir, stem, ".dbf"))
    geometry = read_shapefile(find_dataset_file(source_dir, stem, ".shp"))
    if len(attributes) != len(geometry):
        raise ValueError(
            f"{stem}: {len(attributes)} DBF-rader og "
            f"{len(geometry)} geometrier"
        )
    return [
        {
            "code": code_for_source_row(row, manifest),
            "name": row.get("ADMIN") or row.get("NAME") or "Ukjent område",
            "rings": shape["rings"],
            "point": shape["point"],
        }
        for row, shape in zip(attributes, geometry)
    ]


def format_number(value, precision=1):
    rounded = round(value, precision)
    if abs(rounded) < 0.5 * 10 ** (-precision):
        rounded = 0.0
    text = f"{rounded:.{precision}f}"
    return text.rstrip("0").rstrip(".") if "." in text else text


def point_line_distance(point, start, end):
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    if dx == 0 and dy == 0:
        return math.hypot(point[0] - start[0], point[1] - start[1])
    t = max(
        0,
        min(
            1,
            (
                (point[0] - start[0]) * dx
                + (point[1] - start[1]) * dy
            )
            / (dx * dx + dy * dy),
        ),
    )
    projection = (start[0] + t * dx, start[1] + t * dy)
    return math.hypot(
        point[0] - projection[0], point[1] - projection[1]
    )


def simplify(points, tolerance):
    if len(points) <= 3:
        return points
    closed = points[0] == points[-1]
    work = points[:-1] if closed else points
    if len(work) <= 3:
        return points

    def recurse(items):
        if len(items) <= 2:
            return items
        distances = [
            point_line_distance(point, items[0], items[-1])
            for point in items[1:-1]
        ]
        largest = max(distances, default=0)
        if largest <= tolerance:
            return [items[0], items[-1]]
        index = distances.index(largest) + 1
        return recurse(items[: index + 1])[:-1] + recurse(items[index:])

    result = recurse(work)
    if closed and result[0] != result[-1]:
        result.append(result[0])
    return result if len(result) >= 4 else points


def path_from_rings(rings, precision=1):
    commands = []
    for ring in rings:
        if len(ring) < 3:
            continue
        commands.append(
            "M"
            + " ".join(
                f"{format_number(x, precision)},{format_number(y, precision)}"
                for x, y in ring
            )
            + "Z"
        )
    return "".join(commands)


def path_from_segments(segments, precision=1):
    return "".join(
        "M"
        + f"{format_number(start[0], precision)},{format_number(start[1], precision)}"
        + "L"
        + f"{format_number(end[0], precision)},{format_number(end[1], precision)}"
        for start, end in segments
    )


def path_from_polylines(lines, precision=1):
    commands = []
    for line in lines:
        if len(line) < 2:
            continue
        commands.append(
            "M"
            + f"{format_number(line[0][0], precision)},{format_number(line[0][1], precision)}"
            + "L"
            + " ".join(
                f"{format_number(x, precision)},{format_number(y, precision)}"
                for x, y in line[1:]
            )
        )
    return "".join(commands)


def natural_earth(longitude, latitude):
    """Project a world point with the original Natural Earth projection."""
    radians = math.pi / 180
    lon = longitude * radians
    lat = max(-89.999, min(89.999, latitude)) * radians
    lat2 = lat * lat
    lat4 = lat2 * lat2
    x = lon * (
        0.8707
        - 0.131979 * lat2
        + lat4
        * (-0.013791 + lat4 * (0.003971 * lat2 - 0.001529 * lat4))
    )
    y = lat * (
        1.007226
        + lat2
        * (0.015085 + lat4 * (-0.044475 + 0.028874 * lat2 - 0.005916 * lat4))
    )
    return x, -y


def azimuthal_equidistant(
    longitude, latitude, center_longitude, center_latitude
):
    """Project a spherical point around a regional map centre.

    Radial distance from the projection centre equals angular distance on the
    globe. This avoids Mercator's polar area inflation while retaining a
    familiar north-up local view for every region.
    """
    radians = math.pi / 180
    longitude_delta = math.radians(
        wrap_longitude(longitude, center_longitude) - center_longitude
    )
    phi = max(-89.999, min(89.999, latitude)) * radians
    phi_zero = center_latitude * radians
    sin_phi = math.sin(phi)
    cos_phi = math.cos(phi)
    sin_phi_zero = math.sin(phi_zero)
    cos_phi_zero = math.cos(phi_zero)
    cosine_distance = max(
        -1.0,
        min(
            1.0,
            sin_phi_zero * sin_phi
            + cos_phi_zero * cos_phi * math.cos(longitude_delta),
        ),
    )
    distance = math.acos(cosine_distance)
    if distance < 1e-12:
        return 0.0, 0.0
    bearing = math.atan2(
        math.sin(longitude_delta) * cos_phi,
        cos_phi_zero * sin_phi
        - sin_phi_zero * cos_phi * math.cos(longitude_delta),
    )
    return distance * math.sin(bearing), -distance * math.cos(bearing)


def regional_projection(center_longitude, center_latitude):
    return lambda longitude, latitude: azimuthal_equidistant(
        longitude,
        latitude,
        center_longitude,
        center_latitude,
    )


def crosses_azimuthal_antipode(points):
    """Return true when a ring jumps across the azimuthal antipode seam.

    The antipode has no unique bearing in an azimuthal projection. A polygon
    crossing that point can otherwise be closed through the visible map
    centre. Such rings are necessarily remote background for these regional
    views and are omitted instead of drawing an artificial chord.
    """
    if len(points) < 2:
        return False
    for start, end in zip(points, points[1:] + points[:1]):
        if (
            math.hypot(*start) >= REGION_ANTIPODE_GUARD_RADIUS
            and math.hypot(*end) >= REGION_ANTIPODE_GUARD_RADIUS
            and math.dist(start, end) >= REGION_ANTIPODE_JUMP_DISTANCE
        ):
            return True
    return False


def wrap_longitude(longitude, center):
    while longitude - center > 180:
        longitude -= 360
    while longitude - center < -180:
        longitude += 360
    return longitude


def fitted_transform(points, width, height, padding=PADDING):
    xs = [point[0] for point in points]
    ys = [point[1] for point in points]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    scale = min(
        (width - padding * 2) / max(max_x - min_x, 1e-9),
        (height - padding * 2) / max(max_y - min_y, 1e-9),
    )
    offset_x = (width - (max_x - min_x) * scale) / 2 - min_x * scale
    offset_y = (height - (max_y - min_y) * scale) / 2 - min_y * scale
    return lambda point: (
        point[0] * scale + offset_x,
        point[1] * scale + offset_y,
    )


def project_feature_rings(features, projection, transform, tolerance):
    output = []
    for feature in features:
        rings = []
        for ring in feature["rings"]:
            projected = [transform(projection(*point)) for point in ring]
            rings.append(simplify(projected, tolerance))
        path = path_from_rings(rings)
        if path:
            item = {
                "code": feature["code"],
                "name": feature["name"],
                "path": path,
            }
            crop_segments = [
                (transform(projection(*start)), transform(projection(*end)))
                for start, end in feature.get("cropSegments", [])
            ]
            crop_path = path_from_segments(crop_segments)
            if crop_path:
                item["cropPath"] = crop_path
            output.append(item)
    return output


def build_world(features, tiny_features, local_names, marker_overrides=None):
    marker_overrides = marker_overrides or {}
    raw_points = [
        natural_earth(*point)
        for feature in features
        for ring in feature["rings"]
        for point in ring
    ]
    transform = fitted_transform(raw_points, *WORLD_SIZE, padding=12)
    output_features = project_feature_rings(
        features, natural_earth, transform, tolerance=0.22
    )
    for feature in output_features:
        if feature["code"] in local_names:
            feature["name"] = local_names[feature["code"]]
    markers = []
    for feature in tiny_features:
        if not feature["point"]:
            continue
        marker_point = marker_overrides.get(feature["code"], feature["point"])
        x, y = transform(natural_earth(*marker_point))
        markers.append(
            {
                "code": feature["code"],
                "name": local_names.get(feature["code"], feature["name"]),
                "x": round(x, 1),
                "y": round(y, 1),
            }
        )
    return output_features, markers


def bounds_transform(bounds, center, projection, width, height):
    west, south, east, north = bounds
    west = wrap_longitude(west, center)
    east = wrap_longitude(east, center)
    while east <= west:
        east += 360

    longitude_steps = max(16, math.ceil((east - west) / 2))
    latitude_steps = max(16, math.ceil((north - south) / 2))
    points = []
    for index in range(longitude_steps + 1):
        longitude = west + (east - west) * index / longitude_steps
        points.append(projection(longitude, south))
        points.append(projection(longitude, north))
    for index in range(latitude_steps + 1):
        latitude = south + (north - south) * index / latitude_steps
        points.append(projection(west, latitude))
        points.append(projection(east, latitude))
    return fitted_transform(points, width, height)


def unwrap_ring(ring, center):
    unwrapped = []
    for longitude, latitude in ring:
        longitude = wrap_longitude(longitude, center)
        if unwrapped:
            previous = unwrapped[-1][0]
            while longitude - previous > 180:
                longitude -= 360
            while longitude - previous < -180:
                longitude += 360
        unwrapped.append((longitude, latitude))
    if not unwrapped:
        return []
    midpoint = sum(longitude for longitude, _ in unwrapped) / len(unwrapped)
    shift = round((center - midpoint) / 360) * 360
    return [(longitude + shift, latitude) for longitude, latitude in unwrapped]


def clip_polygon_edge(points, inside, intersect):
    if not points:
        return []
    output = []
    previous = points[-1]
    previous_inside = inside(previous)
    for current in points:
        current_inside = inside(current)
        if current_inside:
            if not previous_inside:
                output.append(intersect(previous, current))
            output.append(current)
        elif previous_inside:
            output.append(intersect(previous, current))
        previous = current
        previous_inside = current_inside
    return output


def clip_ring_to_bounds(ring, bounds, center):
    west, south, east, north = bounds
    west = wrap_longitude(west, center)
    east = wrap_longitude(east, center)
    while east <= west:
        east += 360
    points = unwrap_ring(ring, center)
    if len(points) > 1 and points[0] == points[-1]:
        points = points[:-1]

    def vertical_intersection(boundary):
        def intersect(start, end):
            denominator = end[0] - start[0]
            ratio = 0 if denominator == 0 else (boundary - start[0]) / denominator
            return (boundary, start[1] + ratio * (end[1] - start[1]))

        return intersect

    def horizontal_intersection(boundary):
        def intersect(start, end):
            denominator = end[1] - start[1]
            ratio = 0 if denominator == 0 else (boundary - start[1]) / denominator
            return (start[0] + ratio * (end[0] - start[0]), boundary)

        return intersect

    points = clip_polygon_edge(
        points, lambda point: point[0] >= west, vertical_intersection(west)
    )
    points = clip_polygon_edge(
        points, lambda point: point[0] <= east, vertical_intersection(east)
    )
    points = clip_polygon_edge(
        points, lambda point: point[1] >= south, horizontal_intersection(south)
    )
    points = clip_polygon_edge(
        points, lambda point: point[1] <= north, horizontal_intersection(north)
    )
    return points if len(points) >= 3 else []


def clip_projected_ring_to_rectangle(points, rectangle):
    x, y, width, height = rectangle
    left, top, right, bottom = x, y, x + width, y + height
    if len(points) > 1 and points[0] == points[-1]:
        points = points[:-1]

    def vertical_intersection(boundary):
        def intersect(start, end):
            denominator = end[0] - start[0]
            ratio = 0 if denominator == 0 else (boundary - start[0]) / denominator
            return (boundary, start[1] + ratio * (end[1] - start[1]))

        return intersect

    def horizontal_intersection(boundary):
        def intersect(start, end):
            denominator = end[1] - start[1]
            ratio = 0 if denominator == 0 else (boundary - start[1]) / denominator
            return (start[0] + ratio * (end[0] - start[0]), boundary)

        return intersect

    points = clip_polygon_edge(
        points, lambda point: point[0] >= left, vertical_intersection(left)
    )
    points = clip_polygon_edge(
        points, lambda point: point[0] <= right, vertical_intersection(right)
    )
    points = clip_polygon_edge(
        points, lambda point: point[1] >= top, horizontal_intersection(top)
    )
    points = clip_polygon_edge(
        points, lambda point: point[1] <= bottom, horizontal_intersection(bottom)
    )
    return points if len(points) >= 3 else []


def rectangle_crop_segments(points, rectangle):
    x, y, width, height = rectangle
    boundaries = ((0, x), (0, x + width), (1, y), (1, y + height))
    tolerance = 1e-7
    return [
        (start, end)
        for start, end in zip(points, points[1:] + points[:1])
        if any(
            abs(start[index] - boundary) < tolerance
            and abs(end[index] - boundary) < tolerance
            for index, boundary in boundaries
        )
    ]


def format_view_box(values):
    return " ".join(format_number(value, 1) for value in values)


def normalized_bounds(bounds, center):
    west, south, east, north = bounds
    west = wrap_longitude(west, center)
    east = wrap_longitude(east, center)
    while east <= west:
        east += 360
    return west, south, east, north


def expanded_selection_bounds(bounds, center):
    west, south, east, north = normalized_bounds(bounds, center)
    longitude_margin = (east - west) * REGION_COMPONENT_MARGIN_RATIO
    latitude_margin = (north - south) * REGION_COMPONENT_MARGIN_RATIO
    return (
        west - longitude_margin,
        max(-85, south - latitude_margin),
        east + longitude_margin,
        min(85, north + latitude_margin),
    )


def ring_intersects_bounds(ring, bounds, center):
    points = unwrap_ring(ring, center)
    if not points:
        return False
    west, south, east, north = bounds
    min_x = min(longitude for longitude, _ in points)
    max_x = max(longitude for longitude, _ in points)
    min_y = min(latitude for _, latitude in points)
    max_y = max(latitude for _, latitude in points)
    return max_x >= west and min_x <= east and max_y >= south and min_y <= north


def point_in_bounds(point, bounds, center):
    longitude, latitude = point
    longitude = wrap_longitude(longitude, center)
    west, south, east, north = bounds
    return west <= longitude <= east and south <= latitude <= north


def build_active_features(
    features,
    local_names,
    active_codes,
    selection_bounds,
    center,
    projection,
    transform,
):
    output = []
    points_by_code = {}
    readable_sizes_by_code = {}
    for feature in features:
        code = feature["code"]
        if code not in active_codes:
            continue
        projected_rings = []
        for ring in feature["rings"]:
            if not ring_intersects_bounds(ring, selection_bounds, center):
                continue
            projected = [
                transform(projection(*point))
                for point in unwrap_ring(ring, center)
            ]
            simplified = simplify(projected, REGION_SIMPLIFY_TOLERANCE)
            projected_rings.append(simplified)
            points_by_code.setdefault(code, []).extend(simplified)
            width = max(x for x, _ in simplified) - min(
                x for x, _ in simplified
            )
            height = max(y for _, y in simplified) - min(
                y for _, y in simplified
            )
            readable_sizes_by_code[code] = max(
                readable_sizes_by_code.get(code, 0), min(width, height)
            )
        path = path_from_rings(projected_rings)
        if path:
            output.append(
                {
                    "code": code,
                    "name": local_names.get(code, feature["name"]),
                    "path": path,
                }
            )
    return output, points_by_code, readable_sizes_by_code


def build_active_markers(
    tiny_features,
    local_names,
    active_codes,
    selection_bounds,
    center,
    projection,
    transform,
    readable_sizes_by_code,
    marker_overrides=None,
):
    marker_overrides = marker_overrides or {}
    markers = []
    points_by_code = {}
    for feature in tiny_features:
        code = feature["code"]
        if (
            code not in active_codes
            or not feature["point"]
            or not point_in_bounds(feature["point"], selection_bounds, center)
        ):
            continue
        longitude, latitude = marker_overrides.get(code, feature["point"])
        longitude = wrap_longitude(longitude, center)
        x, y = transform(projection(longitude, latitude))
        point = (round(x, 1), round(y, 1))
        markers.append(
            {
                "code": code,
                "name": local_names.get(code, feature["name"]),
                "x": point[0],
                "y": point[1],
                "readableSize": round(readable_sizes_by_code.get(code, 0), 1),
            }
        )
        points_by_code.setdefault(code, []).append(point)
    return markers, points_by_code


def camera_view_box(feature_points, marker_points, excluded_codes=None):
    excluded_codes = excluded_codes or set()
    points = [
        point
        for code, code_points in feature_points.items()
        if code not in excluded_codes
        for point in code_points
    ]
    points.extend(
        point
        for code, code_points in marker_points.items()
        if code not in excluded_codes
        for point in code_points
    )
    if not points:
        raise ValueError("Kan ikke beregne regionkamera uten aktive punkter")
    min_x = min(x for x, _ in points)
    max_x = max(x for x, _ in points)
    min_y = min(y for _, y in points)
    max_y = max(y for _, y in points)
    span_x = max(max_x - min_x, 1)
    span_y = max(max_y - min_y, 1)
    padding = max(span_x, span_y) * REGION_CAMERA_PADDING_RATIO
    return (
        min_x - padding,
        min_y - padding,
        span_x + padding * 2,
        span_y + padding * 2,
    )


def bleed_view_box(camera):
    x, y, width, height = camera
    bleed_width = max(width, height * REGION_MAX_CONTEXT_ASPECT)
    bleed_height = max(height, width / REGION_MIN_CONTEXT_ASPECT)
    center_x = x + width / 2
    center_y = y + height / 2
    return (
        center_x - bleed_width / 2,
        center_y - bleed_height / 2,
        bleed_width,
        bleed_height,
    )


def build_background_features(
    features,
    local_names,
    active_codes,
    center,
    projection,
    transform,
    bleed,
    excluded_feature_names=None,
):
    excluded_feature_names = excluded_feature_names or set()
    output = []
    longitude_window = (center - 180, -85, center + 180, 85)
    for feature in features:
        if feature["name"] in excluded_feature_names:
            continue
        code = feature["code"]
        if code in active_codes:
            continue
        rings = []
        crop_segments = []
        for ring in feature["rings"]:
            geographically_clipped = clip_ring_to_bounds(
                ring, longitude_window, center
            )
            if not geographically_clipped:
                continue
            raw_projected = [
                projection(*point) for point in geographically_clipped
            ]
            if crosses_azimuthal_antipode(raw_projected):
                continue
            projected = [transform(point) for point in raw_projected]
            clipped = clip_projected_ring_to_rectangle(projected, bleed)
            if not clipped:
                continue
            simplified = simplify(clipped, REGION_SIMPLIFY_TOLERANCE)
            rings.append(simplified)
            crop_segments.extend(rectangle_crop_segments(simplified, bleed))
        path = path_from_rings(rings)
        if not path:
            continue
        item = {
            "code": code,
            "name": local_names.get(code, feature["name"]),
            "path": path,
        }
        crop_path = path_from_segments(crop_segments)
        if crop_path:
            item["cropPath"] = crop_path
        output.append(item)
    return output


def apply_regional_geometry_overrides(features, overrides):
    """Merge named source objects into a quiz country for regional maps."""
    if not overrides:
        return features
    included_names = {
        name
        for settings in overrides.values()
        for name in settings.get("includeSourceNames", [])
    }
    additions_by_code = {
        code: [
            feature
            for feature in features
            if feature["name"] in settings.get("includeSourceNames", [])
        ]
        for code, settings in overrides.items()
    }
    output = []
    for feature in features:
        if feature["name"] in included_names:
            continue
        additions = additions_by_code.get(feature["code"], [])
        if not additions:
            output.append(feature)
            continue
        output.append(
            {
                **feature,
                "rings": feature["rings"]
                + [ring for addition in additions for ring in addition["rings"]],
            }
        )
    return output


def apply_world_geometry_overrides(features, overrides, local_names):
    """Assign existing generated context objects to quiz countries."""
    if not overrides:
        return features
    generated_names = {}
    generated_counts = {}
    for code in set(overrides.values()):
        target_features = [
            feature
            for feature in features
            if feature.get("code") == code
        ]
        names = {
            feature["name"]
            for feature in target_features
        }
        if len(names) != 1:
            raise ValueError(
                f"Forventet ett generert landnavn for {code!r}, "
                f"fant {len(names)}"
            )
        generated_names[code] = names.pop()
        generated_counts[code] = len(target_features)
    missing_by_code = {}
    for feature_name, code in overrides.items():
        if code not in local_names:
            raise ValueError(
                f"Ukjent quizkode {code!r} i worldGeometryOverrides"
            )
        matches = [
            feature
            for feature in features
            if feature["name"] == feature_name
        ]
        if len(matches) != 1:
            if matches:
                raise ValueError(
                    f"Forventet ett verdensobjekt kalt {feature_name!r}, "
                    f"fant {len(matches)}"
                )
            missing_by_code[code] = missing_by_code.get(code, 0) + 1
    for code, missing_count in missing_by_code.items():
        if generated_counts[code] < missing_count + 1:
            missing_names = [
                name
                for name, target_code in overrides.items()
                if target_code == code
                and not any(
                    feature["name"] == name for feature in features
                )
            ]
            raise ValueError(
                "Fant ikke verdensobjektet "
                + ", ".join(repr(name) for name in missing_names)
            )

    return [
        (
            {
                **feature,
                "code": overrides[feature["name"]],
                "name": generated_names[overrides[feature["name"]]],
            }
            if feature["name"] in overrides
            else feature
        )
        for feature in features
    ]


def build_region_views(
    active_features,
    background_features,
    tiny_features,
    local_names,
    region_settings,
    active_codes_by_scope,
    marker_overrides=None,
    regional_geometry_overrides=None,
):
    regions = {}
    for region, settings in region_settings.items():
        center = settings["centerLongitude"]
        bounds = settings["bounds"]
        center_latitude = (bounds[1] + bounds[3]) / 2
        projection = regional_projection(center, center_latitude)
        transform = bounds_transform(
            bounds, center, projection, *QUIZ_SIZE
        )
        active_codes = active_codes_by_scope[region]
        excluded_background_names = {
            name
            for code in active_codes
            for name in (regional_geometry_overrides or {})
            .get(code, {})
            .get("includeSourceNames", [])
        }
        selection_bounds = expanded_selection_bounds(bounds, center)
        (
            output_features,
            feature_points,
            readable_sizes_by_code,
        ) = build_active_features(
            active_features,
            local_names,
            active_codes,
            selection_bounds,
            center,
            projection,
            transform,
        )
        markers, marker_points = build_active_markers(
            tiny_features,
            local_names,
            active_codes,
            selection_bounds,
            center,
            projection,
            transform,
            readable_sizes_by_code,
            marker_overrides,
        )
        camera = camera_view_box(feature_points, marker_points)
        bleed = bleed_view_box(camera)
        view = {
            "viewBox": format_view_box(camera),
            "bleedViewBox": format_view_box(bleed),
            "features": output_features,
            "markers": markers,
            "backgroundFeatures": build_background_features(
                background_features,
                local_names,
                active_codes,
                center,
                projection,
                transform,
                bleed,
                excluded_background_names,
            ),
        }
        regions[region] = view
    return regions


def ring_area(ring):
    return abs(
        sum(
            x1 * y2 - x2 * y1
            for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1])
        )
        / 2
    )


def representative_silhouette_markers(candidates):
    """Choose a small, deterministic set that preserves geographic spread."""
    unique = {}
    for candidate in candidates:
        point = (candidate["x"], candidate["y"])
        current = unique.get(point)
        if current is None or candidate["area"] > current["area"]:
            unique[point] = candidate
    remaining = list(unique.values())
    if not remaining:
        return []

    selected = [
        max(remaining, key=lambda item: (item["area"], -item["index"]))
    ]
    remaining.remove(selected[0])
    while remaining and len(selected) < SILHOUETTE_MARKER_LIMIT:
        candidate = max(
            remaining,
            key=lambda item: (
                min(
                    (item["x"] - chosen["x"]) ** 2
                    + (item["y"] - chosen["y"]) ** 2
                    for chosen in selected
                ),
                item["area"],
                -item["index"],
            ),
        )
        selected.append(candidate)
        remaining.remove(candidate)

    return [
        {"x": item["x"], "y": item["y"], "r": 1.25}
        for item in selected
    ]


def ring_matches_selection(ring, source_name, selection):
    longitude = sum(point[0] for point in ring) / len(ring)
    latitude = sum(point[1] for point in ring) / len(ring)
    area = ring_area(ring)
    for rule in selection:
        west, south, east, north = rule["bounds"]
        if not (west <= longitude <= east and south <= latitude <= north):
            continue
        if area < rule.get("minArea", 0):
            continue
        if source_name not in rule.get("sourceNames", [source_name]):
            continue
        return True
    return False


def selected_silhouette_rings(rings, selection):
    return [
        item
        for item in rings
        if ring_matches_selection(item["ring"], item["sourceName"], selection)
    ]


def ring_edges(ring):
    edges = list(zip(ring, ring[1:]))
    if ring and ring[0] != ring[-1]:
        edges.append((ring[-1], ring[0]))
    return [(start, end) for start, end in edges if start != end]


def undirected_edge(start, end):
    return tuple(sorted((start, end)))


def joined_boundary_lines(segments):
    remaining = {undirected_edge(start, end) for start, end in segments}
    adjacency = {}
    for start, end in remaining:
        adjacency.setdefault(start, set()).add(end)
        adjacency.setdefault(end, set()).add(start)
    if any(len(neighbours) > 2 for neighbours in adjacency.values()):
        raise ValueError("Delt silhuettgrense har en tvetydig forgrening")

    lines = []
    while remaining:
        active_points = {point for edge in remaining for point in edge}
        endpoints = sorted(
            point
            for point in active_points
            if sum(
                undirected_edge(point, neighbour) in remaining
                for neighbour in adjacency[point]
            )
            == 1
        )
        current = endpoints[0] if endpoints else min(active_points)
        line = [current]
        while True:
            neighbours = sorted(
                neighbour
                for neighbour in adjacency[current]
                if undirected_edge(current, neighbour) in remaining
            )
            if not neighbours:
                break
            following = neighbours[0]
            remaining.remove(undirected_edge(current, following))
            line.append(following)
            current = following
        lines.append(line)
    return lines


def shared_silhouette_boundary(ring_items, settings):
    source_names = settings.get("sourceNames", [])
    if len(source_names) != 2 or len(set(source_names)) != 2:
        raise ValueError(
            "divisionSharedBoundary krever nøyaktig to unike sourceNames"
        )
    edges_by_name = []
    for source_name in source_names:
        matching_rings = [
            item["ring"]
            for item in ring_items
            if item["sourceName"] == source_name
        ]
        if not matching_rings:
            raise ValueError(
                f"Fant ikke kildeobjektet {source_name!r} for delt grense"
            )
        edges_by_name.append(
            {
                undirected_edge(start, end): (start, end)
                for ring in matching_rings
                for start, end in ring_edges(ring)
            }
        )
    shared_edges = edges_by_name[0].keys() & edges_by_name[1].keys()
    if not shared_edges:
        raise ValueError(
            "Fant ingen felles grensesegmenter mellom "
            + " og ".join(repr(name) for name in source_names)
        )
    return joined_boundary_lines(
        [edges_by_name[0][edge] for edge in shared_edges]
    )


def silhouette_projection(ring_items, frame=(0, 0, 100, 100), padding=8):
    if not ring_items:
        raise ValueError("Tomt geografisk utvalg for silhuett")
    rings = [item["ring"] for item in ring_items]
    largest = max(rings, key=ring_area)
    center = sum(point[0] for point in largest) / len(largest)
    largest_latitudes = [lat for _, lat in largest]
    center_latitude = (min(largest_latitudes) + max(largest_latitudes)) / 2
    longitude_scale = math.cos(math.radians(center_latitude))
    wrapped_rings = [
        [(wrap_longitude(lon, center), lat) for lon, lat in ring]
        for ring in rings
    ]
    raw = [
        ((lon - center) * longitude_scale, -lat)
        for ring in wrapped_rings
        for lon, lat in ring
    ]
    frame_x, frame_y, frame_width, frame_height = frame
    local_transform = fitted_transform(
        raw,
        frame_width,
        frame_height,
        padding=min(padding, frame_width / 4, frame_height / 4),
    )

    def transform(point):
        x, y = local_transform(point)
        return x + frame_x, y + frame_y

    return {
        "center": center,
        "longitudeScale": longitude_scale,
        "transform": transform,
        "projectedRings": [
            [
                transform(((lon - center) * longitude_scale, -lat))
                for lon, lat in ring
            ]
            for ring in wrapped_rings
        ],
    }


def project_silhouette_ring(ring, projection):
    center = projection["center"]
    longitude_scale = projection["longitudeScale"]
    transform = projection["transform"]
    return [
        transform(
            (
                (wrap_longitude(lon, center) - center) * longitude_scale,
                -lat,
            )
        )
        for lon, lat in ring
    ]


def project_silhouette_capitals(capitals, projection):
    center = projection["center"]
    longitude_scale = projection["longitudeScale"]
    transform = projection["transform"]
    output = []
    for capital in capitals:
        projected = transform(
            (
                (
                    wrap_longitude(capital["longitude"], center) - center
                )
                * longitude_scale,
                -capital["latitude"],
            )
        )
        output.append({
            "x": round(projected[0], 1),
            "y": round(projected[1], 1),
            "kind": capital.get("kind", "quiz"),
        })
    return output


def apply_ring_code_overrides(features, rules, local_names):
    """Promote geographically separate rings embedded in a parent feature."""
    if not rules:
        return features
    output = []
    promoted = {rule["targetCode"]: [] for rule in rules}
    for feature in features:
        matching_rules = [
            rule for rule in rules if rule["sourceCode"] == feature["code"]
        ]
        if not matching_rules:
            output.append(feature)
            continue
        remaining = []
        for ring in feature["rings"]:
            longitude = sum(point[0] for point in ring) / len(ring)
            latitude = sum(point[1] for point in ring) / len(ring)
            target = next((
                rule["targetCode"]
                for rule in matching_rules
                if rule["bounds"][0] <= longitude <= rule["bounds"][2]
                and rule["bounds"][1] <= latitude <= rule["bounds"][3]
            ), None)
            (promoted[target] if target else remaining).append(ring)
        output.append({**feature, "rings": remaining})
    for code, rings in promoted.items():
        if not rings:
            raise ValueError(f"Fant ingen ringer for områdeoverstyringen {code}")
        output.append({
            "code": code,
            "name": local_names[code],
            "rings": rings,
            "point": None,
        })
    return output


def capital_matches_selection(capital, selection):
    longitude = capital["longitude"]
    latitude = capital["latitude"]
    return any(
        west <= longitude <= east and south <= latitude <= north
        for west, south, east, north in (
            rule["bounds"] for rule in selection
        )
    )


def build_silhouette_capitals(
    features, country_codes, capital_points, overrides=None
):
    """Project capitals into the main or most detailed silhouette layer."""
    overrides = overrides or {}
    by_code = {}
    by_name = {}
    for feature in features:
        by_name.setdefault(feature["name"], []).extend(
            {"ring": ring, "sourceName": feature["name"]}
            for ring in feature["rings"]
        )
        if feature["code"] in country_codes:
            by_code.setdefault(feature["code"], []).extend(
                {"ring": ring, "sourceName": feature["name"]}
                for ring in feature["rings"]
            )

    output = {}
    for code in sorted(country_codes):
        capitals = capital_points.get(code)
        if not capitals:
            continue
        ring_items = by_code.get(code, [])
        if not ring_items:
            raise ValueError(f"Mangler 1:10m-ringer for {code}")
        override = overrides.get(code)
        if override:
            ring_items = ring_items + [
                item
                for source_name in override.get("includeSourceNames", [])
                for item in by_name.get(source_name, [])
            ]
        main_items = (
            selected_silhouette_rings(ring_items, override["main"])
            if override
            else ring_items
        )

        if not override or not (
            override.get("insets")
            or override.get("division")
            or override.get("divisionSharedBoundary")
        ):
            projection = silhouette_projection(main_items)
            output[code] = {
                "main": project_silhouette_capitals(capitals, projection),
                "insets": [],
            }
            continue

        inset_capitals = [[] for _ in override.get("insets", [])]
        main_capitals = []
        for capital in capitals:
            matching_inset = next(
                (
                    index
                    for index, inset in enumerate(override.get("insets", []))
                    if capital_matches_selection(capital, inset["selection"])
                ),
                None,
            )
            if matching_inset is None:
                main_capitals.append(capital)
            else:
                inset_capitals[matching_inset].append(capital)

        projected_insets = []
        for inset, points in zip(override.get("insets", []), inset_capitals):
            inset_items = selected_silhouette_rings(
                ring_items, inset["selection"]
            )
            projection = silhouette_projection(
                inset_items, inset["frame"], padding=3
            )
            projected_insets.append(
                project_silhouette_capitals(points, projection)
            )

        if override.get("expandedPanelsOnly"):
            projected_main = []
        else:
            projection = silhouette_projection(
                main_items, override["expandedMainFrame"], padding=3
            )
            projected_main = project_silhouette_capitals(
                main_capitals, projection
            )
        output[code] = {
            "main": projected_main,
            "insets": projected_insets,
        }
    return output


def silhouette_source_frame(main_items, source_items, frame, padding=3):
    projection = silhouette_projection(main_items, frame, padding)
    points = [
        point
        for item in source_items
        for point in project_silhouette_ring(item["ring"], projection)
    ]
    if not points:
        raise ValueError("Tom kildegeometri for silhuettinnfelling")

    frame_x, frame_y, frame_width, frame_height = frame
    min_x = min(point[0] for point in points) - 1.5
    max_x = max(point[0] for point in points) + 1.5
    min_y = min(point[1] for point in points) - 1.5
    max_y = max(point[1] for point in points) + 1.5
    minimum_size = 5
    if max_x - min_x < minimum_size:
        center_x = (min_x + max_x) / 2
        min_x = center_x - minimum_size / 2
        max_x = center_x + minimum_size / 2
    if max_y - min_y < minimum_size:
        center_y = (min_y + max_y) / 2
        min_y = center_y - minimum_size / 2
        max_y = center_y + minimum_size / 2

    min_x = max(frame_x, min(min_x, frame_x + frame_width - minimum_size))
    min_y = max(frame_y, min(min_y, frame_y + frame_height - minimum_size))
    max_x = min(frame_x + frame_width, max(max_x, min_x + minimum_size))
    max_y = min(frame_y + frame_height, max(max_y, min_y + minimum_size))
    return [
        round(min_x, 1),
        round(min_y, 1),
        round(max_x - min_x, 1),
        round(max_y - min_y, 1),
    ]


def build_silhouette_layer(
    ring_items,
    frame=(0, 0, 100, 100),
    padding=8,
    division_items=None,
    division_lines=None,
    merge_stroke=False,
    force_markers=False,
):
    projection = silhouette_projection(ring_items, frame, padding)

    path_rings = []
    marker_candidates = []
    for index, projected in enumerate(projection["projectedRings"]):
        width = max(x for x, _ in projected) - min(x for x, _ in projected)
        height = max(y for _, y in projected) - min(y for _, y in projected)
        if force_markers or (width < 1.4 and height < 1.4):
            marker_candidates.append(
                {
                    "x": round(sum(x for x, _ in projected) / len(projected), 1),
                    "y": round(sum(y for _, y in projected) / len(projected), 1),
                    "area": ring_area(projected),
                    "index": index,
                    "projected": projected,
                }
            )
        else:
            path_rings.append(simplify(projected, 0.18))
    markers = (
        []
        if path_rings
        else representative_silhouette_markers(marker_candidates)
    )
    layer = {
        "path": path_from_rings(path_rings),
        "minorPath": path_from_rings(
            [
                simplify(candidate["projected"], 0.08)
                for candidate in marker_candidates
            ]
        ),
        "markers": markers,
    }
    if merge_stroke:
        layer["mergeStroke"] = True
    if division_items:
        division_rings = []
        for item in division_items:
            projected = project_silhouette_ring(item["ring"], projection)
            division_rings.append(simplify(projected, 0.08))
        layer["divisionPath"] = path_from_rings(division_rings)
    if division_lines:
        projected_lines = [
            simplify(project_silhouette_ring(line, projection), 0.08)
            for line in division_lines
        ]
        layer["divisionPath"] = path_from_polylines(projected_lines)
    return layer


def build_silhouettes(features, country_codes, overrides=None):
    overrides = overrides or {}
    by_code = {}
    by_name = {}
    for feature in features:
        by_name.setdefault(feature["name"], []).extend(
            {"ring": ring, "sourceName": feature["name"]}
            for ring in feature["rings"]
        )
        if feature["code"] in country_codes:
            by_code.setdefault(feature["code"], []).extend(
                {"ring": ring, "sourceName": feature["name"]}
                for ring in feature["rings"]
            )

    silhouettes = {}
    for code in sorted(country_codes):
        ring_items = by_code.get(code, [])
        if not ring_items:
            raise ValueError(f"Mangler 1:10m-ringer for {code}")
        override = overrides.get(code)
        if override:
            ring_items = ring_items + [
                item
                for source_name in override.get("includeSourceNames", [])
                for item in by_name.get(source_name, [])
            ]
        main_items = (
            selected_silhouette_rings(ring_items, override["main"])
            if override else ring_items
        )
        silhouette = {
            **build_silhouette_layer(
                main_items,
                merge_stroke=bool(override and override.get("mergeStroke")),
                force_markers=bool(
                    override and override.get("forceCompactMarkers")
                ),
            ),
            "corner": "bottom-left",
        }
        if override and (
            override.get("insets")
            or override.get("division")
            or override.get("divisionSharedBoundary")
        ):
            if override.get("division") and override.get(
                "divisionSharedBoundary"
            ):
                raise ValueError(
                    f"{code} kan ikke kombinere division og "
                    "divisionSharedBoundary"
                )
            division_items = (
                selected_silhouette_rings(ring_items, override["division"])
                if override.get("division")
                else None
            )
            division_lines = (
                shared_silhouette_boundary(
                    ring_items, override["divisionSharedBoundary"]
                )
                if override.get("divisionSharedBoundary")
                else None
            )
            if override.get("expandedPanelsOnly"):
                expanded_main = {"path": "", "minorPath": "", "insets": []}
            else:
                expanded_main = build_silhouette_layer(
                    main_items,
                    override["expandedMainFrame"],
                    padding=3,
                    division_items=division_items,
                    division_lines=division_lines,
                    merge_stroke=bool(override.get("mergeStroke")),
                )
            expanded_main.pop("markers", None)
            expanded_main.setdefault("insets", [])
            for inset in override.get("insets", []):
                inset_items = selected_silhouette_rings(
                    ring_items, inset["selection"]
                )
                inset_layer = build_silhouette_layer(
                    inset_items,
                    inset["frame"],
                    padding=3,
                )
                inset_layer.pop("markers")
                inset_layer["frame"] = inset["frame"]
                if inset.get("connectToSource"):
                    source_items = selected_silhouette_rings(
                        main_items, inset["selection"]
                    )
                    inset_layer["sourceFrame"] = silhouette_source_frame(
                        main_items,
                        source_items,
                        override["expandedMainFrame"],
                        padding=3,
                    )
                expanded_main["insets"].append(inset_layer)
            silhouette["expanded"] = expanded_main
        silhouettes[code] = silhouette
    return silhouettes


def compact_json(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def write_candidate(path, data):
    script = f"""(function () {{
  "use strict";

  const data = {compact_json(data["base"])};
  data.quizProjection = {compact_json(data["quizProjection"])};
  data.quizRegions = {compact_json(data["quizRegions"])};
  data.silhouetteViewBox = {compact_json(data["silhouetteViewBox"])};
  data.silhouettes = {compact_json(data["silhouettes"])};
  data.silhouetteCapitals = {compact_json(data["silhouetteCapitals"])};
  Object.values(data.quizRegions).forEach((view) => {{
    Object.freeze(view.features);
    Object.freeze(view.markers);
    Object.freeze(view.backgroundFeatures);
    Object.freeze(view);
  }});
  Object.freeze(data.quizRegions);
  Object.values(data.silhouettes).forEach((silhouette) => {{
    Object.freeze(silhouette.markers);
    if (silhouette.expanded) {{
      silhouette.expanded.insets.forEach((inset) => {{
        Object.freeze(inset.frame);
        if (inset.sourceFrame) Object.freeze(inset.sourceFrame);
        Object.freeze(inset);
      }});
      Object.freeze(silhouette.expanded.insets);
      Object.freeze(silhouette.expanded);
    }}
    Object.freeze(silhouette);
  }});
  Object.freeze(data.silhouettes);
  Object.values(data.silhouetteCapitals).forEach((capitalLayers) => {{
    Object.freeze(capitalLayers.main);
    capitalLayers.insets.forEach((inset) => Object.freeze(inset));
    Object.freeze(capitalLayers.insets);
    Object.freeze(capitalLayers);
  }});
  Object.freeze(data.silhouetteCapitals);
  Object.freeze(data.features);
  Object.freeze(data.markers);
  window.GEOGRAFI_QUIZ_MAP_DATA = Object.freeze(data);
}})();
"""
    path.write_text(script, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(
        description="Generer en separat kandidat til world-map.js."
    )
    parser.add_argument("source_directory", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument(
        "--base-map",
        type=Path,
        help=(
            "Preserve the world geometry and silhouettes from this existing "
            "map while regenerating regional views."
        ),
    )
    parser.add_argument(
        "--refresh-silhouettes",
        action="store_true",
        help=(
            "Regenerate silhouettes from the 1:10m source even when "
            "--base-map preserves the existing world map."
        ),
    )
    parser.add_argument(
        "--refresh-silhouette-overrides",
        action="store_true",
        help=(
            "Regenerate only the country-specific silhouette overrides while "
            "preserving every other map and silhouette from --base-map."
        ),
    )
    parser.add_argument(
        "--refresh-world-overrides",
        action="store_true",
        help=(
            "Apply only worldGeometryOverrides to existing generated world "
            "objects while preserving every other datum from --base-map."
        ),
    )
    parser.add_argument(
        "--refresh-world",
        action="store_true",
        help=(
            "Regenerate only world geometry and markers while preserving "
            "regional views and silhouettes from --base-map."
        ),
    )
    args = parser.parse_args()
    if args.refresh_silhouette_overrides and not args.base_map:
        parser.error("--refresh-silhouette-overrides krever --base-map")
    if args.refresh_silhouette_overrides and args.refresh_silhouettes:
        parser.error("Velg bare én metode for å regenerere silhuetter")
    if args.refresh_world_overrides and not args.base_map:
        parser.error("--refresh-world-overrides krever --base-map")
    if args.refresh_world and not args.base_map:
        parser.error("--refresh-world krever --base-map")
    if args.refresh_world and args.refresh_world_overrides:
        parser.error("Velg bare én metode for å regenerere verdenskartet")
    if args.refresh_world_overrides and (
        args.refresh_silhouettes or args.refresh_silhouette_overrides
    ):
        parser.error(
            "--refresh-world-overrides kan ikke kombineres med "
            "silhuettoppdatering"
        )
    if args.refresh_world and (
        args.refresh_silhouettes or args.refresh_silhouette_overrides
    ):
        parser.error(
            "--refresh-world kan ikke kombineres med silhuettoppdatering"
        )
    if args.output.resolve() == (ROOT / "world-map.js").resolve():
        parser.error(
            "Av sikkerhetshensyn kan ikke generatoren skrive direkte til "
            "world-map.js. Bruk en kandidatfil."
        )

    try:
        manifest = load_manifest()
        countries = load_countries()
        local_names = {
            country["code"]: country["name"] for country in countries
        }
        region_for_code = {
            country["code"]: country["region"] for country in countries
        }
        country_codes = set(local_names)
        countries50 = load_source_features(args.source_directory, "countries50m")
        tiny50 = load_source_features(
            args.source_directory, "tinyCountries50m"
        )
        countries10 = load_source_features(
            args.source_directory, "countries10m"
        )
        ring_rules = manifest.get("ringCodeOverrides", [])
        countries50 = apply_ring_code_overrides(
            countries50, ring_rules, local_names
        )
        countries10 = apply_ring_code_overrides(
            countries10, ring_rules, local_names
        )
        populated_places_dataset = manifest["datasets"]["populatedPlaces10m"]
        populated_places_stem = Path(populated_places_dataset["file"]).stem
        populated_places = read_dbf(
            find_dataset_file(
                args.source_directory, populated_places_stem, ".dbf"
            )
        )
        capital_points = resolve_capital_points(
            populated_places, countries, manifest
        )
        tiny_codes = {
            feature["code"]
            for feature in tiny50
            if feature["code"] in country_codes
        }
        marker_overrides = manifest.get("markerOverrides", {})
        regional_countries50 = apply_regional_geometry_overrides(
            countries50, manifest.get("regionalGeometryOverrides", {})
        )
        regional_active_features = [
            feature
            for feature in regional_countries50
            if feature["code"] not in tiny_codes
        ] + [
            feature for feature in countries10 if feature["code"] in tiny_codes
        ]
        existing = (
            load_generated_map(args.base_map)
            if args.base_map
            else load_generated_map()
        )
        if args.refresh_world:
            world_features, world_markers = build_world(
                countries50, tiny50, local_names, marker_overrides
            )
            world_features = apply_world_geometry_overrides(
                world_features,
                manifest.get("worldGeometryOverrides", {}),
                local_names,
            )
        elif args.base_map:
            world_features = existing["features"]
            world_markers = existing["markers"]
            if args.refresh_world_overrides:
                world_features = apply_world_geometry_overrides(
                    world_features,
                    manifest.get("worldGeometryOverrides", {}),
                    local_names,
                )
            elif marker_overrides:
                _, regenerated_world_markers = build_world(
                    countries50, tiny50, local_names, marker_overrides
                )
                replacement_markers = {
                    marker["code"]: marker
                    for marker in regenerated_world_markers
                    if marker["code"] in marker_overrides
                }
                world_markers = [
                    replacement_markers.get(marker["code"], marker)
                    for marker in world_markers
                ]
        else:
            world_features, world_markers = build_world(
                countries50, tiny50, local_names, marker_overrides
            )
            world_features = apply_world_geometry_overrides(
                world_features,
                manifest.get("worldGeometryOverrides", {}),
                local_names,
            )
        quiz_active_codes = {
            region: {
                code
                for code, country_region in region_for_code.items()
                if country_region == region
            }
            for region in manifest["quizRegions"]
        }
        if (
            args.refresh_silhouette_overrides
            or args.refresh_world_overrides
            or args.refresh_world
        ):
            quiz_regions = existing["quizRegions"]
        else:
            quiz_regions = build_region_views(
                regional_active_features,
                countries50,
                tiny50,
                local_names,
                manifest["quizRegions"],
                quiz_active_codes,
                marker_overrides,
                manifest.get("regionalGeometryOverrides", {}),
            )
        silhouette_overrides = manifest.get("silhouetteOverrides", {})
        if args.refresh_silhouette_overrides:
            regenerated = build_silhouettes(
                countries10,
                set(silhouette_overrides),
                silhouette_overrides,
            )
            silhouettes = {
                **existing["silhouettes"],
                **regenerated,
            }
        elif args.base_map and not args.refresh_silhouettes:
            silhouettes = existing["silhouettes"]
        else:
            silhouettes = build_silhouettes(
                countries10,
                country_codes,
                silhouette_overrides,
            )
        silhouette_capitals = (
            existing["silhouetteCapitals"]
            if args.refresh_world_overrides or args.refresh_world
            else build_silhouette_capitals(
                countries10,
                country_codes,
                capital_points,
                silhouette_overrides,
            )
        )
        data = {
            "base": {
                "viewBox": (
                    manifest["generatedOutput"]["worldViewBox"]
                    if args.refresh_world or not args.base_map
                    else existing["viewBox"]
                ),
                "source": (
                    (
                        "Natural Earth 1:50m Admin 0, version "
                        + manifest["naturalEarthVersion"]
                    )
                    if args.refresh_world or not args.base_map
                    else existing["source"]
                ),
                "projection": (
                    manifest["generatedOutput"]["worldProjection"]
                    if args.refresh_world or not args.base_map
                    else existing["projection"]
                ),
                "features": world_features,
                "markers": world_markers,
            },
            "quizProjection": manifest["generatedOutput"]["quizProjection"],
            "quizRegions": quiz_regions,
            "silhouetteViewBox": (
                existing["silhouetteViewBox"]
                if args.base_map
                else manifest["generatedOutput"]["silhouetteViewBox"]
            ),
            "silhouettes": silhouettes,
            "silhouetteCapitals": silhouette_capitals,
        }
        args.output.parent.mkdir(parents=True, exist_ok=True)
        write_candidate(args.output, data)
        print(f"Skrev kandidat: {args.output}")
        print(
            f"{len(world_features)} verdenskartobjekter, "
            f"{len(world_markers)} smålandspunkter, "
            f"{len(silhouettes)} silhuetter"
        )
        print(
            "Kandidaten er ikke godkjent før validering og visuell "
            "nettleserkontroll er gjennomført."
        )
        return 0
    except (OSError, ValueError, struct.error) as error:
        print(f"FEIL: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
