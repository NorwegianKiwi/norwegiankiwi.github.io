(function () {
  "use strict";

  const data = window.GEOGRAFI_QUIZ_DATA;
  const app = document.getElementById("app");

  if (!data || !app) {
    throw new Error("Geografi-quiz kunne ikke laste landdataene.");
  }

  const { countries, regionOptions } = data;

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
  ];

  const state = {
    screen: "setup",
    mode: "country-flag",
    region: "world",
    questions: [],
    questionIndex: 0,
    selectedCode: null,
    answerStatus: "unanswered",
    score: 0,
    wrongAnswers: [],
    flashcards: [],
    flashcardIndex: 0,
    flashcardRevealed: false,
    modalCode: null,
    exploreScrollTop: 0,
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

  function countriesInRegion(region) {
    return region === "world"
      ? countries
      : countries.filter((country) => country.regions.includes(region));
  }

  function createQuestions(pool) {
    return shuffle(pool).map((country) => {
      const distractors = shuffle(
        pool.filter((item) => item.code !== country.code),
      ).slice(0, 8);
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
        <button class="brand brand-button" data-action="setup">
          <span class="brand-mark" aria-hidden="true">G</span>
          <span>Geografi-quiz</span>
        </button>
      `;
    }
    return `
      <a class="brand" href="#top" aria-label="Geografi-quiz – til toppen">
        <span class="brand-mark" aria-hidden="true">G</span>
        <span>Geografi-quiz</span>
      </a>
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
          <div class="region-grid">
            ${regionOptions
              .map((option) => {
                const count = countriesInRegion(option.id).length;
                return `
                  <button
                    class="region-card ${state.region === option.id ? "is-selected" : ""}"
                    data-action="region"
                    data-value="${option.id}"
                    aria-pressed="${state.region === option.id}"
                  >
                    <span>${option.label}</span>
                    <small>${count} land</small>
                  </button>
                `;
              })
              .join("")}
          </div>
        </section>

        <section class="action-section" aria-label="Velg aktivitet">
          <div class="action-grid">
            ${modes
              .map(
                (option) => `
                  <button class="action-card tone-${option.tone}" data-action="mode" data-value="${option.id}">
                    <span class="action-copy">
                      <strong>${option.label}</strong>
                      <small>${option.description}</small>
                    </span>
                    <span class="action-arrow" aria-hidden="true">→</span>
                  </button>
                `,
              )
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

  function exploreMarkup() {
    const region = selectedRegion();
    const modalCountry = countries.find(
      (country) => country.code === state.modalCode,
    );
    const sortedCountries = [...countriesInRegion(state.region)].sort((a, b) =>
      norwegianCollator.compare(a.name, b.name),
    );

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
          <p class="kicker">Utforsk landene</p>
          <h1>${region.label}</h1>
          <p>Flagg, land og hovedsteder i alfabetisk rekkefølge.</p>
        </section>

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
                <div class="flag-modal-card">
                  ${flagMarkup(modalCountry, "modal-flag", true)}
                  <strong>${escapeHtml(modalCountry.name)}</strong>
                  <span>Trykk hvor som helst for å lukke</span>
                </div>
              </div>
            `
            : ""
        }
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
        : state.mode === "flag-country"
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
          : "text-grid country-grid";

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
          <div class="answer-grid-stage">
            <div class="answer-grid ${gridClass}">
              ${question.choices
                .map((choice, index) =>
                  answerMarkup(choice, index, question),
                )
                .join("")}
            </div>
          </div>
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

  function advanceQuestion() {
    clearAutoAdvance();
    setKeyboardHintsVisible(false);
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
    state.mode = mode;
    state.questions = createQuestions(countriesInRegion(state.region));
    state.questionIndex = 0;
    state.selectedCode = null;
    state.answerStatus = "unanswered";
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
    state.wrongAnswers = [];
    state.modalCode = null;
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
    state.wrongAnswers = [];
    state.flashcards = [];
    state.flashcardIndex = 0;
    state.flashcardRevealed = false;
    state.modalCode = null;
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

    if (action === "flashcards" || action === "restart-flashcards") {
      startFlashcards();
      return;
    }

    if (action === "region") {
      state.region = control.dataset.value;
      render();
      return;
    }

    if (action === "answer") {
      selectAnswer(control.dataset.code);
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
    if (event.key !== "Escape" || state.modalCode === null) return;
    event.preventDefault();
    closeFlagModal();
  });

  render();
})();
