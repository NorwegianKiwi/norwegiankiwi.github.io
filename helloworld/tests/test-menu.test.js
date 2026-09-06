"use strict";

const test = require("node:test");
const preview = require("../preview.js");

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
  assert.equal(items.length, 68, "the test page should expose all curated scenarios");

  assert.equal(groups.find((group) => group.id === "basic").items.length, 17);

  assert.equal(new Set(items.map((item) => menu.buildHref(item.params))).size, items.length, "no duplicate preview links");
  assert.ok(!items.some((item) => item.params.preview === "puzzle-collection"), "obsolete collection entry is replaced by stage viewers");
  for (const item of items) {
    for (const locale of ["nb", "en"]) {
      assert.ok(item.title[locale]?.trim(), `${item.params.preview}: ${locale} title`);
      assert.ok(item.description[locale]?.trim(), `${item.params.preview}: ${locale} description`);
    }
    assert.equal(preview.readName(new URLSearchParams(item.params)), item.params.preview);
    if (item.params.stage) assert.ok(stageIds.includes(item.params.stage), item.params.stage);
    if (item.params.source) assert.equal(item.params.source, "levels");

    const norwegian = new URL(menu.buildHref(item.params, "nb"), "https://example.test/test.html");
    const english = new URL(menu.buildHref(item.params, "en"), "https://example.test/test.html");
    assert.equal(norwegian.pathname, "/index.html");
    assert.equal(norwegian.searchParams.has("lang"), false);
    assert.equal(english.searchParams.get("lang"), "en");
    assert.equal(english.searchParams.get("preview"), item.params.preview);
  }

  for (const preview of ["milestone-result", "milestone-celebration", "milestone-question", "puzzle-final"]) {
    assert.equal(items.filter((item) => item.params.preview === preview).length, 6, preview);
  }
  assert.equal(items.filter((item) => item.params.preview === "milestone-replay").length, 12);
  assert.equal(items.filter((item) => item.params.preview === "level-final-gap-question").length, 1);
  assert.equal(items.filter((item) => item.params.preview === "navigator-tourist-gap-question").length, 1);
  assert.equal(items.filter((item) => item.params.preview === "tourist-world-final-question").length, 1);
});
