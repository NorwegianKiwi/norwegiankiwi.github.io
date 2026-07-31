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
  const app = document.getElementById("app");

  if (!data || !distractorData || !mapData || !app) {
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
      installApp: "Installer app",
      installHelpTitle: "Legg til på Hjem-skjermen",
      installHelpText:
        "Trykk på Del i nettleseren, velg «Legg til på Hjem-skjermen», slå på «Åpne som webapp», og trykk «Legg til».",
      closeInstallHelp: "Lukk",
      review: "Gjennomgang",
      reviewHeading: "Dette kan du øve mer på",
      reviewCount: "{count} land å se nærmere på.",
      resultComplete: "Øvelsen er fullført",
      percentCorrect: "{percentage} prosent riktig",
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
      chooseCountry: "Velg et land",
      countryCapital: "{name}, hovedstad {capital}",
      interactiveRegionMap: "Interaktivt kart over {region}",
      countriesInRegion: "Land i regionen",
      mapZoomControls: "Kartzoom",
      zoomOutMap: "Zoom ut på kartet",
      zoomInMap: "Zoom inn på kartet",
      resetMapZoom: "Tilbakestill kartzoom, {percent} prosent",
      exploreMapDescription:
        "Regionkartet viser plasseringen og formen til hvert land.",
      exploreMapHeading: "Hvilket kart vil du utforske?",
      chooseSingleRegion: "Velg en enkelt region",
      tableFlag: "Flagg",
      tableCountry: "Land",
      tableCapital: "Hovedstad",
      showLargeFlag: "Vis flagget til {name} stort",
      largeFlag: "Stort flagg: {name}",
      closeModalHint: "Trykk hvor som helst for å lukke",
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
      installApp: "Install app",
      installHelpTitle: "Add to Home Screen",
      installHelpText:
        "Tap Share in the browser, choose “Add to Home Screen”, turn on “Open as Web App”, and tap “Add”.",
      closeInstallHelp: "Close",
      review: "Review",
      reviewHeading: "Here is what you can practise",
      reviewCount:
        "{count} {count, plural, one {country} other {countries}} to revisit.",
      resultComplete: "Practice complete",
      percentCorrect: "{percentage} per cent correct",
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
      chooseCountry: "Choose a country",
      countryCapital: "{name}, capital {capital}",
      interactiveRegionMap: "Interactive map of {region}",
      countriesInRegion: "Countries in the region",
      mapZoomControls: "Map zoom",
      zoomOutMap: "Zoom out of the map",
      zoomInMap: "Zoom into the map",
      resetMapZoom: "Reset map zoom, {percent} per cent",
      exploreMapDescription:
        "The regional map shows the location and shape of each country.",
      exploreMapHeading: "Which map would you like to explore?",
      chooseSingleRegion: "Choose a single region",
      tableFlag: "Flag",
      tableCountry: "Country",
      tableCapital: "Capital",
      showLargeFlag: "Show a large flag of {name}",
      largeFlag: "Large flag: {name}",
      closeModalHint: "Press anywhere to close",
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
    "africa",
    "asia",
    "oceania",
    "north-central-america",
    "south-america",
    "caribbean",
  ];
  const countriesByCode = new Map(
    countries.map((country) => [country.code, country]),
  );
  const flagDistractorCodesByCountry = new Map();
  const flagConflictCodesByCountry = new Map();

  flagDistractorGroups.forEach((group) => {
    group.codes.forEach((code) => {
      const relatedCodes = flagDistractorCodesByCountry.get(code) ?? new Set();
      group.codes.forEach((relatedCode) => {
        if (relatedCode !== code) relatedCodes.add(relatedCode);
      });
      flagDistractorCodesByCountry.set(code, relatedCodes);
    });
  });

  flagConflictPairs.forEach(([firstCode, secondCode]) => {
    const firstConflicts =
      flagConflictCodesByCountry.get(firstCode) ?? new Set();
    const secondConflicts =
      flagConflictCodesByCountry.get(secondCode) ?? new Set();
    firstConflicts.add(secondCode);
    secondConflicts.add(firstCode);
    flagConflictCodesByCountry.set(firstCode, firstConflicts);
    flagConflictCodesByCountry.set(secondCode, secondConflicts);
  });

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

  const state = {
    locale: initialLocale,
    screen: "setup",
    mode: "country-flag",
    region: regionOptions.some(
      (region) => region.id === initialUrl.searchParams.get("region"),
    )
      ? initialUrl.searchParams.get("region")
      : "world",
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
    exploreScrollTop: 0,
    exploreView: "list",
    explorePinnedCode: null,
    explorePreviewCode: null,
    exploreMapViewport: null,
  };
  let deferredInstallPrompt = null;
  let autoAdvanceTimer = null;
  let keyboardHintsVisible = false;
  const exploreMapPointers = new Map();
  let exploreMapGesture = null;
  let exploreMapDrag = null;
  let exploreMapUiFrame = null;
  let scrollAffordanceFrame = null;
  let suppressExploreMapClickUntil = 0;
  const exploreMapMaxZoom = 8;
  const exploreMapZoomLevels = [1, 1.5, 2, 3, 4, 6, 8];
  const exploreMapGeometryShowSize = 12;
  const exploreMapGeometryHideSize = 10;
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

  function selectCompatibleFlagDistractors(candidates, count, selectedCodes) {
    const selected = [];
    for (const candidate of shuffle(candidates)) {
      const conflicts = flagConflictCodesByCountry.get(candidate.code);
      if (
        selectedCodes.has(candidate.code) ||
        [...(conflicts ?? [])].some((code) => selectedCodes.has(code))
      ) {
        continue;
      }
      selected.push(candidate);
      selectedCodes.add(candidate.code);
      if (selected.length === count) break;
    }
    return selected;
  }

  function createQuestions(pool, choiceCount = 9, mode = null) {
    const usesFlagDistractors =
      mode === "country-flag" || mode === "flag-country";

    return shuffle(pool).map((country) => {
      let distractors;
      if (usesFlagDistractors) {
        const selectedCodes = new Set([country.code]);
        const relatedCandidates = [
          ...(flagDistractorCodesByCountry.get(country.code) ?? []),
        ].map((code) => countriesByCode.get(code));
        const relatedDistractors = selectCompatibleFlagDistractors(
          relatedCandidates,
          Math.min(2, choiceCount - 1),
          selectedCodes,
        );
        const randomDistractors = selectCompatibleFlagDistractors(
          pool,
          choiceCount - 1 - relatedDistractors.length,
          selectedCodes,
        );
        distractors = [...relatedDistractors, ...randomDistractors];
      } else {
        distractors = shuffle(
          pool.filter((item) => item.code !== country.code),
        ).slice(0, choiceCount - 1);
      }
      return {
        country,
        choices: shuffle([country, ...distractors]),
      };
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
    if (state.region === "world") {
      url.searchParams.delete("region");
    } else {
      url.searchParams.set("region", state.region);
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
    return `
      <path
        class="map-country ${mapShapeIsActive(region) ? "is-active" : ""}"
        d="${feature.path}"
        data-region="${escapeHtml(region ?? "")}"
        ${codeAttribute}
        vector-effect="non-scaling-stroke"
      />
    `;
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
    const paths = mapData.features
      .filter(
        (feature) => mapRegionForCode(feature.code) === regionId,
      )
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
        d="${feature.path}"
        vector-effect="non-scaling-stroke"
      />
    `;
  }

  function regionalMapMarkerMarkup(
    marker,
    className,
    radius,
  ) {
    return `
      <circle
        class="${className}"
        cx="${marker.x}"
        cy="${marker.y}"
        r="${radius}"
        vector-effect="non-scaling-stroke"
      />
    `;
  }

  function countrySilhouetteMarkup(
    countryCode,
    { interactive = true, expanded = state.silhouetteExpanded } = {},
  ) {
    const silhouette = mapData.silhouettes[countryCode];
    const hasSilhouettePath = Boolean(silhouette.path);
    const expandedMarkerRadius = hasSilhouettePath ? 0.4 : 0.75;
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
      `is-${silhouette.corner}`,
      hasSilhouettePath ? "has-silhouette-path" : "is-marker-only",
      interactive ? "is-interactive" : "is-preview-only",
      interactive && expanded ? "is-expanded" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const contents = `
      ${interactive ? '<span class="silhouette-toggle-icon" aria-hidden="true"></span>' : ""}
      <svg
        class="country-silhouette"
        viewBox="${mapData.silhouetteViewBox}"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
      >
        ${
          silhouette.path
            ? `<path class="country-silhouette-shape" d="${silhouette.path}" />`
            : ""
        }
        ${silhouetteMarkers}
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
    const [, , viewWidth] = view.viewBox.split(/\s+/).map(Number);
    const markerRadius = Math.min(3.8, Math.max(0.7, viewWidth * 0.0045));
    const contextFeatures = view.features.filter(
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

    const pathMarkup = (features, className) =>
      features
        .map((feature) => regionalMapPathMarkup(feature, className))
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
          viewBox="${view.viewBox}"
          role="img"
          aria-label="${escapeHtml(t("highlightedMap", { region: regionLabel(region) }))}"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect class="question-map-ocean" x="-1000" y="-500" width="3000" height="1500" />
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

  function installActionMarkup() {
    if (
      isStandalone() ||
      (!isIosDevice() && deferredInstallPrompt === null)
    ) {
      return "";
    }

    return `
      <button
        class="install-app-button"
        type="button"
        data-action="install-app"
      >
        <img src="./favicon.svg" alt="" aria-hidden="true" draggable="false" />
        <span>${t("installApp")}</span>
      </button>
    `;
  }

  function installHelpMarkup() {
    if (!state.installHelpOpen || !isIosDevice() || isStandalone()) return "";

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
          <h2 id="install-help-title">${t("installHelpTitle")}</h2>
          <p id="install-help-description">${t("installHelpText")}</p>
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

  function setupMarkup() {
    const installAction = installActionMarkup();
    return `
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
        </section>

        <footer>
          <span class="copyright">&copy; 2026 Lance Olav Eastgate</span>
          ${installAction}
          <span class="license-links">
            <a href="./licenses/flag-icons-MIT.txt">${t("flagsLicence")}</a>
            <a href="./licenses/twemoji-CC-BY-4.0.txt">${t("globeLicence")}</a>
            <a href="./licenses/natural-earth-public-domain.txt">${t("mapLicence")}</a>
          </span>
        </footer>
        ${installHelpMarkup()}
      </main>
    `;
  }

  function reviewMarkup() {
    if (state.wrongAnswers.length === 0) return "";

    return `
      <section class="result-review" id="result-review" aria-labelledby="review-heading">
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
          <p class="kicker">${t("resultComplete")}</p>
          <div class="result-score" aria-label="${escapeHtml(t("percentCorrect", { percentage }))}">
            <strong>${percentage}</strong><span>%</span>
          </div>
          <h1>${heading}</h1>
          <p>
            ${t("scoreBefore")} <strong>${state.score}</strong> ${t("scoreOf")}
            <strong>${state.questions.length}</strong> ${t("scoreAfter")}
            ${regionLabelInSentence(selectedRegion())}.
          </p>
          <div class="result-stats">
            <div><span>${t("correctPlural")}</span><strong>${state.score}</strong></div>
            <div>
              <span>${t("wrong")}</span>
              <strong>${state.questions.length - state.score}</strong>
            </div>
            <div><span>${t("testYourself")}</span><strong>${t(selectedMode().shortLabelKey)}</strong></div>
          </div>
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
    const activeCode = activeExploreCountryCode();
    if (!activeCode) return "";

    const isPinned = activeCode === state.explorePinnedCode;
    return countrySilhouetteMarkup(activeCode, {
      interactive: isPinned,
      expanded: isPinned && state.silhouetteExpanded,
    });
  }

  function exploreMapCountryMarkup(country, view, markerRadius, zoom) {
    const paths = view.features
      .filter((feature) => feature.code === country.code)
      .map((feature) =>
        regionalMapPathMarkup(feature, "explore-map-country-shape"),
      )
      .join("");
    const markerHitRadius = Math.max(11, markerRadius * 3.2);
    const markers = view.markers
      .filter((marker) => marker.code === country.code)
      .map(
        (marker) => `
          <circle
            class="explore-map-marker-hit"
            cx="${marker.x}"
            cy="${marker.y}"
            r="${markerHitRadius / zoom}"
            data-explore-marker-radius
            data-base-radius="${markerHitRadius}"
          />
        `,
      )
      .join("");
    const classes = [
      "explore-map-country",
      state.explorePinnedCode === country.code ? "is-pinned" : "",
      state.explorePreviewCode === country.code ? "is-preview" : "",
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
    markerRadius,
    zoom,
  ) {
    const regionCodes = new Set(sortedCountries.map((country) => country.code));
    const markerHitRadius = Math.max(11, markerRadius * 3.2);

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
            aria-hidden="true"
          >
            <circle
              class="explore-map-marker-top-hit"
              cx="${marker.x}"
              cy="${marker.y}"
              r="${markerHitRadius / zoom}"
              data-explore-marker-radius
              data-base-radius="${markerHitRadius}"
            />
            <circle
              class="explore-map-country-marker"
              cx="${marker.x}"
              cy="${marker.y}"
              r="${markerRadius / zoom}"
              data-explore-marker-radius
              data-base-radius="${markerRadius}"
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

  function getExploreMapViewport(baseViewBox) {
    const base = parseMapViewBox(baseViewBox);
    if (
      state.exploreMapViewport?.region !== state.region ||
      state.exploreMapViewport.base.width !== base.width ||
      state.exploreMapViewport.base.height !== base.height
    ) {
      state.exploreMapViewport = {
        region: state.region,
        base,
        view: { ...base },
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

    svg.setAttribute("viewBox", serializeMapViewBox(viewport.view));
    const zoom = exploreMapZoom(viewport);
    const percent = Math.round(zoom * 100);
    const zoomOut = app.querySelector('[data-action="explore-map-zoom-out"]');
    const zoomIn = app.querySelector('[data-action="explore-map-zoom-in"]');
    const reset = app.querySelector('[data-action="explore-map-zoom-reset"]');
    const map = app.querySelector(".explore-region-map");

    if (zoomOut) zoomOut.disabled = zoom <= 1.001;
    if (zoomIn) zoomIn.disabled = zoom >= exploreMapMaxZoom - 0.001;
    map?.classList.toggle("is-zoomed", zoom > 1.001);
    svg.querySelectorAll("[data-explore-marker-radius]").forEach((marker) => {
      marker.setAttribute("r", Number(marker.dataset.baseRadius) / zoom);
    });
    const countryControls = new Map(
      [...svg.querySelectorAll(".explore-map-country[data-explore-code]")].map(
        (control) => [control.dataset.exploreCode, control],
      ),
    );
    svg
      .querySelectorAll(".explore-map-marker-control[data-explore-code]")
      .forEach((markerControl) => {
        const countryControl = countryControls.get(
          markerControl.dataset.exploreCode,
        );
        if (!countryControl) return;

        const threshold = markerControl.classList.contains(
          "is-geometry-readable",
        )
          ? exploreMapGeometryHideSize
          : exploreMapGeometryShowSize;
        const geometryReadable = [
          ...countryControl.querySelectorAll(".explore-map-country-shape"),
        ].some((shape) => {
          const bounds = shape.getBoundingClientRect();
          return bounds.width >= threshold && bounds.height >= threshold;
        });

        markerControl.classList.toggle(
          "is-geometry-readable",
          geometryReadable,
        );
        countryControl.classList.toggle(
          "is-geometry-readable",
          geometryReadable,
        );
      });
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
    const view = mapData.quizRegions[state.region];
    const mapViewport = getExploreMapViewport(view.viewBox);
    const zoom = exploreMapZoom(mapViewport);
    const zoomPercent = Math.round(zoom * 100);
    const [, , viewWidth] = view.viewBox.split(/\s+/).map(Number);
    const markerRadius = Math.min(3.8, Math.max(1.4, viewWidth * 0.0045));
    const contextPaths = view.features
      .filter((feature) => mapRegionForCode(feature.code) !== state.region)
      .map((feature) =>
        regionalMapPathMarkup(feature, "explore-map-context-shape"),
      )
      .join("");

    return `
      <div class="explore-map-layout">
        <div class="explore-region-map${zoom > 1.001 ? " is-zoomed" : ""}${state.silhouetteExpanded ? " has-expanded-silhouette" : ""}">
          <svg
            data-explore-map-svg
            viewBox="${serializeMapViewBox(mapViewport.view)}"
            role="group"
            aria-label="${escapeHtml(t("interactiveRegionMap", {
              region: regionLabel(selectedRegion()),
            }))}"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect class="question-map-ocean" x="-1000" y="-500" width="3000" height="1500" />
            <g aria-hidden="true">${contextPaths}</g>
            ${sortedCountries
              .map((country) =>
                exploreMapCountryMarkup(country, view, markerRadius, zoom),
              )
              .join("")}
            ${exploreMapMarkerLayerMarkup(
              sortedCountries,
              view,
              markerRadius,
              zoom,
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
                  <tr>
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
                ${
                  countryNote(modalCountry)
                    ? `<p class="country-note">${escapeHtml(countryNote(modalCountry))}</p>`
                    : ""
                }
                <span class="modal-close-hint">${t("closeModalHint")}</span>
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
    const sortedCountries = [...countriesInRegion(state.region)].sort((a, b) =>
      collator.compare(countryName(a), countryName(b)),
    );
    const mapAvailable = mapSelectableRegions.includes(state.region);
    const viewingMap = state.exploreView === "map";
    const exploreLabel = `${t("explore")} · ${regionLabel(region)}`;

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
            <span class="explore-context-region">${regionLabel(region)}</span>
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
    scheduleScrollAffordanceUpdate();
    if (state.screen === "explore" && state.exploreView === "map") {
      scheduleExploreMapZoomUi();
    }

    document.body?.classList.toggle(
      "modal-open",
      state.modalCode !== null || state.installHelpOpen,
    );

    if (options.focusCorrect) app.querySelector(".is-correction")?.focus();
    if (options.focusModal) app.querySelector(".flag-modal")?.focus();
    if (options.focusInstallHelp) {
      app.querySelector(".install-help-close")?.focus();
    }
    if (options.focusInstallButton) {
      app.querySelector('[data-action="install-app"]')?.focus();
    }
    if (options.focusFlagCode) {
      app
        .querySelector(
          `[data-action="open-flag"][data-code="${options.focusFlagCode}"]`,
        )
        ?.focus();
    }
    if (options.focusFlashcard) {
      app.querySelector('[data-action="flashcard-toggle"]')?.focus();
    }
    if (options.focusExploreHeading) {
      app.querySelector(".explore-context")?.focus({ preventScroll: true });
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

  function resetExploreCountryState() {
    state.explorePinnedCode = null;
    state.explorePreviewCode = null;
    state.exploreMapViewport = null;
    state.silhouetteExpanded = false;
    exploreMapPointers.clear();
    exploreMapGesture = null;
    exploreMapDrag = null;
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
    state.silhouetteExpanded = false;
    syncExploreCountryUi();
  }

  function pinExploreCountry(code, { scrollCard = false } = {}) {
    if (!countriesByCode.has(code)) return;
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
      state.exploreMapViewport = null;
      exploreMapPointers.clear();
      exploreMapGesture = null;
      exploreMapDrag = null;
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

  function startQuiz(mode) {
    clearAutoAdvance();
    setKeyboardHintsVisible(false);
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
    state.mode = mode;
    const modeConfig = modes.find((option) => option.id === mode);
    state.questions = createQuestions(
      countriesInRegion(state.region),
      modeConfig?.choiceCount,
      mode,
    );
    state.questionIndex = 0;
    state.selectedCode = null;
    state.answerStatus = "unanswered";
    state.silhouetteExpanded = false;
    state.score = 0;
    state.wrongAnswers = [];
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

  function closeFlagModal() {
    const code = state.modalCode;
    state.modalCode = null;
    render({ focusFlagCode: code });
    window.scrollTo({ top: state.exploreScrollTop });
  }

  function closeInstallHelp() {
    if (!state.installHelpOpen) return;
    state.installHelpOpen = false;
    render({ focusInstallButton: true });
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
    resetExploreCountryState();
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
    if (!control || !app.contains(control)) return;

    const action = control.dataset.action;

    if (action === "install-app") {
      void requestInstall();
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
      closeFlagModal();
      return;
    }

    if (action === "review") {
      document
        .getElementById("result-review")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (action === "setup") {
      returnToSetup();
    }
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
    if (state.installHelpOpen && event.key === "Tab") {
      const dialog = app.querySelector(".install-help-dialog");
      const focusable = dialog
        ? [
            ...dialog.querySelectorAll(
              "button, a[href], [tabindex]:not([tabindex='-1'])",
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

    const expandableSilhouetteVisible =
      (state.screen === "quiz" && state.mode === "map-country") ||
      (state.screen === "explore" &&
        state.exploreView === "map" &&
        state.explorePinnedCode !== null);

    if (expandableSilhouetteVisible && state.silhouetteExpanded) {
      event.preventDefault();
      setSilhouetteExpanded(false);
    }
  });

  function applyResultPreviewFromUrl() {
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
    state.questions = previewCountries.map((country) => ({ country }));
    state.score = score;
    state.wrongAnswers = previewCountries.slice(score);
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

  applyResultPreviewFromUrl();
  syncUrlState();
  render();
})();
