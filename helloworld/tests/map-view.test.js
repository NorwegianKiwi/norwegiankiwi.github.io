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

test("calculates pointer geometry without browser globals", () => {
  assert.deepEqual(mapView.midpoint({ x: 2, y: 4 }, { x: 8, y: 10 }), { x: 5, y: 7 });
  assert.equal(mapView.distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
  assert.deepEqual(
    mapView.transformPoint({ x: 2, y: 3 }, { a: 2, b: 0, c: 0, d: 3, e: 5, f: 7 }),
    { x: 9, y: 16 },
  );
});
