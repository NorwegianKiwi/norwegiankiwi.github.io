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
  const distractorData = window.GEOGRAFI_QUIZ_DISTRACTOR_DATA;
  const mapData = window.GEOGRAFI_QUIZ_MAP_DATA;
  const challenge = window.GEOGRAFI_CHALLENGE;
  const app = document.getElementById("app");

  if (!data || !distractorData || !mapData || !challenge || !app) {
    throw new Error(
      initialLocale === "en"
        ? "Hello World! could not load the country data."
        : "Hei verden! kunne ikke laste landdataene.",
    );
  }

  const { countries, regionOptions } = data;
  const { flagDistractorGroups, flagConflictPairs } = distractorData;
  const messages = Object.freeze({
    nb: Object.freeze({
      loadError: "Hei verden! kunne ikke laste landdataene.",
      modeCountryFlagShort: "Flagg",
      modeFlagCountryShort: "Land",
      modeCountryCapitalShort: "Hovedsteder",
      modeMapCountry: "Kartquiz",
      modeMapCountryShort: "Kart",
      maps: "Kart",
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
      heroKicker: "Utforsk land, flagg og kart",
      heroTitleBefore: "Hvor godt kjenner du",
      heroTitleEmphasis: "verden?",
      chooseArea: "Velg område",
      chooseActivity: "Velg aktivitet",
      testYourself: "Test deg selv",
      explore: "Utforsk",
      exploreCountries: "Utforsk land",
      list: "Liste",
      map: "Kart",
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
      percentCorrect: "{percentage} prosent riktig",
      resultLabel: "Resultat",
      resultPercentSuffix: " %",
      resultExcellent: "Imponerende!",
      resultGreat: "Godt jobbet!",
      resultGood: "Du er på god vei.",
      resultTryAgain: "Verden venter.",
      scoreBefore: "Du fikk",
      scoreOf: "av",
      scoreAfter: "riktige i",
      correctPlural: "Riktige",
      wrong: "Feil",
      chooseNewActivity: "Velg ny øvelse",
      reviewErrors: "Se gjennom {count} feil",
      challengeKicker: "Utfordring fra en venn",
      challengeTitle: "Du har blitt utfordret!",
      challengeDescription:
        "Du får nøyaktig samme land og svaralternativer i samme rekkefølge.",
      challengeCode: "Utfordringskode",
      scoreToMatch: "Resultat å matche",
      questionsLabel: "Spørsmål",
      startChallenge: "Start utfordringen",
      unverifiedScore:
        "Poengsummen i lenken kunne ikke bekreftes. Du kan fortsatt spille den samme runden.",
      invalidChallengeKicker: "Ugyldig utfordring",
      invalidChallengeTitle: "Denne utfordringslenken virker ikke.",
      invalidChallengeDescription:
        "Lenken mangler en gyldig spilltype, region, versjon eller utfordringskode.",
      challengeBeat: "Du slo resultatet på {target} poeng!",
      challengeTied: "Du matchet resultatet: {target} poeng.",
      challengePerfectTied:
        "Perfekt! Du matchet utfordringen med full poengsum.",
      challengeMissed:
        "Du fikk {score} poeng; resultatet å matche var {target}.",
      shareChallenge: "Utfordre en venn",
      nativeShare: "Del",
      roundLabel: "Runde",
      copyChallengeLink: "Kopier lenke",
      copyChallengeLinkFull: "Kopier utfordringslenke",
      challengeLinkCopied: "Utfordringslenken er kopiert.",
      challengeCopyFailed: "Kunne ikke kopiere utfordringslenken.",
      challengeShareFailed: "Kunne ikke dele lenken. Prøv å kopiere den.",
      challengeShareTitle: "Hei verden! – en utfordring",
      challengeShareText:
        "Jeg fikk {score} av {total} i {mode}. Klarer du å slå meg?",
      openChallenge: "Åpne utfordring",
      openChallengePrompt: "Har du fått en utfordring?",
      openChallengeDescription:
        "Lim inn hele utfordringslenken for å åpne den her.",
      challengeUrlLabel: "Utfordringslenke",
      challengeUrlPlaceholder: "https://…",
      cancel: "Avbryt",
      challengeUrlRequired: "Lim inn en utfordringslenke.",
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
      back: "Tilbake",
      flashcardsComplete: "Flashcards fullført",
      roundComplete: "Runden er ferdig.",
      flashcardsSummaryBefore: "Du har gått gjennom",
      flashcardsSummaryAfter: "flagg fra",
      restart: "Start på nytt",
      finish: "Avslutt",
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
      mapQuizDescription: "Kartquizen bruker ett regionkart om gangen.",
      chooseRegion: "Velg region",
      metaTitle: "Hei verden! – lær land, flagg, hovedsteder og kart",
      metaDescription:
        "Utforsk og test deg selv på 196 land, flagg, hovedsteder og regionale kart.",
    }),
    en: Object.freeze({
      loadError: "Hello World! could not load the country data.",
      modeCountryFlagShort: "Flags",
      modeFlagCountryShort: "Countries",
      modeCountryCapitalShort: "Capitals",
      modeMapCountry: "Map quiz",
      modeMapCountryShort: "Maps",
      maps: "Maps",
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
      heroKicker: "Explore countries, flags and maps",
      heroTitleBefore: "How well do you know the",
      heroTitleEmphasis: "world?",
      chooseArea: "Choose area",
      chooseActivity: "Choose activity",
      testYourself: "Test yourself",
      explore: "Explore",
      exploreCountries: "Explore countries",
      list: "List",
      map: "Map",
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
      percentCorrect: "{percentage} per cent correct",
      resultLabel: "Result",
      resultPercentSuffix: "%",
      resultExcellent: "Impressive!",
      resultGreat: "Well done!",
      resultGood: "You’re on your way.",
      resultTryAgain: "The world awaits.",
      scoreBefore: "You got",
      scoreOf: "out of",
      scoreAfter: "correct in",
      correctPlural: "Correct",
      wrong: "Wrong",
      chooseNewActivity: "Choose another activity",
      reviewErrors:
        "Review {count} {count, plural, one {mistake} other {mistakes}}",
      challengeKicker: "A challenge from a friend",
      challengeTitle: "You’ve been challenged!",
      challengeDescription:
        "You will get exactly the same countries and answer choices in the same order.",
      challengeCode: "Challenge code",
      scoreToMatch: "Score to match",
      questionsLabel: "Questions",
      startChallenge: "Start challenge",
      unverifiedScore:
        "The score in this link could not be verified. You can still play the same round.",
      invalidChallengeKicker: "Invalid challenge",
      invalidChallengeTitle: "This challenge link does not work.",
      invalidChallengeDescription:
        "The link is missing a valid game type, region, version, or challenge code.",
      challengeBeat: "You beat the score of {target}!",
      challengeTied: "You matched the score: {target}.",
      challengePerfectTied:
        "Perfect! You matched the challenge with a full score.",
      challengeMissed: "You scored {score}; the score to match was {target}.",
      shareChallenge: "Challenge a friend",
      nativeShare: "Share",
      roundLabel: "Round",
      copyChallengeLink: "Copy link",
      copyChallengeLinkFull: "Copy challenge link",
      challengeLinkCopied: "Challenge link copied.",
      challengeCopyFailed: "Could not copy the challenge link.",
      challengeShareFailed: "Could not share the link. Try copying it instead.",
      challengeShareTitle: "Hello World! – a challenge",
      challengeShareText:
        "I scored {score} out of {total} in {mode}. Can you beat me?",
      openChallenge: "Open challenge",
      openChallengePrompt: "Have you received a challenge?",
      openChallengeDescription:
        "Paste the complete challenge link to open it here.",
      challengeUrlLabel: "Challenge link",
      challengeUrlPlaceholder: "https://…",
      cancel: "Cancel",
      challengeUrlRequired: "Paste a challenge link.",
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
      back: "Back",
      flashcardsComplete: "Flashcards complete",
      roundComplete: "The round is complete.",
      flashcardsSummaryBefore: "You have reviewed",
      flashcardsSummaryAfter: "flags from",
      restart: "Start again",
      finish: "Finish",
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
      mapQuizDescription: "The map quiz uses one regional map at a time.",
      chooseRegion: "Choose region",
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

  function readChallengeUrl(url) {
    const challengeKeys = ["cv", "seed", "score", "proof"];
    if (!challengeKeys.some((key) => url.searchParams.has(key))) {
      return null;
    }

    const version = Number(url.searchParams.get("cv"));
    const mode = url.searchParams.get("mode");
    const region = url.searchParams.get("region");
    const seed = challenge.normalizeSeed(url.searchParams.get("seed"));
    const validMode = modes.some((option) => option.id === mode);
    const validRegion = regionOptions.some((option) => option.id === region);
    const compatibleMapRegion =
      mode !== "map-country" || mapSelectableRegions.includes(region);

    if (
      version !== challenge.VERSION ||
      !validMode ||
      !validRegion ||
      !seed ||
      !compatibleMapRegion
    ) {
      return { valid: false };
    }

    return {
      valid: true,
      version,
      mode,
      region,
      seed,
      scoreParam: url.searchParams.get("score"),
      proof: url.searchParams.get("proof"),
    };
  }

  const initialChallenge = readChallengeUrl(initialUrl);

  const state = {
    locale: initialLocale,
    screen:
      initialChallenge?.valid === true
        ? "challenge-intro"
        : initialChallenge?.valid === false
          ? "challenge-error"
          : "setup",
    mode: initialChallenge?.valid ? initialChallenge.mode : "country-flag",
    region: initialChallenge?.valid
      ? initialChallenge.region
      : regionOptions.some(
            (region) => region.id === initialUrl.searchParams.get("region"),
          )
        ? initialUrl.searchParams.get("region")
        : "world",
    quizSeed: initialChallenge?.valid ? initialChallenge.seed : null,
    challengeVersion: initialChallenge?.valid
      ? initialChallenge.version
      : challenge.VERSION,
    challengeActive: initialChallenge?.valid === true,
    challengeTargetScore: null,
    challengeScoreVerified: false,
    challengeScoreWarning: initialChallenge?.valid === true,
    challengeScoreParam: initialChallenge?.valid
      ? initialChallenge.scoreParam
      : null,
    challengeProof: initialChallenge?.valid ? initialChallenge.proof : null,
    shareStatus: null,
    shareProof: null,
    shareProofPending: false,
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
    exploreView: "list",
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
    let value = messages[state.locale][key];
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

  function createQuestions(pool, choiceCount = 9, mode = null, seed) {
    return challenge.createQuestions({
      pool,
      allCountries: countries,
      flagDistractorGroups,
      flagConflictPairs,
      choiceCount,
      mode,
      seed,
      version: state.challengeVersion,
    });
  }

  function selectedMode() {
    return modes.find((mode) => mode.id === state.mode);
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
    if (state.locale === "nb") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", state.locale);
    }
    if (state.region === "world" && !state.challengeActive) {
      url.searchParams.delete("region");
    } else {
      url.searchParams.set("region", state.region);
    }
    if (state.challengeActive) {
      url.searchParams.set("cv", String(state.challengeVersion));
      url.searchParams.set("mode", state.mode);
      url.searchParams.set("seed", state.quizSeed);
      if (state.challengeScoreParam !== null) {
        url.searchParams.set("score", state.challengeScoreParam);
      } else {
        url.searchParams.delete("score");
      }
      if (state.challengeProof !== null) {
        url.searchParams.set("proof", state.challengeProof);
      } else {
        url.searchParams.delete("proof");
      }
    } else {
      ["cv", "mode", "seed", "score", "proof"].forEach((key) =>
        url.searchParams.delete(key),
      );
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
            <label for="challenge-url">${t("challengeUrlLabel")}</label>
            <input
              id="challenge-url"
              name="challenge-url"
              type="url"
              inputmode="url"
              autocomplete="off"
              autocapitalize="none"
              spellcheck="false"
              placeholder="${escapeHtml(t("challengeUrlPlaceholder"))}"
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

  function setupMarkup() {
    const installAction = installActionMarkup();
    return `
      <div class="setup-page">
      <main class="site-shell setup-shell">
        <header class="brand-bar">
          ${brandMarkup(false, false)}
          ${siteHomeLinkMarkup()}
        </header>

        <section class="hero" id="top">
          <div class="hero-content">
            <p class="kicker">${t("heroKicker")}</p>
            <h1>${t("heroTitleBefore")} <em>${t("heroTitleEmphasis")}</em></h1>
          </div>
          <img class="hero-globe" src="./favicon.svg" alt="" aria-hidden="true" draggable="false" />
        </section>

        <section class="region-panel" aria-labelledby="region-heading">
          <h2 id="region-heading">${t("chooseArea")}</h2>
          <div class="region-picker-layout">
            ${worldMapMarkup()}
            <div class="region-grid">
              ${regionOptions
                .map((option) => {
                  const count = countriesInRegion(option.id).length;
                  return `
                    <button
                      class="region-card ${state.region === option.id ? "is-selected" : ""}"
                      data-action="region"
                      data-value="${option.id}"
                      data-map-region="${option.id}"
                      aria-pressed="${state.region === option.id}"
                    >
                      <span>${regionLabel(option)}</span>
                      <small>${countryCount(count)}</small>
                    </button>
                  `;
                })
                .join("")}
            </div>
          </div>
        </section>

        <section class="action-section" aria-label="${escapeHtml(t("chooseActivity"))}">
          <div class="activity-panels">
            <section
              class="activity-panel guess-panel"
              aria-labelledby="guess-panel-heading"
            >
              <h2 id="guess-panel-heading">${t("testYourself")}</h2>
              <div class="activity-grid guess-actions">
                ${modes
                  .map((option) => {
                    return `
                      <button
                        class="activity-button tone-${option.tone}"
                        data-action="mode"
                        data-value="${option.id}"
                      >
                        <strong>${t(option.shortLabelKey)}</strong>
                      </button>
                    `;
                  })
                  .join("")}
                <button
                  class="activity-button tone-blue"
                  data-action="flashcards"
                >
                  <strong>Flashcards</strong>
                </button>
              </div>
            </section>

            <section
              class="activity-panel explore-panel"
              aria-labelledby="explore-panel-heading"
            >
              <h2 id="explore-panel-heading">${t("exploreCountries")}</h2>
              <div class="activity-grid explore-actions">
                <button
                  class="activity-button tone-plum"
                  data-action="explore"
                  data-value="list"
                >
                  <strong>${t("list")}</strong>
                </button>
                <button
                  class="activity-button tone-map"
                  data-action="explore"
                  data-value="map"
                >
                  <strong>${t("maps")}</strong>
                </button>
              </div>
            </section>
          </div>
          <div class="open-challenge-entry">
            <span>${t("openChallengePrompt")}</span>
            <button class="secondary-button" type="button" data-action="open-challenge">
              ${t("openChallenge")}
            </button>
          </div>
        </section>

        <footer>
          <span class="copyright">&copy; 2026 Lance Olav Eastgate</span>
          <span class="license-links">
            <a href="./licenses/flag-icons-MIT.txt">${t("flagsLicence")}</a>
            <a href="./licenses/twemoji-CC-BY-4.0.txt">${t("globeLicence")}</a>
            <a href="./licenses/natural-earth-public-domain.txt">${t("mapLicence")}</a>
          </span>
        </footer>
        ${installHelpMarkup()}
        ${openChallengeMarkup()}
      </main>
        ${installAction}
      </div>
    `;
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

  function challengeCodeMarkup() {
    return `
      <div class="challenge-code-block">
        <span>${t("challengeCode")}</span>
        <strong>${escapeHtml(state.quizSeed)}</strong>
      </div>
    `;
  }

  function challengeIntroMarkup() {
    const mode = selectedMode();
    const questionTotal = countriesInRegion(state.region).length;
    return `
      <main class="quiz-shell challenge-shell">
        <header class="quiz-header">
          ${brandMarkup(true, false)}
          ${homeButtonMarkup()}
        </header>
        <section class="challenge-card challenge-intro-card">
          <p class="kicker">${t("challengeKicker")}</p>
          <h1>${t("challengeTitle")}</h1>
          <p>${t("challengeDescription")}</p>
          ${challengeCodeMarkup()}
          <div class="challenge-details${state.challengeScoreVerified ? " has-score" : ""}">
            <div><span>${t("testYourself")}</span><strong>${t(mode.shortLabelKey)}</strong></div>
            <div><span>${t("chooseArea")}</span><strong>${regionLabel(selectedRegion())}</strong></div>
            <div><span>${t("questionsLabel")}</span><strong>${questionTotal}</strong></div>
            ${
              state.challengeScoreVerified
                ? `<div><span>${t("scoreToMatch")}</span><strong>${state.challengeTargetScore} / ${questionTotal}</strong></div>`
                : ""
            }
          </div>
          ${
            state.challengeScoreWarning
              ? `<p class="challenge-warning" role="status">${t("unverifiedScore")}</p>`
              : ""
          }
          <div class="challenge-intro-actions">
            <button class="primary-button" data-action="start-challenge">
              ${t("startChallenge")} <span aria-hidden="true">→</span>
            </button>
            <button class="challenge-intro-copy" data-action="copy-intro-challenge">
              ${t("copyChallengeLinkFull")}
            </button>
            <p class="challenge-intro-status" data-challenge-status aria-live="polite">${state.shareStatus ? t(state.shareStatus) : ""}</p>
          </div>
        </section>
      </main>
    `;
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

  function challengeShareMarkup() {
    return `
      <section class="challenge-share" aria-labelledby="challenge-share-heading">
        <div class="challenge-share-heading">
          <h2 id="challenge-share-heading">${t("shareChallenge")}</h2>
          <span>${t("roundLabel")} <strong>${escapeHtml(state.quizSeed)}</strong></span>
        </div>
        <div class="challenge-share-actions">
          ${
            typeof navigator.share === "function"
              ? `<button class="secondary-button" data-action="share-challenge" ${state.shareProof ? "" : "disabled"}>${t("nativeShare")}</button>`
              : ""
          }
          <button class="secondary-button" data-action="copy-challenge" ${state.shareProof ? "" : "disabled"}>
            ${t("copyChallengeLink")}
          </button>
        </div>
        <p class="challenge-share-status" data-challenge-status aria-live="polite">${state.shareStatus ? t(state.shareStatus) : ""}</p>
      </section>
    `;
  }

  function resultMarkup() {
    const hasReview = state.wrongAnswers.length > 0;
    const percentage = Math.round((state.score / state.questions.length) * 100);
    const heading =
      percentage >= 90
        ? t("resultExcellent")
        : percentage >= 70
          ? t("resultGreat")
          : percentage >= 50
            ? t("resultGood")
            : t("resultTryAgain");

    return `
      <main class="quiz-shell result-shell ${hasReview ? "has-review" : ""}">
        <header class="quiz-header">
          ${brandMarkup(true, false)}
          ${homeButtonMarkup()}
        </header>
        <section class="result-card">
          <div class="result-summary-main">
            <div class="result-overview">
              <div class="result-overview-meta">
                <span>${t("resultLabel")}</span>
                <span
                  class="result-overview-mode"
                  aria-label="${escapeHtml(`${t("testYourself")}: ${t(selectedMode().shortLabelKey)}`)}"
                >${t(selectedMode().shortLabelKey)}</span>
              </div>
              <div class="result-score" aria-label="${escapeHtml(t("percentCorrect", { percentage }))}">
                <strong>${percentage}</strong><span class="result-score-percent">${t("resultPercentSuffix")}</span>
              </div>
              <p>
                ${t("scoreBefore")} <strong>${state.score}</strong> ${t("scoreOf")}
                <strong>${state.questions.length}</strong> ${t("scoreAfter")}
                <strong>${regionLabelInSentence(selectedRegion())}</strong>.
              </p>
            </div>
            <h1>${heading}</h1>
            ${challengeComparisonMarkup()}
          </div>
          <div class="result-summary-support">
            ${challengeShareMarkup()}
            <div class="result-actions">
              <button class="primary-button" data-action="setup">
                ${t("chooseNewActivity")}
                <span aria-hidden="true">→</span>
              </button>
              ${
                hasReview
                  ? `
                    <button class="review-jump" data-action="review">
                      ${t("reviewErrors", { count: state.wrongAnswers.length })}
                      <span aria-hidden="true">↓</span>
                    </button>
                  `
                  : ""
              }
            </div>
          </div>
        </section>
        ${reviewMarkup()}
      </main>
    `;
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
          ${
            viewingMap
              ? mapAvailable
                ? exploreRegionMapMarkup(sortedCountries)
                : exploreMapRegionPromptMarkup()
              : exploreListMarkup(sortedCountries, modalCountry)
          }
        </div>
      </main>
    `;
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
              <button class="primary-button" data-action="restart-flashcards">
                ${t("restart")} <span aria-hidden="true">↻</span>
              </button>
              <button class="secondary-button" data-action="setup">${t("chooseNewActivity")}</button>
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
            ${regionalQuestionMapMarkup(state.region, question.country.code)}
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
            <span>${regionLabel(selectedRegion())}</span>
            ${state.challengeActive ? `<span class="challenge-meta-code">${escapeHtml(state.quizSeed)}</span>` : ""}
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

  function mapQuizRegionMarkup() {
    return `
      <main class="quiz-shell map-region-shell">
        <header class="quiz-header">
          ${brandMarkup(true, false)}
          ${homeButtonMarkup("cancel-map-region")}
        </header>
        <div class="map-region-step">
          ${mapRegionPromptMarkup({
            action: "quiz-map-region",
            description: t("mapQuizDescription"),
            heading: t("chooseRegion"),
            headingId: "quiz-map-region-heading",
            kicker: t("modeMapCountry"),
          })}
        </div>
      </main>
    `;
  }

  function screenMarkup() {
    switch (state.screen) {
      case "setup":
        return setupMarkup();
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
      case "map-region":
        return mapQuizRegionMarkup();
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
    if (state.screen === "result") prepareChallengeShare();

    document.body?.classList.toggle(
      "modal-open",
      state.modalCode !== null ||
        state.installHelpOpen ||
        state.openChallengeOpen,
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
      const input = app.querySelector("#challenge-url");
      input?.focus();
      if (options.selectOpenChallengeInput) input?.select();
    }
    if (options.focusOpenChallengeButton) {
      app.querySelector('[data-action="open-challenge"]')?.focus();
    }
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
    if (options.focusMapRegion) {
      app.querySelector('[data-action="quiz-map-region"]')?.focus();
    }
    if (options.focusSetupMap) {
      app
        .querySelector('[data-action="mode"][data-value="map-country"]')
        ?.focus();
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
      state.screen = "result";
    } else {
      state.questionIndex += 1;
      state.selectedCode = null;
      state.answerStatus = "unanswered";
    }
    renderAtTop();
  }

  function startQuiz(mode, { challengeRound = false } = {}) {
    clearAutoAdvance();
    setKeyboardHintsVisible(false);
    if (!challengeRound) {
      state.challengeActive = false;
      state.challengeTargetScore = null;
      state.challengeScoreVerified = false;
      state.challengeScoreWarning = false;
      state.challengeScoreParam = null;
      state.challengeProof = null;
      state.challengeVersion = challenge.VERSION;
      state.quizSeed = null;
    }
    if (
      mode === "map-country" &&
      !mapSelectableRegions.includes(state.region)
    ) {
      state.mode = mode;
      state.questions = [];
      state.screen = "map-region";
      renderAtTop({ focusMapRegion: true });
      return;
    }
    if (!state.quizSeed) state.quizSeed = challenge.createRandomSeed();
    state.mode = mode;
    const modeConfig = modes.find((option) => option.id === mode);
    state.questions = createQuestions(
      countriesInRegion(state.region),
      modeConfig?.choiceCount,
      mode,
      state.quizSeed,
    );
    state.questionIndex = 0;
    state.selectedCode = null;
    state.answerStatus = "unanswered";
    state.silhouetteExpanded = false;
    state.score = 0;
    state.wrongAnswers = [];
    state.shareStatus = null;
    state.shareProof = null;
    state.shareProofPending = false;
    state.screen = "quiz";
    renderAtTop();
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

  function canonicalChallengeUrl(recipe, locale = state.locale) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    if (locale === "en") url.searchParams.set("lang", "en");
    url.searchParams.set("cv", String(recipe.version));
    url.searchParams.set("mode", recipe.mode);
    url.searchParams.set("region", recipe.region);
    url.searchParams.set("seed", recipe.seed);
    if (recipe.scoreParam !== null) {
      url.searchParams.set("score", recipe.scoreParam);
    }
    if (recipe.proof !== null) url.searchParams.set("proof", recipe.proof);
    return url;
  }

  function canonicalImportedChallengeUrl(sourceUrl, recipe) {
    const locale = sourceUrl.searchParams.get("lang") === "en" ? "en" : "nb";
    return canonicalChallengeUrl(recipe, locale);
  }

  function openPastedChallenge(value) {
    const trimmedValue = value.trim();
    state.openChallengeValue = trimmedValue;
    if (!trimmedValue) {
      state.openChallengeError = "challengeUrlRequired";
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

    const recipe = readChallengeUrl(sourceUrl);
    if (!recipe?.valid) {
      state.openChallengeError = "challengeUrlInvalid";
      render({
        focusOpenChallengeInput: true,
        selectOpenChallengeInput: true,
      });
      return;
    }

    window.location.assign(canonicalImportedChallengeUrl(sourceUrl, recipe));
  }

  function scoreProofRecipe(score = state.score) {
    return {
      version: state.challengeVersion,
      mode: state.mode,
      region: state.region,
      seed: state.quizSeed,
      score,
    };
  }

  function setShareStatus(messageKey) {
    state.shareStatus = messageKey;
    const status = app.querySelector("[data-challenge-status]");
    if (status) status.textContent = t(messageKey);
  }

  function challengeIntroUrl() {
    return canonicalChallengeUrl({
      version: state.challengeVersion,
      mode: state.mode,
      region: state.region,
      seed: state.quizSeed,
      scoreParam: state.challengeScoreParam,
      proof: state.challengeProof,
    }).href;
  }

  function challengeShareUrl() {
    if (!state.shareProof) return null;
    return canonicalChallengeUrl({
      version: state.challengeVersion,
      mode: state.mode,
      region: state.region,
      seed: state.quizSeed,
      scoreParam: String(state.score),
      proof: state.shareProof,
    }).href;
  }

  async function prepareChallengeShare() {
    if (
      state.shareProof ||
      state.shareProofPending ||
      !state.quizSeed ||
      state.questions.length === 0
    ) {
      return;
    }
    state.shareProofPending = true;
    const expectedSeed = state.quizSeed;
    const expectedScore = state.score;
    try {
      const proof = await challenge.createScoreProof(
        scoreProofRecipe(expectedScore),
      );
      if (
        state.screen !== "result" ||
        state.quizSeed !== expectedSeed ||
        state.score !== expectedScore
      ) {
        return;
      }
      state.shareProof = proof;
      app
        .querySelectorAll('[data-action="share-challenge"], [data-action="copy-challenge"]')
        .forEach((button) => {
          button.disabled = false;
        });
    } catch {
      if (state.screen === "result") setShareStatus("challengeShareFailed");
    } finally {
      state.shareProofPending = false;
    }
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

  async function shareChallenge(useNativeShare) {
    const url = challengeShareUrl();
    if (!url) return;
    const shareData = {
      title: t("challengeShareTitle"),
      text: t("challengeShareText", {
        score: state.score,
        total: state.questions.length,
        mode: t(selectedMode().shortLabelKey),
      }),
      url,
    };
    const usesNativeShare =
      useNativeShare && typeof navigator.share === "function";
    try {
      if (usesNativeShare) {
        await navigator.share(shareData);
      } else {
        await copyText(url);
        setShareStatus("challengeLinkCopied");
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        setShareStatus(
          usesNativeShare ? "challengeShareFailed" : "challengeCopyFailed",
        );
      }
    }
  }

  async function copyIntroChallenge() {
    try {
      await copyText(challengeIntroUrl());
      setShareStatus("challengeLinkCopied");
    } catch {
      setShareStatus("challengeCopyFailed");
    }
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

  function startFlashcards() {
    clearAutoAdvance();
    setKeyboardHintsVisible(false);
    state.flashcards = shuffle(countriesInRegion(state.region));
    state.flashcardIndex = 0;
    state.flashcardRevealed = false;
    state.silhouetteExpanded = false;
    state.modalCode = null;
    state.screen = "flashcards";
    renderAtTop({ focusFlashcard: true });
  }

  function returnToSetup({ focusMapQuiz = false } = {}) {
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
    state.quizSeed = null;
    state.challengeVersion = challenge.VERSION;
    state.challengeActive = false;
    state.challengeTargetScore = null;
    state.challengeScoreVerified = false;
    state.challengeScoreWarning = false;
    state.challengeScoreParam = null;
    state.challengeProof = null;
    state.shareStatus = null;
    state.shareProof = null;
    state.shareProofPending = false;
    resetExploreCountryState();
    syncUrlState();
    renderAtTop({ focusSetupMap: focusMapQuiz });
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

    if (action === "install-app") {
      void requestInstall();
      return;
    }

    if (action === "share-challenge") {
      void shareChallenge(true);
      return;
    }

    if (action === "copy-challenge") {
      void shareChallenge(false);
      return;
    }

    if (action === "copy-intro-challenge") {
      void copyIntroChallenge();
      return;
    }

    if (action === "start-challenge") {
      startQuiz(state.mode, { challengeRound: true });
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

    if (action === "mode") {
      startQuiz(control.dataset.value);
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

    if (action === "quiz-map-region") {
      if (!updateRegion(control.dataset.value)) return;
      startQuiz("map-country");
      return;
    }

    if (action === "cancel-map-region") {
      returnToSetup({ focusMapQuiz: true });
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

    if (action === "flashcards" || action === "restart-flashcards") {
      startFlashcards();
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
    openPastedChallenge(form.elements.namedItem("challenge-url")?.value ?? "");
  });

  app.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.target?.id !== "challenge-url") return;
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

  function applyResultPreviewFromUrl() {
    if (initialChallenge !== null) return;
    const scenario = initialUrl.searchParams.get("_result");
    if (!["perfect", "mixed", "wrong"].includes(scenario)) return;

    const requestedMode = initialUrl.searchParams.get("_mode");
    const previewMode = modes.some((mode) => mode.id === requestedMode)
      ? requestedMode
      : "country-flag";
    const previewCountries = countriesInRegion(state.region);
    const total = previewCountries.length;
    const score =
      scenario === "perfect"
        ? total
        : scenario === "mixed"
          ? Math.ceil((total * 2) / 3)
          : 0;

    state.screen = "result";
    state.mode = previewMode;
    state.quizSeed = "ABCDE";
    state.questions = previewCountries.map((country) => ({ country }));
    state.score = score;
    state.wrongAnswers = previewCountries.slice(score);
  }

  async function validateInitialChallengeScore() {
    if (!initialChallenge?.valid) return;
    const scoreText = initialChallenge.scoreParam;
    const score = /^\d+$/.test(scoreText ?? "") ? Number(scoreText) : NaN;
    const maximum = countriesInRegion(initialChallenge.region).length;
    if (
      !Number.isSafeInteger(score) ||
      score < 0 ||
      score > maximum ||
      !initialChallenge.proof
    ) {
      return;
    }

    const recipe = {
      version: initialChallenge.version,
      mode: initialChallenge.mode,
      region: initialChallenge.region,
      seed: initialChallenge.seed,
      score,
    };
    if (
      await challenge.verifyScoreProof(
        recipe,
        initialChallenge.proof,
      )
    ) {
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
    applyResultPreviewFromUrl();
    if (state.screen !== "challenge-error") syncUrlState();
    render();
  }

  void initialize();
})();
