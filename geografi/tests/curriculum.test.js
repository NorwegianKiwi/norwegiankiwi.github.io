"use strict";

const assert = require("node:assert/strict");
global.window = global;
require("../countries.js");
const curriculum = require("../curriculum.js");

const { countries } = global.GEOGRAFI_QUIZ_DATA;
const countryCodes = new Set(countries.map((country) => country.code));
const levels = curriculum.levels;
const quizzes = levels.flatMap((level) => level.quizzes.map((quiz) => ({ ...quiz, level })));

assert.equal(levels.length, 47);
assert.equal(new Set(levels.map((level) => level.id)).size, 47);
assert.equal(quizzes.length, 188);
assert.equal(new Set(quizzes.map((quiz) => quiz.id)).size, 188);

for (const level of levels) {
  assert.equal(level.quizzes.length, 4, level.id);
  assert.deepEqual(level.quizzes.map((quiz) => quiz.mode), curriculum.MODES, level.id);
  assert.equal(new Set(level.countryCodes).size, level.countryCodes.length, level.id);
  level.countryCodes.forEach((code) => assert.ok(countryCodes.has(code), `${level.id}: ${code}`));
  for (const quiz of level.quizzes) {
    assert.ok(Number.isInteger(quiz.revision) && quiz.revision > 0, quiz.id);
    assert.ok(quiz.seed.length > 10, quiz.id);
    assert.ok(quiz.choiceCount <= level.countryCodes.length, quiz.id);
  }
}

const systematic = levels.filter((level) => level.kind === "pack").flatMap((level) => level.countryCodes);
assert.equal(systematic.length, 196);
assert.equal(new Set(systematic).size, 196);

for (const level of levels.filter((level) => level.kind === "regional-mastery")) {
  const expected = countries.filter((country) => country.region === level.region).map((country) => country.code).sort();
  assert.deepEqual([...level.countryCodes].sort(), expected, level.id);
}
assert.deepEqual([...levels.at(-1).countryCodes].sort(), [...countryCodes].sort());

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
