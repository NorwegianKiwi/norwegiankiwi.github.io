(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root?.document) api.mount(root.document, root.GEOGRAFI_CURRICULUM, root.GEOGRAFI_PUZZLES);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const copy = {
    nb: { title: "Rekkefølge på puslespillbrikker", intro: "Velg et bilde og start avspillingen: én brikke hvert 0,2 sekund, i quizrekkefølge. Lagret fremgang påvirkes ikke.", start: "Start", pause: "Pause", next: "Neste brikke", restart: "Start på nytt", count: "Antall brikker", loading: "Laster bildet …", error: "Bildet kunne ikke lastes. Velg bildet på nytt for å prøve igjen." },
    en: { title: "Puzzle reveal order", intro: "Choose a picture and start playback: one piece every 0.2 seconds, in quiz order. Saved progress is unaffected.", start: "Start", pause: "Pause", next: "Next piece", restart: "Restart", count: "Piece count", loading: "Loading artwork …", error: "Artwork could not load. Select the picture again to retry." },
  };

  function revealOrder(stageId, curriculum, puzzles) {
    const stage = curriculum.stages.find((candidate) => candidate.id === stageId);
    return curriculum.levels.slice(stage.startLevel - 1, stage.endLevel)
      .flatMap((level) => level.quizzes.map((quiz) => puzzles.pieceForQuiz(quiz.id).piece));
  }

  function createPlayback(onChange, schedule = setInterval, cancel = clearInterval) {
    let timer = null;
    let count = 0;
    let total = 0;
    let ready = false;
    const state = () => ({ count, total, ready, playing: timer !== null });
    const emit = () => onChange(state());
    function stop() {
      if (timer !== null) cancel(timer);
      timer = null;
    }
    return {
      state,
      reset(size) { stop(); count = 0; total = size; ready = false; emit(); },
      loaded() { ready = true; emit(); },
      pause() { stop(); emit(); },
      seek(value) {
        stop();
        if (ready && Number.isFinite(value)) count = Math.max(0, Math.min(total, Math.trunc(value)));
        emit();
      },
      next() { this.seek(count + 1); },
      toggle() {
        if (timer !== null) { this.pause(); return; }
        if (!ready || count >= total) return;
        timer = schedule(() => {
          count += 1;
          if (count >= total) stop();
          emit();
        }, 200);
        emit();
      },
    };
  }

  function mount(document, curriculum, puzzles) {
    const host = document.querySelector("[data-puzzle-preview]");
    if (!host) return;
    const view = document.defaultView;
    let locale = document.documentElement.lang === "en" ? "en" : "nb";
    let stage = puzzles.stages[0];
    let order = revealOrder(stage.id, curriculum, puzzles);
    let loadVersion = 0;
    let failed = false;
    let elements = null;
    const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

    const playback = createPlayback(update);
    function update(state) {
      if (!elements) return;
      const text = copy[locale];
      const name = curriculum.stages.find((candidate) => candidate.id === stage.id).title[locale];
      elements.play.textContent = state.playing ? text.pause : text.start;
      elements.play.disabled = !state.ready || state.count === state.total;
      elements.next.disabled = !state.ready || state.count === state.total;
      elements.restart.disabled = !state.ready;
      elements.slider.disabled = !state.ready;
      elements.slider.max = state.total;
      elements.slider.value = state.count;
      elements.counter.textContent = `${state.count}/${state.total}`;
      elements.svg.setAttribute("aria-label", `${name}: ${state.count}/${state.total}`);
      elements.clip.innerHTML = order.slice(0, state.count).map((piece) => `<path d="${piece.path}"/>`).join("");
      elements.seams.hidden = state.count === state.total;
      elements.seams.style.display = state.count === state.total ? "none" : "";
      elements.status.textContent = failed ? text.error : state.ready ? "" : text.loading;
    }

    function draw() {
      const text = copy[locale];
      host.innerHTML = `<h2>${text.title}</h2><p>${text.intro}</p>
        <div class="puzzle-preview-choices">${puzzles.stages.map((picture) => {
          const source = curriculum.stages.find((candidate) => candidate.id === picture.id);
          return `<button type="button" data-picture="${picture.id}" aria-pressed="${picture.id === stage.id}"><img src="${picture.image}" alt="" loading="lazy"><span>${source.icon} ${escape(source.title[locale])}</span></button>`;
        }).join("")}</div>
        <div class="puzzle-preview-viewer">
          <svg viewBox="0 0 ${puzzles.width} ${puzzles.height}" role="img">
            <defs><clipPath id="test-puzzle-clip"></clipPath></defs>
            <rect width="1536" height="1024" fill="#e6dfcf"/>
            <image href="${stage.image}" width="1536" height="1024" clip-path="url(#test-puzzle-clip)"/>
            <g data-seams fill="none" stroke="#948776" stroke-width="2">${stage.pieces.map((piece) => `<path d="${piece.path}"/>`).join("")}</g>
          </svg>
          <div class="puzzle-preview-controls">
            <button type="button" data-play>${text.start}</button>
            <button type="button" data-next>${text.next}</button>
            <button type="button" data-restart>${text.restart}</button>
            <label for="test-puzzle-count">${text.count} <output data-count for="test-puzzle-count" aria-live="off"></output></label>
            <input id="test-puzzle-count" type="range" min="0" step="1" value="0">
            <p data-status role="status"></p>
          </div>
        </div>`;
      elements = { play: host.querySelector("[data-play]"), next: host.querySelector("[data-next]"), restart: host.querySelector("[data-restart]"), slider: host.querySelector("input"), counter: host.querySelector("[data-count]"), svg: host.querySelector("svg"), clip: host.querySelector("clipPath"), seams: host.querySelector("[data-seams]"), status: host.querySelector("[data-status]") };
      elements.play.addEventListener("click", () => playback.toggle());
      elements.next.addEventListener("click", () => playback.next());
      elements.restart.addEventListener("click", () => playback.seek(0));
      elements.slider.addEventListener("input", () => playback.seek(Number(elements.slider.value)));
      host.querySelectorAll("[data-picture]").forEach((button) => button.addEventListener("click", () => select(button.dataset.picture)));
      update(playback.state());
    }

    function select(stageId, focus = true) {
      playback.pause();
      elements = null;
      stage = puzzles.stages.find((candidate) => candidate.id === stageId);
      order = revealOrder(stage.id, curriculum, puzzles);
      failed = false;
      playback.reset(order.length);
      draw();
      if (focus) host.querySelector(`[data-picture="${stage.id}"]`).focus();
      const version = ++loadVersion;
      const image = new view.Image();
      image.onload = () => { if (version === loadVersion) playback.loaded(); };
      image.onerror = () => { if (version === loadVersion) { failed = true; update(playback.state()); } };
      image.src = stage.image;
    }
    document.querySelectorAll("[data-test-language]").forEach((button) => button.addEventListener("click", () => {
      playback.pause();
      locale = button.dataset.testLanguage;
      draw();
    }));
    view.addEventListener("pagehide", () => playback.pause());
    document.addEventListener("visibilitychange", () => { if (document.hidden) playback.pause(); });
    select(stage.id, false);
  }

  return { copy, revealOrder, createPlayback, mount };
});
