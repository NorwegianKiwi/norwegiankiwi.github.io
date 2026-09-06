"use strict";

const test = require("node:test");

test("generated test-profile backup fixture", () => {
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
    "test-navigator-tourist-gap": [16, 67, 67],
    "test-tourist-world-gap": [57, 231, 231],
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

  const tourist = curriculum.stages.find((stage) => stage.id === "tourist");
  const navigator = curriculum.stages.find((stage) => stage.id === "navigator");
  const touristFinalLevel = curriculum.levels[tourist.endLevel - 1];
  const touristNameQuiz = curriculum.quizById.get(
    touristFinalLevel.quizzes.find((quiz) => quiz.mode === "flag-country").id,
  );
  const touristFlagQuiz = curriculum.quizById.get(
    touristFinalLevel.quizzes.find((quiz) => quiz.mode === "country-flag").id,
  );

  const navigatorGapProfile = profiles.find((profile) => profile.id === "test-navigator-tourist-gap");
  assert.equal(progress.stageProgress(navigatorGapProfile, navigator, curriculum.levels).isMastered, true);
  assert.equal(progress.stageProgress(navigatorGapProfile, tourist, curriculum.levels).isMastered, false);
  assert.equal(progress.quizState(navigatorGapProfile, touristNameQuiz), "unplayed");
  assert.deepEqual(
    progress.continueSelection(navigatorGapProfile, curriculum.levels).quiz.id,
    curriculum.levels[4].quizzes[0].id,
    "continue forward from the last completed quiz instead of jumping back to the Tourist gap",
  );
  assert.deepEqual(
    curriculum.stages.filter((stage) => progress.stageProgress(navigatorGapProfile, stage, curriculum.levels).isMastered).map((stage) => stage.id),
    ["navigator"],
  );

  const touristWorldGapProfile = profiles.find((profile) => profile.id === "test-tourist-world-gap");
  assert.equal(progress.stageProgress(touristWorldGapProfile, tourist, curriculum.levels).isMastered, false);
  assert.equal(progress.quizState(touristWorldGapProfile, touristFlagQuiz), "unplayed");
  assert.deepEqual(
    progress.continueSelection(touristWorldGapProfile, curriculum.levels).quiz.id,
    touristFlagQuiz.id,
  );
  assert.deepEqual(
    curriculum.stages.filter((stage) => progress.stageProgress(touristWorldGapProfile, stage, curriculum.levels).isMastered).map((stage) => stage.id),
    ["explorer", "navigator", "globetrotter", "regional-expert", "world-master"],
  );
});
