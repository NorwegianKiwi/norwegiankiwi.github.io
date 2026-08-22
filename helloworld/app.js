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
  const curriculum = window.GEOGRAFI_CURRICULUM;
  const progress = window.GEOGRAFI_PROGRESS;
  const app = document.getElementById("app");

  if (!data || !mapData || !challenge || !curriculum || !progress || !app) {
    throw new Error(
      initialLocale === "en"
        ? "Hello World! could not load the country data."
        : "Hei verden! kunne ikke laste landdataene.",
    );
  }

  const { countries, regionOptions } = data;
  const messages = Object.freeze({
    nb: Object.freeze({
      loadError: "Hei verden! kunne ikke laste landdataene.",
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
      worldSentence: "hele verden",
      countries: "{count} land",
      regionMapDescription:
        "Velg et område på kartet, eller bruk områdeknappene ved siden av.",
      interactiveWorldMap: "Interaktivt verdenskart",
      shrinkShape: "Forminsk landformen",
      enlargeShape: "Forstørr landformen",
      highlightedMap: "Kart over {region} med ett land uthevet",
      heroKicker: "Lek. Lær. Utforsk.",
      heroTitleBefore: "Verden",
      heroTitleEmphasis: "venter.",
      chooseActivity: "Velg aktivitet",
      testYourself: "Test deg selv",
      explore: "Utforsk",
      exploreCountries: "Utforsk land",
      flagsLicence: "Flagg fra flag-icons · MIT",
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
      reviewHeading: "Dette kan du øve mer på",
      reviewCount: "{count} land å se nærmere på.",
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
      challengeShareFailed: "Kunne ikke dele lenken. Prøv å kopiere den.",
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
      chooseCountry: "Velg et land",
      countryCapital: "{name}, hovedstad {capital}",
      interactiveRegionMap: "Interaktivt kart over {region}",
      countriesInRegion: "Land i regionen",
      mapZoomControls: "Kartzoom",
      zoomOutMap: "Zoom ut på kartet",
      zoomInMap: "Zoom inn på kartet",
      resetMapZoom: "Tilbakestill kartzoom, {percent} prosent",
      africaOverview: "Afrika",
      viewAllAfrica: "Vis hele Afrika",
      showSelectedRegion: "Vis {region}",
      exploreMapDescription:
        "Regionkartet viser plasseringen og formen til hvert land.",
      exploreMapHeading: "Hvilket kart vil du utforske?",
      chooseSingleRegion: "Velg en enkelt region",
      tableFlag: "Flagg",
      tableCountry: "Land",
      tableCapital: "Hovedstad",
      showLargeFlag: "Vis flagget til {name} stort",
      largeFlag: "Stort flagg: {name}",
      flashcardsComplete: "Flashcards fullført",
      roundComplete: "Runden er ferdig.",
      flashcardsSummaryBefore: "Du har gått gjennom",
      flashcardsSummaryAfter: "flagg fra",
      restart: "Start på nytt",
      nextFlag: "Trykk igjen for neste flagg",
      revealInstruction:
        "Tenk på landet og hovedstaden – trykk for å se svaret",
      revealedFlashcard:
        "{name}, {capital}. Trykk for neste flagg.",
      hiddenFlashcard:
        "Flashcard {current} av {total}. Trykk for å vise svaret.",
      findFlag: "Finn flagget til",
      whichCountry: "Hvilket land?",
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
        "Utforsk og test deg selv på 196 land, flagg, hovedsteder og regionale kart.",
    }),
    en: Object.freeze({
      loadError: "Hello World! could not load the country data.",
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
      worldSentence: "the whole world",
      countries: "{count} {count, plural, one {country} other {countries}}",
      regionMapDescription:
        "Choose an area on the map, or use the area buttons beside it.",
      interactiveWorldMap: "Interactive world map",
      shrinkShape: "Shrink the country shape",
      enlargeShape: "Enlarge the country shape",
      highlightedMap: "Map of {region} with one country highlighted",
      heroKicker: "Play. Learn. Explore.",
      heroTitleBefore: "The world",
      heroTitleEmphasis: "awaits.",
      chooseActivity: "Choose activity",
      testYourself: "Test yourself",
      explore: "Explore",
      exploreCountries: "Explore countries",
      flagsLicence: "Flags from flag-icons · MIT",
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
      reviewHeading: "Here is what you can practise",
      reviewCount:
        "{count} {count, plural, one {country} other {countries}} to revisit.",
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
      challengeShareFailed: "Could not share the link. Try copying it instead.",
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
      chooseCountry: "Choose a country",
      countryCapital: "{name}, capital {capital}",
      interactiveRegionMap: "Interactive map of {region}",
      countriesInRegion: "Countries in the region",
      mapZoomControls: "Map zoom",
      zoomOutMap: "Zoom out of the map",
      zoomInMap: "Zoom into the map",
      resetMapZoom: "Reset map zoom, {percent} per cent",
      africaOverview: "Africa",
      viewAllAfrica: "View all Africa",
      showSelectedRegion: "Show {region}",
      exploreMapDescription:
        "The regional map shows the location and shape of each country.",
      exploreMapHeading: "Which map would you like to explore?",
      chooseSingleRegion: "Choose a single region",
      tableFlag: "Flag",
      tableCountry: "Country",
      tableCapital: "Capital",
      showLargeFlag: "Show a large flag of {name}",
      largeFlag: "Large flag: {name}",
      flashcardsComplete: "Flashcards complete",
      roundComplete: "The round is complete.",
      flashcardsSummaryBefore: "You have reviewed",
      flashcardsSummaryAfter: "flags from",
      restart: "Start again",
      nextFlag: "Press again for the next flag",
      revealInstruction:
        "Think of the country and its capital – press to reveal the answer",
      revealedFlashcard:
        "{name}, {capital}. Press for the next flag.",
      hiddenFlashcard:
        "Flashcard {current} of {total}. Press to reveal the answer.",
      findFlag: "Find the flag of",
      whichCountry: "Which country?",
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
        "Explore and test yourself on 196 countries, flags, capitals and regional maps.",
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
      levelsMastered: "{count} av 47 nivåer mestret", quizzesMastered: "{count} av 4 quizer mestret",
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
      nextQuiz: "Neste quiz", tryAgainAction: "Prøv igjen", playAgain: "Spill igjen", viewLevel: "Se nivå",
      reviewCards: "Repeter disse kortene", retryQuiz: "Prøv quizen igjen", backToLevel: "Tilbake til nivået",
      worldMastered: "Verden mestret", surpriseQuiz: "Spill en overraskelsesquiz", chooseLevel: "Velg nivå",
      shareProgress: "Del fremgangen min", progressCopied: "Fremgangen er kopiert.", challengeThisQuiz: "Utfordre noen",
      cards: "Kort", mapsView: "Kart", listView: "Liste", revealCard: "Vis svar", nextCard: "Neste kort",
      cardsComplete: "Kortstokken er ferdig", questionsLong: "{count} spørsmål · lang utfordring",
      resumeAttempt: "Fortsett lagret forsøk", abandonAttempt: "Et langt mestringsforsøk er lagret. Starte en annen quiz og forkaste forsøket?",
      savedAttempt: "Du har et lagret forsøk på {title}.", updatedQuizzes: "Noen quizer er oppdatert og klare til å spilles igjen.",
      challengeQuizTitle: "Quizutfordring", scoreToBeat: "Resultat å slå", approximateTime: "Omtrent {minutes} min",
      shareUnavailable: "Deling er ikke tilgjengelig akkurat nå.", profilePrivacy: "Fremgangen lagres bare på denne enheten.",
    }),
    en: Object.freeze({
      startGame: "Start game", continueGame: "Continue game", exploreWorld: "Explore the world",
      viewLevels: "View all levels", levels: "Levels", level: "Level {number}",
      levelsMastered: "{count} of 47 levels mastered", quizzesMastered: "{count} of 4 quizzes mastered",
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
      nextQuiz: "Next quiz", tryAgainAction: "Try again", playAgain: "Play again", viewLevel: "View level",
      reviewCards: "Review these cards", retryQuiz: "Retry quiz", backToLevel: "Back to level",
      worldMastered: "World mastered", surpriseQuiz: "Play a surprise quiz", chooseLevel: "Choose a level",
      shareProgress: "Share my progress", progressCopied: "Progress copied.", challengeThisQuiz: "Challenge this quiz",
      cards: "Cards", mapsView: "Map", listView: "List", revealCard: "Reveal answer", nextCard: "Next card",
      cardsComplete: "Card deck complete", questionsLong: "{count} questions · long challenge",
      resumeAttempt: "Resume saved attempt", abandonAttempt: "A long mastery attempt is saved. Start another quiz and abandon it?",
      savedAttempt: "You have a saved attempt for {title}.", updatedQuizzes: "Some quizzes were updated and are ready to play again.",
      challengeQuizTitle: "Quiz challenge", scoreToBeat: "Score to beat", approximateTime: "About {minutes} min",
      shareUnavailable: "Sharing is not available right now.", profilePrivacy: "Progress is stored only on this device.",
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
      tone: "coral",
    },
    {
      id: "flag-country",
      shortLabelKey: "modeFlagCountryShort",
      tone: "green",
      choiceCount: 6,
    },
    {
      id: "country-capital",
      shortLabelKey: "modeCountryCapitalShort",
      tone: "gold",
      choiceCount: 6,
    },
    {
      id: "map-country",
      shortLabelKey: "modeMapCountryShort",
      tone: "map",
      choiceCount: 6,
    },
  ];

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
    region: regionOptions.some(
            (region) => region.id === initialUrl.searchParams.get("region"),
          )
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
    shareStatus: null,
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
    modalCode: null,
    installHelpOpen: false,
    openChallengeOpen: false,
    openChallengeValue: "",
    openChallengeError: null,
    exploreScrollTop: 0,
    exploreView: "map",
    explorePinnedCode: null,
    explorePreviewCode: null,
    exploreMapViewport: null,
    exploreMapOverview: null,
  };
  let deferredInstallPrompt = null;
  let autoAdvanceTimer = null;
  let keyboardHintsVisible = false;
  const exploreMapPointers = new Map();
  let exploreMapGesture = null;
  let exploreMapDrag = null;
  let exploreMapUiFrame = null;
  let responsiveMapFrame = null;
  let scrollAffordanceFrame = null;
  let suppressExploreMapClickUntil = 0;
  const exploreMapMaxZoom = 8;
  const exploreMapZoomLevels = [1, 1.5, 2, 3, 4, 6, 8];
  const exploreMapGeometryShowSize = 5; // Codex originally set this to 12
  const exploreMapGeometryHideSize = 5; // Codex originally set this to 10
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
  function modeLabel(modeId) {
    const mode = modes.find((candidate) => candidate.id === modeId);
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
    if (state.exploreMapOverview === "africa") {
      return countries.filter((country) => africaRegionIds.has(country.region));
    }
    return countriesInRegion(state.region);
  }

  function selectedRegion() {
    return regionOptions.find((region) => region.id === state.region);
  }

  function regionLabelInSentence(region) {
    return region.id === "world" ? t("worldSentence") : regionLabel(region);
  }

  function flagMarkup(country, className = "", revealName = false) {
    const name = escapeHtml(countryName(country));
    const alt = revealName ? escapeHtml(t("flagOf", { name })) : "";
    const lazy = className === "table-flag" ? ' loading="lazy"' : "";
    return `
      <span class="flag-frame flag-code-${country.code} ${className}">
        <img class="flag" src="./flags/${country.code}.svg" alt="${alt}" draggable="false"${lazy} />
      </span>
    `;
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
    return regionMatches(region, state.region);
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

  function mapRegionMarkup(regionId) {
    const region = regionOptions.find((option) => option.id === regionId);
    const count = countriesInRegion(regionId).length;
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
        data-action="map-region"
        data-value="${regionId}"
        data-map-region="${regionId}"
        role="button"
        tabindex="0"
        aria-label="${escapeHtml(`${regionLabel(region)}, ${countryCount(count)}`)}"
      >
        ${paths}
        ${markers}
      </g>
    `;
  }

  function worldMapMarkup() {
    const contextPaths = mapData.features
      .filter((feature) => mapRegionForCode(feature.code) === null)
      .map(mapPathMarkup)
      .join("");

    return `
      <div class="region-map-card">
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
          <rect class="map-ocean" width="1000" height="500" rx="26" />
          <g class="map-context" aria-hidden="true">${contextPaths}</g>
          ${mapSelectableRegions.map(mapRegionMarkup).join("")}
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
      .map(
        (point) => `
          <path
            class="country-silhouette-capital"
            d="${silhouetteCapitalPath(point)}"
          />
        `,
      )
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
    const region = regionOptions.find((option) => option.id === regionId);
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
          <button class="primary-button" data-action="copy-transfer">${t("copyTransferLink")}</button>
          <p class="profile-status" aria-live="polite">${state.shareStatus ? t(state.shareStatus) : ""}</p>
          <h3>${t("backupDevice")}</h3>
          <div class="profile-actions">
            <button class="secondary-button" data-action="download-backup">${t("downloadBackup")}</button>
            <label class="secondary-button file-button">${t("importBackup")}<input type="file" accept="application/json,.json,.hello-world-backup" data-backup-input /></label>
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
    return `<div class="progress-globe-wrap"><div class="progress-globe" style="--progress:${percentage}%" aria-hidden="true"><img class="progress-globe-base" src="./favicon.svg" alt="" /><span class="progress-globe-fill"><img src="./favicon.svg" alt="" /></span></div><strong>${t("levelsMastered", { count: summaryValue.masteredLevels })}</strong></div>`;
  }

  function setupMarkup() {
    const profile = currentProfile();
    const totals = progress.summary(profile, curriculum.levels);
    const next = progress.continueSelection(profile, curriculum.levels);
    const allMastered = next.type === "all-mastered";
    const quiz = allMastered ? null : curriculum.quizById.get(next.quiz.id);
    const level = quiz ? curriculum.levels[quiz.levelIndex] : null;
    const levelValue = level ? progress.levelProgress(profile, level) : null;
    const hasPlayed = totals.playedQuizzes > 0;
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
        <header class="brand-bar">${brandMarkup(false, false)}<div class="setup-header-actions">${profileControlMarkup()}${siteHomeLinkMarkup()}</div></header>
        ${storageWarning ? `<p class="storage-warning" role="status">${t(storageWarning)}</p>` : ""}
        ${hasUpdatedQuiz ? `<p class="storage-warning" role="status">${t("updatedQuizzes")}</p>` : ""}
        <section class="home-hero" id="top">
          <div><p class="kicker">${t("heroKicker")}</p><h1>${allMastered ? t("worldMastered") : `${t("heroTitleBefore")} <em>${t("heroTitleEmphasis")}</em>`}</h1></div>
          ${homeProgressMarkup(totals)}
        </section>
        ${savedQuiz ? `<section class="saved-attempt-card"><p>${t("savedAttempt", { title: levelTitle(curriculum.levelById.get(savedQuiz.levelId)) })}</p><button class="secondary-button" data-action="resume-mastery">${t("resumeAttempt")}</button></section>` : ""}
        <section class="home-primary-actions" aria-label="${escapeHtml(t("chooseActivity"))}">
          <button class="home-action-card continue-card" data-action="${allMastered ? "surprise-quiz" : "continue-game"}">
            <span class="home-action-icon" aria-hidden="true">${allMastered ? "✦" : "→"}</span>
            <span><strong>${allMastered ? t("surpriseQuiz") : hasPlayed ? t("continueGame") : t("startGame")}</strong>
            ${quiz ? `<small>${t("level", { number: quiz.levelIndex + 1 })} · ${escapeHtml(levelTitle(level))}<br>${escapeHtml(modeLabel(quiz.mode))} · ${levelValue.mastered}/4 ${t("mastered")}</small>` : `<small>47 / 47 · 188 / 188</small>`}</span>
          </button>
          <button class="home-action-card explore-home-card" data-action="explore" data-value="map"><span class="home-action-icon" aria-hidden="true">◎</span><span><strong>${t("exploreWorld")}</strong><small>${countryCount(196)}</small></span></button>
        </section>
        <nav class="home-secondary-actions" aria-label="${t("settings")}"><button class="secondary-button" data-action="levels">${allMastered ? t("chooseLevel") : t("viewLevels")}</button><button class="quiet-button" data-action="share-progress">${t("shareProgress")}</button><button class="quiet-button" data-action="open-challenge">${t("openChallenge")}</button></nav>
        <footer><span class="copyright">&copy; 2026 Lance Olav Eastgate</span><span class="license-links"><a href="./licenses/flag-icons-MIT.txt">${t("flagsLicence")}</a><a href="./licenses/twemoji-CC-BY-4.0.txt">${t("globeLicence")}</a><a href="./licenses/natural-earth-public-domain.txt">${t("mapLicence")}</a></span></footer>
        ${profilePanelMarkup()}${installHelpMarkup()}${openChallengeMarkup()}
      </main>${installAction}</div>`;
  }

  function levelsMarkup() {
    const profile = currentProfile();
    const next = progress.continueSelection(profile, curriculum.levels);
    return `<main class="site-shell levels-shell"><header class="quiz-header">${brandMarkup(true, false)}<h1>${t("levels")}</h1>${homeButtonMarkup()}</header>
      <div class="levels-list">${curriculum.levels.map((level, levelIndex) => {
        const value = progress.levelProgress(profile, level);
        const isMastery = level.kind.includes("mastery");
        return `<section class="level-card ${value.mastered === 4 ? "is-mastered" : value.played ? "is-progress" : "is-unplayed"}" id="level-${escapeHtml(level.id)}">
          <button class="level-heading" data-action="toggle-level" data-level-id="${level.id}" aria-expanded="${state.selectedLevelId === level.id}">
            <span class="level-number">${levelIndex + 1}</span><span><strong>${escapeHtml(levelTitle(level))}</strong><small>${isMastery ? t("questionsLong", { count: level.countryCodes.length }) : countryCount(level.countryCodes.length)}</small></span>
            <span class="level-state">${value.mastered === 4 ? "4/4 ✓" : value.played ? `${value.mastered}/4 ${t("mastered")}` : `<span class="unread-dot" aria-label="${t("unplayed")}"></span>`}</span>
          </button>
          ${state.selectedLevelId === level.id ? `<div class="quiz-list">${level.quizzes.map((baseQuiz) => {
            const quiz = curriculum.quizById.get(baseQuiz.id); const record = progress.currentRecord(profile, quiz); const status = progress.quizState(profile, quiz); const recommended = next.type === "quiz" && next.quiz.id === quiz.id;
            return `<button class="quiz-row ${recommended ? "is-recommended" : ""}" data-action="start-curriculum-quiz" data-quiz-id="${quiz.id}"><span>${escapeHtml(modeLabel(quiz.mode))}${recommended ? `<small>${t("recommended")}</small>` : ""}</span><span>${status === "mastered" ? `${record.bestScore}/${record.total} ✓` : status === "played" ? `${record.bestScore}/${record.total}` : `<span class="unread-dot" aria-label="${t("unplayed")}"></span>`}</span></button>`;
          }).join("")}<button class="quiet-button cards-level-button" data-action="level-cards" data-level-id="${level.id}">${t("cards")}</button></div>` : ""}
        </section>`;
      }).join("")}</div></main>`;
  }

  function importMarkup() {
    if (state.importError || !state.importProfiles?.length) return `<main class="quiz-shell challenge-shell"><section class="challenge-card"><h1>${t("invalidImport")}</h1><button class="primary-button" data-action="cancel-import">${t("home")}</button></section></main>`;
    return `<main class="quiz-shell challenge-shell"><section class="challenge-card import-card"><p class="kicker">${t("importProgress")}</p><h1>${state.importProfiles.length === 1 ? escapeHtml(state.importProfiles[0].name) : t("backupDevice")}</h1>
      <div class="import-list">${state.importProfiles.map((profile, index) => { const totals = progress.summary(profile, curriculum.levels); return `<article><div><strong>${escapeHtml(profile.name)}</strong><span>${t("playedAndMastered", { played: totals.playedQuizzes, mastered: totals.masteredQuizzes })}</span></div><button class="secondary-button" data-action="import-one" data-import-index="${index}">${t("importOne")}</button></article>`; }).join("")}</div>
      <div class="import-actions">${state.importProfiles.length > 1 ? `<button class="primary-button" data-action="import-all">${t("importAll")}</button>` : `<button class="primary-button" data-action="create-imported-profile">${t("createProfile")}</button>${Object.values(progressStore.profiles).map((profile) => `<button class="secondary-button" data-action="merge-import" data-profile-id="${escapeHtml(profile.id)}">${t("mergeInto", { name: profile.name })}</button>`).join("")}`}<button class="quiet-button" data-action="cancel-import">${t("importCancel")}</button></div>
    </section></main>`;
  }

  function reviewMarkup() {
    if (state.wrongAnswers.length === 0) return "";

    return `
      <section class="result-review" id="result-review" aria-labelledby="review-heading" tabindex="-1">
        <p class="kicker">${t("review")}</p>
        <h2 id="review-heading">${t("reviewHeading")}</h2>
        <p>${t("reviewCount", { count: state.wrongAnswers.length })}</p>
        <div class="review-list">
          ${state.wrongAnswers
            .map(
              (country) => `
                <article class="review-row">
                  ${flagMarkup(country, "review-flag", true)}
                  <div>
                    <strong>${escapeHtml(countryName(country))}</strong>
                    <span>${escapeHtml(countryCapital(country))}</span>
                  </div>
                </article>
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
    return `<main class="quiz-shell challenge-shell"><header class="quiz-header">${brandMarkup(true, false)}${homeButtonMarkup()}</header>
      <section class="challenge-card challenge-intro-card"><p class="kicker">${t("challengeQuizTitle")}</p><h1>${escapeHtml(levelTitle(level))}</h1>
      <div class="challenge-details"><div><span>${t("testYourself")}</span><strong>${escapeHtml(modeLabel(quiz.mode))}</strong></div><div><span>${t("questionsLabel")}</span><strong>${quiz.countryCodes.length}</strong></div><div><span>${t("approximateTime", { minutes: Math.max(2, Math.ceil(quiz.countryCodes.length / 4)) })}</span><strong>${state.challengeScoreVerified ? `${t("scoreToBeat")}: ${state.challengeTargetScore}/${quiz.countryCodes.length}` : ""}</strong></div></div>
      ${state.challengeScoreWarning ? `<p class="challenge-warning" role="status">${t("unverifiedScore")}</p>` : ""}
      <button class="primary-button" data-action="start-challenge">${t("startChallenge")} <span aria-hidden="true">→</span></button></section></main>`;
  }

  function invalidChallengeMarkup() {
    return `
      <main class="quiz-shell challenge-shell">
        <header class="quiz-header">${brandMarkup(true, false)}</header>
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

  function resultMarkup() {
    return curriculumResultMarkup();
  }

  function curriculumResultMarkup() {
    const quiz = curriculumQuiz();
    const level = curriculumLevel();
    const perfect = state.score === state.questions.length;
    const record = progress.currentRecord(currentProfile(), quiz);
    const best = record?.bestScore ?? state.score;
    return `<main class="quiz-shell result-shell ${state.wrongAnswers.length ? "has-review" : ""}"><header class="quiz-header">${brandMarkup(true, false)}${homeButtonMarkup()}</header>
      <section class="result-card curriculum-result-card"><div class="result-summary-main"><p class="kicker">${escapeHtml(levelTitle(level))} · ${escapeHtml(modeLabel(quiz.mode))}</p><h1>${perfect ? t("quizMastered") : t("quizNotMastered")}</h1><div class="curriculum-result-score"><strong>${state.score}/${state.questions.length}</strong><span>${t("bestScore", { score: best, total: state.questions.length })}</span></div>${state.resultNewLevelMastery ? `<p class="level-mastered-callout">${escapeHtml(levelTitle(level))} · 4/4 ✓</p>` : ""}${challengeComparisonMarkup()}</div>
      <div class="result-summary-support"><div class="result-actions"><button class="primary-button" data-action="${perfect ? "next-curriculum-quiz" : "retry-curriculum-quiz"}">${perfect ? t("nextQuiz") : t("tryAgainAction")} <span aria-hidden="true">→</span></button><button class="secondary-button" data-action="${perfect ? "retry-curriculum-quiz" : "next-curriculum-quiz"}">${perfect ? t("playAgain") : t("nextQuiz")}</button><button class="quiet-button" data-action="view-active-level">${t("viewLevel")}</button>${state.wrongAnswers.length ? `<button class="quiet-button" data-action="review-missed-cards">${t("reviewCards")}</button>` : ""}</div>
      <div class="challenge-share-actions"><button class="quiet-button" data-action="copy-curriculum-challenge">${t("challengeThisQuiz")}</button><button class="quiet-button" data-action="share-progress">${t("shareProgress")}</button></div><p class="profile-status" data-challenge-status aria-live="polite">${state.shareStatus ? t(state.shareStatus) : ""}</p></div></section>${reviewMarkup()}</main>`;
  }

  function activeExploreCountryCode() {
    return state.explorePreviewCode ?? state.explorePinnedCode;
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
      <div class="explore-country-status">
        ${flagMarkup(country, "explore-status-flag", false)}
        <span>
          <strong>${escapeHtml(countryName(country))}</strong>
          <small>${escapeHtml(countryCapital(country))}</small>
        </span>
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
        ]
          .filter(Boolean)
          .join(" ");

        return `
          <g
            class="${classes}"
            data-action="explore-country"
            data-explore-code="${marker.code}"
            data-map-marker-readable-size="${marker.readableSize}"
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
      const threshold = markerControl.classList.contains(
        "is-geometry-readable",
      )
        ? exploreMapGeometryHideSize
        : exploreMapGeometryShowSize;
      const geometryReadable =
        readableSize / Math.max(mapUnitsPerPixel, Number.EPSILON) >= threshold;

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

  function exploreRegionMapMarkup(sortedCountries) {
    const showingAfricaOverview = state.exploreMapOverview === "africa";
    const scopeId = showingAfricaOverview
      ? "africa"
      : state.region;
    const scopeLabel = showingAfricaOverview
      ? t("africaOverview")
      : regionLabel(selectedRegion());
    const view = showingAfricaOverview
      ? mapData.overviewRegions.africa
      : mapData.quizRegions[state.region];
    const mapViewport = getExploreMapViewport(
      view.viewBox,
      scopeId,
    );
    const zoom = exploreMapZoom(mapViewport);
    const zoomPercent = Math.round(zoom * 100);
    const contextPaths = (view.backgroundFeatures ?? view.features)
      .filter((feature) => {
        if (view.backgroundFeatures) return true;
        const region = mapRegionForCode(feature.code);
        return showingAfricaOverview
          ? !africaRegionIds.has(region)
          : region !== state.region;
      })
      .map((feature) =>
        regionalMapPathMarkup(feature, "explore-map-context-shape"),
      )
      .join("");

    return `
      <div class="explore-map-layout">
        <div class="explore-map-stage">
          ${
            africaRegionIds.has(state.region)
              ? `<div class="explore-map-scope-controls">
                  <button
                    type="button"
                    class="secondary-button explore-map-scope-button"
                    data-action="toggle-africa-overview"
                  >${
                    showingAfricaOverview
                      ? escapeHtml(t("showSelectedRegion", {
                          region: regionLabel(selectedRegion()),
                        }))
                      : escapeHtml(t("viewAllAfrica"))
                  }</button>
                </div>`
              : ""
          }
          <div class="explore-region-map${zoom > 1.001 ? " is-zoomed" : ""}${state.silhouetteExpanded ? " has-expanded-silhouette" : ""}">
          <svg
            data-explore-map-svg
            viewBox="${serializeMapViewBox(mapViewport.view)}"
            role="group"
            aria-label="${escapeHtml(t("interactiveRegionMap", {
              region: scopeLabel,
            }))}"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect class="question-map-ocean" x="-10000" y="-10000" width="20000" height="20000" />
            <g aria-hidden="true">${contextPaths}</g>
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

        <aside class="explore-country-panel" aria-label="${escapeHtml(t("countriesInRegion"))}">
          <div class="explore-country-status-wrap" aria-live="polite">
            ${exploreCountryStatusMarkup(activeExploreCountryCode())}
          </div>
          <div class="scroll-affordance-frame" data-scroll-affordance-frame>
            <div class="explore-country-list" data-scroll-affordance>
              ${sortedCountries
                .map(
                  (country) => `
                    <button
                      class="explore-country-card${state.explorePinnedCode === country.code ? " is-pinned" : ""}${state.explorePreviewCode === country.code ? " is-preview" : ""}"
                      data-action="explore-country"
                      data-explore-code="${country.code}"
                      aria-pressed="${state.explorePinnedCode === country.code}"
                    >
                      ${flagMarkup(country, "explore-country-flag", false)}
                      <span>
                        <strong>${escapeHtml(countryName(country))}</strong>
                        <small>${escapeHtml(countryCapital(country))}</small>
                      </span>
                    </button>
                  `,
                )
                .join("")}
            </div>
          </div>
        </aside>
      </div>
    `;
  }

  function mapRegionPromptMarkup({
    action,
    description,
    heading,
    headingId,
    kicker,
  }) {
    return `
      <section class="map-region-prompt" aria-labelledby="${headingId}">
        <p class="kicker">${escapeHtml(kicker)}</p>
        <h2 id="${headingId}">${escapeHtml(heading)}</h2>
        <p>${escapeHtml(description)}</p>
        <div class="map-region-grid">
          ${mapSelectableRegions
            .map((regionId) => {
              const region = regionOptions.find(
                (option) => option.id === regionId,
              );
              return `
                <button
                  data-action="${action}"
                  data-value="${regionId}"
                >
                  <strong>${escapeHtml(regionLabel(region))}</strong>
                  <span>${countryCount(countriesInRegion(regionId).length)}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  function exploreMapRegionPromptMarkup() {
    return mapRegionPromptMarkup({
      action: "explore-map-region",
      description: t("exploreMapDescription"),
      heading: t("exploreMapHeading"),
      headingId: "explore-map-region-heading",
      kicker: t("chooseSingleRegion"),
    });
  }

  function exploreListMarkup(sortedCountries, modalCountry) {
    return `
      <div class="country-table-wrap">
        <table class="country-table">
          <colgroup>
            <col class="flag-column" />
            <col class="country-column" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">${t("tableFlag")}</th>
              <th scope="col">${t("tableCountry")}</th>
              <th scope="col">${t("tableCapital")}</th>
            </tr>
          </thead>
          <tbody>
            ${sortedCountries
              .map(
                (country) => `
                  <tr
                    data-action="open-flag"
                    data-code="${country.code}"
                  >
                    <td>
                      <button
                        class="table-flag-button"
                        data-action="open-flag"
                        data-code="${country.code}"
                        aria-label="${escapeHtml(t("showLargeFlag", {
                          name: countryName(country),
                        }))}"
                      >
                        ${flagMarkup(country, "table-flag", false)}
                      </button>
                    </td>
                    <th scope="row">${escapeHtml(countryName(country))}</th>
                    <td>${escapeHtml(countryCapital(country))}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      ${
        modalCountry
          ? `
            <div
              class="flag-modal"
              data-action="close-modal"
              role="dialog"
              aria-modal="true"
              aria-label="${escapeHtml(t("largeFlag", {
                name: countryName(modalCountry),
              }))}"
              tabindex="-1"
            >
              <div class="flag-modal-toolbar">
                ${languageSwitcherMarkup()}
              </div>
              <div class="flag-modal-card ${countryNote(modalCountry) ? "has-note" : ""}">
                ${flagMarkup(modalCountry, "modal-flag", true)}
                <strong>${escapeHtml(countryName(modalCountry))}</strong>
                <span class="modal-capital">${escapeHtml(countryCapital(modalCountry))}</span>
                ${
                  countryNote(modalCountry)
                    ? `<p class="country-note">${escapeHtml(countryNote(modalCountry))}</p>`
                    : ""
                }
              </div>
            </div>
          `
          : ""
      }
    `;
  }

  function exploreMarkup() {
    const region = selectedRegion();
    const modalCountry = countries.find(
      (country) => country.code === state.modalCode,
    );
    const collator = new Intl.Collator(state.locale, { sensitivity: "base" });
    const viewingMap = state.exploreView === "map";
    const showingAfricaOverview =
      viewingMap && state.exploreMapOverview === "africa";
    const scopedCountries = showingAfricaOverview
      ? countriesInExploreMapScope()
      : countriesInRegion(state.region);
    const sortedCountries = [...scopedCountries].sort((a, b) =>
      collator.compare(countryName(a), countryName(b)),
    );
    const mapAvailable = mapSelectableRegions.includes(state.region);
    const scopeLabel = showingAfricaOverview
      ? t("africaOverview")
      : regionLabel(region);
    const exploreLabel = `${t("explore")} · ${scopeLabel}`;

    return `
      <main class="site-shell explore-shell explore-${state.exploreView}-shell">
        <header class="quiz-header explore-header">
          ${brandMarkup(true, false)}
          <h1
            class="explore-context"
            aria-label="${escapeHtml(exploreLabel)}"
            tabindex="-1"
          >
            <span class="explore-context-prefix">${t("explore")} <span aria-hidden="true">·</span></span>
            <span class="explore-context-region">${scopeLabel}</span>
          </h1>
          ${homeButtonMarkup()}
        </header>

        <div class="explore-content">
          <div class="explore-view-tabs" role="group" aria-label="${escapeHtml(t("exploreCountries"))}">
            <button data-action="explore-view" data-value="map" aria-pressed="${state.exploreView === "map"}">${t("mapsView")}</button>
            <button data-action="explore-view" data-value="list" aria-pressed="${state.exploreView === "list"}">${t("listView")}</button>
            <button data-action="explore-cards" aria-pressed="${state.exploreView === "cards"}">${t("cards")}</button>
          </div>
          ${
            viewingMap
              ? mapAvailable
                ? exploreRegionMapMarkup(sortedCountries)
                : exploreMapRegionPromptMarkup()
              : state.exploreView === "cards"
                ? exploreCardsMarkup()
                : exploreListMarkup(sortedCountries, modalCountry)
          }
        </div>
      </main>
    `;
  }

  function exploreCardsMarkup() {
    if (!state.flashcards.length) state.flashcards = shuffle(countriesInRegion(state.region));
    const complete = state.flashcardIndex >= state.flashcards.length;
    if (complete) return `<section class="flashcard-complete"><h2>${t("cardsComplete")}</h2><button class="primary-button" data-action="restart-explore-cards">${t("restart")}</button></section>`;
    const country = state.flashcards[state.flashcardIndex];
    return `<section class="explore-cards-deck"><p>${state.flashcardIndex + 1} / ${state.flashcards.length}</p><button class="flashcard-stage ${state.flashcardRevealed ? "is-revealed" : ""}" data-action="flashcard-toggle">${flagMarkup(country, "flashcard-flag", state.flashcardRevealed)}<span class="flashcard-answer">${state.flashcardRevealed ? `<strong>${escapeHtml(countryName(country))}</strong><span>${escapeHtml(countryCapital(country))}</span>${countrySilhouetteMarkup(country.code, { interactive: false, expanded: false })}` : ""}</span><span class="flashcard-instruction">${state.flashcardRevealed ? t("nextCard") : t("revealCard")}</span></button></section>`;
  }

  function flashcardMarkup() {
    const region = selectedRegion();
    const complete = state.flashcardIndex >= state.flashcards.length;

    if (complete) {
      return `
        <main class="quiz-shell flashcard-shell">
          <header class="quiz-header">
            ${brandMarkup(true, false)}
            ${homeButtonMarkup()}
          </header>
          <section class="flashcard-complete">
            <p class="kicker">${t("flashcardsComplete")}</p>
            <h1>${t("roundComplete")}</h1>
            <p>
              ${t("flashcardsSummaryBefore")} ${state.flashcards.length}
              ${t("flashcardsSummaryAfter")}
              ${regionLabelInSentence(region)}.
            </p>
            <div class="flashcard-actions">
              ${state.flashcardReturn === "result" ? `<button class="primary-button" data-action="retry-from-cards">${t("retryQuiz")}</button><button class="secondary-button" data-action="back-from-cards">${t("backToLevel")}</button>` : `<button class="primary-button" data-action="back-from-cards">${t("backToLevel")}</button>`}
            </div>
          </section>
        </main>
      `;
    }

    const country = state.flashcards[state.flashcardIndex];
    const progress = ((state.flashcardIndex + 1) / state.flashcards.length) * 100;
    const instruction = state.flashcardRevealed
      ? t("nextFlag")
      : t("revealInstruction");

    return `
      <main class="quiz-shell flashcard-shell">
        <header class="quiz-header">
          ${brandMarkup(true, false)}
          <div class="quiz-meta">
            <span>${regionLabel(region)}</span>
            <strong>${state.flashcardIndex + 1} / ${state.flashcards.length}</strong>
          </div>
          ${homeButtonMarkup()}
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
              ? escapeHtml(t("revealedFlashcard", {
                  name: countryName(country),
                  capital: countryCapital(country),
                }))
              : escapeHtml(t("hiddenFlashcard", {
                  current: state.flashcardIndex + 1,
                  total: state.flashcards.length,
                }))
          }"
        >
          ${flagMarkup(country, "flashcard-flag", state.flashcardRevealed)}
          <span class="flashcard-answer" aria-hidden="${!state.flashcardRevealed}">
            ${
              state.flashcardRevealed
                ? `
                  <strong>${escapeHtml(countryName(country))}</strong>
                  <span>${escapeHtml(countryCapital(country))}</span>
${countrySilhouetteMarkup(country.code, { interactive: false, expanded: false })}
                `
                : ""
            }
          </span>
          <span class="flashcard-instruction">${instruction}</span>
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
        <header class="quiz-header">
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
        return resultMarkup();
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

  function render(options = {}) {
    updateDocumentMetadata();
    app.innerHTML = screenMarkup();
    document.body?.classList.toggle("standalone-mode", isStandalone());
    document.body?.classList.toggle(
      "challenge-page",
      state.screen === "challenge-intro" || state.screen === "challenge-error",
    );
    document.body?.classList.toggle("result-page", state.screen === "result");
    scheduleScrollAffordanceUpdate();
    scheduleResponsiveRegionMaps();
    if (state.screen === "explore" && state.exploreView === "map") {
      scheduleExploreMapZoomUi();
    }
    document.body?.classList.toggle(
      "modal-open",
      state.modalCode !== null ||
        state.installHelpOpen ||
        state.openChallengeOpen ||
        state.profilePanelOpen,
    );

    if (options.focusCorrect) app.querySelector(".is-correction")?.focus();
    if (options.focusModal) app.querySelector(".flag-modal")?.focus();
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
    if (options.focusFlagCode) {
      const flagButton = app.querySelector(
        `.table-flag-button[data-code="${options.focusFlagCode}"]`,
      );
      flagButton?.classList.toggle(
        "is-pointer-restored-focus",
        options.suppressFlagFocusVisible === true,
      );
      flagButton?.focus();
    }
    if (options.focusFlashcard) {
      app.querySelector('[data-action="flashcard-toggle"]')?.focus();
    }
    if (options.focusExploreHeading) {
      app.querySelector(".explore-context")?.focus({ preventScroll: true });
    }
    if (options.focusExploreOverviewToggle) {
      app
        .querySelector('[data-action="toggle-africa-overview"]')
        ?.focus({ preventScroll: true });
    }
    if (options.focusLanguage) {
      const modalLanguageControl = app.querySelector(
        `.flag-modal [data-action="language"][data-value="${options.focusLanguage}"]`,
      );
      if (modalLanguageControl) {
        modalLanguageControl.focus({ preventScroll: true });
        return;
      }
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
    if (state.screen !== "setup") return;

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
    state.exploreMapOverview = null;
    state.silhouetteExpanded = false;
    resetExploreMapInteraction();
  }

  function syncExploreCountryUi() {
    if (state.screen !== "explore" || state.exploreView !== "map") return;

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
        activeExploreCountryCode(),
      );
    }

    const overlay = app.querySelector(".explore-silhouette-overlay");
    if (overlay) {
      overlay.innerHTML = exploreSilhouetteOverlayMarkup();
    }
  }

  function setExplorePreview(code) {
    if (
      state.screen !== "explore" ||
      state.exploreView !== "map" ||
      !mapSelectableRegions.includes(state.region)
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
    if (!regionOptions.some((region) => region.id === regionId)) return false;
    if (state.region !== regionId) {
      state.exploreMapOverview = null;
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
    state.shareStatus = null; state.screen = "quiz";
    if (savedAttempt && savedAttempt.questionIndex >= state.questions.length && !savedAttempt.correctionPending) {
      state.questionIndex = state.questions.length - 1; state.resultRecorded = false; finishCurriculumAttempt(); state.screen = "result";
    }
    renderAtTop({ focusCorrect: state.answerStatus === "correction" });
  }

  function showExplore(initialView = "list") {
    clearAutoAdvance();
    setKeyboardHintsVisible(false);
    state.screen = "explore";
    state.questions = [];
    state.selectedCode = null;
    state.answerStatus = "unanswered";
    state.silhouetteExpanded = false;
    state.wrongAnswers = [];
    state.modalCode = null;
    state.exploreView = initialView === "map" ? "map" : "list";
    resetExploreCountryState();
    renderAtTop();
  }

  function closeFlagModal(options = {}) {
    const code = state.modalCode;
    state.modalCode = null;
    render({ focusFlagCode: code, ...options });
    window.scrollTo({ top: state.exploreScrollTop });
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

  async function copyTransferLink() {
    const url = new URL(window.location.href);
    url.search = state.locale === "en" ? "?lang=en" : "";
    url.hash = `progress=${progress.encodeTransfer(currentProfile())}`;
    try { await copyText(url.href); state.shareStatus = "transferCopied"; } catch { state.shareStatus = "transferFailed"; }
    render({ focusProfilePanel: true });
  }

  async function copyProgressShare() {
    const totals = progress.summary(currentProfile(), curriculum.levels);
    const url = new URL(window.location.href); url.search = state.locale === "en" ? "?lang=en" : ""; url.hash = "";
    const text = totals.masteredQuizzes === 188
      ? `${state.locale === "en" ? "I have mastered all 188 geography quizzes in Hello World!" : "Jeg har mestret alle 188 geografiquizene i Hei verden!"}\n${url.href}`
      : `${state.locale === "en" ? `I have mastered ${totals.masteredLevels} of 47 levels in Hello World!` : `Jeg har mestret ${totals.masteredLevels} av 47 nivåer i Hei verden!`}\n${url.href}`;
    try { if (navigator.share) await navigator.share({ title: t("brandName"), text }); else await copyText(text); state.shareStatus = "progressCopied"; }
    catch (error) { if (error?.name !== "AbortError") state.shareStatus = "shareUnavailable"; }
    render();
  }

  async function copyCurriculumChallenge() {
    const quiz = curriculumQuiz(); if (!quiz) return;
    try {
      const recipe = { quizId: quiz.id, revision: quiz.revision, score: state.score };
      const proof = await challenge.createScoreProof(recipe);
      const url = challenge.createUrl(window.location.href, { ...recipe, proof }, state.locale);
      const level = curriculumLevel();
      const message = `${levelTitle(level)} · ${modeLabel(quiz.mode)}\n${state.score}/${quiz.countryCodes.length} · ${t("approximateTime", { minutes: Math.max(2, Math.ceil(quiz.countryCodes.length / 4)) })}\n${url.href}`;
      if (navigator.share) await navigator.share({ title: t("challengeQuizTitle"), text: message }); else await copyText(message);
      state.shareStatus = "challengeLinkCopied";
    } catch (error) { if (error?.name !== "AbortError") state.shareStatus = "challengeShareFailed"; }
    render();
  }

  function downloadBackup() {
    const blob = new Blob([progress.createBackup(progressStore)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `hello-world-backup-${new Date().toISOString().slice(0, 10)}.json`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function importSingleProfile(imported) {
    progressStore = progressStore.profiles[imported.id]
      ? progress.mergeInto(progressStore, imported.id, imported)
      : progress.importAsNew(progressStore, imported);
    persist(progressStore); state.importProfiles = null; state.importError = false; clearTransferFragment(); state.screen = "setup"; renderAtTop();
  }

  function importAllProfiles() {
    for (const imported of state.importProfiles ?? []) {
      progressStore = progressStore.profiles[imported.id]
        ? progress.mergeInto(progressStore, imported.id, imported)
        : progress.importAsNew(progressStore, imported);
    }
    persist(progressStore); state.importProfiles = null; state.importError = false; clearTransferFragment(); state.screen = "setup"; renderAtTop();
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
    state.modalCode = null;
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
    state.shareStatus = null;
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

    if (action === "continue-game") { const next = progress.continueSelection(currentProfile(), curriculum.levels); if (next.type === "quiz") startCurriculumQuiz(next.quiz.id); return; }
    if (action === "surprise-quiz") { const quiz = progress.surpriseQuiz(currentProfile(), curriculum.levels); if (quiz) startCurriculumQuiz(quiz.id); return; }
    if (action === "levels") { state.screen = "levels"; state.selectedLevelId = progress.continueSelection(currentProfile(), curriculum.levels).quiz?.levelId ?? curriculum.levels[0].id; renderAtTop(); return; }
    if (action === "toggle-level") { state.selectedLevelId = state.selectedLevelId === control.dataset.levelId ? null : control.dataset.levelId; render(); return; }
    if (action === "start-curriculum-quiz") { startCurriculumQuiz(control.dataset.quizId); return; }
    if (action === "retry-curriculum-quiz") { startCurriculumQuiz(state.curriculumQuizId); return; }
    if (action === "next-curriculum-quiz") { const quiz = progress.nextUnmastered(currentProfile(), curriculum.levels, state.curriculumQuizId); if (quiz) startCurriculumQuiz(quiz.id); else returnToSetup(); return; }
    if (action === "view-active-level") { state.selectedLevelId = state.activeLevelId; state.screen = "levels"; renderAtTop(); return; }
    if (action === "resume-mastery") { const saved = currentProfile().savedMasteryAttempt; if (saved) startCurriculumQuiz(saved.quizId, { resume: true }); return; }
    if (action === "review-missed-cards") { state.flashcards = [...new Map(state.wrongAnswers.map((country) => [country.code, country])).values()]; state.flashcardIndex = 0; state.flashcardRevealed = false; state.flashcardReturn = "result"; state.screen = "flashcards"; renderAtTop({ focusFlashcard: true }); return; }
    if (action === "level-cards") { const level = curriculum.levelById.get(control.dataset.levelId); if (!level) return; state.flashcards = level.countryCodes.map((code) => countriesByCode.get(code)); state.flashcardIndex = 0; state.flashcardRevealed = false; state.flashcardReturn = "level"; state.activeLevelId = level.id; state.screen = "flashcards"; renderAtTop({ focusFlashcard: true }); return; }
    if (action === "retry-from-cards") { startCurriculumQuiz(state.curriculumQuizId); return; }
    if (action === "back-from-cards") { state.selectedLevelId = state.activeLevelId; state.screen = "levels"; renderAtTop(); return; }
    if (action === "explore-view") { state.exploreView = control.dataset.value; state.flashcards = []; state.flashcardIndex = 0; state.flashcardRevealed = false; resetExploreCountryState(); render(); return; }
    if (action === "explore-cards" || action === "restart-explore-cards") { state.exploreView = "cards"; state.flashcards = shuffle(countriesInRegion(state.region)); state.flashcardIndex = 0; state.flashcardRevealed = false; resetExploreCountryState(); render(); return; }
    if (action === "open-profile-panel") { state.profilePanelOpen = true; state.shareStatus = null; render({ focusProfilePanel: true }); return; }
    if (action === "close-profile-panel") { if (event.target === control) { state.profilePanelOpen = false; render(); } return; }
    if (action === "close-profile-panel-button") { state.profilePanelOpen = false; render(); return; }
    if (action === "switch-profile") { persist(progress.switchProfile(progressStore, control.dataset.profileId)); state.profilePanelOpen = false; renderAtTop(); return; }
    if (action === "add-profile") { const name = window.prompt(t("newProfileName")); if (name !== null) { persist(progress.addProfile(progressStore, name)); state.profilePanelOpen = false; renderAtTop(); } return; }
    if (action === "rename-profile") { const name = window.prompt(t("renamePrompt"), currentProfile().name); if (name !== null) { persist(progress.renameProfile(progressStore, progressStore.activeProfileId, name)); render({ focusProfilePanel: true }); } return; }
    if (action === "clear-profile") { if (window.confirm(t("clearConfirm"))) { persist(progress.clearProgress(progressStore, progressStore.activeProfileId)); state.profilePanelOpen = false; renderAtTop(); } return; }
    if (action === "delete-profile") { if (window.confirm(t("deleteConfirm"))) { persist(progress.deleteProfile(progressStore, progressStore.activeProfileId)); state.profilePanelOpen = false; renderAtTop(); } return; }
    if (action === "copy-transfer") { void copyTransferLink(); return; }
    if (action === "download-backup") { downloadBackup(); return; }
    if (action === "share-progress") { void copyProgressShare(); return; }
    if (action === "copy-curriculum-challenge") { void copyCurriculumChallenge(); return; }
    if (action === "create-imported-profile") { if (state.importProfiles?.[0]) importSingleProfile(state.importProfiles[0]); return; }
    if (action === "merge-import") { if (state.importProfiles?.[0]) { persist(progress.mergeInto(progressStore, control.dataset.profileId, state.importProfiles[0])); state.importProfiles = null; clearTransferFragment(); state.screen = "setup"; renderAtTop(); } return; }
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
      showExplore(control.dataset.value);
      return;
    }

    if (action === "explore-map-region") {
      if (!updateRegion(control.dataset.value)) return;
      resetExploreCountryState();
      render({ focusExploreHeading: true });
      return;
    }

    if (action === "toggle-africa-overview") {
      if (!africaRegionIds.has(state.region)) return;
      state.exploreMapOverview =
        state.exploreMapOverview === "africa" ? null : "africa";
      state.explorePinnedCode = null;
      state.explorePreviewCode = null;
      state.silhouetteExpanded = false;
      resetExploreMapInteraction();
      render({ focusExploreOverviewToggle: true });
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

    if (action === "open-flag") {
      state.exploreScrollTop = window.scrollY;
      state.modalCode = control.dataset.code;
      render({ focusModal: true });
      window.scrollTo({ top: state.exploreScrollTop });
      return;
    }

    if (action === "close-modal") {
      closeFlagModal({ suppressFlagFocusVisible: true });
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
    scheduleResponsiveRegionMaps();
    if (state.screen === "explore" && state.exploreView === "map") {
      scheduleExploreMapZoomUi();
    }
  });

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
    const pointerRestoredFocus = event.target.closest(
      ".table-flag-button.is-pointer-restored-focus",
    );
    if (pointerRestoredFocus && app.contains(pointerRestoredFocus)) {
      pointerRestoredFocus.classList.remove("is-pointer-restored-focus");
    }

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

    const control = event.target.closest('[data-action="map-region"]');
    if (
      !control ||
      !app.contains(control) ||
      (event.key !== "Enter" && event.key !== " ")
    ) {
      return;
    }
    event.preventDefault();
    if (!updateRegion(control.dataset.value)) return;
    render();
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

    if (state.modalCode !== null) {
      event.preventDefault();
      closeFlagModal();
      return;
    }

    if (
      state.screen === "explore" &&
      state.exploreView === "map" &&
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
