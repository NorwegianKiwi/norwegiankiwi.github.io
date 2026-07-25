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
)


WORLD_SIZE = (1000, 500)
QUIZ_SIZE = (1000, 650)
SILHOUETTE_SIZE = (100, 100)
PADDING = 8


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


def equal_earth(longitude, latitude):
    a1, a2, a3, a4 = 1.340264, -0.081106, 0.000893, 0.003796
    radians = math.pi / 180
    lon = longitude * radians
    lat = max(-89.999, min(89.999, latitude)) * radians
    theta = math.asin(math.sqrt(3) / 2 * math.sin(lat))
    theta2 = theta * theta
    theta6 = theta2 * theta2 * theta2
    denominator = (
        math.sqrt(3)
        * (a1 + 3 * a2 * theta2 + theta6 * (7 * a3 + 9 * a4 * theta2))
    )
    x = 2 * math.sqrt(3) * lon * math.cos(theta) / denominator
    y = theta * (a1 + a2 * theta2 + theta6 * (a3 + a4 * theta2))
    return x, -y


def mercator(longitude, latitude):
    latitude = max(-85, min(85, latitude))
    radians = math.pi / 180
    return (
        longitude * radians,
        -math.log(math.tan(math.pi / 4 + latitude * radians / 2)),
    )


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
            output.append(
                {"code": feature["code"], "name": feature["name"], "path": path}
            )
    return output


def build_world(features, tiny_features, local_names):
    raw_points = [
        equal_earth(*point)
        for feature in features
        for ring in feature["rings"]
        for point in ring
    ]
    transform = fitted_transform(raw_points, *WORLD_SIZE, padding=12)
    output_features = project_feature_rings(
        features, equal_earth, transform, tolerance=0.22
    )
    for feature in output_features:
        if feature["code"] in local_names:
            feature["name"] = local_names[feature["code"]]
    markers = []
    for feature in tiny_features:
        if not feature["point"]:
            continue
        x, y = transform(equal_earth(*feature["point"]))
        markers.append(
            {
                "code": feature["code"],
                "name": local_names.get(feature["code"], feature["name"]),
                "x": round(x, 1),
                "y": round(y, 1),
            }
        )
    return output_features, markers


def bounds_transform(bounds, center, width, height):
    west, south, east, north = bounds
    west = wrap_longitude(west, center)
    east = wrap_longitude(east, center)
    while east <= west:
        east += 360
    top_left = mercator(west, north)
    bottom_right = mercator(east, south)
    scale = min(
        (width - 2 * PADDING) / (bottom_right[0] - top_left[0]),
        (height - 2 * PADDING) / (bottom_right[1] - top_left[1]),
    )
    used_width = (bottom_right[0] - top_left[0]) * scale
    used_height = (bottom_right[1] - top_left[1]) * scale
    offset_x = (width - used_width) / 2 - top_left[0] * scale
    offset_y = (height - used_height) / 2 - top_left[1] * scale
    return lambda point: (
        point[0] * scale + offset_x,
        point[1] * scale + offset_y,
    )


def ring_intersects_bounds(ring, bounds, center):
    west, south, east, north = bounds
    wrapped_west = wrap_longitude(west, center)
    wrapped_east = wrap_longitude(east, center)
    while wrapped_east <= wrapped_west:
        wrapped_east += 360
    longitudes = [wrap_longitude(point[0], center) for point in ring]
    latitudes = [point[1] for point in ring]
    return not (
        max(longitudes) < wrapped_west
        or min(longitudes) > wrapped_east
        or max(latitudes) < south
        or min(latitudes) > north
    )


def build_quiz_regions(features, tiny_features, local_names, manifest):
    regions = {}
    for region, settings in manifest["quizRegions"].items():
        center = settings["centerLongitude"]
        bounds = settings["bounds"]
        transform = bounds_transform(bounds, center, *QUIZ_SIZE)

        selected_features = []
        for feature in features:
            rings = [
                ring
                for ring in feature["rings"]
                if ring_intersects_bounds(ring, bounds, center)
            ]
            if rings:
                selected_features.append({**feature, "rings": rings})

        def projection(longitude, latitude):
            return mercator(wrap_longitude(longitude, center), latitude)

        output_features = project_feature_rings(
            selected_features, projection, transform, tolerance=0.28
        )
        for feature in output_features:
            if feature["code"] in local_names:
                feature["name"] = local_names[feature["code"]]

        markers = []
        for feature in tiny_features:
            if not feature["point"]:
                continue
            longitude, latitude = feature["point"]
            wrapped = wrap_longitude(longitude, center)
            west, south, east, north = bounds
            west = wrap_longitude(west, center)
            east = wrap_longitude(east, center)
            while east <= west:
                east += 360
            if west <= wrapped <= east and south <= latitude <= north:
                x, y = transform(mercator(wrapped, latitude))
                markers.append(
                    {
                        "code": feature["code"],
                        "name": local_names.get(
                            feature["code"], feature["name"]
                        ),
                        "x": round(x, 1),
                        "y": round(y, 1),
                    }
                )
        regions[region] = {
            "viewBox": manifest["generatedOutput"]["quizViewBox"],
            "features": output_features,
            "markers": markers,
        }
    return regions


def ring_area(ring):
    return abs(
        sum(
            x1 * y2 - x2 * y1
            for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1])
        )
        / 2
    )


def build_silhouettes(features, country_codes, existing_corners):
    by_code = {}
    for feature in features:
        if feature["code"] in country_codes:
            by_code.setdefault(feature["code"], []).extend(feature["rings"])

    silhouettes = {}
    for code in sorted(country_codes):
        rings = by_code.get(code, [])
        if not rings:
            raise ValueError(f"Mangler 1:10m-ringer for {code}")
        largest = max(rings, key=ring_area)
        center = sum(point[0] for point in largest) / len(largest)
        wrapped_rings = [
            [(wrap_longitude(lon, center), lat) for lon, lat in ring]
            for ring in rings
        ]
        raw = [
            (lon * math.cos(math.radians(lat)), -lat)
            for ring in wrapped_rings
            for lon, lat in ring
        ]
        transform = fitted_transform(raw, *SILHOUETTE_SIZE, padding=8)
        path_rings = []
        markers = []
        for ring in wrapped_rings:
            projected = [
                transform((lon * math.cos(math.radians(lat)), -lat))
                for lon, lat in ring
            ]
            width = max(x for x, _ in projected) - min(x for x, _ in projected)
            height = max(y for _, y in projected) - min(y for _, y in projected)
            if width < 1.4 and height < 1.4:
                markers.append(
                    {
                        "x": round(
                            sum(x for x, _ in projected) / len(projected), 1
                        ),
                        "y": round(
                            sum(y for _, y in projected) / len(projected), 1
                        ),
                        "r": 1.25,
                    }
                )
            else:
                path_rings.append(simplify(projected, 0.18))
        silhouettes[code] = {
            "path": path_from_rings(path_rings),
            "markers": markers,
            "corner": existing_corners.get(code, "bottom-left"),
        }
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
  Object.values(data.quizRegions).forEach((view) => {{
    Object.freeze(view.features);
    Object.freeze(view.markers);
    Object.freeze(view);
  }});
  Object.freeze(data.quizRegions);
  Object.values(data.silhouettes).forEach((silhouette) => {{
    Object.freeze(silhouette.markers);
    Object.freeze(silhouette);
  }});
  Object.freeze(data.silhouettes);
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
    args = parser.parse_args()
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
        country_codes = set(local_names)
        countries50 = load_source_features(args.source_directory, "countries50m")
        tiny50 = load_source_features(
            args.source_directory, "tinyCountries50m"
        )
        countries10 = load_source_features(args.source_directory, "countries10m")
        existing = load_generated_map()
        existing_corners = {
            code: silhouette.get("corner", "bottom-left")
            for code, silhouette in existing["silhouettes"].items()
        }

        world_features, world_markers = build_world(
            countries50, tiny50, local_names
        )
        quiz_regions = build_quiz_regions(
            countries50, tiny50, local_names, manifest
        )
        silhouettes = build_silhouettes(
            countries10, country_codes, existing_corners
        )
        data = {
            "base": {
                "viewBox": manifest["generatedOutput"]["worldViewBox"],
                "source": (
                    "Natural Earth 1:50m Admin 0, version "
                    + manifest["naturalEarthVersion"]
                ),
                "projection": manifest["generatedOutput"]["worldProjection"],
                "features": world_features,
                "markers": world_markers,
            },
            "quizProjection": manifest["generatedOutput"]["quizProjection"],
            "quizRegions": quiz_regions,
            "silhouetteViewBox": manifest["generatedOutput"][
                "silhouetteViewBox"
            ],
            "silhouettes": silhouettes,
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
