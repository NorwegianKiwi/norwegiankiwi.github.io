/* =========================
   Data: spørsmål
   - Hvert alternativ har { letter, text }
   - Riktig svar per spørsmål har bokstav som bygger løsningsordet i rekkefølge
   - Feil alternativer bruker aldri bokstaver fra løsningsordet for den delen
   ========================= */

const questions = {
  1: [
    {
      q: "Hvilket land har flest innsjøer?",
      options: [
        { letter: "B", text: "Russland" },
        { letter: "C", text: "USA" },
        { letter: "K", text: "Canada" },
        { letter: "D", text: "Finland" },
        { letter: "F", text: "Sverige" }
      ]
    },
    {
      q: "Hva er den varmeste planeten i solsystemet vårt?",
      options: [
        { letter: "B", text: "Merkur" },
        { letter: "A", text: "Venus" },
        { letter: "C", text: "Mars" },
        { letter: "D", text: "Jupiter" },
        { letter: "F", text: "Saturn" }
      ]
    },
    {
      q: "Hvilket organ bruker mest energi i kroppen i hvile?",
      options: [
        { letter: "B", text: "Hjertet" },
        { letter: "C", text: "Leveren" },
        { letter: "R", text: "Hjernen" },
        { letter: "D", text: "Lungene" },
        { letter: "F", text: "Musklene" }
      ]
    },
    {
      q: "Hva gjør at chili smaker sterkt?",
      options: [
        { letter: "P", text: "Capsaicin" },
        { letter: "B", text: "Koffein" },
        { letter: "C", text: "Nikotin" },
        { letter: "D", text: "Tannin" },
        { letter: "F", text: "Alkohol" }
      ]
    },
    {
      q: "Hvilket av disse landene er minst i areal?",
      options: [
        { letter: "B", text: "Monaco" },
        { letter: "E", text: "Vatikanstaten" },
        { letter: "C", text: "San Marino" },
        { letter: "D", text: "Liechtenstein" },
        { letter: "F", text: "Malta" }
      ]
    },
    {
      q: "Hva veier mest?",
      options: [
        { letter: "B", text: "1 kg bomull" },
        { letter: "C", text: "1 kg jern" },
        { letter: "D", text: "1 kg fjær" },
        { letter: "K", text: "Alle veier like mye" },
        { letter: "F", text: "Avhenger av temperatur" }
      ]
    },
    {
      q: "Hvilket språk har flest morsmålsbrukere i verden?",
      options: [
        { letter: "B", text: "Engelsk" },
        { letter: "C", text: "Spansk" },
        { letter: "D", text: "Hindi" },
        { letter: "E", text: "Mandarin" },
        { letter: "F", text: "Arabisk" }
      ]
    },
    {
      q: "Hvor i kroppen sitter lårbeinet (femur)?",
      options: [
        { letter: "B", text: "Hånden" },
        { letter: "C", text: "Foten" },
        { letter: "P", text: "Låret" },
        { letter: "D", text: "Ryggen" },
        { letter: "F", text: "Skulderen" }
      ]
    },
    {
      q: "Hva er Great Barrier Reef?",
      options: [
        { letter: "B", text: "En ørken" },
        { letter: "C", text: "En elv" },
        { letter: "P", text: "Et korallrev" },
        { letter: "D", text: "En fjellkjede" },
        { letter: "F", text: "En innsjø" }
      ]
    },
    {
      q: "Hva kalles en polygon med 6 sider?",
      options: [
        { letter: "B", text: "Trekant" },
        { letter: "C", text: "Firkant" },
        { letter: "D", text: "Femkant" },
        { letter: "E", text: "Sekskant" },
        { letter: "F", text: "Åttekant" }
      ]
    }
  ],

  2: [
    {
      q: "Hvor mange tidssoner har Russland?",
      options: [
        { letter: "A", text: "5" },
        { letter: "B", text: "7" },
        { letter: "C", text: "9" },
        { letter: "L", text: "11" },
        { letter: "D", text: "13" }
      ]
    },
    {
      q: "Hvor mange hjerter har en blekksprut?",
      options: [
        { letter: "A", text: "1" },
        { letter: "B", text: "2" },
        { letter: "E", text: "3" },
        { letter: "C", text: "4" },
        { letter: "D", text: "5" }
      ]
    },
    {
      q: "Hva er hovedstaden i Australia?",
      options: [
        { letter: "A", text: "Sydney" },
        { letter: "B", text: "Melbourne" },
        { letter: "S", text: "Canberra" },
        { letter: "C", text: "Perth" },
        { letter: "D", text: "Brisbane" }
      ]
    },
    {
      q: "Hvor mange sanser regnes det tradisjonelt at mennesker har?",
      options: [
        { letter: "A", text: "3" },
        { letter: "B", text: "4" },
        { letter: "E", text: "5" },
        { letter: "C", text: "6" },
        { letter: "D", text: "7" }
      ]
    },
    {
      q: "Hvilken gass trenger vi for å puste?",
      options: [
        { letter: "A", text: "Nitrogen" },
        { letter: "S", text: "Oksygen" },
        { letter: "B", text: "Karbondioksid" },
        { letter: "C", text: "Helium" },
        { letter: "D", text: "Hydrogen" }
      ]
    },
    {
      q: "Hvilket av disse er en fugl?",
      options: [
        { letter: "J", text: "Pingvin" },
        { letter: "A", text: "Delfin" },
        { letter: "B", text: "Hai" },
        { letter: "C", text: "Skilpadde" },
        { letter: "D", text: "Frosk" }
      ]
    },
    {
      q: "Hva er nordlys i hovedsak et resultat av?",
      options: [
        { letter: "A", text: "Reflektert sollys" },
        { letter: "B", text: "Brennende gasser" },
        { letter: "U", text: "Kollisjon mellom solpartikler og atmosfæren" },
        { letter: "C", text: "Radioaktiv stråling" },
        { letter: "D", text: "Havstrømmer" }
      ]
    },
    {
      q: "Hvilken planet er størst i solsystemet?",
      options: [
        { letter: "A", text: "Mars" },
        { letter: "B", text: "Venus" },
        { letter: "N", text: "Jupiter" },
        { letter: "C", text: "Merkur" },
        { letter: "D", text: "Neptun" }
      ]
    },
    {
      q: "I hvilken måned feires jul (25. desember)?",
      options: [
        { letter: "A", text: "Oktober" },
        { letter: "B", text: "November" },
        { letter: "I", text: "Desember" },
        { letter: "C", text: "Januar" },
        { letter: "D", text: "Februar" }
      ]
    }
  ]
};

/* =========================
   Storage helpers
   ========================= */

const STORAGE_KEY = "julequiz_answers_v2";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { 1: [], 2: [] };
    const parsed = JSON.parse(raw);
    return {
      1: Array.isArray(parsed["1"]) ? parsed["1"] : [],
      2: Array.isArray(parsed["2"]) ? parsed["2"] : []
    };
  } catch {
    return { 1: [], 2: [] };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetPart(part) {
  const state = loadState();
  state[part] = [];
  saveState(state);
}

function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
}

/* =========================
   UI: shared
   ========================= */

function lettersForPart(part) {
  const state = loadState();
  const count = questions[part].length;
  const answers = state[part] || [];
  const out = [];
  for (let i = 0; i < count; i++) {
    const letter = answers[i];
    out.push(typeof letter === "string" && letter.length ? letter : "_");
  }
  return out.join(" ");
}

/* =========================
   UI: index
   ========================= */

function initIndex() {
  const el1 = document.getElementById("letters-part-1");
  const el2 = document.getElementById("letters-part-2");

  if (el1) el1.textContent = lettersForPart(1);
  if (el2) el2.textContent = lettersForPart(2);

  // Start vs Fortsett
  const state = loadState();

  const start1 = document.getElementById("start-part-1");
  if (start1) {
    const started = (state[1] || []).some(v => typeof v === "string" && v.length);
    start1.textContent = started ? "Fortsett" : "Start";
  }

  const start2 = document.getElementById("start-part-2");
  if (start2) {
    const started = (state[2] || []).some(v => typeof v === "string" && v.length);
    start2.textContent = started ? "Fortsett" : "Start";
  }

  const r1 = document.getElementById("reset-part-1");
  const r2 = document.getElementById("reset-part-2");
  const ra = document.getElementById("reset-all");

  if (r1) r1.addEventListener("click", () => { resetPart(1); window.location.reload(); });
  if (r2) r2.addEventListener("click", () => { resetPart(2); window.location.reload(); });
  if (ra) ra.addEventListener("click", () => { resetAll(); window.location.reload(); });
}

/* =========================
   UI: quiz
   ========================= */

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function initQuiz() {
  const partStr = getQueryParam("part");
  if (!partStr) return;

  const part = Number(partStr);
  if (![1, 2].includes(part)) return;

  const total = questions[part].length;

  const titleEl = document.getElementById("part-title");
  const progressEl = document.getElementById("progress");
  const qEl = document.getElementById("question-text");
  const optionsEl = document.getElementById("options");
  const lettersLiveEl = document.getElementById("letters-live");

  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const indexHref = "index.html";

  if (!titleEl || !progressEl || !qEl || !optionsEl || !prevBtn || !nextBtn || !lettersLiveEl) return;

  titleEl.textContent = `Del ${part}`;

  let currentIndex = 0;

  function renderLettersLive() {
    lettersLiveEl.textContent = lettersForPart(part);
  }

  function render() {
    const item = questions[part][currentIndex];
    const state = loadState();
    const selectedLetter = state[part]?.[currentIndex];

    progressEl.textContent = `Spørsmål ${currentIndex + 1} av ${total}`;
    qEl.textContent = item.q;

    optionsEl.innerHTML = "";

    item.options.forEach((opt, idx) => {
      const id = `opt-${currentIndex}-${idx}`;

      const label = document.createElement("label");
      label.className = "option";
      if (selectedLetter === opt.letter) label.classList.add("selected");
      label.setAttribute("for", id);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.id = id;
      input.value = String(idx);
      input.checked = selectedLetter === opt.letter;

      input.addEventListener("change", () => {
        const st = loadState();
        while (st[part].length < total) st[part].push(null);
        st[part][currentIndex] = item.options[idx].letter; // lagrer bokstav
        saveState(st);
        render();
        renderLettersLive();
      });

      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = opt.letter;

      const textSpan = document.createElement("span");
      textSpan.textContent = opt.text;

      label.appendChild(input);
      label.appendChild(badge);
      label.appendChild(textSpan);

      optionsEl.appendChild(label);
    });

    prevBtn.disabled = currentIndex === 0;

    // Hvis siste spørsmål: endre teksten på "Neste" til "Til forsiden"
    const isLast = currentIndex === total - 1;
    nextBtn.textContent = isLast ? "Til forsiden" : "Neste";
    nextBtn.disabled = false;

    renderLettersLive();
  }

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      render();
    }
  });

  nextBtn.addEventListener("click", () => {
    const isLast = currentIndex === total - 1;
    if (isLast) {
        window.location.href = indexHref;
        return;
    }
    currentIndex++;
    render();
  });

  render();
}

/* =========================
   Boot
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  initIndex();
  initQuiz();
});
