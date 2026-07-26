(function () {
  "use strict";

  const data = window.GEOGRAFI_QUIZ_DATA;
  const mapData = window.GEOGRAFI_QUIZ_MAP_DATA;
  const app = document.getElementById("app");

  if (!data || !mapData || !app) {
    throw new Error("Geografi-quiz kunne ikke laste landdataene.");
  }

  const { countries, regionOptions } = data;
  const mapSelectableRegions = [
    "europe",
    "africa",
    "asia",
    "oceania",
    "north-central-america",
    "south-america",
    "caribbean",
  ];
  const americanRegions = new Set([
    "north-central-america",
    "south-america",
    "caribbean",
  ]);
  const countriesByCode = new Map(
    countries.map((country) => [country.code, country]),
  );

  const modes = [
    {
      id: "country-flag",
      label: "Gjett flagget",
      description: "Du får landet – finn riktig flagg.",
      tone: "coral",
    },
    {
      id: "flag-country",
      label: "Gjett landet",
      description: "Du får flagget – finn riktig land.",
      tone: "green",
    },
    {
      id: "country-capital",
      label: "Gjett hovedstaden",
      description: "Du får landet og flagget – finn hovedstaden.",
      tone: "gold",
    },
    {
      id: "map-country",
      label: "Kartquiz",
      description: "Se et uthevet land – velg riktig navn.",
      tone: "map",
      choiceCount: 6,
    },
  ];

  const state = {
    screen: "setup",
    mode: "country-flag",
    region: "world",
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
    exploreScrollTop: 0,
    exploreView: "list",
    explorePinnedCode: null,
    explorePreviewCode: null,
  };
  let autoAdvanceTimer = null;
  let keyboardHintsVisible = false;
  const norwegianCollator = new Intl.Collator("nb", { sensitivity: "base" });
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
      countryRegion === selectedRegion ||
      (selectedRegion === "americas" && americanRegions.has(countryRegion))
    );
  }

  function countriesInRegion(region) {
    return countries.filter((country) => regionMatches(country.region, region));
  }

  function createQuestions(pool, choiceCount = 9) {
    return shuffle(pool).map((country) => {
      const distractors = shuffle(
        pool.filter((item) => item.code !== country.code),
      ).slice(0, choiceCount - 1);
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

  function flagMarkup(country, className = "", revealName = false) {
    const name = escapeHtml(country.name);
    const alt = revealName ? `Flagget til ${name}` : "";
    const lazy = className === "table-flag" ? ' loading="lazy"' : "";
    return `
      <span class="flag-frame flag-code-${country.code} ${className}">
        <img class="flag" src="./flags/${country.code}.svg" alt="${alt}" draggable="false"${lazy} />
      </span>
    `;
  }

  function brandMarkup(asButton = false) {
    if (asButton) {
      return `
        <div class="brand-group">
          <button class="brand brand-button" data-action="setup">
            <img class="brand-mark" src="./favicon.svg" alt="" aria-hidden="true" draggable="false" />
            <span>Geografi-quiz</span>
          </button>
          <a class="site-home-link" href="../index.html" aria-label="Tilbake til lanceolav.com">
            <span aria-hidden="true">←</span> lanceolav.com
          </a>
        </div>
      `;
    }
    return `
      <div class="brand-group">
        <a class="brand" href="#top" aria-label="Geografi-quiz – til toppen">
          <img class="brand-mark" src="./favicon.svg" alt="" aria-hidden="true" draggable="false" />
          <span>Geografi-quiz</span>
        </a>
        <a class="site-home-link" href="../index.html" aria-label="Tilbake til lanceolav.com">
          <span aria-hidden="true">←</span> lanceolav.com
        </a>
      </div>
    `;
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
        aria-label="${escapeHtml(region.label)}, ${count} land"
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
          Velg et område på kartet, eller bruk områdeknappene ved siden av.
        </p>
        <svg
          class="region-map"
          viewBox="${mapData.viewBox}"
          role="group"
          aria-label="Interaktivt verdenskart"
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
        aria-label="${expanded ? "Forminsk landformen" : "Forstørr landformen"}"
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
          aria-label="Kart over ${escapeHtml(region.label)} med ett land uthevet"
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

  function setupMarkup() {
    return `
      <main class="site-shell setup-shell">
        <header class="brand-bar">
          ${brandMarkup()}
          <span class="edition">Geografiøvelse · 196 land</span>
        </header>

        <section class="hero" id="top">
          <p class="kicker">Lær verden, ett land om gangen</p>
          <h1>Hvor godt kjenner du <em>verden?</em></h1>
          <p class="hero-copy">Velg et område og deretter hvordan du vil øve.</p>
        </section>

        <section class="region-panel" aria-labelledby="region-heading">
          <h2 id="region-heading">Velg område</h2>
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
                      <span>${option.label}</span>
                      <small>${count} land</small>
                    </button>
                  `;
                })
                .join("")}
            </div>
          </div>
        </section>

        <section class="action-section" aria-label="Velg aktivitet">
          <div class="action-grid">
            ${modes
              .map((option) => {
                const unavailable =
                  option.id === "map-country" &&
                  !mapSelectableRegions.includes(state.region);
                const description = unavailable
                  ? "Velg en enkelt region"
                  : option.description;
                return `
                  <button
                    class="action-card tone-${option.tone}"
                    data-action="mode"
                    data-value="${option.id}"
                    ${unavailable ? "disabled" : ""}
                  >
                    <span class="action-copy">
                      <strong>${option.label}</strong>
                      <small>${description}</small>
                    </span>
                    <span class="action-arrow" aria-hidden="true">→</span>
                  </button>
                `;
              })
              .join("")}
            <button class="action-card tone-blue" data-action="flashcards">
              <span class="action-copy">
                <strong>Flashcards</strong>
                <small>Se flagget, tenk selv og avslør svaret.</small>
              </span>
              <span class="action-arrow" aria-hidden="true">→</span>
            </button>
            <button class="action-card tone-plum" data-action="explore">
              <span class="action-copy">
                <strong>Utforsk landene</strong>
                <small>Se flagg, land og hovedsteder i valgt område.</small>
              </span>
              <span class="action-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <footer>
          <span>Geografi-quiz · laget for nysgjerrige geografer</span>
          <span class="license-links">
            <a href="./licenses/flag-icons-MIT.txt">Flagg fra flag-icons · MIT</a>
            <a href="./licenses/twemoji-CC-BY-4.0.txt">Jordklode fra Twemoji · CC BY 4.0</a>
            <a href="./licenses/natural-earth-public-domain.txt">Kart fra Natural Earth · public domain</a>
          </span>
        </footer>
      </main>
    `;
  }

  function reviewMarkup() {
    if (state.wrongAnswers.length === 0) return "";

    return `
      <section class="result-review" id="result-review" aria-labelledby="review-heading">
        <p class="kicker">Gjennomgang</p>
        <h2 id="review-heading">Dette kan du øve mer på</h2>
        <p>${state.wrongAnswers.length} land å se nærmere på.</p>
        <div class="review-list">
          ${state.wrongAnswers
            .map(
              (country) => `
                <article class="review-row">
                  ${flagMarkup(country, "review-flag", true)}
                  <div>
                    <strong>${escapeHtml(country.name)}</strong>
                    <span>${escapeHtml(country.capital)}</span>
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
        ? "Imponerende!"
        : percentage >= 70
          ? "Godt jobbet!"
          : percentage >= 50
            ? "Du er på god vei."
            : "Verden venter.";

    return `
      <main class="quiz-shell result-shell ${hasReview ? "has-review" : ""}">
        <header class="quiz-header">${brandMarkup(true)}</header>
        <section class="result-card">
          <p class="kicker">Øvelsen er fullført</p>
          <div class="result-score" aria-label="${percentage} prosent riktig">
            <strong>${percentage}</strong><span>%</span>
          </div>
          <h1>${heading}</h1>
          <p>
            Du fikk <strong>${state.score}</strong> av
            <strong>${state.questions.length}</strong> riktige i
            ${selectedRegion().label.toLowerCase()}.
          </p>
          <div class="result-stats">
            <div><span>Riktige</span><strong>${state.score}</strong></div>
            <div>
              <span>Feil</span>
              <strong>${state.questions.length - state.score}</strong>
            </div>
            <div><span>Modus</span><strong>${selectedMode().label}</strong></div>
          </div>
          <button class="primary-button" data-action="setup">
            Velg ny øvelse
            <span aria-hidden="true">→</span>
          </button>
          ${
            hasReview
              ? `
                <button class="review-jump" data-action="review">
                  Se gjennom ${state.wrongAnswers.length} feil
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
          <strong>Velg et land</strong>
          <span>Pek, fokuser eller trykk for å se plassering og form.</span>
        </div>
      `;
    }

    return `
      <div class="explore-country-status">
        ${flagMarkup(country, "explore-status-flag", false)}
        <span>
          <strong>${escapeHtml(country.name)}</strong>
          <small>${escapeHtml(country.capital)}</small>
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

  function exploreMapCountryMarkup(country, view, markerRadius) {
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
            r="${Math.max(11, markerRadius * 3.2)}"
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
        aria-label="${escapeHtml(country.name)}, hovedstad ${escapeHtml(country.capital)}"
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
            aria-hidden="true"
          >
            <circle
              class="explore-map-marker-top-hit"
              cx="${marker.x}"
              cy="${marker.y}"
              r="${Math.max(11, markerRadius * 3.2)}"
            />
            ${regionalMapMarkerMarkup(
              marker,
              "explore-map-country-marker",
              markerRadius,
            )}
          </g>
        `;
      })
      .join("");
  }

  function exploreRegionMapMarkup(sortedCountries) {
    const view = mapData.quizRegions[state.region];
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
        <div class="explore-region-map">
          <svg
            viewBox="${view.viewBox}"
            role="group"
            aria-label="Interaktivt kart over ${escapeHtml(selectedRegion().label)}"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect class="question-map-ocean" x="-1000" y="-500" width="3000" height="1500" />
            <g aria-hidden="true">${contextPaths}</g>
            ${sortedCountries
              .map((country) =>
                exploreMapCountryMarkup(country, view, markerRadius),
              )
              .join("")}
            ${exploreMapMarkerLayerMarkup(
              sortedCountries,
              view,
              markerRadius,
            )}
          </svg>
          <div class="explore-silhouette-overlay">
            ${exploreSilhouetteOverlayMarkup()}
          </div>
        </div>

        <aside class="explore-country-panel" aria-label="Land i regionen">
          <div class="explore-country-status-wrap" aria-live="polite">
            ${exploreCountryStatusMarkup(activeExploreCountryCode())}
          </div>
          <div class="explore-country-list">
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
                      <strong>${escapeHtml(country.name)}</strong>
                      <small>${escapeHtml(country.capital)}</small>
                    </span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </aside>
      </div>
    `;
  }

  function exploreMapRegionPromptMarkup() {
    return `
      <section class="explore-map-region-prompt" aria-labelledby="explore-map-region-heading">
        <p class="kicker">Velg en enkelt region</p>
        <h2 id="explore-map-region-heading">Hvilket kart vil du utforske?</h2>
        <p>Regionkartet viser plasseringen og formen til hvert land.</p>
        <div class="explore-map-region-grid">
          ${mapSelectableRegions
            .map((regionId) => {
              const region = regionOptions.find(
                (option) => option.id === regionId,
              );
              return `
                <button
                  data-action="explore-map-region"
                  data-value="${regionId}"
                >
                  <strong>${escapeHtml(region.label)}</strong>
                  <span>${countriesInRegion(regionId).length} land</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
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
              <th scope="col">Flagg</th>
              <th scope="col">Land</th>
              <th scope="col">Hovedstad</th>
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
                        aria-label="Vis flagget til ${escapeHtml(country.name)} stort"
                      >
                        ${flagMarkup(country, "table-flag", false)}
                      </button>
                    </td>
                    <th scope="row">${escapeHtml(country.name)}</th>
                    <td>${escapeHtml(country.capital)}</td>
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
              aria-label="Stort flagg: ${escapeHtml(modalCountry.name)}"
              tabindex="-1"
            >
              <div class="flag-modal-card ${modalCountry.note ? "has-note" : ""}">
                ${flagMarkup(modalCountry, "modal-flag", true)}
                <strong>${escapeHtml(modalCountry.name)}</strong>
                ${
                  modalCountry.note
                    ? `<p class="country-note">${escapeHtml(modalCountry.note)}</p>`
                    : ""
                }
                <span class="modal-close-hint">Trykk hvor som helst for å lukke</span>
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
    const sortedCountries = [...countriesInRegion(state.region)].sort((a, b) =>
      norwegianCollator.compare(a.name, b.name),
    );
    const mapAvailable = mapSelectableRegions.includes(state.region);
    const viewingMap = state.exploreView === "map";

    return `
      <main class="site-shell explore-shell">
        <header class="quiz-header">
          ${brandMarkup(true)}
          <div class="quiz-meta">
            <span>${region.label}</span>
            <strong>${sortedCountries.length} land</strong>
          </div>
          <button class="quiet-button" data-action="setup">Tilbake</button>
        </header>

        <section class="explore-intro">
          <div>
            <p class="kicker">Utforsk landene</p>
            <h1>${region.label}</h1>
            <p>
              ${
                viewingMap
                  ? "Se hvor landene ligger, og sammenlign flagg og landformer."
                  : "Flagg, land og hovedsteder i alfabetisk rekkefølge."
              }
            </p>
          </div>
          <label class="explore-region-select">
            <span>Område</span>
            <select data-action="explore-region">
              ${regionOptions
                .map(
                  (option) => `
                    <option
                      value="${option.id}"
                      ${option.id === state.region ? "selected" : ""}
                    >
                      ${escapeHtml(option.label)} · ${countriesInRegion(option.id).length} land
                    </option>
                  `,
                )
                .join("")}
            </select>
          </label>
        </section>

        <div class="explore-tabs" role="tablist" aria-label="Visning">
          <button
            id="explore-list-tab"
            role="tab"
            data-action="explore-tab"
            data-value="list"
            aria-selected="${!viewingMap}"
            aria-controls="explore-list-panel"
            tabindex="${viewingMap ? "-1" : "0"}"
          >
            Liste
          </button>
          <button
            id="explore-map-tab"
            role="tab"
            data-action="explore-tab"
            data-value="map"
            aria-selected="${viewingMap}"
            aria-controls="explore-map-panel"
            tabindex="${viewingMap ? "0" : "-1"}"
          >
            Kart
          </button>
        </div>

        <section
          id="explore-${state.exploreView}-panel"
          class="explore-tab-panel"
          role="tabpanel"
          aria-labelledby="explore-${state.exploreView}-tab"
          tabindex="0"
        >
          ${
            viewingMap
              ? mapAvailable
                ? exploreRegionMapMarkup(sortedCountries)
                : exploreMapRegionPromptMarkup()
              : exploreListMarkup(sortedCountries, modalCountry)
          }
        </section>
      </main>
    `;
  }

  function flashcardMarkup() {
    const region = selectedRegion();
    const complete = state.flashcardIndex >= state.flashcards.length;

    if (complete) {
      return `
        <main class="quiz-shell flashcard-shell">
          <header class="quiz-header">${brandMarkup(true)}</header>
          <section class="flashcard-complete">
            <p class="kicker">Flashcards fullført</p>
            <h1>Runden er ferdig.</h1>
            <p>Du har gått gjennom ${state.flashcards.length} flagg fra ${region.label.toLowerCase()}.</p>
            <div class="flashcard-actions">
              <button class="primary-button" data-action="restart-flashcards">
                Start på nytt <span aria-hidden="true">↻</span>
              </button>
              <button class="secondary-button" data-action="setup">Velg ny øvelse</button>
            </div>
          </section>
        </main>
      `;
    }

    const country = state.flashcards[state.flashcardIndex];
    const progress = ((state.flashcardIndex + 1) / state.flashcards.length) * 100;
    const instruction = state.flashcardRevealed
      ? "Trykk igjen for neste flagg"
      : "Tenk på landet og hovedstaden – trykk for å se svaret";

    return `
      <main class="quiz-shell flashcard-shell">
        <header class="quiz-header">
          ${brandMarkup(true)}
          <div class="quiz-meta">
            <span>${region.label}</span>
            <strong>${state.flashcardIndex + 1} / ${state.flashcards.length}</strong>
          </div>
          <button class="quiet-button" data-action="setup">Avslutt</button>
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
              ? `${escapeHtml(country.name)}, ${escapeHtml(country.capital)}. Trykk for neste flagg.`
              : `Flashcard ${state.flashcardIndex + 1} av ${state.flashcards.length}. Trykk for å vise svaret.`
          }"
        >
          ${flagMarkup(country, "flashcard-flag", state.flashcardRevealed)}
          <span class="flashcard-answer" aria-hidden="${!state.flashcardRevealed}">
            ${
              state.flashcardRevealed
                ? `
                  <strong>${escapeHtml(country.name)}</strong>
                  <span>${escapeHtml(country.capital)}</span>
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
        <span class="question-label">Finn flagget til</span>
        <h1>${escapeHtml(question.country.name)}</h1>
      `;
    }

    if (state.mode === "flag-country") {
      return `
        <span class="question-label">Hvilket land har dette flagget?</span>
        <div class="featured-flag-wrap">
          ${flagMarkup(question.country, "featured-flag", answered)}
        </div>
      `;
    }

    if (state.mode === "map-country") {
      return `
        <span class="question-label">Hvilket land er uthevet?</span>
      `;
    }

    return `
      <span class="question-label">Hva er hovedstaden i</span>
      <div class="country-with-flag">
        ${flagMarkup(question.country, "prompt-flag", true)}
        <h1>${escapeHtml(question.country.name)}</h1>
      </div>
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
        ? choice.capital
        : state.mode === "flag-country" || state.mode === "map-country"
          ? choice.name
          : `Alternativ ${index + 1}`;
    const baseAccessibleLabel =
      state.mode === "country-flag"
        ? answered
          ? choice.name
          : `Flaggalternativ ${index + 1}`
        : label;
    const accessibleLabel =
      awaitingCorrection && isAnswer
        ? `${baseAccessibleLabel}, riktig svar. Trykk for å gå videre.`
        : answered && isAnswer
          ? `${baseAccessibleLabel}, riktig svar`
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
    if (state.answerStatus === "correct") return "Riktig.";
    if (state.answerStatus !== "correction") return "";

    const answer =
      state.mode === "country-capital"
        ? question.country.capital
        : question.country.name;
    return `Feil. Riktig svar er ${answer}. Aktiver det markerte alternativet for å gå videre.`;
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
          ${brandMarkup(true)}
          <div class="quiz-meta">
            <span>${selectedRegion().label}</span>
            <strong>${state.questionIndex + 1} / ${state.questions.length}</strong>
          </div>
          <button class="quiet-button" data-action="setup">Avslutt</button>
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
            <p class="kicker">${selectedMode().label}</p>
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

  function render(options = {}) {
    app.innerHTML = screenMarkup();

    document.body?.classList.toggle("modal-open", state.modalCode !== null);

    if (options.focusCorrect) app.querySelector(".is-correction")?.focus();
    if (options.focusModal) app.querySelector(".flag-modal")?.focus();
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
    if (options.focusExploreTab) {
      app
        .querySelector(
          `[data-action="explore-tab"][data-value="${options.focusExploreTab}"]`,
        )
        ?.focus();
    }
    if (options.focusExploreRegion) {
      app.querySelector('[data-action="explore-region"]')?.focus();
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
    state.silhouetteExpanded = false;
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
      app
        .querySelector(`.explore-country-card[data-explore-code="${code}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }

  function setExploreView(view, { focusTab = false } = {}) {
    if (view !== "list" && view !== "map") return;
    state.exploreView = view;
    state.explorePreviewCode = null;
    state.silhouetteExpanded = false;
    state.modalCode = null;
    render({
      focusExploreTab: focusTab ? view : null,
    });
  }

  function setExploreRegion(regionId, { focusSelect = false } = {}) {
    if (!regionOptions.some((region) => region.id === regionId)) return;
    state.region = regionId;
    resetExploreCountryState();
    state.modalCode = null;
    render({
      focusExploreRegion: focusSelect,
    });
  }

  function setSilhouetteExpanded(expanded) {
    state.silhouetteExpanded = expanded;
    const control = app.querySelector('[data-action="toggle-silhouette"]');
    if (!control) return;

    control.classList.toggle("is-expanded", expanded);
    control.setAttribute("aria-expanded", String(expanded));
    control.setAttribute(
      "aria-label",
      expanded ? "Forminsk landformen" : "Forstørr landformen",
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
      return;
    }
    state.mode = mode;
    const modeConfig = modes.find((option) => option.id === mode);
    state.questions = createQuestions(
      countriesInRegion(state.region),
      modeConfig?.choiceCount,
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

  function showExplore() {
    clearAutoAdvance();
    setKeyboardHintsVisible(false);
    state.screen = "explore";
    state.questions = [];
    state.selectedCode = null;
    state.answerStatus = "unanswered";
    state.silhouetteExpanded = false;
    state.wrongAnswers = [];
    state.modalCode = null;
    state.exploreView = "list";
    resetExploreCountryState();
    renderAtTop();
  }

  function closeFlagModal() {
    const code = state.modalCode;
    state.modalCode = null;
    render({ focusFlagCode: code });
    window.scrollTo({ top: state.exploreScrollTop });
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
    resetExploreCountryState();
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
    render({ focusCorrect: !isCorrect });
    if (isCorrect) {
      autoAdvanceTimer = window.setTimeout(advanceQuestion, 650);
    }
  }

  app.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control || !app.contains(control)) return;

    const action = control.dataset.action;

    if (action === "mode") {
      startQuiz(control.dataset.value);
      return;
    }

    if (action === "explore") {
      showExplore();
      return;
    }

    if (action === "explore-tab") {
      setExploreView(control.dataset.value, { focusTab: true });
      return;
    }

    if (action === "explore-map-region") {
      state.region = control.dataset.value;
      resetExploreCountryState();
      render({ focusExploreTab: "map" });
      return;
    }

    if (action === "explore-country") {
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
      state.region = control.dataset.value;
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

  app.addEventListener("change", (event) => {
    const select = event.target.closest('[data-action="explore-region"]');
    if (!select || !app.contains(select)) return;
    setExploreRegion(select.value, { focusSelect: true });
  });

  app.addEventListener("pointerover", (event) => {
    const countryControl = event.target.closest("[data-explore-code]");
    if (
      countryControl &&
      app.contains(countryControl) &&
      !countryControl.contains(event.relatedTarget)
    ) {
      setExplorePreview(countryControl.dataset.exploreCode);
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
      setExplorePreview(null);
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
    const tab = event.target.closest('[data-action="explore-tab"]');
    if (tab && app.contains(tab)) {
      const tabs = [...app.querySelectorAll('[data-action="explore-tab"]')];
      const currentIndex = tabs.indexOf(tab);
      let nextIndex = null;

      if (event.key === "ArrowLeft") nextIndex = currentIndex - 1;
      if (event.key === "ArrowRight") nextIndex = currentIndex + 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      if (nextIndex !== null) {
        event.preventDefault();
        const nextTab = tabs[(nextIndex + tabs.length) % tabs.length];
        setExploreView(nextTab.dataset.value, { focusTab: true });
      }
      return;
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
    state.region = control.dataset.value;
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
    if (event.key !== "Escape") return;

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

  render();
})();
