(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_PROGRESS = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const STORAGE_KEY = "hello-world-progress";
  const SCHEMA_VERSION = 1;
  const TRANSFER_VERSION = 1;
  const MAX_STORED_BYTES = 1_000_000;
  const MAX_TRANSFER_CHARS = 100_000;
  const MAX_PROFILES = 50;
  const MAX_RECORDS = 2_000;
  const MAX_QUIZ_PLACES = 227;

  function now() { return new Date().toISOString(); }
  function validDate(value) { return typeof value === "string" && Number.isFinite(Date.parse(value)); }
  function cleanName(value, fallback = "Player 1") {
    const name = String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 40);
    return name || fallback;
  }
  function generateId(cryptoObject = globalThis.crypto) {
    if (cryptoObject?.randomUUID) return cryptoObject.randomUUID();
    const bytes = new Uint8Array(12);
    if (cryptoObject?.getRandomValues) cryptoObject.getRandomValues(bytes);
    else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
    return `profile-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  }
  function createProfile(name = "Player 1", options = {}) {
    const timestamp = options.now ?? now();
    return {
      id: options.id ?? generateId(options.cryptoObject),
      name: cleanName(name),
      createdAt: timestamp,
      updatedAt: timestamp,
      lastQuizId: null,
      savedMasteryAttempt: null,
      quizProgress: {},
    };
  }
  function createEmptyStore(options = {}) {
    const profile = createProfile(options.defaultName ?? "Player 1", options);
    return { schemaVersion: SCHEMA_VERSION, activeProfileId: profile.id, profiles: { [profile.id]: profile } };
  }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function normalizeRecord(value) {
    if (!value || typeof value !== "object") return null;
    const revision = Number(value.revision);
    const bestScore = Number(value.bestScore);
    const total = Number(value.total);
    if (!Number.isSafeInteger(revision) || revision < 1 || !Number.isSafeInteger(total) || total < 1 || total > MAX_QUIZ_PLACES || !Number.isSafeInteger(bestScore) || bestScore < 0 || bestScore > total) return null;
    return { revision, bestScore, total, lastPlayedAt: validDate(value.lastPlayedAt) ? value.lastPlayedAt : null };
  }

  function normalizeQuizProgress(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const result = {};
    let count = 0;
    for (const [quizId, raw] of Object.entries(value)) {
      if (count >= MAX_RECORDS || !/^[a-z0-9-]+:[a-z-]+$/.test(quizId)) continue;
      if (!raw?.revisions || typeof raw.revisions !== "object" || Array.isArray(raw.revisions)) continue;
      const records = Object.values(raw.revisions);
      const revisions = {};
      for (const candidate of records) {
        const record = normalizeRecord(candidate);
        if (record) revisions[String(record.revision)] = record;
      }
      if (Object.keys(revisions).length) { result[quizId] = { revisions }; count += 1; }
    }
    return result;
  }

  function normalizeAttempt(value) {
    if (!value || typeof value !== "object") return null;
    const revision = Number(value.revision);
    const questionIndex = Number(value.questionIndex);
    const score = Number(value.score);
    if (!/^[a-z0-9-]+:[a-z-]+$/.test(value.quizId ?? "") || !Number.isSafeInteger(revision) || revision < 1 || typeof value.attemptSeed !== "string" || value.attemptSeed.length > 100 || !Number.isSafeInteger(questionIndex) || questionIndex < 0 || questionIndex > MAX_QUIZ_PLACES || !Number.isSafeInteger(score) || score < 0 || score > questionIndex || !Array.isArray(value.answers) || value.answers.length !== questionIndex) return null;
    const answers = value.answers.map((answer) => ({
      targetCode: String(answer?.targetCode ?? ""),
      selectedCode: String(answer?.selectedCode ?? ""),
      correct: answer?.correct === true,
    }));
    if (answers.some((answer) => !/^[a-z]{2}$/.test(answer.targetCode) || !/^[a-z]{2}$/.test(answer.selectedCode))) return null;
    return {
      quizId: value.quizId, revision, attemptSeed: value.attemptSeed,
      questionIndex, score, answers,
      correctionPending: /^[a-z]{2}$/.test(value.correctionPending ?? "") ? value.correctionPending : null,
      startedAt: validDate(value.startedAt) ? value.startedAt : now(),
      updatedAt: validDate(value.updatedAt) ? value.updatedAt : now(),
    };
  }

  function normalizeProfile(value, fallbackId) {
    if (!value || typeof value !== "object") return null;
    const id = typeof value.id === "string" && /^[A-Za-z0-9._-]{3,80}$/.test(value.id) ? value.id : fallbackId;
    if (!id) return null;
    const createdAt = validDate(value.createdAt) ? value.createdAt : now();
    return {
      id, name: cleanName(value.name), createdAt,
      updatedAt: validDate(value.updatedAt) ? value.updatedAt : createdAt,
      lastQuizId: typeof value.lastQuizId === "string" && value.lastQuizId.length <= 100 ? value.lastQuizId : null,
      savedMasteryAttempt: normalizeAttempt(value.savedMasteryAttempt),
      quizProgress: normalizeQuizProgress(value.quizProgress),
    };
  }

  function validateRoot(value, options = {}) {
    if (!value || typeof value !== "object") return null;
    if (value.schemaVersion !== SCHEMA_VERSION) return null;
    const profiles = {};
    for (const [key, valueProfile] of Object.entries(value.profiles ?? {}).slice(0, MAX_PROFILES)) {
      const profile = normalizeProfile(valueProfile, key);
      if (profile && !profiles[profile.id]) profiles[profile.id] = profile;
    }
    if (!Object.keys(profiles).length) return createEmptyStore(options);
    const activeProfileId = profiles[value.activeProfileId] ? value.activeProfileId : Object.keys(profiles)[0];
    return { schemaVersion: SCHEMA_VERSION, activeProfileId, profiles };
  }

  function loadStore(storage, options = {}) {
    try {
      const serialized = storage?.getItem(STORAGE_KEY);
      if (!serialized) return { store: createEmptyStore(options), warning: null, needsSave: true };
      if (serialized.length > MAX_STORED_BYTES) throw new Error("Stored progress is too large");
      const store = validateRoot(JSON.parse(serialized), options);
      if (!store) throw new Error("Unsupported progress data");
      return { store, warning: null, needsSave: false };
    } catch (error) {
      return { store: createEmptyStore(options), warning: "storageReadFailed", needsSave: true, error };
    }
  }
  function saveStore(storage, store) {
    try {
      const normalized = validateRoot(store);
      if (!normalized) throw new Error("Invalid progress store");
      storage?.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return { ok: true, store: normalized };
    } catch (error) { return { ok: false, store, warning: "storageWriteFailed", error }; }
  }
  function activeProfile(store) { return store.profiles[store.activeProfileId] ?? Object.values(store.profiles)[0]; }
  function withProfile(store, profile) {
    return { ...store, profiles: { ...store.profiles, [profile.id]: profile } };
  }
  function currentRecord(profile, quiz) {
    return profile?.quizProgress?.[quiz.id]?.revisions?.[String(quiz.revision)] ?? null;
  }
  function quizState(profile, quiz) {
    const record = currentRecord(profile, quiz);
    if (!record) return "unplayed";
    return record.total === quiz.countryCodes.length && record.bestScore === record.total ? "mastered" : "played";
  }
  function matchingSavedAttempt(profile, quiz) {
    const attempt = profile?.savedMasteryAttempt;
    return attempt && quiz && attempt.quizId === quiz.id && attempt.revision === quiz.revision
      ? attempt
      : null;
  }
  function levelProgress(profile, level) {
    const states = level.quizzes.map((quiz) => quizState(profile, { ...quiz, countryCodes: level.countryCodes }));
    return { mastered: states.filter((state) => state === "mastered").length, played: states.filter((state) => state !== "unplayed").length, total: 4 };
  }
  function summary(profile, levels) {
    let masteredLevels = 0;
    let masteredQuizzes = 0;
    let playedQuizzes = 0;
    levels.forEach((level) => {
      const value = levelProgress(profile, level);
      masteredQuizzes += value.mastered;
      playedQuizzes += value.played;
      if (value.mastered === 4) masteredLevels += 1;
    });
    return { masteredLevels, masteredQuizzes, playedQuizzes, totalLevels: levels.length, totalQuizzes: levels.length * 4 };
  }
  function flatQuizzes(levels) {
    return levels.flatMap((level) => level.quizzes.map((quiz) => ({ ...quiz, countryCodes: level.countryCodes, levelId: level.id })));
  }
  function continueSelection(profile, levels) {
    const quizzes = flatQuizzes(levels);
    const last = quizzes.find((quiz) => quiz.id === profile?.lastQuizId);
    if (last && quizState(profile, last) !== "mastered") return { type: "quiz", quiz: last };
    const quiz = quizzes.find((candidate) => quizState(profile, candidate) !== "mastered");
    return quiz ? { type: "quiz", quiz } : { type: "all-mastered" };
  }
  function nextUnmastered(profile, levels, quizId) {
    const quizzes = flatQuizzes(levels);
    const start = Math.max(0, quizzes.findIndex((quiz) => quiz.id === quizId));
    for (let offset = 1; offset <= quizzes.length; offset += 1) {
      const quiz = quizzes[(start + offset) % quizzes.length];
      if (quizState(profile, quiz) !== "mastered") return quiz;
    }
    return null;
  }
  function surpriseQuiz(profile, levels, random = Math.random) {
    const quizzes = flatQuizzes(levels).filter((quiz) => quizState(profile, quiz) === "mastered");
    if (!quizzes.length) return null;
    const sorted = quizzes.sort((a, b) => String(currentRecord(profile, a)?.lastPlayedAt ?? "").localeCompare(String(currentRecord(profile, b)?.lastPlayedAt ?? "")));
    const pool = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 3)));
    return pool[Math.floor(random() * pool.length)];
  }

  function recordResult(store, profileId, quiz, score, options = {}) {
    const profile = store.profiles[profileId];
    const total = quiz.countryCodes.length;
    if (!profile || !Number.isSafeInteger(score) || score < 0 || score > total || !Number.isSafeInteger(quiz.revision) || quiz.revision < 1) return store;
    const timestamp = options.now ?? now();
    const existingEntry = profile.quizProgress[quiz.id] ?? { revisions: {} };
    const existing = existingEntry.revisions[String(quiz.revision)];
    const record = { revision: quiz.revision, bestScore: Math.max(existing?.bestScore ?? 0, score), total, lastPlayedAt: timestamp };
    const updated = { ...profile, updatedAt: timestamp, lastQuizId: quiz.id, quizProgress: { ...profile.quizProgress, [quiz.id]: { revisions: { ...existingEntry.revisions, [String(quiz.revision)]: record } } } };
    return withProfile(store, updated);
  }
  function addProfile(store, name, options = {}) {
    const profile = createProfile(name, options);
    return { ...withProfile(store, profile), activeProfileId: profile.id };
  }
  function switchProfile(store, profileId) { return store.profiles[profileId] ? { ...store, activeProfileId: profileId } : store; }
  function renameProfile(store, profileId, name, options = {}) {
    const profile = store.profiles[profileId];
    return profile ? withProfile(store, { ...profile, name: cleanName(name, profile.name), updatedAt: options.now ?? now() }) : store;
  }
  function clearProgress(store, profileId, options = {}) {
    const profile = store.profiles[profileId];
    return profile ? withProfile(store, { ...profile, quizProgress: {}, lastQuizId: null, savedMasteryAttempt: null, updatedAt: options.now ?? now() }) : store;
  }
  function deleteProfile(store, profileId, options = {}) {
    if (!store.profiles[profileId]) return store;
    const profiles = { ...store.profiles }; delete profiles[profileId];
    if (!Object.keys(profiles).length) return createEmptyStore(options);
    return { ...store, profiles, activeProfileId: store.activeProfileId === profileId ? Object.keys(profiles)[0] : store.activeProfileId };
  }
  function saveMasteryAttempt(store, profileId, attempt, options = {}) {
    const profile = store.profiles[profileId];
    const normalized = normalizeAttempt({ ...attempt, updatedAt: options.now ?? now() });
    return profile && normalized ? withProfile(store, { ...profile, savedMasteryAttempt: normalized, updatedAt: normalized.updatedAt }) : store;
  }
  function abandonMasteryAttempt(store, profileId, options = {}) {
    const profile = store.profiles[profileId];
    return profile ? withProfile(store, { ...profile, savedMasteryAttempt: null, updatedAt: options.now ?? now() }) : store;
  }

  function transferableProfile(profile) {
    const quizProgress = {};
    for (const [quizId, entry] of Object.entries(profile.quizProgress ?? {})) quizProgress[quizId] = { revisions: clone(entry.revisions) };
    return { id: profile.id, name: profile.name, createdAt: profile.createdAt, updatedAt: profile.updatedAt, lastQuizId: profile.lastQuizId, quizProgress };
  }
  function compactProfile(profile) {
    const records = [];
    for (const [quizId, entry] of Object.entries(profile.quizProgress ?? {})) {
      for (const record of Object.values(entry.revisions ?? {})) {
        records.push([
          quizId,
          record.revision,
          record.bestScore,
          record.total,
          record.lastPlayedAt,
        ]);
      }
    }
    return { i: profile.id, n: profile.name, c: profile.createdAt, u: profile.updatedAt, l: profile.lastQuizId, q: records };
  }
  function expandProfile(value) {
    if (!value || !Array.isArray(value.q)) return null;
    const quizProgress = {};
    for (const row of value.q.slice(0, MAX_RECORDS)) {
      if (!Array.isArray(row) || row.length !== 5 || !validDate(row[4])) return null;
      const record = normalizeRecord({ revision: row[1], bestScore: row[2], total: row[3], lastPlayedAt: row[4] });
      if (!record || !/^[a-z0-9-]+:[a-z-]+$/.test(row[0])) return null;
      const entry = quizProgress[row[0]] ?? { revisions: {} };
      entry.revisions[String(record.revision)] = record;
      quizProgress[row[0]] = entry;
    }
    return normalizeProfile({ id: value.i, name: value.n, createdAt: value.c, updatedAt: value.u, lastQuizId: value.l, quizProgress }, value.i);
  }
  function utf8ToBase64Url(text) {
    if (typeof Buffer !== "undefined") return Buffer.from(text, "utf8").toString("base64url");
    const bytes = new TextEncoder().encode(text); let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
  }
  function base64UrlToUtf8(value) {
    if (typeof Buffer !== "undefined") return Buffer.from(value, "base64url").toString("utf8");
    const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
    const binary = atob(padded); const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  function crc32(text) {
    let crc = -1;
    const bytes = typeof TextEncoder !== "undefined" ? new TextEncoder().encode(text) : Buffer.from(text);
    for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); }
    return ((crc ^ -1) >>> 0).toString(36);
  }
  function encodeTransfer(profile) {
    const body = JSON.stringify({ v: TRANSFER_VERSION, p: compactProfile(profile) });
    return `${utf8ToBase64Url(body)}.${crc32(body)}`;
  }
  function decodeTransfer(payload) {
    if (typeof payload !== "string" || payload.length < 5 || payload.length > MAX_TRANSFER_CHARS || !/^[A-Za-z0-9_.-]+$/.test(payload)) throw new Error("Invalid transfer payload");
    const separator = payload.lastIndexOf(".");
    if (separator < 1) throw new Error("Missing transfer checksum");
    const body = base64UrlToUtf8(payload.slice(0, separator));
    if (crc32(body) !== payload.slice(separator + 1)) throw new Error("Transfer checksum mismatch");
    const value = JSON.parse(body);
    if (value.v !== TRANSFER_VERSION) throw new Error("Unsupported transfer version");
    const profile = expandProfile(value.p);
    if (!profile) throw new Error("Invalid transferred profile");
    return profile;
  }
  function mergeProfiles(existing, imported, options = {}) {
    const merged = clone(existing);
    for (const [quizId, entry] of Object.entries(imported.quizProgress ?? {})) {
      const target = merged.quizProgress[quizId] ?? { revisions: {} };
      for (const record of Object.values(entry.revisions ?? {})) {
        const current = target.revisions[String(record.revision)];
        if (!current || record.bestScore > current.bestScore || (record.bestScore === current.bestScore && String(record.lastPlayedAt ?? "") > String(current.lastPlayedAt ?? ""))) target.revisions[String(record.revision)] = clone(record);
      }
      merged.quizProgress[quizId] = target;
    }
    if (String(imported.updatedAt ?? "") > String(existing.updatedAt ?? "")) merged.lastQuizId = imported.lastQuizId ?? merged.lastQuizId;
    merged.updatedAt = options.now ?? [existing.updatedAt, imported.updatedAt].sort().at(-1) ?? now();
    merged.savedMasteryAttempt = existing.savedMasteryAttempt ?? null;
    return merged;
  }
  function importAsNew(store, imported, options = {}) {
    let id = imported.id;
    if (store.profiles[id]) id = generateId(options.cryptoObject);
    const profile = { ...clone(imported), id, name: cleanName(imported.name), savedMasteryAttempt: null };
    return { ...withProfile(store, profile), activeProfileId: id };
  }
  function mergeInto(store, profileId, imported) {
    const existing = store.profiles[profileId];
    return existing ? withProfile(store, mergeProfiles(existing, imported)) : store;
  }
  function createBackup(store) {
    return JSON.stringify({ schemaVersion: SCHEMA_VERSION, backupVersion: 1, profiles: Object.values(store.profiles).map(transferableProfile) }, null, 2);
  }
  function parseBackup(text) {
    if (typeof text !== "string" || text.length > MAX_STORED_BYTES) throw new Error("Invalid backup file");
    const value = JSON.parse(text);
    if (value.backupVersion !== 1 || !Array.isArray(value.profiles) || value.profiles.length > MAX_PROFILES) throw new Error("Unsupported backup file");
    const profiles = value.profiles.map((profile) => normalizeProfile({ ...profile, savedMasteryAttempt: null }, profile?.id)).filter(Boolean);
    if (!profiles.length) throw new Error("Backup contains no profiles");
    return profiles;
  }

  return Object.freeze({
    STORAGE_KEY, SCHEMA_VERSION, TRANSFER_VERSION, createProfile, createEmptyStore,
    validateRoot, loadStore, saveStore, activeProfile, currentRecord, quizState,
    matchingSavedAttempt,
    levelProgress, summary, continueSelection, nextUnmastered, surpriseQuiz,
    recordResult, addProfile, switchProfile, renameProfile, clearProgress,
    deleteProfile, saveMasteryAttempt, abandonMasteryAttempt, transferableProfile,
    encodeTransfer, decodeTransfer, mergeProfiles, importAsNew, mergeInto,
    createBackup, parseBackup, cleanName,
  });
});
