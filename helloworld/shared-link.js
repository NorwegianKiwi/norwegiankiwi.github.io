(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_SHARED_LINK = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const CHALLENGE_KEYS = ["cv", "quiz", "rev", "score", "proof"];
  const EMBEDDED_URL = /(?:https?|file):\/\/[^\s<>"']+/giu;

  function normalizedAppPath(url) {
    const withoutIndex = url.pathname.replace(/\/index\.html$/, "/");
    return withoutIndex.endsWith("/") ? withoutIndex : `${withoutIndex}/`;
  }

  function trimUrlPunctuation(value) {
    return value.replace(/[),.;!?]+$/u, "");
  }

  function extractUrl(value) {
    const text = String(value ?? "").trim();
    if (!text) return { error: "sharedLinkRequired" };

    try {
      return { url: new URL(text) };
    } catch {
      const matches = [...text.matchAll(EMBEDDED_URL)]
        .map((match) => trimUrlPunctuation(match[0]));
      if (matches.length !== 1) return { error: "sharedLinkMalformed" };
      try {
        return { url: new URL(matches[0]) };
      } catch {
        return { error: "sharedLinkMalformed" };
      }
    }
  }

  function classify(value, currentValue, dependencies) {
    const extracted = extractUrl(value);
    if (!extracted.url) return extracted;

    const sourceUrl = extracted.url;
    const currentUrl = currentValue instanceof URL
      ? currentValue
      : new URL(currentValue);
    const canonicalUrl = dependencies.canonicalUrl
      ? new URL(dependencies.canonicalUrl)
      : null;
    const matches = (candidate) => Boolean(
      candidate &&
      sourceUrl.origin === candidate.origin &&
      normalizedAppPath(sourceUrl) === normalizedAppPath(candidate)
    );
    const localDevelopment = currentUrl.protocol === "file:" ||
      ["localhost", "127.0.0.1", "[::1]"].includes(currentUrl.hostname);
    const matchesCurrentDevelopmentCopy = (localDevelopment || !canonicalUrl) && matches(currentUrl);
    if (!matches(canonicalUrl) && !matchesCurrentDevelopmentCopy) {
      return { error: "sharedLinkWrongApp" };
    }

    const locale = sourceUrl.searchParams.get("lang") === "en" ? "en" : "nb";
    if (CHALLENGE_KEYS.some((key) => sourceUrl.searchParams.has(key))) {
      const recipe = dependencies.readChallenge(sourceUrl, dependencies.quizById);
      return recipe?.valid
        ? { kind: "challenge", locale, recipe, url: sourceUrl }
        : { error: "sharedLinkInvalidChallenge" };
    }

    const transferMatch = sourceUrl.hash.match(/^#progress=(.+)$/);
    if (transferMatch) {
      try {
        dependencies.decodeTransfer(transferMatch[1]);
        return {
          kind: "transfer",
          locale,
          payload: transferMatch[1],
          url: sourceUrl,
        };
      } catch {
        return { error: "sharedLinkInvalidTransfer" };
      }
    }

    const allowedInvitationKeys = new Set(["lang"]);
    const invitation = !sourceUrl.hash && [...sourceUrl.searchParams.keys()]
      .every((key) => allowedInvitationKeys.has(key));
    return invitation
      ? { kind: "invitation", locale, url: sourceUrl }
      : { error: "sharedLinkUnsupported" };
  }

  return { classify, extractUrl, normalizedAppPath };
});
