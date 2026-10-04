"""Maritime selection, projection and compatibility contracts without downloads."""
import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
import generate_map_data as maps
from map_maintenance import load_generated_map, load_manifest, load_countries, validate_maritime_zones


class MaritimeTests(unittest.TestCase):
    def setUp(self):
        self.settings = {'territoryCodes': {'KIR': 'ki', 'HND': 'hn'}, 'includedCodes': ['ki']}
        self.ring = [(175, -2), (175, 2), (180, 2), (180, -2), (175, -2)]
        self.row = {'MRGID': '1', 'ISO_TER1': 'KIR', 'POL_TYPE': '200NM'}
        self.shape = {'rings': [self.ring]}

    def test_territory_mapping_and_shared_areas(self):
        shared = dict(self.row, MRGID='2', ISO_TER1='HND', ISO_TER2='KIR', POL_TYPE='Joint regime')
        rows = [self.row, shared, dict(shared, MRGID='3', POL_TYPE='Overlapping claim')]
        zones = maps.select_maritime_features(rows, [self.shape] * 3, self.settings)
        self.assertEqual(zones[0]['code'], 'ki')
        for zone in zones[1:]:
            self.assertIsNone(zone['code'])
            self.assertEqual(zone['codes'], ['hn', 'ki'])

    def test_missing_ambiguous_or_invalid_source_fails(self):
        with self.assertRaises(ValueError):
            maps.select_maritime_features([], [], self.settings)
        with self.assertRaises(ValueError):
            maps.select_maritime_features([dict(self.row, ISO_TER2='HND')], [self.shape], self.settings)
        with self.assertRaises(ValueError):
            maps.select_maritime_features([self.row], [{'rings': [[(0, 0), (1, 1), (2, 0)]]}], self.settings)

    def test_seam_edges_do_not_become_visible_borders(self):
        lines = maps.maritime_outline_lines(self.ring, self.ring)
        edges = [(a, b) for line in lines for a, b in zip(line, line[1:])]
        self.assertNotIn(((180, 2), (180, -2)), edges)
        self.assertEqual(len(edges), 3)
        ordinary = [(10, 0), (11, 0), (11, 1), (10, 0)]
        self.assertEqual(maps.maritime_outline_lines(ordinary, ordinary), [ordinary])

    def test_projection_preserves_existing_data_holes_and_pacific_components(self):
        base = load_generated_map()
        manifest = load_manifest()
        before = copy.deepcopy(base)
        other = [(-180, -2), (-180, 2), (-175, 2), (-175, -2), (-180, -2)]
        hole = [(176, 0), (176.1, 0), (176.1, .1), (176, 0)]
        features = maps.select_maritime_features([self.row], [{'rings': [self.ring, other, hole]}], self.settings)
        views = maps.add_maritime_zones(base['quizRegions'], features, manifest, load_countries())
        self.assertEqual(base, before)
        for key, view in views.items():
            self.assertEqual({k: v for k, v in view.items() if k != 'maritimeZones'},
                             {k: v for k, v in before['quizRegions'][key].items() if k != 'maritimeZones'})
        zone = views['oceania']['maritimeZones'][0]
        self.assertEqual(zone['path'].count('Z'), 3)
        # Removing a hole must leave the outline identical but change the fill.
        exterior_features = maps.select_maritime_features(
            [self.row], [{'rings': [self.ring, other]}], self.settings)
        exterior_zone = maps.add_maritime_zones(
            base['quizRegions'], exterior_features, manifest, load_countries()
        )['oceania']['maritimeZones'][0]
        self.assertEqual(zone['outlinePath'], exterior_zone['outlinePath'])
        self.assertNotEqual(zone['path'], exterior_zone['path'])
        # Both exteriors survive: the seam splits one into two open lines.
        self.assertEqual(zone['outlinePath'].count('M'), 3)
        self.assertNotIn('nan', zone['path'].lower())
        project = maps.regional_projection(180, 0)
        self.assertLess(abs(project(179, 0)[0] - project(-179, 0)[0]), .04)
        candidate = maps.candidate_from_existing(base, views)
        for key in ('features', 'markers', 'viewBox', 'source', 'projection'):
            self.assertEqual(candidate['base'][key], base[key])
        for key in ('silhouettes', 'silhouetteCapitals', 'silhouetteViewBox'):
            self.assertEqual(candidate[key], base[key])

    def test_winding_survives_longitude_seam(self):
        exterior = [(179, -2), (179, 2), (-179, 2), (-179, -2), (179, -2)]
        self.assertTrue(maps.maritime_ring_is_exterior(exterior))
        self.assertFalse(maps.maritime_ring_is_exterior(list(reversed(exterior))))
        self.assertTrue(maps.maritime_ring_is_exterior(self.ring))

    def test_committed_coverage_and_kiribati_groups(self):
        data, manifest, countries = load_generated_map(), load_manifest(), load_countries()
        self.assertEqual(validate_maritime_zones(data, manifest, countries), [])
        zones = [z for view in data['quizRegions'].values() for z in view.get('maritimeZones', [])]
        self.assertEqual(len({z['code'] for z in zones if z['code']}), 44)
        self.assertEqual({z['sourceId'] for z in zones if z['code'] == 'ki'}, {'8450', '8441', '8488'})
        shared = next(z for z in zones if z['sourceId'] == '48972')
        self.assertIsNone(shared['code'])
        self.assertEqual(shared['codes'], ['hn', 'ky'])
        self.assertNotIn('maritimeZones', data)

    def test_expanded_mapping_keeps_explicit_claims_neutral(self):
        settings = load_manifest()["maritimeZones"]
        rows = []
        for iso, code in settings["territoryCodes"].items():
            if code in settings["includedCodes"]:
                rows.append(dict(self.row, MRGID=str(len(rows) + 1), ISO_TER1=iso))
        # The source's territory fields alone omit the relevant claimants.
        rows.extend([
            dict(self.row, MRGID="48944", ISO_TER1="MYT", ISO_TER2="MYT", POL_TYPE="Overlapping claim"),
            dict(self.row, MRGID="48946", ISO_TER1="", POL_TYPE="Overlapping claim"),
        ])
        result = maps.select_maritime_features(rows, [self.shape] * len(rows), settings)
        self.assertEqual(
            {feature["code"] for feature in result if feature["code"]},
            set(settings["includedCodes"]),
        )
        claims = {feature["sourceId"]: feature for feature in result if feature["code"] is None}
        self.assertEqual(claims["48944"]["codes"], ["km", "yt"])
        self.assertEqual(claims["48946"]["codes"], ["fr", "mg", "mu"])

    def test_validator_rejects_shared_selection_and_missing_coverage(self):
        data, manifest, countries = load_generated_map(), load_manifest(), load_countries()
        data['quizRegions']['oceania']['maritimeZones'] = []
        self.assertTrue(validate_maritime_zones(data, manifest, countries))
        data = load_generated_map()
        shared = next(z for z in data['quizRegions']['caribbean']['maritimeZones'] if z['type'] == 'Joint regime')
        shared['code'] = 'ky'
        self.assertTrue(validate_maritime_zones(data, manifest, countries))


if __name__ == '__main__':
    unittest.main()
