/* =========================
   Data: spørsmål
   - Hvert alternativ har { letter, text }
   - Riktig svar per spørsmål har bokstav som bygger løsningsordet i rekkefølge
   - Feil alternativer bruker aldri bokstaver fra løsningsordet for den delen
   ========================= */

const questions = {
  1: [
    {
      q: "Hva er den største planeten i solsystemet?",
      options: [
        { letter: "R", text: "Mars" },
        { letter: "T", text: "Saturn" },
        { letter: "K", text: "Uranus" },
        { letter: "H", text: "Neptun" },
        { letter: "L", text: "Ingen av disse" }
      ]
    },
    {
      q: "Hvilket navn hører ikke hjemme i Kaptein Sabeltanns univers?",
      options: [
        { letter: "A", text: "Langemann" },
        { letter: "I", text: "Synnøve" },
        { letter: "O", text: "Skalken" },
        { letter: "Å", text: "Pelle" },
        { letter: "Æ", text: "Ruben" }
      ]
    },
    {
      q: "Hvor mange hjerter har en blekksprut?",
      options: [
        { letter: "M", text: "1" },
        { letter: "R", text: "2" },
        { letter: "N", text: "3" },
        { letter: "K", text: "8" },
        { letter: "T", text: "Blekkspruter er hjerteløse" }
      ]
    },
    {
      q: "Hva veier mest?",
      options: [
        { letter: "A", text: "1 kg snø" },
        { letter: "O", text: "1 kg ferskvann" },
        { letter: "Å", text: "1 kg saltvann" },
        { letter: "Æ", text: "Det kommer an på temperaturen" },
        { letter: "E", text: "Alle veier like mye" }
      ]
    },
    {
      q: "Hva er hovedstaden i Australia?",
      options: [
        { letter: "M", text: "Brisbane" },
        { letter: "J", text: "Canberra" },
        { letter: "T", text: "Melbourne" },
        { letter: "K", text: "Perth" },
        { letter: "R", text: "Sydney" }
      ]
    },
    {
      q: "Hva er hovedingrediensen i kaviar?",
      options: [
        { letter: "A", text: "Tang" },
        { letter: "O", text: "Majones" },
        { letter: "E", text: "Fiskeegg" },
        { letter: "Å", text: "Fiskelever" },
        { letter: "Æ", text: "Sukker" }
      ]
    },
    {
      q: "Hvilken dag er årets korteste i Norge?",
      options: [
        { letter: "R", text: "18. desember" },
        { letter: "T", text: "2. søndag i advent" },
        { letter: "S", text: "21. desember" },
        { letter: "K", text: "Julaften" },
        { letter: "M", text: "Nyttårsaften" }
      ]
    },
    {
      q: "Hvor mange land er det i Sør-Amerika?",
      options: [
        { letter: "U", text: "12" },
        { letter: "A", text: "13" },
        { letter: "O", text: "14" },
        { letter: "Y", text: "15" },
        { letter: "Æ", text: "Flere enn 15" }
      ]
    },
    {
      q: "Hva er det tiende primtallet?",
      options: [
        { letter: "R", text: "10" },
        { letter: "T", text: "19" },
        { letter: "K", text: "23" },
        { letter: "S", text: "29" },
        { letter: "M", text: "31" }
      ]
    }
  ],

  2: [
    {
      q: "Hvilket språk har flest morsmålsbrukere i verden?",
      options: [
        { letter: "R", text: "Arabisk" },
        { letter: "L", text: "Engelsk" },
        { letter: "M", text: "Hindi" },
        { letter: "S", text: "Mandarin" },
        { letter: "K", text: "Spansk" }
      ]
    },
    {
      q: "Hvilket land hadde flest innbyggere i 2025?",
      options: [
        { letter: "I", text: "India" },
        { letter: "Å", text: "Indonesia" },
        { letter: "Y", text: "Kina" },
        { letter: "U", text: "Russland" },
        { letter: "O", text: "USA" }
      ]
    },
    {
      q: "Hvor mange ganger har det norske landslaget i håndball for kvinner vunnet VM?",
      options: [
        { letter: "R", text: "4" },
        { letter: "V", text: "5" },
        { letter: "K", text: "6" },
        { letter: "M", text: "7" },
        { letter: "H", text: "8" }
      ]
    },
    {
      q: "Hva er adressen til Slottet?",
      options: [
        { letter: "R", text: "Karl Johans gate 1" },
        { letter: "K", text: "Henrik Ibsens gate 1" },
        { letter: "M", text: "Dronningens gate 1" },
        { letter: "H", text: "Drammensveien 1" },
        { letter: "D", text: "Slottsplassen 1" }
      ]
    },
    {
      q: "Hva heter sangen der de synger at de ikke har tid fordi de må finne skjegget?",
      options: [
        { letter: "O", text: "Klippe-klippe" },
        { letter: "A", text: "Spikke-sage-lime-banke" },
        { letter: "U", text: "Putti Plutti Pott" },
        { letter: "Y", text: "Vi ha’kke tid, for vi må finne skjegget" },
        { letter: "Å", text: "Jakten på julenissens skjegg" }
      ]
    },
    {
      q: "Hvilket av disse landene er minst i areal?",
      options: [
        { letter: "R", text: "Liechtenstein" },
        { letter: "K", text: "Malta" },
        { letter: "M", text: "Monaco" },
        { letter: "H", text: "San Marino" },
        { letter: "T", text: "Vatikanstaten" }
      ]
    },
    {
      q: "Hvilket av disse ordene betyr ikke jul?",
      options: [
        { letter: "R", text: "Navidad" },
        { letter: "T", text: "Nager" },
        { letter: "M", text: "Natal" },
        { letter: "K", text: "Noël" },
        { letter: "H", text: "Jólin" }
      ]
    },
    {
      q: "Hvilken pris fikk Kunstsiloen i Kristiansand i 2025?",
      options: [
        { letter: "R", text: "Norges mest miljøvennlige offentlige bygg" },
        { letter: "K", text: "Europas mest originale museum" },
        { letter: "N", text: "Verdens vakreste museum" },
        { letter: "M", text: "Nord-Europas mest besøkte kunstmuseum" },
        { letter: "H", text: "Skandinavias mest innflytelsesrike museum" }
      ]
    },
    {
      q: "Når ble Tre nøtter til Askepott første gang vist på NRK?",
      options: [
        { letter: "O", text: "1973" },
        { letter: "E", text: "1975" },
        { letter: "U", text: "1979" },
        { letter: "Y", text: "1981" },
        { letter: "Å", text: "1982" }
      ]
    },
    {
      q: "I hvilken by bor familien til Kevin i filmen «Home Alone»?",
      options: [
        { letter: "R", text: "Boston" },
        { letter: "D", text: "Chicago" },
        { letter: "M", text: "Los Angeles" },
        { letter: "K", text: "New York" },
        { letter: "H", text: "Seattle" }
      ]
    }
  ],

  3: [
    {
      q: "Hvilken julelåt inneholder teksten «I don’t want a lot for Christmas»?",
      options: [
        { letter: "H", text: "Santa Baby" },
        { letter: "M", text: "Jingle Bell Rock" },
        { letter: "N", text: "All I Want for Christmas Is You" },
        { letter: "F", text: "Merry Christmas Everyone" },
        { letter: "V", text: "Do They Know It’s Christmas?" }
      ]
    },
    {
      q: "Hvilket av disse landene ligger ikke på ekvator?",
      options: [
        { letter: "O", text: "Brasil" },
        { letter: "E", text: "Ecuador" },
        { letter: "Å", text: "Indonesia" },
        { letter: "Æ", text: "Kenya" },
        { letter: "Y", text: "Malaysia" }
      ]
    },
    {
      q: "Hvor langt er det rundt ekvator?",
      options: [
        { letter: "H", text: "4 000 km" },
        { letter: "K", text: "40 000 km" },
        { letter: "M", text: "400 000 km" },
        { letter: "F", text: "4 millioner km" },
        { letter: "V", text: "40 millioner km" }
      ]
    },
    {
      q: "Hvilken påstand er sann?",
      options: [
        { letter: "H", text: "Alle primtall er oddetall" },
        { letter: "M", text: "89 er det største primtallet under 100" },
        { letter: "R", text: "Det finnes uendelig mange primtall" },
        { letter: "F", text: "39 er et primtall" },
        { letter: "V", text: "1000 har flere forskjellige primtallsfaktorer enn 100" }
      ]
    },
    {
      q: "Norge har kvalifisert seg til fotball-VM 2026. Hvor mange mål scoret Norge i kvalifiseringen?",
      options: [
        { letter: "E", text: "34" },
        { letter: "I", text: "35" },
        { letter: "Æ", text: "36" },
        { letter: "Ø", text: "37" },
        { letter: "Å", text: "38" }
      ]
    },
    {
      q: "Hva har ikke vært en OL-gren?",
      options: [
        { letter: "L", text: "Etthjulssykling" },
        { letter: "H", text: "Tandemsykling" },
        { letter: "M", text: "Levende due-skyting" },
        { letter: "F", text: "Tautrekking" },
        { letter: "V", text: "Lengdestup" }
      ]
    },
    {
      q: "Hvilken av disse er ikke en trekkfugl?",
      options: [
        { letter: "H", text: "Gjøk" },
        { letter: "M", text: "Stær" },
        { letter: "L", text: "Skjære" },
        { letter: "F", text: "Bokfink" },
        { letter: "V", text: "Svarttrost" }
      ]
    },
    {
      q: "Hvor mye koster porto for et brev (20 g) innenlands i Norge i 2025?",
      options: [
        { letter: "H", text: "12 kr" },
        { letter: "M", text: "15 kr" },
        { letter: "F", text: "18 kr" },
        { letter: "V", text: "22 kr" },
        { letter: "T", text: "25 kr" }
      ]
    },
    {
      q: "Hvor mye kostet porto for et brev (20 g) innenlands i Norge i år 2000?",
      options: [
        { letter: "A", text: "4 kr" },
        { letter: "E", text: "6 kr" },
        { letter: "I", text: "8 kr" },
        { letter: "O", text: "10 kr" },
        { letter: "Å", text: "12 kr" }
      ]
    },
    {
      q: "Hvor mange tidssoner har Russland?",
      options: [
        { letter: "H", text: "3" },
        { letter: "M", text: "5" },
        { letter: "F", text: "7" },
        { letter: "V", text: "9" },
        { letter: "S", text: "11" }
      ]
    },
    {
      q: "Hvilken påstand er sann?",
      options: [
        { letter: "H", text: "Denne oppgaven har ingen rette svar" },
        { letter: "S", text: "Denne oppgaven har ett rett svar" },
        { letter: "M", text: "Denne oppgaven har to rette svar" },
        { letter: "F", text: "Ingen av de andre alternativene er riktige" },
        { letter: "V", text: "Alle de andre alternativene er riktige" }
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
