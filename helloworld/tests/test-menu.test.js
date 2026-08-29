"use strict";

const test = require("node:test");

test("manual preview menu scenarios", () => {
  const assert = require("node:assert/strict");

  global.window = global;
  require("../countries.js");
  require("../curriculum.js");
  const menu = require("../test-menu.js");

  const stageIds = ["tourist", "explorer", "navigator", "globetrotter", "regional-expert", "world-master"];
  assert.deepEqual(menu.stageList.map((stage) => stage.id), stageIds);

  const groups = menu.scenarioGroups();
  const items = groups.flatMap((group) => group.items);
  assert.equal(items.length, 37, "the test page should expose all curated scenarios");

  const allowedPreviews = new Set([
    "result-next-quiz",
    "result-next-level",
    "milestone-result",
    "milestone-celebration",
    "milestone-question",
    "milestone-replay",
    "navigator-tourist-gap-question",
    "tourist-world-final-question",
    "final-question",
    "final-result",
    "final-celebration",
  ]);

  for (const item of items) {
    assert.ok(allowedPreviews.has(item.params.preview), item.params.preview);
    if (item.params.stage) assert.ok(stageIds.includes(item.params.stage), item.params.stage);
    if (item.params.source) assert.equal(item.params.source, "levels");

    const norwegian = new URL(menu.buildHref(item.params, "nb"), "https://example.test/test.html");
    const english = new URL(menu.buildHref(item.params, "en"), "https://example.test/test.html");
    assert.equal(norwegian.pathname, "/index.html");
    assert.equal(norwegian.searchParams.has("lang"), false);
    assert.equal(english.searchParams.get("lang"), "en");
    assert.equal(english.searchParams.get("preview"), item.params.preview);
  }

  for (const preview of ["milestone-result", "milestone-celebration", "milestone-question"]) {
    assert.equal(items.filter((item) => item.params.preview === preview).length, 6, preview);
  }
  assert.equal(items.filter((item) => item.params.preview === "milestone-replay").length, 12);
  assert.equal(items.filter((item) => item.params.preview === "navigator-tourist-gap-question").length, 1);
  assert.equal(items.filter((item) => item.params.preview === "tourist-world-final-question").length, 1);
});
