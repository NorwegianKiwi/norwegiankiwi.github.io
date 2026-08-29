"use strict";

const assert = require("node:assert/strict");
const navigation = require("../navigation.js");

const quizById = new Map([
  ["level-one:country-flag", { id: "level-one:country-flag" }],
]);
const levelById = new Map([
  ["level-one", { id: "level-one" }],
]);
const regionIds = new Set(["world", "europe", "africa", "asia-west", "asia-east"]);
const context = { quizById, levelById, regionIds };

function read(path) {
  return navigation.readUrl(`https://example.test/helloworld/${path}`, context);
}

assert.deepEqual(read(""), { screen: "setup" });
assert.deepEqual(read("?lang=en"), { screen: "setup" });
assert.deepEqual(read("?view=unknown"), { screen: "setup" });
assert.deepEqual(read("?view=levels&level=level-one"), {
  screen: "levels",
  levelId: "level-one",
});
assert.deepEqual(read("?view=levels&level=missing"), {
  screen: "levels",
  levelId: null,
});
assert.deepEqual(read("?view=explore&region=europe"), {
  screen: "explore",
  levelId: null,
  region: "europe",
});
assert.deepEqual(read("?view=explore&region=africa"), {
  screen: "explore",
  levelId: null,
  region: "africa",
});
assert.deepEqual(read("?view=explore&region=asia-west"), {
  screen: "explore",
  levelId: null,
  region: "asia-west",
});
assert.deepEqual(read("?view=explore&region=asia-east"), {
  screen: "explore",
  levelId: null,
  region: "asia-east",
});
assert.deepEqual(read("?view=explore&region=north-west-africa"), {
  screen: "explore",
  levelId: null,
  region: "world",
});
assert.deepEqual(read("?view=explore&region=missing"), {
  screen: "explore",
  levelId: null,
  region: "world",
});
assert.deepEqual(read("?view=explore&level=level-one&region=europe"), {
  screen: "explore",
  levelId: "level-one",
  region: "europe",
});
assert.deepEqual(read("?view=quiz&id=level-one%3Acountry-flag&source=levels"), {
  screen: "quiz",
  quizId: "level-one:country-flag",
  source: "levels",
});
assert.deepEqual(read("?view=quiz&id=missing&source=levels"), {
  screen: "levels",
  levelId: null,
});
assert.deepEqual(read("?view=quiz&id=missing&source=home"), { screen: "setup" });
assert.deepEqual(read("?view=cards&source=level&level=level-one"), {
  screen: "flashcards",
  source: "level",
  levelId: "level-one",
});
assert.deepEqual(read("?view=cards&source=explore&region=africa"), {
  screen: "flashcards",
  source: "explore",
  levelId: null,
  region: "africa",
});
assert.deepEqual(read("?view=cards&source=explore&level=level-one"), {
  screen: "flashcards",
  source: "explore",
  levelId: "level-one",
  region: "world",
});

const routes = [
  { screen: "setup" },
  { screen: "levels", levelId: "level-one" },
  { screen: "explore", levelId: null, region: "europe" },
  { screen: "explore", levelId: null, region: "asia-west" },
  { screen: "explore", levelId: null, region: "asia-east" },
  { screen: "explore", levelId: "level-one", region: "world" },
  { screen: "quiz", quizId: "level-one:country-flag", source: "levels" },
  { screen: "flashcards", source: "level", levelId: "level-one" },
  { screen: "flashcards", source: "explore", levelId: null, region: "europe" },
  { screen: "flashcards", source: "explore", levelId: "level-one", region: "world" },
];

for (const route of routes) {
  const url = navigation.createUrl("https://example.test/helloworld/?old=value#old", route, "en");
  assert.equal(url.searchParams.get("lang"), "en");
  assert.equal(url.hash, "");
  assert.deepEqual(navigation.readUrl(url, context), route);
}

assert.equal(
  navigation.readUrl(
    "https://example.test/helloworld/?cv=2&quiz=level-one%3Acountry-flag&rev=1",
    context,
  ),
  null,
);
assert.equal(
  navigation.readUrl("https://example.test/helloworld/?view=levels#progress=payload", context),
  null,
);

console.log("Navigation tests passed.");
