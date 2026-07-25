"use client";

import { useMemo, useState } from "react";
import { countries, regionOptions, type Country, type RegionId } from "./countries";

type ModeId = "country-flag" | "flag-country" | "country-capital";
type Screen = "setup" | "quiz" | "result";

type Question = {
  country: Country;
  choices: Country[];
};

const modes: Array<{
  id: ModeId;
  number: string;
  label: string;
  description: string;
}> = [
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

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function countriesInRegion(region: RegionId): Country[] {
  return region === "world"
    ? countries
    : countries.filter((country) => country.regions.includes(region));
}

function createQuestions(pool: Country[]): Question[] {
  return shuffle(pool).map((country) => {
    const distractors = shuffle(pool.filter((item) => item.code !== country.code)).slice(
      0,
      8,
    );
    return {
      country,
      choices: shuffle([country, ...distractors]),
    };
  });
}

function Flag({
  country,
  className = "",
  revealName = false,
}: {
  country: Country;
  className?: string;
  revealName?: boolean;
}) {
  return (
    <img
      className={`flag ${className}`}
      src={`/flags/${country.code}.svg`}
      alt={revealName ? `Flagget til ${country.name}` : ""}
      draggable={false}
    />
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [mode, setMode] = useState<ModeId>("country-flag");
  const [region, setRegion] = useState<RegionId>("world");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const selectedRegion = regionOptions.find((option) => option.id === region)!;
  const selectedMode = modes.find((option) => option.id === mode)!;
  const pool = useMemo(() => countriesInRegion(region), [region]);
  const question = questions[questionIndex];

  function startQuiz() {
    setQuestions(createQuestions(pool));
    setQuestionIndex(0);
    setSelectedCode(null);
    setScore(0);
    setScreen("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseAnswer(country: Country) {
    if (selectedCode || !question) return;
    setSelectedCode(country.code);
    if (country.code === question.country.code) {
      setScore((current) => current + 1);
    }
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setScreen("result");
    } else {
      setQuestionIndex((current) => current + 1);
      setSelectedCode(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function returnToSetup() {
    setScreen("setup");
    setQuestions([]);
    setSelectedCode(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (screen === "setup") {
    return (
      <main className="site-shell">
        <header className="brand-bar">
          <a className="brand" href="#top" aria-label="Atlas – til toppen">
            <span className="brand-mark" aria-hidden="true">
              A
            </span>
            <span>Atlas</span>
          </a>
          <span className="edition">Geografiøvelse · 196 land</span>
        </header>

        <section className="hero" id="top">
          <p className="kicker">Lær verden, ett land om gangen</p>
          <h1>
            Hvor godt kjenner
            <br />
            du <em>verden?</em>
          </h1>
          <p className="hero-copy">
            Velg en øvelse og en del av verden. Du får ni svaralternativer og
            møter hvert land i kategorien én gang.
          </p>
        </section>

        <section className="setup-section" aria-labelledby="mode-heading">
          <div className="section-heading">
            <span>01</span>
            <div>
              <p>Velg øvelse</p>
              <h2 id="mode-heading">Hva vil du trene på?</h2>
            </div>
          </div>
          <div className="mode-grid">
            {modes.map((option) => (
              <button
                className={`mode-card ${mode === option.id ? "is-selected" : ""}`}
                key={option.id}
                onClick={() => setMode(option.id)}
                aria-pressed={mode === option.id}
              >
                <span className="mode-number">{option.number}</span>
                <span className="mode-copy">
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                <span className="selection-dot" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <section className="setup-section" aria-labelledby="region-heading">
          <div className="section-heading">
            <span>02</span>
            <div>
              <p>Velg område</p>
              <h2 id="region-heading">Hvor i verden?</h2>
            </div>
          </div>
          <div className="region-grid">
            {regionOptions.map((option) => (
              <button
                className={`region-card ${region === option.id ? "is-selected" : ""}`}
                key={option.id}
                onClick={() => setRegion(option.id)}
                aria-pressed={region === option.id}
              >
                <span>{option.label}</span>
                <small>
                  {countriesInRegion(option.id).length}{" "}
                  {countriesInRegion(option.id).length === 1 ? "land" : "land"}
                </small>
              </button>
            ))}
          </div>
        </section>

        <section className="launch-panel">
          <div>
            <p>Din øvelse</p>
            <h2>{selectedMode.label}</h2>
            <span>
              {selectedRegion.label} · {pool.length} spørsmål · 9 valg
            </span>
          </div>
          <button className="primary-button" onClick={startQuiz}>
            Start øvelsen
            <span aria-hidden="true">→</span>
          </button>
        </section>

        <footer>
          <span>Atlas · laget for nysgjerrige geografer</span>
          <a href="/licenses/flag-icons-MIT.txt">Flagg fra flag-icons · MIT</a>
        </footer>
      </main>
    );
  }

  if (screen === "result") {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <main className="quiz-shell result-shell">
        <header className="quiz-header">
          <button className="brand brand-button" onClick={returnToSetup}>
            <span className="brand-mark" aria-hidden="true">
              A
            </span>
            <span>Atlas</span>
          </button>
        </header>
        <section className="result-card">
          <p className="kicker">Øvelsen er fullført</p>
          <div className="result-score" aria-label={`${percentage} prosent riktig`}>
            <strong>{percentage}</strong>
            <span>%</span>
          </div>
          <h1>
            {percentage >= 90
              ? "Imponerende!"
              : percentage >= 70
                ? "Godt jobbet!"
                : percentage >= 50
                  ? "Du er på god vei."
                  : "Verden venter."}
          </h1>
          <p>
            Du fikk <strong>{score}</strong> av <strong>{questions.length}</strong>{" "}
            riktige i {selectedRegion.label.toLowerCase()}.
          </p>
          <div className="result-stats">
            <div>
              <span>Riktige</span>
              <strong>{score}</strong>
            </div>
            <div>
              <span>Feil</span>
              <strong>{questions.length - score}</strong>
            </div>
            <div>
              <span>Modus</span>
              <strong>{selectedMode.label}</strong>
            </div>
          </div>
          <button className="primary-button" onClick={returnToSetup}>
            Velg ny øvelse
            <span aria-hidden="true">→</span>
          </button>
        </section>
      </main>
    );
  }

  if (!question) return null;

  const answered = selectedCode !== null;
  const isCorrect = selectedCode === question.country.code;
  const progress = ((questionIndex + 1) / questions.length) * 100;

  return (
    <main className="quiz-shell quiz-active">
      <header className="quiz-header">
        <button className="brand brand-button" onClick={returnToSetup}>
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <span>Atlas</span>
        </button>
        <div className="quiz-meta">
          <span>{selectedRegion.label}</span>
          <strong>
            {questionIndex + 1} / {questions.length}
          </strong>
        </div>
        <button className="quiet-button" onClick={returnToSetup}>
          Avslutt
        </button>
      </header>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={questionIndex + 1}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <section className="question-area" aria-live="polite">
        <div className="question-prompt">
          <p className="kicker">{selectedMode.label}</p>
          {mode === "country-flag" && (
            <>
              <span className="question-label">Finn flagget til</span>
              <h1>{question.country.name}</h1>
            </>
          )}
          {mode === "flag-country" && (
            <>
              <span className="question-label">Hvilket land har dette flagget?</span>
              <div className="featured-flag-wrap">
                <Flag
                  country={question.country}
                  className="featured-flag"
                  revealName={answered}
                />
              </div>
            </>
          )}
          {mode === "country-capital" && (
            <>
              <span className="question-label">Hva er hovedstaden i</span>
              <div className="country-with-flag">
                <Flag
                  country={question.country}
                  className="prompt-flag"
                  revealName
                />
                <h1>{question.country.name}</h1>
              </div>
            </>
          )}
        </div>

        <div
          className={`answer-grid ${mode === "country-flag" ? "flag-grid" : "text-grid"}`}
        >
          {question.choices.map((choice, index) => {
            const isChosen = selectedCode === choice.code;
            const isAnswer = choice.code === question.country.code;
            const stateClass = answered
              ? isAnswer
                ? "is-correct"
                : isChosen
                  ? "is-wrong"
                  : "is-muted"
              : "";
            const label =
              mode === "country-capital"
                ? choice.capital
                : mode === "flag-country"
                  ? choice.name
                  : `Alternativ ${index + 1}`;

            return (
              <button
                className={`answer-card ${stateClass}`}
                key={choice.code}
                onClick={() => chooseAnswer(choice)}
                disabled={answered}
                aria-label={
                  mode === "country-flag"
                    ? answered
                      ? `${choice.name}${isAnswer ? ", riktig svar" : ""}`
                      : `Flaggalternativ ${index + 1}`
                    : label
                }
              >
                <span className="answer-index">{index + 1}</span>
                {mode === "country-flag" ? (
                  <Flag country={choice} revealName={answered} />
                ) : (
                  <strong>{label}</strong>
                )}
                {answered && isAnswer && (
                  <span className="answer-mark" aria-hidden="true">
                    ✓
                  </span>
                )}
                {answered && isChosen && !isAnswer && (
                  <span className="answer-mark wrong-mark" aria-hidden="true">
                    ×
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answered ? (
          <div className={`feedback-bar ${isCorrect ? "correct" : "wrong"}`}>
            <div>
              <span>{isCorrect ? "Riktig!" : "Ikke helt."}</span>
              <strong>
                {mode === "country-capital"
                  ? `${question.country.name}: ${question.country.capital}`
                  : question.country.name}
              </strong>
            </div>
            <button className="next-button" onClick={nextQuestion} autoFocus>
              {questionIndex === questions.length - 1 ? "Se resultat" : "Neste"}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          <div className="feedback-bar feedback-placeholder" aria-hidden="true" />
        )}
      </section>
    </main>
  );
}
