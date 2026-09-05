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
        puzzles: ["Puslespillbelønninger", "Nye brikker, delvise bilder og ferdige etappebilder."],
        basic: ["Grunnleggende resultater", "Resultater som fortsetter uten en etappefeiring."],
        results: ["Etapperesultat → feiring", "Perfekt resultat der «Fullført» fører videre til den valgte etappefeiringen."],
        celebrations: ["Direkte etappefeiringer", "Åpne hver feiring uten å spille en quiz."],
        replays: ["Spill feiringer igjen", "Test retur og fokus fra både forsiden og Nivåer."],
        questions: ["Én oppgave igjen", "Svar riktig én gang: brikke → resultat → etappefeiring."],
        edge: ["Uvanlig rekkefølge", "Test fremgang som mestres i en annen rekkefølge enn læreplanen."],
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
        puzzles: ["Puzzle rewards", "New pieces, partial pictures, and completed stage pictures."],
        basic: ["Basic results", "Results that continue without a stage celebration."],
        results: ["Stage result → celebration", "Perfect results where “Completed” continues to the selected stage celebration."],
        celebrations: ["Direct stage celebrations", "Open every celebration without playing a quiz."],
        replays: ["Replay celebrations", "Test return behavior and focus from both Home and Levels."],
        questions: ["One question remaining", "Answer correctly once: piece → result → stage celebration."],
        edge: ["Out-of-order progress", "Test progress mastered in a different order from the curriculum."],
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
      { id: "puzzles", items: [
        { title: { nb: "Første brikke", en: "First piece" }, description: { nb: "Første mestring → brikke → resultat. Telleren øker når brikken lander. Test også tidlig Fortsett og redusert bevegelse.", en: "First mastery → piece → result. The count increases as the piece lands. Also test early Continue and reduced motion." }, params: { preview: "puzzle-first" } },
        { title: { nb: "Bildet tar form", en: "Picture in progress" }, description: { nb: "Ny brikke i Navigatør-bildet.", en: "A new piece in the Navigator picture." }, params: { preview: "puzzle-partial", stage: "navigator" } },
        { title: { nb: "Brikke → nivå mestret", en: "Piece → level mastered" }, description: { nb: "Fjerde quiz gir en brikke, så et resultat med nivåtrofé. Ingen etappefeiring.", en: "The fourth quiz earns a piece, then a result with a level trophy. No stage celebration." }, params: { preview: "puzzle-level" } },
        ...stageList.map((stage) => ({
          title: { nb: `Siste brikke · ${stage.title.nb}`, en: `Final piece · ${stage.title.en}` },
          description: { nb: "Brikke → ferdig bilde med konfetti → resultat → etappefeiring. Belønningsskjermene skal passe uten rulling.", en: "Piece → completed picture with confetti → result → stage celebration. Reward screens must fit without scrolling." },
          params: { preview: "puzzle-final", stage: stage.id },
        })),
        { title: { nb: "Ingen ny brikke ved gjenspilling", en: "No new piece on replay" }, description: { nb: "En mestret quiz går rett til resultatet. Se etappebildet og lukk det uten ny belønning.", en: "A mastered quiz goes straight to results. View and close its stage picture without another reward." }, params: { preview: "puzzle-replay" } },
        { title: { nb: "Bildet kan ikke lastes", en: "Artwork unavailable" }, description: { nb: "Simulert bildefeil. Antall brikker og Fortsett virker fortsatt.", en: "Simulated image failure. The piece count and Continue remain available." }, params: { preview: "puzzle-missing-image" } },
        { title: { nb: "Etappebilde · ingen brikker", en: "Stage picture · no pieces" }, description: { nb: "Ingen av bildet er avslørt. Lukk for å gå tilbake til Nivåer.", en: "No artwork is revealed. Close to return to Levels." }, params: { preview: "puzzle-view-empty" } },
        { title: { nb: "Etappebilde · delvis ferdig", en: "Stage picture · partly complete" }, description: { nb: "Test zoom, rulling og retur til riktig etappe i Nivåer.", en: "Test zoom, scrolling, and return to the correct stage in Levels." }, params: { preview: "puzzle-view-partial", stage: "navigator" } },
        { title: { nb: "Etappebilde · ferdig", en: "Stage picture · complete" }, description: { nb: "Bare denne etappen er mestret. Ett bilde, uten bildesamling.", en: "Only this stage is mastered. One picture, without a gallery." }, params: { preview: "puzzle-view-complete" } },
      ] },
      {
        id: "basic",
        items: [
          { title: { nb: "Neste quiz", en: "Next quiz" }, description: { nb: "Perfekt resultat som fortsetter i samme nivå.", en: "Perfect result continuing within the same level." }, params: { preview: "result-next-quiz" } },
          { title: { nb: "Neste nivå · lengste navn", en: "Next level · longest name" }, description: { nb: "Perfekt resultat som går videre til nivået med det lengste norske navnet.", en: "Perfect result advancing to the level with the longest English name." }, params: { preview: "result-next-level" } },
          { title: { nb: "Ikke mestret → neste nivå", en: "Not mastered → next level" }, description: { nb: "Prøv igjen er primær. Neste-knappen har nivåmerke og navn på første rad, og Neste med quiztype på andre rad.", en: "Try again is primary. One taller Next button groups the badge and level name above the Next action and quiz mode." }, params: { preview: "result-failed-next" } },
          { title: { nb: "Ikke mestret → ingen neste", en: "Not mastered → no Next" }, description: { nb: "Bare denne quizen er ikke mestret, så Neste skjules og Velg nivå blir sekundær.", en: "Only this quiz remains unmastered, so Next is hidden and Choose a level becomes secondary." }, params: { preview: "result-failed-no-next" } },
          {title: {nb: "Ikke mestret → neste quiz", en: "Not mastered → next quiz"}, description: {nb: "Prøv igjen er primær; neste quiz i samme nivå er sekundær.", en: "Try again is primary; the immediate same-level quiz is secondary."}, params: {preview: "result-failed-next-quiz"}},
          {title: {nb: "Hopp i samme nivå", en: "Skip within the level"}, description: {nb: "Perfekt resultat; en mestret quiz hoppes over. Neste-knappen viser quiztypen uten å gjenta nivået.", en: "Perfect result skips a mastered quiz. Next shows the mode without repeating the level."}, params: {preview: "result-skip-quiz"}},
          {title: {nb: "Ikke mestret → hopp i samme nivå", en: "Not mastered → skip within the level"}, description: {nb: "Prøv igjen er primær; neste umestrede quiz i samme nivå er sekundær.", en: "Try again is primary; the next unmastered quiz in the same level is secondary."}, params: {preview: "result-failed-skip-quiz"}},
          {title: {nb: "Hopp til et annet nivå", en: "Skip to another level"}, description: {nb: "Perfekt resultat hopper til en quiz midt i neste nivå. Én høyere knapp viser nivåmerke og navn på første rad, og Neste med quiztype på andre rad.", en: "Perfect result skips to a quiz partway through the next level. One taller button contains the badge and level name, followed by Next and the quiz mode."}, params: {preview: "result-skip-level"}},
          {title: {nb: "Ikke mestret → hopp til et annet nivå", en: "Not mastered → skip to another level"}, description: {nb: "Prøv igjen er primær; neste umestrede quiz i et annet nivå er sekundær.", en: "Try again is primary; the next unmastered quiz in another level is secondary."}, params: {preview: "result-failed-skip-level"}},
          {title: {nb: "Tilbake til et tidligere nivå", en: "Wrap to an earlier level"}, description: {nb: "Perfekt resultat i siste quiz; Neste går til et tidligere umestret nivå.", en: "Perfect result in the final quiz; Next wraps to an earlier unmastered level."}, params: {preview: "result-wrap"}},
          {title: {nb: "Ikke mestret → tidligere nivå", en: "Not mastered → wrap"}, description: {nb: "Ufullkomment resultat i siste quiz; Neste går tilbake til et tidligere nivå.", en: "Imperfect result in the final quiz; Next wraps to an earlier level."}, params: {preview: "result-failed-wrap"}},
          {title: {nb: "Ny rekord uten mestring", en: "New record without mastery"}, description: {nb: "Bedre resultat enn før, men ett feil svar.", en: "Improved best score, with one wrong answer remaining."}, params: {preview: "result-new-record"}},
          {title: {nb: "Lavere enn rekorden", en: "Below the best score"}, description: {nb: "Viser tidligere rekord sammen med et lavere resultat.", en: "Shows the previous best alongside a lower current result."}, params: {preview: "result-below-best"}},
          {title: {nb: "Spill en mestret quiz igjen", en: "Replay a mastered quiz"}, description: {nb: "Perfekt resultat i en allerede mestret quiz, uten ny mestringsfeiring.", en: "Perfect replay of a mastered quiz without a newly earned mastery celebration."}, params: {preview: "result-replay-mastered"}},
          {title: {nb: "Alle quizer mestret", en: "All quizzes mastered"}, description: {nb: "Perfekt gjenspilling etter at alt er mestret; gratulasjonsknapp uten Neste.", en: "Perfect replay after mastering everything; congratulations action without Next."}, params: {preview: "result-all-mastered"}},
          {title: {nb: "Alt mestret → ufullkomment resultat", en: "All mastered → imperfect replay"}, description: {nb: "Tidligere mestring beholdes. Prøv igjen vises, men ikke Neste.", en: "Previously earned mastery remains. Try again appears without Next."}, params: {preview: "result-failed-all-mastered"}},
          { title: { nb: "Deling uten delingsmeny", en: "Sharing without Share menu" }, description: { nb: "Resultat med e-post- og kopieringsdialogen som brukes i Firefox.", en: "Result with the email-and-copy dialog used in Firefox." }, params: { preview: "share-fallback" } },
        ],
      },
      { id: "results", items: stageItems("milestone-result") },
      { id: "celebrations", items: stageItems("milestone-celebration") },
      {
        id: "replays",
        items: stageList.flatMap((stage) => [
          { title: { nb: `${stage.icon} ${stage.title.nb} · Forsiden`, en: `${stage.icon} ${stage.title.en} · Home` }, description: { nb: "Åpne bildet fra feiringen; lukk bildet og feiringen og kontroller returfokus på forsiden.", en: "Open the picture from the celebration; close both and check return focus on Home." }, params: { preview: "milestone-replay", stage: stage.id } },
          { title: { nb: `${stage.icon} ${stage.title.nb} · Nivåer`, en: `${stage.icon} ${stage.title.en} · Levels` }, description: { nb: "Åpne bildet fra feiringen; lukk bildet og feiringen og kontroller returfokus i Nivåer.", en: "Open the picture from the celebration; close both and check return focus in Levels." }, params: { preview: "milestone-replay", stage: stage.id, source: "levels" } },
        ]),
      },
      { id: "questions", items: stageItems("milestone-question") },
      {
        id: "edge",
        items: [
          { title: { nb: "Siste hull i et nivå", en: "Final gap in a level" }, description: { nb: "Quiz 1, 2 og 4 er mestret; quiz 3 fullfører nivået.", en: "Quizzes 1, 2, and 4 are mastered; quiz 3 completes the level." }, params: { preview: "level-final-gap-question" }, oneQuestion: true },
          { title: { nb: "Turist er siste hull", en: "Tourist is the final gap" }, description: { nb: "Turist-feiring etterfølges av Verden mestret.", en: "Tourist celebration followed by World mastered." }, params: { preview: "tourist-world-final-question" }, oneQuestion: true },
          { title: { nb: "Navigatør før Turist", en: "Navigator before Tourist" }, description: { nb: "Navigatør mestres, deretter fortsetter spillet fremover; det tidligere hullet i Turist gjenstår.", en: "Navigator is mastered, then continuation moves forward; the earlier Tourist gap remains." }, params: { preview: "navigator-tourist-gap-question" }, oneQuestion: true },
        ],
      },
      {
        id: "world",
        items: [
          { title: { nb: "Siste oppgave", en: "Final question" }, description: { nb: "Den vanlige finaleflyten med ett svar igjen.", en: "The ordinary finale with one answer remaining." }, params: { preview: "final-question" }, oneQuestion: true },
          { title: { nb: "Siste brikke → hele verden mestret", en: "Final piece → whole world mastered" }, description: { nb: "Ferdig bilde → resultat → Verdensmester-etappen → Verden mestret, uten å svare på en oppgave.", en: "Completed picture → result → World Master stage → World mastered, without answering a question." }, params: { preview: "puzzle-world" } },
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
