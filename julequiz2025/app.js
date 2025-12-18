/* =========================
   Data: spørsmål
   - Hvert alternativ har { letter, text }
   - Riktig svar per spørsmål har bokstav som bygger løsningsordet i rekkefølge
   - Feil alternativer bruker aldri bokstaver fra løsningsordet for den delen
   ========================= */

const questions = {
  1: [
    {
      q: "Hvilket land har hovedstaden Ottawa?",
      options: [
        { letter: "B", text: "Australia" },
        { letter: "L", text: "Canada" },
        { letter: "C", text: "Sverige" },
        { letter: "D", text: "Tyskland" },
        { letter: "F", text: "Japan" }
      ]
    },
    {
      q: "Hva kalles en figur med tre sider?",
      options: [
        { letter: "I", text: "Trekant" },
        { letter: "B", text: "Firkant" },
        { letter: "C", text: "Femkant" },
        { letter: "D", text: "Sekskant" },
        { letter: "F", text: "Sirkel" }
      ]
    },
    {
      q: "Hva heter planeten vi bor på?",
      options: [
        { letter: "B", text: "Mars" },
        { letter: "C", text: "Venus" },
        { letter: "N", text: "Jorden" },
        { letter: "D", text: "Jupiter" },
        { letter: "F", text: "Merkur" }
      ]
    },
    {
      q: "Hvilken gass trenger vi for å puste (mest relevant for kroppen)?",
      options: [
        { letter: "B", text: "Nitrogen" },
        { letter: "C", text: "Helium" },
        { letter: "D", text: "Hydrogen" },
        { letter: "E", text: "Oksygen" },
        { letter: "F", text: "Karbondioksid" }
      ]
    },
    {
      q: "Hvilket kontinent ligger Egypt i?",
      options: [
        { letter: "B", text: "Europa" },
        { letter: "C", text: "Asia" },
        { letter: "J", text: "Afrika" },
        { letter: "D", text: "Sør-Amerika" },
        { letter: "F", text: "Oseania" }
      ]
    },
    {
      q: "Hvor mange minutter er det i en time?",
      options: [
        { letter: "B", text: "30" },
        { letter: "E", text: "60" },
        { letter: "C", text: "90" },
        { letter: "D", text: "45" },
        { letter: "F", text: "120" }
      ]
    },
    {
      q: "Hvilket av disse er et pattedyr?",
      options: [
        { letter: "B", text: "Laks" },
        { letter: "C", text: "Øgle" },
        { letter: "D", text: "Frosk" },
        { letter: "S", text: "Delfin" },
        { letter: "F", text: "Hummer" }
      ]
    },
    {
      q: "Hva heter instrumentet som måler temperatur?",
      options: [
        { letter: "U", text: "Termometer" },
        { letter: "B", text: "Barometer" },
        { letter: "C", text: "Seismograf" },
        { letter: "D", text: "Hygrometer" },
        { letter: "F", text: "Kompass" }
      ]
    },
    {
      q: "Hva kalles det som faller fra himmelen om vinteren og er hvitt og kaldt?",
      options: [
        { letter: "B", text: "Regn" },
        { letter: "C", text: "Hagl" },
        { letter: "D", text: "Dugg" },
        { letter: "S", text: "Snø" },
        { letter: "F", text: "Tåke" }
      ]
    }
  ],

  2: [
    {
      q: "Hva er hovedstaden i Norge?",
      options: [
        { letter: "S", text: "Oslo" },
        { letter: "B", text: "Bergen" },
        { letter: "C", text: "Trondheim" },
        { letter: "F", text: "Stavanger" },
        { letter: "G", text: "Tromsø" }
      ]
    },
    {
      q: "Hva er 7 + 5?",
      options: [
        { letter: "B", text: "10" },
        { letter: "I", text: "12" },
        { letter: "C", text: "11" },
        { letter: "F", text: "13" },
        { letter: "G", text: "14" }
      ]
    },
    {
      q: "Hvilken av disse er en væske ved romtemperatur?",
      options: [
        { letter: "B", text: "Stein" },
        { letter: "C", text: "Is" },
        { letter: "F", text: "Jern" },
        { letter: "V", text: "Vann" },
        { letter: "G", text: "Glass" }
      ]
    },
    {
      q: "Hva kalles en baby-katt på norsk?",
      options: [
        { letter: "D", text: "Kattunge" },
        { letter: "B", text: "Kalv" },
        { letter: "C", text: "Valp" },
        { letter: "F", text: "Lam" },
        { letter: "G", text: "Føll" }
      ]
    },
    {
      q: "Hvilken farge får du hvis du blander rød og hvit?",
      options: [
        { letter: "B", text: "Lilla" },
        { letter: "C", text: "Oransje" },
        { letter: "A", text: "Rosa" },
        { letter: "F", text: "Grønn" },
        { letter: "G", text: "Brun" }
      ]
    },
    {
      q: "Hvor mange dager er det i en uke?",
      options: [
        { letter: "B", text: "5" },
        { letter: "C", text: "6" },
        { letter: "T", text: "7" },
        { letter: "F", text: "8" },
        { letter: "G", text: "10" }
      ]
    },
    {
      q: "Hvilket av disse er en frukt?",
      options: [
        { letter: "B", text: "Gulrot" },
        { letter: "C", text: "Potet" },
        { letter: "F", text: "Løk" },
        { letter: "T", text: "Eple" },
        { letter: "G", text: "Salat" }
      ]
    },
    {
      q: "Hva er den største planeten i solsystemet?",
      options: [
        { letter: "N", text: "Jupiter" },
        { letter: "B", text: "Mars" },
        { letter: "C", text: "Venus" },
        { letter: "F", text: "Merkur" },
        { letter: "G", text: "Jorden" }
      ]
    },
    {
      q: "Hva kalles en voksen hann av sau?",
      options: [
        { letter: "B", text: "Ku" },
        { letter: "C", text: "Hane" },
        { letter: "F", text: "Orne" },
        { letter: "E", text: "Vær" },
        { letter: "G", text: "Bukk" }
      ]
    },
    {
      q: "Hva er motsatt av 'opp'?",
      options: [
        { letter: "D", text: "Ned" },
        { letter: "B", text: "Rundt" },
        { letter: "C", text: "Bort" },
        { letter: "F", text: "Forbi" },
        { letter: "G", text: "Over" }
      ]
    }
  ],

  3: [
    {
      q: "Hva heter måneden etter oktober?",
      options: [
        { letter: "B", text: "September" },
        { letter: "C", text: "Oktober" },
        { letter: "N", text: "November" },
        { letter: "D", text: "August" },
        { letter: "E", text: "Januar" }
      ]
    },
    {
      q: "Hvilket av disse er et tall?",
      options: [
        { letter: "Y", text: "7" },
        { letter: "B", text: "Blå" },
        { letter: "C", text: "Hund" },
        { letter: "D", text: "Vinter" },
        { letter: "E", text: "Rund" }
      ]
    },
    {
      q: "Hva kalles en figur med fire like sider og fire rette vinkler?",
      options: [
        { letter: "B", text: "Sirkel" },
        { letter: "K", text: "Kvadrat" },
        { letter: "C", text: "Trekant" },
        { letter: "D", text: "Trapes" },
        { letter: "E", text: "Femkant" }
      ]
    },
    {
      q: "Hva kalles fargen du får hvis du blander blått og gult?",
      options: [
        { letter: "B", text: "Lilla" },
        { letter: "C", text: "Rød" },
        { letter: "D", text: "Rosa" },
        { letter: "R", text: "Grønn" },
        { letter: "E", text: "Brun" }
      ]
    },
    {
      q: "Hvilken bokstav er en vokal?",
      options: [
        { letter: "Ø", text: "Ø" },
        { letter: "B", text: "B" },
        { letter: "C", text: "C" },
        { letter: "D", text: "D" },
        { letter: "F", text: "F" }
      ]
    },
    {
      q: "Hva kalles en 'kald natt' ofte om vinteren?",
      options: [
        { letter: "B", text: "Sommernatt" },
        { letter: "C", text: "Høststorm" },
        { letter: "D", text: "Vårdag" },
        { letter: "L", text: "Frostnatt" },
        { letter: "E", text: "Regnvær" }
      ]
    },
    {
      q: "Hva kalles et tog som går under bakken i store byer?",
      options: [
        { letter: "B", text: "Trikk" },
        { letter: "C", text: "Buss" },
        { letter: "D", text: "Taxi" },
        { letter: "F", text: "Ferje" },
        { letter: "L", text: "T-bane" }
      ]
    },
    {
      q: "Hva heter Norges nasjonalfjell (ofte omtalt i skolekunnskap)?",
      options: [
        { letter: "T", text: "Galdhøpiggen" },
        { letter: "B", text: "K2" },
        { letter: "C", text: "Mount Everest" },
        { letter: "D", text: "Fuji" },
        { letter: "E", text: "Kilimanjaro" }
      ]
    },
    {
      q: "Hva er 2 + 2?",
      options: [
        { letter: "A", text: "4" },
        { letter: "B", text: "3" },
        { letter: "C", text: "5" },
        { letter: "D", text: "6" },
        { letter: "E", text: "2" }
      ]
    },
    {
      q: "Hva kalles den årstiden som kommer etter høst?",
      options: [
        { letter: "S", text: "Vinter" },
        { letter: "B", text: "Sommer" },
        { letter: "C", text: "Vår" },
        { letter: "D", text: "Høst" },
        { letter: "E", text: "Monsoon" }
      ]
    },
    {
      q: "Hva kalles et varmt drikkeord som ofte serveres i desember i Norge?",
      options: [
        { letter: "S", text: "Gløgg" },
        { letter: "B", text: "Smoothie" },
        { letter: "C", text: "Is-te" },
        { letter: "D", text: "Mineralvann" },
        { letter: "E", text: "Kakao-is" }
      ]
    }
  ]
};

/* =========================
   Storage helpers
   ========================= */

const STORAGE_KEY = "julequiz_answers_v2";

function normalizeWord(s) {
  return (s || "")
    .toUpperCase()
    // Keep letters A–Z plus ÆØÅ; remove everything else
    .replace(/[^A-ZÆØÅ]/g, "");
}

async function sha256Hex(str) {
  const data = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, "0")).join("");
}

// NOTE: Hashes have been generated by pasting the following code into a browser console,
//       along with the functions normalizeWord and sha256Hex above,
//       where XXX, YYY, and ZZZ have been replaced by the solution words:
// (async () => {
//   const salt1 = "del1-2025-12-18-bdc8fbebc5348fd0";
//   const salt2 = "del2-2025-12-18-512c42a1a267eeab";
//   const salt3 = "del3-2025-12-18-d8bb10a117d3d30c";
// 
//   console.log("DEL1", await sha256Hex(`${salt1}:${normalizeWord("XXX")}`));
//   console.log("DEL2", await sha256Hex(`${salt2}:${normalizeWord("YYY")}`));
//   console.log("DEL3", await sha256Hex(`${salt3}:${normalizeWord("ZZZ")}`));
// })();


const solutionCheck = {
  1: {
    salt: "del1-2025-12-18-bdc8fbebc5348fd0",
    expectedHash: "4e86ef34fc26038bc98fe6ed219a9411dbf649e7df23a6639cc0fdcaebf74a94"
  },
  2: {
    salt: "del2-2025-12-18-512c42a1a267eeab",
    expectedHash: "09b5f54fe6fc55ef59618874630e33ffda457aa7c731c0423cda51a8c16d96b0"
  },
  3: {
    salt: "del3-2025-12-18-d8bb10a117d3d30c",
    expectedHash: "409b5ab34a02766e1372debfd055aa3bea8b72d0b0910ee0ab05e734d0148219"
  }
};

async function verifySolution(part, userInput) {
  const cfg = solutionCheck[part];
  if (!cfg) return false;
  const candidate = normalizeWord(userInput);
  const hex = await sha256Hex(`${cfg.salt}:${candidate}`);
  return hex === cfg.expectedHash;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { 1: [], 2: [], 3: [] };
    const parsed = JSON.parse(raw);
    return {
      1: Array.isArray(parsed["1"]) ? parsed["1"] : [],
      2: Array.isArray(parsed["2"]) ? parsed["2"] : [],
      3: Array.isArray(parsed["3"]) ? parsed["3"] : [],
    };
  } catch {
    return { 1: [], 2: [], 3: [] };
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
  const el3 = document.getElementById("letters-part-3");

  if (el1) el1.textContent = lettersForPart(1);
  if (el2) el2.textContent = lettersForPart(2);
  if (el3) el3.textContent = lettersForPart(3);

  const r1 = document.getElementById("reset-part-1");
  const r2 = document.getElementById("reset-part-2");
  const r3 = document.getElementById("reset-part-3");
  const ra = document.getElementById("reset-all");

  if (r1) r1.addEventListener("click", () => { resetPart(1); window.location.reload(); });
  if (r2) r2.addEventListener("click", () => { resetPart(2); window.location.reload(); });
  if (r3) r3.addEventListener("click", () => { resetPart(3); window.location.reload(); });
  if (ra) ra.addEventListener("click", () => { resetAll(); window.location.reload(); });

  function wireCheck(part) {
    const input = document.getElementById(`solve-${part}`);
    const btn = document.getElementById(`check-${part}`);
    const out = document.getElementById(`result-${part}`);
    if (!input || !btn || !out) return;
  
    async function run() {
      out.classList.remove("ok", "bad");
      out.textContent = "…";
      const ok = await verifySolution(part, input.value);
      out.textContent = ok ? "Riktig" : "Feil";
      out.classList.add(ok ? "ok" : "bad");
    }
  
    btn.addEventListener("click", run);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        run();
      }
    });
  }
  
  wireCheck(1);
  wireCheck(2);
  wireCheck(3);
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
  if (![1, 2, 3].includes(part)) return;

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
