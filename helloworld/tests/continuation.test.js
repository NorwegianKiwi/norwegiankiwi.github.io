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

const start = (store, quiz) => progress.markQuizStarted(store, store.activeProfileId, quiz);
const reload = (store) => progress.loadStore({ getItem: () => JSON.stringify(store) }).store;

test("unfinished retry of a level's final quiz overrides the next level until completed", () => {
  let store = complete(newStore(), quizzes[3]);
  assert.equal(destination(store), quizzes[4].id);
  const completedProgress = profile(store).quizProgress;
  store = start(store, quizzes[3]);
  assert.equal(destination(store), quizzes[3].id);
  assert.deepEqual(profile(store).quizProgress, completedProgress);
  assert.equal(profile(store).lastQuizId, quizzes[3].id);
  store = reload(store);
  assert.equal(destination(store), quizzes[3].id, "Home and reload keep the unfinished destination");
  store = complete(store, quizzes[3]);
  assert.equal(profile(store).unfinishedQuiz, null);
  assert.equal(destination(store), quizzes[4].id);
});

test("starting before answering remembers manual selections, replaces them, and isolates profiles", () => {
  let store = start(newStore(), quizzes[7]);
  assert.equal(destination(store), quizzes[7].id);
  assert.equal(profile(store).lastQuizId, null);
  assert.deepEqual(profile(store).quizProgress, {});
  assert.equal(profile(store).savedMasteryAttempt, null, "short answers and seeds are not stored");
  store = start(store, quizzes[8]);
  assert.equal(destination(store), quizzes[8].id);
  store = progress.addProfile(store, "Other", { id: "other" });
  assert.equal(destination(store), quizzes[0].id);
  store = start(store, quizzes[2]);
  store = progress.switchProfile(store, "player");
  assert.equal(destination(store), quizzes[8].id);
  store = progress.clearProgress(store, "player");
  assert.equal(profile(store).unfinishedQuiz, null);
  assert.equal(destination(store), quizzes[0].id);
});

test("unfinished mastered replay overrides all-mastered without changing mastery", () => {
  let store = newStore();
  for (const quiz of quizzes) store = complete(store, quiz, true);
  const before = progress.summary(profile(store), curriculum.levels);
  store = start(store, quizzes[3]);
  assert.equal(destination(store), quizzes[3].id);
  assert.deepEqual(progress.summary(profile(store), curriculum.levels), before);
  store = complete(store, quizzes[3]);
  assert.equal(progress.continueSelection(profile(store), curriculum.levels).type, "all-mastered");
});

test("old, malformed and stale unfinished markers fall back without losing progress", () => {
  for (const marker of [undefined, null, [], {}, { quizId: 3, revision: 1 },
    { quizId: quizzes[3].id, revision: "1" }, { quizId: quizzes[3].id, revision: 0 },
    { quizId: quizzes[3].id, revision: 1.5 }, { quizId: "removed-quiz:country-flag", revision: 1 },
    { quizId: quizzes[3].id, revision: quizzes[3].revision + 1 }]) {
    let store = complete(newStore(), quizzes[0]);
    store.profiles.player.unfinishedQuiz = marker;
    store = reload(store);
    assert.equal(destination(store), quizzes[1].id);
    assert.equal(profile(store).lastQuizId, quizzes[0].id);
    assert.equal(progress.quizState(profile(store), quizzes[0]), "played");
  }
});

test("mastery save takes priority; abandonment clears only a matching marker", () => {
  assert.equal(profile(progress.abandonMasteryAttempt(newStore(), "player")).unfinishedQuiz, null);
  const mastery = quizzes.find((quiz) => quiz.kind === "regional-mastery");
  let store = start(newStore(), mastery);
  assert.equal(destination(store), mastery.id, "mastery startup is remembered before any answer");
  store = progress.saveMasteryAttempt(store, "player", savedAttempt(mastery));
  const saved = profile(store).savedMasteryAttempt;
  assert.deepEqual(profile(reload(store)).savedMasteryAttempt, saved);
  assert.equal(profile(progress.abandonMasteryAttempt(store, "player")).unfinishedQuiz, null);
  store = start(store, quizzes[3]);
  assert.equal(destination(store), mastery.id, "saved mastery retains precedence");
  store = progress.abandonMasteryAttempt(store, "player");
  assert.equal(destination(store), quizzes[3].id, "an unrelated marker is preserved");
  store = complete(store, quizzes[0]);
  assert.equal(destination(store), quizzes[3].id, "an unrelated result does not clear the marker");
});

test("unfinished markers stay local across backups, transfers, merges and new imports", () => {
  const store = start(newStore(), quizzes[3]);
  const current = profile(store);
  assert.equal("unfinishedQuiz" in progress.transferableProfile(current), false);
  const backup = progress.createBackup(store);
  assert.equal(backup.includes("unfinishedQuiz"), false);
  assert.equal(progress.parseBackup(backup)[0].unfinishedQuiz, null);
  const injected = JSON.parse(backup);
  injected.profiles[0].unfinishedQuiz = current.unfinishedQuiz;
  assert.equal(progress.parseBackup(JSON.stringify(injected))[0].unfinishedQuiz, null);
  const incoming = { ...current, unfinishedQuiz: { quizId: quizzes[5].id, revision: 1 } };
  const merged = progress.mergeInto(store, "player", incoming);
  assert.deepEqual(profile(merged).unfinishedQuiz, current.unfinishedQuiz);
  const imported = progress.importAsNew(store, incoming);
  assert.equal(profile(imported).unfinishedQuiz, null);
});
