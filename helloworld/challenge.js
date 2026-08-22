(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_CHALLENGE = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = 2;

  function base64Url(bytes) {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary)
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replace(/=+$/, "");
  }

  function proofMessage({ quizId, revision, score }) {
    return `hello-world-curriculum-challenge|${VERSION}|${quizId}|${revision}|${score}`;
  }

  async function createScoreProof(recipe, cryptoObject = globalThis.crypto) {
    if (!cryptoObject?.subtle) throw new Error("Score proof requires Web Crypto");
    const digest = await cryptoObject.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(proofMessage(recipe)),
    );
    return base64Url(new Uint8Array(digest).slice(0, 8));
  }

  async function verifyScoreProof(recipe, proof, cryptoObject = globalThis.crypto) {
    if (!/^[A-Za-z0-9_-]{11}$/.test(String(proof ?? ""))) return false;
    try {
      return (await createScoreProof(recipe, cryptoObject)) === proof;
    } catch {
      return false;
    }
  }

  function readUrl(value, quizById) {
    const url = value instanceof URL ? value : new URL(value);
    const keys = ["cv", "quiz", "rev", "score", "proof"];
    if (!keys.some((key) => url.searchParams.has(key))) return null;

    const quizId = url.searchParams.get("quiz");
    const quiz = quizById.get(quizId);
    const revision = Number(url.searchParams.get("rev"));
    if (Number(url.searchParams.get("cv")) !== VERSION || !quiz || revision !== quiz.revision) {
      return { valid: false };
    }
    return {
      valid: true,
      quizId,
      revision,
      scoreParam: url.searchParams.get("score"),
      proof: url.searchParams.get("proof"),
    };
  }

  function createUrl(value, recipe, locale = "nb") {
    const url = value instanceof URL ? new URL(value.href) : new URL(value);
    url.search = "";
    url.hash = "";
    if (locale === "en") url.searchParams.set("lang", "en");
    url.searchParams.set("cv", String(VERSION));
    url.searchParams.set("quiz", recipe.quizId);
    url.searchParams.set("rev", String(recipe.revision));
    if (recipe.score !== null && recipe.score !== undefined) {
      url.searchParams.set("score", String(recipe.score));
    }
    if (recipe.proof) url.searchParams.set("proof", recipe.proof);
    return url;
  }

  return { VERSION, createScoreProof, verifyScoreProof, readUrl, createUrl };
});
