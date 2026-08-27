"use strict";

const assert = require("node:assert/strict");
global.window = global;
require("../countries.js");
const curriculum = require("../curriculum.js");

const { countries, otherPlaces, places, regionOptions } = global.GEOGRAFI_QUIZ_DATA;
const countryCodes = new Set(countries.map((country) => country.code));
const placeCodes = new Set(places.map((place) => place.code));
const placesByCode = new Map(places.map((place) => [place.code, place]));
const levels = curriculum.levels;
const quizzes = levels.flatMap((level) => level.quizzes.map((quiz) => ({ ...quiz, level })));

assert.equal(countries.length, 197);
assert.equal(otherPlaces.length, 30);
assert.equal(places.length, 227);
assert.equal(countries.filter((country) => country.region === "africa").length, 54);
assert.equal(otherPlaces.filter((place) => place.region === "africa").length, 3);
assert.equal(places.filter((place) => place.region === "africa").length, 57);
assert.ok(regionOptions.some((region) => region.id === "africa"));
assert.ok(!regionOptions.some((region) => ["north-west-africa", "east-south-africa"].includes(region.id)));
assert.equal(levels.length, 52);
assert.equal(new Set(levels.map((level) => level.id)).size, 52);
assert.equal(quizzes.length, 208);
assert.equal(new Set(quizzes.map((quiz) => quiz.id)).size, 208);

assert.deepEqual(
  curriculum.sections.map(({ id, icon, startLevel, endLevel }) => [id, icon, startLevel, endLevel]),
  [
    ["traveller", "🎒", 1, 4],
    ["explorer", "🧭", 5, 14],
    ["navigator", "🗺️", 15, 33],
    ["globetrotter", "🌍", 34, 41],
    ["world-master", "🏆", 42, 52],
  ],
);
const sectionLevelNumbers = curriculum.sections.flatMap((section) =>
  Array.from({ length: section.endLevel - section.startLevel + 1 }, (_, index) => section.startLevel + index),
);
assert.deepEqual(sectionLevelNumbers, Array.from({ length: levels.length }, (_, index) => index + 1));
for (const section of curriculum.sections) {
  assert.ok(section.title.nb && section.title.en, section.id);
  assert.equal("description" in section, false, section.id);
}

for (const level of levels) {
  assert.equal(level.quizzes.length, 4, level.id);
  assert.deepEqual(level.quizzes.map((quiz) => quiz.mode), curriculum.MODES, level.id);
  assert.equal(new Set(level.countryCodes).size, level.countryCodes.length, level.id);
  level.countryCodes.forEach((code) => assert.ok(placeCodes.has(code), `${level.id}: ${code}`));
  for (const quiz of level.quizzes) {
    assert.ok(Number.isInteger(quiz.revision) && quiz.revision > 0, quiz.id);
    assert.ok(quiz.seed.length > 10, quiz.id);
    assert.ok(quiz.choiceCount <= level.countryCodes.length, quiz.id);
  }
}

const systematic = levels.filter((level) => level.kind === "pack").flatMap((level) => level.countryCodes);
assert.equal(systematic.length, 227);
assert.equal(new Set(systematic).size, 227);

for (const level of levels.filter((level) => level.kind === "regional-mastery")) {
  const expected = countries.filter((country) => country.region === level.region).map((country) => country.code).sort();
  assert.deepEqual([...level.countryCodes].sort(), expected, level.id);
}
assert.deepEqual([...levels.at(-1).countryCodes].sort(), [...placeCodes].sort());
assert.deepEqual(
  [...curriculum.levelById.get("mastery-countries-world").countryCodes].sort(),
  [...countryCodes].sort(),
);
assert.deepEqual(
  [...curriculum.levelById.get("mastery-other-places-world").countryCodes].sort(),
  otherPlaces.map((place) => place.code).sort(),
);
assert.equal(curriculum.levelById.get("mastery-whole-world").countryCodes.length, 227);
assert.equal(curriculum.levelById.get("mastery-africa").countryCodes.length, 54);

const relationshipLabel = (place, locale) =>
  place.relatedCountryCode
    ? placesByCode.get(place.relatedCountryCode).name[locale]
    : place.status[locale];
assert.equal(relationshipLabel(placesByCode.get("gl"), "en"), "Denmark");
assert.equal(relationshipLabel(placesByCode.get("gl"), "nb"), "Danmark");
assert.equal(relationshipLabel(placesByCode.get("eh"), "en"), "Disputed territory");
assert.equal(relationshipLabel(placesByCode.get("eh"), "nb"), "Omstridt territorium");

const hasSpecialCentres = (place) =>
  place.centres.length !== 1 ||
  place.centres[0].role.en !== "Capital" ||
  place.centres[0].role.nb !== "Hovedstad";
assert.deepEqual(
  places.filter(hasSpecialCentres).map((place) => place.code).sort(),
  ["bo", "eh", "id", "lk", "my", "nr", "ps", "sz", "za"],
);
assert.equal(placesByCode.get("za").note, null);
assert.deepEqual(
  placesByCode.get("za").centres.map((centre) => centre.role.en),
  ["Administrative capital", "Legislative capital", "Judicial capital"],
);
assert.ok(placesByCode.get("eh").note?.en);
assert.equal(placesByCode.get("yt").relatedCountryCode, "fr");
assert.equal(placesByCode.get("yt").flagStatus, "established-local");

const quiz = curriculum.quizById.get("pack-nordics:country-flag");
assert.deepEqual(curriculum.fixedAlternativeCodes(quiz), curriculum.fixedAlternativeCodes(quiz));
const firstAttempt = curriculum.createAttempt(quiz, "attempt-one");
const repeatedAttempt = curriculum.createAttempt(quiz, "attempt-one");
const secondAttempt = curriculum.createAttempt(quiz, "attempt-two");
assert.deepEqual(firstAttempt, repeatedAttempt);
assert.notDeepEqual(firstAttempt, secondAttempt);
for (const question of firstAttempt) {
  assert.ok(question.choiceCodes.includes(question.countryCode));
  assert.deepEqual(new Set(question.choiceCodes), new Set(curriculum.fixedAlternativeCodes(quiz)[question.countryCode]));
}

console.log("Curriculum tests passed.");
