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
    },
    {
      id: "flag-country",
      label: "Gjett landet",
      description: "Du får flagget – finn riktig land.",
    },
    {
      id: "country-capital",
      label: "Gjett hovedstaden",
      description: "Du får landet og flagget – finn hovedstaden.",
    },
  ];

  const state = {
    screen: "setup",
    mode: "country-flag",
    region: "world",
    questions: [],
    questionIndex: 0,
    selectedCode: null,
    score: 0,
    wrongAnswers: [],
  };
  let autoAdvanceTimer = null;
  const norwegianCollator = new Intl.Collator("nb", { sensitivity: "base" });

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
    return `<img class="flag ${className}" src="./flags/${country.code}.svg" alt="${alt}" draggable="false" />`;
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
          <p class="hero-copy">Velg et område og deretter hva du vil gjette på.</p>
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
                  <button class="action-card" data-action="mode" data-value="${option.id}">
                    <span class="action-copy">
                      <strong>${option.label}</strong>
                      <small>${option.description}</small>
                    </span>
                    <span class="action-arrow" aria-hidden="true">→</span>
                  </button>
                `,
              )
              .join("")}
            <button class="action-card" data-action="explore">
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
          <a href="./licenses/flag-icons-MIT.txt">Flagg fra flag-icons · MIT</a>
        </footer>
      </main>
    `;
  }

  function reviewMarkup() {
    if (state.wrongAnswers.length === 0) return "";

    return `
      <section class="result-review" aria-labelledby="review-heading">
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
      <main class="quiz-shell">
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
        </section>
        ${reviewMarkup()}
      </main>
    `;
  }

  function exploreMarkup() {
    const region = selectedRegion();
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
                      <td>${flagMarkup(country, "table-flag", true)}</td>
                      <th scope="row">${escapeHtml(country.name)}</th>
                      <td>${escapeHtml(country.capital)}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
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

  function answerMarkup(choice, index, question, answered) {
    const isChosen = state.selectedCode === choice.code;
    const isAnswer = choice.code === question.country.code;
    const stateClass = answered
      ? isAnswer
        ? "is-correct"
        : isChosen
          ? "is-wrong"
          : "is-muted"
      : "";
    const label =
      state.mode === "country-capital"
        ? choice.capital
        : state.mode === "flag-country"
          ? choice.name
          : `Alternativ ${index + 1}`;
    const accessibleLabel =
      state.mode === "country-flag"
        ? answered
          ? `${choice.name}${isAnswer ? ", riktig svar" : ""}`
          : `Flaggalternativ ${index + 1}`
        : label;

    return `
      <button
        class="answer-card ${stateClass}"
        data-action="answer"
        data-code="${choice.code}"
        ${answered ? "disabled" : ""}
        aria-label="${escapeHtml(accessibleLabel)}"
      >
        <span class="answer-index">${index + 1}</span>
        ${
          state.mode === "country-flag"
            ? flagMarkup(choice, "", answered)
            : `<strong>${escapeHtml(label)}</strong>`
        }
        ${
          answered && isAnswer
            ? '<span class="answer-mark" aria-hidden="true">✓</span>'
            : ""
        }
        ${
          answered && isChosen && !isAnswer
            ? '<span class="answer-mark wrong-mark" aria-hidden="true">×</span>'
            : ""
        }
      </button>
    `;
  }

  function feedbackMarkup(question, answered, isCorrect) {
    if (!answered) {
      return '<div class="feedback-bar feedback-placeholder" aria-hidden="true"></div>';
    }

    const answer =
      state.mode === "country-capital"
        ? `${question.country.name}: ${question.country.capital}`
        : question.country.name;
    if (isCorrect) {
      return `
        <div class="feedback-bar correct auto-feedback">
          <div>
            <span>Riktig!</span>
            <strong>${escapeHtml(answer)}</strong>
          </div>
          <span class="auto-feedback-mark" aria-hidden="true">✓</span>
        </div>
      `;
    }

    const nextLabel =
      state.questionIndex === state.questions.length - 1 ? "Se resultat" : "Neste";

    return `
      <div class="feedback-bar wrong">
        <div>
          <span>Ikke helt.</span>
          <strong>${escapeHtml(answer)}</strong>
        </div>
        <button class="next-button" data-action="next">
          ${nextLabel}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    `;
  }

  function quizMarkup() {
    const question = state.questions[state.questionIndex];
    const answered = state.selectedCode !== null;
    const isCorrect = state.selectedCode === question.country.code;
    const progress = ((state.questionIndex + 1) / state.questions.length) * 100;

    const gridClass =
      state.mode === "country-flag"
        ? "flag-grid"
        : state.mode === "country-capital"
          ? "text-grid capital-grid"
          : "text-grid country-grid";

    return `
      <main class="quiz-shell quiz-active">
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
          <div class="answer-grid ${gridClass}">
            ${question.choices
              .map((choice, index) =>
                answerMarkup(choice, index, question, answered),
              )
              .join("")}
          </div>
          ${feedbackMarkup(question, answered, isCorrect)}
        </section>
      </main>
    `;
  }

  function render(options = {}) {
    app.innerHTML =
      state.screen === "setup"
        ? setupMarkup()
        : state.screen === "result"
          ? resultMarkup()
          : state.screen === "explore"
            ? exploreMarkup()
            : quizMarkup();

    if (options.focusNext) {
      app.querySelector('[data-action="next"]')?.focus();
    }
  }

  function renderAtTop() {
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearAutoAdvance() {
    if (autoAdvanceTimer !== null) {
      window.clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
  }

  function advanceQuestion() {
    clearAutoAdvance();
    if (state.questionIndex === state.questions.length - 1) {
      state.screen = "result";
    } else {
      state.questionIndex += 1;
      state.selectedCode = null;
    }
    renderAtTop();
  }

  function startQuiz(mode) {
    clearAutoAdvance();
    state.mode = mode;
    state.questions = createQuestions(countriesInRegion(state.region));
    state.questionIndex = 0;
    state.selectedCode = null;
    state.score = 0;
    state.wrongAnswers = [];
    state.screen = "quiz";
    renderAtTop();
  }

  function showExplore() {
    clearAutoAdvance();
    state.screen = "explore";
    state.questions = [];
    state.selectedCode = null;
    state.wrongAnswers = [];
    renderAtTop();
  }

  function returnToSetup() {
    clearAutoAdvance();
    state.screen = "setup";
    state.questions = [];
    state.selectedCode = null;
    state.wrongAnswers = [];
    renderAtTop();
  }

  function selectAnswer(code) {
    const question = state.questions[state.questionIndex];
    if (state.screen !== "quiz" || state.selectedCode || !question) return;

    state.selectedCode = code;
    const isCorrect = state.selectedCode === question.country.code;
    if (isCorrect) {
      state.score += 1;
    } else {
      state.wrongAnswers.push(question.country);
    }
    render({ focusNext: !isCorrect });
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

    if (action === "region") {
      state.region = control.dataset.value;
      render();
      return;
    }

    if (action === "answer") {
      selectAnswer(control.dataset.code);
      return;
    }

    if (action === "next") {
      advanceQuestion();
      return;
    }

    if (action === "setup") {
      returnToSetup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      state.screen !== "quiz" ||
      state.selectedCode ||
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

    event.preventDefault();
    selectAnswer(answer.dataset.code);
  });

  render();
})();
