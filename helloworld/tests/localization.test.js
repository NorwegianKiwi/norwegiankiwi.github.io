"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const localization = require("../localization.js");

test("supports the complete Norwegian and English catalogs", () => {
  assert.deepEqual(localization.supportedLocales, ["nb", "en"]);
  assert.equal(localization.translate("nb", "brandName"), "Hei verden!");
  assert.equal(localization.translate("en", "brandName"), "Hello World!");
  assert.equal(localization.translate("en", "continueGame"), "Continue game");
  assert.equal(localization.translate("nb", "resultsDestination"), "Resultatet");
  assert.equal(localization.translate("en", "resultsDestination"), "Results");
});

test("interpolates placeholders and simple plurals", () => {
  assert.equal(localization.translate("en", "countries", { count: 1 }), "1 country");
  assert.equal(localization.translate("en", "countries", { count: 2 }), "2 countries");
  assert.equal(localization.translate("nb", "levelRange", { start: 3, end: 7 }), "Nivå 3–7");
  assert.equal(localization.translate("nb", "nextQuizDestination", { action: "Neste", number: 2, title: "Nordiske land", mode: "Finn flagget" }), "Neste: Nivå 2 · Nordiske land · Finn flagget");
  assert.equal(localization.translate("en", "nextQuizDestination", { action: "Next", number: 2, title: "Nordic countries", mode: "Find the flag" }), "Next: Level 2 · Nordic countries · Find the flag");
});

test("builds personalized and anonymous share copy in both locales", () => {
  assert.equal(
    localization.translate("en", "challengeShareSubjectNamed", { name: "Sølvi" }),
    "Hello World! challenge from Sølvi",
  );
  assert.equal(
    localization.translate("nb", "challengeShareTextNamed", {
      name: "Sølvi", score: 5, total: 5, level: 2,
      levelTitle: "Nordiske land", mode: "Finn flagget", minutes: 2,
    }),
    "Sølvi fikk 5 av 5 i nivå 2: Nordiske land · Finn flagget. Klarer du å slå resultatet? Quizen tar omtrent 2 min.",
  );
  assert.equal(
    localization.translate("en", "milestoneShareText", {
      stage: "Explorer", start: 5, end: 14,
    }),
    "I reached Explorer and mastered levels 5–14 in Hello World!",
  );
  assert.equal(
    localization.translate("nb", "milestoneShareSubjectNamed", {
      name: "Sølvi", stage: "Utforsker",
    }),
    "Sølvi nådde Utforsker i Hei verden!",
  );
  assert.equal(
    localization.translate("en", "worldShareTextNamed", {
      name: "Sølvi", levels: 58, quizzes: 232,
    }),
    "Sølvi mastered all 58 levels and all 232 geography quizzes in Hello World!",
  );
  assert.equal(
    localization.translate("nb", "worldShareSubject"),
    "Jeg har mestret verden i Hei verden!",
  );
});

test("rejects unknown locales and keys", () => {
  assert.throws(() => localization.translate("fr", "brandName"), /Unsupported locale/);
  assert.throws(() => localization.translate("en", "missingKey"), /Missing en translation/);
});


test("compact result actions and mastery cancellation copy are complete in both locales", () => {
  for (const [locale, mode, next, title, body, back] of [
    ["en", "Find the flag", "Next: Find the flag", "Start another quiz?", "Your unfinished mastery quiz will be cancelled.", "Go back"],
    ["nb", "Finn flagget", "Neste: Finn flagget", "Starte en annen quiz?", "Den påbegynte mestringsquizen blir avbrutt.", "Tilbake"],
  ]) {
    assert.equal(localization.translate(locale, "nextResultMode", { mode }), next);
    assert.equal(localization.translate(locale, "abandonAttemptTitle"), title);
    assert.equal(localization.translate(locale, "abandonAttemptDescription"), body);
    assert.equal(localization.translate(locale, "keepSavedAttempt"), back);
    assert.equal(localization.translate(locale, "abandonAndStart"), "Start quiz");
  }
});
