"""Halo adoption preserves geography while retiring display-only positions."""
import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import generate_map_data as maps
from map_maintenance import load_generated_map, load_manifest, validate_geometry_halos


class GeometryHaloTests(unittest.TestCase):
    def test_cleanup_preserves_geometry_and_is_idempotent(self):
        original = load_generated_map()
        legacy = copy.deepcopy(original)
        # Old metadata may be present at every silhouette layer.
        for view in legacy["quizRegions"].values():
            view["islandPositions"] = [{"id": "retired"}]
        for silhouette in legacy["silhouettes"].values():
            layers = [silhouette]
            if silhouette.get("expanded"):
                layers += [silhouette["expanded"], *silhouette["expanded"]["insets"]]
            for layer in layers:
                layer["islandPositions"] = [{"id": "retired"}]
        before = copy.deepcopy(legacy)
        result = maps.refresh_halo_data(legacy, load_manifest())
        self.assertEqual(legacy, before)
        normalized = {**result["base"], **{k: v for k, v in result.items() if k != "base"}}
        expected = copy.deepcopy(original)
        for view in expected["quizRegions"].values():
            view.pop("islandPositions", None)
        for shape in expected["silhouettes"].values():
            for layer in [shape, shape.get("expanded"), *shape.get("expanded", {}).get("insets", [])]:
                if layer is not None:
                    layer.pop("islandPositions", None)
        self.assertEqual(normalized, expected)
        self.assertEqual(maps.refresh_halo_data(normalized, load_manifest()), result)

    def test_covered_locators_are_removed_without_changing_world_or_other_places(self):
        data = load_generated_map()
        world_markers = copy.deepcopy(data["markers"])
        data["quizRegions"]["oceania"]["markers"] = [{"code": "tv"}, {"code": "nr"}]
        data["silhouettes"]["tv"]["markers"] = [{"x": 1, "y": 2}]
        result = maps.refresh_halo_data(data, load_manifest())
        self.assertEqual(result["quizRegions"]["oceania"]["markers"], [{"code": "nr"}])
        self.assertEqual(result["silhouettes"]["tv"]["markers"], [])
        self.assertEqual(result["base"]["markers"], world_markers)
        normalized = {**result["base"], **{k: v for k, v in result.items() if k != "base"}}
        self.assertEqual(validate_geometry_halos(normalized, load_manifest()), [])
        normalized["silhouettes"]["tv"]["markers"] = [{"x": 1, "y": 2}]
        self.assertTrue(validate_geometry_halos(normalized, load_manifest()))

    def test_overview_capital_uses_documented_geographic_anchor(self):
        feature = {"code": "tv", "name": "Tuvalu", "rings": [[(175, -10), (175, -5), (181, -5), (181, -10), (175, -10)]]}
        rule = load_manifest()["silhouetteOverrides"]["tv"]
        capitals = {"tv": [{"longitude": 179.2, "latitude": -8.5, "kind": "quiz"}]}
        output = maps.build_silhouette_capitals([feature], {"tv"}, capitals, {"tv": rule})
        projection = maps.silhouette_projection([{"ring": feature["rings"][0], "sourceName": "Tuvalu"}])
        anchor = rule["overviewCapitalAnchor"]
        x, y = maps.project_silhouette_ring([(anchor["longitude"], anchor["latitude"])], projection)[0]
        self.assertEqual(output["tv"], {"main": [{"x": round(x, 5), "y": round(y, 5), "kind": "quiz"}], "insets": []})


if __name__ == "__main__":
    unittest.main()
