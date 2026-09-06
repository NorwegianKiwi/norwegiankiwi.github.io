"""Shared-boundary regression tests; no source download or GIS dependencies."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
import generate_map_data as maps


def feature(code, *rings):
    return {'code': code, 'name': code, 'rings': list(rings)}


def rotate(ring, offset):
    points = ring[:-1]
    points = points[offset:] + points[:offset]
    return points + points[:1]


def edges(ring):
    points = [tuple(float(maps.format_number(value)) for value in point) for point in ring]
    return {tuple(sorted((a, b))) for a, b in zip(points, points[1:]) if a != b}


def boundary(ring):
    return {edge for edge in edges(ring) if all(abs(point[0]) < 1 for point in edge)}


class SharedBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.shared = [(0, 0)] + [(0.35 if y % 3 else -0.25, y) for y in range(1, 20)] + [(0, 20)]
        self.left = self.shared + [(-10, 20), (-10, 0), self.shared[0]]
        self.right = self.shared[::-1] + [(10, 0), (10, 20), self.shared[-1]]

    def mesh(self, left=None, right=None):
        return maps.simplify_feature_rings([
            feature('a', left or self.left), feature('b', right or self.right)
        ], 0.6)

    def test_jagged_border_is_reused_and_reduced_after_rounding(self):
        a, b = self.mesh()
        shared_a = boundary(a['rings'][0])
        self.assertEqual(shared_a, boundary(b['rings'][0]))
        self.assertLess(len(shared_a), len(self.shared) - 1)
        self.assertTrue(shared_a)

    def test_ring_start_direction_and_feature_order_do_not_change_edges(self):
        baseline = self.mesh()
        variants = self.mesh(rotate(self.left, 7)[::-1], rotate(self.right, 13))
        reversed_features = maps.simplify_feature_rings([
            feature('b', self.right), feature('a', self.left)
        ], 0.6)[::-1]
        for expected, changed, reordered in zip(baseline, variants, reversed_features):
            self.assertEqual(edges(expected['rings'][0]), edges(changed['rings'][0]))
            self.assertEqual(edges(expected['rings'][0]), edges(reordered['rings'][0]))

    def test_three_country_junction_survives(self):
        junction = self.shared[10]
        lower = self.shared[:11][::-1] + [(10, 0), (10, 10), junction]
        upper = self.shared[10:][::-1] + [(10, 10), (10, 20), self.shared[-1]]
        a, b, c = maps.simplify_feature_rings([
            feature('a', self.left), feature('b', lower), feature('c', upper)
        ], 0.6)
        for item in (a, b, c):
            self.assertIn(junction, item['rings'][0])
        self.assertEqual(boundary(a['rings'][0]), boundary(b['rings'][0]) | boundary(c['rings'][0]))

    def test_enclave_hole_closed_ring_and_island_stay_intact(self):
        outer = [(-20, -20), (20, -20), (20, 30), (-20, 30), (-20, -20)]
        island = [(40, 0), (41, 1), (42, 0), (40, 0)]
        a, b = maps.simplify_feature_rings([
            feature('a', outer, self.left[::-1], island),
            feature('b', rotate(self.left, 5)),
        ], 0.6)
        self.assertEqual(len(a['rings']), 3)
        self.assertEqual(edges(a['rings'][1]), edges(b['rings'][0]))
        self.assertEqual(edges(a['rings'][2]), edges(island))
        for item in (a, b):
            for ring in item['rings']:
                self.assertEqual(ring[0], ring[-1])
                self.assertGreaterEqual(len(set(ring)), 3)

    def test_background_clipping_preserves_interior_shared_border(self):
        mesh = self.mesh()
        active, _, _ = maps.build_active_features(mesh, {}, {'a'})
        background = maps.build_background_features(mesh, {}, {'a'}, (-12, -2, 17, 24))
        self.assertEqual(len(active), 1)
        self.assertEqual(len(background), 1)
        clipped = maps.clip_projected_ring_to_rectangle(mesh[1]['rings'][0], (-12, -2, 17, 24))
        self.assertEqual(boundary(mesh[0]['rings'][0]), boundary(clipped))
        self.assertEqual(background[0]['path'], maps.path_from_rings([clipped]))
        self.assertIn('cropPath', background[0])
        self.assertNotIn('cropPath', active[0])

    def test_projection_noise_is_normalized_but_distinct_edges_are_not_snapped(self):
        noisy = [(x + 1e-11, y) for x, y in self.right]
        a, b = self.mesh(right=noisy)
        self.assertEqual(boundary(a['rings'][0]), boundary(b['rings'][0]))
        shifted = [(x + 0.2, y) for x, y in self.right]
        a, b = self.mesh(right=shifted)
        self.assertNotEqual(boundary(a['rings'][0]), boundary(b['rings'][0]))

    def test_world_projection_uses_shared_mesh(self):
        actual = maps.project_feature_rings([
            feature('a', self.left), feature('b', self.right)
        ], lambda x, y: (x, y), lambda point: point, 0.6)
        expected = self.mesh()
        self.assertEqual([item['path'] for item in actual], [maps.path_from_rings(item['rings']) for item in expected])

    def test_regional_projection_includes_active_and_background_in_one_mesh(self):
        projected = maps.project_region_features(
            [feature('a', self.left)], [feature('b', self.right)], {'a'},
            (-15, -5, 15, 25), 0, lambda x, y: (x / 100, y / 100),
            lambda point: (point[0] * 100, point[1] * 100), set(),
        )
        a, b = maps.simplify_feature_rings(projected, 0.6)
        self.assertEqual(boundary(a['rings'][0]), boundary(b['rings'][0]))


class GeneratedBorderTests(unittest.TestCase):
    def test_known_neighbours_share_serialized_segments(self):
        data = maps.load_generated_map()

        def country_edges(features, code):
            result = set()
            for item in features:
                if item['code'] != code:
                    continue
                for ring in item['path'].split('M')[1:]:
                    points = [tuple(map(float, point.split(',')))
                              for point in ring.rstrip('Z').split()]
                    result.update(edges(points + points[:1]))
            return result

        cases = {
            'world': [('no', 'se'), ('br', 'bo')],
            'europe': [('no', 'se'), ('no', 'fi'), ('ch', 'li'), ('at', 'li'),
                       ('fr', 'mc'), ('it', 'sm'), ('es', 'ad'), ('no', 'ru')],
            'africa': [('za', 'ls')],
            'asia-west': [('il', 'ps')],
            'asia-east': [('bn', 'my'), ('hk', 'cn')],
            'oceania': [('id', 'pg')],
            'north-central-america': [('us', 'mx')],
            'south-america': [('br', 'bo')],
            'caribbean': [('ht', 'do')],
        }
        for region, pairs in cases.items():
            view = data if region == 'world' else data['quizRegions'][region]
            features = view['features'] + view.get('backgroundFeatures', [])
            for first, second in pairs:
                with self.subTest(region=region, neighbours=(first, second)):
                    self.assertTrue(country_edges(features, first) & country_edges(features, second))


if __name__ == '__main__':
    unittest.main()
