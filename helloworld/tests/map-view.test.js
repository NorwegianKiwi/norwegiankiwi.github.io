"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const mapView = require("../map-view.js");

test("parses, serializes, and compares SVG view boxes", () => {
  const parsed = mapView.parseViewBox("10 20 300 150");
  assert.deepEqual(parsed, { x: 10, y: 20, width: 300, height: 150 });
  assert.equal(mapView.serializeViewBox(parsed), "10 20 300 150");
  assert.equal(mapView.viewBoxesEqual(parsed, { ...parsed, x: 10.005 }), true);
  assert.equal(mapView.viewBoxesEqual(parsed, { ...parsed, x: 10.02 }), false);
});

test("fits a view box without moving its center", () => {
  assert.deepEqual(
    mapView.fitViewBoxToAspect({ x: 0, y: 0, width: 100, height: 100 }, 2),
    { x: -50, y: 0, width: 200, height: 100 },
  );
  assert.deepEqual(
    mapView.fitViewBoxToAspect({ x: 0, y: 0, width: 100, height: 50 }, 1),
    { x: 0, y: -25, width: 100, height: 100 },
  );
});

test("clamps zoomed views to the base extent", () => {
  const base = { x: 0, y: 0, width: 100, height: 50 };
  const view = mapView.clampView({ x: -20, y: 40, width: 5, height: 5 }, base, 4);
  assert.deepEqual(view, { x: 0, y: 37.5, width: 25, height: 12.5 });
  assert.equal(mapView.zoomForViewport({ base, view: { ...base, width: 25 } }), 4);
});

test("frames nearby geometry with context and an eight-times zoom limit", () => {
  const base = { x: 0, y: 0, width: 100, height: 50 };
  assert.deepEqual(
    mapView.nearbyViewBox(base, { x: 40, y: 20, width: 10, height: 5 }),
    { x: 30, y: 15, width: 30, height: 15 },
  );
  assert.deepEqual(
    mapView.nearbyViewBox(base, { x: 50, y: 25, width: 0, height: 0 }),
    { x: 43.75, y: 21.875, width: 12.5, height: 6.25 },
  );
});

test("keeps large nearby targets regional and clamps edge targets to bleed", () => {
  const base = { x: 0, y: 0, width: 100, height: 50 };
  assert.deepEqual(
    mapView.nearbyViewBox(base, { x: 10, y: 10, width: 40, height: 20 }),
    base,
  );
  assert.deepEqual(
    mapView.nearbyViewBox(
      base,
      { x: -18, y: 20, width: 0, height: 0 },
      { x: -20, y: -10, width: 140, height: 70 },
    ),
    { x: -20, y: 16.875, width: 12.5, height: 6.25 },
  );
});

test("preserves the responsive base aspect in nearby views", () => {
  const fitted = mapView.fitViewBoxToAspect(
    { x: 0, y: 0, width: 100, height: 100 },
    2,
  );
  const nearby = mapView.nearbyViewBox(
    fitted,
    { x: 40, y: 40, width: 20, height: 10 },
    { x: -60, y: -20, width: 220, height: 140 },
  );
  assert.equal(nearby.width / nearby.height, 2);
  assert.deepEqual(nearby, { x: 20, y: 30, width: 60, height: 30 });
});

test("calculates pointer geometry without browser globals", () => {
  assert.deepEqual(mapView.midpoint({ x: 2, y: 4 }, { x: 8, y: 10 }), { x: 5, y: 7 });
  assert.equal(mapView.distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
  assert.deepEqual(
    mapView.transformPoint({ x: 2, y: 3 }, { a: 2, b: 0, c: 0, d: 3, e: 5, f: 7 }),
    { x: 9, y: 16 },
  );
});
