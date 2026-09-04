"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
global.window = global;
require("../countries.js");
const curriculum = require("../curriculum.js");
const progress = require("../progress.js");
const quizzes = [...curriculum.quizById.values()];
const newStore = () => progress.createEmptyStore({ id: "player" });
const profile = (store) => progress.activeProfile(store);
const complete = (store, quiz, perfect = false) => progress.recordResult(store, store.activeProfileId, quiz, quiz.countryCodes.length - (perfect ? 0 : 1));
const destination = (store) => progress.continueSelection(profile(store), curriculum.levels).quiz?.id;

function savedAttempt(quiz) {
  const first = curriculum.createAttempt(quiz, "continuation-test")[0];
  return {
    quizId: quiz.id, revision: quiz.revision, attemptSeed: "continuation-test",
    questionIndex: 1, score: 0,
    answers: [{ targetCode: first.countryCode, selectedCode: first.choiceCodes.find((code) => code !== first.countryCode), correct: false }],
    correctionPending: first.countryCode,
    startedAt: "2026-09-04T10:00:00.000Z", updatedAt: "2026-09-04T10:00:00.000Z",
  };
}

test("Continue follows completed quizzes, skips mastery, and wraps without skipping attempted quizzes", () => {
  let store = newStore();
  assert.equal(destination(store), quizzes[0].id);
  store = complete(store, quizzes[0]);
  assert.equal(destination(store), quizzes[1].id);
  store = complete(store, quizzes[1]);
  assert.equal(destination(store), quizzes[2].id, "earlier imperfect results do not pull Continue backwards");
  for (const perfect of [false, true]) {
    store = complete(store, quizzes[0], perfect);
    assert.equal(destination(store), quizzes[1].id, "replaying quiz 1 leads to attempted quiz 2 regardless of score");
  }
  store = complete(store, quizzes[1], true);
  store = complete(store, quizzes[0]);
  assert.equal(destination(store), quizzes[2].id, "skip the mastered successor");
  store = complete(store, quizzes[3]);
  assert.equal(destination(store), quizzes[4].id, "cross the level boundary");
  store = complete(store, quizzes.at(-1));
  assert.equal(destination(store), quizzes[2].id, "wrap to the first unmastered quiz");
  const unknown = { ...profile(store), lastQuizId: "removed-quiz" };
  assert.equal(progress.continueSelection(unknown, curriculum.levels).quiz.id, quizzes[2].id);
  assert.equal(progress.nextUnmastered(profile(newStore()), curriculum.levels, "missing").id, quizzes[0].id);
});

test("saved mastery survives interruption and reload, and cancelling it preserves completed results", () => {
  const mastery = quizzes.find((quiz) => quiz.kind === "regional-mastery");
  const attempt = savedAttempt(mastery);
  assert.equal(destination(progress.saveMasteryAttempt(newStore(), "player", attempt)), mastery.id, "no completed quizzes are required to resume");
  let store = complete(newStore(), quizzes[0]);
  store = complete(store, quizzes[1], true);
  store = progress.saveMasteryAttempt(store, "player", attempt, { now: attempt.updatedAt });
  assert.equal(destination(store), mastery.id);
  assert.deepEqual(profile(store).savedMasteryAttempt, attempt);
  const memory = new Map();
  const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
  assert.equal(progress.saveStore(storage, store).ok, true);
  store = progress.loadStore(storage).store;
  assert.equal(destination(store), mastery.id);
  assert.deepEqual(profile(store).savedMasteryAttempt, attempt, "answers, seed, score, and pending correction survive reload");
  store = progress.addProfile(store, "Second", { id: "second" });
  assert.equal(destination(store), quizzes[0].id);
  store = progress.switchProfile(store, "player");
  assert.equal(destination(store), mastery.id);
  const completedResults = profile(store).quizProgress;
  store = progress.abandonMasteryAttempt(store, "player");
  assert.equal(profile(store).savedMasteryAttempt, null);
  assert.deepEqual(profile(store).quizProgress, completedResults);
  assert.equal(destination(store), quizzes[2].id);
});

test("missing, outdated, and non-mastery saved attempts do not hijack Continue", () => {
  const mastery = quizzes.find((quiz) => quiz.kind === "regional-mastery");
  const store = complete(newStore(), quizzes[0]);
  for (const attempt of [
    { ...savedAttempt(mastery), quizId: "removed-quiz" },
    { ...savedAttempt(mastery), revision: mastery.revision + 1 },
    savedAttempt(quizzes[0]),
  ]) {
    const saved = progress.saveMasteryAttempt(store, "player", attempt);
    assert.equal(destination(saved), quizzes[1].id);
  }
});

test("the only remaining quiz can repeat; a saved replay overrides a completed curriculum", () => {
  let store = newStore();
  for (const quiz of quizzes.slice(1)) store = complete(store, quiz, true);
  store = complete(store, quizzes[0]);
  assert.equal(destination(store), quizzes[0].id);
  assert.equal(progress.nextUnmastered(profile(store), curriculum.levels, quizzes[0].id).id, quizzes[0].id);
  store = complete(store, quizzes[0], true);
  assert.deepEqual(progress.continueSelection(profile(store), curriculum.levels), { type: "all-mastered" });
  const mastery = quizzes.find((quiz) => quiz.kind === "world-mastery");
  store = progress.saveMasteryAttempt(store, "player", savedAttempt(mastery));
  assert.equal(destination(store), mastery.id);
  const totals = progress.summary(profile(store), curriculum.levels);
  assert.equal(totals.masteredQuizzes, totals.totalQuizzes);
});
