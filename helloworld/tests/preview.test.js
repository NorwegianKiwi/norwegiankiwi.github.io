"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
global.window = global;
require("../countries.js");
const curriculum = require("../curriculum.js");
const progress = require("../progress.js");
const preview = require("../preview.js");
const menu = require("../test-menu.js");
const countriesByCode = new Map(global.GEOGRAFI_QUIZ_DATA.places.map((place) => [place.code, place]));
const dependencies = { curriculum, progress, countriesByCode };
const timestamp = "2026-09-06T10:00:00.000Z";
const prepare = (name, params = {}, locale = "en") => preview.prepare(
  new URLSearchParams({ preview: name, ...params }), locale, dependencies, timestamp,
);
const profile = (prepared) => progress.activeProfile(prepared.store);
const mastered = (prepared) => [...curriculum.quizById.values()]
  .filter((quiz) => progress.quizState(profile(prepared), quiz) === "mastered");
const stageQuizzes = (stage) => curriculum.levels.slice(stage.startLevel - 1, stage.endLevel)
  .flatMap((level) => level.quizzes.map((quiz) => curriculum.quizById.get(quiz.id)));

function checkLastQuestion(prepared) {
  assert.equal(prepared.action.type, "start-quiz");
  const quiz = curriculum.quizById.get(prepared.action.quizId);
  const attempt = profile(prepared).savedMasteryAttempt;
  assert.equal(attempt.quizId, quiz.id);
  assert.equal(attempt.revision, quiz.revision);
  assert.equal(attempt.questionIndex, quiz.countryCodes.length - 1);
  assert.equal(attempt.score, attempt.questionIndex);
  assert.equal(attempt.correctionPending, null);
  assert.equal(attempt.startedAt, timestamp);
  const questions = curriculum.createAttempt(quiz, attempt.attemptSeed);
  assert.deepEqual(attempt.answers.map((answer) => answer.selectedCode), questions.slice(0, -1).map((question) => question.countryCode));
  assert.equal(progress.currentRecord(profile(prepared), quiz), null);
  return quiz;
}

test("preview recognition rejects unknown names and preserves every menu entry and hidden alias", () => {
  for (const value of ["", "unknown", "puzzle-unknown", "result-unknown"]) {
    assert.equal(preview.readName(new URLSearchParams({ preview: value })), null);
    assert.equal(prepare(value), null);
  }
  assert.equal(preview.readName(new URLSearchParams()), null);
  for (const item of menu.scenarioGroups().flatMap((group) => group.items)) {
    assert.equal(preview.readName(new URLSearchParams(item.params)), item.params.preview);
    for (const locale of ["nb", "en"]) {
      const prepared = prepare(item.params.preview, item.params, locale);
      assert.ok(prepared.action.type);
      assert.equal(Object.keys(prepared.store.profiles).length, 1);
      assert.equal(profile(prepared).name, "Preview");
      assert.equal(profile(prepared).createdAt, timestamp);
    }
  }
  assert.equal(preview.readName(new URLSearchParams({ preview: "puzzle-collection" })), "puzzle-collection");
});

test("stage previews preserve completion, replay destinations, final questions, and stage fallback", () => {
  for (const stage of curriculum.stages) {
    const params = { stage: stage.id };
    const result = prepare("milestone-result", params);
    assert.deepEqual(mastered(result).map((quiz) => quiz.id), stageQuizzes(stage).map((quiz) => quiz.id));
    assert.equal(result.state.resultNewStageMastery, true);
    assert.equal(result.state.resultCelebrationPending, false);
    assert.equal(result.state.screen, "result");
    assert.equal(result.action.type, "render");
    assert.deepEqual(prepare("milestone-celebration", params).action,
      { type: "milestone-celebration", stageId: stage.id, origin: "newly-earned" });
    for (const source of ["home", "levels", "unknown"]) {
      const replay = prepare("milestone-replay", { ...params, source });
      assert.equal(replay.state.screen, source === "levels" ? "levels" : "setup");
      assert.equal(replay.state.selectedLevelId, source === "levels" ? curriculum.levels[stage.endLevel - 1].id : null);
      assert.equal(replay.action.origin, source === "levels" ? "levels-replay" : "home-replay");
    }
    const question = prepare("milestone-question", params);
    checkLastQuestion(question);
    assert.equal(mastered(question).length, stageQuizzes(stage).length - 1);
  }
  assert.deepEqual(prepare("milestone-result", { stage: "unknown" }), prepare("milestone-result"));
});

test("puzzle viewers never record a result and rewards use the normal finish action", () => {
  for (const stage of curriculum.stages) {
    const quizzes = stageQuizzes(stage);
    for (const [name, count] of [
      ["puzzle-view-empty", 0], ["puzzle-view-partial", Math.floor(quizzes.length / 2)],
      ["puzzle-view-complete", quizzes.length], ["puzzle-collection", quizzes.length],
    ]) {
      const prepared = prepare(name, { stage: stage.id });
      assert.equal(mastered(prepared).length, count, name);
      assert.deepEqual(prepared.action, { type: "puzzle-viewer", stageId: stage.id });
      assert.deepEqual(prepared.state, { screen: "levels", puzzleStageId: stage.id });
    }
    for (const [name, earned, quizIndex] of [
      ["puzzle-first", 0, 0], ["puzzle-partial", Math.floor(quizzes.length / 2), Math.floor(quizzes.length / 2)],
      ["puzzle-final", quizzes.length - 1, quizzes.length - 1], ["puzzle-replay", 1, 0],
      ["puzzle-level", 3, 3], ["puzzle-missing-image", 0, 0],
    ]) {
      const prepared = prepare(name, { stage: stage.id });
      assert.equal(mastered(prepared).length, earned, name);
      assert.equal(prepared.state.curriculumQuizId, quizzes[quizIndex].id);
      assert.equal(prepared.state.score, quizzes[quizIndex].countryCodes.length);
      assert.equal(prepared.state.resultRecorded, false);
      assert.deepEqual(prepared.action, { type: "finish-quiz", stageId: stage.id, imageFailure: name === "puzzle-missing-image" });
    }
  }
  const world = prepare("puzzle-world", { stage: "tourist" });
  assert.equal(mastered(world).length, curriculum.quizById.size - 1);
  assert.equal(world.action.stageId, "world-master");
  assert.equal(world.state.curriculumQuizId, curriculum.levels.at(-1).quizzes.at(-1).id);
});

test("result variants preserve scores, records, mastery flags, and continuation destinations", () => {
  const firstLevel = curriculum.levels[0];
  for (const locale of ["nb", "en"]) {
    const longest = curriculum.levels.reduce((best, level, index, levels) => level.title[locale].length > levels[best].title[locale].length ? index : best, 0);
    for (const [name, nextId] of [
      ["result-next-quiz", firstLevel.quizzes[1].id], ["result-failed-next-quiz", firstLevel.quizzes[1].id],
      ["result-skip-quiz", firstLevel.quizzes[2].id], ["result-failed-skip-quiz", firstLevel.quizzes[2].id],
      ["result-next-level", curriculum.levels[longest].quizzes[0].id], ["result-failed-next", curriculum.levels[longest].quizzes[0].id],
      ["result-skip-level", curriculum.levels[longest].quizzes[1].id], ["result-failed-skip-level", curriculum.levels[longest].quizzes[1].id],
      ["result-wrap", firstLevel.quizzes[0].id], ["result-failed-wrap", firstLevel.quizzes[0].id],
      ["share-fallback", firstLevel.quizzes[1].id],
    ]) {
      const prepared = prepare(name, {}, locale);
      const quiz = curriculum.quizById.get(prepared.state.curriculumQuizId);
      assert.equal(prepared.state.score, quiz.countryCodes.length - Number(name.startsWith("result-failed-")), name);
      assert.equal(progress.nextUnmastered(profile(prepared), curriculum.levels, quiz.id).id, nextId, name);
      assert.equal(prepared.state.resultRecorded, true);
      assert.equal(prepared.action.type, "render");
    }
  }
  const total = firstLevel.countryCodes.length;
  for (const [name, previous, best, newMastery] of [
    ["result-new-record", total - 2, total - 1, false],
    ["result-below-best", total, total, false],
    ["result-replay-mastered", total, total, false],
  ]) {
    const prepared = prepare(name);
    assert.equal(prepared.state.resultPreviousBestScore, previous);
    assert.equal(prepared.state.resultBestScore, best);
    assert.equal(prepared.state.resultNewQuizMastery, newMastery);
  }
  for (const name of ["result-all-mastered", "result-failed-all-mastered"]) {
    const prepared = prepare(name);
    assert.equal(mastered(prepared).length, curriculum.quizById.size);
    assert.equal(prepared.state.resultNewQuizMastery, false);
  }
  const noNext = prepare("result-failed-no-next");
  assert.equal(mastered(noNext).length, curriculum.quizById.size - 1);
  assert.equal(progress.nextUnmastered(profile(noNext), curriculum.levels, noNext.state.curriculumQuizId).id, noNext.state.curriculumQuizId);
});

test("out-of-order and final previews leave exactly the intended mastery gaps", () => {
  const levelGap = prepare("level-final-gap-question");
  assert.equal(checkLastQuestion(levelGap).id, curriculum.levels[0].quizzes[2].id);
  assert.equal(mastered(levelGap).length, 3);
  for (const name of ["tourist-world-final-question", "final-question"]) {
    const prepared = prepare(name);
    checkLastQuestion(prepared);
    assert.equal(mastered(prepared).length, curriculum.quizById.size - 1);
  }
  const navigatorGap = prepare("navigator-tourist-gap-question");
  checkLastQuestion(navigatorGap);
  const tourist = stageQuizzes(curriculum.stages[0]);
  const navigator = stageQuizzes(curriculum.stages[2]);
  assert.equal(mastered(navigatorGap).length, tourist.length + navigator.length - 2);
  assert.equal(mastered(navigatorGap).filter((quiz) => tourist.some((entry) => entry.id === quiz.id)).length, tourist.length - 1);
  for (const name of ["final-result", "final-celebration"]) {
    const prepared = prepare(name);
    assert.equal(mastered(prepared).length, curriculum.quizById.size);
    assert.equal(prepared.state.resultNewStageMastery, name === "final-result");
    assert.equal(prepared.action.type, name === "final-result" ? "render" : "world-celebration");
  }
});

test("preview preparation is repeatable and independent between calls", () => {
  const first = prepare("puzzle-view-empty");
  const before = structuredClone(first);
  prepare("final-result");
  assert.deepEqual(first, before);
  assert.deepEqual(prepare("puzzle-view-empty"), before);
});
