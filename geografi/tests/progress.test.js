"use strict";

const assert = require("node:assert/strict");
global.window = global;
require("../countries.js");
const curriculum = require("../curriculum.js");
const progress = require("../progress.js");

const clock = { now: "2026-08-22T10:00:00.000Z", id: "profile-one" };
let store = progress.createEmptyStore(clock);
assert.equal(progress.activeProfile(store).name, "Player 1");
assert.equal(store.activeProfileId, "profile-one");
const firstQuiz = curriculum.quizById.get("tour-hello-world:country-flag");

store = progress.recordResult(store, store.activeProfileId, firstQuiz, 5, { now: "2026-08-22T10:01:00.000Z" });
store = progress.recordResult(store, store.activeProfileId, firstQuiz, 3, { now: "2026-08-22T10:02:00.000Z" });
assert.equal(progress.currentRecord(progress.activeProfile(store), firstQuiz).bestScore, 5);
assert.equal(progress.quizState(progress.activeProfile(store), firstQuiz), "played");
store = progress.recordResult(store, store.activeProfileId, firstQuiz, 9, { now: "2026-08-22T10:03:00.000Z" });
assert.equal(progress.quizState(progress.activeProfile(store), firstQuiz), "mastered");
assert.equal(progress.quizState(progress.activeProfile(store), { ...firstQuiz, revision: 2 }), "unplayed");
const mismatched = JSON.parse(JSON.stringify(progress.activeProfile(store)));
mismatched.quizProgress[firstQuiz.id].revisions["1"].total = 8;
mismatched.quizProgress[firstQuiz.id].revisions["1"].bestScore = 8;
assert.equal(progress.quizState(mismatched, firstQuiz), "played");

assert.equal(progress.continueSelection(progress.activeProfile(store), curriculum.levels).quiz.id, curriculum.levels[0].quizzes[1].id);
const originalId = store.activeProfileId;
store = progress.addProfile(store, "Ada", { id: "profile-two", now: clock.now });
assert.equal(store.activeProfileId, "profile-two");
assert.equal(progress.activeProfile(store).quizProgress[firstQuiz.id], undefined);
store = progress.switchProfile(store, originalId);
assert.equal(progress.activeProfile(store).name, "Player 1");
store = progress.renameProfile(store, originalId, "Lance");
assert.equal(progress.activeProfile(store).name, "Lance");

const attempt = {
  quizId: "mastery-europe:country-flag", revision: 1, attemptSeed: "fixed-attempt",
  questionIndex: 1, score: 0,
  answers: [{ targetCode: "no", selectedCode: "se", correct: false }],
  correctionPending: "no", startedAt: clock.now, updatedAt: clock.now,
};
store = progress.saveMasteryAttempt(store, originalId, attempt);
assert.deepEqual(progress.activeProfile(store).savedMasteryAttempt.answers, attempt.answers);
store = progress.abandonMasteryAttempt(store, originalId);
assert.equal(progress.activeProfile(store).savedMasteryAttempt, null);

const payload = progress.encodeTransfer(progress.activeProfile(store));
const decoded = progress.decodeTransfer(payload);
assert.equal(decoded.name, "Lance");
assert.equal(progress.currentRecord(decoded, firstQuiz).bestScore, 9);
assert.throws(() => progress.decodeTransfer(`${payload.slice(0, -1)}${payload.endsWith("x") ? "y" : "x"}`));
assert.throws(() => progress.decodeTransfer("a".repeat(100_001)));

const weak = progress.createProfile("Lance", { id: originalId, now: clock.now });
weak.quizProgress = progress.recordResult({ schemaVersion: 1, activeProfileId: originalId, profiles: { [originalId]: weak } }, originalId, firstQuiz, 2).profiles[originalId].quizProgress;
const merged = progress.mergeProfiles(weak, decoded);
assert.equal(progress.currentRecord(merged, firstQuiz).bestScore, 9);
assert.deepEqual(progress.mergeProfiles(merged, decoded).quizProgress, merged.quizProgress);

const beforePreview = JSON.stringify(store);
progress.decodeTransfer(payload);
assert.equal(JSON.stringify(store), beforePreview, "preview must not mutate");

const backup = progress.createBackup(store);
const profiles = progress.parseBackup(backup);
assert.equal(profiles.length, 2);
assert.ok(profiles.every((profile) => profile.savedMasteryAttempt === null));

let completedStore = progress.createEmptyStore({ id: "complete-profile", now: clock.now });
for (const level of curriculum.levels) {
  for (const baseQuiz of level.quizzes) {
    const quiz = curriculum.quizById.get(baseQuiz.id);
    completedStore = progress.recordResult(completedStore, "complete-profile", quiz, quiz.countryCodes.length);
  }
}
assert.equal(progress.summary(progress.activeProfile(completedStore), curriculum.levels).masteredQuizzes, 188);
assert.deepEqual(progress.continueSelection(progress.activeProfile(completedStore), curriculum.levels), { type: "all-mastered" });
assert.ok(progress.surpriseQuiz(progress.activeProfile(completedStore), curriculum.levels));
assert.ok(progress.encodeTransfer(progress.activeProfile(completedStore)).length < 20_000);

const cleared = progress.clearProgress(store, originalId);
assert.equal(cleared.profiles[originalId].name, "Lance");
assert.deepEqual(cleared.profiles[originalId].quizProgress, {});
const deleted = progress.deleteProfile(store, originalId);
assert.equal(deleted.profiles[originalId], undefined);
assert.equal(deleted.activeProfileId, "profile-two");

const memory = new Map();
const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
const empty = progress.loadStore(storage, clock);
assert.equal(empty.needsSave, true);
assert.equal(progress.saveStore(storage, empty.store).ok, true);
assert.equal(progress.loadStore(storage).warning, null);
memory.set(progress.STORAGE_KEY, "not-json");
assert.equal(progress.loadStore(storage, clock).warning, "storageReadFailed");
const unavailableStorage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
assert.equal(progress.loadStore(unavailableStorage, clock).warning, "storageReadFailed");
assert.equal(progress.saveStore(unavailableStorage, store).warning, "storageWriteFailed");

console.log("Progress tests passed.");
