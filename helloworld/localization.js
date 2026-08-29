(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_LOCALIZATION = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const supportedLocales = Object.freeze(["nb", "en"]);

const messages = Object.freeze({
  nb: Object.freeze({
    modeCountryFlagShort: "Finn flagget",
    modeFlagCountryShort: "Finn riktig navn",
    modeCountryCapitalShort: "Finn hovedstaden",
    modeMapCountryShort: "Les kartet",
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
    shrinkShape: "Vis kartfiguren mindre",
    enlargeShape: "Vis kartfiguren større",
    changeRegion: "Bytt region",
    exploreOnMap: "Utforsk {name} på kartet",
    backToResults: "Tilbake til resultatet",
    resultsDestination: "Resultatet",
    backToLevels: "Tilbake til nivåene",
    highlightedMap: "Kart over {region} med ett sted uthevet",
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
    reviewHeading: "{count} {count, plural, one {sted} other {steder}} å øve på",
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
    flashcards: "Øvingskort",
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
    showRegion: "Vis region",
    viewWorld: "Vis verden",
    mapAreaControls: "Bytt kartutsnitt",
    exploreMapHeading: "Hvilket kart vil du utforske?",
    chooseSingleRegion: "Velg en enkelt region",
    showCountryDetails: "Vis detaljer for {name}",
    countryDetails: "Stedsdetaljer: {name}",
    flashcardsComplete: "Øvingskort",
    roundComplete: "Runden er fullført",
    flashcardsSummaryBefore: "Du har gått gjennom",
    flashcardsSummaryAfter: "flagg fra",
    revealedFlashcard:
      "{name}, {capital}. Velg for å gå til neste flagg.",
    revealedRelatedFlashcard:
      "{name}, {capital} ({relationship}). Velg for å gå til neste flagg.",
    hiddenFlashcard:
      "Øvingskort {current} av {total}. Velg for å vise svaret.",
    findFlag: "Finn flagget til",
    whichCountry: "Hvilket sted?",
    findCapital: "Finn hovedstaden til",
    option: "Alternativ {number}",
    flagOption: "Flaggalternativ {number}",
    correctContinue:
      "{label}, riktig svar. Velg for å gå videre.",
    correctAnswer: "{label}, riktig svar",
    correctAnnouncement: "Riktig.",
    wrongAnnouncement:
      "Feil. Riktig svar er {answer}. Aktiver det markerte alternativet for å gå videre.",
    metaTitle: "Hei verden! – lær land, flagg, hovedsteder og kart",
    metaDescription:
      "Utforsk og test deg selv på 197 land og 30 andre steder, med flagg, hovedsteder og regionale kart.",
  }),
  en: Object.freeze({
    modeCountryFlagShort: "Find the flag",
    modeFlagCountryShort: "Match the name",
    modeCountryCapitalShort: "Find the capital",
    modeMapCountryShort: "Read the map",
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
    shrinkShape: "Show a smaller map shape",
    enlargeShape: "Show a larger map shape",
    changeRegion: "Change region",
    exploreOnMap: "Explore {name} on the map",
    backToResults: "Back to results",
    resultsDestination: "Results",
    backToLevels: "Back to levels",
    highlightedMap: "Map of {region} with one place highlighted",
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
      "{count} {count, plural, one {place} other {places}} to review",
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
    showRegion: "Show region",
    viewWorld: "View world",
    mapAreaControls: "Change map area",
    exploreMapHeading: "Which map would you like to explore?",
    chooseSingleRegion: "Choose a single region",
    showCountryDetails: "Show details for {name}",
    countryDetails: "Place details: {name}",
    flashcardsComplete: "Flashcards",
    roundComplete: "Round complete",
    flashcardsSummaryBefore: "You have reviewed",
    flashcardsSummaryAfter: "flags from",
    revealedFlashcard:
      "{name}, {capital}. Choose to continue to the next flag.",
    revealedRelatedFlashcard:
      "{name}, {capital} ({relationship}). Choose to continue to the next flag.",
    hiddenFlashcard:
      "Flashcard {current} of {total}. Choose to reveal the answer.",
    findFlag: "Find the flag of",
    whichCountry: "Which place?",
    findCapital: "Find the capital of",
    option: "Option {number}",
    flagOption: "Flag option {number}",
    correctContinue:
      "{label}, correct answer. Choose to continue.",
    correctAnswer: "{label}, correct answer",
    correctAnnouncement: "Correct.",
    wrongAnnouncement:
      "Incorrect. The correct answer is {answer}. Activate the highlighted option to continue.",
    metaTitle: "Hello World! – learn countries, flags, capitals and maps",
    metaDescription:
      "Explore and test yourself on 197 countries and 30 other places, with flags, capitals and regional maps.",
  }),
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
    newProfileName: "Navn på ny profil", settings: "Innstillinger",
    transferProfile: "Overfør denne profilen", copyTransferLink: "Kopier overføringslenke",
    transferCopied: "Overføringslenken er kopiert.", transferFailed: "Kunne ikke kopiere lenken.",
    backupHeading: "Sikkerhetskopi", downloadBackup: "Last ned sikkerhetskopi",
    importBackup: "Importer sikkerhetskopi", importProgress: "Importer fremgang",
    createProfile: "Opprett profil", mergeProfile: "Slå sammen", mergeInto: "Slå sammen med {name}",
    importAll: "Importer alle profiler", importOne: "Importer", importCancel: "Avbryt",
    playedAndMastered: "{played} quizer spilt · {mastered} mestret", invalidImport: "Lenken eller sikkerhetskopien er ugyldig.",
    storageReadFailed: "Lagret fremgang kunne ikke leses. Du kan fortsatt utforske og spille.",
    storageWriteFailed: "Fremgangen kunne ikke lagres på denne enheten.",
    quizMastered: "Quiz mestret", quizNotMastered: "Ikke helt ennå", scoreOutOf: "av {total}",
    scoreAnnouncement: "{score} av {total}", newRecord: "Ny rekord!", recordScore: "Rekord: {score} av {total}",
    nextQuiz: "Neste quiz", nextLevelAction: "Neste", congratulations: "Gratulerer!", tryAgainAction: "Prøv igjen", playAgain: "Spill igjen",
    milestones: "Milepæler", milestoneReached: "Milepæl nådd", milestoneSummary: "Du har mestret nivå {start}–{end}.",
    milestoneAction: "Milepæl nådd", replayMilestone: "Spill feiringen for {stage} igjen",
    replayWorldCelebration: "Spill «Verden mestret»-feiringen igjen",
    milestoneLocked: "{stage} er ikke oppnådd ennå", nextStage: "Neste etappe: {stage}", continueWithStage: "Fortsett med: {stage}",
    worldMasteredAction: "Verden mestret", stageMastered: "Mestret",
    worldCelebrationSummary: "Du har mestret alle {levels} nivåene og alle {quizzes} quizene.",
    reviewCards: "Øv med øvingskort", retryQuiz: "Prøv quizen igjen", backToLevel: "Tilbake til nivået",
    worldMastered: "Verden mestret", surpriseQuiz: "Overraskelsesquiz", chooseLevel: "Velg nivå",
    shareProgress: "Del fremgangen min", progressCopied: "Fremgangen er kopiert.", challengeThisQuiz: "Utfordre en venn",
    goToRecommended: "Gå til anbefalt neste quiz",
    cards: "Øv med øvingskort", questionsLong: "{count} spørsmål · lang quiz",
    resumeAttempt: "Fortsett quizen", quizInProgress: "Quiz pågår", continueMode: "Fortsett: {mode}",
    answeredProgress: "{answered} / {total} besvart", keepSavedAttempt: "Behold lagret forsøk",
    abandonAttemptTitle: "Vil du starte en annen lang quiz?",
    abandonAttemptProgress: "Du har besvart {answered} av {total} spørsmål i",
    abandonAttemptStarting: "Hvis du starter",
    abandonAttemptEnding: "slettes dette forsøket.",
    abandonAndStart: "Forkast forsøket og start den lange quizen",
    addProfileTitle: "Legg til profil", addProfileDescription: "Fremgangen til den nye profilen lagres separat på denne enheten.",
    addProfileAction: "Opprett profil", renameProfileTitle: "Gi profilen nytt navn",
    renameProfileDescription: "Skriv inn et nytt navn for {name}.", renameProfileAction: "Lagre navn",
    clearProgressTitle: "Vil du nullstille fremgangen?", clearProgressDescription: "Alle quizresultater og eventuelle lagrede forsøk for {name} slettes. Profilen beholdes.",
    clearProgressAction: "Nullstill fremgang", deleteProfileTitle: "Vil du slette profilen?",
    deleteProfileDescription: "Profilen {name} og all fremgangen dens slettes fra denne enheten. Dette kan ikke angres.",
    deleteProfileAction: "Slett profil",
    savedAttempt: "Påbegynt quiz:", updatedQuizzes: "Noen quizer er oppdatert og klare til å spilles igjen.",
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
    newProfileName: "New profile name", settings: "Settings",
    transferProfile: "Transfer this profile", copyTransferLink: "Copy transfer link",
    transferCopied: "Transfer link copied.", transferFailed: "Could not copy the link.",
    backupHeading: "Backup", downloadBackup: "Download backup file",
    importBackup: "Import backup file", importProgress: "Import progress",
    createProfile: "Create profile", mergeProfile: "Merge", mergeInto: "Merge with {name}",
    importAll: "Import all profiles", importOne: "Import", importCancel: "Cancel",
    playedAndMastered: "{played} quizzes played · {mastered} mastered", invalidImport: "This link or backup file is invalid.",
    storageReadFailed: "Saved progress could not be read. You can still explore and play.",
    storageWriteFailed: "Progress could not be saved on this device.",
    quizMastered: "Quiz mastered", quizNotMastered: "Not quite yet", scoreOutOf: "of {total}",
    scoreAnnouncement: "{score} of {total}", newRecord: "New record!", recordScore: "Record: {score} of {total}",
    nextQuiz: "Next quiz", nextLevelAction: "Next", congratulations: "Congratulations!", tryAgainAction: "Try again", playAgain: "Play again",
    milestones: "Milestones", milestoneReached: "Milestone reached", milestoneSummary: "You mastered levels {start}–{end}.",
    milestoneAction: "Milestone reached", replayMilestone: "Replay the {stage} celebration",
    replayWorldCelebration: "Replay the world mastery celebration",
    milestoneLocked: "{stage} has not been earned yet", nextStage: "Next stage: {stage}", continueWithStage: "Continue with: {stage}",
    worldMasteredAction: "World mastered", stageMastered: "Mastered",
    worldCelebrationSummary: "You have mastered all {levels} levels and all {quizzes} quizzes.",
    reviewCards: "Review with flashcards", retryQuiz: "Retry quiz", backToLevel: "Back to level",
    worldMastered: "World mastered", surpriseQuiz: "Surprise quiz", chooseLevel: "Choose a level",
    shareProgress: "Share my progress", progressCopied: "Progress copied.", challengeThisQuiz: "Challenge a friend",
    goToRecommended: "Go to the recommended next quiz",
    cards: "Practice with flashcards", questionsLong: "{count} questions · long quiz",
    resumeAttempt: "Resume quiz", quizInProgress: "Quiz in progress", continueMode: "Continue: {mode}",
    answeredProgress: "{answered} / {total} answered", keepSavedAttempt: "Keep saved attempt",
    abandonAttemptTitle: "Start a different long quiz?",
    abandonAttemptProgress: "You have answered {answered} of {total} questions in",
    abandonAttemptStarting: "Starting",
    abandonAttemptEnding: "will delete that attempt.",
    abandonAndStart: "Abandon attempt and start the long quiz",
    addProfileTitle: "Add profile", addProfileDescription: "The new profile’s progress will be stored separately on this device.",
    addProfileAction: "Create profile", renameProfileTitle: "Rename profile",
    renameProfileDescription: "Enter a new name for {name}.", renameProfileAction: "Save name",
    clearProgressTitle: "Clear progress?", clearProgressDescription: "All quiz results and any saved attempt for {name} will be deleted. The profile will remain.",
    clearProgressAction: "Clear progress", deleteProfileTitle: "Delete profile?",
    deleteProfileDescription: "The profile {name} and all of its progress will be deleted from this device. This cannot be undone.",
    deleteProfileAction: "Delete profile",
    savedAttempt: "Quiz in progress:", updatedQuizzes: "Some quizzes were updated and are ready to play again.",
    challengeQuizTitle: "Quiz challenge", scoreToBeat: "Score to beat", approximateTime: "About {minutes} min",
    shareUnavailable: "Could not share or copy right now.", profilePrivacy: "Progress is stored only on this device.",
  }),
});

  function validateCatalog(catalog, name) {
    const referenceKeys = Object.keys(catalog.nb);
    supportedLocales.forEach((locale) => {
      if (Object.keys(catalog[locale]).length !== referenceKeys.length) {
        throw new Error(`Unexpected ${locale} ${name} translation key`);
      }
      referenceKeys.forEach((key) => {
        if (!catalog[locale][key]) {
          throw new Error(`Missing ${locale} translation: ${key}`);
        }
      });
    });
  }

  validateCatalog(messages, "interface");
  validateCatalog(progressionMessages, "progression");

  function translate(locale, key, values = {}) {
    if (!supportedLocales.includes(locale)) {
      throw new Error(`Unsupported locale: ${locale}`);
    }

    let value = messages[locale][key] ?? progressionMessages[locale][key];
    if (!value) throw new Error(`Missing ${locale} translation: ${key}`);

    value = value.replace(
      /\{(\w+), plural, one \{([^{}]+)\} other \{([^{}]+)\}\}/g,
      (_match, variable, singular, plural) =>
        Number(values[variable]) === 1 ? singular : plural,
    );
    return value.replace(/\{(\w+)\}/g, (_match, variable) =>
      String(values[variable] ?? ""),
    );
  }

  return Object.freeze({ supportedLocales, translate });
});
