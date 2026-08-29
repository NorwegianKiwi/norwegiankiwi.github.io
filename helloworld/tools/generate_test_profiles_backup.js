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
  { id: "test-regular-complete", name: "Test · All 41 regular levels", masteredLevels: 41 },
  { id: "test-regional-progress", name: "Test · 46 levels + current partial", masteredLevels: 46, masteredQuizzesInNextLevel: 2, playedQuizInNextLevel: 2 },
  { id: "test-world-next", name: "Test · 52 levels (world next)", masteredLevels: 52 },
  { id: "test-final-quiz", name: "Test · Final quiz remaining", masteredLevels: 57, masteredQuizzesInNextLevel: 3 },
  {
    id: "test-navigator-tourist-gap",
    name: "Test · Navigator earned; Tourist name left",
    masteredStageIds: ["navigator"],
    almostMasteredStage: { stageId: "tourist", missingMode: "flag-country" },
  },
  {
    id: "test-tourist-world-gap",
    name: "Test · All stages except Tourist flag",
    allExcept: { stageId: "tourist", missingMode: "country-flag" },
  },
  { id: "test-all-mastered", name: "Test · Everything mastered", masteredLevels: 58 },
]);

function timestamp(index) {
  return new Date(Date.parse(CREATED_AT) + (index + 1) * 60_000).toISOString();
}

function quizAt(levelIndex, quizIndex) {
  return curriculum.quizById.get(curriculum.levels[levelIndex].quizzes[quizIndex].id);
}

function stageById(stageId) {
  return curriculum.stages.find((stage) => stage.id === stageId);
}

function stageQuizIds(stageId) {
  const stage = stageById(stageId);
  return curriculum.levels
    .slice(stage.startLevel - 1, stage.endLevel)
    .flatMap((level) => level.quizzes.map((quiz) => quiz.id));
}

function finalStageQuizId({ stageId, missingMode }) {
  const stage = stageById(stageId);
  return curriculum.levels[stage.endLevel - 1].quizzes.find((quiz) => quiz.mode === missingMode).id;
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

  if (scenario.masteredStageIds) {
    const ids = new Set(scenario.masteredStageIds.flatMap(stageQuizIds));
    for (const quiz of curriculum.quizById.values()) {
      if (ids.has(quiz.id)) record(quiz, quiz.countryCodes.length);
    }
  }

  if (scenario.almostMasteredStage) {
    const missingQuizId = finalStageQuizId(scenario.almostMasteredStage);
    const ids = new Set(stageQuizIds(scenario.almostMasteredStage.stageId));
    for (const quiz of curriculum.quizById.values()) {
      if (ids.has(quiz.id) && quiz.id !== missingQuizId) record(quiz, quiz.countryCodes.length);
    }
  }

  if (scenario.allExcept) {
    const missingQuizId = finalStageQuizId(scenario.allExcept);
    for (const quiz of curriculum.quizById.values()) {
      if (quiz.id !== missingQuizId) record(quiz, quiz.countryCodes.length);
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
