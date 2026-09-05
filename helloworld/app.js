(function () {
  "use strict";

  const localization = window.GEOGRAFI_LOCALIZATION;
  if (!localization) {
    throw new Error("Hello World! could not load its localization data.");
  }
  const { supportedLocales } = localization;
  const mapView = window.GEOGRAFI_MAP_VIEW;
  if (!mapView) {
    throw new Error("Hello World! could not load its map view helpers.");
  }
  const {
    clamp,
    distance: mapPointerDistance,
    fitViewBoxToAspect: fitMapViewBoxToAspect,
    midpoint: mapPointerMidpoint,
    nearbyViewBox: nearbyMapViewBox,
    parseViewBox: parseMapViewBox,
    serializeViewBox: serializeMapViewBox,
    transformPoint: screenPointToMap,
    viewBoxesEqual: mapViewBoxesEqual,
    zoomForViewport: zoomForMapViewport,
  } = mapView;
  const initialUrl = new URL(window.location.href);
  const initialLocale = supportedLocales.includes(
    initialUrl.searchParams.get("lang"),
  )
    ? initialUrl.searchParams.get("lang")
    : "nb";
  const resultPreviewNames = new Set([
    "result-next-quiz", "result-next-level", "result-failed-next", "result-failed-no-next", "share-fallback",
    "result-failed-next-quiz", "result-skip-quiz", "result-failed-skip-quiz",
    "result-skip-level", "result-failed-skip-level", "result-wrap",
    "result-failed-wrap", "result-new-record", "result-below-best",
    "result-replay-mastered", "result-all-mastered", "result-failed-all-mastered",
  ]);
  const initialPreview = new Set([
    "puzzle-first", "puzzle-partial", "puzzle-final", "puzzle-replay", "puzzle-collection",
    "puzzle-level", "puzzle-world", "puzzle-missing-image",
    "puzzle-view-empty", "puzzle-view-partial", "puzzle-view-complete",
    ...resultPreviewNames, "milestone-result", "milestone-celebration",
    "milestone-question", "milestone-replay", "level-final-gap-question", "navigator-tourist-gap-question",
    "tourist-world-final-question", "final-question", "final-result", "final-celebration",
  ]).has(initialUrl.searchParams.get("preview"))
    ? initialUrl.searchParams.get("preview")
    : null;
  const data = window.GEOGRAFI_QUIZ_DATA;
  const mapData = window.GEOGRAFI_QUIZ_MAP_DATA;
  const challenge = window.GEOGRAFI_CHALLENGE;
  const sharedLink = window.GEOGRAFI_SHARED_LINK;
  const sharing = window.GEOGRAFI_SHARING;
  const exploreState = window.GEOGRAFI_EXPLORE_STATE;
  const navigation = window.GEOGRAFI_NAVIGATION;
  const curriculum = window.GEOGRAFI_CURRICULUM;
  const progress = window.GEOGRAFI_PROGRESS;
  const puzzles = window.GEOGRAFI_PUZZLES;
  const app = document.getElementById("app");

  if (!data || !mapData || !challenge || !sharedLink || !sharing || !exploreState || !navigation || !curriculum || !progress || !puzzles || !app) {
    throw new Error(
      initialLocale === "en"
        ? "Hello World! could not load the country data."
        : "Hei verden! kunne ikke laste landdataene.",
    );
  }

  const { countries: officialCountries, places = officialCountries, regionOptions } = data;
  const countries = places;
  const mapSelectableRegions = [
    "europe",
    "africa",
    "asia-west",
    "asia-east",
    "oceania",
    "north-central-america",
    "south-america",
    "caribbean",
  ];
  const countriesByCode = new Map(
    countries.map((country) => [country.code, country]),
  );

  const modes = [
    {
      id: "country-flag",
      shortLabelKey: "modeCountryFlagShort",
    },
    {
      id: "flag-country",
      shortLabelKey: "modeFlagCountryShort",
    },
    {
      id: "country-capital",
      shortLabelKey: "modeCountryCapitalShort",
    },
    {
      id: "map-country",
      shortLabelKey: "modeMapCountryShort",
    },
  ];
  const modesById = new Map(modes.map((mode) => [mode.id, mode]));
  const regionsById = new Map(
    regionOptions.map((region) => [region.id, region]),
  );

  const initialChallenge = challenge.readUrl(initialUrl, curriculum.quizById);
  const navigationContext = {
    quizById: curriculum.quizById,
    levelById: curriculum.levelById,
    regionIds: new Set(regionOptions.map((region) => region.id)),
  };
  const initialRoute = navigation.readUrl(initialUrl, navigationContext);

  let browserStorage = null;
  try { browserStorage = window.localStorage; } catch { browserStorage = null; }
  const loadedProgress = progress.loadStore(browserStorage, { defaultName: "Player 1" });
  const realProgressStore = loadedProgress.store;
  let progressStore = realProgressStore;
  let storageWarning = loadedProgress.warning;
  if (loadedProgress.needsSave) {
    const saved = progress.saveStore(browserStorage, progressStore);
    if (!saved.ok) storageWarning = saved.warning;
  }
  let transferPreview = null;
  let transferError = false;
  const transferMatch = initialUrl.hash.match(/^#progress=(.+)$/);
  if (transferMatch) {
    try { transferPreview = [progress.decodeTransfer(transferMatch[1])]; }
    catch { transferError = true; }
  }

  const state = {
    locale: initialLocale,
    screen:
      initialChallenge?.valid === true
        ? "challenge-intro"
        : initialChallenge?.valid === false
          ? "challenge-error"
          : transferPreview || transferError ? "import" : "setup",
    mode: initialChallenge?.valid
      ? curriculum.quizById.get(initialChallenge.quizId)?.mode ?? "country-flag"
      : "country-flag",
    region: regionsById.has(initialUrl.searchParams.get("region"))
        ? initialUrl.searchParams.get("region")
        : "world",
    challengeActive: initialChallenge?.valid === true,
    curriculumQuizId: initialChallenge?.valid ? initialChallenge.quizId : null,
    activeLevelId: initialChallenge?.valid ? curriculum.quizById.get(initialChallenge.quizId)?.levelId : null,
    attemptSeed: null,
    attemptAnswers: [],
    resultRecorded: false,
    resultBestScore: null,
    resultPreviousBestScore: null,
    resultNewQuizMastery: false,
    resultNewLevelMastery: false,
    resultNewStageMastery: false,
    resultCelebrationPending: false,
    puzzleRewardPending: false,
    puzzleRewardOpen: false,
    puzzleStageId: null,
    puzzleZoom: 1,
    resultPreview: null,
    previewMode: initialPreview,
    profilePanelOpen: false,
    actionDialog: null,
    importProfiles: transferPreview,
    importError: transferError,
    importSource: transferPreview || transferError ? "transfer" : null,
    selectedLevelId: null,
    flashcardReturn: "home",
    quizReturn: "home",
    challengeTargetScore: null,
    challengeScoreVerified: false,
    challengeScoreWarning: initialChallenge?.valid === true,
    challengeScoreParam: initialChallenge?.valid
      ? initialChallenge.scoreParam
      : null,
    challengeProof: initialChallenge?.valid ? initialChallenge.proof : null,
    questions: [],
    questionIndex: 0,
    selectedCode: null,
    answerStatus: "unanswered",
    quizMapArea: "region",
    silhouetteExpanded: false,
    score: 0,
    wrongAnswers: [],
    flashcards: [],
    flashcardIndex: 0,
    flashcardRevealed: false,
    countryDetailsCode: null,
    exploreScope: null,
    exploreReturn: null,
    installHelpOpen: false,
    openChallengeOpen: false,
    openChallengeValue: "",
    openChallengeError: null,
    worldCelebrationOpen: false,
    worldCelebrationOrigin: null,
    worldCelebrationSettled: false,
    milestoneCelebrationStageId: null,
    milestoneCelebrationOrigin: null,
    milestoneCelebrationReturnScrollY: null,
    milestoneCelebrationSettled: false,
    exploreRegionPickerOpen: false,
    explorePinnedCode: null,
    explorePreviewCode: null,
    exploreMapViewport: null,
    exploreMapExtent: null,
  };
  let deferredInstallPrompt = null;
  let autoAdvanceTimer = null;
  const actionFeedbackTimers = new WeakMap();
  let actionFeedbackToastTimer = null;
  let worldCelebrationTimer = null;
  let milestoneCelebrationTimer = null;
  let preparedChallengeShare = null;
  let preparingChallengeShare = null;
  let keyboardHintsVisible = false;
  const exploreMapPointers = new Map();
  let exploreMapGesture = null;
  let exploreMapDrag = null;
  let exploreMapUiFrame = null;
  let responsiveMapFrame = null;
  let scrollAffordanceFrame = null;
  let recommendedNavigationFrame = null;
  let suppressExploreMapClickUntil = 0;
  const exploreMapMaxZoom = 8;
  const exploreMapZoomLevels = [1, 1.5, 2, 3, 4, 6, 8];
  const exploreMapGeometryReadableSize = 5;
  const keyboardHintIgnoredKeys = new Set([
    "Tab",
    "Escape",
    "Shift",
    "Control",
    "Alt",
    "AltGraph",
    "Meta",
    "CapsLock",
    "NumLock",
    "ScrollLock",
    "ContextMenu",
  ]);

  function exploreMapZoom(viewport = state.exploreMapViewport) {
    return zoomForMapViewport(viewport);
  }

  function t(key, values = {}) {
    return localization.translate(state.locale, key, values);
  }

  function currentProfile() { return progress.activeProfile(progressStore); }
  function persist(nextStore) {
    progressStore = nextStore;
    if (state.previewMode !== null) return;
    const saved = progress.saveStore(browserStorage, progressStore);
    if (!saved.ok) storageWarning = saved.warning;
  }
  function curriculumQuiz(id = state.curriculumQuizId) {
    return id ? curriculum.quizById.get(id) ?? null : null;
  }
  function curriculumLevel(id = state.activeLevelId) {
    return id ? curriculum.levelById.get(id) ?? null : null;
  }
  function levelTitle(level) { return level?.title?.[state.locale] ?? ""; }
  function levelIndexForLevel(level) {
    return level ? curriculum.levels.findIndex((candidate) => candidate.id === level.id) : -1;
  }
  function stageForLevelIndex(levelIndex) {
    const levelNumber = levelIndex + 1;
    return curriculum.stages.find(
      (stage) => levelNumber >= stage.startLevel && levelNumber <= stage.endLevel,
    ) ?? null;
  }
  function levelBadgeMarkup(levelIndex, size = "regular") {
    if (!Number.isInteger(levelIndex) || levelIndex < 0) return "";
    const stage = stageForLevelIndex(levelIndex);
    return `<span class="level-badge level-badge-${escapeHtml(size)} level-stage-${escapeHtml(stage?.id ?? "")}" aria-label="${escapeHtml(t("level", { number: levelIndex + 1 }))}"><span aria-hidden="true">${levelIndex + 1}</span></span>`;
  }
  function levelReferenceMarkup(level, { size = "compact", showTitle = true, className = "" } = {}) {
    const levelIndex = levelIndexForLevel(level);
    if (levelIndex < 0) return "";
    return `<span class="level-reference${className ? ` ${escapeHtml(className)}` : ""}">${levelBadgeMarkup(levelIndex, size)}${showTitle ? `<span class="level-reference-title">${escapeHtml(levelTitle(level))}</span>` : ""}</span>`;
  }
  function stageTitle(stage) { return stage?.title?.[state.locale] ?? ""; }
  function modeLabel(modeId) {
    const mode = modesById.get(modeId);
    return mode ? t(mode.shortLabelKey) : "";
  }
  function clearTransferFragment() {
    if (!window.location.hash) return;
    try { window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`); } catch { /* static-file fallback */ }
  }

  function countryName(country) {
    return country.name[state.locale];
  }

  function countryCapital(country) {
    return country.capital[state.locale];
  }

  function countryNote(country) {
    return country.note?.[state.locale] ?? null;
  }

  function regionLabel(region) {
    return region.label[state.locale];
  }

  function countryCount(count) {
    return t("countries", { count });
  }

  function placeCounts(items) {
    return items.reduce((counts, place) => {
      counts[place.category === "other-place" ? "otherPlaces" : "countries"] += 1;
      return counts;
    }, { countries: 0, otherPlaces: 0 });
  }

  function placeCountLabel(items) {
    const counts = placeCounts(items);
    return counts.otherPlaces
      ? t("placeBreakdown", counts)
      : countryCount(counts.countries);
  }

  function placeStatus(place) {
    return place.status?.[state.locale] ?? null;
  }

  function placeRelationshipLabel(place) {
    if (place.relatedCountryCode) {
      const relatedCountry = countriesByCode.get(place.relatedCountryCode);
      if (relatedCountry) return countryName(relatedCountry);
    }
    return placeStatus(place);
  }

  function hasSpecialCentres(place) {
    return (
      place.centres.length !== 1 ||
      place.centres[0].role.en !== "Capital" ||
      place.centres[0].role.nb !== "Hovedstad"
    );
  }

  function centreRole(centre) {
    return centre.role?.[state.locale] ?? "";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function regionMatches(countryRegion, selectedRegion) {
    return (
      selectedRegion === "world" ||
      countryRegion === selectedRegion
    );
  }

  function countriesInRegion(region) {
    return countries.filter((country) => regionMatches(country.region, region));
  }

  function countriesInExploreMapScope() {
    if (state.exploreScope?.kind === "contextual") {
      return state.exploreScope.countryCodes
        .map((code) => countriesByCode.get(code))
        .filter(Boolean);
    }
    return countriesInRegion(state.region);
  }

  function exploreScopeLabel() {
    if (state.exploreScope?.kind === "contextual") {
      return state.exploreScope.title[state.locale];
    }
    return state.region === "world"
      ? t("wholeWorld")
      : regionLabel(selectedRegion());
  }

  function exploreScopeMarkup(size = "compact") {
    const level = state.exploreScope?.levelId
      ? curriculum.levelById.get(state.exploreScope.levelId)
      : null;
    return level
      ? levelReferenceMarkup(level, { size })
      : escapeHtml(exploreScopeLabel());
  }

  function initialExploreMapExtent(countryCodes) {
    return exploreState.initialExtent(
      countryCodes,
      mapRegionForCode,
    );
  }

  function selectedRegion() {
    return regionsById.get(state.region);
  }

  function relationshipSpecialIconMarkup(className) {
    return `<span class="${className}" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16"/></svg></span>`;
  }

  function relationshipBadgeMarkup(country) {
    if (country.category !== "other-place") return "";
    if (country.relatedCountryCode) {
      return `<span class="relationship-badge" aria-hidden="true"><img src="./flags/${country.relatedCountryCode}.svg" alt="" draggable="false" /></span>`;
    }
    return relationshipSpecialIconMarkup("relationship-badge relationship-badge-special");
  }

  function flagMarkup(country, className = "", revealName = false, showRelationship = false) {
    const name = escapeHtml(countryName(country));
    const alt = revealName ? escapeHtml(t("flagOf", { name })) : "";
    const hasRelationshipWrapper = showRelationship && country.category === "other-place";
    const frame = `<span class="flag-frame flag-code-${country.code} ${hasRelationshipWrapper ? "" : className}">
        <img class="flag" src="./flags/${country.code}.svg" alt="${alt}" draggable="false" />
      </span>`;
    return hasRelationshipWrapper
      ? `<span class="flag-with-relationship ${className}">${frame}${relationshipBadgeMarkup(country)}</span>`
      : frame;
  }

  function relationshipChipMarkup(country) {
    const status = placeStatus(country);
    if (!status) return "";
    const icon = country.relatedCountryCode
      ? `<img src="./flags/${country.relatedCountryCode}.svg" alt="" aria-hidden="true" draggable="false" />`
      : relationshipSpecialIconMarkup("relationship-chip-special");
    return `<span class="place-relationship-chip">${icon}<span>${escapeHtml(status)}</span></span>`;
  }

  function siteHomeLinkMarkup() {
    return `
      <a class="site-home-link" href="../index.html" aria-label="${escapeHtml(t("homeLink"))}">
        <span aria-hidden="true">←</span> lanceolav.com
      </a>
    `;
  }

  function languageSwitcherMarkup() {
    return `
      <div class="language-switcher" role="group" aria-label="${escapeHtml(t("languageGroup"))}">
        ${[
          { locale: "nb", flag: "no", labelKey: "languageNb" },
          { locale: "en", flag: "gb", labelKey: "languageEn" },
        ]
          .map(({ locale, flag, labelKey }) => {
            const label = t(labelKey);
            return `
              <button
                type="button"
                class="language-button ${state.locale === locale ? "is-selected" : ""}"
                data-action="language"
                data-value="${locale}"
                lang="${locale}"
                aria-label="${escapeHtml(label)}"
                aria-pressed="${state.locale === locale}"
                title="${escapeHtml(label)}"
              >
                <img src="./flags/${flag}.svg" alt="" aria-hidden="true" draggable="false" />
              </button>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function brandMarkup(asButton = false, includeHomeLink = true) {
    const brandContent = `
      <img class="brand-mark" src="./favicon.svg" alt="" aria-hidden="true" draggable="false" />
      <span>${t("brandName")}</span>
    `;
    const brandControl = asButton
      ? `<button class="brand brand-button" data-action="setup" aria-label="${escapeHtml(t("brandHome"))}">${brandContent}</button>`
      : `<a class="brand" href="#top" aria-label="${escapeHtml(t("brandTop"))}">${brandContent}</a>`;

    return `
      <div class="brand-group">
        ${brandControl}
        ${includeHomeLink ? siteHomeLinkMarkup() : ""}
        ${languageSwitcherMarkup()}
      </div>
    `;
  }

  function homeButtonMarkup(action = "setup") {
    return `
      <button class="quiet-button home-button" data-action="${action}">
        <span aria-hidden="true">←</span>
        ${t("home")}
      </button>
    `;
  }

  function headerReturnButtonMarkup(action, destinationKey, accessibleLabelKey) {
    return `
      <button class="quiet-button home-button" data-action="${action}" aria-label="${escapeHtml(t(accessibleLabelKey))}">
        <span aria-hidden="true">←</span>
        ${escapeHtml(t(destinationKey))}
      </button>
    `;
  }

  function quizReturnButtonMarkup() {
    if (state.quizReturn !== "levels") return homeButtonMarkup();
    return headerReturnButtonMarkup("back-from-quiz", "levels", "backToLevels");
  }

  function actionFeedbackMarkup() {
    return `
      <span class="action-feedback-icon" aria-hidden="true"></span>
      <span class="sr-only action-feedback-announcement" aria-live="polite"></span>
    `;
  }

  const historySessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  function currentRoute() {
    if (state.screen === "levels") {
      return { screen: "levels", levelId: state.selectedLevelId };
    }
    if (state.screen === "explore") {
      if (state.exploreReturn?.screen === "result") return quizRoute();
      return {
        screen: "explore",
        levelId: state.exploreScope?.levelId ?? null,
        region: state.region,
      };
    }
    if (state.screen === "flashcards") {
      if (state.flashcardReturn === "result") return quizRoute();
      if (state.flashcardReturn === "level") {
        return { screen: "flashcards", source: "level", levelId: state.activeLevelId };
      }
      if (state.flashcardReturn === "explore") {
        return {
          screen: "flashcards",
          source: "explore",
          levelId: state.exploreScope?.levelId ?? null,
          region: state.region,
        };
      }
    }
    if (state.screen === "quiz" || state.screen === "result") return quizRoute();
    return { screen: "setup" };
  }

  function quizRoute() {
    return state.curriculumQuizId
      ? {
          screen: "quiz",
          quizId: state.curriculumQuizId,
          source: state.quizReturn === "levels" ? "levels" : "home",
        }
      : { screen: "setup" };
  }

  function routeEquals(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  function syncUrlState({ push = false, route = currentRoute() } = {}) {
    let url;
    if (state.challengeActive && state.curriculumQuizId) {
      url = new URL(window.location.href);
      url.search = "";
      url.hash = "";
      if (state.locale === "en") url.searchParams.set("lang", "en");
      const quiz = curriculumQuiz();
      url.searchParams.set("cv", "2");
      url.searchParams.set("quiz", state.curriculumQuizId);
      url.searchParams.set("rev", String(quiz?.revision ?? 1));
      if (state.challengeScoreParam !== null) url.searchParams.set("score", state.challengeScoreParam); else url.searchParams.delete("score");
      if (state.challengeProof !== null) url.searchParams.set("proof", state.challengeProof); else url.searchParams.delete("proof");
    } else {
      url = navigation.createUrl(window.location.href, route, state.locale);
    }

    const previousState = window.history.state;
    const historyState = {
      helloWorldNavigation: true,
      sessionId: historySessionId,
      route,
      screen: state.screen,
      returnRoute: push
        ? previousState?.route ?? navigation.readUrl(window.location.href, navigationContext)
        : previousState?.returnRoute ?? null,
    };
    try {
      window.history[push ? "pushState" : "replaceState"](historyState, "", url.href);
    } catch (error) {
      console.warn("Could not update the navigation URL.", error);
    }
  }

  function returnToRoute(route) {
    const currentHistoryState = window.history.state;
    if (
      currentHistoryState?.sessionId === historySessionId &&
      routeEquals(currentHistoryState.returnRoute, route)
    ) {
      window.history.back();
      return;
    }
    applyRoute(route, { historyMode: "replace" });
  }

  function updateDocumentMetadata() {
    document.documentElement.lang = state.locale;
    document.title = t("metaTitle");
    const metadata = {
      'meta[name="description"]': t("metaDescription"),
      'meta[property="og:title"]': t("metaTitle"),
      'meta[property="og:description"]': t("metaDescription"),
      'meta[property="og:locale"]': state.locale === "nb" ? "nb_NO" : "en_GB",
      'meta[name="twitter:title"]': t("metaTitle"),
      'meta[name="twitter:description"]': t("metaDescription"),
    };
    Object.entries(metadata).forEach(([selector, content]) => {
      document.querySelector(selector)?.setAttribute("content", content);
    });
  }

  function mapRegionForCode(code) {
    return countriesByCode.get(code)?.region ?? null;
  }

  function mapShapeIsActive(region) {
    return region === state.region;
  }

  function mapPathMarkup(feature) {
    const region = mapRegionForCode(feature.code);
    const codeAttribute = feature.code
      ? ` data-code="${escapeHtml(feature.code)}"`
      : "";
    const mergedClass = feature.mergeStroke ? " is-merged-shape" : "";
    return `
      <path
        class="map-country${mapShapeIsActive(region) ? " is-active" : ""}${mergedClass}"
        d="${feature.path}"
        data-region="${escapeHtml(region ?? "")}"
        ${codeAttribute}
        vector-effect="non-scaling-stroke"
      />
    `;
  }

  function mergedWorldRegionFeatures(regionId) {
    const mergedByCode = new Map();
    const output = [];
    mapData.features
      .filter((feature) => mapRegionForCode(feature.code) === regionId)
      .forEach((feature) => {
        const existing = mergedByCode.get(feature.code);
        if (existing) {
          existing.path += feature.path;
          existing.mergeStroke = true;
          return;
        }
        const copy = { ...feature };
        mergedByCode.set(feature.code, copy);
        output.push(copy);
      });
    return output;
  }

  function mapMarkerMarkup(marker) {
    const region = mapRegionForCode(marker.code);
    return `
      <circle
        class="map-marker ${mapShapeIsActive(region) ? "is-active" : ""}"
        cx="${marker.x}"
        cy="${marker.y}"
        r="2.8"
        data-region="${escapeHtml(region ?? "")}"
        data-code="${escapeHtml(marker.code)}"
        vector-effect="non-scaling-stroke"
      />
    `;
  }

  function mapRegionMarkup(regionId, action = "map-region") {
    const region = regionsById.get(regionId);
    const regionPlaces = countriesInRegion(regionId);
    const paths = mergedWorldRegionFeatures(regionId)
      .map(mapPathMarkup)
      .join("");
    const markers = mapData.markers
      .filter((marker) => mapRegionForCode(marker.code) === regionId)
      .map(mapMarkerMarkup)
      .join("");

    return `
      <g
        class="map-region"
        data-action="${action}"
        data-value="${regionId}"
        data-map-region="${regionId}"
        role="button"
        tabindex="0"
        aria-label="${escapeHtml(`${regionLabel(region)}, ${placeCountLabel(regionPlaces)}`)}"
      >
        ${paths}
        ${markers}
      </g>
    `;
  }

  function worldMapMarkup(action = "map-region") {
    const [worldX, worldY, worldWidth, worldHeight] = mapData.viewBox
      .split(/\s+/)
      .map(Number);
    const contextPaths = mapData.features
      .filter((feature) => mapRegionForCode(feature.code) === null)
      .map(mapPathMarkup)
      .join("");

    return `
      <div class="region-map-card" style="--world-map-aspect: ${worldWidth} / ${worldHeight}">
        <p class="sr-only" id="region-map-description">
          ${t("regionMapDescription")}
        </p>
        <svg
          class="region-map"
          viewBox="${mapData.viewBox}"
          role="group"
          aria-label="${escapeHtml(t("interactiveWorldMap"))}"
          aria-describedby="region-map-description"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect class="map-ocean" x="${worldX}" y="${worldY}" width="${worldWidth}" height="${worldHeight}" rx="26" />
          <g class="map-context" aria-hidden="true">${contextPaths}</g>
          ${mapSelectableRegions
            .map((regionId) => mapRegionMarkup(regionId, action))
            .join("")}
        </svg>
      </div>
    `;
  }

  function regionalMapPathMarkup(feature, className) {
    return `
      <path
        class="${className}"
        data-map-country-code="${escapeHtml(feature.code ?? "")}"
        d="${feature.path}"
        vector-effect="non-scaling-stroke"
      />
      ${
        feature.cropPath
          ? `<path
              class="${className} is-crop-edge"
              data-map-country-code="${escapeHtml(feature.code ?? "")}"
              d="${feature.cropPath}"
              vector-effect="non-scaling-stroke"
              aria-hidden="true"
            />`
          : ""
      }
    `;
  }

  function regionalMapMarkerMarkup(
    marker,
    className,
    screenRadius,
  ) {
    const readableSizeAttribute = Number.isFinite(marker.readableSize)
      ? `data-map-marker-readable-size="${marker.readableSize}"`
      : "";
    return `
      <circle
        class="${className}"
        cx="${marker.x}"
        cy="${marker.y}"
        r="${screenRadius}"
        data-map-marker-screen-radius="${screenRadius}"
        data-map-marker-code="${escapeHtml(marker.code)}"
        ${readableSizeAttribute}
        vector-effect="non-scaling-stroke"
      />
    `;
  }

  function silhouetteCapitalPath({ x, y }) {
    const outerRadius = 2;
    const innerRadius = 0.87;
    return (
      Array.from({ length: 10 }, (_, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI) / 5;
        const radius = index % 2 === 0 ? outerRadius : innerRadius;
        const pointX = (x + Math.cos(angle) * radius).toFixed(2);
        const pointY = (y + Math.sin(angle) * radius).toFixed(2);
        return `${index === 0 ? "M" : "L"}${pointX},${pointY}`;
      }).join(" ") + "Z"
    );
  }

  function silhouetteCapitalMarkup(points = []) {
    return points
      .map((point) => point.kind === "quiz" ? `
          <path
            class="country-silhouette-capital"
            d="${silhouetteCapitalPath(point)}"
          />
        ` : `<circle class="country-silhouette-capital is-${point.kind}" cx="${point.x}" cy="${point.y}" r="${point.kind === "planned" ? 1.7 : 1.45}" />`)
      .join("");
  }

  function countrySilhouetteMarkup(
    countryCode,
    { interactive = true, expanded = state.silhouetteExpanded } = {},
  ) {
    const silhouette = mapData.silhouettes[countryCode];
    const hasSilhouettePath = Boolean(silhouette.path);
    const expandedSilhouette = silhouette.expanded;
    const capitalLayers = mapData.silhouetteCapitals[countryCode] ?? {
      main: [],
      insets: [],
    };
    const expandedMarkerRadius = 0;
    const currentMarkerRadius = expanded ? expandedMarkerRadius : null;
    const silhouetteMarkers = silhouette.markers
      .map(
        (marker) => `
          <circle
            class="country-silhouette-marker"
            cx="${marker.x}"
            cy="${marker.y}"
            r="${currentMarkerRadius ?? marker.r}"
            data-base-radius="${marker.r}"
            data-expanded-radius="${expandedMarkerRadius}"
            style="--silhouette-marker-radius: ${currentMarkerRadius ?? marker.r}px"
          />
        `,
      )
      .join("");
    const classes = [
      "country-silhouette-inset",
      "is-bottom-left",
      hasSilhouettePath ? "has-silhouette-path" : "is-marker-only",
      expandedSilhouette ? "has-expanded-composition" : "",
      interactive ? "is-interactive" : "is-preview-only",
      interactive && expanded ? "is-expanded" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const silhouettePathMarkup = (
      layer,
      pathClass = "",
      capitalPoints = [],
    ) => {
      const layerClass = [
        pathClass,
        layer.mergeStroke ? "is-merged-shape" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return `
      ${
        layer.path
          ? `<path class="country-silhouette-shape ${layerClass}" d="${layer.path}" />`
          : ""
      }
      ${
        layer.minorPath
          ? `<path class="country-silhouette-minor-shape ${layerClass}" d="${layer.minorPath}" />`
          : ""
      }
      ${silhouetteCapitalMarkup(capitalPoints)}
    `;
    };
    const silhouetteLocatorMarkup = (inset) => {
      if (!inset.sourceFrame) return "";
      const [sourceX, sourceY, sourceWidth, sourceHeight] = inset.sourceFrame;
      const [insetX, insetY, insetWidth, insetHeight] = inset.frame;
      const sourceCenterX = sourceX + sourceWidth / 2;
      const sourceCenterY = sourceY + sourceHeight / 2;
      const insetCenterX = insetX + insetWidth / 2;
      const insetCenterY = insetY + insetHeight / 2;
      const horizontal =
        Math.abs(insetCenterX - sourceCenterX) >=
        Math.abs(insetCenterY - sourceCenterY);
      const sourcePoints = horizontal
        ? [
            [insetCenterX >= sourceCenterX ? sourceX + sourceWidth : sourceX, sourceY],
            [
              insetCenterX >= sourceCenterX ? sourceX + sourceWidth : sourceX,
              sourceY + sourceHeight,
            ],
          ]
        : [
            [sourceX, insetCenterY >= sourceCenterY ? sourceY + sourceHeight : sourceY],
            [
              sourceX + sourceWidth,
              insetCenterY >= sourceCenterY ? sourceY + sourceHeight : sourceY,
            ],
          ];
      const insetPoints = horizontal
        ? [
            [insetCenterX >= sourceCenterX ? insetX : insetX + insetWidth, insetY],
            [
              insetCenterX >= sourceCenterX ? insetX : insetX + insetWidth,
              insetY + insetHeight,
            ],
          ]
        : [
            [insetX, insetCenterY >= sourceCenterY ? insetY : insetY + insetHeight],
            [
              insetX + insetWidth,
              insetCenterY >= sourceCenterY ? insetY : insetY + insetHeight,
            ],
          ];
      return `
        <g class="country-silhouette-inset-locator">
          ${sourcePoints
            .map(
              (point, index) => `
                <line
                  class="country-silhouette-inset-connector"
                  x1="${point[0]}"
                  y1="${point[1]}"
                  x2="${insetPoints[index][0]}"
                  y2="${insetPoints[index][1]}"
                />
              `,
            )
            .join("")}
          <rect
            class="country-silhouette-source-frame"
            x="${sourceX}"
            y="${sourceY}"
            width="${sourceWidth}"
            height="${sourceHeight}"
            rx="0.8"
          />
        </g>
      `;
    };
    const expandedMarkup = expandedSilhouette
      ? `
        <g class="country-silhouette-composition is-expanded-composition">
          ${silhouettePathMarkup(expandedSilhouette, "", capitalLayers.main)}
          ${expandedSilhouette.insets.map(silhouetteLocatorMarkup).join("")}
          ${expandedSilhouette.insets
            .map(
              (inset, index) => `
                <rect
                  class="country-silhouette-inset-frame"
                  x="${inset.frame[0]}"
                  y="${inset.frame[1]}"
                  width="${inset.frame[2]}"
                  height="${inset.frame[3]}"
                  rx="2"
                />
                ${silhouettePathMarkup(
                  inset,
                  "is-inset-shape",
                  capitalLayers.insets[index] ?? [],
                )}
              `,
            )
            .join("")}
          ${
            expandedSilhouette.divisionPath
              ? `<path class="country-silhouette-division" d="${expandedSilhouette.divisionPath}" />`
              : ""
          }
        </g>
      `
      : "";
    const contents = `
      ${interactive ? '<span class="silhouette-toggle-icon" aria-hidden="true"></span>' : ""}
      <svg
        class="country-silhouette"
        viewBox="${mapData.silhouetteViewBox}"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
      >
        <g class="country-silhouette-composition is-compact-composition">
          ${silhouettePathMarkup(silhouette, "", capitalLayers.main)}
          ${silhouetteMarkers}
        </g>
        ${expandedMarkup}
      </svg>
    `;

    if (!interactive) {
      return `<div class="${classes}" aria-hidden="true">${contents}</div>`;
    }

    return `
      <button
        type="button"
        class="${classes}"
        data-action="toggle-silhouette"
        aria-expanded="${expanded}"
        aria-label="${escapeHtml(expanded ? t("shrinkShape") : t("enlargeShape"))}"
      >
        ${contents}
      </button>
    `;
  }

  function questionMapMarkup(regionId, targetCode) {
    const mapAreas = ["world", "region", "nearby"];
    const isWorld = state.quizMapArea === "world";
    const view = isWorld
      ? {
          viewBox: mapData.viewBox,
          bleedViewBox: mapData.viewBox,
          features: mapData.features,
          markers: mapData.markers,
          backgroundFeatures: [],
        }
      : mapData.quizRegions[regionId];
    const region = regionsById.get(regionId);
    const markerRadius = 3;
    const contextFeatures = view.backgroundFeatures ?? [];
    const otherFeatures = view.features.filter(
      (feature) => feature.code !== targetCode,
    );
    const targetFeatures = view.features.filter(
      (feature) => feature.code === targetCode,
    );
    const otherMarkers = view.markers.filter(
      (marker) => marker.code !== targetCode,
    );
    const targetMarkers = view.markers.filter(
      (marker) => marker.code === targetCode,
    );
    const locatorCodes = new Set(
      view.markers
        .filter((marker) => Number.isFinite(marker.readableSize))
        .map((marker) => marker.code),
    );

    const pathMarkup = (features, className) =>
      features
        .map((feature) =>
          regionalMapPathMarkup(
            feature,
            `${className}${
              locatorCodes.has(feature.code) ? " is-locator-hidden" : ""
            }`,
          ),
        )
        .join("");
    const markerMarkup = (markers, className, radius) =>
      markers
        .map((marker) =>
          regionalMapMarkerMarkup(marker, className, radius),
        )
        .join("");
    const mapLabel = isWorld
      ? t("highlightedWorldMap")
      : state.quizMapArea === "nearby"
        ? t("highlightedNearbyMap", { region: regionLabel(region) })
        : t("highlightedMap", { region: regionLabel(region) });
    return `
      <div class="map-quiz-visual${isWorld ? " is-world-area" : ""}${state.silhouetteExpanded ? " has-expanded-silhouette" : ""}">
        <div class="question-map-tabs" role="tablist" aria-label="${escapeHtml(t("mapAreaControls"))}">
          ${mapAreas.map((area) => `
            <button
              type="button"
              id="question-map-tab-${area}"
              class="question-map-tab"
              role="tab"
              aria-selected="${state.quizMapArea === area}"
              aria-controls="question-map-panel"
              tabindex="${state.quizMapArea === area ? "0" : "-1"}"
              data-action="quiz-map-area"
              data-value="${area}"
            >${escapeHtml(t(`mapView${area[0].toUpperCase()}${area.slice(1)}`))}</button>
          `).join("")}
        </div>
        <div
          class="question-map-stage"
          id="question-map-panel"
          role="tabpanel"
          aria-labelledby="question-map-tab-${state.quizMapArea}"
        >
          <svg
            class="question-map"
            data-responsive-region-map
            data-question-map-area="${state.quizMapArea}"
            data-base-view-box="${view.viewBox}"
            data-bleed-view-box="${view.bleedViewBox ?? view.viewBox}"
            viewBox="${view.viewBox}"
            role="img"
            aria-label="${escapeHtml(mapLabel)}"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect class="question-map-ocean" x="-10000" y="-10000" width="20000" height="20000" />
            <g aria-hidden="true">
              ${pathMarkup(contextFeatures, "question-map-country")}
              ${pathMarkup(otherFeatures, "question-map-country")}
              ${pathMarkup(targetFeatures, "question-map-country is-target")}
              ${pathMarkup(targetFeatures, "question-map-target-halo")}
              ${markerMarkup(
                targetMarkers,
                "question-map-marker is-target-halo",
                markerRadius * 2.8,
              )}
              ${pathMarkup(contextFeatures, "question-map-country-border")}
              ${pathMarkup(otherFeatures, "question-map-country-border")}
              ${pathMarkup(targetFeatures, "question-map-country-border is-target")}
              ${markerMarkup(otherMarkers, "question-map-marker", markerRadius)}
              ${markerMarkup(
                targetMarkers,
                "question-map-marker is-target",
                markerRadius * 1.35,
              )}
            </g>
          </svg>
          ${countrySilhouetteMarkup(targetCode)}
        </div>
      </div>
    `;
  }

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function isIosDevice() {
    return (
      /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1)
    );
  }

  function isMobileDevice() {
    return (
      isIosDevice() ||
      window.navigator.userAgentData?.mobile === true ||
      /Android|Mobile/i.test(window.navigator.userAgent)
    );
  }

  function isInstallContext() {
    return (
      window.location.protocol === "https:" ||
      (window.location.protocol === "http:" && /^(?:localhost|127(?:\.\d+){3}|\[::1\])$/.test(window.location.hostname))
    );
  }

  function isIosSafari() {
    if (!isIosDevice()) return false;

    const userAgent = window.navigator.userAgent;
    const alternativeBrowser =
      /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|DuckDuckGo|Ddg|GSA|YaBrowser/i;

    return (
      !alternativeBrowser.test(userAgent) &&
      /Version\/[^\s]+.*Mobile\/[^\s]+.*Safari\//i.test(userAgent)
    );
  }

  function installActionMarkup() {
    if (
      !isInstallContext() ||
      !isMobileDevice() ||
      isStandalone() ||
      (!isIosDevice() && deferredInstallPrompt === null)
    ) {
      return "";
    }

    return `
      <button class="quiet-button install-app-button" type="button" data-action="install-app">
        <img src="./favicon.svg" alt="" aria-hidden="true" draggable="false" />
        <span>${t("installApp")}</span>
      </button>
    `;
  }

  function installHelpMarkup() {
    if (!state.installHelpOpen || !isIosDevice() || isStandalone()) return "";

    const title = isIosSafari()
      ? t("installHelpTitle")
      : t("installSafariTitle");
    const description = isIosSafari()
      ? t("installHelpText")
      : t("installSafariText");

    return `
      <div
        class="install-help-overlay"
        data-action="close-install-help"
      >
        <section
          class="install-help-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-help-title"
          aria-describedby="install-help-description"
          tabindex="-1"
        >
          <img class="install-help-icon" src="./favicon.svg" alt="" aria-hidden="true" draggable="false" />
          <h2 id="install-help-title">${title}</h2>
          <p id="install-help-description">${description}</p>
          <button
            class="install-help-close"
            type="button"
            data-action="close-install-help-button"
          >
            ${t("closeInstallHelp")}
          </button>
        </section>
      </div>
    `;
  }

  function openChallengeMarkup() {
    if (!state.openChallengeOpen) return "";
    return `
      <div class="open-challenge-overlay" data-action="close-open-challenge">
        <section
          class="open-challenge-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="open-challenge-title"
          aria-describedby="open-challenge-description"
          tabindex="-1"
        >
          <h2 id="open-challenge-title">${t("openSharedLinkPrompt")}</h2>
          <p id="open-challenge-description">${t("openSharedLinkDescription")}</p>
          <form data-open-challenge-form novalidate>
            <label for="challenge-input">${t("sharedLinkInputLabel")}</label>
            <input
              id="challenge-input"
              name="challenge-input"
              type="text"
              autocomplete="off"
              autocapitalize="none"
              spellcheck="false"
              placeholder="${escapeHtml(t("sharedLinkInputPlaceholder"))}"
              value="${escapeHtml(state.openChallengeValue)}"
              aria-describedby="open-challenge-error"
              ${state.openChallengeError ? 'aria-invalid="true"' : ""}
            />
            <p id="open-challenge-error" class="open-challenge-error" aria-live="polite">
              ${state.openChallengeError ? t(state.openChallengeError) : ""}
            </p>
            <div class="open-challenge-actions">
              <button class="primary-button" type="submit">${t("openSharedLink")}</button>
              <button class="secondary-button" type="button" data-action="cancel-open-challenge">${t("cancel")}</button>
            </div>
          </form>
        </section>
      </div>
    `;
  }

  function actionDialogDetails() {
    const dialog = state.actionDialog;
    if (!dialog) return null;
    const profile = progressStore.profiles[dialog.profileId] ?? currentProfile();
    if (dialog.kind === "abandon-attempt") {
      if (!profile.savedMasteryAttempt || !curriculum.quizById.has(dialog.quizId)) return null;
      return {
        title: t("abandonAttemptTitle"),
        description: t("abandonAttemptDescription"),
        confirmLabel: t("abandonAndStart"),
        cancelLabel: t("keepSavedAttempt"),
        danger: true,
      };
    }
    if (dialog.kind === "add-profile") {
      return {
        title: t("addProfileTitle"), description: t("addProfileDescription"),
        confirmLabel: t("addProfileAction"), cancelLabel: t("cancel"),
        inputLabel: t("newProfileName"), inputValue: "",
      };
    }
    if (dialog.kind === "rename-profile") {
      return {
        title: t("renameProfileTitle"),
        description: t("renameProfileDescription", { name: profile.name }),
        confirmLabel: t("renameProfileAction"), cancelLabel: t("cancel"),
        inputLabel: t("newProfileName"), inputValue: profile.name,
      };
    }
    if (dialog.kind === "clear-profile") {
      return {
        title: t("clearProgressTitle"),
        description: t("clearProgressDescription", { name: profile.name }),
        confirmLabel: t("clearProgressAction"), cancelLabel: t("cancel"), danger: true,
      };
    }
    if (dialog.kind === "delete-profile") {
      return {
        title: t("deleteProfileTitle"),
        description: t("deleteProfileDescription", { name: profile.name }),
        confirmLabel: t("deleteProfileAction"), cancelLabel: t("cancel"), danger: true,
      };
    }
    if (dialog.kind === "share-fallback") {
      return {
        title: dialog.title,
        closeButton: true,
        actionsMarkup: `
          <button class="secondary-button action-feedback-button" type="button" data-action="copy-share-message">${escapeHtml(t("copyMessage"))}${actionFeedbackMarkup()}</button>
          <button class="primary-button" type="button" data-action="open-share-email">${escapeHtml(t("openEmailDraft"))}</button>`,
      };
    }
    return null;
  }

  function actionDialogMarkup() {
    const details = actionDialogDetails();
    if (!details) return "";
    return `
      <div class="action-dialog-overlay" data-action="close-action-dialog">
        <section class="action-dialog${details.closeButton ? " has-close-button" : ""}" role="dialog" aria-modal="true" aria-labelledby="action-dialog-title"${details.description || details.descriptionMarkup ? ' aria-describedby="action-dialog-description"' : ""} tabindex="-1">
          ${details.closeButton ? `<button class="icon-close action-dialog-close" type="button" data-action="close-action-dialog" data-dialog-cancel-focus aria-label="${escapeHtml(t("close"))}">×</button>` : ""}
          <form data-action-dialog-form>
            <h2 id="action-dialog-title">${escapeHtml(details.title)}</h2>
            ${details.description || details.descriptionMarkup ? `<p id="action-dialog-description">${details.descriptionMarkup ?? escapeHtml(details.description)}</p>` : ""}
            ${details.inputLabel ? `<label for="action-dialog-input">${escapeHtml(details.inputLabel)}</label><input id="action-dialog-input" name="profile-name" type="text" maxlength="40" value="${escapeHtml(details.inputValue)}" autocomplete="off" />` : ""}
            <div class="action-dialog-actions">
              ${details.actionsMarkup ?? `<button class="secondary-button" type="button" data-action="close-action-dialog" data-dialog-cancel-focus>${escapeHtml(details.cancelLabel)}</button>
              <button class="${details.danger ? "danger-confirm-button" : "primary-button"}" type="submit">${escapeHtml(details.confirmLabel)}</button>`}
            </div>
          </form>
        </section>
      </div>`;
  }

  let puzzleSvgId = 0;
  let puzzleImageObserver = null;
  let puzzleReturnFocus = null;
  const failedPuzzleImages = new Set();

  function puzzleValue(stageId) {
    return puzzles.stageProgress(currentProfile(), stageId, curriculum, progress);
  }

  function puzzlePictureMarkup(stageId, { newPieceId = null, animate = false } = {}) {
    const value = puzzleValue(stageId);
    const { stage, earned, complete } = value;
    const id = `puzzle-${++puzzleSvgId}`;
    const paths = stage.pieces.map((piece) => `<path d="${piece.path}"/>`);
    const newPiece = newPieceId === null ? null : stage.pieces[newPieceId];
    const imageMarkup = `<image data-puzzle-src="${stage.image}" width="1536" height="1024" preserveAspectRatio="xMidYMid slice"/>`;
    const clipPaths = paths.filter((_, index) => earned[index] && (!animate || index !== newPieceId)).join("");
    const label = `${t("puzzleCount", { count: value.count, total: value.total })}. ${t(`puzzleDescription_${stage.id}`)}`;
    return `<div class="puzzle-picture ${complete ? "is-complete" : ""} ${animate ? "is-revealing" : ""}">
      <svg viewBox="0 0 1536 1024" role="img" aria-label="${escapeHtml(label)}">
        <defs><clipPath id="${id}">${clipPaths}</clipPath>${newPiece && animate ? `<clipPath id="${id}-new">${paths[newPieceId]}</clipPath>` : ""}</defs>
        <rect width="1536" height="1024" fill="#e6dfcf"/>
        ${value.count ? `<g clip-path="url(#${id})">${imageMarkup}</g>` : ""}
        <g class="puzzle-seams" fill="none" stroke="#948776" stroke-width="2">${paths.join("")}</g>
        ${newPiece && animate ? `<g class="puzzle-new-piece" style="--piece-x:${768 - newPiece.x - newPiece.width / 2}px;--piece-y:${512 - newPiece.y - newPiece.height / 2}px;--piece-scale:${Math.min(3, 600 / newPiece.width)};transform-origin:${newPiece.x + newPiece.width / 2}px ${newPiece.y + newPiece.height / 2}px"><path d="${newPiece.path}" fill="#e6dfcf"/><g clip-path="url(#${id}-new)">${imageMarkup}</g><path d="${newPiece.path}" fill="none" stroke="#fff8e8" stroke-width="7"/></g>` : ""}
      </svg>
      <p class="puzzle-image-error" role="status" hidden>${t("puzzleImageUnavailable")}</p>
    </div>`;
  }

  function puzzlePreviewMarkup(stageId) {
    const value = puzzleValue(stageId);
    return `<button class="stage-puzzle-preview" data-action="open-puzzles" data-stage-id="${stageId}" aria-label="${escapeHtml(`${t("stagePicture")}: ${stageTitle(curriculum.stages.find((s) => s.id === stageId))}. ${t("puzzleCount", { count: value.count, total: value.total })}`)}">${puzzlePictureMarkup(stageId)}<span><strong>${t("stagePicture")}</strong><small>${t("puzzleCount", { count: value.count, total: value.total })}</small></span><span aria-hidden="true">↗</span></button>`;
  }

  function puzzleResultLinkMarkup() {
    const reward = puzzles.pieceForQuiz(state.curriculumQuizId);
    if (!reward) return "";
    const value = puzzleValue(reward.stageId);
    return `<button class="quiet-button result-picture-link" data-action="open-puzzles" data-stage-id="${reward.stageId}">${t("viewStagePicture")} · ${t("puzzleCount", { count: value.count, total: value.total })}</button>`;
  }

  function puzzleRewardMarkup() {
    const reward = puzzles.pieceForQuiz(state.curriculumQuizId);
    const value = puzzleValue(reward.stageId);
    const stage = curriculum.stages.find((candidate) => candidate.id === reward.stageId);
    const animate = state.puzzleRewardPending && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return `<main class="quiz-shell puzzle-reward-shell level-stage-${stage.id}">
      <section class="puzzle-reward-card ${animate ? "is-counting" : ""}" data-stage-id="${stage.id}" aria-labelledby="puzzle-reward-title">
        <h1 class="sr-only" id="puzzle-reward-title">${t("stagePicture")}</h1>
        <div class="puzzle-reward-presentation"><div class="puzzle-reward-figure">
        <header class="puzzle-reward-header">
          <div class="puzzle-reward-stage"><span class="level-stage-icon" aria-hidden="true">${stage.icon}</span><span>${escapeHtml(stageTitle(stage))}</span></div>
          <p class="puzzle-reward-count" aria-hidden="true"><span>🧩</span> <span data-puzzle-reward-count>${value.count - (animate ? 1 : 0)}/${value.total}</span></p>
        </header>
        <div class="puzzle-reward-art">${puzzlePictureMarkup(reward.stageId, { newPieceId: reward.piece.id, animate })}
          ${value.complete ? `<div class="puzzle-confetti" aria-hidden="true">${Array.from({ length: 24 }, (_, index) => `<i style="--confetti-angle:${index * 15}deg;--confetti-distance:${70 + index % 4 * 15}px;--confetti-color:${["#f8d981", "#ffffff", "var(--stage-badge)"][index % 3]}"></i>`).join("")}</div>` : ""}
        </div>
        </div></div>
        <p class="sr-only" data-puzzle-reward-announcement role="status">${animate ? "" : puzzleRewardAnnouncement(value)}</p>
        <button class="primary-button" data-action="continue-puzzle-reward">${t("puzzleContinue")} <span aria-hidden="true">→</span></button>
      </section>
    </main>`;
  }

  function puzzleRewardAnnouncement(value) {
    return `${t(value.complete ? "pictureComplete" : "newPuzzlePiece")} ${t("puzzleCount", { count: value.count, total: value.total })}`;
  }

  function settlePuzzleReward(card, celebrate = true) {
    if (!card?.classList.contains("is-counting")) return;
    const value = puzzleValue(card.dataset.stageId);
    card.classList.remove("is-counting");
    card.querySelector("[data-puzzle-reward-count]").textContent = `${value.count}/${value.total}`;
    card.querySelector("[data-puzzle-reward-announcement]").textContent = puzzleRewardAnnouncement(value);
    if (celebrate) card.classList.add("is-piece-landed");
  }

  function puzzleCollectionMarkup() {
    if (!state.puzzleStageId) return "";
    const stage = curriculum.stages.find((candidate) => candidate.id === state.puzzleStageId);
    return `<div class="puzzle-overlay"><section class="puzzle-dialog level-stage-${stage.id}" role="dialog" aria-modal="true" aria-labelledby="puzzle-collection-title" tabindex="-1">
      <header class="puzzle-dialog-header">
        <h2 id="puzzle-collection-title"><span class="level-stage-icon" aria-hidden="true">${stage.icon}</span><span>${escapeHtml(stageTitle(stage))}</span></h2>
        <div class="puzzle-tools" role="group" aria-label="${t("puzzleZoomControls")}">
          <button data-action="puzzle-zoom-out" aria-label="${t("puzzleZoomOut")}" title="${t("puzzleZoomOut")}" disabled>−</button>
          <button class="puzzle-zoom-reset" data-action="puzzle-zoom-reset" aria-label="${t("puzzleZoomReset")}" title="${t("puzzleZoomReset")}"><span data-puzzle-zoom-label>100%</span></button>
          <button data-action="puzzle-zoom-in" aria-label="${t("puzzleZoomIn")}" title="${t("puzzleZoomIn")}">+</button>
        </div>
        <button class="icon-close" data-action="close-puzzles" aria-label="${t("close")}">×</button>
      </header>
      <div class="puzzle-viewport-frame">
        <div class="puzzle-viewport" tabindex="0" role="region" aria-label="${t("puzzleInspect")}" aria-describedby="puzzle-viewer-help"><div class="puzzle-zoom-content">${puzzlePictureMarkup(state.puzzleStageId)}</div></div>
        ${["left", "right", "top", "bottom"].map((edge) => `<span class="puzzle-edge-shadow puzzle-edge-${edge}" aria-hidden="true"></span>`).join("")}
      </div>
      <p class="sr-only" id="puzzle-viewer-help">${t("puzzleHelp")}</p>
    </section></div>`;
  }

  function closePuzzles() {
    state.puzzleStageId = null;
    render({ focusActionDialogReturn: puzzleReturnFocus });
  }

  app.addEventListener("animationend", (event) => {
    if (event.animationName !== "puzzle-piece-arrive" || !event.target.closest(".puzzle-reward-card")) return;
    settlePuzzleReward(event.target.closest(".puzzle-reward-card"));
  });

  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (event) => {
    const card = app.querySelector(".puzzle-reward-card");
    if (!event.matches || !card) return;
    settlePuzzleReward(card, false);
    card.classList.remove("is-piece-landed");
    // Re-enabling motion must not restart a reveal that has already settled.
    card.querySelectorAll(".puzzle-new-piece, .puzzle-new-piece > path:last-child, .puzzle-seams")
      .forEach((element) => { element.style.animation = "none"; });
  });

  function loadPuzzleImages() {
    puzzleImageObserver?.disconnect();
    const load = (element) => {
      const source = element.dataset.puzzleSrc;
      const fail = () => {
        failedPuzzleImages.add(source);
        const picture = element.closest(".puzzle-picture");
        if (!picture) return;
        picture.querySelector(".puzzle-image-error").hidden = false;
        picture.classList.remove("is-revealing");
        picture.querySelector(".puzzle-new-piece")?.remove();
        settlePuzzleReward(picture.closest(".puzzle-reward-card"), false);
      };
      if (failedPuzzleImages.has(source)) { fail(); return; }
      element.addEventListener("error", fail, { once: true });
      element.addEventListener("load", () => element.closest(".puzzle-picture")?.classList.add("is-art-ready"), { once: true });
      element.setAttribute("href", source);
    };
    if ("IntersectionObserver" in window) {
      puzzleImageObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.querySelectorAll("[data-puzzle-src]").forEach(load); puzzleImageObserver.unobserve(entry.target); }
      }), { threshold: 0.2 });
      app.querySelectorAll(".puzzle-picture").forEach((element) => puzzleImageObserver.observe(element));
    } else app.querySelectorAll("[data-puzzle-src]").forEach(load);
  }

  function milestoneStickersMarkup(profile, { activeStageId = null, interactive = false } = {}) {
    return `<div class="milestone-stickers" aria-label="${escapeHtml(t("milestones"))}">${curriculum.stages.map((stage) => {
      const earned = progress.stageProgress(profile, stage, curriculum.levels).isMastered || stage.id === activeStageId;
      const content = `<span class="milestone-sticker-icon" aria-hidden="true">${stage.icon}</span>${earned ? `<span class="milestone-sticker-check" aria-hidden="true">✓</span>` : ""}`;
      if (interactive && earned) {
        return `<button class="milestone-sticker milestone-sticker-${escapeHtml(stage.id)} is-earned" data-action="replay-milestone" data-stage-id="${escapeHtml(stage.id)}" aria-label="${escapeHtml(t("replayMilestone", { stage: stageTitle(stage) }))}">${content}</button>`;
      }
      return `<span class="milestone-sticker milestone-sticker-${escapeHtml(stage.id)} ${earned ? "is-earned" : "is-locked"} ${stage.id === activeStageId ? "is-new-sticker" : ""}" aria-label="${escapeHtml(earned ? stageTitle(stage) : t("milestoneLocked", { stage: stageTitle(stage) }))}">${content}</span>`;
    }).join("")}</div>`;
  }

  function celebrationFireworksMarkup() {
    const bursts = [
      [15, 24, 0], [38, 15, 420], [66, 24, 180],
      [84, 14, 620], [26, 56, 760], [74, 58, 980],
    ];
    return bursts.map(([x, y, delay], burstIndex) => `
      <span class="world-firework" style="--burst-x:${x}%;--burst-y:${y}%;--burst-delay:${delay}ms">
        ${Array.from({ length: 12 }, (_, particleIndex) => `<i style="--particle-angle:${particleIndex * 30}deg;--particle-distance:-${3.6 + (particleIndex % 3) * .65}rem;--particle-color:${(particleIndex + burstIndex) % 2 ? "#e9b949" : "#58ad77"}"></i>`).join("")}
      </span>`).join("");
  }

  function milestoneCelebrationMarkup() {
    const stage = curriculum.stages.find((candidate) => candidate.id === state.milestoneCelebrationStageId);
    if (!stage) return "";
    const replay = state.milestoneCelebrationOrigin?.endsWith("-replay");
    const next = progress.nextUnmastered(currentProfile(), curriculum.levels, currentProfile().lastQuizId);
    const nextQuiz = next ? curriculum.quizById.get(next.id) : null;
    const nextStage = nextQuiz ? stageForLevelIndex(nextQuiz.levelIndex) : null;
    const nextStageLabel = nextStage
      ? t(nextStage.startLevel > stage.endLevel ? "nextStage" : "continueWithStage", { stage: stageTitle(nextStage) })
      : "";
    const totals = progress.summary(currentProfile(), curriculum.levels);
    const isFinalMilestone = totals.masteredQuizzes === totals.totalQuizzes;
    const primaryAction = replay
      ? `<button class="primary-button milestone-celebration-continue" data-action="close-milestone-celebration"><span aria-hidden="true">←</span> ${t(state.milestoneCelebrationOrigin === "levels-replay" ? "levels" : "home")}</button>`
      : isFinalMilestone
        ? `<button class="primary-button milestone-celebration-continue" data-action="open-world-celebration">${t("worldMasteredAction")} <span aria-hidden="true">✦</span></button>`
        : nextQuiz
          ? `<div class="milestone-next"><p>${escapeHtml(nextStageLabel)}</p><button class="primary-button milestone-celebration-continue level-action" data-action="next-curriculum-quiz" data-next-quiz-id="${escapeHtml(nextQuiz.id)}"><span>${t("nextLevelAction")}</span>${levelBadgeMarkup(nextQuiz.levelIndex, "compact")}<span aria-hidden="true">→</span></button></div>`
          : `<button class="primary-button milestone-celebration-continue" data-action="close-milestone-celebration"><span aria-hidden="true">←</span> ${t("home")}</button>`;
    return `
      <div class="world-celebration-overlay milestone-celebration-overlay level-stage-${escapeHtml(stage.id)} ${state.milestoneCelebrationSettled ? "is-settled" : ""}">
        <div class="world-fireworks" aria-hidden="true">${celebrationFireworksMarkup()}</div>
        <section class="world-celebration-dialog milestone-celebration-dialog" role="dialog" aria-modal="true" aria-labelledby="milestone-celebration-title" aria-describedby="milestone-celebration-description" tabindex="-1">
          <button class="icon-close milestone-celebration-close" data-action="dismiss-milestone-celebration" aria-label="${t("close")}">×</button>
          <div class="milestone-identity"><span class="world-celebration-trophy milestone-celebration-icon" aria-hidden="true">${stage.icon}</span>
          <p class="kicker">${t("milestoneReached")}</p>
          <h2 id="milestone-celebration-title">${escapeHtml(stageTitle(stage))}</h2>
          <p id="milestone-celebration-description">${t("milestoneSummary", { start: stage.startLevel, end: stage.endLevel })}</p></div>
          <button class="milestone-picture-button" data-puzzle-origin="milestone" data-action="open-puzzles" data-stage-id="${stage.id}"><span class="milestone-picture-thumbnail" aria-hidden="true">${puzzlePictureMarkup(stage.id)}</span><span>${t("viewPicture")}</span><span aria-hidden="true">↗</span></button>
          <div class="milestone-celebration-collection"><strong>${t("milestones")}</strong>${milestoneStickersMarkup(currentProfile(), { activeStageId: stage.id })}</div>
          <div class="celebration-actions">
            ${primaryAction}
            <button class="quiet-button action-feedback-button" data-action="share-progress" data-stage-id="${escapeHtml(stage.id)}">${t("shareProgress")}${actionFeedbackMarkup()}</button>
          </div>
        </section>
      </div>`;
  }

  function worldCelebrationMarkup() {
    if (!state.worldCelebrationOpen) return "";
    return `
      <div class="world-celebration-overlay world-master-celebration-overlay ${state.worldCelebrationSettled ? "is-settled" : ""}">
        <div class="world-master-stars" aria-hidden="true">${Array.from({ length: 18 }, (_, index) => `<i style="--star-x:${(index * 37 + 11) % 100}%;--star-y:${(index * 61 + 7) % 100}%;--star-delay:${(index % 6) * .4}s;--star-size:${.2 + (index % 3) * .1}rem"></i>`).join("")}</div>
        <section class="world-celebration-dialog world-master-celebration-dialog" role="dialog" aria-modal="true" aria-labelledby="world-celebration-title" aria-describedby="world-celebration-description" tabindex="-1">
          <div class="world-master-visual" aria-hidden="true">
            <span class="world-master-orbit world-master-orbit-one"></span>
            <span class="world-master-orbit world-master-orbit-two"></span>
            <div class="progress-globe world-master-globe" style="--progress:100%"><img class="progress-globe-base" src="./favicon.svg" alt="" /><img class="progress-globe-fill" src="./favicon.svg" alt="" /></div>
            <span class="world-master-celebration-trophy">🏆</span>
          </div>
          <p class="kicker">${t("congratulations")}</p>
          <h2 id="world-celebration-title">${t("worldMastered")}</h2>
          <p id="world-celebration-description">${t("worldCelebrationSummary", { levels: curriculum.levels.length, quizzes: curriculum.levels.length * 4 })}</p>
          <div class="celebration-actions">
            <button class="primary-button world-celebration-continue" data-action="view-completed-progress"><span aria-hidden="true">←</span> ${t("home")}</button>
            <button class="quiet-button action-feedback-button" data-action="share-progress" data-share-kind="world">${t("shareProgress")}${actionFeedbackMarkup()}</button>
          </div>
        </section>
      </div>`;
  }

  function profilePanelMarkup() {
    if (!state.profilePanelOpen) return "";
    const active = currentProfile();
    return `
      <div class="profile-overlay" data-action="close-profile-panel">
        <section class="profile-panel" role="dialog" aria-modal="true" aria-labelledby="profile-panel-title" tabindex="-1">
          <div class="profile-panel-heading"><div><p class="kicker">${t("settings")}</p><h2 id="profile-panel-title">${escapeHtml(active.name)}</h2></div><button class="icon-close" data-action="close-profile-panel-button" aria-label="${t("close")}">×</button></div>
          <p class="profile-privacy">${t("profilePrivacy")}</p>
          <div class="profile-list" aria-label="${t("switchProfile")}">
            ${Object.values(progressStore.profiles).map((profile) => `
              <button data-action="switch-profile" data-profile-id="${escapeHtml(profile.id)}" class="profile-choice ${profile.id === active.id ? "is-active" : ""}">
                <span class="profile-avatar" aria-hidden="true">${escapeHtml(profile.name.charAt(0).toUpperCase())}</span><span>${escapeHtml(profile.name)}</span>${profile.id === active.id ? "<span aria-hidden='true'>✓</span>" : ""}
              </button>`).join("")}
          </div>
          <div class="profile-actions">
            <button class="secondary-button" data-action="add-profile">${t("addProfile")}</button>
            <button class="secondary-button" data-action="rename-profile">${t("renameProfile")}</button>
          </div>
          <hr />
          <h3>${t("transferProfile")}</h3>
          <button class="primary-button action-feedback-button" data-action="copy-transfer">${t("copyTransferLink")}${actionFeedbackMarkup()}</button>
          <h3>${t("backupHeading")}</h3>
          <div class="profile-actions">
            <button class="secondary-button" data-action="download-backup">${t("downloadBackup")}</button>
            <label class="secondary-button file-button" role="button" tabindex="0">${t("importBackup")}<input type="file" tabindex="-1" accept="application/json,.json,.hello-world-backup" data-backup-input /></label>
          </div>
          <hr />
          <div class="profile-danger-actions">
            <button class="quiet-button" data-action="clear-profile">${t("clearProgress")}</button>
            <button class="quiet-button danger-button" data-action="delete-profile">${t("deleteProfile")}</button>
          </div>
        </section>
      </div>`;
  }

  function profileControlMarkup() {
    const profile = currentProfile();
    return `<button class="profile-control" data-action="open-profile-panel" aria-label="${escapeHtml(t("profileMenu"))}"><span class="profile-avatar" aria-hidden="true">${escapeHtml(profile.name.charAt(0).toUpperCase())}</span><span class="profile-name">${escapeHtml(profile.name)}</span></button>`;
  }

  function homeProgressMarkup(summaryValue) {
    const percentage = (summaryValue.masteredLevels / summaryValue.totalLevels) * 100;
    const allMastered = summaryValue.masteredLevels === summaryValue.totalLevels;
    return `<div class="progress-globe-wrap"><div class="progress-globe-achievement"><div class="progress-globe" style="--progress:${percentage}%" aria-hidden="true"><img class="progress-globe-base" src="./favicon.svg" alt="" /><img class="progress-globe-fill" src="./favicon.svg" alt="" /></div>${allMastered ? `<button class="world-mastery-button" data-action="replay-world-celebration" aria-label="${escapeHtml(t("replayWorldCelebration"))}"><span aria-hidden="true">🏆</span></button>` : ""}</div><strong>${t("levelsMastered", { count: summaryValue.masteredLevels, total: summaryValue.totalLevels })}</strong></div>`;
  }

  function setupMarkup() {
    const profile = currentProfile();
    const totals = progress.summary(profile, curriculum.levels);
    const next = progress.continueSelection(profile, curriculum.levels);
    const allMastered = totals.masteredQuizzes === totals.totalQuizzes;
    const quiz = next.type === "quiz" ? curriculum.quizById.get(next.quiz.id) : null;
    const savedAttempt = progress.matchingSavedAttempt(profile, quiz);
    const showSurprise = next.type === "all-mastered";
    const hasPlayed = totals.playedQuizzes > 0 || Boolean(savedAttempt);
    const continueIcon = showSurprise
      ? "✦"
      : hasPlayed && quiz
        ? stageForLevelIndex(quiz.levelIndex)?.icon ?? "→"
        : "→";
    const hasUpdatedQuiz = curriculum.levels.some((candidateLevel) => candidateLevel.quizzes.some((baseQuiz) => {
      const quiz = curriculum.quizById.get(baseQuiz.id);
      const entry = profile.quizProgress?.[quiz.id];
      return entry && Object.keys(entry.revisions ?? {}).length > 0 && !entry.revisions[String(quiz.revision)];
    }));
    return `
      <div class="setup-page progression-home"><main class="site-shell setup-shell">
        <header class="brand-bar app-header app-header-sticky">${brandMarkup(false, false)}<div class="setup-header-actions">${profileControlMarkup()}${siteHomeLinkMarkup()}</div></header>
        ${storageWarning ? `<p class="storage-warning" role="status">${t(storageWarning)}</p>` : ""}
        ${hasUpdatedQuiz ? `<p class="storage-warning" role="status">${t("updatedQuizzes")}</p>` : ""}
        <div class="home-dashboard"><section class="home-hero" id="top">
          <div><p class="kicker">${t("heroKicker")}</p><h1>${allMastered ? t("worldMastered") : `${t("heroTitleBefore")} <em>${t("heroTitleEmphasis")}</em>`}</h1></div>
          ${homeProgressMarkup(totals)}
        </section>
        <section class="home-milestones" aria-labelledby="home-milestones-title"><strong id="home-milestones-title">${t("milestones")}</strong>${milestoneStickersMarkup(profile, { interactive: true })}</section>
        <section class="home-primary-actions" aria-label="${escapeHtml(t("chooseActivity"))}">
          <button class="home-action-card continue-card" data-action="${showSurprise ? "surprise-quiz" : "continue-game"}">
            <span class="home-action-icon" aria-hidden="true">${continueIcon}</span>
            <span><strong>${showSurprise ? t("surpriseQuiz") : hasPlayed ? t("continueGame") : t("startGame")}</strong>
            ${quiz && hasPlayed ? `<small class="home-level-context">${levelBadgeMarkup(quiz.levelIndex, "small")}<span>${escapeHtml(modeLabel(quiz.mode))}</span></small>` : ""}</span>
          </button>
          <button class="home-action-card explore-home-card" data-action="explore" data-value="map"><span class="home-action-icon" aria-hidden="true">◎</span><span><strong>${t("exploreWorld")}</strong><small>${t("places", { count: countries.length })}</small></span></button>
        </section>
        <nav class="home-secondary-actions" aria-label="${t("settings")}"><button class="secondary-button" data-action="levels">${allMastered ? t("chooseLevel") : t("viewLevels")}</button><button class="quiet-button" data-action="open-challenge">${t("openSharedLink")}</button>${installActionMarkup()}</nav></div>
        <footer><span class="copyright">&copy; 2026 Lance Olav Eastgate</span><span class="license-links"><a href="./licenses/flag-icons-MIT.txt">${t("flagsLicence")}</a><a href="./licenses/local-flags.txt">${t("localFlagsLicence")}</a><a href="./licenses/twemoji-CC-BY-4.0.txt">${t("globeLicence")}</a><a href="./licenses/natural-earth-public-domain.txt">${t("mapLicence")}</a></span></footer>
        ${profilePanelMarkup()}${installHelpMarkup()}${openChallengeMarkup()}${milestoneCelebrationMarkup()}${worldCelebrationMarkup()}
      </main></div>`;
  }

  function levelsMarkup() {
    const profile = currentProfile();
    const next = progress.continueSelection(profile, curriculum.levels);
    const recommendedLevelId = next.type === "quiz" ? next.quiz.levelId : null;
    const savedQuizCandidate = profile.savedMasteryAttempt
      ? curriculum.quizById.get(profile.savedMasteryAttempt.quizId)
      : null;
    const savedAttempt = progress.matchingSavedAttempt(profile, savedQuizCandidate);
    const savedQuiz = savedAttempt ? savedQuizCandidate : null;
    const levelMarkup = (level, levelIndex) => {
        const value = progress.levelProgress(profile, level);
        const isMastery = level.kind.includes("mastery");
        const isRecommendedLevel = level.id === recommendedLevelId;
        const hasSavedAttempt = savedQuiz?.levelId === level.id;
        const levelProgressStatus = value.mastered === 4
          ? `<span class="level-mastery-status" aria-label="${escapeHtml(t("mastered"))}"><span class="mastery-trophy" aria-hidden="true">🏆</span></span>`
          : value.played ? `${value.mastered}/4 ${t("mastered")}` : `<span class="unread-dot" aria-label="${t("unplayed")}"></span>`;
        return `<section class="level-card ${value.mastered === 4 ? "is-mastered" : value.played ? "is-progress" : "is-unplayed"} ${isRecommendedLevel ? "is-recommended-level" : ""} ${hasSavedAttempt ? "has-saved-attempt" : ""}" id="level-${escapeHtml(level.id)}">
          <button class="level-heading" data-action="toggle-level" data-level-id="${level.id}" aria-expanded="${state.selectedLevelId === level.id}">
            ${levelBadgeMarkup(levelIndex, "regular")}<span><strong>${escapeHtml(levelTitle(level))}${isRecommendedLevel ? `<span class="sr-only"> · ${t("recommended")}</span>` : ""}</strong><small>${isMastery ? t("questionsLong", { count: level.countryCodes.length }) : placeCountLabel(level.countryCodes.map((code) => countriesByCode.get(code)).filter(Boolean))}</small></span>
            <span class="level-state">${hasSavedAttempt ? `<span class="level-attempt-status"><strong>${t("quizInProgress")}</strong><small>${t("answeredProgress", { answered: savedAttempt.questionIndex, total: level.countryCodes.length })}</small></span>` : ""}<span class="level-progress-status">${levelProgressStatus}</span></span>
          </button>
          ${state.selectedLevelId === level.id ? `<div class="quiz-list"><div class="level-practice-actions"><button class="level-practice-row" data-action="level-cards" data-level-id="${level.id}"><span class="level-practice-icon" aria-hidden="true"><span></span><span></span></span><span><strong>${t("cards")}</strong></span><span aria-hidden="true">→</span></button><button class="level-practice-row level-explore-row" data-action="explore-level" data-level-id="${level.id}"><span class="level-practice-map-icon" aria-hidden="true">◎</span><span><strong>${t("exploreTheseCountries")}</strong></span><span aria-hidden="true">→</span></button></div><div class="quiz-mode-list">${level.quizzes.map((baseQuiz) => {
            const quiz = curriculum.quizById.get(baseQuiz.id); const record = progress.currentRecord(profile, quiz); const status = progress.quizState(profile, quiz); const recommended = next.type === "quiz" && next.quiz.id === quiz.id; const quizAttempt = progress.matchingSavedAttempt(profile, quiz);
            const recordStatus = status === "mastered" ? `<span class="quiz-mastery-status" aria-label="${record.bestScore}/${record.total} · ${t("quizMastered")}"><span>${record.bestScore}/${record.total}</span><span class="mastery-check" aria-hidden="true">✓</span></span>` : status === "played" ? `${record.bestScore}/${record.total}` : `<span class="unread-dot" aria-label="${t("unplayed")}"></span>`;
            return `<button class="quiz-row ${recommended ? "is-recommended" : ""} ${quizAttempt ? "has-saved-attempt" : ""}" data-action="start-curriculum-quiz" data-quiz-id="${quiz.id}"><span><strong>${escapeHtml(quizAttempt ? t("continueMode", { mode: modeLabel(quiz.mode) }) : modeLabel(quiz.mode))}</strong>${quizAttempt ? `<small>${t("quizInProgress")}</small>` : recommended ? `<small>${t("recommended")}</small>` : ""}</span><span>${quizAttempt ? `<span class="quiz-attempt-status"><strong>${t("answeredProgress", { answered: quizAttempt.questionIndex, total: quiz.countryCodes.length })}</strong>${status !== "unplayed" ? `<small>${recordStatus}</small>` : ""}</span>` : recordStatus}</span></button>`;
          }).join("")}</div></div>` : ""}
        </section>`;
      };
    const recommendedNavigation = recommendedLevelId
      ? `<button class="levels-recommended-float" data-action="show-recommended-next" aria-label="${escapeHtml(t("goToRecommended"))}" hidden><span class="recommended-next-arrow" aria-hidden="true">↓</span></button>`
      : "";
    return `<main class="site-shell levels-shell"><header class="quiz-header app-header app-header-sticky levels-header">${brandMarkup(true, false)}<h1 class="levels-header-title">${t("levels")}</h1><div class="levels-header-actions">${homeButtonMarkup()}</div></header>
      <div class="levels-list">${curriculum.stages.map((stage) => {
        const headingId = `level-stage-${stage.id}`;
        const stageValue = progress.stageProgress(profile, stage, curriculum.levels);
        const stageIcon = `${stage.icon}${stageValue.isMastered ? `<span class="level-stage-check">✓</span>` : ""}`;
        return `<section class="level-stage level-stage-${escapeHtml(stage.id)} ${stageValue.isMastered ? "is-mastered" : ""}" aria-labelledby="${headingId}">
          <header class="level-stage-heading" id="${headingId}">
            ${stageValue.isMastered
              ? `<button class="level-stage-icon level-stage-replay" data-action="replay-milestone" data-stage-id="${escapeHtml(stage.id)}" aria-label="${escapeHtml(t("replayMilestone", { stage: stageTitle(stage) }))}">${stageIcon}</button>`
              : `<span class="level-stage-icon" aria-hidden="true">${stageIcon}</span>`}
            <span class="level-stage-copy"><strong>${escapeHtml(stage.title[state.locale])}</strong></span>
            <span class="level-stage-status"><span class="level-stage-range">${t("levelRange", { start: stage.startLevel, end: stage.endLevel })}</span>${stageValue.isMastered ? `<span class="level-stage-mastered">${t("stageMastered")}</span>` : ""}</span>
          </header>
          ${puzzlePreviewMarkup(stage.id)}
          <div class="level-stage-list">${curriculum.levels.slice(stage.startLevel - 1, stage.endLevel).map((level, offset) => levelMarkup(level, stage.startLevel - 1 + offset)).join("")}</div>
        </section>`;
      }).join("")}</div>${recommendedNavigation}${milestoneCelebrationMarkup()}</main>`;
  }

  function importMarkup() {
    if (state.importError || !state.importProfiles?.length) return `<main class="quiz-shell challenge-shell"><header class="quiz-header app-header app-header-sticky">${brandMarkup(true, false)}${homeButtonMarkup("cancel-import")}</header><section class="challenge-card"><h1>${t("invalidImport")}</h1><button class="primary-button" data-action="cancel-import">${t("home")}</button></section></main>`;
    const singleProfile = state.importProfiles.length === 1 ? state.importProfiles[0] : null;
    const matchingProfile = singleProfile ? progressStore.profiles[singleProfile.id] ?? null : null;
    const heading = state.importSource === "backup" ? t("backupHeading") : escapeHtml(singleProfile?.name ?? t("backupHeading"));
    const singleActions = singleProfile
      ? `${matchingProfile
          ? `<button class="primary-button" data-action="update-imported-profile">${t("updateProfile", { name: matchingProfile.name })}</button>`
          : `<button class="primary-button" data-action="create-imported-profile">${t("createProfile")}</button>`}${Object.values(progressStore.profiles).filter((profile) => profile.id !== matchingProfile?.id).map((profile) => `<button class="secondary-button" data-action="merge-import" data-profile-id="${escapeHtml(profile.id)}">${t("mergeInto", { name: profile.name })}</button>`).join("")}`
      : "";
    return `<main class="quiz-shell challenge-shell"><header class="quiz-header app-header app-header-sticky">${brandMarkup(true, false)}${homeButtonMarkup("cancel-import")}</header><section class="challenge-card import-card"><p class="kicker">${t(state.importSource === "backup" ? "importBackup" : "importProgress")}</p><h1>${heading}</h1>
      <div class="import-list">${state.importProfiles.map((profile, index) => { const totals = progress.summary(profile, curriculum.levels); return `<article><div><strong>${escapeHtml(profile.name)}</strong><span>${t("playedAndMastered", { played: totals.playedQuizzes, mastered: totals.masteredQuizzes })}</span></div>${state.importProfiles.length > 1 ? `<button class="secondary-button" data-action="import-one" data-import-index="${index}">${t("importOne")}</button>` : ""}</article>`; }).join("")}</div>
      <div class="import-actions">${state.importProfiles.length > 1 ? `<button class="primary-button" data-action="import-all">${t("importAll")}</button>` : singleActions}<button class="quiet-button" data-action="cancel-import">${t("importCancel")}</button></div>
    </section></main>`;
  }

  function reviewMarkup() {
    if (state.wrongAnswers.length === 0) return "";
    const missedCountries = [
      ...new Map(
        state.wrongAnswers.map((country) => [country.code, country]),
      ).values(),
    ];

    return `
      <section class="result-review" id="result-review" aria-labelledby="review-heading" tabindex="-1">
        <p class="kicker">${t("review")}</p>
        <div class="review-header">
          <h2 id="review-heading">${t("reviewHeading", { count: missedCountries.length })}</h2>
          <button class="secondary-button review-flashcards-button" data-action="review-missed-cards">${t("reviewCards")} <span aria-hidden="true">→</span></button>
        </div>
        <div class="review-list">
          ${missedCountries
            .map(
              (country) => `
                <button class="review-row" data-action="explore-result-country" data-code="${country.code}" data-review-code="${country.code}" aria-label="${escapeHtml(t("exploreOnMap", { name: countryName(country) }))}">
                  ${flagMarkup(country, "review-flag", true)}
                  <div>
                    <strong>${escapeHtml(countryName(country))}</strong>
                    <span>${escapeHtml(countryCapital(country))}</span>
                  </div>
                  <span class="review-row-action" aria-hidden="true">↗</span>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function challengeIntroMarkup() {
    const quiz = curriculumQuiz();
    const level = quiz ? curriculum.levelById.get(quiz.levelId) : null;
    if (!quiz || !level) return invalidChallengeMarkup();
    return `<main class="quiz-shell challenge-shell"><header class="quiz-header app-header app-header-sticky">${brandMarkup(true, false)}${homeButtonMarkup()}</header>
      <section class="challenge-card challenge-intro-card"><p class="kicker">${t("challengeQuizTitle")}</p><h1>${levelReferenceMarkup(level, { size: "large", className: "challenge-level-reference" })}</h1>
      <div class="challenge-details"><div><span>${t("testYourself")}</span><strong>${escapeHtml(modeLabel(quiz.mode))}</strong></div><div><span>${t("questionsLabel")}</span><strong>${quiz.countryCodes.length}</strong></div><div><span>${t("approximateTime", { minutes: Math.max(2, Math.ceil(quiz.countryCodes.length / 4)) })}</span><strong>${state.challengeScoreVerified ? `${t("scoreToBeat")}: ${state.challengeTargetScore}/${quiz.countryCodes.length}` : ""}</strong></div></div>
      ${state.challengeScoreWarning ? `<p class="challenge-warning" role="status">${t("unverifiedScore")}</p>` : ""}
      <button class="primary-button" data-action="start-challenge">${t("startChallenge")} <span aria-hidden="true">→</span></button></section></main>`;
  }

  function invalidChallengeMarkup() {
    return `
      <main class="quiz-shell challenge-shell">
        <header class="quiz-header app-header app-header-sticky">${brandMarkup(true, false)}</header>
        <section class="challenge-card challenge-error-card">
          <p class="kicker">${t("invalidChallengeKicker")}</p>
          <h1>${t("invalidChallengeTitle")}</h1>
          <p>${t("invalidChallengeDescription")}</p>
          <button class="primary-button" data-action="setup">
            ${t("home")} <span aria-hidden="true">→</span>
          </button>
        </section>
      </main>
    `;
  }

  function challengeComparisonMarkup() {
    if (!state.challengeActive || !state.challengeScoreVerified) return "";
    const matchedTarget = state.score === state.challengeTargetScore;
    const matchedPerfectTarget =
      matchedTarget && state.score === state.questions.length;
    const message = state.score > state.challengeTargetScore
      ? t("challengeBeat", { target: state.challengeTargetScore })
      : matchedPerfectTarget
        ? t("challengePerfectTied")
        : matchedTarget
          ? t("challengeTied", { target: state.challengeTargetScore })
          : t("challengeMissed", {
              score: state.score,
              target: state.challengeTargetScore,
            });
    return `<p class="challenge-comparison">${message}</p>`;
  }

  function resultLevelProgressMarkup(level, currentQuiz) {
    const profile = currentProfile();
    const levelValue = progress.levelProgress(profile, level);
    const modeButtons = level.quizzes.map((baseQuiz) => {
      const quiz = curriculum.quizById.get(baseQuiz.id);
      const status = progress.quizState(profile, quiz);
      const record = progress.currentRecord(profile, quiz);
      const isCurrent = quiz.id === currentQuiz.id;
      const statusMarkup = status === "mastered"
        ? `<span class="result-mode-status is-mastered"><span class="mastery-check" aria-hidden="true">✓</span></span>`
        : status === "played"
          ? `<span class="result-mode-status is-played" aria-hidden="true">${record.bestScore}/${record.total}</span>`
          : `<span class="result-mode-status is-unplayed"><span class="unread-dot" aria-hidden="true"></span></span>`;
      const accessibleLabel = status === "mastered"
        ? t("resultModeMastered", { mode: modeLabel(quiz.mode) })
        : status === "played"
          ? t("resultModePlayed", { mode: modeLabel(quiz.mode), score: record.bestScore, total: record.total })
          : t("resultModeUnplayed", { mode: modeLabel(quiz.mode) });
      return `<button class="result-mode-button ${status === "mastered" ? "is-mastered" : status === "played" ? "is-played" : "is-unplayed"} ${isCurrent ? "is-current" : ""}" data-action="start-curriculum-quiz" data-quiz-id="${escapeHtml(quiz.id)}" aria-label="${escapeHtml(accessibleLabel)}"${isCurrent ? ` aria-current="true"` : ""}><span class="result-mode-name">${escapeHtml(modeLabel(quiz.mode))}</span>${statusMarkup}</button>`;
    }).join("");
    return `<section class="result-level-progress" aria-labelledby="result-level-progress-title"><div class="result-level-progress-heading"><strong id="result-level-progress-title">${t("levelQuizProgress")}</strong><span>${t("quizzesMastered", { count: levelValue.mastered })}</span></div><div class="result-mode-grid">${modeButtons}</div></section>`;
  }

  function resultNextAction(nextQuiz, currentQuiz) {
    const sameLevel = nextQuiz.levelId === currentQuiz.levelId;
    const nextLevel = curriculum.levelById.get(nextQuiz.levelId);
    const nextLevelIndex = levelIndexForLevel(nextLevel);
    const mode = modeLabel(nextQuiz.mode);
    const modeMarkup = `<span class="result-next-mode-text">${escapeHtml(mode)}</span>`;
    const nextLabel = `${t("nextResultMode", { mode: modeMarkup })} <span class="result-action-arrow" aria-hidden="true">→</span>`;
    return {
      label: sameLevel ? nextLabel : `${levelReferenceMarkup(nextLevel, { size: "compact", className: "result-next-level-heading" })}<span class="result-next-mode-row">${nextLabel}</span>`,
      ariaLabel: t("nextQuizDestination", { action: t("nextLevelAction"), number: nextLevelIndex + 1, title: levelTitle(nextLevel), mode }),
    };
  }

  function curriculumResultMarkup() {
    const quiz = curriculumQuiz();
    const level = curriculumLevel();
    const perfect = state.score === state.questions.length;
    const nextCandidate = progress.nextUnmastered(currentProfile(), curriculum.levels, quiz.id);
    const nextQuiz = nextCandidate?.id !== quiz.id ? nextCandidate : null;
    const stage = stageForLevelIndex(quiz.levelIndex);
    const totals = progress.summary(currentProfile(), curriculum.levels);
    const allMastered = totals.masteredQuizzes === totals.totalQuizzes;
    const best = state.resultBestScore ?? state.score;
    const isNewRecord = !perfect && state.resultPreviousBestScore !== null && state.score > state.resultPreviousBestScore;
    const recordMarkup = isNewRecord
      ? `<span class="result-record is-new-record">${t("newRecord")}</span>`
      : best > state.score
        ? `<span class="result-record">${t("recordScore", { score: best, total: state.questions.length })}</span>`
        : "";
    const achievementTitle = state.resultNewLevelMastery ? t("levelMasteredResult") : perfect ? t("quizMastered") : t("quizNotMastered");
    const achievementIcon = state.resultNewLevelMastery
      ? `<span class="mastery-trophy result-level-trophy ${state.resultCelebrationPending ? "is-celebrating" : ""}" aria-hidden="true">🏆</span>`
      : perfect
        ? `<span class="mastery-check result-mastery-check ${state.resultNewQuizMastery && state.resultCelebrationPending ? "is-celebrating" : ""}" aria-hidden="true">✓</span>`
        : "";
    const nextActionContent = nextQuiz ? resultNextAction(nextQuiz, quiz) : null;
    const nextAction = nextQuiz
      ? { action: "next-curriculum-quiz", className: nextQuiz.levelId !== quiz.levelId ? "is-next-level result-next-level-button" : "", ...nextActionContent, nextQuizId: nextQuiz.id }
      : null;
    const stageAction = state.resultNewStageMastery && stage
      ? { action: "open-milestone-celebration", className: "is-curriculum-complete", label: `${t("milestoneAction")} <span class="result-stage-name"><span class="result-stage-icon level-stage-${escapeHtml(stage.id)}" aria-hidden="true">${stage.icon}</span> ${escapeHtml(stageTitle(stage))}</span>`, ariaLabel: t("openMilestoneCelebration", { stage: stageTitle(stage) }) }
      : null;
    const worldAction = allMastered
      ? { action: "open-world-celebration", className: "is-curriculum-complete", label: escapeHtml(t("congratulations")) }
      : null;
    const primaryAction = perfect ? stageAction ?? worldAction ?? nextAction : { action: "retry-curriculum-quiz", className: "", label: escapeHtml(t("tryAgainAction")) };
    const primaryIsChooseLevel = primaryAction === null;
    const primaryButton = primaryIsChooseLevel
      ? `<button class="primary-button result-primary-action" data-action="view-recommended-level">${t("chooseLevel")} <span aria-hidden="true">→</span></button>`
      : `<button class="primary-button result-primary-action${primaryAction.className ? ` ${primaryAction.className}` : ""}" data-action="${primaryAction.action}"${primaryAction.nextQuizId ? ` data-next-quiz-id="${escapeHtml(primaryAction.nextQuizId)}"` : ""}${primaryAction.ariaLabel ? ` aria-label="${escapeHtml(primaryAction.ariaLabel)}"` : ""}>${primaryAction.label}${primaryAction.action === "next-curriculum-quiz" ? "" : ' <span class="result-action-arrow" aria-hidden="true">→</span>'}</button>`;
    const secondaryNextButton = !perfect && nextAction
      ? `<button class="secondary-button result-next-button${nextAction.className ? ` ${nextAction.className}` : ""}" data-action="next-curriculum-quiz" data-next-quiz-id="${escapeHtml(nextQuiz.id)}"${nextAction.ariaLabel ? ` aria-label="${escapeHtml(nextAction.ariaLabel)}"` : ""}>${nextAction.label}</button>`
      : "";
    const chooseLevelButton = primaryIsChooseLevel
      ? ""
      : perfect || !nextAction
        ? `<button class="secondary-button result-level-button" data-action="view-recommended-level">${t("chooseLevel")}</button>`
        : `<button class="quiet-button result-level-button" data-action="view-recommended-level">${t("chooseLevel")}</button>`;
    return `<main class="quiz-shell result-shell ${state.wrongAnswers.length ? "has-review" : ""}"><header class="quiz-header app-header app-header-sticky">${brandMarkup(true, false)}${quizReturnButtonMarkup()}</header>
      <section class="result-card curriculum-result-card"><div class="result-summary-main"><p class="kicker result-level-context">${levelReferenceMarkup(level, { size: "small" })}<span aria-hidden="true">·</span><span>${escapeHtml(modeLabel(quiz.mode))}</span></p><div class="result-mastery-title"><h1>${achievementTitle}</h1>${achievementIcon}</div><div class="curriculum-result-score" aria-label="${t("scoreAnnouncement", { score: state.score, total: state.questions.length })}"><div class="result-score-value" aria-hidden="true"><strong>${state.score}</strong><span>${t("scoreOutOf", { total: state.questions.length })}</span></div>${recordMarkup}</div>${resultLevelProgressMarkup(level, quiz)}${challengeComparisonMarkup()}</div>
      <div class="result-summary-support"><div class="result-actions"><div class="result-main-actions">${primaryButton}${secondaryNextButton}${chooseLevelButton}</div></div>
      ${puzzleResultLinkMarkup()}<div class="challenge-share-actions"><button class="quiet-button action-feedback-button" data-action="share-curriculum-challenge"${isCurriculumChallengeShareReady() ? "" : " disabled aria-busy=\"true\""}>${t("challengeThisQuiz")}${actionFeedbackMarkup()}</button></div></div></section>${reviewMarkup()}${milestoneCelebrationMarkup()}${worldCelebrationMarkup()}</main>`;
  }

  function exploreCountryStatusMarkup(countryCode) {
    const country = countriesByCode.get(countryCode);
    if (!country) {
      return `
        <div class="explore-country-status is-empty">
          <strong>${t("chooseCountry")}</strong>
        </div>
      `;
    }

    return `
      <button
        type="button"
        class="explore-country-status"
        data-action="open-country-details"
        data-code="${country.code}"
        aria-label="${escapeHtml(t("showCountryDetails", {
          name: countryName(country),
        }))}"
      >
        ${flagMarkup(country, "explore-status-flag", false, true)}
        <span>
          <strong>${escapeHtml(countryName(country))}</strong>
          <small>${escapeHtml(countryCapital(country))}</small>
        </span>
        <span class="explore-country-status-action" aria-hidden="true">↗</span>
      </button>
    `;
  }

  function countryDetailsDialogMarkup(country) {
    if (!country) return "";
    const note = countryNote(country);
    const showCentreExplanation = hasSpecialCentres(country) && !note;
    const hasSupportingContent =
      country.category === "other-place" || showCentreExplanation || Boolean(note);
    return `
      <div
        class="country-details-dialog"
        data-action="close-country-details"
        role="dialog"
        aria-modal="true"
        aria-labelledby="country-details-title"
        tabindex="-1"
      >
        <div class="country-details-card ${hasSupportingContent ? "has-supporting-content" : ""}">
          ${flagMarkup(country, "country-details-flag", true, true)}
          <h2 id="country-details-title">
            <span class="sr-only">${escapeHtml(t("countryDetails", {
              name: countryName(country),
            }))}</span>
            <span aria-hidden="true">${escapeHtml(countryName(country))}</span>
          </h2>
          <p class="country-details-capital">${escapeHtml(countryCapital(country))}</p>
          ${country.category === "other-place" ? `<div class="place-metadata">${relationshipChipMarkup(country)}${country.flagStatus === "established-local" ? `<p class="place-flag-status">${escapeHtml(t("establishedLocalFlag"))}</p>` : ""}</div>` : ""}
          ${showCentreExplanation ? `<dl class="place-centres place-centres-explanation">
            ${country.centres.map((centre) => `<div class="place-centre place-centre-${centre.kind}"><dt>${escapeHtml(centreRole(centre))}</dt><dd>${escapeHtml(centre.name[state.locale])}</dd></div>`).join("")}
          </dl>` : ""}
          ${note ? `<p class="country-note">${escapeHtml(note)}</p>` : ""}
        </div>
      </div>
    `;
  }

  function exploreSilhouetteOverlayMarkup() {
    const silhouetteCode =
      state.explorePinnedCode ?? state.explorePreviewCode;
    if (!silhouetteCode) return "";

    const isPinned = silhouetteCode === state.explorePinnedCode;
    return countrySilhouetteMarkup(silhouetteCode, {
      interactive: isPinned,
      expanded: isPinned && state.silhouetteExpanded,
    });
  }

  function exploreMapCountryMarkup(country, view) {
    const hasLocatorMarker = view.markers.some(
      (marker) => marker.code === country.code,
    );
    const paths = view.features
      .filter((feature) => feature.code === country.code)
      .map((feature) =>
        regionalMapPathMarkup(feature, "explore-map-country-shape"),
      )
      .join("");
    const markers = view.markers
      .filter((marker) => marker.code === country.code)
      .map(
        (marker) => `
          <circle
            class="explore-map-marker-hit"
            cx="${marker.x}"
            cy="${marker.y}"
            r="11"
            data-map-marker-screen-radius="11"
          />
        `,
      )
      .join("");
    const classes = [
      "explore-map-country",
      country.category === "other-place" ? "is-other-place" : "",
      state.explorePinnedCode === country.code ? "is-pinned" : "",
      state.explorePreviewCode === country.code ? "is-preview" : "",
      hasLocatorMarker ? "has-locator-marker is-locator-hidden" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `
      <g
        class="${classes}"
        data-action="explore-country"
        data-explore-code="${country.code}"
        role="button"
        tabindex="0"
        aria-label="${escapeHtml(t("countryCapital", {
          name: countryName(country),
          capital: countryCapital(country),
        }))}"
        aria-pressed="${state.explorePinnedCode === country.code}"
      >
        ${paths}
        ${markers}
      </g>
    `;
  }

  function exploreMapMarkerLayerMarkup(
    sortedCountries,
    view,
  ) {
    const regionCodes = new Set(sortedCountries.map((country) => country.code));

    return view.markers
      .filter((marker) => regionCodes.has(marker.code))
      .map((marker) => {
        const classes = [
          "explore-map-marker-control",
          state.explorePinnedCode === marker.code ? "is-pinned" : "",
          state.explorePreviewCode === marker.code ? "is-preview" : "",
          countriesByCode.get(marker.code)?.category === "other-place" ? "is-other-place" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return `
          <g
            class="${classes}"
            data-action="explore-country"
            data-explore-code="${marker.code}"
            data-map-marker-readable-size="${marker.readableSize ?? 0}"
            aria-hidden="true"
          >
            <circle
              class="explore-map-marker-top-hit"
              cx="${marker.x}"
              cy="${marker.y}"
              r="11"
              data-map-marker-screen-radius="11"
            />
            <circle
              class="explore-map-country-marker"
              cx="${marker.x}"
              cy="${marker.y}"
              r="3"
              data-map-marker-screen-radius="3"
              vector-effect="non-scaling-stroke"
            />
          </g>
        `;
      })
      .join("");
  }

  function syncMapMarkerRadii(svg, viewBox, renderedBounds) {
    const mapUnitsPerPixel =
      viewBox.width / Math.max(renderedBounds.width, 1);
    svg.querySelectorAll("[data-map-marker-screen-radius]").forEach(
      (marker) => {
        marker.setAttribute(
          "r",
          Number(marker.dataset.mapMarkerScreenRadius) * mapUnitsPerPixel,
        );
      },
    );
  }

  function syncRegionalMarkerHandoffs(svg, viewBox, renderedBounds) {
    const mapUnitsPerPixel =
      viewBox.width / Math.max(renderedBounds.width, 1);
    const markerControls = svg.querySelectorAll(
      "[data-map-marker-readable-size]",
    );
    const processedQuizCodes = new Set();

    markerControls.forEach((markerControl) => {
      const readableSize = Number(
        markerControl.dataset.mapMarkerReadableSize,
      );
      const geometryReadable =
        readableSize / Math.max(mapUnitsPerPixel, Number.EPSILON) >=
        exploreMapGeometryReadableSize;

      markerControl.classList.toggle(
        "is-geometry-readable",
        geometryReadable,
      );

      const exploreCode = markerControl.dataset.exploreCode;
      if (exploreCode) {
        const countryControl = svg.querySelector(
          `.explore-map-country[data-explore-code="${exploreCode}"]`,
        );
        countryControl?.classList.toggle(
          "is-locator-hidden",
          !geometryReadable,
        );
        countryControl?.classList.toggle(
          "is-geometry-readable",
          geometryReadable,
        );
        return;
      }

      const code = markerControl.dataset.mapMarkerCode;
      if (!code || processedQuizCodes.has(code)) return;
      processedQuizCodes.add(code);
      svg
        .querySelectorAll(`[data-map-marker-code="${code}"]`)
        .forEach((marker) =>
          marker.classList.toggle(
            "is-geometry-readable",
            geometryReadable,
          ),
        );
      svg
        .querySelectorAll(`[data-map-country-code="${code}"]`)
        .forEach((shape) =>
          shape.classList.toggle("is-locator-hidden", !geometryReadable),
        );
    });
  }

  function getExploreMapViewport(
    baseViewBox,
    scopeId = state.region,
  ) {
    const canonicalBase = parseMapViewBox(baseViewBox);
    if (
      state.exploreMapViewport?.region !== scopeId ||
      !mapViewBoxesEqual(
        state.exploreMapViewport.canonicalBase,
        canonicalBase,
      )
    ) {
      state.exploreMapViewport = {
        region: scopeId,
        canonicalBase,
        base: { ...canonicalBase },
        view: { ...canonicalBase },
      };
    }
    return state.exploreMapViewport;
  }

  function clampExploreMapView(view, base) {
    return mapView.clampView(view, base, exploreMapMaxZoom);
  }

  function syncExploreMapZoomUi() {
    exploreMapUiFrame = null;
    const viewport = state.exploreMapViewport;
    const svg = app.querySelector("[data-explore-map-svg]");
    if (!viewport || !svg) return;

    const bounds = svg.getBoundingClientRect();
    const nextBase = fitMapViewBoxToAspect(
      viewport.canonicalBase,
      bounds.width / Math.max(bounds.height, 1),
    );
    if (!mapViewBoxesEqual(nextBase, viewport.base)) {
      const previousBase = viewport.base;
      const zoom = exploreMapZoom(viewport);
      const centerX = viewport.view.x + viewport.view.width / 2;
      const centerY = viewport.view.y + viewport.view.height / 2;
      const normalizedX = (centerX - previousBase.x) / previousBase.width;
      const normalizedY = (centerY - previousBase.y) / previousBase.height;
      viewport.base = nextBase;
      const width = nextBase.width / zoom;
      const height = nextBase.height / zoom;
      viewport.view = clampExploreMapView(
        {
          x: nextBase.x + normalizedX * nextBase.width - width / 2,
          y: nextBase.y + normalizedY * nextBase.height - height / 2,
          width,
          height,
        },
        nextBase,
      );
    }

    svg.setAttribute("viewBox", serializeMapViewBox(viewport.view));
    syncMapMarkerRadii(svg, viewport.view, bounds);
    syncRegionalMarkerHandoffs(svg, viewport.view, bounds);
    const zoom = exploreMapZoom(viewport);
    const percent = Math.round(zoom * 100);
    const zoomOut = app.querySelector('[data-action="explore-map-zoom-out"]');
    const zoomIn = app.querySelector('[data-action="explore-map-zoom-in"]');
    const reset = app.querySelector('[data-action="explore-map-zoom-reset"]');
    const map = app.querySelector(".explore-region-map");

    if (zoomOut) zoomOut.disabled = zoom <= 1.001;
    if (zoomIn) zoomIn.disabled = zoom >= exploreMapMaxZoom - 0.001;
    map?.classList.toggle("is-zoomed", zoom > 1.001);
    if (reset) {
      reset.hidden = zoom <= 1.001;
      reset.textContent = `${percent}%`;
      const label = t("resetMapZoom", { percent });
      reset.setAttribute("aria-label", label);
      reset.title = label;
    }
  }

  function scheduleExploreMapZoomUi() {
    if (exploreMapUiFrame !== null) return;
    exploreMapUiFrame = requestAnimationFrame(syncExploreMapZoomUi);
  }

  function questionMapTargetBounds(svg) {
    const boxes = [...svg.querySelectorAll(
      ".question-map-country.is-target:not(.is-crop-edge)",
    )]
      .map((path) => {
        try {
          return path.getBBox();
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    if (boxes.length > 0) {
      const minimumX = Math.min(...boxes.map((box) => box.x));
      const minimumY = Math.min(...boxes.map((box) => box.y));
      const maximumX = Math.max(...boxes.map((box) => box.x + box.width));
      const maximumY = Math.max(...boxes.map((box) => box.y + box.height));
      if (maximumX > minimumX || maximumY > minimumY) {
        return {
          x: minimumX,
          y: minimumY,
          width: maximumX - minimumX,
          height: maximumY - minimumY,
        };
      }
    }

    const marker = svg.querySelector(
      ".question-map-marker.is-target:not(.is-target-halo)",
    );
    if (!marker) return null;
    return {
      x: Number(marker.getAttribute("cx")),
      y: Number(marker.getAttribute("cy")),
      width: 0,
      height: 0,
    };
  }

  function syncResponsiveRegionMaps() {
    responsiveMapFrame = null;
    app.querySelectorAll("[data-responsive-region-map]").forEach((svg) => {
      const bounds = svg.getBoundingClientRect();
      const base = parseMapViewBox(svg.dataset.baseViewBox);
      const fitted = fitMapViewBoxToAspect(
        base,
        bounds.width / Math.max(bounds.height, 1),
      );
      const targetBounds = svg.dataset.questionMapArea === "nearby"
        ? questionMapTargetBounds(svg)
        : null;
      const view = targetBounds
        ? nearbyMapViewBox(
            fitted,
            targetBounds,
            parseMapViewBox(svg.dataset.bleedViewBox),
          )
        : fitted;
      svg.setAttribute("viewBox", serializeMapViewBox(view));
      syncMapMarkerRadii(svg, view, bounds);
      syncRegionalMarkerHandoffs(svg, view, bounds);
    });
  }

  function scheduleResponsiveRegionMaps() {
    if (responsiveMapFrame !== null) return;
    responsiveMapFrame = requestAnimationFrame(syncResponsiveRegionMaps);
  }

  function flushExploreMapZoomUi() {
    if (exploreMapUiFrame !== null) {
      cancelAnimationFrame(exploreMapUiFrame);
    }
    syncExploreMapZoomUi();
  }

  function setExploreMapZoom(nextZoom, clientPoint = null) {
    const viewport = state.exploreMapViewport;
    if (!viewport) return;

    const zoom = clamp(nextZoom, 1, exploreMapMaxZoom);
    let anchorX = viewport.view.x + viewport.view.width / 2;
    let anchorY = viewport.view.y + viewport.view.height / 2;
    let positionX = 0.5;
    let positionY = 0.5;

    if (clientPoint) {
      const svg = app.querySelector("[data-explore-map-svg]");
      const matrix = svg?.getScreenCTM();
      if (matrix) {
        const anchor = screenPointToMap(clientPoint, matrix.inverse());
        anchorX = anchor.x;
        anchorY = anchor.y;
        positionX = (anchorX - viewport.view.x) / viewport.view.width;
        positionY = (anchorY - viewport.view.y) / viewport.view.height;
      }
    }

    const width = viewport.base.width / zoom;
    const height = viewport.base.height / zoom;
    viewport.view = clampExploreMapView(
      {
        x: anchorX - positionX * width,
        y: anchorY - positionY * height,
        width,
        height,
      },
      viewport.base,
    );
    flushExploreMapZoomUi();
  }

  function normalizedZoomWheelDelta(event) {
    const unit =
      event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? window.innerHeight
          : 1;
    return clamp(event.deltaY * unit, -100, 100);
  }

  function zoomExploreMapFromWheel(event) {
    const delta = normalizedZoomWheelDelta(event);
    if (Math.abs(delta) < 0.01) return;
    const nextZoom = exploreMapZoom() * Math.exp(-delta * 0.005);
    setExploreMapZoom(nextZoom, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  function stepExploreMapZoom(direction) {
    const zoom = exploreMapZoom();
    const nextZoom =
      direction > 0
        ? exploreMapZoomLevels.find((level) => level > zoom + 0.01) ??
          exploreMapMaxZoom
        : [...exploreMapZoomLevels]
            .reverse()
            .find((level) => level < zoom - 0.01) ?? 1;
    setExploreMapZoom(nextZoom);
  }

  function resetExploreMapZoom() {
    const viewport = state.exploreMapViewport;
    if (!viewport) return;
    viewport.view = { ...viewport.base };
    flushExploreMapZoomUi();
  }

  function startExploreMapGesture(map) {
    const points = [...exploreMapPointers.entries()].filter(
      ([, point]) => point.map === map,
    );
    if (points.length < 2) return;

    flushExploreMapZoomUi();
    const svg = map.querySelector("[data-explore-map-svg]");
    const matrix = svg?.getScreenCTM();
    const viewport = state.exploreMapViewport;
    if (!svg || !matrix || !viewport) return;

    const [[firstId, first], [secondId, second]] = points;
    const midpoint = mapPointerMidpoint(first, second);
    const inverseMatrix = matrix.inverse();
    const midpointInMap = screenPointToMap(midpoint, inverseMatrix);
    exploreMapGesture = {
      pointerIds: [firstId, secondId],
      startDistance: Math.max(1, mapPointerDistance(first, second)),
      startMidpointInMap: midpointInMap,
      inverseMatrix,
      startView: { ...viewport.view },
      startZoom: exploreMapZoom(viewport),
    };

    for (const pointerId of exploreMapGesture.pointerIds) {
      try {
        map.setPointerCapture(pointerId);
      } catch {
        // Safari can release a pointer before the second touch is registered.
      }
    }
  }

  function updateExploreMapGesture() {
    const gesture = exploreMapGesture;
    const viewport = state.exploreMapViewport;
    if (!gesture || !viewport) return;

    const [first, second] = gesture.pointerIds.map((pointerId) =>
      exploreMapPointers.get(pointerId),
    );
    if (!first || !second) return;

    const midpoint = mapPointerMidpoint(first, second);
    const distance = Math.max(1, mapPointerDistance(first, second));
    const zoom = clamp(
      gesture.startZoom * (distance / gesture.startDistance),
      1,
      exploreMapMaxZoom,
    );
    const width = viewport.base.width / zoom;
    const height = viewport.base.height / zoom;
    const midpointInStartSpace = screenPointToMap(
      midpoint,
      gesture.inverseMatrix,
    );
    const deltaX =
      midpointInStartSpace.x - gesture.startMidpointInMap.x;
    const deltaY =
      midpointInStartSpace.y - gesture.startMidpointInMap.y;
    const anchorX =
      (gesture.startMidpointInMap.x - gesture.startView.x) /
      gesture.startView.width;
    const anchorY =
      (gesture.startMidpointInMap.y - gesture.startView.y) /
      gesture.startView.height;
    const scaleFromStart = width / gesture.startView.width;

    viewport.view = clampExploreMapView(
      {
        x:
          gesture.startMidpointInMap.x -
          anchorX * width -
          deltaX * scaleFromStart,
        y:
          gesture.startMidpointInMap.y -
          anchorY * height -
          deltaY * scaleFromStart,
        width,
        height,
      },
      viewport.base,
    );
    scheduleExploreMapZoomUi();
  }

  function startExploreMapDrag(event, map, { allowAtBase = false } = {}) {
    flushExploreMapZoomUi();
    const svg = map.querySelector("[data-explore-map-svg]");
    const matrix = svg?.getScreenCTM();
    const viewport = state.exploreMapViewport;
    if (
      !svg ||
      !matrix ||
      !viewport ||
      (!allowAtBase && exploreMapZoom(viewport) <= 1.001)
    ) {
      return;
    }

    const startPoint = { x: event.clientX, y: event.clientY };
    const inverseMatrix = matrix.inverse();
    exploreMapDrag = {
      pointerId: event.pointerId,
      map,
      startPoint,
      startPointInMap: screenPointToMap(startPoint, inverseMatrix),
      inverseMatrix,
      startView: { ...viewport.view },
      dragging: false,
    };
  }

  function updateExploreMapDrag(event) {
    const drag = exploreMapDrag;
    const viewport = state.exploreMapViewport;
    if (!drag || drag.pointerId !== event.pointerId || !viewport) return;

    const clientPoint = { x: event.clientX, y: event.clientY };
    if (
      !drag.dragging &&
      Math.hypot(
        clientPoint.x - drag.startPoint.x,
        clientPoint.y - drag.startPoint.y,
      ) < 5
    ) {
      return;
    }

    if (!drag.dragging) {
      drag.dragging = true;
      drag.map.classList.add("is-dragging");
      try {
        drag.map.setPointerCapture(event.pointerId);
      } catch {
        // The pointer may already have been released outside the map.
      }
    }

    const pointInStartSpace = screenPointToMap(
      clientPoint,
      drag.inverseMatrix,
    );
    viewport.view = clampExploreMapView(
      {
        x:
          drag.startView.x -
          (pointInStartSpace.x - drag.startPointInMap.x),
        y:
          drag.startView.y -
          (pointInStartSpace.y - drag.startPointInMap.y),
        width: drag.startView.width,
        height: drag.startView.height,
      },
      viewport.base,
    );
    event.preventDefault();
    scheduleExploreMapZoomUi();
  }

  function exploreMapView(extent) {
    if (extent === "world") {
      return {
        viewBox: mapData.viewBox,
        features: mapData.features,
        markers: mapData.markers,
      };
    }
    return mapData.quizRegions[extent];
  }

  function exploreMapExtentLabel(extent) {
    if (extent === "world") return t("wholeWorld");
    return regionLabel(regionsById.get(extent));
  }

  function exploreMapAreaControlsContentMarkup() {
    const extent = state.exploreMapExtent;
    const selectedRegion = mapRegionForCode(state.explorePinnedCode);
    const zoomInExtent = exploreState.zoomInExtent(
      extent,
      selectedRegion,
    );
    const zoomOutExtent = exploreState.zoomOutExtent(extent);
    const controls = [];
    if (zoomOutExtent !== extent) {
      controls.push(`<button type="button" class="secondary-button explore-map-scope-button" data-action="explore-map-area" data-value="${zoomOutExtent}"><span aria-hidden="true">−</span> ${escapeHtml(t("viewWorld"))}</button>`);
    }
    if (zoomInExtent !== extent) {
      controls.push(`<button type="button" class="secondary-button explore-map-scope-button" data-action="explore-map-area" data-value="${zoomInExtent}">${escapeHtml(t("showRegion"))} <span aria-hidden="true">+</span></button>`);
    }
    return controls.join("");
  }

  function exploreMapAreaControlsMarkup() {
    return `<div class="explore-map-scope-controls" role="group" aria-label="${escapeHtml(t("mapAreaControls"))}">${exploreMapAreaControlsContentMarkup()}</div>`;
  }

  function explorePlaceGroupMarkup(sortedPlaces, category) {
    const group = sortedPlaces.filter((place) => place.category === category);
    if (!group.length) return "";
    const heading = category === "country" ? t("countriesHeading") : t("otherCompactHeading");
    return `
      <section class="explore-place-group" aria-labelledby="explore-group-${category}">
        <h3 id="explore-group-${category}">${escapeHtml(heading)}: <span>${group.length}</span></h3>
        ${group.map((country) => `
          <button
            class="explore-country-card${country.category === "other-place" ? " is-other-place" : ""}${state.explorePinnedCode === country.code ? " is-pinned" : ""}${state.explorePreviewCode === country.code ? " is-preview" : ""}"
            data-action="explore-country"
            data-explore-code="${country.code}"
            aria-pressed="${state.explorePinnedCode === country.code}"
          >
            ${flagMarkup(country, "explore-country-flag", false, true)}
            <span>
              <strong>${escapeHtml(countryName(country))}</strong>
              <small>${escapeHtml(countryCapital(country))}</small>
            </span>
          </button>
        `).join("")}
      </section>`;
  }

  function exploreRegionMapMarkup(sortedCountries) {
    const extent = state.exploreMapExtent ?? "world";
    const scopeLabel = exploreScopeLabel();
    const extentLabel = exploreMapExtentLabel(extent);
    const view = exploreMapView(extent);
    const mapViewport = getExploreMapViewport(
      view.viewBox,
      extent,
    );
    const zoom = exploreMapZoom(mapViewport);
    const zoomPercent = Math.round(zoom * 100);
    const worldViewBox = parseMapViewBox(mapData.viewBox);
    const worldAspectStyle =
      extent === "world"
        ? ` style="--world-map-aspect: ${worldViewBox.width} / ${worldViewBox.height}"`
        : "";
    const scopedCodes = new Set(sortedCountries.map((country) => country.code));
    const contextFeatures = [
      ...(view.backgroundFeatures ?? []),
      ...view.features.filter((feature) => !scopedCodes.has(feature.code)),
    ];
    const contextPaths = contextFeatures
      .map((feature) =>
        regionalMapPathMarkup(feature, "explore-map-context-shape"),
      )
      .join("");
    const contextMarkers = view.markers
      .filter((marker) => !scopedCodes.has(marker.code))
      .map((marker) =>
        regionalMapMarkerMarkup(
          marker,
          "explore-map-context-marker",
          2.4,
        ),
      )
      .join("");

    return `
      <div class="explore-map-layout">
        <div class="explore-map-column">
          <div class="explore-country-status-wrap" aria-live="polite">
            ${exploreCountryStatusMarkup(state.explorePinnedCode)}
          </div>
          <div class="explore-map-stage">
            <div class="explore-region-map${extent === "world" ? " is-world-extent" : ""}${zoom > 1.001 ? " is-zoomed" : ""}${state.silhouetteExpanded ? " has-expanded-silhouette" : ""}"${worldAspectStyle}>
          ${exploreMapAreaControlsMarkup()}
          <svg
            data-explore-map-svg
            viewBox="${serializeMapViewBox(mapViewport.view)}"
            role="group"
            aria-label="${escapeHtml(t("interactiveRegionMap", {
              region: extentLabel,
            }))}"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect class="question-map-ocean" x="-10000" y="-10000" width="20000" height="20000" />
            <g aria-hidden="true">${contextPaths}${contextMarkers}</g>
            ${sortedCountries
              .map((country) =>
                exploreMapCountryMarkup(country, view),
              )
              .join("")}
            ${exploreMapMarkerLayerMarkup(
              sortedCountries,
              view,
            )}
          </svg>
          <div
            class="explore-map-zoom-controls"
            role="group"
            aria-label="${escapeHtml(t("mapZoomControls"))}"
          >
            <button
              type="button"
              data-action="explore-map-zoom-out"
              aria-label="${escapeHtml(t("zoomOutMap"))}"
              title="${escapeHtml(t("zoomOutMap"))}"
              ${zoom <= 1.001 ? "disabled" : ""}
            >−</button>
            <button
              type="button"
              class="explore-map-zoom-reset"
              data-action="explore-map-zoom-reset"
              aria-label="${escapeHtml(t("resetMapZoom", { percent: zoomPercent }))}"
              title="${escapeHtml(t("resetMapZoom", { percent: zoomPercent }))}"
              ${zoom <= 1.001 ? "hidden" : ""}
            >${zoomPercent}%</button>
            <button
              type="button"
              data-action="explore-map-zoom-in"
              aria-label="${escapeHtml(t("zoomInMap"))}"
              title="${escapeHtml(t("zoomInMap"))}"
              ${zoom >= exploreMapMaxZoom - 0.001 ? "disabled" : ""}
            >+</button>
          </div>
          <div class="explore-silhouette-overlay">
            ${exploreSilhouetteOverlayMarkup()}
          </div>
            </div>
          </div>
        </div>

        <aside class="explore-country-panel" aria-label="${escapeHtml(t("countriesInRegion"))}">
          <div class="explore-list-controls">
            <button
              type="button"
              class="explore-region-control"
              data-action="open-explore-region-picker"
              aria-haspopup="true"
              aria-label="${escapeHtml(t("changeRegion"))}: ${escapeHtml(scopeLabel)}"
            >
              <span>
                <strong>${exploreScopeMarkup("small")}</strong>
              </span>
              <span class="explore-region-control-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false"><path d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3" /></svg>
              </span>
            </button>
            <button type="button" class="primary-button explore-flashcards-button" data-action="explore-cards">${escapeHtml(t("flashcards"))}</button>
          </div>
          <div class="scroll-affordance-frame" data-scroll-affordance-frame>
            <div class="explore-country-list" data-scroll-affordance>
              ${explorePlaceGroupMarkup(sortedCountries, "country")}
              ${explorePlaceGroupMarkup(sortedCountries, "other-place")}
            </div>
          </div>
        </aside>
      </div>
    `;
  }

  function exploreRegionPickerMarkup() {
    return `
      <section class="explore-region-picker" aria-labelledby="explore-region-picker-heading">
        <div class="explore-region-picker-heading">
          <div>
            <p class="kicker">${escapeHtml(t("chooseSingleRegion"))}</p>
            <h2 id="explore-region-picker-heading">${escapeHtml(t("exploreMapHeading"))}</h2>
          </div>
          <button
            type="button"
            class="quiet-button"
            data-action="close-explore-region-picker"
          >${escapeHtml(t("cancel"))}</button>
        </div>
        <div class="explore-region-picker-layout">
          ${worldMapMarkup("explore-map-region")}
          <div class="explore-region-cards">
            ${["world", ...mapSelectableRegions]
              .map((regionId) => {
                const option = regionsById.get(regionId);
                return `
                  <button
                    type="button"
                    class="region-card ${state.exploreScope === null && state.region === regionId ? "is-selected" : ""}"
                    data-action="explore-map-region"
                    data-value="${regionId}"
                    ${regionId === "world" ? "" : `data-map-region="${regionId}"`}
                    aria-pressed="${state.exploreScope === null && state.region === regionId}"
                  >
                    <span>${escapeHtml(regionId === "world" ? t("wholeWorld") : regionLabel(option))}</span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function exploreMarkup() {
    const detailsCountry = countriesByCode.get(state.countryDetailsCode);
    const backgroundState = detailsCountry ? ' inert aria-hidden="true"' : "";
    const scopedCountries = countriesInExploreMapScope();
    const scopedByCode = new Map(scopedCountries.map((country) => [country.code, country]));
    const sortedCountries = exploreState
      .sortCodes(
        scopedCountries.map((country) => country.code),
        (code) => countryName(scopedByCode.get(code)),
        state.locale,
      )
      .map((code) => scopedByCode.get(code));
    return `
      <main class="site-shell explore-shell explore-map-shell">
        <header class="quiz-header app-header explore-header"${backgroundState}>
          ${brandMarkup(true, false)}
          <h1
            class="explore-context"
            tabindex="-1"
          >${escapeHtml(t("explore"))}</h1>
          ${state.exploreReturn?.screen === "result"
            ? headerReturnButtonMarkup("back-from-explore", "resultsDestination", "backToResults")
            : state.exploreReturn?.screen === "levels"
              ? headerReturnButtonMarkup("back-from-explore", "levels", "backToLevels")
              : homeButtonMarkup()}
        </header>

        <div class="explore-content"${backgroundState}>
          ${
            state.exploreRegionPickerOpen
              ? exploreRegionPickerMarkup()
              : exploreRegionMapMarkup(sortedCountries)
          }
        </div>
        ${countryDetailsDialogMarkup(detailsCountry)}
      </main>
    `;
  }

  function flashcardMarkup() {
    const region = selectedRegion();
    const level = curriculum.levelById.get(state.activeLevelId);
    const scopeLabel =
      state.flashcardReturn === "explore"
        ? exploreScopeLabel()
        : level
          ? levelTitle(level)
          : regionLabel(region);
    const returnLabel = state.flashcardReturn === "explore"
      ? t("backToExplore")
      : state.flashcardReturn === "result"
        ? t("backToResults")
        : t("backToLevels");
    const summaryLevelScopeMarkup = state.flashcardReturn === "level" && level
      ? levelReferenceMarkup(level, { size: "small" })
      : null;
    const summaryScopeMarkup = summaryLevelScopeMarkup ?? escapeHtml(scopeLabel);
    const headerLevel = state.flashcardReturn === "explore"
      ? curriculum.levelById.get(state.exploreScope?.levelId)
      : level;
    const headerScopeMarkup = headerLevel
      ? levelReferenceMarkup(headerLevel, { size: "small", showTitle: false })
      : escapeHtml(scopeLabel);
    const headerReturnButton = state.flashcardReturn === "explore"
      ? headerReturnButtonMarkup("back-from-cards", "explore", "backToExplore")
      : state.flashcardReturn === "result"
        ? headerReturnButtonMarkup("back-from-cards", "resultsDestination", "backToResults")
        : headerReturnButtonMarkup("back-from-cards", "levels", "backToLevels");
    const complete = state.flashcardIndex >= state.flashcards.length;

    if (complete) {
      return `
        <main class="quiz-shell flashcard-shell">
          <header class="quiz-header app-header">
            ${brandMarkup(true, false)}
          </header>
          <section class="flashcard-complete">
            <p class="kicker">${t("flashcardsComplete")}</p>
            <h1>${t("roundComplete")}</h1>
            <p>
              ${t("flashcardsSummaryBefore")} ${state.flashcards.length}
              ${t("flashcardsSummaryAfter")}
              ${summaryScopeMarkup}${/[.!?]$/.test(scopeLabel) ? "" : "."}
            </p>
            <div class="flashcard-actions">
              <button class="primary-button" data-action="back-from-cards">${escapeHtml(returnLabel)}</button>
            </div>
          </section>
        </main>
      `;
    }

    const country = state.flashcards[state.flashcardIndex];
    const relationshipLabel = country.category === "other-place"
      ? placeRelationshipLabel(country)
      : null;
    const progress = ((state.flashcardIndex + 1) / state.flashcards.length) * 100;
    return `
      <main class="quiz-shell flashcard-shell">
        <header class="quiz-header app-header">
          ${brandMarkup(true, false)}
          <div class="quiz-meta">
            <span class="flashcard-scope">${headerScopeMarkup}</span>
            <strong>${state.flashcardIndex + 1} / ${state.flashcards.length}</strong>
          </div>
          ${headerReturnButton}
        </header>
        <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${
          state.flashcards.length
        }" aria-valuenow="${state.flashcardIndex + 1}">
          <span style="width: ${progress}%"></span>
        </div>
        <button
          class="flashcard-stage ${state.flashcardRevealed ? "is-revealed" : ""}"
          data-action="flashcard-toggle"
          aria-label="${
            state.flashcardRevealed
              ? escapeHtml(t(
                  relationshipLabel ? "revealedRelatedFlashcard" : "revealedFlashcard",
                  {
                    name: countryName(country),
                    capital: countryCapital(country),
                    relationship: relationshipLabel,
                  },
                ))
              : escapeHtml(t("hiddenFlashcard", {
                  current: state.flashcardIndex + 1,
                  total: state.flashcards.length,
                }))
          }"
        >
          ${flagMarkup(country, "flashcard-flag", state.flashcardRevealed, true)}
          <span class="flashcard-answer">
            ${state.flashcardRevealed
              ? `<strong>${escapeHtml(countryName(country))}</strong><span>${escapeHtml(countryCapital(country))}</span>${relationshipLabel ? `<span class="flashcard-relationship">(${escapeHtml(relationshipLabel)})</span>` : ""}`
              : `<strong class="flashcard-question" aria-hidden="true">?</strong>`}
          </span>
        </button>
      </main>
    `;
  }

  function promptMarkup(question, answered) {
    if (state.mode === "country-flag") {
      return `
        <h1 class="question-heading question-with-clue">
          <span class="question-instruction">${t("findFlag")}</span>
          <em class="question-clue">${escapeHtml(countryName(question.country))}</em>
        </h1>
      `;
    }

    if (state.mode === "flag-country") {
      return `
        <h1 class="question-heading question-compact">${t("whichCountry")}</h1>
        ${flagMarkup(question.country, "featured-flag", answered)}
      `;
    }

    if (state.mode === "map-country") {
      return `
        <h1 class="question-heading question-compact">${t("whichCountry")}</h1>
      `;
    }

    const name = escapeHtml(countryName(question.country));
    return `
      <h1
        class="question-heading question-with-clue question-capital"
        aria-label="${escapeHtml(`${t("findCapital")} ${countryName(question.country)}`)}"
      >
        <span class="question-instruction">${t("findCapital")}</span>
        <span class="capital-clue" aria-hidden="true">
          ${flagMarkup(question.country, "prompt-flag", false)}
          <em class="question-clue">${name}</em>
        </span>
      </h1>
    `;
  }

  function answerMarkup(choice, index, question) {
    const isChosen = state.selectedCode === choice.code;
    const isAnswer = choice.code === question.country.code;
    const answered = state.answerStatus !== "unanswered";
    const awaitingCorrection = state.answerStatus === "correction";
    const stateClass =
      state.answerStatus === "correct"
        ? isAnswer
          ? "is-correct"
          : "is-muted"
        : awaitingCorrection
          ? isAnswer
            ? "is-correction"
            : isChosen
              ? "is-wrong"
              : "is-muted"
          : "";
    const disabled =
      state.answerStatus === "correct" || (awaitingCorrection && !isAnswer);
    const label =
      state.mode === "country-capital"
        ? countryCapital(choice)
        : state.mode === "flag-country" || state.mode === "map-country"
          ? countryName(choice)
          : t("option", { number: index + 1 });
    const baseAccessibleLabel =
      state.mode === "country-flag"
        ? answered
          ? countryName(choice)
          : t("flagOption", { number: index + 1 })
        : label;
    const accessibleLabel =
      awaitingCorrection && isAnswer
        ? t("correctContinue", { label: baseAccessibleLabel })
        : answered && isAnswer
          ? t("correctAnswer", { label: baseAccessibleLabel })
          : baseAccessibleLabel;
    return `
      <button
        class="answer-card ${stateClass}"
        data-action="answer"
        data-code="${choice.code}"
        ${disabled ? "disabled" : ""}
        aria-label="${escapeHtml(accessibleLabel)}"
        aria-keyshortcuts="${index + 1}"
      >
        ${
          state.mode === "country-flag"
            ? flagMarkup(choice, "answer-flag", answered)
            : state.mode === "map-country"
              ? `
                <span class="map-answer-content">
                  ${flagMarkup(choice, "map-answer-flag", false)}
                  <strong>${escapeHtml(label)}</strong>
                </span>
              `
              : `<strong>${escapeHtml(label)}</strong>`
        }
        <span class="keyboard-hint-index" aria-hidden="true">${index + 1}</span>
      </button>
    `;
  }

  function answerAnnouncement(question) {
    if (state.answerStatus === "correct") return t("correctAnnouncement");
    if (state.answerStatus !== "correction") return "";

    const answer =
      state.mode === "country-capital"
        ? countryCapital(question.country)
        : countryName(question.country);
    return t("wrongAnnouncement", { answer });
  }

  function quizMarkup() {
    const question = state.questions[state.questionIndex];
    const quiz = curriculumQuiz();
    const answered = state.answerStatus !== "unanswered";
    const progress = ((state.questionIndex + 1) / state.questions.length) * 100;
    const choiceCount = question.choices.length;

    const gridClass =
      state.mode === "country-flag"
        ? "flag-grid"
        : state.mode === "country-capital"
          ? "text-grid capital-grid"
          : state.mode === "map-country"
            ? "text-grid map-answer-grid"
            : "text-grid country-grid";
    const questionBody =
      state.mode === "map-country"
        ? `
          <div class="map-quiz-layout">
            ${questionMapMarkup(state.curriculumQuizId ? question.country.region : state.region, question.country.code)}
            <div class="answer-grid ${gridClass}" data-choice-count="${choiceCount}">
              ${question.choices
                .map((choice, index) =>
                  answerMarkup(choice, index, question),
                )
                .join("")}
            </div>
          </div>
        `
        : `
          <div class="answer-grid-stage">
            <div class="answer-grid ${gridClass}" data-choice-count="${choiceCount}">
              ${question.choices
                .map((choice, index) =>
                  answerMarkup(choice, index, question),
                )
                .join("")}
            </div>
          </div>
        `;

    return `
      <main class="quiz-shell quiz-active mode-${state.mode} ${keyboardHintsVisible ? "show-keyboard-hints" : ""}" data-choice-count="${choiceCount}">
        <header class="quiz-header app-header app-header-mobile-sticky">
          ${brandMarkup(true, false)}
          <div class="quiz-meta">
            ${levelReferenceMarkup(curriculumLevel(), { size: "small", className: "quiz-level-context" })}
            <strong>${state.questionIndex + 1} / ${state.questions.length}</strong>
          </div>
          ${quizReturnButtonMarkup()}
        </header>

        <div
          class="progress-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="${state.questions.length}"
          aria-valuenow="${state.questionIndex + 1}"
        >
          <span style="width: ${progress}%"></span>
        </div>

        <section class="question-area" aria-live="polite">
          <div class="question-prompt">
            ${promptMarkup(question, answered)}
          </div>
          ${questionBody}
          <p class="sr-only" aria-live="assertive">${escapeHtml(
            answerAnnouncement(question),
          )}</p>
        </section>
      </main>
    `;
  }

  function screenMarkup() {
    switch (state.screen) {
      case "setup":
        return setupMarkup();
      case "levels":
        return levelsMarkup();
      case "import":
        return importMarkup();
      case "challenge-intro":
        return challengeIntroMarkup();
      case "challenge-error":
        return invalidChallengeMarkup();
      case "result":
        return state.puzzleRewardOpen ? puzzleRewardMarkup() : curriculumResultMarkup();
      case "explore":
        return exploreMarkup();
      case "flashcards":
        return flashcardMarkup();
      default:
        return quizMarkup();
    }
  }

  function updateScrollAffordance(scroller) {
    const frame = scroller.closest("[data-scroll-affordance-frame]");
    if (!frame) return;

    const scrollBounds = scroller.getBoundingClientRect();
    const firstItemBounds =
      scroller.firstElementChild?.getBoundingClientRect();
    const lastItemBounds = scroller.lastElementChild?.getBoundingClientRect();
    frame.classList.toggle(
      "can-scroll-up",
      firstItemBounds
        ? firstItemBounds.top < scrollBounds.top - 1
        : scroller.scrollTop > 1,
    );
    frame.classList.toggle(
      "can-scroll-down",
      lastItemBounds
        ? lastItemBounds.bottom > scrollBounds.bottom + 1
        : scroller.scrollHeight -
            scroller.clientHeight -
            scroller.scrollTop >
          1,
    );
  }

  function updateScrollAffordances() {
    scrollAffordanceFrame = null;
    app
      .querySelectorAll("[data-scroll-affordance]")
      .forEach(updateScrollAffordance);
  }

  function scheduleScrollAffordanceUpdate() {
    if (scrollAffordanceFrame !== null) return;
    scrollAffordanceFrame = requestAnimationFrame(updateScrollAffordances);
  }

  function updateRecommendedNavigation() {
    recommendedNavigationFrame = null;
    if (state.screen !== "levels") return;
    const control = app.querySelector(".levels-recommended-float");
    const target = app.querySelector(".level-card.is-recommended-level");
    if (!control || !target) return;

    const headerBottom = Math.max(
      0,
      app.querySelector(".levels-header")?.getBoundingClientRect().bottom ?? 0,
    );
    const targetBounds = target.getBoundingClientRect();
    const isVisible = targetBounds.bottom > headerBottom && targetBounds.top < window.innerHeight;
    control.hidden = isVisible;
    control.style.setProperty("--levels-header-bottom", `${headerBottom}px`);
    if (isVisible) return;

    const direction = targetBounds.top >= window.innerHeight ? "down" : "up";
    control.dataset.direction = direction;
    control.querySelector(".recommended-next-arrow").textContent = direction === "down" ? "↓" : "↑";
  }

  function scheduleRecommendedNavigationUpdate() {
    if (recommendedNavigationFrame !== null) return;
    recommendedNavigationFrame = requestAnimationFrame(updateRecommendedNavigation);
  }

  function render(options = {}) {
    const exploreListScrollTop = options.preserveExploreListScroll
      ? app.querySelector(".explore-country-list")?.scrollTop ?? null
      : null;
    if (state.screen !== "result") state.puzzleRewardOpen = false;
    updateDocumentMetadata();
    clearPuzzlePointers();
    app.innerHTML = `${screenMarkup()}${actionDialogMarkup()}${puzzleCollectionMarkup()}`;
    initializePuzzleViewer();
    loadPuzzleImages();
    if (state.puzzleStageId) {
      [...app.children].filter((child) => !child.classList.contains("puzzle-overlay")).forEach((child) => { child.inert = true; child.setAttribute("aria-hidden", "true"); });
    }
    if (state.screen === "result") state.puzzleRewardPending = false;
    if (state.screen === "result") void prepareCurriculumChallengeShare();
    if (state.actionDialog) {
      [...app.children].forEach((child) => {
        if (!child.classList.contains("action-dialog-overlay")) {
          child.setAttribute("inert", "");
          child.setAttribute("aria-hidden", "true");
        }
      });
    }
    if (state.screen === "result" && !state.puzzleRewardOpen) state.resultCelebrationPending = false;
    if (exploreListScrollTop !== null) {
      const exploreList = app.querySelector(".explore-country-list");
      if (exploreList) exploreList.scrollTop = exploreListScrollTop;
    }
    document.body?.classList.toggle("standalone-mode", isStandalone());
    document.body?.classList.toggle(
      "challenge-page",
      state.screen === "challenge-intro" || state.screen === "challenge-error",
    );
    document.body?.classList.toggle("result-page", state.screen === "result");
    document.body?.classList.toggle("explore-page", state.screen === "explore");
    scheduleScrollAffordanceUpdate();
    scheduleRecommendedNavigationUpdate();
    scheduleResponsiveRegionMaps();
    if (state.screen === "explore" && !state.exploreRegionPickerOpen) {
      scheduleExploreMapZoomUi();
    }
    document.body?.classList.toggle(
      "modal-open",
      state.countryDetailsCode !== null ||
        state.installHelpOpen ||
        state.openChallengeOpen ||
        state.profilePanelOpen ||
        state.actionDialog !== null ||
        state.milestoneCelebrationStageId !== null ||
        state.worldCelebrationOpen || state.puzzleStageId !== null,
    );

    if (options.focusPuzzleDialog) app.querySelector(".puzzle-dialog")?.focus({ preventScroll: true });
    if (state.screen === "result" && state.puzzleRewardOpen) app.querySelector('[data-action="continue-puzzle-reward"]')?.focus({ preventScroll: true });
    if (options.focusPuzzleResult) app.querySelector(".result-primary-action")?.focus({ preventScroll: true });
    if (options.focusCorrect) app.querySelector(".is-correction")?.focus();
    if (options.focusCountryDetails) {
      app.querySelector(".country-details-dialog")?.focus();
    }
    if (options.focusInstallHelp) {
      app.querySelector(".install-help-close")?.focus();
    }
    if (options.focusInstallButton) {
      app.querySelector('[data-action="install-app"]')?.focus();
    }
    if (options.focusOpenChallengeInput) {
      const input = app.querySelector("#challenge-input");
      input?.focus();
      if (options.selectOpenChallengeInput) input?.select();
    }
    if (options.focusOpenChallengeButton) {
      app.querySelector('[data-action="open-challenge"]')?.focus();
    }
    if (options.focusProfilePanel) app.querySelector(".profile-panel")?.focus({ preventScroll: true });
    if (options.focusActionDialog) {
      const input = app.querySelector("#action-dialog-input");
      if (input) {
        input.focus({ preventScroll: true });
        if (state.actionDialog?.kind === "rename-profile") input.select();
      } else {
        app.querySelector("[data-dialog-cancel-focus]")?.focus({ preventScroll: true });
      }
    }
    if (options.focusActionDialogReturn) {
      const descriptor = options.focusActionDialogReturn;
      [...app.querySelectorAll("[data-action]")].find((control) =>
        Object.entries(descriptor).every(([key, value]) => control.dataset[key] === value),
      )?.focus({ preventScroll: true });
    }
    if (options.focusWorldCelebration) app.querySelector(".world-celebration-continue")?.focus({ preventScroll: true });
    if (options.focusMilestoneCelebration) app.querySelector(".milestone-celebration-continue")?.focus({ preventScroll: true });
    if (options.focusCountryDetailsTriggerCode) {
      const target = app.querySelector(
        `.explore-country-status[data-code="${options.focusCountryDetailsTriggerCode}"]`,
      );
      target?.focus();
    }
    if (options.focusReviewCode) {
      const target = app.querySelector(
        `[data-review-code="${options.focusReviewCode}"]`,
      );
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "center",
      });
    }
    if (options.focusFlashcard) {
      app.querySelector('[data-action="flashcard-toggle"]')?.focus();
    }
    if (options.focusResultFlashcards) {
      app.querySelector('[data-action="review-missed-cards"]')?.focus();
    }
    if (options.focusLevelTarget) {
      const target = options.focusLevelTarget.quizId
        ? [...app.querySelectorAll(".quiz-row")].find(
          (row) => row.dataset.quizId === options.focusLevelTarget.quizId,
        )
        : [...app.querySelectorAll(".level-heading")].find(
          (heading) => heading.dataset.levelId === options.focusLevelTarget.levelId,
        );
      target?.focus({ preventScroll: true });
      target?.closest(".level-card")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "center",
      });
    }
    if (options.focusLevelExplore) {
      const target = app.querySelector(
        `[data-action="explore-level"][data-level-id="${options.focusLevelExplore}"]`,
      );
      target?.focus({ preventScroll: true });
      target?.closest(".level-card")?.scrollIntoView({ block: "center" });
    }
    if (options.focusExploreHeading) {
      app.querySelector(".explore-context")?.focus({ preventScroll: true });
    }
    if (options.focusExploreMapArea) {
      app
        .querySelector(
          `[data-action="explore-map-area"][data-value="${options.focusExploreMapArea}"]`,
        )
        ?.focus({ preventScroll: true });
    }
    if (options.focusQuizMapArea) {
      app
        .querySelector(
          `[data-action="quiz-map-area"][data-value="${options.focusQuizMapArea}"]`,
        )
        ?.focus({ preventScroll: true });
    }
    if (options.focusExploreRegionControl) {
      app
        .querySelector('[data-action="open-explore-region-picker"]')
        ?.focus({ preventScroll: true });
    }
    if (options.focusExploreFlashcards) {
      app
        .querySelector('[data-action="explore-cards"]')
        ?.focus({ preventScroll: true });
    }
    if (options.focusLanguage) {
      app
        .querySelector(
          `[data-action="language"][data-value="${options.focusLanguage}"]`,
        )
        ?.focus({ preventScroll: true });
    }
    if (Number.isFinite(options.restoreWindowScrollY)) {
      window.scrollTo({ top: options.restoreWindowScrollY, behavior: "auto" });
    }
  }

  function renderAtTop(options = {}) {
    render(options);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showRecommendedLevels(
    fallbackLevelId = state.activeLevelId,
    { historyMode = "push" } = {},
  ) {
    const next = progress.continueSelection(
      currentProfile(),
      curriculum.levels,
    );
    const quiz = next.type === "quiz" ? next.quiz : null;
    const levelId = quiz?.levelId ?? fallbackLevelId ?? null;
    state.selectedLevelId = levelId;
    state.screen = "levels";
    if (historyMode !== "none") syncUrlState({ push: historyMode === "push" });
    if (!levelId) {
      renderAtTop();
      return;
    }
    render({
      focusLevelTarget: quiz ? { quizId: quiz.id } : { levelId },
    });
  }

  function showLevelsRoute(levelId, { historyMode = "none" } = {}) {
    state.selectedLevelId = levelId ?? null;
    state.screen = "levels";
    state.exploreScope = null;
    state.exploreReturn = null;
    if (historyMode !== "none") syncUrlState({ push: historyMode === "push" });
    renderAtTop();
  }

  function applyRoute(route, { historyMode = "none" } = {}) {
    if (!route || route.screen === "setup") {
      returnToSetup({ historyMode });
      return;
    }
    if (route.screen === "levels") {
      showLevelsRoute(route.levelId, { historyMode });
      return;
    }
    if (route.screen === "explore") {
      state.region = route.region;
      if (route.levelId) {
        const level = curriculum.levelById.get(route.levelId);
        state.activeLevelId = level.id;
        showContextualExplore(
          contextualExploreScope(level.title, level.countryCodes, level.id),
          { screen: "levels", levelId: level.id },
          null,
          { historyMode },
        );
      } else {
        showExplore({ historyMode });
      }
      return;
    }
    if (route.screen === "quiz") {
      state.challengeActive = false;
      const saved = currentProfile().savedMasteryAttempt;
      const quiz = curriculum.quizById.get(route.quizId);
      startCurriculumQuiz(route.quizId, {
        resume: saved?.quizId === route.quizId && saved.revision === quiz.revision,
        source: route.source,
        historyMode,
      });
      return;
    }
    if (route.screen === "flashcards" && route.source === "level") {
      const level = curriculum.levelById.get(route.levelId);
      state.activeLevelId = level.id;
      startFlashcards(
        level.countryCodes.map((code) => countriesByCode.get(code)),
        "level",
        { historyMode },
      );
      return;
    }
    if (route.screen === "flashcards" && route.source === "explore") {
      state.region = route.region;
      if (route.levelId) {
        const level = curriculum.levelById.get(route.levelId);
        state.activeLevelId = level.id;
        showContextualExplore(
          contextualExploreScope(level.title, level.countryCodes, level.id),
          { screen: "levels", levelId: level.id },
          null,
          { historyMode: "none" },
        );
      } else {
        showExplore({ historyMode: "none" });
      }
      startFlashcards(shuffle(countriesInExploreMapScope()), "explore", { historyMode });
    }
  }

  function clearAutoAdvance() {
    if (autoAdvanceTimer !== null) {
      window.clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
  }

  function clearWorldCelebrationTimer() {
    if (worldCelebrationTimer === null) return;
    window.clearTimeout(worldCelebrationTimer);
    worldCelebrationTimer = null;
  }

  function clearMilestoneCelebrationTimer() {
    if (milestoneCelebrationTimer === null) return;
    window.clearTimeout(milestoneCelebrationTimer);
    milestoneCelebrationTimer = null;
  }

  function openMilestoneCelebration(stageId, origin) {
    const stage = curriculum.stages.find((candidate) => candidate.id === stageId);
    if (!stage) return;
    clearMilestoneCelebrationTimer();
    state.milestoneCelebrationStageId = stage.id;
    state.milestoneCelebrationOrigin = origin;
    state.milestoneCelebrationReturnScrollY = origin === "levels-replay" ? window.scrollY : null;
    state.milestoneCelebrationSettled = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    render({ focusMilestoneCelebration: true });
    if (state.milestoneCelebrationSettled) return;
    milestoneCelebrationTimer = window.setTimeout(() => {
      milestoneCelebrationTimer = null;
      state.milestoneCelebrationSettled = true;
      app.querySelector(".milestone-celebration-overlay")?.classList.add("is-settled");
    }, 6000);
  }

  function dismissMilestoneCelebration({ returnHome = false } = {}) {
    clearMilestoneCelebrationTimer();
    const stageId = state.milestoneCelebrationStageId;
    const origin = state.milestoneCelebrationOrigin;
    const returnScrollY = state.milestoneCelebrationReturnScrollY;
    state.milestoneCelebrationStageId = null;
    state.milestoneCelebrationOrigin = null;
    state.milestoneCelebrationReturnScrollY = null;
    state.milestoneCelebrationSettled = false;
    if (returnHome) returnToSetup({ historyMode: "replace" });
    else render({
      focusActionDialogReturn: origin?.endsWith("-replay")
        ? { action: "replay-milestone", stageId }
        : { action: "open-milestone-celebration" },
      restoreWindowScrollY: returnScrollY,
    });
  }

  function openWorldCelebration(origin = state.screen === "setup" ? "home-replay" : "newly-earned") {
    clearMilestoneCelebrationTimer();
    state.milestoneCelebrationStageId = null;
    state.milestoneCelebrationOrigin = null;
    state.milestoneCelebrationReturnScrollY = null;
    state.milestoneCelebrationSettled = false;
    clearWorldCelebrationTimer();
    state.worldCelebrationOpen = true;
    state.worldCelebrationOrigin = origin;
    state.worldCelebrationSettled = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    render({ focusWorldCelebration: true });
    if (state.worldCelebrationSettled) return;
    worldCelebrationTimer = window.setTimeout(() => {
      worldCelebrationTimer = null;
      state.worldCelebrationSettled = true;
      app.querySelector(".world-celebration-overlay")?.classList.add("is-settled");
    }, 6000);
  }

  function closeWorldCelebration() {
    clearWorldCelebrationTimer();
    const origin = state.worldCelebrationOrigin;
    state.worldCelebrationOpen = false;
    state.worldCelebrationOrigin = null;
    state.worldCelebrationSettled = false;
    if (origin === "home-replay") {
      render({ focusActionDialogReturn: { action: "replay-world-celebration" } });
    } else {
      returnToSetup({ historyMode: "replace" });
    }
  }

  function setKeyboardHintsVisible(visible) {
    keyboardHintsVisible =
      visible && state.screen === "quiz" && state.answerStatus === "unanswered";
    app
      .querySelector(".quiz-active")
      ?.classList.toggle("show-keyboard-hints", keyboardHintsVisible);
  }

  function setRegionPreview(regionId) {
    if (
      state.screen !== "setup" &&
      !(state.screen === "explore" && state.exploreRegionPickerOpen)
    ) {
      return;
    }

    app.querySelectorAll("[data-map-region]").forEach((control) => {
      control.classList.toggle(
        "is-preview",
        regionId !== null && control.dataset.mapRegion === regionId,
      );
    });

    app.querySelectorAll(".map-country, .map-marker").forEach((shape) => {
      const region = shape.dataset.region || null;
      const matches =
        regionId !== null && regionMatches(region, regionId);
      shape.classList.toggle("is-preview", matches);
    });
  }

  function resetExploreMapInteraction() {
    state.exploreMapViewport = null;
    exploreMapPointers.clear();
    exploreMapGesture = null;
    exploreMapDrag = null;
  }

  function resetExploreCountryState() {
    state.explorePinnedCode = null;
    state.explorePreviewCode = null;
    state.silhouetteExpanded = false;
    resetExploreMapInteraction();
  }

  function syncExploreCountryUi() {
    if (state.screen !== "explore" || state.exploreRegionPickerOpen) return;

    app.querySelectorAll("[data-explore-code]").forEach((control) => {
      const code = control.dataset.exploreCode;
      control.classList.toggle(
        "is-pinned",
        code === state.explorePinnedCode,
      );
      control.classList.toggle(
        "is-preview",
        code === state.explorePreviewCode,
      );
      if (!control.hasAttribute("aria-hidden")) {
        control.setAttribute(
          "aria-pressed",
          String(code === state.explorePinnedCode),
        );
      }
    });

    const status = app.querySelector(".explore-country-status-wrap");
    if (status) {
      status.innerHTML = exploreCountryStatusMarkup(
        state.explorePinnedCode,
      );
    }

    const overlay = app.querySelector(".explore-silhouette-overlay");
    if (overlay) {
      overlay.innerHTML = exploreSilhouetteOverlayMarkup();
    }

    const areaControls = app.querySelector(".explore-map-scope-controls");
    if (areaControls) {
      areaControls.innerHTML = exploreMapAreaControlsContentMarkup();
    }
  }

  function setExplorePreview(code) {
    if (
      state.screen !== "explore" ||
      state.exploreRegionPickerOpen
    ) {
      return;
    }

    const previewCode = code === state.explorePinnedCode ? null : code;
    if (state.explorePreviewCode === previewCode) return;
    state.explorePreviewCode = previewCode;
    if (!state.explorePinnedCode) state.silhouetteExpanded = false;
    syncExploreCountryUi();
  }

  function clearExploreCountrySelection() {
    if (state.explorePinnedCode === null) return;
    state.explorePinnedCode = null;
    state.explorePreviewCode = null;
    state.silhouetteExpanded = false;
    syncExploreCountryUi();
  }

  function pinExploreCountry(code, { scrollCard = false } = {}) {
    if (!countriesByCode.has(code)) return;
    if (state.explorePinnedCode === code) {
      clearExploreCountrySelection();
      return;
    }

    const changed = state.explorePinnedCode !== code;
    state.explorePinnedCode = code;
    state.explorePreviewCode = null;
    if (changed) state.silhouetteExpanded = false;
    const regionId = mapRegionForCode(code);
    const extent = state.exploreMapExtent;
    const nextExtent = exploreState.extentForSelection(
      extent,
      regionId,
    );
    if (nextExtent !== extent) {
      state.exploreMapExtent = nextExtent;
      resetExploreMapInteraction();
      render({
        focusCountryDetailsTriggerCode: code,
        preserveExploreListScroll: !scrollCard,
      });
      if (scrollCard) {
        const card = app.querySelector(
          `.explore-country-card[data-explore-code="${code}"]`,
        );
        card?.scrollIntoView({ block: "nearest" });
        scheduleScrollAffordanceUpdate();
      }
      return;
    }
    syncExploreCountryUi();

    if (scrollCard) {
      const card = app.querySelector(
        `.explore-country-card[data-explore-code="${code}"]`,
      );
      card?.scrollIntoView({ block: "nearest" });
      scheduleScrollAffordanceUpdate();
    }
  }

  function updateRegion(regionId) {
    if (!regionsById.has(regionId)) return false;
    if (state.region !== regionId) {
      resetExploreMapInteraction();
    }
    state.region = regionId;
    syncUrlState();
    return true;
  }

  function setLocale(locale) {
    if (!supportedLocales.includes(locale) || locale === state.locale) return;
    const scrollTop = window.scrollY;
    state.locale = locale;
    syncUrlState();
    render({ focusLanguage: locale });
    window.scrollTo({ top: scrollTop });
  }

  function setSilhouetteExpanded(expanded) {
    state.silhouetteExpanded = expanded;
    const control = app.querySelector('[data-action="toggle-silhouette"]');
    if (!control) return;

    app
      .querySelector(".explore-region-map")
      ?.classList.toggle("has-expanded-silhouette", expanded);
    app
      .querySelector(".map-quiz-visual")
      ?.classList.toggle("has-expanded-silhouette", expanded);
    control.classList.toggle("is-expanded", expanded);
    control.setAttribute("aria-expanded", String(expanded));
    control.setAttribute(
      "aria-label",
      expanded ? t("shrinkShape") : t("enlargeShape"),
    );
    control
      .querySelectorAll(".country-silhouette-marker")
      .forEach((marker) => {
        const radius = expanded
          ? marker.dataset.expandedRadius
          : marker.dataset.baseRadius;
        marker.setAttribute("r", radius);
        marker.style.setProperty(
          "--silhouette-marker-radius",
          `${radius}px`,
        );
      });
  }

  function setQuizMapArea(area, { focus = true } = {}) {
    if (
      state.screen !== "quiz" ||
      state.mode !== "map-country" ||
      !["world", "region", "nearby"].includes(area)
    ) return false;
    state.quizMapArea = area;
    state.silhouetteExpanded = false;
    render(focus ? { focusQuizMapArea: area } : {});
    return true;
  }

  function advanceQuestion() {
    clearAutoAdvance();
    setKeyboardHintsVisible(false);
    app.querySelector(".answer-card:focus")?.blur();
    state.quizMapArea = "region";
    state.silhouetteExpanded = false;
    if (state.questionIndex === state.questions.length - 1) {
      finishCurriculumAttempt();
      state.screen = "result";
      syncUrlState();
    } else {
      state.questionIndex += 1;
      state.selectedCode = null;
      state.answerStatus = "unanswered";
      saveActiveMasteryAttempt();
    }
    renderAtTop();
  }

  function freshAttemptSeed() {
    const bytes = new Uint32Array(3);
    if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
    else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 0xffffffff); });
    return Array.from(bytes, (value) => value.toString(36)).join("-");
  }

  function isMasteryQuiz(quiz = curriculumQuiz()) {
    return quiz?.kind === "regional-mastery" || quiz?.kind === "world-mastery";
  }

  function saveActiveMasteryAttempt() {
    const quiz = curriculumQuiz();
    if (!quiz || !isMasteryQuiz(quiz) || state.screen !== "quiz") return;
    const existing = currentProfile().savedMasteryAttempt;
    const timestamp = new Date().toISOString();
    persist(progress.saveMasteryAttempt(progressStore, progressStore.activeProfileId, {
      quizId: quiz.id, revision: quiz.revision, attemptSeed: state.attemptSeed,
      questionIndex: state.attemptAnswers.length, score: state.score,
      answers: state.attemptAnswers, correctionPending: state.answerStatus === "correction" ? state.questions[state.questionIndex].country.code : null,
      startedAt: existing?.quizId === quiz.id ? existing.startedAt : timestamp, updatedAt: timestamp,
    }));
  }

  function finishCurriculumAttempt() {
    const quiz = curriculumQuiz();
    if (!quiz || state.resultRecorded) return;
    const level = curriculumLevel();
    const previousRecord = progress.currentRecord(currentProfile(), quiz);
    const previousQuizState = progress.quizState(currentProfile(), quiz);
    const before = progress.levelProgress(currentProfile(), level).mastered;
    const stage = stageForLevelIndex(quiz.levelIndex);
    const stageWasMastered = stage ? progress.stageProgress(currentProfile(), stage, curriculum.levels).isMastered : false;
    state.resultPreviousBestScore = previousRecord?.bestScore ?? null;
    progressStore = progress.recordResult(progressStore, progressStore.activeProfileId, quiz, state.score);
    if (isMasteryQuiz(quiz)) progressStore = progress.abandonMasteryAttempt(progressStore, progressStore.activeProfileId);
    persist(progressStore);
    state.resultBestScore = progress.currentRecord(currentProfile(), quiz)?.bestScore ?? state.score;
    state.resultNewQuizMastery = previousQuizState !== "mastered" && state.score === quiz.countryCodes.length;
    state.puzzleRewardPending = state.resultNewQuizMastery;
    state.puzzleRewardOpen = state.resultNewQuizMastery;
    state.resultNewLevelMastery = before < 4 && progress.levelProgress(currentProfile(), level).mastered === 4;
    state.resultNewStageMastery = Boolean(stage && !stageWasMastered && progress.stageProgress(currentProfile(), stage, curriculum.levels).isMastered);
    state.resultCelebrationPending = state.resultNewQuizMastery || state.resultNewLevelMastery || state.resultNewStageMastery;
    state.resultRecorded = true;
  }

  function startCurriculumQuiz(
    quizId,
    {
      resume = false,
      challengeRound = false,
      source = null,
      historyMode = "push",
      savedAttemptHandled = false,
    } = {},
  ) {
    const quiz = curriculum.quizById.get(quizId);
    if (!quiz) return;
    const quizSource = source ?? (
      state.screen === "levels"
        ? "levels"
        : state.screen === "quiz" || state.screen === "result"
          ? state.quizReturn
          : "home"
    );
    const saved = currentProfile().savedMasteryAttempt;
    const matchingAttempt = progress.matchingSavedAttempt(currentProfile(), quiz);
    const shouldResume = Boolean(matchingAttempt && (resume || !challengeRound));
    if (!shouldResume && saved && !savedAttemptHandled) {
      openActionDialog("abandon-attempt", {
        quizId,
        startOptions: { challengeRound, source, historyMode },
      });
      return;
    }
    clearAutoAdvance(); setKeyboardHintsVisible(false);
    const level = curriculum.levelById.get(quiz.levelId);
    const savedAttempt = shouldResume ? matchingAttempt : null;
    state.curriculumQuizId = quiz.id; state.activeLevelId = level.id; state.mode = quiz.mode;
    state.quizMapArea = "region";
    state.quizReturn = quizSource === "levels" ? "levels" : "home";
    state.challengeActive = challengeRound || state.challengeActive;
    state.attemptSeed = savedAttempt?.attemptSeed ?? freshAttemptSeed();
    const recipe = curriculum.createAttempt(quiz, state.attemptSeed);
    state.questions = recipe.map((question) => ({ country: countriesByCode.get(question.countryCode), choices: question.choiceCodes.map((code) => countriesByCode.get(code)) }));
    state.attemptAnswers = savedAttempt?.answers ? [...savedAttempt.answers] : [];
    state.score = savedAttempt?.score ?? 0;
    state.wrongAnswers = state.attemptAnswers.filter((answer) => !answer.correct).map((answer) => countriesByCode.get(answer.targetCode)).filter(Boolean);
    if (savedAttempt?.correctionPending) {
      state.questionIndex = Math.max(0, savedAttempt.questionIndex - 1);
      state.selectedCode = savedAttempt.answers.at(-1)?.selectedCode ?? null;
      state.answerStatus = "correction";
    } else {
      state.questionIndex = Math.min(savedAttempt?.questionIndex ?? 0, state.questions.length - 1);
      state.selectedCode = null; state.answerStatus = "unanswered";
    }
    const regions = new Set(quiz.countryCodes.map((code) => countriesByCode.get(code)?.region));
    state.region = quiz.region ?? (regions.size === 1 ? [...regions][0] : "world");
    state.silhouetteExpanded = false; state.resultRecorded = false; state.resultBestScore = null;
    state.resultPreviousBestScore = null; state.resultNewQuizMastery = false; state.resultNewLevelMastery = false; state.resultNewStageMastery = false;
    state.resultCelebrationPending = false; state.puzzleRewardPending = false; state.puzzleRewardOpen = false; state.resultPreview = null;
    state.screen = "quiz";
    if (savedAttempt && savedAttempt.questionIndex >= state.questions.length && !savedAttempt.correctionPending) {
      state.questionIndex = state.questions.length - 1; state.resultRecorded = false; finishCurriculumAttempt(); state.screen = "result";
    }
    if (historyMode !== "none") syncUrlState({ push: historyMode === "push" });
    renderAtTop({ focusCorrect: state.answerStatus === "correction" });
  }

  function showExplore({ historyMode = "push" } = {}) {
    clearAutoAdvance();
    setKeyboardHintsVisible(false);
    state.screen = "explore";
    state.questions = [];
    state.selectedCode = null;
    state.answerStatus = "unanswered";
    state.silhouetteExpanded = false;
    state.wrongAnswers = [];
    state.countryDetailsCode = null;
    state.exploreScope = null;
    state.exploreReturn = null;
    state.exploreMapExtent = state.region;
    state.exploreRegionPickerOpen = false;
    resetExploreCountryState();
    if (historyMode !== "none") syncUrlState({ push: historyMode === "push" });
    renderAtTop();
  }

  function contextualExploreScope(title, countryCodes, levelId = null) {
    return {
      kind: "contextual",
      title,
      levelId,
      countryCodes: exploreState.uniqueCodes(countryCodes).filter((code) =>
        countriesByCode.has(code),
      ),
    };
  }

  function localizedExploreTitle(key) {
    return {
      nb: localization.translate("nb", key),
      en: localization.translate("en", key),
    };
  }

  function showContextualExplore(
    scope,
    returnTarget,
    pinnedCode = null,
    { historyMode = "push" } = {},
  ) {
    if (!scope.countryCodes.length) return;
    clearAutoAdvance();
    setKeyboardHintsVisible(false);
    state.screen = "explore";
    state.selectedCode = null;
    state.answerStatus = "unanswered";
    state.countryDetailsCode = null;
    state.exploreScope = scope;
    state.exploreReturn = returnTarget;
    state.exploreMapExtent = initialExploreMapExtent(scope.countryCodes);
    resetExploreCountryState();
    state.explorePinnedCode = scope.countryCodes.includes(pinnedCode)
      ? pinnedCode
      : null;
    state.exploreRegionPickerOpen = false;
    if (historyMode !== "none") syncUrlState({ push: historyMode === "push" });
    renderAtTop(
      state.explorePinnedCode
        ? { focusCountryDetailsTriggerCode: state.explorePinnedCode }
        : {},
    );
  }

  function showResultCountryInExplore(code) {
    const missedCodes = exploreState.uniqueCodes(
      state.wrongAnswers.map((country) => country.code),
    );
    showContextualExplore(
      contextualExploreScope(localizedExploreTitle("missedCountries"), missedCodes),
      { screen: "result", reviewCode: code },
      code,
    );
  }

  function returnFromExplore() {
    const returnTarget = state.exploreReturn;
    if (returnTarget?.screen === "result") {
      returnToRoute(quizRoute());
      return;
    }
    if (returnTarget?.screen === "levels") {
      returnToRoute({ screen: "levels", levelId: returnTarget.levelId });
      return;
    }
    returnToRoute({ screen: "setup" });
  }

  function closeCountryDetails() {
    const code = state.countryDetailsCode;
    state.countryDetailsCode = null;
    render({
      focusCountryDetailsTriggerCode: code,
      preserveExploreListScroll: true,
    });
  }

  function closeInstallHelp() {
    if (!state.installHelpOpen) return;
    state.installHelpOpen = false;
    render({ focusInstallButton: true });
  }

  function openChallengeDialog() {
    state.openChallengeOpen = true;
    state.openChallengeValue = "";
    state.openChallengeError = null;
    state.profilePanelOpen = false;
    render({ focusOpenChallengeInput: true });
  }

  function closeOpenChallenge() {
    if (!state.openChallengeOpen) return;
    state.openChallengeOpen = false;
    state.openChallengeValue = "";
    state.openChallengeError = null;
    render({ focusOpenChallengeButton: true });
  }

  function focusedActionDescriptor() {
    const control = document.activeElement?.closest?.("[data-action]");
    if (!control || !app.contains(control)) return null;
    return Object.fromEntries(
      Object.entries(control.dataset).filter(([key]) =>
        ["action", "quizId", "nextQuizId", "profileId", "levelId", "stageId"].includes(key),
      ),
    );
  }

  function openActionDialog(kind, payload = {}) {
    state.actionDialog = {
      kind,
      profileId: progressStore.activeProfileId,
      returnFocus: focusedActionDescriptor(),
      ...payload,
    };
    render({ focusActionDialog: true });
  }

  function closeActionDialog() {
    if (!state.actionDialog) return;
    const returnFocus = state.actionDialog.returnFocus;
    state.actionDialog = null;
    render({ focusActionDialogReturn: returnFocus });
  }

  function confirmActionDialog(form) {
    const dialog = state.actionDialog;
    if (!dialog) return;
    state.actionDialog = null;
    if (dialog.kind === "abandon-attempt") {
      persist(progress.abandonMasteryAttempt(progressStore, dialog.profileId));
      startCurriculumQuiz(dialog.quizId, { ...dialog.startOptions, savedAttemptHandled: true });
      return;
    }
    if (dialog.kind === "add-profile") {
      persist(progress.addProfile(progressStore, form.elements.namedItem("profile-name")?.value ?? ""));
      state.profilePanelOpen = false;
      renderAtTop();
      return;
    }
    if (dialog.kind === "rename-profile") {
      persist(progress.renameProfile(
        progressStore,
        dialog.profileId,
        form.elements.namedItem("profile-name")?.value ?? "",
      ));
      render({ focusProfilePanel: true });
      return;
    }
    if (dialog.kind === "clear-profile") {
      persist(progress.clearProgress(progressStore, dialog.profileId));
      state.profilePanelOpen = false;
      renderAtTop();
      return;
    }
    if (dialog.kind === "delete-profile") {
      persist(progress.deleteProfile(progressStore, dialog.profileId));
      state.profilePanelOpen = false;
      renderAtTop();
    }
  }

  function openSharedLinkInput(value) {
    const trimmedValue = value.trim();
    state.openChallengeValue = trimmedValue;
    const parsed = sharedLink.classify(trimmedValue, window.location.href, {
      canonicalUrl: sharing.PUBLIC_APP_URL,
      quizById: curriculum.quizById,
      readChallenge: challenge.readUrl,
      decodeTransfer: progress.decodeTransfer,
    });
    if (parsed.error) {
      state.openChallengeError = parsed.error;
      render({
        focusOpenChallengeInput: true,
        selectOpenChallengeInput: parsed.error !== "sharedLinkRequired",
      });
      return;
    }

    if (parsed.kind === "challenge") {
      window.location.assign(challenge.createUrl(window.location.href, {
        quizId: parsed.recipe.quizId,
        revision: parsed.recipe.revision,
        score: parsed.recipe.scoreParam,
        proof: parsed.recipe.proof,
      }, parsed.locale));
      return;
    }

    if (parsed.kind === "transfer") {
      const url = navigation.createUrl(
        window.location.href,
        { screen: "setup" },
        parsed.locale,
      );
      url.hash = `progress=${parsed.payload}`;
      window.location.assign(url);
      return;
    }

    window.location.assign(navigation.createUrl(
      window.location.href,
      { screen: "setup" },
      parsed.locale,
    ));
  }

  async function copyText(value) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    if (!copied) throw new Error("Copy failed");
  }

  function clearActionFeedback(control) {
    if (!control?.isConnected) return;
    const timer = actionFeedbackTimers.get(control);
    if (timer) window.clearTimeout(timer);
    actionFeedbackTimers.delete(control);
    control.classList.remove("is-copied");
    control.disabled = false;
    control.removeAttribute("aria-busy");
    const announcement = control.querySelector(".action-feedback-announcement");
    if (announcement) announcement.textContent = "";
  }

  function beginActionFeedback(control) {
    clearActionFeedback(control);
    if (!control?.isConnected) return;
    control.disabled = true;
    control.setAttribute("aria-busy", "true");
  }

  function showCopiedFeedback(control, messageKey) {
    if (!control?.isConnected) return;
    control.disabled = false;
    control.removeAttribute("aria-busy");
    control.classList.add("is-copied");
    const announcement = control.querySelector(".action-feedback-announcement");
    if (announcement) announcement.textContent = t(messageKey);
    const timer = window.setTimeout(() => clearActionFeedback(control), 2400);
    actionFeedbackTimers.set(control, timer);
  }

  function showActionFeedbackError(control, messageKey) {
    clearActionFeedback(control);
    document.querySelector(".action-feedback-toast")?.remove();
    if (actionFeedbackToastTimer) window.clearTimeout(actionFeedbackToastTimer);
    const toast = document.createElement("div");
    toast.className = "action-feedback-toast";
    toast.setAttribute("role", "alert");
    toast.textContent = t(messageKey);
    document.body.append(toast);
    actionFeedbackToastTimer = window.setTimeout(() => {
      toast.remove();
      actionFeedbackToastTimer = null;
    }, 4200);
  }

  async function copyWithFeedback(control, value, copiedKey, failedKey) {
    beginActionFeedback(control);
    try {
      await copyText(value);
      showCopiedFeedback(control, copiedKey);
    } catch {
      showActionFeedbackError(control, failedKey);
    }
  }

  function openEmail(subject, body) {
    const anchor = document.createElement("a");
    anchor.href = sharing.createEmailUrl(subject, body);
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  }

  async function shareWithEmailFallback(control, payload, failedKey, dialogTitle) {
    if (!navigator.share || state.previewMode === "share-fallback") {
      openActionDialog("share-fallback", {
        sharePayload: payload,
        failedKey,
        title: dialogTitle,
      });
      return;
    }
    beginActionFeedback(control);
    try {
      await navigator.share(payload.native);
      clearActionFeedback(control);
    } catch (error) {
      if (error?.name === "AbortError") {
        clearActionFeedback(control);
        return;
      }
      showActionFeedbackError(control, failedKey);
    }
  }

  async function copyTransferLink(control) {
    const url = new URL(sharing.PUBLIC_APP_URL);
    url.search = state.locale === "en" ? "?lang=en" : "";
    url.hash = `progress=${progress.encodeTransfer(currentProfile())}`;
    await copyWithFeedback(control, url.href, "transferCopied", "transferFailed");
  }

  async function shareProgress(control) {
    const url = navigation.createUrl(sharing.PUBLIC_APP_URL, { screen: "setup" }, state.locale);
    const stage = curriculum.stages.find((candidate) => candidate.id === control.dataset.stageId);
    const isWorldMaster = control.dataset.shareKind === "world";
    if (!stage && !isWorldMaster) return;
    const name = sharing.personalizedName(currentProfile().name);
    const values = isWorldMaster
      ? { name, levels: curriculum.levels.length, quizzes: curriculum.levels.length * 4 }
      : { name, stage: stageTitle(stage), start: stage.startLevel, end: stage.endLevel };
    const subject = t(
      isWorldMaster
        ? name ? "worldShareSubjectNamed" : "worldShareSubject"
        : name ? "milestoneShareSubjectNamed" : "milestoneShareSubject",
      values,
    );
    const text = t(
      isWorldMaster
        ? name ? "worldShareTextNamed" : "worldShareText"
        : name ? "milestoneShareTextNamed" : "milestoneShareText",
      values,
    );
    await shareWithEmailFallback(
      control,
      sharing.createSharePayload({
        title: subject,
        text,
        url: url.href,
        emailCallToAction: t("progressEmailCallToAction"),
      }),
      "shareUnavailable",
      t("shareProgress"),
    );
  }

  function curriculumChallengeShareContext() {
    if (state.screen !== "result") return null;
    const quiz = curriculumQuiz();
    const level = curriculumLevel();
    if (!quiz || !level) return null;
    const name = sharing.personalizedName(currentProfile().name);
    return {
      key: JSON.stringify([
        window.location.origin,
        window.location.pathname,
        state.locale,
        currentProfile().id,
        currentProfile().name,
        quiz.id,
        quiz.revision,
        state.score,
      ]),
      quiz,
      level,
      name,
      score: state.score,
    };
  }

  function isCurriculumChallengeShareReady() {
    const context = curriculumChallengeShareContext();
    return Boolean(context && preparedChallengeShare?.key === context.key);
  }

  async function createCurriculumChallengeShare(context) {
    const recipe = {
      quizId: context.quiz.id,
      revision: context.quiz.revision,
      score: context.score,
    };
    const proof = await challenge.createScoreProof(recipe);
    const url = challenge.createUrl(
      sharing.PUBLIC_APP_URL,
      { ...recipe, proof },
      state.locale,
    );
    const values = {
      name: context.name,
      score: context.score,
      total: context.quiz.countryCodes.length,
      level: context.quiz.levelIndex + 1,
      levelTitle: levelTitle(context.level),
      mode: modeLabel(context.quiz.mode),
      minutes: Math.max(2, Math.ceil(context.quiz.countryCodes.length / 4)),
    };
    return sharing.createSharePayload({
      title: t(context.name ? "challengeShareSubjectNamed" : "challengeShareSubject", values),
      text: t(context.name ? "challengeShareTextNamed" : "challengeShareText", values),
      url: url.href,
      emailCallToAction: t("challengeEmailCallToAction"),
    });
  }

  function updateCurriculumChallengeShareControl() {
    const control = app.querySelector('[data-action="share-curriculum-challenge"]');
    if (!control) return;
    const pending = preparingChallengeShare?.key === curriculumChallengeShareContext()?.key;
    control.disabled = pending;
    if (pending) control.setAttribute("aria-busy", "true");
    else control.removeAttribute("aria-busy");
  }

  async function prepareCurriculumChallengeShare() {
    const context = curriculumChallengeShareContext();
    if (!context || preparedChallengeShare?.key === context.key) {
      updateCurriculumChallengeShareControl();
      return;
    }
    if (preparingChallengeShare?.key === context.key) return;
    const pending = createCurriculumChallengeShare(context);
    preparingChallengeShare = { key: context.key, pending };
    updateCurriculumChallengeShareControl();
    try {
      const payload = await pending;
      if (curriculumChallengeShareContext()?.key === context.key) {
        preparedChallengeShare = { key: context.key, payload };
      }
    } catch {
      if (preparedChallengeShare?.key === context.key) preparedChallengeShare = null;
    } finally {
      if (preparingChallengeShare?.key === context.key) preparingChallengeShare = null;
      updateCurriculumChallengeShareControl();
    }
  }

  function shareCurriculumChallenge(control) {
    const context = curriculumChallengeShareContext();
    if (!context || preparedChallengeShare?.key !== context.key) {
      showActionFeedbackError(control, "challengeShareFailed");
      void prepareCurriculumChallengeShare();
      return;
    }
    void shareWithEmailFallback(
      control,
      preparedChallengeShare.payload,
      "challengeShareFailed",
      t("challengeThisQuiz"),
    );
  }

  function downloadBackup() {
    const blob = new Blob([progress.createBackup(progressStore)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `hello-world-backup-${new Date().toISOString().slice(0, 10)}.json`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function finishImport(nextStore) {
    persist(nextStore);
    state.importProfiles = null;
    state.importError = false;
    state.importSource = null;
    clearTransferFragment();
    returnToSetup({ historyMode: "replace" });
  }

  function importSingleProfile(imported) {
    const nextStore = progressStore.profiles[imported.id]
      ? progress.mergeInto(progressStore, imported.id, imported)
      : progress.importAsNew(progressStore, imported);
    finishImport(nextStore);
  }

  function createImportedProfile(imported) {
    finishImport(progress.importAsNew(progressStore, imported));
  }

  function importAllProfiles() {
    let nextStore = progressStore;
    for (const imported of state.importProfiles ?? []) {
      nextStore = nextStore.profiles[imported.id]
        ? progress.mergeInto(nextStore, imported.id, imported)
        : progress.importAsNew(nextStore, imported);
    }
    finishImport(nextStore);
  }

  function startFlashcards(
    flashcards,
    returnTarget,
    { historyMode = "push" } = {},
  ) {
    state.flashcards = flashcards;
    state.flashcardIndex = 0;
    state.flashcardRevealed = false;
    state.flashcardReturn = returnTarget;
    state.countryDetailsCode = null;
    state.screen = "flashcards";
    if (historyMode !== "none") syncUrlState({ push: historyMode === "push" });
    renderAtTop({ focusFlashcard: true });
  }

  async function requestInstall() {
    if (isIosDevice()) {
      state.installHelpOpen = true;
      render({ focusInstallHelp: true });
      return;
    }

    const installPrompt = deferredInstallPrompt;
    if (!installPrompt) return;

    deferredInstallPrompt = null;
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } catch {
      // The browser owns the prompt and may withdraw it while it is opening.
    } finally {
      if (state.screen === "setup") render();
    }
  }

  function returnToSetup({ historyMode = "push" } = {}) {
    clearAutoAdvance();
    clearWorldCelebrationTimer();
    clearMilestoneCelebrationTimer();
    if (state.previewMode !== null) {
      progressStore = realProgressStore;
      state.previewMode = null;
    }
    setKeyboardHintsVisible(false);
    state.screen = "setup";
    state.questions = [];
    state.selectedCode = null;
    state.answerStatus = "unanswered";
    state.silhouetteExpanded = false;
    state.wrongAnswers = [];
    state.flashcards = [];
    state.flashcardIndex = 0;
    state.flashcardRevealed = false;
    state.exploreRegionPickerOpen = false;
    state.exploreScope = null;
    state.exploreReturn = null;
    state.exploreMapExtent = null;
    state.countryDetailsCode = null;
    state.installHelpOpen = false;
    state.openChallengeOpen = false;
    state.openChallengeValue = "";
    state.openChallengeError = null;
    state.profilePanelOpen = false;
    state.actionDialog = null;
    state.worldCelebrationOpen = false;
    state.worldCelebrationOrigin = null;
    state.worldCelebrationSettled = false;
    state.milestoneCelebrationStageId = null;
    state.milestoneCelebrationOrigin = null;
    state.milestoneCelebrationReturnScrollY = null;
    state.milestoneCelebrationSettled = false;
    state.challengeActive = false;
    state.curriculumQuizId = null;
    state.activeLevelId = null;
    state.attemptSeed = null;
    state.attemptAnswers = [];
    state.challengeTargetScore = null;
    state.challengeScoreVerified = false;
    state.challengeScoreWarning = false;
    state.challengeScoreParam = null;
    state.challengeProof = null;
    state.resultPreview = null;
    resetExploreCountryState();
    if (historyMode !== "none") syncUrlState({ push: historyMode === "push" });
    renderAtTop();
  }

  function selectAnswer(code) {
    const question = state.questions[state.questionIndex];
    if (state.screen !== "quiz" || !question) return;

    if (state.answerStatus === "correction") {
      if (code === question.country.code) advanceQuestion();
      return;
    }
    if (state.answerStatus !== "unanswered") return;

    setKeyboardHintsVisible(false);
    state.selectedCode = code;
    const isCorrect = state.selectedCode === question.country.code;
    if (isCorrect) {
      state.answerStatus = "correct";
      state.score += 1;
    } else {
      state.answerStatus = "correction";
      state.wrongAnswers.push(question.country);
    }
    if (state.curriculumQuizId) {
      state.attemptAnswers.push({ targetCode: question.country.code, selectedCode: code, correct: isCorrect });
      saveActiveMasteryAttempt();
    }
    render({ focusCorrect: !isCorrect });
    if (isCorrect) {
      autoAdvanceTimer = window.setTimeout(advanceQuestion, 350);
    }
  }

  const puzzleZoomLevels = [1, 1.5, 2, 3, 4];
  const puzzlePointers = new Map();
  let puzzleGesture = null;
  let puzzleViewportObserver = null;
  let puzzleViewportFrame = null;
  let puzzleViewCenter = { x: .5, y: .5 };

  function puzzleImagePoint(viewport, point) {
    const bounds = viewport.querySelector(".puzzle-zoom-content").getBoundingClientRect();
    return {
      x: clamp((point.x - bounds.left) / Math.max(1, bounds.width), 0, 1),
      y: clamp((point.y - bounds.top) / Math.max(1, bounds.height), 0, 1),
    };
  }

  function syncPuzzleViewport(viewport) {
    const frame = viewport.closest(".puzzle-viewport-frame");
    frame.classList.toggle("can-pan-left", viewport.scrollLeft > 1);
    frame.classList.toggle("can-pan-right", viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft > 1);
    frame.classList.toggle("can-pan-top", viewport.scrollTop > 1);
    frame.classList.toggle("can-pan-bottom", viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop > 1);
    viewport.classList.toggle("is-zoomed", state.puzzleZoom > 1.001);
    const bounds = viewport.getBoundingClientRect();
    puzzleViewCenter = puzzleImagePoint(viewport, {
      x: bounds.left + viewport.clientWidth / 2,
      y: bounds.top + viewport.clientHeight / 2,
    });
  }

  function setPuzzleZoom(zoom, point = null, anchor = null) {
    const viewport = app.querySelector(".puzzle-viewport");
    if (!viewport) return;
    const content = viewport.querySelector(".puzzle-zoom-content");
    const bounds = viewport.getBoundingClientRect();
    const target = point ?? { x: bounds.left + viewport.clientWidth / 2, y: bounds.top + viewport.clientHeight / 2 };
    const imagePoint = anchor ?? puzzleImagePoint(viewport, target);
    state.puzzleZoom = clamp(zoom, 1, 4);
    // Use the same fitted size for both drawing and anchoring. The content's CSS
    // explicitly disables transitions so its scroll extent updates immediately.
    const width = Math.min(bounds.width, bounds.height * 1.5) * state.puzzleZoom;
    const height = width / 1.5;
    const topMargin = Math.max(0, (bounds.height - height) / 2);
    content.style.width = `${width}px`;
    content.style.marginBlock = `${topMargin}px`;
    viewport.scrollLeft = Math.max(0, (bounds.width - width) / 2)
      + imagePoint.x * width - (target.x - bounds.left);
    viewport.scrollTop = topMargin + imagePoint.y * height - (target.y - bounds.top);
    app.querySelector("[data-puzzle-zoom-label]").textContent = `${Math.round(state.puzzleZoom * 100)}%`;
    app.querySelector('[data-action="puzzle-zoom-out"]').disabled = state.puzzleZoom <= 1.001;
    app.querySelector('[data-action="puzzle-zoom-in"]').disabled = state.puzzleZoom >= 3.999;
    syncPuzzleViewport(viewport);
    // Refresh boundaries at the next paint too, including resets that leave the
    // scroll offsets unchanged and therefore dispatch no scroll event.
    if (puzzleViewportFrame !== null) cancelAnimationFrame(puzzleViewportFrame);
    puzzleViewportFrame = requestAnimationFrame(() => {
      puzzleViewportFrame = null;
      if (app.contains(viewport)) syncPuzzleViewport(viewport);
    });
  }

  function clearPuzzlePointers() {
    const pointers = [...puzzlePointers.entries()];
    puzzlePointers.clear();
    puzzleGesture = null;
    for (const [id, point] of pointers) {
      point.viewport.classList.remove("is-panning");
      if (point.viewport.hasPointerCapture(id)) point.viewport.releasePointerCapture(id);
    }
  }

  function resizePuzzleViewer() {
    if (!state.puzzleStageId) return;
    clearPuzzlePointers();
    setPuzzleZoom(state.puzzleZoom, null, puzzleViewCenter);
  }

  function initializePuzzleViewer() {
    if (puzzleViewportFrame !== null) cancelAnimationFrame(puzzleViewportFrame);
    puzzleViewportFrame = null;
    puzzleViewportObserver?.disconnect();
    puzzleViewportObserver = null;
    const viewport = app.querySelector(".puzzle-viewport");
    if (!viewport) return;
    puzzleViewCenter = { x: .5, y: .5 };
    setPuzzleZoom(state.puzzleZoom, null, puzzleViewCenter);
    if ("ResizeObserver" in window) {
      puzzleViewportObserver = new ResizeObserver(resizePuzzleViewer);
      puzzleViewportObserver.observe(viewport);
    }
  }

  function startPuzzleGesture(viewport) {
    const entries = [...puzzlePointers.entries()];
    const [firstId, first] = entries[0];
    if (entries.length === 2) {
      const [secondId, second] = entries[1];
      puzzleGesture = {
        kind: "pinch", viewport, ids: [firstId, secondId],
        distance: Math.max(1, mapView.distance(first, second)),
        zoom: state.puzzleZoom,
        anchor: puzzleImagePoint(viewport, mapView.midpoint(first, second)),
      };
    } else {
      puzzleGesture = {
        kind: "pan", viewport, id: firstId, x: first.x, y: first.y,
        left: viewport.scrollLeft, top: viewport.scrollTop,
      };
    }
    viewport.classList.toggle("is-panning", state.puzzleZoom > 1.001);
  }

  app.addEventListener("pointerdown", (event) => {
    const viewport = event.target.closest(".puzzle-viewport");
    if (!viewport || (event.pointerType !== "touch" && event.button !== 0)) return;
    if (puzzlePointers.size >= 2) return;
    if (puzzleGesture && puzzleGesture.viewport !== viewport) clearPuzzlePointers();
    puzzlePointers.set(event.pointerId, { x: event.clientX, y: event.clientY, viewport });
    try {
      viewport.setPointerCapture(event.pointerId);
    } catch {
      // A touch can end before capture is registered, particularly in Safari.
      clearPuzzlePointers();
      return;
    }
    startPuzzleGesture(viewport);
    viewport.focus({ preventScroll: true });
    event.preventDefault();
  });

  window.addEventListener("pointermove", (event) => {
    const point = puzzlePointers.get(event.pointerId);
    const gesture = puzzleGesture;
    if (!point || !gesture) return;
    point.x = event.clientX;
    point.y = event.clientY;
    if (gesture.kind === "pinch") {
      const [first, second] = gesture.ids.map((id) => puzzlePointers.get(id));
      setPuzzleZoom(gesture.zoom * mapView.distance(first, second) / gesture.distance,
        mapView.midpoint(first, second), gesture.anchor);
      gesture.viewport.classList.toggle("is-panning", state.puzzleZoom > 1.001);
    } else {
      gesture.viewport.scrollLeft = gesture.left + gesture.x - point.x;
      gesture.viewport.scrollTop = gesture.top + gesture.y - point.y;
      syncPuzzleViewport(gesture.viewport);
    }
    event.preventDefault();
  });

  function finishPuzzlePointer(event) {
    const point = puzzlePointers.get(event.pointerId);
    if (!point) return;
    if (event.type !== "pointerup") {
      clearPuzzlePointers();
      return;
    }
    puzzlePointers.delete(event.pointerId);
    if (point.viewport.hasPointerCapture(event.pointerId)) point.viewport.releasePointerCapture(event.pointerId);
    if (puzzlePointers.size) startPuzzleGesture(point.viewport);
    else {
      point.viewport.classList.remove("is-panning");
      puzzleGesture = null;
    }
  }

  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
    window.addEventListener(type, finishPuzzlePointer);
  }
  window.addEventListener("blur", clearPuzzlePointers);
  app.addEventListener("wheel", (event) => {
    if (!event.ctrlKey || !event.cancelable || !event.target.closest(".puzzle-viewport")) return;
    event.preventDefault();
    clearPuzzlePointers();
    setPuzzleZoom(state.puzzleZoom * Math.exp(-normalizedZoomWheelDelta(event) * .005),
      { x: event.clientX, y: event.clientY });
  }, { passive: false });

  app.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control || !app.contains(control)) {
      const exploreMap = event.target.closest("[data-explore-map-svg]");
      if (
        exploreMap &&
        app.contains(exploreMap) &&
        Date.now() >= suppressExploreMapClickUntil
      ) {
        clearExploreCountrySelection();
      }
      return;
    }

    const action = control.dataset.action;
    if (action === "continue-puzzle-reward") {
      state.puzzleRewardOpen = false;
      state.puzzleRewardPending = false;
      render({ focusPuzzleResult: true });
      window.scrollTo(0, 0);
      return;
    }
    if (action === "open-puzzles") {
      if (!puzzles.stages.some((s) => s.id === control.dataset.stageId)) return;
      puzzleReturnFocus = { action, stageId: control.dataset.stageId, ...(control.dataset.puzzleOrigin ? { puzzleOrigin: control.dataset.puzzleOrigin } : {}) };
      state.puzzleStageId = control.dataset.stageId;
      state.puzzleZoom = 1;
      render({ focusPuzzleDialog: true });
      return;
    }
    if (action === "close-puzzles") { closePuzzles(); return; }
    if (action.startsWith("puzzle-zoom-")) {
      clearPuzzlePointers();
      if (action === "puzzle-zoom-reset") setPuzzleZoom(1, null, { x: .5, y: .5 });
      else {
        const nextZoom = action === "puzzle-zoom-in"
          ? puzzleZoomLevels.find((zoom) => zoom > state.puzzleZoom + .001) ?? 4
          : [...puzzleZoomLevels].reverse().find((zoom) => zoom < state.puzzleZoom - .001) ?? 1;
        setPuzzleZoom(nextZoom);
      }
      return;
    }

    if (action === "close-action-dialog") {
      if (control.classList.contains("action-dialog-overlay") && event.target !== control) return;
      closeActionDialog();
      return;
    }
    if (action === "open-share-email") {
      const payload = state.actionDialog?.kind === "share-fallback"
        ? state.actionDialog.sharePayload
        : null;
      if (!payload) return;
      openEmail(payload.email.subject, payload.email.body);
      closeActionDialog();
      return;
    }
    if (action === "copy-share-message") {
      const payload = state.actionDialog?.kind === "share-fallback"
        ? state.actionDialog.sharePayload
        : null;
      if (!payload) return;
      void copyWithFeedback(
        control,
        sharing.createFallbackMessage(payload),
        "shareMessageCopied",
        state.actionDialog.failedKey,
      );
      return;
    }

    if (action === "continue-game") {
      const next = progress.continueSelection(
        currentProfile(),
        curriculum.levels,
      );
      if (next.type === "quiz") startCurriculumQuiz(next.quiz.id);
      return;
    }
    if (action === "surprise-quiz") {
      const quiz = progress.surpriseQuiz(
        currentProfile(),
        curriculum.levels,
      );
      if (quiz) startCurriculumQuiz(quiz.id);
      return;
    }
    if (action === "levels") {
      showRecommendedLevels();
      return;
    }
    if (action === "show-recommended-next") {
      showRecommendedLevels(undefined, { historyMode: "replace" });
      return;
    }
    if (action === "toggle-level") {
      state.selectedLevelId =
        state.selectedLevelId === control.dataset.levelId
          ? null
          : control.dataset.levelId;
      syncUrlState();
      render();
      return;
    }
    if (action === "start-curriculum-quiz") {
      startCurriculumQuiz(control.dataset.quizId);
      return;
    }
    if (action === "retry-curriculum-quiz") {
      startCurriculumQuiz(state.curriculumQuizId, { historyMode: "replace" });
      return;
    }
    if (action === "quiz-map-area") {
      setQuizMapArea(control.dataset.value);
      return;
    }
    if (action === "open-milestone-celebration") {
      const quiz = curriculumQuiz();
      const stage = quiz ? stageForLevelIndex(quiz.levelIndex) : null;
      if (stage && state.resultNewStageMastery) openMilestoneCelebration(stage.id, "newly-earned");
      return;
    }
    if (action === "replay-milestone") {
      const stage = curriculum.stages.find((candidate) => candidate.id === control.dataset.stageId);
      if (stage && progress.stageProgress(currentProfile(), stage, curriculum.levels).isMastered) {
        openMilestoneCelebration(stage.id, state.screen === "levels" ? "levels-replay" : "home-replay");
      }
      return;
    }
    if (action === "dismiss-milestone-celebration") {
      dismissMilestoneCelebration();
      return;
    }
    if (action === "close-milestone-celebration") {
      dismissMilestoneCelebration({ returnHome: state.milestoneCelebrationOrigin === "newly-earned" });
      return;
    }
    if (action === "next-curriculum-quiz") {
      clearMilestoneCelebrationTimer();
      state.milestoneCelebrationStageId = null;
      state.milestoneCelebrationOrigin = null;
      state.milestoneCelebrationReturnScrollY = null;
      state.milestoneCelebrationSettled = false;
      const quiz = curriculum.quizById.get(control.dataset.nextQuizId) ?? progress.nextUnmastered(
        currentProfile(), curriculum.levels, state.curriculumQuizId,
      );
      if (quiz) startCurriculumQuiz(quiz.id, { historyMode: "replace" });
      else returnToSetup({ historyMode: "replace" });
      return;
    }
    if (action === "open-world-celebration") {
      openWorldCelebration("newly-earned");
      return;
    }
    if (action === "replay-world-celebration") {
      const totals = progress.summary(currentProfile(), curriculum.levels);
      if (totals.masteredQuizzes === totals.totalQuizzes) {
        openWorldCelebration("home-replay");
      }
      return;
    }
    if (action === "view-completed-progress") {
      closeWorldCelebration();
      return;
    }
    if (action === "view-recommended-level") {
      showRecommendedLevels();
      return;
    }
    if (action === "review-missed-cards") {
      const missedCountries = [
        ...new Map(
          state.wrongAnswers.map((country) => [country.code, country]),
        ).values(),
      ];
      startFlashcards(missedCountries, "result");
      return;
    }
    if (action === "level-cards") {
      const level = curriculum.levelById.get(control.dataset.levelId);
      if (!level) return;
      state.activeLevelId = level.id;
      startFlashcards(
        level.countryCodes.map((code) => countriesByCode.get(code)),
        "level",
      );
      return;
    }
    if (action === "explore-level") {
      const level = curriculum.levelById.get(control.dataset.levelId);
      if (!level) return;
      showContextualExplore(
        contextualExploreScope(level.title, level.countryCodes, level.id),
        { screen: "levels", levelId: level.id },
      );
      return;
    }
    if (action === "back-from-cards") {
      if (state.flashcardReturn === "explore") {
        returnToRoute({
          screen: "explore",
          levelId: state.exploreScope?.levelId ?? null,
          region: state.region,
        });
      } else if (state.flashcardReturn === "result") {
        returnToRoute(quizRoute());
      } else {
        returnToRoute({ screen: "levels", levelId: state.activeLevelId });
      }
      return;
    }
    if (action === "explore-cards") {
      startFlashcards(shuffle(countriesInExploreMapScope()), "explore");
      return;
    }
    if (action === "open-profile-panel") { state.profilePanelOpen = true; render({ focusProfilePanel: true }); return; }
    if (action === "close-profile-panel") { if (event.target === control) { state.profilePanelOpen = false; render(); } return; }
    if (action === "close-profile-panel-button") { state.profilePanelOpen = false; render(); return; }
    if (action === "switch-profile") { persist(progress.switchProfile(progressStore, control.dataset.profileId)); state.profilePanelOpen = false; renderAtTop(); return; }
    if (action === "add-profile") { openActionDialog("add-profile"); return; }
    if (action === "rename-profile") { openActionDialog("rename-profile"); return; }
    if (action === "clear-profile") { openActionDialog("clear-profile"); return; }
    if (action === "delete-profile") { openActionDialog("delete-profile"); return; }
    if (action === "copy-transfer") { void copyTransferLink(control); return; }
    if (action === "download-backup") { downloadBackup(); return; }
    if (action === "share-progress") { void shareProgress(control); return; }
    if (action === "share-curriculum-challenge") { void shareCurriculumChallenge(control); return; }
    if (action === "create-imported-profile") { if (state.importProfiles?.[0]) createImportedProfile(state.importProfiles[0]); return; }
    if (action === "update-imported-profile") {
      const imported = state.importProfiles?.[0];
      if (imported && progressStore.profiles[imported.id]) {
        finishImport(progress.mergeInto(progressStore, imported.id, imported));
      }
      return;
    }
    if (action === "merge-import") {
      if (state.importProfiles?.[0]) {
        finishImport(
          progress.mergeInto(
            progressStore,
            control.dataset.profileId,
            state.importProfiles[0],
          ),
        );
      }
      return;
    }
    if (action === "import-one") { const imported = state.importProfiles?.[Number(control.dataset.importIndex)]; if (imported) importSingleProfile(imported); return; }
    if (action === "import-all") { importAllProfiles(); return; }
    if (action === "cancel-import") {
      state.importProfiles = null;
      state.importError = false;
      state.importSource = null;
      clearTransferFragment();
      returnToSetup({ historyMode: "replace" });
      return;
    }

    if (action === "install-app") {
      void requestInstall();
      return;
    }

    if (action === "start-challenge") {
      startCurriculumQuiz(state.curriculumQuizId, { challengeRound: true });
      return;
    }

    if (action === "open-challenge") {
      openChallengeDialog();
      return;
    }

    if (action === "close-open-challenge") {
      if (event.target === control) closeOpenChallenge();
      return;
    }

    if (action === "cancel-open-challenge") {
      closeOpenChallenge();
      return;
    }

    if (action === "close-install-help") {
      if (event.target === control) closeInstallHelp();
      return;
    }

    if (action === "close-install-help-button") {
      closeInstallHelp();
      return;
    }

    if (action === "language") {
      setLocale(control.dataset.value);
      return;
    }

    if (action === "explore") {
      showExplore();
      return;
    }

    if (action === "explore-result-country") {
      showResultCountryInExplore(control.dataset.code);
      return;
    }

    if (action === "back-from-explore") {
      returnFromExplore();
      return;
    }

    if (action === "open-explore-region-picker") {
      state.exploreRegionPickerOpen = true;
      state.explorePreviewCode = null;
      render({ focusExploreHeading: true });
      return;
    }

    if (action === "close-explore-region-picker") {
      state.exploreRegionPickerOpen = false;
      render({ focusExploreRegionControl: true });
      return;
    }

    if (action === "explore-map-region") {
      if (!updateRegion(control.dataset.value)) return;
      state.exploreScope = null;
      state.exploreReturn = null;
      state.exploreMapExtent = state.region;
      resetExploreCountryState();
      state.exploreRegionPickerOpen = false;
      syncUrlState();
      render({ focusExploreHeading: true });
      return;
    }

    if (action === "explore-map-area") {
      const extent = control.dataset.value;
      if (
        extent !== "world" &&
        !mapSelectableRegions.includes(extent)
      ) return;
      state.exploreMapExtent = extent;
      resetExploreMapInteraction();
      render({ focusExploreMapArea: extent });
      return;
    }

    if (action === "explore-map-zoom-out") {
      stepExploreMapZoom(-1);
      return;
    }

    if (action === "explore-map-zoom-reset") {
      resetExploreMapZoom();
      return;
    }

    if (action === "explore-map-zoom-in") {
      stepExploreMapZoom(1);
      return;
    }

    if (action === "explore-country") {
      if (
        control.closest(".explore-region-map") &&
        Date.now() < suppressExploreMapClickUntil
      ) {
        event.preventDefault();
        return;
      }
      pinExploreCountry(control.dataset.exploreCode, {
        scrollCard: control.closest(".explore-region-map") !== null,
      });
      return;
    }

    if (action === "region" || action === "map-region") {
      if (!updateRegion(control.dataset.value)) return;
      render();
      return;
    }

    if (action === "answer") {
      selectAnswer(control.dataset.code);
      return;
    }

    if (action === "toggle-silhouette") {
      setSilhouetteExpanded(!state.silhouetteExpanded);
      return;
    }

    if (action === "flashcard-toggle") {
      if (state.flashcardRevealed) {
        state.flashcardIndex += 1;
        state.flashcardRevealed = false;
        renderAtTop({ focusFlashcard: true });
      } else {
        state.flashcardRevealed = true;
        render({ focusFlashcard: true });
      }
      return;
    }

    if (action === "open-country-details") {
      state.countryDetailsCode = control.dataset.code;
      render({
        focusCountryDetails: true,
        preserveExploreListScroll: true,
      });
      return;
    }

    if (action === "close-country-details") {
      closeCountryDetails();
      return;
    }

    if (action === "review") {
      const review = document.getElementById("result-review");
      review?.focus({ preventScroll: true });
      review?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (action === "setup") {
      returnToRoute({ screen: "setup" });
      return;
    }

    if (action === "back-from-quiz") {
      returnToRoute({ screen: "levels", levelId: state.activeLevelId });
    }
  });

  app.addEventListener("submit", (event) => {
    const actionDialogForm = event.target.closest("[data-action-dialog-form]");
    if (actionDialogForm && app.contains(actionDialogForm)) {
      event.preventDefault();
      confirmActionDialog(actionDialogForm);
      return;
    }
    const form = event.target.closest("[data-open-challenge-form]");
    if (!form || !app.contains(form)) return;
    event.preventDefault();
    openSharedLinkInput(
      form.elements.namedItem("challenge-input")?.value ?? "",
    );
  });

  app.addEventListener("change", async (event) => {
    if (!event.target.matches?.("[data-backup-input]") || !event.target.files?.[0]) return;
    try {
      state.importProfiles = progress.parseBackup(await event.target.files[0].text());
      state.importError = false; state.importSource = "backup"; state.profilePanelOpen = false; state.screen = "import"; renderAtTop();
    } catch { state.importProfiles = null; state.importError = true; state.importSource = "backup"; state.profilePanelOpen = false; state.screen = "import"; renderAtTop(); }
  });

  app.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches?.("#action-dialog-input")) {
      event.preventDefault();
      event.target.form?.requestSubmit();
      return;
    }
    const fileButton = event.target.closest?.(".file-button");
    if (!fileButton || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    fileButton.querySelector("[data-backup-input]")?.click();
  });

  app.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.target?.id !== "challenge-input") return;
    event.preventDefault();
    event.target.form?.requestSubmit();
  });

  app.addEventListener("keydown", (event) => {
    const tab = event.target.closest?.(
      '[role="tab"][data-action="quiz-map-area"]',
    );
    if (!tab || !app.contains(tab)) return;
    const areas = ["world", "region", "nearby"];
    const currentIndex = areas.indexOf(tab.dataset.value);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? areas.length - 1
        : event.key === "ArrowLeft"
          ? (currentIndex - 1 + areas.length) % areas.length
          : event.key === "ArrowRight"
            ? (currentIndex + 1) % areas.length
            : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    event.stopPropagation();
    setQuizMapArea(areas[nextIndex]);
  });

  app.addEventListener(
    "wheel",
    (event) => {
      if (!event.ctrlKey || !event.cancelable) return;
      const map = event.target.closest(".explore-region-map");
      if (!map || !app.contains(map) || !state.exploreMapViewport) return;
      event.preventDefault();
      zoomExploreMapFromWheel(event);
    },
    { passive: false },
  );

  app.addEventListener("pointerdown", (event) => {
    const map = event.target.closest(".explore-region-map");
    if (
      !map ||
      !app.contains(map) ||
      event.target.closest(
        ".explore-map-zoom-controls, .country-silhouette-inset",
      )
    ) {
      return;
    }

    if (
      event.pointerType !== "touch" &&
      (event.pointerType === "mouse" || event.pointerType === "pen") &&
      event.button === 0
    ) {
      startExploreMapDrag(event, map);
      return;
    }
    if (event.pointerType !== "touch") return;

    const activeMap = exploreMapPointers.values().next().value?.map;
    if (activeMap && activeMap !== map) {
      exploreMapPointers.clear();
      exploreMapGesture = null;
    }
    if (exploreMapPointers.size >= 2) return;

    exploreMapPointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      map,
    });
    if (exploreMapPointers.size === 2) {
      if (exploreMapDrag) {
        exploreMapDrag.map.classList.remove("is-dragging");
        exploreMapDrag = null;
      }
      startExploreMapGesture(map);
    } else {
      startExploreMapDrag(event, map, { allowAtBase: true });
    }
  });

  window.addEventListener("pointermove", (event) => {
    const pointer = exploreMapPointers.get(event.pointerId);
    if (pointer) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }

    if (exploreMapDrag?.pointerId === event.pointerId) {
      updateExploreMapDrag(event);
      return;
    }

    if (!pointer) return;
    if (!exploreMapGesture?.pointerIds.includes(event.pointerId)) return;
    event.preventDefault();
    updateExploreMapGesture();
  });

  function finishExploreMapPointer(event) {
    if (exploreMapDrag?.pointerId === event.pointerId) {
      if (exploreMapDrag.dragging) {
        suppressExploreMapClickUntil = Date.now() + 500;
        exploreMapDrag.map.classList.remove("is-dragging");
      }
      exploreMapDrag = null;
    }

    if (!exploreMapPointers.has(event.pointerId)) return;
    const completedGesture =
      exploreMapGesture?.pointerIds.includes(event.pointerId);
    exploreMapPointers.delete(event.pointerId);
    if (completedGesture) {
      suppressExploreMapClickUntil = Date.now() + 500;
      exploreMapGesture = null;
    }
    if (exploreMapPointers.size === 0) {
      exploreMapGesture = null;
    }
  }

  window.addEventListener("pointerup", finishExploreMapPointer);
  window.addEventListener("pointercancel", finishExploreMapPointer);
  window.addEventListener("resize", () => {
    scheduleScrollAffordanceUpdate();
    scheduleRecommendedNavigationUpdate();
    scheduleResponsiveRegionMaps();
    if (!puzzleViewportObserver) resizePuzzleViewer();
    if (state.screen === "explore" && !state.exploreRegionPickerOpen) {
      scheduleExploreMapZoomUi();
    }
  });

  window.addEventListener("scroll", scheduleRecommendedNavigationUpdate, { passive: true });

  app.addEventListener(
    "scroll",
    (event) => {
      if (event.target.matches?.(".puzzle-viewport")) syncPuzzleViewport(event.target);
      if (event.target.matches?.("[data-scroll-affordance]")) {
        updateScrollAffordance(event.target);
      }
    },
    true,
  );

  app.addEventListener("pointerover", (event) => {
    const countryControl = event.target.closest("[data-explore-code]");
    if (
      countryControl &&
      app.contains(countryControl) &&
      !countryControl.contains(event.relatedTarget)
    ) {
      if (event.pointerType !== "touch") {
        setExplorePreview(countryControl.dataset.exploreCode);
      }
      return;
    }

    const control = event.target.closest("[data-map-region]");
    if (
      !control ||
      !app.contains(control) ||
      control.contains(event.relatedTarget)
    ) {
      return;
    }
    setRegionPreview(control.dataset.mapRegion);
  });

  app.addEventListener("pointerout", (event) => {
    const countryControl = event.target.closest("[data-explore-code]");
    if (
      countryControl &&
      app.contains(countryControl) &&
      !countryControl.contains(event.relatedTarget)
    ) {
      if (event.pointerType !== "touch") {
        setExplorePreview(null);
      }
      return;
    }

    const control = event.target.closest("[data-map-region]");
    if (
      !control ||
      !app.contains(control) ||
      control.contains(event.relatedTarget)
    ) {
      return;
    }
    setRegionPreview(null);
  });

  app.addEventListener("focusin", (event) => {
    const countryControl = event.target.closest("[data-explore-code]");
    if (countryControl && app.contains(countryControl)) {
      setExplorePreview(countryControl.dataset.exploreCode);
      return;
    }

    const control = event.target.closest("[data-map-region]");
    if (control && app.contains(control)) {
      setRegionPreview(control.dataset.mapRegion);
    }
  });

  app.addEventListener("focusout", (event) => {
    const countryControl = event.target.closest("[data-explore-code]");
    if (
      countryControl &&
      app.contains(countryControl) &&
      !countryControl.contains(event.relatedTarget)
    ) {
      setExplorePreview(null);
      return;
    }

    const control = event.target.closest("[data-map-region]");
    if (
      control &&
      app.contains(control) &&
      !control.contains(event.relatedTarget)
    ) {
      setRegionPreview(null);
    }
  });

  app.addEventListener("keydown", (event) => {
    const countryControl = event.target.closest(
      '[data-action="explore-country"]',
    );
    if (
      countryControl &&
      app.contains(countryControl) &&
      countryControl.tagName.toLowerCase() !== "button" &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      pinExploreCountry(countryControl.dataset.exploreCode, {
        scrollCard: true,
      });
      return;
    }

    const control = event.target.closest(
      '[data-action="map-region"], [data-action="explore-map-region"]',
    );
    if (
      !control ||
      !app.contains(control) ||
      (event.key !== "Enter" && event.key !== " ")
    ) {
      return;
    }
    event.preventDefault();
    if (!updateRegion(control.dataset.value)) return;
    if (control.dataset.action === "explore-map-region") {
      resetExploreCountryState();
      state.exploreRegionPickerOpen = false;
      render({ focusExploreHeading: true });
    } else {
      render();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      state.screen !== "quiz" ||
      state.answerStatus === "correct" ||
      event.repeat ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      !/^[1-9]$/.test(event.key)
    ) {
      return;
    }

    const answer = app.querySelectorAll('[data-action="answer"]')[
      Number(event.key) - 1
    ];
    if (!answer) return;

    if (
      state.answerStatus === "correction" &&
      answer.dataset.code !== state.questions[state.questionIndex].country.code
    ) {
      return;
    }

    event.preventDefault();
    selectAnswer(answer.dataset.code);
  });

  document.addEventListener("keydown", (event) => {
    if (
      state.screen !== "quiz" ||
      state.answerStatus !== "unanswered" ||
      event.repeat ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      /^[1-9]$/.test(event.key)
    ) {
      return;
    }

    if (
      keyboardHintIgnoredKeys.has(event.key) ||
      /^F\d{1,2}$/.test(event.key)
    ) {
      return;
    }

    const focusedControl = event.target?.closest?.(
      "button, a, input, select, textarea, [contenteditable='true']",
    );
    if (
      focusedControl &&
      (event.key === "Enter" ||
        event.key === " " ||
        event.key === "Spacebar")
    ) {
      return;
    }

    event.preventDefault();
    setKeyboardHintsVisible(true);
  });

  document.addEventListener("keydown", (event) => {
    const activeDialog = state.puzzleStageId
      ? app.querySelector(".puzzle-dialog")
      : state.actionDialog
      ? app.querySelector(".action-dialog")
      : state.milestoneCelebrationStageId !== null
      ? app.querySelector(".milestone-celebration-dialog")
      : state.worldCelebrationOpen
      ? app.querySelector(".world-celebration-dialog")
      : state.openChallengeOpen
      ? app.querySelector(".open-challenge-dialog")
      : state.installHelpOpen
          ? app.querySelector(".install-help-dialog")
          : state.profilePanelOpen
            ? app.querySelector(".profile-panel")
            : state.countryDetailsCode !== null
              ? app.querySelector(".country-details-dialog")
              : null;
    if (activeDialog && event.key === "Tab") {
      const dialog = activeDialog;
      const focusable = dialog
        ? [
            ...dialog.querySelectorAll(
              "button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
            ),
          ].filter((control) => !control.disabled)
        : [];
      if (focusable.length === 0) {
        event.preventDefault();
        dialog?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (
        !dialog.contains(document.activeElement) ||
        (event.shiftKey && document.activeElement === first) ||
        (!event.shiftKey && document.activeElement === last)
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
      return;
    }

    if (event.key !== "Escape") return;

    if (state.puzzleStageId) { event.preventDefault(); closePuzzles(); return; }

    if (state.actionDialog) {
      event.preventDefault();
      closeActionDialog();
      return;
    }

    if (state.milestoneCelebrationStageId !== null) {
      event.preventDefault();
      dismissMilestoneCelebration();
      return;
    }

    if (state.worldCelebrationOpen) {
      event.preventDefault();
      closeWorldCelebration();
      return;
    }

    if (state.openChallengeOpen) {
      event.preventDefault();
      closeOpenChallenge();
      return;
    }

    if (state.profilePanelOpen) { event.preventDefault(); state.profilePanelOpen = false; render(); return; }

    if (state.installHelpOpen) {
      event.preventDefault();
      closeInstallHelp();
      return;
    }

    if (state.countryDetailsCode !== null) {
      event.preventDefault();
      closeCountryDetails();
      return;
    }

    if (state.screen === "explore" && state.exploreRegionPickerOpen) {
      event.preventDefault();
      state.exploreRegionPickerOpen = false;
      render({ focusExploreRegionControl: true });
      return;
    }

    if (
      state.screen === "explore" &&
      state.explorePinnedCode !== null
    ) {
      event.preventDefault();
      clearExploreCountrySelection();
      return;
    }

    const expandableSilhouetteVisible =
      state.screen === "quiz" && state.mode === "map-country";

    if (expandableSilhouetteVisible && state.silhouetteExpanded) {
      event.preventDefault();
      setSilhouetteExpanded(false);
    }
  });

  async function validateInitialChallengeScore() {
    if (!initialChallenge?.valid) return;
    const scoreText = initialChallenge.scoreParam;
    const score = /^\d+$/.test(scoreText ?? "") ? Number(scoreText) : NaN;
    const maximum = curriculum.quizById.get(initialChallenge.quizId)?.countryCodes.length ?? 0;
    if (
      !Number.isSafeInteger(score) ||
      score < 0 ||
      score > maximum ||
      !initialChallenge.proof
    ) {
      return;
    }

    const recipe = { quizId: initialChallenge.quizId, revision: initialChallenge.revision, score };
    if (await challenge.verifyScoreProof(recipe, initialChallenge.proof)) {
      state.challengeTargetScore = score;
      state.challengeScoreVerified = true;
      state.challengeScoreWarning = false;
      state.challengeScoreParam = String(score);
    }
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    if (!isInstallContext() || !isMobileDevice()) return;
    event.preventDefault();
    deferredInstallPrompt = event;
    if (state.screen === "setup" && !isStandalone()) render();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    state.installHelpOpen = false;
    if (state.screen === "setup") render();
  });

  window.addEventListener("popstate", (event) => {
    state.puzzleStageId = null;
    state.puzzleRewardPending = false;
    state.puzzleRewardOpen = false;
    const route = navigation.readUrl(window.location.href, navigationContext);
    if (!route) {
      window.location.reload();
      return;
    }

    const historyState = event.state;
    if (
      historyState?.sessionId === historySessionId &&
      route.screen === "quiz" &&
      route.quizId === state.curriculumQuizId
    ) {
      if (historyState.screen === "result" && state.resultRecorded) {
        state.screen = "result";
        renderAtTop();
        return;
      }
      if (
        historyState.screen === "explore" &&
        state.exploreReturn?.screen === "result"
      ) {
        state.screen = "explore";
        renderAtTop();
        return;
      }
      if (
        historyState.screen === "flashcards" &&
        state.flashcardReturn === "result"
      ) {
        state.screen = "flashcards";
        renderAtTop({ focusFlashcard: true });
        return;
      }
    }

    applyRoute(route, { historyMode: "none" });
  });

  function previewStage() {
    return curriculum.stages.find((stage) => stage.id === initialUrl.searchParams.get("stage"))
      ?? curriculum.stages[0];
  }

  function previewStageQuizzes(stage) {
    return curriculum.levels
      .slice(stage.startLevel - 1, stage.endLevel)
      .flatMap((level) => level.quizzes.map((baseQuiz) => curriculum.quizById.get(baseQuiz.id)));
  }

  function previewStageFinalQuiz(stage, mode = "country-capital") {
    const level = curriculum.levels[stage.endLevel - 1];
    const baseQuiz = level.quizzes.find((quiz) => quiz.mode === mode) ?? level.quizzes.at(-1);
    return curriculum.quizById.get(baseQuiz.id);
  }

  function resetPreviewProgress(id) {
    progressStore = progress.createEmptyStore({ id: `preview-${id}`, defaultName: "Preview" });
  }

  function masterPreviewQuizzes(predicate) {
    for (const level of curriculum.levels) {
      for (const baseQuiz of level.quizzes) {
        const quiz = curriculum.quizById.get(baseQuiz.id);
        if (predicate(quiz)) {
          progressStore = progress.recordResult(
            progressStore,
            progressStore.activeProfileId,
            quiz,
            quiz.countryCodes.length,
          );
        }
      }
    }
  }

  function preparePreviewResult(stage, previewName) {
    resetPreviewProgress(previewName);
    const stageQuizIds = new Set(previewStageQuizzes(stage).map((quiz) => quiz.id));
    masterPreviewQuizzes((quiz) => stageQuizIds.has(quiz.id));
    const quiz = previewStageFinalQuiz(stage);
    const level = curriculum.levelById.get(quiz.levelId);
    state.curriculumQuizId = quiz.id;
    state.activeLevelId = level.id;
    state.mode = quiz.mode;
    state.questions = quiz.countryCodes.map((code) => ({ country: countriesByCode.get(code), choices: [] }));
    state.score = state.questions.length;
    state.wrongAnswers = [];
    state.resultRecorded = true;
    state.resultBestScore = state.score;
    state.resultPreviousBestScore = null;
    state.resultNewQuizMastery = true;
    state.resultNewLevelMastery = true;
    state.resultNewStageMastery = true;
    state.resultCelebrationPending = false;
    state.resultPreview = previewName;
    state.screen = "result";
  }

  function startLastQuestionPreview(quiz, previewName) {
    const attemptSeed = `preview-${previewName}`;
    const recipe = curriculum.createAttempt(quiz, attemptSeed);
    const answers = recipe.slice(0, -1).map((question) => ({
      targetCode: question.countryCode,
      selectedCode: question.countryCode,
      correct: true,
    }));
    const timestamp = new Date().toISOString();
    progressStore = progress.saveMasteryAttempt(progressStore, progressStore.activeProfileId, {
      quizId: quiz.id,
      revision: quiz.revision,
      attemptSeed,
      questionIndex: answers.length,
      score: answers.length,
      answers,
      correctionPending: null,
      startedAt: timestamp,
      updatedAt: timestamp,
    });
    startCurriculumQuiz(quiz.id, { resume: true, historyMode: "none" });
  }

  async function initialize() {
    if (initialPreview?.startsWith("puzzle-")) {
      const stage = initialPreview === "puzzle-world"
        ? curriculum.stages.at(-1)
        : curriculum.stages.find((candidate) => candidate.id === initialUrl.searchParams.get("stage")) ?? curriculum.stages[0];
      const quizzes = previewStageQuizzes(stage);
      const isViewer = initialPreview.startsWith("puzzle-view-") || initialPreview === "puzzle-collection";
      const index = ["puzzle-final", "puzzle-world"].includes(initialPreview) ? quizzes.length - 1
        : ["puzzle-partial", "puzzle-view-partial"].includes(initialPreview) ? Math.floor(quizzes.length / 2)
        : initialPreview === "puzzle-level" ? 3 : 0;
      const quiz = quizzes[index];
      resetPreviewProgress(initialPreview);
      const earnedCount = initialPreview === "puzzle-view-empty" ? 0
        : ["puzzle-view-complete", "puzzle-collection"].includes(initialPreview) ? quizzes.length
        : index + (initialPreview === "puzzle-replay" ? 1 : 0);
      const earnedIds = new Set(quizzes.slice(0, earnedCount).map((q) => q.id));
      masterPreviewQuizzes((q) => initialPreview === "puzzle-world" ? q.id !== quiz.id : earnedIds.has(q.id));
      if (isViewer) {
        state.screen = "levels";
        state.puzzleStageId = stage.id;
        puzzleReturnFocus = { action: "open-puzzles", stageId: stage.id };
        render({ focusPuzzleDialog: true });
        return;
      }
      // Exercise the normal localized failure UI without a missing-file request.
      if (initialPreview === "puzzle-missing-image") failedPuzzleImages.add(puzzles.stages.find((candidate) => candidate.id === stage.id).image);
      state.curriculumQuizId = quiz.id;
      state.activeLevelId = quiz.levelId;
      state.mode = quiz.mode;
      state.questions = quiz.countryCodes.map((code) => ({ country: countriesByCode.get(code), choices: [] }));
      state.score = state.questions.length;
      state.wrongAnswers = [];
      state.resultRecorded = false;
      finishCurriculumAttempt();
      state.screen = "result";
      state.resultPreview = initialPreview;
      render();
      return;
    }
    if (initialPreview === "level-final-gap-question") {
      const level = curriculum.levels[0];
      const targetQuiz = curriculum.quizById.get(level.quizzes[2].id);
      resetPreviewProgress(initialPreview);
      masterPreviewQuizzes((quiz) => quiz.levelId === level.id && quiz.id !== targetQuiz.id);
      startLastQuestionPreview(targetQuiz, initialPreview);
      return;
    }
    if (initialPreview === "tourist-world-final-question") {
      const tourist = curriculum.stages.find((stage) => stage.id === "tourist");
      const targetQuiz = previewStageFinalQuiz(tourist, "country-flag");
      resetPreviewProgress(initialPreview);
      masterPreviewQuizzes((quiz) => quiz.id !== targetQuiz.id);
      startLastQuestionPreview(targetQuiz, initialPreview);
      return;
    }
    if (initialPreview === "navigator-tourist-gap-question") {
      const tourist = curriculum.stages.find((stage) => stage.id === "tourist");
      const navigator = curriculum.stages.find((stage) => stage.id === "navigator");
      const touristGap = previewStageFinalQuiz(tourist, "flag-country");
      const navigatorTarget = previewStageFinalQuiz(navigator);
      const selectedQuizIds = new Set([
        ...previewStageQuizzes(tourist),
        ...previewStageQuizzes(navigator),
      ].map((quiz) => quiz.id));
      resetPreviewProgress(initialPreview);
      masterPreviewQuizzes((quiz) => selectedQuizIds.has(quiz.id) && ![touristGap.id, navigatorTarget.id].includes(quiz.id));
      startLastQuestionPreview(navigatorTarget, initialPreview);
      return;
    }
    if (initialPreview === "milestone-question") {
      const stage = previewStage();
      const targetQuiz = previewStageFinalQuiz(stage);
      const stageQuizIds = new Set(previewStageQuizzes(stage).map((quiz) => quiz.id));
      resetPreviewProgress(`${initialPreview}-${stage.id}`);
      masterPreviewQuizzes((quiz) => stageQuizIds.has(quiz.id) && quiz.id !== targetQuiz.id);
      startLastQuestionPreview(targetQuiz, `${initialPreview}-${stage.id}`);
      return;
    }
    if (initialPreview === "final-question") {
      const finalLevel = curriculum.levels.at(-1);
      const finalQuiz = curriculum.quizById.get(finalLevel.quizzes.at(-1).id);
      resetPreviewProgress(initialPreview);
      masterPreviewQuizzes((quiz) => quiz.id !== finalQuiz.id);
      startLastQuestionPreview(finalQuiz, initialPreview);
      return;
    }
    if (initialPreview === "final-result" || initialPreview === "final-celebration") {
      resetPreviewProgress(initialPreview);
      masterPreviewQuizzes(() => true);
      const level = curriculum.levels.at(-1);
      const quiz = curriculum.quizById.get(level.quizzes.at(-1).id);
      state.curriculumQuizId = quiz.id;
      state.activeLevelId = level.id;
      state.mode = quiz.mode;
      state.questions = quiz.countryCodes.map((code) => ({ country: countriesByCode.get(code), choices: [] }));
      state.score = state.questions.length;
      state.wrongAnswers = [];
      state.resultRecorded = true;
      state.resultBestScore = state.score;
      state.resultPreviousBestScore = null;
      state.resultNewQuizMastery = true;
      state.resultNewLevelMastery = true;
      state.resultNewStageMastery = initialPreview === "final-result";
      state.resultCelebrationPending = false;
      state.resultPreview = initialPreview;
      state.screen = "result";
      if (initialPreview === "final-celebration") openWorldCelebration();
      else render();
      return;
    }
    if (["milestone-result", "milestone-celebration", "milestone-replay"].includes(initialPreview)) {
      const stage = previewStage();
      preparePreviewResult(stage, `${initialPreview}-${stage.id}`);
      if (initialPreview === "milestone-replay") {
        const source = initialUrl.searchParams.get("source") === "levels" ? "levels" : "home";
        state.screen = source === "levels" ? "levels" : "setup";
        state.selectedLevelId = source === "levels" ? curriculum.levels[stage.endLevel - 1].id : null;
        openMilestoneCelebration(stage.id, `${source}-replay`);
        return;
      }
      if (initialPreview === "milestone-celebration") openMilestoneCelebration(stage.id, "newly-earned");
      else render();
      return;
    }
    if (resultPreviewNames.has(initialPreview)) {
      resetPreviewProgress(initialPreview);
      const longestLevelIndex = curriculum.levels.reduce((longestIndex, candidate, index) =>
        levelTitle(candidate).length > levelTitle(curriculum.levels[longestIndex]).length ? index : longestIndex, 0);
      const crossLevel = ["result-next-level", "result-failed-next", "result-skip-level", "result-failed-skip-level"].includes(initialPreview);
      const wraps = initialPreview.endsWith("wrap");
      const skipsWithinLevel = initialPreview.endsWith("skip-quiz");
      const skipsAcrossLevels = initialPreview.endsWith("skip-level");
      const allMastered = initialPreview.endsWith("all-mastered");
      const failedResult = initialPreview.startsWith("result-failed-") || ["result-new-record", "result-below-best"].includes(initialPreview);
      const level = curriculum.levels[wraps ? curriculum.levels.length - 1 : crossLevel ? Math.max(0, longestLevelIndex - 1) : 0];
      const quiz = curriculum.quizById.get(level.quizzes[wraps || crossLevel ? 3 : 0].id);
      const resultScore = quiz.countryCodes.length - (failedResult ? 1 : 0);
      if (allMastered) masterPreviewQuizzes(() => true);
      else if (initialPreview === "result-failed-no-next") masterPreviewQuizzes((candidate) => candidate.id !== quiz.id);
      else if (crossLevel) {
        masterPreviewQuizzes((candidate) => candidate.levelId === level.id && candidate.id !== quiz.id);
        if (skipsAcrossLevels) {
          const firstNextQuiz = curriculum.levels[longestLevelIndex].quizzes[0];
          masterPreviewQuizzes((candidate) => candidate.id === firstNextQuiz.id);
        }
      } else if (skipsWithinLevel) {
        masterPreviewQuizzes((candidate) => candidate.id === level.quizzes[1].id);
      }
      if (["result-new-record", "result-below-best", "result-replay-mastered"].includes(initialPreview)) {
        progressStore = progress.recordResult(progressStore, progressStore.activeProfileId, quiz,
          quiz.countryCodes.length - (initialPreview === "result-new-record" ? 2 : 0));
      }
      const previousRecord = progress.currentRecord(currentProfile(), quiz);
      const previousState = progress.quizState(currentProfile(), quiz);
      const previousLevelMastered = progress.levelProgress(currentProfile(), level).mastered;
      progressStore = progress.recordResult(progressStore, progressStore.activeProfileId, quiz, resultScore);
      state.curriculumQuizId = quiz.id;
      state.activeLevelId = level.id;
      state.mode = quiz.mode;
      state.questions = quiz.countryCodes.map((code) => ({ country: countriesByCode.get(code), choices: [] }));
      state.score = resultScore;
      state.wrongAnswers = failedResult ? [countriesByCode.get(quiz.countryCodes[0])] : [];
      state.resultRecorded = true;
      state.resultBestScore = progress.currentRecord(currentProfile(), quiz).bestScore;
      state.resultPreviousBestScore = previousRecord?.bestScore ?? null;
      state.resultNewQuizMastery = !failedResult && previousState !== "mastered";
      state.resultNewLevelMastery = previousLevelMastered < 4 && progress.levelProgress(currentProfile(), level).mastered === 4;
      state.resultNewStageMastery = false;
      state.resultCelebrationPending = false;
      state.resultPreview = initialPreview === "share-fallback" ? "result-next-quiz" : initialPreview;
      state.screen = "result";
      render();
      return;
    }
    await validateInitialChallengeScore();
    if (initialRoute && state.screen === "setup") {
      applyRoute(initialRoute, { historyMode: "replace" });
      return;
    }
    if (state.screen !== "challenge-error" && state.screen !== "import") syncUrlState();
    render();
  }

  void initialize();
})();
