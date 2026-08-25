"use strict";

const assert = require("node:assert/strict");
const exploreState = require("../explore-state.js");
global.window = global;
require("../countries.js");
require("../world-map.js");

const regions = {
  no: "europe",
  se: "europe",
  dz: "north-west-africa",
  ke: "east-south-africa",
  jp: "east-south-asia",
};
const africa = new Set(["north-west-africa", "east-south-africa"]);
const regionForCode = (code) => regions[code] ?? null;

assert.deepEqual(exploreState.uniqueCodes(["no", "se", "no", null]), ["no", "se"]);
assert.deepEqual(
  exploreState.sortCodes(["z", "a", "b", "a"], (code) => ({ a: "Alfa", b: "Bravo", z: "Zulu" })[code], "en"),
  ["a", "b", "z"],
);
assert.equal(exploreState.initialExtent(["no", "se"], regionForCode, africa), "europe");
assert.equal(exploreState.initialExtent(["dz", "ke"], regionForCode, africa), "africa");
assert.equal(exploreState.initialExtent(["no", "jp"], regionForCode, africa), "world");
assert.equal(exploreState.initialExtent([], regionForCode, africa), "world");

assert.equal(exploreState.zoomInExtent("world", "europe", africa), "europe");
assert.equal(exploreState.zoomInExtent("world", "east-south-africa", africa), "africa");
assert.equal(exploreState.zoomInExtent("africa", "east-south-africa", africa), "east-south-africa");
assert.equal(exploreState.zoomInExtent("world", null, africa), "world");
assert.equal(exploreState.zoomOutExtent("east-south-africa", africa), "africa");
assert.equal(exploreState.zoomOutExtent("africa", africa), "world");
assert.equal(exploreState.zoomOutExtent("europe", africa), "world");
assert.equal(exploreState.zoomOutExtent("world", africa), "world");

assert.equal(exploreState.extentForSelection("world", "europe", africa), "world");
assert.equal(exploreState.extentForSelection("europe", "europe", africa), "europe");
assert.equal(
  exploreState.extentForSelection("europe", "east-south-asia", africa),
  "east-south-asia",
);
assert.equal(
  exploreState.extentForSelection("north-west-africa", "east-south-africa", africa),
  "east-south-africa",
);
assert.equal(
  exploreState.extentForSelection("africa", "east-south-africa", africa),
  "africa",
);
assert.equal(exploreState.extentForSelection("africa", "europe", africa), "europe");
assert.equal(exploreState.extentForSelection("europe", null, africa), "europe");

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

console.log("Explore state tests passed.");
