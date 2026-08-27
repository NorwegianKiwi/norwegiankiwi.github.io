"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

global.window = global;
require("../countries.js");
const curriculum = require("../curriculum.js");
const progress = require("../progress.js");
const generator = require("../tools/generate_test_profiles_backup.js");

const fixturePath = path.join(__dirname, "../fixtures/test-profiles-backup.json");
const fixture = fs.readFileSync(fixturePath, "utf8");
assert.equal(fixture, generator.buildBackup(), "regenerate the fixture after curriculum changes");

const profiles = progress.parseBackup(fixture);
assert.equal(profiles.length, generator.scenarios.length);

const expected = {
  "test-new": [0, 0, 0],
  "test-played": [0, 0, 1],
  "test-first-quiz": [0, 1, 1],
  "test-level-1": [1, 4, 4],
  "test-level-5": [5, 20, 20],
  "test-level-20": [20, 82, 83],
  "test-regular-complete": [41, 164, 164],
  "test-regional-progress": [46, 186, 187],
  "test-world-next": [52, 208, 208],
  "test-final-quiz": [57, 231, 231],
  "test-all-mastered": [58, 232, 232],
};

for (const profile of profiles) {
  const summary = progress.summary(profile, curriculum.levels);
  assert.deepEqual(
    [summary.masteredLevels, summary.masteredQuizzes, summary.playedQuizzes],
    expected[profile.id],
    profile.name,
  );
}

const complete = profiles.find((profile) => profile.id === "test-all-mastered");
assert.deepEqual(progress.continueSelection(complete, curriculum.levels), { type: "all-mastered" });

const finalQuizProfile = profiles.find((profile) => profile.id === "test-final-quiz");
assert.equal(
  progress.continueSelection(finalQuizProfile, curriculum.levels).quiz.id,
  curriculum.levels.at(-1).quizzes.at(-1).id,
);

console.log("Test profile backup fixture passed.");
