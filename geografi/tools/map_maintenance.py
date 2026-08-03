#!/usr/bin/env python3
"""Audit and fetch the source data used by Hello World! maps.

This tool intentionally uses only the Python standard library. It does not run
in the website and does not add a runtime or build dependency.
"""

import argparse
import hashlib
import json
import re
import struct
import sys
import urllib.request
import zipfile
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = Path(__file__).with_name("map-sources.json")
VALID_REGIONS = {
    "europe",
    "north-west-africa",
    "east-south-africa",
    "west-central-asia",
    "east-south-asia",
    "oceania",
    "north-central-america",
    "south-america",
    "caribbean",
}
EXPECTED_REGION_COUNTS = {
    "europe": 44,
    "north-west-africa": 26,
    "east-south-africa": 28,
    "west-central-asia": 24,
    "east-south-asia": 25,
    "oceania": 14,
    "north-central-america": 10,
    "south-america": 12,
    "caribbean": 13,
}


def valid_silhouette_frame(frame):
    return (
        isinstance(frame, list)
        and len(frame) == 4
        and all(isinstance(value, (int, float)) for value in frame)
        and frame[0] >= 0
        and frame[1] >= 0
        and frame[2] > 0
        and frame[3] > 0
        and frame[0] + frame[2] <= 100
        and frame[1] + frame[3] <= 100
    )


def load_manifest():
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def load_countries():
    text = (ROOT / "countries.js").read_text(encoding="utf-8")
    pattern = re.compile(
        r'^\s*\{\s*code:\s*"([a-z]{2})",\s*'
        r'region:\s*"([^"]+)",\s*name:\s*\{\s*'
        r'nb:\s*"[^"]+",\s*en:\s*"([^"]+)"\s*\}',
        re.MULTILINE,
    )
    rows = [
        {
            "code": match.group(1),
            "region": match.group(2),
            "name": match.group(3),
        }
        for match in pattern.finditer(text)
    ]
    if len(rows) != 196:
        raise ValueError(
            f"Fant {len(rows)} landrader i countries.js; forventet 196. "
            "Oppdater parseren hvis filformatet bevisst er endret."
        )
    return rows


def decode_assignment(text, prefix):
    start = text.find(prefix)
    if start < 0:
        raise ValueError(f"Fant ikke {prefix!r} i world-map.js")
    start += len(prefix)
    return json.JSONDecoder().raw_decode(text[start:])[0]


def load_generated_map(path=None):
    map_path = path or ROOT / "world-map.js"
    text = map_path.read_text(encoding="utf-8")
    data = decode_assignment(text, "const data = ")
    data["quizProjection"] = decode_assignment(text, "data.quizProjection = ")
    data["quizRegions"] = decode_assignment(text, "data.quizRegions = ")
    data["overviewRegions"] = decode_assignment(
        text, "data.overviewRegions = "
    ) if "data.overviewRegions = " in text else {}
    data["silhouetteViewBox"] = decode_assignment(
        text, "data.silhouetteViewBox = "
    )
    data["silhouettes"] = decode_assignment(text, "data.silhouettes = ")
    return data


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_view_box(value):
    if not isinstance(value, str):
        return None
    if not re.fullmatch(
        r"-?\d+(?:\.\d+)?(?:\s+-?\d+(?:\.\d+)?){3}", value
    ):
        return None
    return tuple(float(part) for part in value.split())


def find_dataset_file(directory, stem, suffix):
    direct = directory / f"{stem}{suffix}"
    if direct.exists():
        return direct
    matches = list(directory.rglob(f"{stem}{suffix}"))
    if len(matches) != 1:
        raise FileNotFoundError(
            f"Fant ikke entydig {stem}{suffix} under {directory}"
        )
    return matches[0]


def read_dbf(path):
    raw = path.read_bytes()
    record_count = struct.unpack_from("<I", raw, 4)[0]
    header_length = struct.unpack_from("<H", raw, 8)[0]
    record_length = struct.unpack_from("<H", raw, 10)[0]
    fields = []
    position = 32
    offset = 1
    while raw[position] != 0x0D:
        name = raw[position : position + 11].split(b"\0", 1)[0].decode("ascii")
        length = raw[position + 16]
        fields.append((name, offset, length))
        offset += length
        position += 32

    rows = []
    for index in range(record_count):
        start = header_length + index * record_length
        record = raw[start : start + record_length]
        if not record or record[0:1] == b"*":
            continue
        rows.append(
            {
                name: record[field_offset : field_offset + length]
                .decode("utf-8", errors="replace")
                .strip(" \0")
                for name, field_offset, length in fields
            }
        )
    return rows


def code_for_source_row(row, manifest):
    override = manifest["countryCodeOverrides"].get(row.get("ADMIN"))
    if override:
        return override
    code = row.get(manifest["countryCodeField"], "").lower()
    return code if re.fullmatch(r"[a-z]{2}", code) else None


def validate_local_data(map_path=None):
    manifest = load_manifest()
    countries = load_countries()
    map_data = load_generated_map(map_path)
    errors = []
    warnings = []

    codes = [country["code"] for country in countries]
    region_for_code = {
        country["code"]: country["region"] for country in countries
    }
    duplicate_codes = sorted(
        code for code, count in Counter(codes).items() if count > 1
    )
    if duplicate_codes:
        errors.append(f"Dupliserte landkoder: {', '.join(duplicate_codes)}")

    invalid_regions = sorted(
        {country["region"] for country in countries} - VALID_REGIONS
    )
    if invalid_regions:
        errors.append(f"Ugyldige regioner: {', '.join(invalid_regions)}")

    flag_codes = {path.stem for path in (ROOT / "flags").glob("*.svg")}
    missing_flags = sorted(set(codes) - flag_codes)
    extra_flags = sorted(flag_codes - set(codes))
    if missing_flags:
        errors.append(f"Manglende flagg: {', '.join(missing_flags)}")
    if extra_flags:
        errors.append(f"Ekstra flagg: {', '.join(extra_flags)}")

    silhouettes = set(map_data["silhouettes"])
    missing_silhouettes = sorted(set(codes) - silhouettes)
    extra_silhouettes = sorted(silhouettes - set(codes))
    if missing_silhouettes:
        errors.append(
            f"Manglende silhuetter: {', '.join(missing_silhouettes)}"
        )
    if extra_silhouettes:
        warnings.append(
            f"Silhuetter uten quizland: {', '.join(extra_silhouettes)}"
        )
    for code, silhouette in map_data["silhouettes"].items():
        path = silhouette.get("path")
        minor_path = silhouette.get("minorPath")
        markers = silhouette.get("markers", [])
        if not path and not minor_path and not markers:
            errors.append(f"{code} har tom silhuett")
        if path and markers:
            errors.append(f"{code} har både silhuettgeometri og markører")
        if markers and not minor_path:
            errors.append(f"{code} har markører uten detaljgeometri")
        if not path and len(markers) > 8:
            errors.append(f"{code} har mer enn åtte silhuettmarkører")
        if silhouette.get("corner") != "bottom-left":
            errors.append(f"{code} har ikke silhuettvindu nederst til venstre")
        expanded = silhouette.get("expanded")
        silhouette_override = manifest.get("silhouetteOverrides", {}).get(
            code, {}
        )
        force_compact_markers = silhouette_override.get(
            "forceCompactMarkers", False
        )
        if not isinstance(force_compact_markers, bool):
            errors.append(f"{code} har ugyldig forceCompactMarkers-verdi")
        if force_compact_markers and (path or not markers or not minor_path):
            errors.append(
                f"{code} bruker ikke tvungne kompaktmarkører som forventet"
            )
        expected_expanded = bool(
            silhouette_override.get("insets")
            or silhouette_override.get("division")
        )
        if bool(expanded) != expected_expanded:
            errors.append(f"{code} har uventet forstørret silhuettkomposisjon")
        if expanded:
            insets = expanded.get("insets", [])
            if (
                not expanded.get("path")
                and not expanded.get("minorPath")
                and not insets
            ):
                errors.append(f"{code} har tom hovedform i forstørret silhuett")
            if not isinstance(insets, list):
                errors.append(f"{code} mangler innfellinger")
                continue
            if silhouette_override.get("insets") and not insets:
                errors.append(f"{code} mangler innfellinger")
            if bool(expanded.get("divisionPath")) != bool(
                silhouette_override.get("division")
            ):
                errors.append(f"{code} har uventet delelinje")
            for index, inset in enumerate(insets, start=1):
                if not inset.get("path") and not inset.get("minorPath"):
                    errors.append(f"{code} har tom innfelling {index}")
                frame = inset.get("frame")
                if not valid_silhouette_frame(frame):
                    errors.append(f"{code} har ugyldig ramme for innfelling {index}")
                manifest_insets = silhouette_override.get("insets", [])
                manifest_inset = (
                    manifest_insets[index - 1]
                    if index <= len(manifest_insets)
                    else {}
                )
                connect_to_source = manifest_inset.get(
                    "connectToSource", False
                )
                if not isinstance(connect_to_source, bool):
                    errors.append(
                        f"{code} har ugyldig connectToSource-verdi i "
                        f"innfelling {index}"
                    )
                source_frame = inset.get("sourceFrame")
                if bool(source_frame) != connect_to_source:
                    errors.append(
                        f"{code} har uventet kilderamme i innfelling {index}"
                    )
                if source_frame and not valid_silhouette_frame(source_frame):
                    errors.append(
                        f"{code} har ugyldig kilderamme i innfelling {index}"
                    )
                main_frame = silhouette_override.get("expandedMainFrame")
                if (
                    source_frame
                    and valid_silhouette_frame(main_frame)
                    and (
                        source_frame[0] < main_frame[0]
                        or source_frame[1] < main_frame[1]
                        or source_frame[0] + source_frame[2]
                        > main_frame[0] + main_frame[2]
                        or source_frame[1] + source_frame[3]
                        > main_frame[1] + main_frame[3]
                    )
                ):
                    errors.append(
                        f"{code} har kilderamme utenfor hovedrammen i "
                        f"innfelling {index}"
                    )

    untouched_silhouette_codes = set(codes) - set(
        manifest.get("silhouetteOverrides", {})
    )
    if map_path:
        checked_in = load_generated_map()
        changed_without_override = sorted(
            code
            for code in untouched_silhouette_codes
            if checked_in["silhouettes"].get(code)
            != map_data["silhouettes"].get(code)
        )
        if changed_without_override:
            errors.append(
                "Silhuetter endret uten redaksjonell regel: "
                + ", ".join(changed_without_override)
            )

    world_geometry = {
        feature["code"]
        for feature in map_data["features"]
        if feature.get("code")
    }
    world_geometry.update(
        marker["code"] for marker in map_data["markers"] if marker.get("code")
    )
    missing_world_geometry = sorted(set(codes) - world_geometry)
    if missing_world_geometry:
        errors.append(
            "Land uten polygon eller markør på verdenskartet: "
            + ", ".join(missing_world_geometry)
        )

    expected_quiz_regions = set(manifest["quizRegions"])
    actual_quiz_regions = set(map_data["quizRegions"])
    if actual_quiz_regions != expected_quiz_regions:
        errors.append(
            "Regionkart avviker fra manifestet: "
            f"forventet {sorted(expected_quiz_regions)}, "
            f"fant {sorted(actual_quiz_regions)}"
        )

    for region, view in map_data["quizRegions"].items():
        background_features = view.get("backgroundFeatures")
        if not isinstance(background_features, list):
            errors.append(f"{region} mangler backgroundFeatures")
            background_features = []
        if not parse_view_box(view.get("bleedViewBox")):
            errors.append(f"{region} mangler gyldig bleedViewBox")
        geometry_codes = {
            feature["code"]
            for feature in view["features"]
            if feature.get("code")
        }
        geometry_codes.update(
            marker["code"] for marker in view["markers"] if marker.get("code")
        )
        expected_codes = {
            country["code"]
            for country in countries
            if country["region"] == region
        }
        missing = sorted(expected_codes - geometry_codes)
        if missing:
            errors.append(
                f"{region} mangler quizgeometri for: {', '.join(missing)}"
            )
        unexpected_features = sorted(
            {
                feature.get("code")
                for feature in view["features"]
                if feature.get("code") not in expected_codes
            },
            key=lambda value: value or "",
        )
        unexpected_markers = sorted(
            {
                marker.get("code")
                for marker in view["markers"]
                if marker.get("code") not in expected_codes
            },
            key=lambda value: value or "",
        )
        if unexpected_features or unexpected_markers:
            errors.append(
                f"{region} har ikke-aktive objekter i forgrunnslaget: "
                + ", ".join(
                    str(code)
                    for code in unexpected_features + unexpected_markers
                )
            )
        invalid_marker_sizes = sorted(
            {
                marker.get("code")
                for marker in view["markers"]
                if not isinstance(marker.get("readableSize"), (int, float))
                or marker["readableSize"] < 0
            },
            key=lambda value: value or "",
        )
        if invalid_marker_sizes:
            errors.append(
                f"{region} har markører uten gyldig readableSize: "
                + ", ".join(str(code) for code in invalid_marker_sizes)
            )
        cropped_active = sorted(
            feature["code"]
            for feature in view["features"]
            if feature.get("cropPath")
        )
        if cropped_active:
            errors.append(
                f"{region} beskjærer aktive quizland: "
                + ", ".join(cropped_active)
            )
        active_background = sorted(
            {
                feature["code"]
                for feature in background_features
                if region_for_code.get(feature.get("code")) == region
            }
        )
        if active_background:
            errors.append(
                f"{region} har aktive quizland i bakgrunnslaget: "
                + ", ".join(active_background)
            )
        camera = parse_view_box(view.get("viewBox"))
        bleed = parse_view_box(view.get("bleedViewBox"))
        if camera and bleed:
            camera_x, camera_y, camera_width, camera_height = camera
            bleed_x, bleed_y, bleed_width, bleed_height = bleed
            tolerance = 0.2
            if not (
                bleed_x <= camera_x + tolerance
                and bleed_y <= camera_y + tolerance
                and bleed_x + bleed_width
                >= camera_x + camera_width - tolerance
                and bleed_y + bleed_height
                >= camera_y + camera_height - tolerance
                and bleed_width >= camera_height * 2.4 - tolerance
                and bleed_height >= camera_width / 0.75 - tolerance
            ):
                errors.append(f"{region} har for lite automatisk bleed-område")
            camera_right = camera_x + camera_width
            camera_bottom = camera_y + camera_height
            outside_camera = set()
            for feature in view["features"]:
                coordinates = [
                    float(value)
                    for value in re.findall(
                        r"-?\d+(?:\.\d+)?", feature["path"]
                    )
                ]
                if any(
                    x < camera_x - tolerance
                    or x > camera_right + tolerance
                    or y < camera_y - tolerance
                    or y > camera_bottom + tolerance
                    for x, y in zip(coordinates[::2], coordinates[1::2])
                ):
                    outside_camera.add(feature.get("code"))
            for marker in view["markers"]:
                if not (
                    camera_x - tolerance
                    <= marker["x"]
                    <= camera_right + tolerance
                    and camera_y - tolerance
                    <= marker["y"]
                    <= camera_bottom + tolerance
                ):
                    outside_camera.add(marker.get("code"))
            if outside_camera:
                errors.append(
                    f"{region} har aktive land utenfor kameraet: "
                    + ", ".join(sorted(outside_camera))
                )

    expected_overviews = set(manifest.get("overviewRegions", {}))
    overview_regions = map_data.get("overviewRegions", {})
    actual_overviews = set(overview_regions)
    if actual_overviews != expected_overviews:
        errors.append(
            "Oversiktskart avviker fra manifestet: "
            f"forventet {sorted(expected_overviews)}, "
            f"fant {sorted(actual_overviews)}"
        )

    for overview, settings in manifest.get("overviewRegions", {}).items():
        view = overview_regions.get(overview)
        if not view:
            continue
        if not isinstance(view.get("backgroundFeatures"), list):
            errors.append(f"{overview} mangler backgroundFeatures")
        if not parse_view_box(view.get("bleedViewBox")):
            errors.append(f"{overview} mangler gyldig bleedViewBox")
        active_overview_background = sorted(
            {
                feature["code"]
                for feature in view.get("backgroundFeatures", [])
                if region_for_code.get(feature.get("code"))
                in set(settings["memberRegions"])
            }
        )
        if active_overview_background:
            errors.append(
                f"{overview} har aktive land i bakgrunnslaget: "
                + ", ".join(active_overview_background)
            )
        geometry_codes = {
            feature["code"]
            for feature in view["features"]
            if feature.get("code")
        }
        geometry_codes.update(
            marker["code"] for marker in view["markers"] if marker.get("code")
        )
        member_regions = set(settings["memberRegions"])
        expected_codes = {
            country["code"]
            for country in countries
            if country["region"] in member_regions
        }
        missing = sorted(expected_codes - geometry_codes)
        if missing:
            errors.append(
                f"{overview} mangler oversiktsgeometri for: {', '.join(missing)}"
            )
        unexpected = sorted(
            {
                item.get("code")
                for item in view["features"] + view["markers"]
                if item.get("code") not in expected_codes
            },
            key=lambda value: value or "",
        )
        if unexpected:
            errors.append(
                f"{overview} har ikke-aktive objekter i forgrunnslaget: "
                + ", ".join(str(code) for code in unexpected)
            )
        invalid_marker_sizes = sorted(
            {
                marker.get("code")
                for marker in view["markers"]
                if not isinstance(marker.get("readableSize"), (int, float))
                or marker["readableSize"] < 0
            },
            key=lambda value: value or "",
        )
        if invalid_marker_sizes:
            errors.append(
                f"{overview} har markører uten gyldig readableSize: "
                + ", ".join(str(code) for code in invalid_marker_sizes)
            )
        cropped = sorted(
            feature["code"]
            for feature in view["features"]
            if feature.get("cropPath")
        )
        if cropped:
            errors.append(
                f"{overview} beskjærer aktive land: " + ", ".join(cropped)
            )
        camera = parse_view_box(view.get("viewBox"))
        bleed = parse_view_box(view.get("bleedViewBox"))
        if camera and bleed:
            camera_x, camera_y, camera_width, camera_height = camera
            bleed_x, bleed_y, bleed_width, bleed_height = bleed
            tolerance = 0.2
            if not (
                bleed_x <= camera_x + tolerance
                and bleed_y <= camera_y + tolerance
                and bleed_x + bleed_width
                >= camera_x + camera_width - tolerance
                and bleed_y + bleed_height
                >= camera_y + camera_height - tolerance
                and bleed_width >= camera_height * 2.4 - tolerance
                and bleed_height >= camera_width / 0.75 - tolerance
            ):
                errors.append(
                    f"{overview} har for lite automatisk bleed-område"
                )
            camera_right = camera_x + camera_width
            camera_bottom = camera_y + camera_height
            outside_camera = set()
            for feature in view["features"]:
                coordinates = [
                    float(value)
                    for value in re.findall(
                        r"-?\d+(?:\.\d+)?", feature["path"]
                    )
                ]
                if any(
                    x < camera_x - tolerance
                    or x > camera_right + tolerance
                    or y < camera_y - tolerance
                    or y > camera_bottom + tolerance
                    for x, y in zip(coordinates[::2], coordinates[1::2])
                ):
                    outside_camera.add(feature.get("code"))
            for marker in view["markers"]:
                if not (
                    camera_x - tolerance
                    <= marker["x"]
                    <= camera_right + tolerance
                    and camera_y - tolerance
                    <= marker["y"]
                    <= camera_bottom + tolerance
                ):
                    outside_camera.add(marker.get("code"))
            if outside_camera:
                errors.append(
                    f"{overview} har aktive land utenfor kameraet: "
                    + ", ".join(sorted(outside_camera))
                )

    source = map_data.get("source", "")
    version = manifest["naturalEarthVersion"]
    if version not in source:
        errors.append(
            f"world-map.js oppgir ikke manifestversjonen {version!r}: {source!r}"
        )
    if map_data.get("projection") != "Equal Earth":
        errors.append("Verdenskartets projeksjon er ikke Equal Earth")
    if map_data.get("quizProjection") != "Azimuthal equidistant":
        errors.append(
            "Kartquizens projeksjon er ikke Azimuthal equidistant"
        )

    region_counts = Counter(country["region"] for country in countries)
    if dict(region_counts) != EXPECTED_REGION_COUNTS:
        errors.append(
            "Uventede regiontall: "
            + ", ".join(
                f"{region}={region_counts[region]} "
                f"(forventet {EXPECTED_REGION_COUNTS[region]})"
                for region in sorted(EXPECTED_REGION_COUNTS)
                if region_counts[region] != EXPECTED_REGION_COUNTS[region]
            )
        )
    print(f"Land: {len(countries)} ({len(set(codes))} unike koder)")
    print(f"Flagg: {len(flag_codes)}")
    print(
        "Verdenskart: "
        f"{len(world_geometry & set(codes))} quizkoder med geometri/markør"
    )
    print(f"Silhuetter: {len(silhouettes)}")
    print(f"Oversiktskart: {len(actual_overviews)}")
    print(
        "Regioner: "
        + ", ".join(
            f"{region}={region_counts[region]}" for region in sorted(VALID_REGIONS)
        )
    )
    for warning in warnings:
        print(f"ADVARSEL: {warning}")
    for error in errors:
        print(f"FEIL: {error}", file=sys.stderr)
    if errors:
        return 1
    print("OK: lokale land-, flagg- og kartdata er innbyrdes konsistente.")
    return 0


def download_sources(directory):
    manifest = load_manifest()
    directory.mkdir(parents=True, exist_ok=True)
    for dataset in manifest["datasets"].values():
        target = directory / dataset["file"]
        if target.exists() and sha256(target) == dataset["sha256"]:
            print(f"OK: {target.name} finnes allerede og har riktig kontrollsum.")
        else:
            print(f"Laster ned {dataset['url']}")
            with urllib.request.urlopen(dataset["url"]) as response:
                target.write_bytes(response.read())
            actual = sha256(target)
            if actual != dataset["sha256"]:
                target.unlink(missing_ok=True)
                raise ValueError(
                    f"Feil SHA-256 for {dataset['file']}: {actual}"
                )
        extract_dir = directory / target.stem
        extract_dir.mkdir(exist_ok=True)
        with zipfile.ZipFile(target) as archive:
            archive.extractall(extract_dir)
    print(f"OK: kildene ligger i {directory}")


def audit_sources(directory):
    manifest = load_manifest()
    countries = load_countries()
    quiz_codes = {country["code"] for country in countries}
    errors = []

    for key, scale in (("countries50m", "50m"), ("countries10m", "10m")):
        dataset = manifest["datasets"][key]
        stem = Path(dataset["file"]).stem
        dbf = find_dataset_file(directory, stem, ".dbf")
        version_file = find_dataset_file(directory, stem, ".VERSION.txt")
        version_text = version_file.read_text(encoding="utf-8").strip()
        rows = read_dbf(dbf)
        source_codes = {
            code_for_source_row(row, manifest)
            for row in rows
            if code_for_source_row(row, manifest)
        }
        missing = sorted(quiz_codes - source_codes)
        print(
            f"{scale}: {len(rows)} Natural Earth-poster, "
            f"versjonsfil={version_text!r}"
        )
        if manifest["naturalEarthVersion"] not in version_text:
            errors.append(
                f"{scale}: versjonsfilen samsvarer ikke med manifestet"
            )
        if missing:
            errors.append(
                f"{scale}: quizkoder uten direkte polygon: {', '.join(missing)}"
            )

    tiny_dataset = manifest["datasets"]["tinyCountries50m"]
    tiny_stem = Path(tiny_dataset["file"]).stem
    tiny_rows = read_dbf(find_dataset_file(directory, tiny_stem, ".dbf"))
    tiny_codes = {
        code_for_source_row(row, manifest)
        for row in tiny_rows
        if code_for_source_row(row, manifest)
    }
    print(
        f"50m smålandspunkter: {len(tiny_rows)} poster, "
        f"{len(tiny_codes & quiz_codes)} quizkoder"
    )

    for error in errors:
        print(f"FEIL: {error}", file=sys.stderr)
    if errors:
        return 1
    print("OK: de nedlastede Natural Earth-kildene dekker alle quizland.")
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="Kontroller og hent kartkilder for Hello World!"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)
    validate = subparsers.add_parser(
        "validate", help="Kontroller checked-in data uten nettverk."
    )
    validate.add_argument(
        "--map-file",
        type=Path,
        help="Kontroller en kandidatfil i stedet for world-map.js.",
    )
    download = subparsers.add_parser(
        "download", help="Last ned og verifiser de låste kildene."
    )
    download.add_argument("directory", type=Path)
    audit = subparsers.add_parser(
        "audit-sources",
        help="Sammenlign utpakkede Natural Earth-data med countries.js.",
    )
    audit.add_argument("directory", type=Path)
    args = parser.parse_args()

    try:
        if args.command == "validate":
            return validate_local_data(args.map_file)
        if args.command == "download":
            download_sources(args.directory)
            return 0
        if args.command == "audit-sources":
            return audit_sources(args.directory)
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        print(f"FEIL: {error}", file=sys.stderr)
        return 1
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
