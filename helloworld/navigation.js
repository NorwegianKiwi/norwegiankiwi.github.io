(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_NAVIGATION = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VIEWS = new Set(["levels", "explore", "quiz", "cards"]);
  const CHALLENGE_KEYS = ["cv", "quiz", "rev", "score", "proof"];

  function hasSpecialPayload(url) {
    return (
      CHALLENGE_KEYS.some((key) => url.searchParams.has(key)) ||
      /^#progress=/.test(url.hash)
    );
  }

  function readUrl(value, { quizById, levelById, regionIds }) {
    const url = value instanceof URL ? value : new URL(value);
    if (hasSpecialPayload(url)) return null;

    const view = url.searchParams.get("view");
    if (!view) return { screen: "setup" };
    if (!VIEWS.has(view)) return { screen: "setup" };

    const levelId = url.searchParams.get("level");
    const validLevelId = levelById.has(levelId) ? levelId : null;
    const region = regionIds.has(url.searchParams.get("region"))
      ? url.searchParams.get("region")
      : "world";

    if (view === "levels") {
      return { screen: "levels", levelId: validLevelId };
    }

    if (view === "explore") {
      return { screen: "explore", levelId: validLevelId, region };
    }

    if (view === "quiz") {
      const quizId = url.searchParams.get("id");
      const source = url.searchParams.get("source") === "levels"
        ? "levels"
        : "home";
      if (!quizById.has(quizId)) {
        return source === "levels"
          ? { screen: "levels", levelId: null }
          : { screen: "setup" };
      }
      return { screen: "quiz", quizId, source };
    }

    const source = url.searchParams.get("source");
    if (source === "level") {
      return validLevelId
        ? { screen: "flashcards", source, levelId: validLevelId }
        : { screen: "levels", levelId: null };
    }
    if (source === "explore") {
      return {
        screen: "flashcards",
        source,
        levelId: validLevelId,
        region,
      };
    }
    return { screen: "setup" };
  }

  function createUrl(value, route, locale = "nb") {
    const url = value instanceof URL ? new URL(value.href) : new URL(value);
    url.search = "";
    url.hash = "";
    if (locale === "en") url.searchParams.set("lang", "en");

    if (!route || route.screen === "setup") return url;

    if (route.screen === "levels") {
      url.searchParams.set("view", "levels");
      if (route.levelId) url.searchParams.set("level", route.levelId);
      return url;
    }

    if (route.screen === "explore") {
      url.searchParams.set("view", "explore");
      if (route.levelId) url.searchParams.set("level", route.levelId);
      if (!route.levelId && route.region && route.region !== "world") {
        url.searchParams.set("region", route.region);
      }
      return url;
    }

    if (route.screen === "quiz") {
      url.searchParams.set("view", "quiz");
      url.searchParams.set("id", route.quizId);
      url.searchParams.set("source", route.source === "levels" ? "levels" : "home");
      return url;
    }

    if (route.screen === "flashcards") {
      url.searchParams.set("view", "cards");
      url.searchParams.set("source", route.source);
      if (route.levelId) url.searchParams.set("level", route.levelId);
      if (route.source === "explore" && !route.levelId && route.region && route.region !== "world") {
        url.searchParams.set("region", route.region);
      }
      return url;
    }

    return url;
  }

  return { readUrl, createUrl, hasSpecialPayload };
});
