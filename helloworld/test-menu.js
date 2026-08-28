(function (root, factory) {
  "use strict";

  const api = factory(root?.GEOGRAFI_CURRICULUM);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root?.document) api.render(root.document);
})(typeof window !== "undefined" ? window : globalThis, function (curriculum) {
  "use strict";

  const copy = {
    nb: {
      title: "Manuell testmeny",
      intro: "Velg en tilstand. Bruk Tilbake i nettleseren for å komme tilbake hit.",
      open: "Åpne forhåndsvisning",
      finalQuestion: "Krever ett riktig svar.",
      sections: {
        basic: ["Grunnleggende resultater", "Resultater som fortsetter uten en etappefeiring."],
        results: ["Etapperesultat → feiring", "Perfekt resultat med knapp som åpner den valgte etappefeiringen."],
        celebrations: ["Direkte etappefeiringer", "Åpne hver feiring uten å spille en quiz."],
        replays: ["Spill feiringer igjen", "Test retur og fokus fra både forsiden og Nivåer."],
        questions: ["Én oppgave igjen", "Svar riktig én gang for å teste den ekte resultat- og feiringsflyten."],
        edge: ["Uvanlig rekkefølge", "Test etapper som mestres i en annen rekkefølge enn læreplanen."],
        world: ["Verden mestret", "Test den vanlige finaleflyten og sluttfeiringen direkte."],
        profiles: ["Testprofiler", "Importer fixtures/test-profiles-backup.json fra profilinnstillingene for varige testtilstander."],
      },
    },
    en: {
      title: "Manual test menu",
      intro: "Choose a state. Use your browser’s Back button to return here.",
      open: "Open preview",
      finalQuestion: "Requires one correct answer.",
      sections: {
        basic: ["Basic results", "Results that continue without a stage celebration."],
        results: ["Stage result → celebration", "Perfect results whose primary action opens the selected stage celebration."],
        celebrations: ["Direct stage celebrations", "Open every celebration without playing a quiz."],
        replays: ["Replay celebrations", "Test return behavior and focus from both Home and Levels."],
        questions: ["One question remaining", "Answer correctly once to test the genuine result and celebration flow."],
        edge: ["Out-of-order progress", "Test stages mastered in a different order from the curriculum."],
        world: ["World mastered", "Test the ordinary final flow and the finale directly."],
        profiles: ["Test profiles", "Import fixtures/test-profiles-backup.json from profile settings for persistent test states."],
      },
    },
  };

  const stageList = (curriculum?.stages ?? []).map((stage) => ({
    id: stage.id,
    icon: stage.icon,
    title: stage.title,
  }));

  function stageItems(preview, suffix = "") {
    const sectionId = preview === "milestone-result"
      ? "results"
      : preview === "milestone-question"
        ? "questions"
        : "celebrations";
    return stageList.map((stage) => ({
      title: { nb: `${stage.icon} ${stage.title.nb}${suffix ? ` · ${suffix}` : ""}`, en: `${stage.icon} ${stage.title.en}${suffix ? ` · ${suffix}` : ""}` },
      description: { nb: copy.nb.sections[sectionId][1], en: copy.en.sections[sectionId][1] },
      params: { preview, stage: stage.id },
      oneQuestion: preview === "milestone-question",
    }));
  }

  function scenarioGroups() {
    return [
      {
        id: "basic",
        items: [
          { title: { nb: "Neste quiz", en: "Next quiz" }, description: { nb: "Perfekt resultat som fortsetter i samme nivå.", en: "Perfect result continuing within the same level." }, params: { preview: "result-next-quiz" } },
          { title: { nb: "Neste nivå", en: "Next level" }, description: { nb: "Perfekt resultat som går videre til neste nivå.", en: "Perfect result advancing to the next level." }, params: { preview: "result-next-level" } },
        ],
      },
      { id: "results", items: stageItems("milestone-result") },
      { id: "celebrations", items: stageItems("milestone-celebration") },
      {
        id: "replays",
        items: stageList.flatMap((stage) => [
          { title: { nb: `${stage.icon} ${stage.title.nb} · Forsiden`, en: `${stage.icon} ${stage.title.en} · Home` }, description: { nb: "Spill feiringen igjen fra forsiden.", en: "Replay the celebration from Home." }, params: { preview: "milestone-replay", stage: stage.id } },
          { title: { nb: `${stage.icon} ${stage.title.nb} · Nivåer`, en: `${stage.icon} ${stage.title.en} · Levels` }, description: { nb: "Spill feiringen igjen fra Nivåer.", en: "Replay the celebration from Levels." }, params: { preview: "milestone-replay", stage: stage.id, source: "levels" } },
        ]),
      },
      { id: "questions", items: stageItems("milestone-question") },
      {
        id: "edge",
        items: [
          { title: { nb: "Turist er siste hull", en: "Tourist is the final gap" }, description: { nb: "Turist-feiring etterfølges av Verden mestret.", en: "Tourist celebration followed by World mastered." }, params: { preview: "tourist-world-final-question" }, oneQuestion: true },
          { title: { nb: "Navigatør før Turist", en: "Navigator before Tourist" }, description: { nb: "Navigatør mestres, deretter går fortsettelsen tilbake til Turist.", en: "Navigator is mastered, then continuation returns to Tourist." }, params: { preview: "navigator-tourist-gap-question" }, oneQuestion: true },
        ],
      },
      {
        id: "world",
        items: [
          { title: { nb: "Siste oppgave", en: "Final question" }, description: { nb: "Den vanlige finaleflyten med ett svar igjen.", en: "The ordinary finale with one answer remaining." }, params: { preview: "final-question" }, oneQuestion: true },
          { title: { nb: "Siste resultat", en: "Final result" }, description: { nb: "Resultat → Verdensmester → Verden mestret.", en: "Result → World Master → World mastered." }, params: { preview: "final-result" } },
          { title: { nb: "Sluttfeiring", en: "Final celebration" }, description: { nb: "Åpne Verden mestret direkte.", en: "Open World mastered directly." }, params: { preview: "final-celebration" } },
        ],
      },
    ];
  }

  function buildHref(params, locale = "nb") {
    const query = new URLSearchParams(params);
    if (locale === "en") query.set("lang", "en");
    return `./index.html?${query.toString()}`;
  }

  function render(document) {
    let locale = "nb";
    const menu = document.querySelector("[data-test-menu]");
    const title = document.querySelector("[data-test-title]");
    const intro = document.querySelector("[data-test-intro]");

    function draw() {
      document.documentElement.lang = locale;
      document.title = `${copy[locale].title} · Hello World!`;
      title.textContent = copy[locale].title;
      intro.textContent = copy[locale].intro;
      document.querySelectorAll("[data-test-language]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.testLanguage === locale));
      });
      menu.innerHTML = scenarioGroups().map((group) => {
        const [heading, description] = copy[locale].sections[group.id];
        return `<section class="test-section"><h2>${heading}</h2><p>${description}</p><div class="test-grid">${group.items.map((item) => {
          const href = buildHref(item.params, locale);
          return `<article class="test-card"><strong>${item.title[locale]}</strong><p>${item.description[locale]}${item.oneQuestion ? ` <b>${copy[locale].finalQuestion}</b>` : ""}</p><code>${href}</code><a class="test-link" href="${href}">${copy[locale].open}</a></article>`;
        }).join("")}</div></section>`;
      }).join("") + `<section class="test-section"><h2>${copy[locale].sections.profiles[0]}</h2><p class="test-note">${copy[locale].sections.profiles[1]}<br><strong>Test · Navigator earned; Tourist name left</strong><br><strong>Test · All stages except Tourist flag</strong></p></section>`;
    }

    document.querySelectorAll("[data-test-language]").forEach((button) => {
      button.addEventListener("click", () => { locale = button.dataset.testLanguage; draw(); });
    });
    draw();
  }

  return Object.freeze({ buildHref, copy, render, scenarioGroups, stageList });
});
