"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = global;
require("../countries.js");
const curriculum = require("../curriculum.js");
const progress = require("../progress.js");

const CREATED_AT = "2026-08-22T10:00:00.000Z";

const scenarios = Object.freeze([
  { id: "test-new", name: "Test · Brand new", masteredLevels: 0 },
  { id: "test-played", name: "Test · First quiz played", masteredLevels: 0, playedQuiz: 0 },
  { id: "test-first-quiz", name: "Test · First quiz mastered", masteredLevels: 0, masteredQuizzes: 1 },
  { id: "test-level-1", name: "Test · 1 level mastered", masteredLevels: 1 },
  { id: "test-level-5", name: "Test · 5 levels mastered", masteredLevels: 5 },
  { id: "test-level-20", name: "Test · 20 levels + current partial", masteredLevels: 20, masteredQuizzesInNextLevel: 2, playedQuizInNextLevel: 2 },
  { id: "test-regular-complete", name: "Test · All 37 regular levels", masteredLevels: 37 },
  { id: "test-regional-progress", name: "Test · 42 levels + current partial", masteredLevels: 42, masteredQuizzesInNextLevel: 2, playedQuizInNextLevel: 2 },
  { id: "test-world-next", name: "Test · 46 levels (world next)", masteredLevels: 46 },
  { id: "test-all-mastered", name: "Test · Everything mastered", masteredLevels: 53 },
]);

function timestamp(index) {
  return new Date(Date.parse(CREATED_AT) + (index + 1) * 60_000).toISOString();
}

function quizAt(levelIndex, quizIndex) {
  return curriculum.quizById.get(curriculum.levels[levelIndex].quizzes[quizIndex].id);
}

function buildProfile(scenario) {
  let store = progress.createEmptyStore({ id: scenario.id, defaultName: scenario.name, now: CREATED_AT });
  let resultIndex = 0;

  function record(quiz, score) {
    store = progress.recordResult(store, scenario.id, quiz, score, { now: timestamp(resultIndex) });
    resultIndex += 1;
  }

  for (let levelIndex = 0; levelIndex < scenario.masteredLevels; levelIndex += 1) {
    for (let quizIndex = 0; quizIndex < 4; quizIndex += 1) {
      const quiz = quizAt(levelIndex, quizIndex);
      record(quiz, quiz.countryCodes.length);
    }
  }

  if (scenario.masteredQuizzes) {
    for (let quizIndex = 0; quizIndex < scenario.masteredQuizzes; quizIndex += 1) {
      const quiz = quizAt(0, quizIndex);
      record(quiz, quiz.countryCodes.length);
    }
  }

  if (scenario.masteredQuizzesInNextLevel) {
    for (let quizIndex = 0; quizIndex < scenario.masteredQuizzesInNextLevel; quizIndex += 1) {
      const quiz = quizAt(scenario.masteredLevels, quizIndex);
      record(quiz, quiz.countryCodes.length);
    }
  }

  const playedQuizIndex = scenario.playedQuizInNextLevel ?? scenario.playedQuiz;
  if (playedQuizIndex !== undefined) {
    const levelIndex = scenario.playedQuizInNextLevel !== undefined ? scenario.masteredLevels : 0;
    const quiz = quizAt(levelIndex, playedQuizIndex);
    record(quiz, Math.max(1, quiz.countryCodes.length - 1));
  }

  return progress.activeProfile(store);
}

function buildBackup() {
  const profiles = Object.fromEntries(scenarios.map((scenario) => {
    const profile = buildProfile(scenario);
    return [profile.id, profile];
  }));
  return `${progress.createBackup({ schemaVersion: 1, activeProfileId: scenarios[0].id, profiles })}\n`;
}

if (require.main === module) {
  const output = path.join(__dirname, "../fixtures/test-profiles-backup.json");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, buildBackup());
  console.log(`Wrote ${path.relative(process.cwd(), output)}`);
}

module.exports = { buildBackup, scenarios };
