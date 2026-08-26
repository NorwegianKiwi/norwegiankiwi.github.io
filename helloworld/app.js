(function () {
  "use strict";

  const supportedLocales = ["nb", "en"];
  const initialUrl = new URL(window.location.href);
  const initialLocale = supportedLocales.includes(
    initialUrl.searchParams.get("lang"),
  )
    ? initialUrl.searchParams.get("lang")
    : "nb";
  const data = window.GEOGRAFI_QUIZ_DATA;
  const mapData = window.GEOGRAFI_QUIZ_MAP_DATA;
  const challenge = window.GEOGRAFI_CHALLENGE;
  const exploreState = window.GEOGRAFI_EXPLORE_STATE;
  const curriculum = window.GEOGRAFI_CURRICULUM;
  const progress = window.GEOGRAFI_PROGRESS;
  const app = document.getElementById("app");

  if (!data || !mapData || !challenge || !exploreState || !curriculum || !progress || !app) {
    throw new Error(
      initialLocale === "en"
        ? "Hello World! could not load the country data."
        : "Hei verden! kunne ikke laste landdataene.",
    );
  }

  const { countries: officialCountries, places = officialCountries, regionOptions } = data;
  const countries = places;
  const messages = Object.freeze({
    nb: Object.freeze({
      modeCountryFlagShort: "Flagg",
      modeFlagCountryShort: "Land",
      modeCountryCapitalShort: "Hovedsteder",
      modeMapCountryShort: "Kart",
      brandName: "Hei verden!",
      flagOf: "Flagget til {name}",
      homeLink: "Tilbake til lanceolav.com",
      brandTop: "Hei verden! – til toppen",
      brandHome: "Hei verden! – gå til forsiden",
      home: "Forsiden",
      languageGroup: "Velg språk",
      languageNb: "Norsk",
      languageEn: "English",
      countries: "{count} land",
      otherPlaces: "{count} andre steder",
      places: "{count} steder",
      placeBreakdown: "{countries} land · {otherPlaces} andre steder",
      countriesHeading: "Land",
      otherPlacesHeading: "Andre steder",
      otherCompactHeading: "Andre",
      establishedLocalFlag: "Etablert lokalt flagg",
      regionMapDescription:
        "Velg et område på kartet, eller bruk områdeknappene ved siden av.",
      interactiveWorldMap: "Interaktivt verdenskart",
      shrinkShape: "Forminsk landformen",
      enlargeShape: "Forstørr landformen",
      changeRegion: "Bytt region",
      exploreOnMap: "Utforsk {name} på kartet",
      backToResults: "Tilbake til resultatet",
      backToLevels: "Tilbake til nivåene",
      highlightedMap: "Kart over {region} med ett land uthevet",
      heroKicker: "Lek. Lær. Utforsk.",
      heroTitleBefore: "Verden",
      heroTitleEmphasis: "venter.",
      chooseActivity: "Velg aktivitet",
      testYourself: "Test deg selv",
      explore: "Utforsk",
      flagsLicence: "Flagg fra flag-icons · MIT",
      localFlagsLicence: "Lokale flagg · kildeinfo",
      globeLicence: "Jordklode fra Twemoji · CC BY 4.0",
      mapLicence: "Kart fra Natural Earth · public domain",
      installApp: "Legg til på Hjem-skjermen",
      installHelpTitle: "Legg til på Hjem-skjermen",
      installHelpText:
        "Trykk på Del i nettleseren, velg «Legg til på Hjem-skjermen», slå på «Åpne som webapp», og trykk «Legg til».",
      installSafariTitle: "Åpne i Safari",
      installSafariText:
        "Åpne denne siden i Safari for å legge den til på Hjem-skjermen. Trykk deretter på Del, velg «Legg til på Hjem-skjermen», slå på «Åpne som webapp», og trykk «Legg til».",
      closeInstallHelp: "Lukk",
      review: "Gjennomgang",
      reviewHeading: "{count} land å øve på",
      questionsLabel: "Spørsmål",
      startChallenge: "Start utfordringen",
      unverifiedScore:
        "Poengsummen i lenken kunne ikke bekreftes. Du kan fortsatt spille den samme runden.",
      invalidChallengeKicker: "Ugyldig utfordring",
      invalidChallengeTitle: "Denne utfordringslenken virker ikke.",
      invalidChallengeDescription:
        "Lenken mangler en gyldig quiz-ID, versjon eller revisjon.",
      challengeBeat: "Du slo resultatet på {target} poeng!",
      challengeTied: "Du matchet resultatet: {target} poeng.",
      challengePerfectTied:
        "Perfekt! Du matchet utfordringen med full poengsum.",
      challengeMissed:
        "Du fikk {score} poeng; resultatet å matche var {target}.",
      challengeLinkCopied: "Utfordringslenken er kopiert.",
      challengeShareFailed: "Kunne ikke dele eller kopiere lenken.",
      close: "Lukk",
      openChallenge: "Åpne utfordring",
      openChallengePrompt: "Har du fått en utfordring?",
      openChallengeDescription:
        "Lim inn hele utfordringslenken.",
      challengeInputLabel: "Utfordringslenke",
      challengeInputPlaceholder: "https://…",
      cancel: "Avbryt",
      challengeInputRequired: "Lim inn en utfordringslenke.",
      challengeUrlMalformed: "Dette er ikke en gyldig nettadresse.",
      challengeUrlWrongApp: "Lenken tilhører ikke denne geografiappen.",
      challengeUrlInvalid: "Dette er ikke en gyldig utfordringslenke.",
      chooseCountry: "Velg et sted",
      backToExplore: "Tilbake til Utforsk",
      flashcards: "Flashcards",
      exploreTheseCountries: "Utforsk disse stedene",
      missedCountries: "Steder å øve på",
      wholeWorld: "Hele verden",
      countryCapital: "{name}, hovedstad {capital}",
      interactiveRegionMap: "Interaktivt kart over {region}",
      countriesInRegion: "Steder i regionen",
      mapZoomControls: "Kartzoom",
      zoomOutMap: "Zoom ut på kartet",
      zoomInMap: "Zoom inn på kartet",
      resetMapZoom: "Tilbakestill kartzoom, {percent} prosent",
      africaOverview: "Afrika",
      viewAllAfrica: "Vis hele Afrika",
      showRegion: "Vis region",
      viewWorld: "Vis verden",
      mapAreaControls: "Bytt kartutsnitt",
      exploreMapHeading: "Hvilket kart vil du utforske?",
      chooseSingleRegion: "Velg en enkelt region",
      showCountryDetails: "Vis detaljer for {name}",
      countryDetails: "Stedsdetaljer: {name}",
      flashcardsComplete: "Flashcards fullført",
      roundComplete: "Runden er ferdig.",
      flashcardsSummaryBefore: "Du har gått gjennom",
      flashcardsSummaryAfter: "flagg fra",
      revealedFlashcard:
        "{name}, {capital}. Trykk for neste flagg.",
      hiddenFlashcard:
        "Flashcard {current} av {total}. Trykk for å vise svaret.",
      findFlag: "Finn flagget til",
      whichCountry: "Hvilket sted?",
      findCapital: "Finn hovedstaden til",
      option: "Alternativ {number}",
      flagOption: "Flaggalternativ {number}",
      correctContinue:
        "{label}, riktig svar. Trykk for å gå videre.",
      correctAnswer: "{label}, riktig svar",
      correctAnnouncement: "Riktig.",
      wrongAnnouncement:
        "Feil. Riktig svar er {answer}. Aktiver det markerte alternativet for å gå videre.",
      metaTitle: "Hei verden! – lær land, flagg, hovedsteder og kart",
      metaDescription:
        "Utforsk og test deg selv på 197 land og 30 andre steder, med flagg, hovedsteder og regionale kart.",
    }),
    en: Object.freeze({
      modeCountryFlagShort: "Flags",
      modeFlagCountryShort: "Countries",
      modeCountryCapitalShort: "Capitals",
      modeMapCountryShort: "Maps",
      brandName: "Hello World!",
      flagOf: "Flag of {name}",
      homeLink: "Back to lanceolav.com",
      brandTop: "Hello World! – back to top",
      brandHome: "Hello World! – go to the home page",
      home: "Home",
      languageGroup: "Choose language",
      languageNb: "Norsk",
      languageEn: "English",
      countries: "{count} {count, plural, one {country} other {countries}}",
      otherPlaces: "{count} {count, plural, one {other place} other {other places}}",
      places: "{count} places",
      placeBreakdown: "{countries} countries · {otherPlaces} other places",
      countriesHeading: "Countries",
      otherPlacesHeading: "Other places",
      otherCompactHeading: "Other",
      establishedLocalFlag: "Established local flag",
      regionMapDescription:
        "Choose an area on the map, or use the area buttons beside it.",
      interactiveWorldMap: "Interactive world map",
      shrinkShape: "Shrink the country shape",
      enlargeShape: "Enlarge the country shape",
      changeRegion: "Change region",
      exploreOnMap: "Explore {name} on the map",
      backToResults: "Back to results",
      backToLevels: "Back to levels",
      highlightedMap: "Map of {region} with one country highlighted",
      heroKicker: "Play. Learn. Explore.",
      heroTitleBefore: "The world",
      heroTitleEmphasis: "awaits.",
      chooseActivity: "Choose activity",
      testYourself: "Test yourself",
      explore: "Explore",
      flagsLicence: "Flags from flag-icons · MIT",
      localFlagsLicence: "Local flags · source details",
      globeLicence: "Globe from Twemoji · CC BY 4.0",
      mapLicence: "Maps from Natural Earth · public domain",
      installApp: "Add to Home Screen",
      installHelpTitle: "Add to Home Screen",
      installHelpText:
        "Tap Share in the browser, choose “Add to Home Screen”, turn on “Open as Web App”, and tap “Add”.",
      installSafariTitle: "Open in Safari",
      installSafariText:
        "Open this page in Safari to add it to your Home Screen. Then tap Share, choose “Add to Home Screen”, turn on “Open as Web App”, and tap “Add”.",
      closeInstallHelp: "Close",
      review: "Review",
      reviewHeading:
        "{count} {count, plural, one {country} other {countries}} to review",
      questionsLabel: "Questions",
      startChallenge: "Start challenge",
      unverifiedScore:
        "The score in this link could not be verified. You can still play the same round.",
      invalidChallengeKicker: "Invalid challenge",
      invalidChallengeTitle: "This challenge link does not work.",
      invalidChallengeDescription:
        "The link is missing a valid quiz ID, version, or revision.",
      challengeBeat: "You beat the score of {target}!",
      challengeTied: "You matched the score: {target}.",
      challengePerfectTied:
        "Perfect! You matched the challenge with a full score.",
      challengeMissed: "You scored {score}; the score to match was {target}.",
      challengeLinkCopied: "Challenge link copied.",
      challengeShareFailed: "Could not share or copy the link.",
      close: "Close",
      openChallenge: "Open challenge",
      openChallengePrompt: "Have you received a challenge?",
      openChallengeDescription:
        "Paste the complete challenge link.",
      challengeInputLabel: "Challenge link",
      challengeInputPlaceholder: "https://…",
      cancel: "Cancel",
      challengeInputRequired: "Paste a challenge link.",
      challengeUrlMalformed: "This is not a valid web address.",
      challengeUrlWrongApp: "This link does not belong to this geography app.",
      challengeUrlInvalid: "This is not a valid challenge link.",
      chooseCountry: "Choose a place",
      backToExplore: "Back to Explore",
      flashcards: "Flashcards",
      exploreTheseCountries: "Explore these places",
      missedCountries: "Places to revisit",
      wholeWorld: "Whole world",
      countryCapital: "{name}, capital {capital}",
      interactiveRegionMap: "Interactive map of {region}",
      countriesInRegion: "Places in the region",
      mapZoomControls: "Map zoom",
      zoomOutMap: "Zoom out of the map",
      zoomInMap: "Zoom into the map",
      resetMapZoom: "Reset map zoom, {percent} per cent",
      africaOverview: "Africa",
      viewAllAfrica: "View all Africa",
      showRegion: "Show region",
      viewWorld: "View world",
      mapAreaControls: "Change map area",
      exploreMapHeading: "Which map would you like to explore?",
      chooseSingleRegion: "Choose a single region",
      showCountryDetails: "Show details for {name}",
      countryDetails: "Place details: {name}",
      flashcardsComplete: "Flashcards complete",
      roundComplete: "The round is complete.",
      flashcardsSummaryBefore: "You have reviewed",
      flashcardsSummaryAfter: "flags from",
      revealedFlashcard:
        "{name}, {capital}. Press for the next flag.",
      hiddenFlashcard:
        "Flashcard {current} of {total}. Press to reveal the answer.",
      findFlag: "Find the flag of",
      whichCountry: "Which place?",
      findCapital: "Find the capital of",
      option: "Option {number}",
      flagOption: "Flag option {number}",
      correctContinue:
        "{label}, correct answer. Press to continue.",
      correctAnswer: "{label}, correct answer",
      correctAnnouncement: "Correct.",
      wrongAnnouncement:
        "Incorrect. The correct answer is {answer}. Activate the highlighted option to continue.",
      metaTitle: "Hello World! – learn countries, flags, capitals and maps",
      metaDescription:
        "Explore and test yourself on 197 countries and 30 other places, with flags, capitals and regional maps.",
    }),
  });
  const messageKeys = Object.keys(messages.nb);
  supportedLocales.forEach((locale) => {
    if (Object.keys(messages[locale]).length !== messageKeys.length) {
      throw new Error(`Unexpected ${locale} translation key`);
    }
    messageKeys.forEach((key) => {
      if (!messages[locale][key]) {
        throw new Error(`Missing ${locale} translation: ${key}`);
      }
    });
  });
  const progressionMessages = Object.freeze({
    nb: Object.freeze({
      startGame: "Start spillet", continueGame: "Fortsett spillet", exploreWorld: "Utforsk verden",
      viewLevels: "Se alle nivåer", levels: "Nivåer", level: "Nivå {number}",
      levelRange: "Nivå {start}–{end}",
      levelsMastered: "{count} av {total} nivåer mestret", quizzesMastered: "{count} av 4 quizer mestret",
      mastered: "mestret", unplayed: "Ikke spilt", recommended: "Anbefalt neste",
      profileMenu: "Profil og innstillinger", addProfile: "Legg til profil", renameProfile: "Gi profilen nytt navn",
      switchProfile: "Bytt profil", clearProgress: "Nullstill fremgang", deleteProfile: "Slett profil",
      clearConfirm: "Nullstille all spillfremgang for denne profilen?", deleteConfirm: "Slette denne profilen?",
      newProfileName: "Navn på ny profil", renamePrompt: "Nytt profilnavn", settings: "Innstillinger",
      transferProfile: "Overfør denne profilen", copyTransferLink: "Kopier overføringslenke",
      transferCopied: "Overføringslenken er kopiert.", transferFailed: "Kunne ikke kopiere lenken.",
      backupDevice: "Sikkerhetskopier denne enheten", downloadBackup: "Last ned sikkerhetskopi",
      importBackup: "Importer sikkerhetskopi", importProgress: "Importer fremgang?",
      createProfile: "Opprett profil", mergeProfile: "Slå sammen", mergeInto: "Slå sammen med {name}",
      importAll: "Importer alle profiler", importOne: "Importer", importCancel: "Avbryt",
      playedAndMastered: "{played} quizer spilt · {mastered} mestret", invalidImport: "Lenken eller sikkerhetskopien er ugyldig.",
      storageReadFailed: "Lagret fremgang kunne ikke leses. Du kan fortsatt utforske og spille.",
      storageWriteFailed: "Fremgangen kunne ikke lagres på denne enheten.",
      quizMastered: "Quiz mestret", quizNotMastered: "Ikke helt ennå", bestScore: "Beste resultat: {score}/{total}",
      nextQuiz: "Neste quiz", tryAgainAction: "Prøv igjen", playAgain: "Spill igjen",
      reviewCards: "Øv med flashcards", retryQuiz: "Prøv quizen igjen", backToLevel: "Tilbake til nivået",
      worldMastered: "Verden mestret", surpriseQuiz: "Overraskelsesquiz", chooseLevel: "Velg nivå",
      shareProgress: "Del fremgangen min", progressCopied: "Fremgangen er kopiert.", challengeThisQuiz: "Utfordre en venn",
      goToRecommended: "Gå til anbefalt neste quiz",
      cards: "Øv med flashcards", questionsLong: "{count} spørsmål · lang utfordring",
      resumeAttempt: "Fortsett lagret forsøk", abandonAttempt: "Et langt mestringsforsøk er lagret. Starte en annen quiz og forkaste forsøket?",
      savedAttempt: "Du har et lagret forsøk på {title}.", updatedQuizzes: "Noen quizer er oppdatert og klare til å spilles igjen.",
      challengeQuizTitle: "Quizutfordring", scoreToBeat: "Resultat å slå", approximateTime: "Omtrent {minutes} min",
      shareUnavailable: "Kunne ikke dele eller kopiere akkurat nå.", profilePrivacy: "Fremgangen lagres bare på denne enheten.",
    }),
    en: Object.freeze({
      startGame: "Start game", continueGame: "Continue game", exploreWorld: "Explore the world",
      viewLevels: "View all levels", levels: "Levels", level: "Level {number}",
      levelRange: "Levels {start}–{end}",
      levelsMastered: "{count} of {total} levels mastered", quizzesMastered: "{count} of 4 quizzes mastered",
      mastered: "mastered", unplayed: "Unplayed", recommended: "Recommended next",
      profileMenu: "Profile and settings", addProfile: "Add profile", renameProfile: "Rename profile",
      switchProfile: "Switch profile", clearProgress: "Clear progress", deleteProfile: "Delete profile",
      clearConfirm: "Clear all game progress for this profile?", deleteConfirm: "Delete this profile?",
      newProfileName: "New profile name", renamePrompt: "New profile name", settings: "Settings",
      transferProfile: "Transfer this profile", copyTransferLink: "Copy transfer link",
      transferCopied: "Transfer link copied.", transferFailed: "Could not copy the link.",
      backupDevice: "Back up this device", downloadBackup: "Download backup file",
      importBackup: "Import backup file", importProgress: "Import progress?",
      createProfile: "Create profile", mergeProfile: "Merge", mergeInto: "Merge with {name}",
      importAll: "Import all profiles", importOne: "Import", importCancel: "Cancel",
      playedAndMastered: "{played} quizzes played · {mastered} mastered", invalidImport: "This link or backup file is invalid.",
      storageReadFailed: "Saved progress could not be read. You can still explore and play.",
      storageWriteFailed: "Progress could not be saved on this device.",
      quizMastered: "Quiz mastered", quizNotMastered: "Not quite yet", bestScore: "Best score: {score}/{total}",
      nextQuiz: "Next quiz", tryAgainAction: "Try again", playAgain: "Play again",
      reviewCards: "Review with flashcards", retryQuiz: "Retry quiz", backToLevel: "Back to level",
      worldMastered: "World mastered", surpriseQuiz: "Surprise quiz", chooseLevel: "Choose a level",
      shareProgress: "Share my progress", progressCopied: "Progress copied.", challengeThisQuiz: "Challenge a friend",
      goToRecommended: "Go to the recommended next quiz",
      cards: "Practice with flashcards", questionsLong: "{count} questions · long challenge",
      resumeAttempt: "Resume saved attempt", abandonAttempt: "A long mastery attempt is saved. Start another quiz and abandon it?",
      savedAttempt: "You have a saved attempt for {title}.", updatedQuizzes: "Some quizzes were updated and are ready to play again.",
      challengeQuizTitle: "Quiz challenge", scoreToBeat: "Score to beat", approximateTime: "About {minutes} min",
      shareUnavailable: "Could not share or copy right now.", profilePrivacy: "Progress is stored only on this device.",
    }),
  });
  const mapSelectableRegions = [
    "europe",
    "north-west-africa",
    "east-south-africa",
    "west-central-asia",
    "east-south-asia",
    "oceania",
    "north-central-america",
    "south-america",
    "caribbean",
  ];
  const africaRegionIds = new Set([
    "north-west-africa",
    "east-south-africa",
  ]);
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

  let browserStorage = null;
  try { browserStorage = window.localStorage; } catch { browserStorage = null; }
  const loadedProgress = progress.loadStore(browserStorage, { defaultName: "Player 1" });
  let progressStore = loadedProgress.store;
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
    resultNewLevelMastery: false,
    profilePanelOpen: false,
    importProfiles: transferPreview,
    importError: transferError,
    selectedLevelId: null,
    flashcardReturn: "home",
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

  function t(key, values = {}) {
    let value = messages[state.locale][key] ?? progressionMessages[state.locale][key];
    if (!value) throw new Error(`Missing ${state.locale} translation: ${key}`);

    value = value.replace(
      /\{(\w+), plural, one \{([^{}]+)\} other \{([^{}]+)\}\}/g,
      (_match, variable, singular, plural) =>
        Number(values[variable]) === 1 ? singular : plural,
    );
    return value.replace(/\{(\w+)\}/g, (_match, variable) =>
      String(values[variable] ?? ""),
    );
  }

  function currentProfile() { return progress.activeProfile(progressStore); }
  function persist(nextStore) {
    progressStore = nextStore;
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
  function sectionForLevelIndex(levelIndex) {
    const levelNumber = levelIndex + 1;
    return curriculum.sections.find(
      (section) => levelNumber >= section.startLevel && levelNumber <= section.endLevel,
    ) ?? null;
  }
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

  function initialExploreMapExtent(countryCodes) {
    return exploreState.initialExtent(
      countryCodes,
      mapRegionForCode,
      africaRegionIds,
    );
  }

  function selectedRegion() {
    return regionsById.get(state.region);
  }

  function relationshipBadgeMarkup(country) {
    if (country.category !== "other-place") return "";
    if (country.relatedCountryCode) {
      return `<span class="relationship-badge" aria-hidden="true"><img src="./flags/${country.relatedCountryCode}.svg" alt="" draggable="false" /></span>`;
    }
    return `<span class="relationship-badge relationship-badge-special" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16"/></svg></span>`;
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
      : `<span class="relationship-chip-special" aria-hidden="true">◎</span>`;
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

  function actionFeedbackMarkup() {
    return `
      <span class="action-feedback-icon" aria-hidden="true"></span>
      <span class="sr-only action-feedback-announcement" aria-live="polite"></span>
    `;
  }

  function syncUrlState() {
    const url = new URL(window.location.href);
    url.search = "";
    if (state.locale === "en") url.searchParams.set("lang", "en");
    if (state.region !== "world" && !state.challengeActive) url.searchParams.set("region", state.region);
    if (state.challengeActive && state.curriculumQuizId) {
      const quiz = curriculumQuiz();
      url.searchParams.set("cv", "2");
      url.searchParams.set("quiz", state.curriculumQuizId);
      url.searchParams.set("rev", String(quiz?.revision ?? 1));
      if (state.challengeScoreParam !== null) url.searchParams.set("score", state.challengeScoreParam); else url.searchParams.delete("score");
      if (state.challengeProof !== null) url.searchParams.set("proof", state.challengeProof); else url.searchParams.delete("proof");
    }
    try {
      window.history.replaceState(null, "", url.href);
    } catch (error) {
      console.warn("Could not update the language and region URL.", error);
    }
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
    return `
      <circle
        class="${className}"
        cx="${marker.x}"
        cy="${marker.y}"
        r="${screenRadius}"
        data-map-marker-screen-radius="${screenRadius}"
        data-map-marker-code="${escapeHtml(marker.code)}"
        data-map-marker-readable-size="${marker.readableSize}"
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

  function regionalQuestionMapMarkup(regionId, targetCode) {
    const view = mapData.quizRegions[regionId];
    const region = regionsById.get(regionId);
    const markerRadius = 3;
    const contextFeatures = view.backgroundFeatures ?? view.features.filter(
      (feature) => mapRegionForCode(feature.code) !== regionId,
    );
    const regionFeatures = view.features.filter(
      (feature) =>
        mapRegionForCode(feature.code) === regionId &&
        feature.code !== targetCode,
    );
    const targetFeatures = view.features.filter(
      (feature) => feature.code === targetCode,
    );
    const regionMarkers = view.markers.filter(
      (marker) =>
        mapRegionForCode(marker.code) === regionId &&
        marker.code !== targetCode,
    );
    const targetMarkers = view.markers.filter(
      (marker) => marker.code === targetCode,
    );
    const locatorCodes = new Set(view.markers.map((marker) => marker.code));

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
    return `
      <div class="map-quiz-visual">
        <svg
          class="question-map"
          data-responsive-region-map
          data-base-view-box="${view.viewBox}"
          data-bleed-view-box="${view.bleedViewBox ?? view.viewBox}"
          viewBox="${view.viewBox}"
          role="img"
          aria-label="${escapeHtml(t("highlightedMap", { region: regionLabel(region) }))}"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect class="question-map-ocean" x="-10000" y="-10000" width="20000" height="20000" />
          <g aria-hidden="true">
            ${pathMarkup(contextFeatures, "question-map-country is-context")}
            ${pathMarkup(regionFeatures, "question-map-country")}
            ${markerMarkup(regionMarkers, "question-map-marker", markerRadius)}
            ${pathMarkup(targetFeatures, "question-map-target-halo")}
            ${pathMarkup(targetFeatures, "question-map-country is-target")}
            ${markerMarkup(
              targetMarkers,
              "question-map-marker is-target-halo",
              markerRadius * 2.8,
            )}
            ${markerMarkup(
              targetMarkers,
              "question-map-marker is-target",
              markerRadius * 1.35,
            )}
          </g>
        </svg>
        ${countrySilhouetteMarkup(targetCode)}
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
      isStandalone() ||
      (!isIosDevice() && deferredInstallPrompt === null)
    ) {
      return "";
    }

    return `
      <aside class="install-app-banner">
        <button
          class="install-app-button"
          type="button"
          data-action="install-app"
        >
          <img src="./favicon.svg" alt="" aria-hidden="true" draggable="false" />
          <span>${t("installApp")}</span>
        </button>
      </aside>
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
          <h2 id="open-challenge-title">${t("openChallengePrompt")}</h2>
          <p id="open-challenge-description">${t("openChallengeDescription")}</p>
          <form data-open-challenge-form novalidate>
            <label for="challenge-input">${t("challengeInputLabel")}</label>
            <input
              id="challenge-input"
              name="challenge-input"
              type="text"
              autocomplete="off"
              autocapitalize="characters"
              spellcheck="false"
              placeholder="${escapeHtml(t("challengeInputPlaceholder"))}"
              value="${escapeHtml(state.openChallengeValue)}"
              aria-describedby="open-challenge-error"
              ${state.openChallengeError ? 'aria-invalid="true"' : ""}
            />
            <p id="open-challenge-error" class="open-challenge-error" aria-live="polite">
              ${state.openChallengeError ? t(state.openChallengeError) : ""}
            </p>
            <div class="open-challenge-actions">
              <button class="primary-button" type="submit">${t("openChallenge")}</button>
              <button class="secondary-button" type="button" data-action="cancel-open-challenge">${t("cancel")}</button>
            </div>
          </form>
        </section>
      </div>
    `;
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
          <h3>${t("backupDevice")}</h3>
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
    return `<div class="progress-globe-wrap"><div class="progress-globe-achievement"><div class="progress-globe" style="--progress:${percentage}%" aria-hidden="true"><img class="progress-globe-base" src="./favicon.svg" alt="" /><img class="progress-globe-fill" src="./favicon.svg" alt="" /></div>${allMastered ? `<span class="mastery-trophy world-mastery-trophy" aria-hidden="true">🏆</span>` : ""}</div><strong>${t("levelsMastered", { count: summaryValue.masteredLevels, total: summaryValue.totalLevels })}</strong></div>`;
  }

  function setupMarkup() {
    const profile = currentProfile();
    const totals = progress.summary(profile, curriculum.levels);
    const next = progress.continueSelection(profile, curriculum.levels);
    const allMastered = next.type === "all-mastered";
    const quiz = allMastered ? null : curriculum.quizById.get(next.quiz.id);
    const level = quiz ? curriculum.levels[quiz.levelIndex] : null;
    const hasPlayed = totals.playedQuizzes > 0;
    const continueIcon = allMastered
      ? "✦"
      : hasPlayed && quiz
        ? sectionForLevelIndex(quiz.levelIndex)?.icon ?? "→"
        : "→";
    const hasUpdatedQuiz = curriculum.levels.some((candidateLevel) => candidateLevel.quizzes.some((baseQuiz) => {
      const quiz = curriculum.quizById.get(baseQuiz.id);
      const entry = profile.quizProgress?.[quiz.id];
      return entry && Object.keys(entry.revisions ?? {}).length > 0 && !entry.revisions[String(quiz.revision)];
    }));
    const savedAttempt = profile.savedMasteryAttempt;
    const savedQuiz = savedAttempt ? curriculum.quizById.get(savedAttempt.quizId) : null;
    const installAction = installActionMarkup();
    return `
      <div class="setup-page progression-home"><main class="site-shell setup-shell">
        <header class="brand-bar app-header app-header-sticky">${brandMarkup(false, false)}<div class="setup-header-actions">${profileControlMarkup()}${siteHomeLinkMarkup()}</div></header>
        ${storageWarning ? `<p class="storage-warning" role="status">${t(storageWarning)}</p>` : ""}
        ${hasUpdatedQuiz ? `<p class="storage-warning" role="status">${t("updatedQuizzes")}</p>` : ""}
        <section class="home-hero" id="top">
          <div><p class="kicker">${t("heroKicker")}</p><h1>${allMastered ? t("worldMastered") : `${t("heroTitleBefore")} <em>${t("heroTitleEmphasis")}</em>`}</h1></div>
          ${homeProgressMarkup(totals)}
        </section>
        ${savedQuiz ? `<section class="saved-attempt-card"><p>${t("savedAttempt", { title: levelTitle(curriculum.levelById.get(savedQuiz.levelId)) })}</p><button class="secondary-button" data-action="resume-mastery">${t("resumeAttempt")}</button></section>` : ""}
        <section class="home-primary-actions" aria-label="${escapeHtml(t("chooseActivity"))}">
          <button class="home-action-card continue-card" data-action="${allMastered ? "surprise-quiz" : "continue-game"}">
            <span class="home-action-icon" aria-hidden="true">${continueIcon}</span>
            <span><strong>${allMastered ? t("surpriseQuiz") : hasPlayed ? t("continueGame") : t("startGame")}</strong>
            ${quiz && hasPlayed ? `<small>${t("level", { number: quiz.levelIndex + 1 })} · ${escapeHtml(modeLabel(quiz.mode))}</small>` : ""}</span>
          </button>
          <button class="home-action-card explore-home-card" data-action="explore" data-value="map"><span class="home-action-icon" aria-hidden="true">◎</span><span><strong>${t("exploreWorld")}</strong><small>${t("places", { count: countries.length })}</small></span></button>
        </section>
        <nav class="home-secondary-actions" aria-label="${t("settings")}"><button class="secondary-button" data-action="levels">${allMastered ? t("chooseLevel") : t("viewLevels")}</button><button class="quiet-button action-feedback-button" data-action="share-progress">${t("shareProgress")}${actionFeedbackMarkup()}</button><button class="quiet-button" data-action="open-challenge">${t("openChallenge")}</button></nav>
        <footer><span class="copyright">&copy; 2026 Lance Olav Eastgate</span><span class="license-links"><a href="./licenses/flag-icons-MIT.txt">${t("flagsLicence")}</a><a href="./licenses/local-flags.txt">${t("localFlagsLicence")}</a><a href="./licenses/twemoji-CC-BY-4.0.txt">${t("globeLicence")}</a><a href="./licenses/natural-earth-public-domain.txt">${t("mapLicence")}</a></span></footer>
        ${profilePanelMarkup()}${installHelpMarkup()}${openChallengeMarkup()}
      </main>${installAction}</div>`;
  }

  function levelsMarkup() {
    const profile = currentProfile();
    const next = progress.continueSelection(profile, curriculum.levels);
    const recommendedLevelId = next.type === "quiz" ? next.quiz.levelId : null;
    const levelMarkup = (level, levelIndex) => {
        const value = progress.levelProgress(profile, level);
        const isMastery = level.kind.includes("mastery");
        const isRecommendedLevel = level.id === recommendedLevelId;
        return `<section class="level-card ${value.mastered === 4 ? "is-mastered" : value.played ? "is-progress" : "is-unplayed"} ${isRecommendedLevel ? "is-recommended-level" : ""}" id="level-${escapeHtml(level.id)}">
          <button class="level-heading" data-action="toggle-level" data-level-id="${level.id}" aria-expanded="${state.selectedLevelId === level.id}">
            <span class="level-number">${levelIndex + 1}</span><span><strong>${escapeHtml(levelTitle(level))}${isRecommendedLevel ? `<span class="sr-only"> · ${t("recommended")}</span>` : ""}</strong><small>${isMastery ? t("questionsLong", { count: level.countryCodes.length }) : placeCountLabel(level.countryCodes.map((code) => countriesByCode.get(code)).filter(Boolean))}</small></span>
            <span class="level-state">${value.mastered === 4 ? `<span class="level-mastery-status" aria-label="4/4 ${t("mastered")}"><span>4/4</span><span class="mastery-trophy" aria-hidden="true">🏆</span></span>` : value.played ? `${value.mastered}/4 ${t("mastered")}` : `<span class="unread-dot" aria-label="${t("unplayed")}"></span>`}</span>
          </button>
          ${state.selectedLevelId === level.id ? `<div class="quiz-list"><div class="level-practice-actions"><button class="level-practice-row" data-action="level-cards" data-level-id="${level.id}"><span class="level-practice-icon" aria-hidden="true"><span></span><span></span></span><span><strong>${t("cards")}</strong></span><span aria-hidden="true">→</span></button><button class="level-practice-row level-explore-row" data-action="explore-level" data-level-id="${level.id}"><span class="level-practice-map-icon" aria-hidden="true">◎</span><span><strong>${t("exploreTheseCountries")}</strong></span><span aria-hidden="true">→</span></button></div><div class="quiz-mode-list">${level.quizzes.map((baseQuiz) => {
            const quiz = curriculum.quizById.get(baseQuiz.id); const record = progress.currentRecord(profile, quiz); const status = progress.quizState(profile, quiz); const recommended = next.type === "quiz" && next.quiz.id === quiz.id;
            return `<button class="quiz-row ${recommended ? "is-recommended" : ""}" data-action="start-curriculum-quiz" data-quiz-id="${quiz.id}"><span>${escapeHtml(modeLabel(quiz.mode))}${recommended ? `<small>${t("recommended")}</small>` : ""}</span><span>${status === "mastered" ? `<span class="quiz-mastery-status" aria-label="${record.bestScore}/${record.total} · ${t("quizMastered")}"><span>${record.bestScore}/${record.total}</span><span class="mastery-check" aria-hidden="true">✓</span></span>` : status === "played" ? `${record.bestScore}/${record.total}` : `<span class="unread-dot" aria-label="${t("unplayed")}"></span>`}</span></button>`;
          }).join("")}</div></div>` : ""}
        </section>`;
      };
    const recommendedNavigation = recommendedLevelId
      ? `<button class="levels-recommended-float" data-action="show-recommended-next" aria-label="${escapeHtml(t("goToRecommended"))}" hidden><span class="recommended-next-arrow" aria-hidden="true">↓</span></button>`
      : "";
    return `<main class="site-shell levels-shell"><header class="quiz-header app-header app-header-sticky levels-header">${brandMarkup(true, false)}<h1 class="levels-header-title">${t("levels")}</h1><div class="levels-header-actions">${homeButtonMarkup()}</div></header>
      <div class="levels-list">${curriculum.sections.map((section) => {
        const headingId = `level-section-${section.id}`;
        return `<section class="level-section level-section-${escapeHtml(section.id)}" aria-labelledby="${headingId}">
          <header class="level-section-heading" id="${headingId}">
            <span class="level-section-icon" aria-hidden="true">${section.icon}</span>
            <span class="level-section-copy"><strong>${escapeHtml(section.title[state.locale])}</strong></span>
            <span class="level-section-range">${t("levelRange", { start: section.startLevel, end: section.endLevel })}</span>
          </header>
          <div class="level-section-list">${curriculum.levels.slice(section.startLevel - 1, section.endLevel).map((level, offset) => levelMarkup(level, section.startLevel - 1 + offset)).join("")}</div>
        </section>`;
      }).join("")}</div>${recommendedNavigation}</main>`;
  }

  function importMarkup() {
    if (state.importError || !state.importProfiles?.length) return `<main class="quiz-shell challenge-shell"><header class="quiz-header app-header app-header-sticky">${brandMarkup(true, false)}${homeButtonMarkup("cancel-import")}</header><section class="challenge-card"><h1>${t("invalidImport")}</h1><button class="primary-button" data-action="cancel-import">${t("home")}</button></section></main>`;
    return `<main class="quiz-shell challenge-shell"><header class="quiz-header app-header app-header-sticky">${brandMarkup(true, false)}${homeButtonMarkup("cancel-import")}</header><section class="challenge-card import-card"><p class="kicker">${t("importProgress")}</p><h1>${state.importProfiles.length === 1 ? escapeHtml(state.importProfiles[0].name) : t("backupDevice")}</h1>
      <div class="import-list">${state.importProfiles.map((profile, index) => { const totals = progress.summary(profile, curriculum.levels); return `<article><div><strong>${escapeHtml(profile.name)}</strong><span>${t("playedAndMastered", { played: totals.playedQuizzes, mastered: totals.masteredQuizzes })}</span></div><button class="secondary-button" data-action="import-one" data-import-index="${index}">${t("importOne")}</button></article>`; }).join("")}</div>
      <div class="import-actions">${state.importProfiles.length > 1 ? `<button class="primary-button" data-action="import-all">${t("importAll")}</button>` : `<button class="primary-button" data-action="create-imported-profile">${t("createProfile")}</button>${Object.values(progressStore.profiles).map((profile) => `<button class="secondary-button" data-action="merge-import" data-profile-id="${escapeHtml(profile.id)}">${t("mergeInto", { name: profile.name })}</button>`).join("")}`}<button class="quiet-button" data-action="cancel-import">${t("importCancel")}</button></div>
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
      <section class="challenge-card challenge-intro-card"><p class="kicker">${t("challengeQuizTitle")}</p><h1>${escapeHtml(levelTitle(level))}</h1>
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

  function curriculumResultMarkup() {
    const quiz = curriculumQuiz();
    const level = curriculumLevel();
    const perfect = state.score === state.questions.length;
    const record = progress.currentRecord(currentProfile(), quiz);
    const best = record?.bestScore ?? state.score;
    return `<main class="quiz-shell result-shell ${state.wrongAnswers.length ? "has-review" : ""}"><header class="quiz-header app-header app-header-sticky">${brandMarkup(true, false)}${homeButtonMarkup()}</header>
      <section class="result-card curriculum-result-card"><div class="result-summary-main"><p class="kicker">${escapeHtml(levelTitle(level))} · ${escapeHtml(modeLabel(quiz.mode))}</p><div class="result-mastery-title"><h1>${perfect ? t("quizMastered") : t("quizNotMastered")}</h1>${perfect ? `<span class="mastery-check result-mastery-check" aria-hidden="true">✓</span>` : ""}</div><div class="curriculum-result-score"><strong>${state.score}/${state.questions.length}</strong><span>${t("bestScore", { score: best, total: state.questions.length })}</span></div>${state.resultNewLevelMastery ? `<p class="level-mastered-callout" aria-label="${escapeHtml(levelTitle(level))} · 4/4 ${t("mastered")}"><span>${escapeHtml(levelTitle(level))} · 4/4</span><span class="mastery-trophy" aria-hidden="true">🏆</span></p>` : ""}${challengeComparisonMarkup()}</div>
      <div class="result-summary-support"><div class="result-actions"><div class="result-main-actions"><button class="primary-button" data-action="${perfect ? "next-curriculum-quiz" : "retry-curriculum-quiz"}">${perfect ? t("nextQuiz") : t("tryAgainAction")} <span aria-hidden="true">→</span></button><button class="secondary-button" data-action="${perfect ? "retry-curriculum-quiz" : "next-curriculum-quiz"}">${perfect ? t("playAgain") : t("nextQuiz")}</button></div><button class="secondary-button result-level-button" data-action="view-recommended-level">${t("chooseLevel")}</button></div>
      <div class="challenge-share-actions"><button class="quiet-button action-feedback-button" data-action="copy-curriculum-challenge">${t("challengeThisQuiz")}${actionFeedbackMarkup()}</button></div></div></section>${reviewMarkup()}</main>`;
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
    return `
      <div
        class="country-details-dialog"
        data-action="close-country-details"
        role="dialog"
        aria-modal="true"
        aria-labelledby="country-details-title"
        tabindex="-1"
      >
        <div class="country-details-card ${countryNote(country) || country.category === "other-place" ? "has-note" : ""}">
          ${flagMarkup(country, "country-details-flag", true, true)}
          <h2 id="country-details-title">
            <span class="sr-only">${escapeHtml(t("countryDetails", {
              name: countryName(country),
            }))}</span>
            <span aria-hidden="true">${escapeHtml(countryName(country))}</span>
          </h2>
          ${relationshipChipMarkup(country)}
          <dl class="place-centres">
            ${country.centres.map((centre) => `<div class="place-centre place-centre-${centre.kind}"><dt>${escapeHtml(centreRole(centre))}</dt><dd>${escapeHtml(centre.name[state.locale])}</dd></div>`).join("")}
          </dl>
          ${country.flagStatus === "established-local" ? `<p class="place-flag-status">${escapeHtml(t("establishedLocalFlag"))}</p>` : ""}
          ${
            countryNote(country)
              ? `<p class="country-note">${escapeHtml(countryNote(country))}</p>`
              : ""
          }
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

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function parseMapViewBox(viewBox) {
    const [x, y, width, height] = viewBox.split(/\s+/).map(Number);
    return { x, y, width, height };
  }

  function serializeMapViewBox(viewBox) {
    return [viewBox.x, viewBox.y, viewBox.width, viewBox.height].join(" ");
  }

  function mapViewBoxesEqual(first, second) {
    return ["x", "y", "width", "height"].every(
      (key) => Math.abs(first[key] - second[key]) < 0.01,
    );
  }

  function fitMapViewBoxToAspect(base, aspectRatio) {
    if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) return { ...base };
    let width = base.width;
    let height = base.height;
    if (width / height < aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }
    const centerX = base.x + base.width / 2;
    const centerY = base.y + base.height / 2;
    return {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    };
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

  function exploreMapZoom(viewport = state.exploreMapViewport) {
    return viewport ? viewport.base.width / viewport.view.width : 1;
  }

  function clampExploreMapView(view, base) {
    const width = clamp(
      view.width,
      base.width / exploreMapMaxZoom,
      base.width,
    );
    const height = clamp(
      view.height,
      base.height / exploreMapMaxZoom,
      base.height,
    );
    return {
      x: clamp(view.x, base.x, base.x + base.width - width),
      y: clamp(view.y, base.y, base.y + base.height - height),
      width,
      height,
    };
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

  function syncResponsiveRegionMaps() {
    responsiveMapFrame = null;
    app.querySelectorAll("[data-responsive-region-map]").forEach((svg) => {
      const bounds = svg.getBoundingClientRect();
      const base = parseMapViewBox(svg.dataset.baseViewBox);
      const fitted = fitMapViewBoxToAspect(
        base,
        bounds.width / Math.max(bounds.height, 1),
      );
      svg.setAttribute("viewBox", serializeMapViewBox(fitted));
      syncMapMarkerRadii(svg, fitted, bounds);
      syncRegionalMarkerHandoffs(svg, fitted, bounds);
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

  function normalizedExploreMapWheelDelta(event) {
    const unit =
      event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? window.innerHeight
          : 1;
    return clamp(event.deltaY * unit, -100, 100);
  }

  function zoomExploreMapFromWheel(event) {
    const delta = normalizedExploreMapWheelDelta(event);
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

  function mapPointerMidpoint(first, second) {
    return {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
    };
  }

  function mapPointerDistance(first, second) {
    return Math.hypot(second.x - first.x, second.y - first.y);
  }

  function screenPointToMap(point, inverseMatrix) {
    const svgPoint = new DOMPoint(point.x, point.y);
    return svgPoint.matrixTransform(inverseMatrix);
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
    return extent === "africa"
      ? mapData.overviewRegions.africa
      : mapData.quizRegions[extent];
  }

  function exploreMapExtentLabel(extent) {
    if (extent === "world") return t("wholeWorld");
    if (extent === "africa") return t("africaOverview");
    return regionLabel(regionsById.get(extent));
  }

  function exploreMapAreaControlsContentMarkup() {
    const extent = state.exploreMapExtent;
    const selectedRegion = mapRegionForCode(state.explorePinnedCode);
    const zoomInExtent = exploreState.zoomInExtent(
      extent,
      selectedRegion,
      africaRegionIds,
    );
    const zoomOutExtent = exploreState.zoomOutExtent(extent, africaRegionIds);
    const controls = [];
    if (zoomOutExtent !== extent) {
      controls.push(`<button type="button" class="secondary-button explore-map-scope-button" data-action="explore-map-area" data-value="${zoomOutExtent}"><span aria-hidden="true">−</span> ${escapeHtml(zoomOutExtent === "world" ? t("viewWorld") : t("viewAllAfrica"))}</button>`);
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
                <strong>${escapeHtml(scopeLabel)}</strong>
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
            ? `<button class="quiet-button home-button" data-action="back-from-explore"><span aria-hidden="true">←</span>${escapeHtml(t("backToResults"))}</button>`
            : state.exploreReturn?.screen === "levels"
              ? `<button class="quiet-button home-button" data-action="back-from-explore"><span aria-hidden="true">←</span>${escapeHtml(t("backToLevels"))}</button>`
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
    const scopeLabel =
      state.flashcardReturn === "explore"
        ? exploreScopeLabel()
        : regionLabel(region);
    const returnLabel = state.flashcardReturn === "explore"
      ? t("backToExplore")
      : state.flashcardReturn === "result"
        ? t("backToResults")
        : t("backToLevels");
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
              ${escapeHtml(scopeLabel)}.
            </p>
            <div class="flashcard-actions">
              <button class="primary-button" data-action="back-from-cards">${escapeHtml(returnLabel)}</button>
            </div>
          </section>
        </main>
      `;
    }

    const country = state.flashcards[state.flashcardIndex];
    const progress = ((state.flashcardIndex + 1) / state.flashcards.length) * 100;
    return `
      <main class="quiz-shell flashcard-shell">
        <header class="quiz-header app-header">
          ${brandMarkup(true, false)}
          <div class="quiz-meta">
            <span>${escapeHtml(scopeLabel)}</span>
            <strong>${state.flashcardIndex + 1} / ${state.flashcards.length}</strong>
          </div>
          <button class="quiet-button home-button" data-action="back-from-cards"><span aria-hidden="true">←</span>${escapeHtml(returnLabel)}</button>
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
              ? escapeHtml(`${t("revealedFlashcard", {
                  name: countryName(country),
                  capital: countryCapital(country),
                })}${country.category === "other-place" ? ` ${placeStatus(country)}.` : ""}`)
              : escapeHtml(t("hiddenFlashcard", {
                  current: state.flashcardIndex + 1,
                  total: state.flashcards.length,
                }))
          }"
        >
          ${flagMarkup(country, "flashcard-flag", state.flashcardRevealed, true)}
          <span class="flashcard-answer">
            ${state.flashcardRevealed
              ? `<strong>${escapeHtml(countryName(country))}</strong><span>${escapeHtml(countryCapital(country))}</span>${country.category === "other-place" ? `<span class="flashcard-relationship">${escapeHtml(placeStatus(country))}</span>` : ""}`
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
    const answered = state.answerStatus !== "unanswered";
    const progress = ((state.questionIndex + 1) / state.questions.length) * 100;

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
            ${regionalQuestionMapMarkup(state.curriculumQuizId ? question.country.region : state.region, question.country.code)}
            <div class="answer-grid ${gridClass}">
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
            <div class="answer-grid ${gridClass}">
              ${question.choices
                .map((choice, index) =>
                  answerMarkup(choice, index, question),
                )
                .join("")}
            </div>
          </div>
        `;

    return `
      <main class="quiz-shell quiz-active mode-${state.mode} ${keyboardHintsVisible ? "show-keyboard-hints" : ""}">
        <header class="quiz-header app-header app-header-mobile-sticky">
          ${brandMarkup(true, false)}
          <div class="quiz-meta">
            <span>${escapeHtml(levelTitle(curriculumLevel()))}</span>
            <strong>${state.questionIndex + 1} / ${state.questions.length}</strong>
          </div>
          ${homeButtonMarkup()}
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
        return curriculumResultMarkup();
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
    updateDocumentMetadata();
    app.innerHTML = screenMarkup();
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
        state.profilePanelOpen,
    );

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
  }

  function renderAtTop(options = {}) {
    render(options);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showRecommendedLevels(fallbackLevelId = state.activeLevelId) {
    const next = progress.continueSelection(
      currentProfile(),
      curriculum.levels,
    );
    const quiz = next.type === "quiz" ? next.quiz : null;
    const levelId = quiz?.levelId ?? fallbackLevelId ?? null;
    state.selectedLevelId = levelId;
    state.screen = "levels";
    if (!levelId) {
      renderAtTop();
      return;
    }
    render({
      focusLevelTarget: quiz ? { quizId: quiz.id } : { levelId },
    });
  }

  function clearAutoAdvance() {
    if (autoAdvanceTimer !== null) {
      window.clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
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
      africaRegionIds,
    );
    if (nextExtent !== extent) {
      state.exploreMapExtent = nextExtent;
      resetExploreMapInteraction();
      render({ focusCountryDetailsTriggerCode: code });
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

  function advanceQuestion() {
    clearAutoAdvance();
    setKeyboardHintsVisible(false);
    app.querySelector(".answer-card:focus")?.blur();
    state.silhouetteExpanded = false;
    if (state.questionIndex === state.questions.length - 1) {
      finishCurriculumAttempt();
      state.screen = "result";
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
    const before = progress.levelProgress(currentProfile(), level).mastered;
    progressStore = progress.recordResult(progressStore, progressStore.activeProfileId, quiz, state.score);
    if (isMasteryQuiz(quiz)) progressStore = progress.abandonMasteryAttempt(progressStore, progressStore.activeProfileId);
    persist(progressStore);
    state.resultBestScore = progress.currentRecord(currentProfile(), quiz)?.bestScore ?? state.score;
    state.resultNewLevelMastery = before < 4 && progress.levelProgress(currentProfile(), level).mastered === 4;
    state.resultRecorded = true;
  }

  function startCurriculumQuiz(quizId, { resume = false, challengeRound = false } = {}) {
    const quiz = curriculum.quizById.get(quizId);
    if (!quiz) return;
    const saved = currentProfile().savedMasteryAttempt;
    if (!resume && saved && !window.confirm(t("abandonAttempt"))) return;
    if (!resume && saved) persist(progress.abandonMasteryAttempt(progressStore, progressStore.activeProfileId));
    clearAutoAdvance(); setKeyboardHintsVisible(false);
    const level = curriculum.levelById.get(quiz.levelId);
    const savedAttempt = resume && saved?.quizId === quizId && saved.revision === quiz.revision ? saved : null;
    state.curriculumQuizId = quiz.id; state.activeLevelId = level.id; state.mode = quiz.mode;
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
    state.silhouetteExpanded = false; state.resultRecorded = false; state.resultNewLevelMastery = false;
    state.screen = "quiz";
    if (savedAttempt && savedAttempt.questionIndex >= state.questions.length && !savedAttempt.correctionPending) {
      state.questionIndex = state.questions.length - 1; state.resultRecorded = false; finishCurriculumAttempt(); state.screen = "result";
    }
    renderAtTop({ focusCorrect: state.answerStatus === "correction" });
  }

  function showExplore() {
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
    renderAtTop();
  }

  function contextualExploreScope(title, countryCodes) {
    return {
      kind: "contextual",
      title,
      countryCodes: exploreState.uniqueCodes(countryCodes).filter((code) =>
        countriesByCode.has(code),
      ),
    };
  }

  function localizedExploreTitle(key) {
    return { nb: messages.nb[key], en: messages.en[key] };
  }

  function showContextualExplore(scope, returnTarget, pinnedCode = null) {
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
    state.exploreScope = null;
    state.exploreReturn = null;
    state.countryDetailsCode = null;
    state.silhouetteExpanded = false;
    if (returnTarget?.screen === "result") {
      state.screen = "result";
      render({ focusReviewCode: returnTarget.reviewCode });
      return;
    }
    if (returnTarget?.screen === "levels") {
      showRecommendedLevels(returnTarget.levelId);
      return;
    }
    returnToSetup();
  }

  function closeCountryDetails() {
    const code = state.countryDetailsCode;
    state.countryDetailsCode = null;
    render({
      focusCountryDetailsTriggerCode: code,
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

  function normalizedAppPath(url) {
    const withoutIndex = url.pathname.replace(/\/index\.html$/, "/");
    return withoutIndex.endsWith("/") ? withoutIndex : `${withoutIndex}/`;
  }

  function openChallengeInput(value) {
    const trimmedValue = value.trim();
    state.openChallengeValue = trimmedValue;
    if (!trimmedValue) {
      state.openChallengeError = "challengeInputRequired";
      render({ focusOpenChallengeInput: true });
      return;
    }

    let sourceUrl;
    try {
      sourceUrl = new URL(trimmedValue);
    } catch {
      state.openChallengeError = "challengeUrlMalformed";
      render({
        focusOpenChallengeInput: true,
        selectOpenChallengeInput: true,
      });
      return;
    }

    const currentUrl = new URL(window.location.href);
    if (
      sourceUrl.origin !== currentUrl.origin ||
      normalizedAppPath(sourceUrl) !== normalizedAppPath(currentUrl)
    ) {
      state.openChallengeError = "challengeUrlWrongApp";
      render({
        focusOpenChallengeInput: true,
        selectOpenChallengeInput: true,
      });
      return;
    }

    const recipe = challenge.readUrl(sourceUrl, curriculum.quizById);
    if (!recipe?.valid) {
      state.openChallengeError = "challengeUrlInvalid";
      render({
        focusOpenChallengeInput: true,
        selectOpenChallengeInput: true,
      });
      return;
    }

    const locale = sourceUrl.searchParams.get("lang") === "en" ? "en" : "nb";
    window.location.assign(challenge.createUrl(window.location.href, {
      quizId: recipe.quizId,
      revision: recipe.revision,
      score: recipe.scoreParam,
      proof: recipe.proof,
    }, locale));
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

  async function shareWithClipboardFallback(control, shareData, copyValue, copiedKey, failedKey) {
    beginActionFeedback(control);
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        clearActionFeedback(control);
        return;
      } catch (error) {
        if (error?.name === "AbortError") {
          clearActionFeedback(control);
          return;
        }
      }
    }
    try {
      await copyText(copyValue);
      showCopiedFeedback(control, copiedKey);
    } catch {
      showActionFeedbackError(control, failedKey);
    }
  }

  async function copyTransferLink(control) {
    const url = new URL(window.location.href);
    url.search = state.locale === "en" ? "?lang=en" : "";
    url.hash = `progress=${progress.encodeTransfer(currentProfile())}`;
    await copyWithFeedback(control, url.href, "transferCopied", "transferFailed");
  }

  async function copyProgressShare(control) {
    const totals = progress.summary(currentProfile(), curriculum.levels);
    const url = new URL(window.location.href); url.search = state.locale === "en" ? "?lang=en" : ""; url.hash = "";
    const text = totals.masteredQuizzes === totals.totalQuizzes
      ? `${state.locale === "en" ? `I have mastered all ${totals.totalQuizzes} geography quizzes in Hello World!` : `Jeg har mestret alle ${totals.totalQuizzes} geografiquizene i Hei verden!`}\n${url.href}`
      : `${state.locale === "en" ? `I have mastered ${totals.masteredLevels} of ${totals.totalLevels} levels in Hello World!` : `Jeg har mestret ${totals.masteredLevels} av ${totals.totalLevels} nivåer i Hei verden!`}\n${url.href}`;
    await shareWithClipboardFallback(
      control,
      { title: t("brandName"), text },
      text,
      "progressCopied",
      "shareUnavailable",
    );
  }

  async function copyCurriculumChallenge(control) {
    const quiz = curriculumQuiz(); if (!quiz) return;
    beginActionFeedback(control);
    try {
      const recipe = { quizId: quiz.id, revision: quiz.revision, score: state.score };
      const proof = await challenge.createScoreProof(recipe);
      const url = challenge.createUrl(window.location.href, { ...recipe, proof }, state.locale);
      const level = curriculumLevel();
      const message = `${levelTitle(level)} · ${modeLabel(quiz.mode)}\n${state.score}/${quiz.countryCodes.length} · ${t("approximateTime", { minutes: Math.max(2, Math.ceil(quiz.countryCodes.length / 4)) })}\n${url.href}`;
      await shareWithClipboardFallback(
        control,
        { title: t("challengeQuizTitle"), text: message },
        message,
        "challengeLinkCopied",
        "challengeShareFailed",
      );
    } catch {
      showActionFeedbackError(control, "challengeShareFailed");
    }
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
    clearTransferFragment();
    state.screen = "setup";
    renderAtTop();
  }

  function importSingleProfile(imported) {
    const nextStore = progressStore.profiles[imported.id]
      ? progress.mergeInto(progressStore, imported.id, imported)
      : progress.importAsNew(progressStore, imported);
    finishImport(nextStore);
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
  ) {
    state.flashcards = flashcards;
    state.flashcardIndex = 0;
    state.flashcardRevealed = false;
    state.flashcardReturn = returnTarget;
    state.countryDetailsCode = null;
    state.screen = "flashcards";
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

  function returnToSetup() {
    clearAutoAdvance();
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
    resetExploreCountryState();
    syncUrlState();
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
      showRecommendedLevels();
      return;
    }
    if (action === "toggle-level") {
      state.selectedLevelId =
        state.selectedLevelId === control.dataset.levelId
          ? null
          : control.dataset.levelId;
      render();
      return;
    }
    if (action === "start-curriculum-quiz") {
      startCurriculumQuiz(control.dataset.quizId);
      return;
    }
    if (action === "retry-curriculum-quiz") {
      startCurriculumQuiz(state.curriculumQuizId);
      return;
    }
    if (action === "next-curriculum-quiz") {
      const quiz = progress.nextUnmastered(
        currentProfile(),
        curriculum.levels,
        state.curriculumQuizId,
      );
      if (quiz) startCurriculumQuiz(quiz.id);
      else returnToSetup();
      return;
    }
    if (action === "view-recommended-level") {
      showRecommendedLevels();
      return;
    }
    if (action === "resume-mastery") {
      const saved = currentProfile().savedMasteryAttempt;
      if (saved) startCurriculumQuiz(saved.quizId, { resume: true });
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
        contextualExploreScope(level.title, level.countryCodes),
        { screen: "levels", levelId: level.id },
      );
      return;
    }
    if (action === "back-from-cards") {
      if (state.flashcardReturn === "explore") {
        state.screen = "explore";
        render({ focusExploreFlashcards: true });
      } else if (state.flashcardReturn === "result") {
        state.screen = "result";
        render({ focusResultFlashcards: true });
      } else {
        showRecommendedLevels(state.activeLevelId);
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
    if (action === "add-profile") { const name = window.prompt(t("newProfileName")); if (name !== null) { persist(progress.addProfile(progressStore, name)); state.profilePanelOpen = false; renderAtTop(); } return; }
    if (action === "rename-profile") { const name = window.prompt(t("renamePrompt"), currentProfile().name); if (name !== null) { persist(progress.renameProfile(progressStore, progressStore.activeProfileId, name)); render({ focusProfilePanel: true }); } return; }
    if (action === "clear-profile") { if (window.confirm(t("clearConfirm"))) { persist(progress.clearProgress(progressStore, progressStore.activeProfileId)); state.profilePanelOpen = false; renderAtTop(); } return; }
    if (action === "delete-profile") { if (window.confirm(t("deleteConfirm"))) { persist(progress.deleteProfile(progressStore, progressStore.activeProfileId)); state.profilePanelOpen = false; renderAtTop(); } return; }
    if (action === "copy-transfer") { void copyTransferLink(control); return; }
    if (action === "download-backup") { downloadBackup(); return; }
    if (action === "share-progress") { void copyProgressShare(control); return; }
    if (action === "copy-curriculum-challenge") { void copyCurriculumChallenge(control); return; }
    if (action === "create-imported-profile") { if (state.importProfiles?.[0]) importSingleProfile(state.importProfiles[0]); return; }
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
    if (action === "cancel-import") { state.importProfiles = null; state.importError = false; clearTransferFragment(); state.screen = "setup"; renderAtTop(); return; }

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
      state.exploreMapExtent = state.region;
      resetExploreCountryState();
      state.exploreRegionPickerOpen = false;
      render({ focusExploreHeading: true });
      return;
    }

    if (action === "explore-map-area") {
      const extent = control.dataset.value;
      if (
        extent !== "world" &&
        extent !== "africa" &&
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
      render({ focusCountryDetails: true });
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
      returnToSetup();
    }
  });

  app.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-open-challenge-form]");
    if (!form || !app.contains(form)) return;
    event.preventDefault();
    openChallengeInput(
      form.elements.namedItem("challenge-input")?.value ?? "",
    );
  });

  app.addEventListener("change", async (event) => {
    if (!event.target.matches?.("[data-backup-input]") || !event.target.files?.[0]) return;
    try {
      state.importProfiles = progress.parseBackup(await event.target.files[0].text());
      state.importError = false; state.profilePanelOpen = false; state.screen = "import"; renderAtTop();
    } catch { state.importProfiles = null; state.importError = true; state.profilePanelOpen = false; state.screen = "import"; renderAtTop(); }
  });

  app.addEventListener("keydown", (event) => {
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
    if (state.screen === "explore" && !state.exploreRegionPickerOpen) {
      scheduleExploreMapZoomUi();
    }
  });

  window.addEventListener("scroll", scheduleRecommendedNavigationUpdate, { passive: true });

  app.addEventListener(
    "scroll",
    (event) => {
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
    const activeDialog = state.openChallengeOpen
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
          ]
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
    event.preventDefault();
    deferredInstallPrompt = event;
    if (state.screen === "setup" && !isStandalone()) render();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    state.installHelpOpen = false;
    if (state.screen === "setup") render();
  });

  async function initialize() {
    await validateInitialChallengeScore();
    if (state.screen !== "challenge-error") syncUrlState();
    render();
  }

  void initialize();
})();
