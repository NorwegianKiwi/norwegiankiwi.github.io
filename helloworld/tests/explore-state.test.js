"use strict";

const test = require("node:test");

test("Explore state and map coverage", () => {
  const assert = require("node:assert/strict");
  const exploreState = require("../explore-state.js");
  global.window = global;
  require("../countries.js");
  require("../world-map.js");

  const regions = {
    no: "europe",
    se: "europe",
    dz: "africa",
    ke: "africa",
    jp: "asia-east",
  };
  const regionForCode = (code) => regions[code] ?? null;

  assert.deepEqual(exploreState.uniqueCodes(["no", "se", "no", null]), ["no", "se"]);
  assert.deepEqual(
    exploreState.sortCodes(["z", "a", "b", "a"], (code) => ({ a: "Alfa", b: "Bravo", z: "Zulu" })[code], "en"),
    ["a", "b", "z"],
  );
  assert.equal(exploreState.initialExtent(["no", "se"], regionForCode), "europe");
  assert.equal(exploreState.initialExtent(["dz", "ke"], regionForCode), "africa");
  assert.equal(exploreState.initialExtent(["no", "jp"], regionForCode), "world");
  assert.equal(exploreState.initialExtent([], regionForCode), "world");

  assert.equal(exploreState.zoomInExtent("world", "europe"), "europe");
  assert.equal(exploreState.zoomInExtent("world", "africa"), "africa");
  assert.equal(exploreState.zoomInExtent("africa", "africa"), "africa");
  assert.equal(exploreState.zoomInExtent("world", null), "world");
  assert.equal(exploreState.zoomOutExtent("africa"), "world");
  assert.equal(exploreState.zoomOutExtent("europe"), "world");
  assert.equal(exploreState.zoomOutExtent("world"), "world");

  assert.equal(exploreState.extentForSelection("world", "europe"), "world");
  assert.equal(exploreState.extentForSelection("europe", "europe"), "europe");
  assert.equal(
    exploreState.extentForSelection("europe", "asia-east"),
    "asia-east",
  );
  assert.equal(exploreState.extentForSelection("africa", "europe"), "europe");
  assert.equal(exploreState.extentForSelection("europe", null), "europe");

  const countryCodes = new Set(
    global.GEOGRAFI_QUIZ_DATA.places.map((country) => country.code),
  );
  const worldGeometryCodes = new Set(
    global.GEOGRAFI_QUIZ_MAP_DATA.features
      .map((feature) => feature.code)
      .filter((code) => countryCodes.has(code)),
  );
  const worldMarkerCodes = new Set(
    global.GEOGRAFI_QUIZ_MAP_DATA.markers.map((marker) => marker.code),
  );
  assert.equal(countryCodes.size, 227);
  for (const code of countryCodes) {
    assert.ok(
      worldGeometryCodes.has(code) || worldMarkerCodes.has(code),
      `World map is missing ${code}`,
    );
  }
});
