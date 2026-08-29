"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const localization = require("../localization.js");

test("supports the complete Norwegian and English catalogs", () => {
  assert.deepEqual(localization.supportedLocales, ["nb", "en"]);
  assert.equal(localization.translate("nb", "brandName"), "Hei verden!");
  assert.equal(localization.translate("en", "brandName"), "Hello World!");
  assert.equal(localization.translate("en", "continueGame"), "Continue game");
});

test("interpolates placeholders and simple plurals", () => {
  assert.equal(localization.translate("en", "countries", { count: 1 }), "1 country");
  assert.equal(localization.translate("en", "countries", { count: 2 }), "2 countries");
  assert.equal(localization.translate("nb", "levelRange", { start: 3, end: 7 }), "Nivå 3–7");
});

test("rejects unknown locales and keys", () => {
  assert.throws(() => localization.translate("fr", "brandName"), /Unsupported locale/);
  assert.throws(() => localization.translate("en", "missingKey"), /Missing en translation/);
});
