(function () {
  "use strict";

  const data = window.ATLAS_DATA;
  const app = document.getElementById("app");

  if (!data || !app) {
    throw new Error("Atlas kunne ikke laste landdataene.");
  }

  const { countries, regionOptions } = data;

  const modes = [
    {
      id: "country-flag",
      number: "01",
      label: "Land → flagg",
      description: "Finn riktig flagg når du får navnet på landet.",
    },
    {
      id: "flag-country",
      number: "02",
      label: "Flagg → land",
      description: "Finn riktig land når du får se flagget.",
    },
    {
      id: "country-capital",
      number: "03",
      label: "Land + flagg → hovedstad",
      description: "Koble landet og flagget til riktig hovedstad.",
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
  };

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
          <span class="brand-mark" aria-hidden="true">A</span>
          <span>Atlas</span>
        </button>
      `;
    }
    return `
      <a class="brand" href="#top" aria-label="Atlas – til toppen">
        <span class="brand-mark" aria-hidden="true">A</span>
        <span>Atlas</span>
      </a>
    `;
  }

  function setupMarkup() {
    const mode = selectedMode();
    const region = selectedRegion();
    const pool = countriesInRegion(state.region);

    return `
      <main class="site-shell">
        <header class="brand-bar">
          ${brandMarkup()}
          <span class="edition">Geografiøvelse · 196 land</span>
        </header>

        <section class="hero" id="top">
          <p class="kicker">Lær verden, ett land om gangen</p>
          <h1>Hvor godt kjenner<br />du <em>verden?</em></h1>
          <p class="hero-copy">
            Velg en øvelse og en del av verden. Du får ni svaralternativer og
            møter hvert land i kategorien én gang.
          </p>
        </section>

        <section class="setup-section" aria-labelledby="mode-heading">
          <div class="section-heading">
            <span>01</span>
            <div>
              <p>Velg øvelse</p>
              <h2 id="mode-heading">Hva vil du trene på?</h2>
            </div>
          </div>
          <div class="mode-grid">
            ${modes
              .map(
                (option) => `
                  <button
                    class="mode-card ${state.mode === option.id ? "is-selected" : ""}"
                    data-action="mode"
                    data-value="${option.id}"
                    aria-pressed="${state.mode === option.id}"
                  >
                    <span class="mode-number">${option.number}</span>
                    <span class="mode-copy">
                      <strong>${option.label}</strong>
                      <small>${option.description}</small>
                    </span>
                    <span class="selection-dot" aria-hidden="true"></span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </section>

        <section class="setup-section" aria-labelledby="region-heading">
          <div class="section-heading">
            <span>02</span>
            <div>
              <p>Velg område</p>
              <h2 id="region-heading">Hvor i verden?</h2>
            </div>
          </div>
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

        <section class="launch-panel">
          <div>
            <p>Din øvelse</p>
            <h2>${mode.label}</h2>
            <span>${region.label} · ${pool.length} spørsmål · 9 valg</span>
          </div>
          <button class="primary-button" data-action="start">
            Start øvelsen
            <span aria-hidden="true">→</span>
          </button>
        </section>

        <footer>
          <span>Atlas · laget for nysgjerrige geografer</span>
          <a href="./licenses/flag-icons-MIT.txt">Flagg fra flag-icons · MIT</a>
        </footer>
      </main>
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
      <main class="quiz-shell result-shell">
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
    const nextLabel =
      state.questionIndex === state.questions.length - 1 ? "Se resultat" : "Neste";

    return `
      <div class="feedback-bar ${isCorrect ? "correct" : "wrong"}">
        <div>
          <span>${isCorrect ? "Riktig!" : "Ikke helt."}</span>
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
          <div class="answer-grid ${
            state.mode === "country-flag" ? "flag-grid" : "text-grid"
          }">
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
          : quizMarkup();

    if (options.focusNext) {
      app.querySelector('[data-action="next"]')?.focus();
    }
  }

  function returnToSetup() {
    state.screen = "setup";
    state.questions = [];
    state.selectedCode = null;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  app.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control || !app.contains(control)) return;

    const action = control.dataset.action;

    if (action === "mode") {
      state.mode = control.dataset.value;
      render();
      return;
    }

    if (action === "region") {
      state.region = control.dataset.value;
      render();
      return;
    }

    if (action === "start") {
      state.questions = createQuestions(countriesInRegion(state.region));
      state.questionIndex = 0;
      state.selectedCode = null;
      state.score = 0;
      state.screen = "quiz";
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (action === "answer") {
      const question = state.questions[state.questionIndex];
      if (state.selectedCode || !question) return;

      state.selectedCode = control.dataset.code;
      if (state.selectedCode === question.country.code) {
        state.score += 1;
      }
      render({ focusNext: true });
      return;
    }

    if (action === "next") {
      if (state.questionIndex === state.questions.length - 1) {
        state.screen = "result";
      } else {
        state.questionIndex += 1;
        state.selectedCode = null;
      }
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (action === "setup") {
      returnToSetup();
    }
  });

  render();
})();
