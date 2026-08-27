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
assert.equal(
  progress.matchingSavedAttempt(progress.activeProfile(store), {
    id: attempt.quizId,
    revision: attempt.revision,
  })?.attemptSeed,
  attempt.attemptSeed,
);
assert.equal(
  progress.matchingSavedAttempt(progress.activeProfile(store), {
    id: attempt.quizId,
    revision: attempt.revision + 1,
  }),
  null,
);
assert.equal(
  progress.matchingSavedAttempt(progress.activeProfile(store), {
    id: "mastery-europe:flag-country",
    revision: attempt.revision,
  }),
  null,
);
store = progress.abandonMasteryAttempt(store, originalId);
assert.equal(progress.activeProfile(store).savedMasteryAttempt, null);

const payload = progress.encodeTransfer(progress.activeProfile(store));
const decoded = progress.decodeTransfer(payload);
assert.equal(decoded.name, "Lance");
assert.equal(progress.currentRecord(decoded, firstQuiz).bestScore, 9);
assert.equal(
  progress.currentRecord(decoded, firstQuiz).lastPlayedAt,
  "2026-08-22T10:03:00.000Z",
);
assert.throws(() => progress.decodeTransfer(`${payload.slice(0, -1)}${payload.endsWith("x") ? "y" : "x"}`));
assert.throws(() => progress.decodeTransfer("a".repeat(100_001)));

function transferChecksum(text) {
  let crc = -1;
  for (const byte of new TextEncoder().encode(text)) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ((crc ^ -1) >>> 0).toString(36);
}

function encodeTransferValue(value) {
  const body = JSON.stringify(value);
  return `${Buffer.from(body, "utf8").toString("base64url")}.${transferChecksum(body)}`;
}

const transferValue = JSON.parse(
  Buffer.from(payload.split(".")[0], "base64url").toString("utf8"),
);
const incompleteTransfer = structuredClone(transferValue);
incompleteTransfer.p.q[0].pop();
assert.throws(() => progress.decodeTransfer(encodeTransferValue(incompleteTransfer)));
const invalidTimestampTransfer = structuredClone(transferValue);
invalidTimestampTransfer.p.q[0][4] = "not-a-date";
assert.throws(() => progress.decodeTransfer(encodeTransferValue(invalidTimestampTransfer)));

const weak = progress.createProfile("Lance", { id: originalId, now: clock.now });
weak.quizProgress = progress.recordResult({ schemaVersion: 1, activeProfileId: originalId, profiles: { [originalId]: weak } }, originalId, firstQuiz, 2).profiles[originalId].quizProgress;
const merged = progress.mergeProfiles(weak, decoded);
assert.equal(progress.currentRecord(merged, firstQuiz).bestScore, 9);
assert.deepEqual(progress.mergeProfiles(merged, decoded).quizProgress, merged.quizProgress);

let equalScoreStore = progress.createEmptyStore({ id: originalId, now: clock.now });
equalScoreStore = progress.recordResult(
  equalScoreStore,
  originalId,
  firstQuiz,
  9,
  { now: "2026-08-22T10:02:00.000Z" },
);
const recencyMerged = progress.mergeProfiles(
  progress.activeProfile(equalScoreStore),
  decoded,
);
assert.equal(
  progress.currentRecord(recencyMerged, firstQuiz).lastPlayedAt,
  "2026-08-22T10:03:00.000Z",
);

const secondQuiz = curriculum.quizById.get("tour-hello-world:flag-country");
let recencyStore = progress.createEmptyStore({ id: "recency-profile", now: clock.now });
recencyStore = progress.recordResult(
  recencyStore,
  "recency-profile",
  firstQuiz,
  firstQuiz.countryCodes.length,
  { now: "2026-08-22T10:03:00.000Z" },
);
recencyStore = progress.recordResult(
  recencyStore,
  "recency-profile",
  secondQuiz,
  secondQuiz.countryCodes.length,
  { now: "2026-08-22T10:04:00.000Z" },
);
const recencyProfile = progress.decodeTransfer(
  progress.encodeTransfer(progress.activeProfile(recencyStore)),
);
assert.equal(
  progress.surpriseQuiz(recencyProfile, curriculum.levels, () => 0).id,
  firstQuiz.id,
);

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
assert.equal(progress.summary(progress.activeProfile(completedStore), curriculum.levels).masteredQuizzes, 232);
assert.deepEqual(progress.continueSelection(progress.activeProfile(completedStore), curriculum.levels), { type: "all-mastered" });
assert.ok(progress.surpriseQuiz(progress.activeProfile(completedStore), curriculum.levels));
assert.ok(progress.encodeTransfer(progress.activeProfile(completedStore)).length < 25_000);

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
const obsoleteProfile = progress.createProfile("Old shape", {
  id: "obsolete-profile",
  now: clock.now,
});
obsoleteProfile.quizProgress[firstQuiz.id] = {
  revision: 1,
  bestScore: 9,
  total: 9,
  lastPlayedAt: clock.now,
};
const normalizedObsoleteStore = progress.validateRoot({
  schemaVersion: 1,
  activeProfileId: obsoleteProfile.id,
  profiles: { [obsoleteProfile.id]: obsoleteProfile },
});
assert.equal(
  normalizedObsoleteStore.profiles[obsoleteProfile.id].quizProgress[firstQuiz.id],
  undefined,
);
assert.equal(
  progress.validateRoot({ ...normalizedObsoleteStore, schemaVersion: 0 }),
  null,
);
memory.set(progress.STORAGE_KEY, "not-json");
assert.equal(progress.loadStore(storage, clock).warning, "storageReadFailed");
const unavailableStorage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
assert.equal(progress.loadStore(unavailableStorage, clock).warning, "storageReadFailed");
assert.equal(progress.saveStore(unavailableStorage, store).warning, "storageWriteFailed");

console.log("Progress tests passed.");
