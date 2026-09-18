/* Fixed, unanswered English composition. Reuses published geometry and the
   game's Nearby calculation; no app state, storage or random attempts. */
(async () => {
  "use strict";
  const target = "it";
  const choices = ["pt", "es", "it", "at"];
  const quiz = GEOGRAFI_CURRICULUM.quizById.get("pack-iberia-alps:map-country");
  const realChoices = GEOGRAFI_CURRICULUM.fixedAlternativeCodes(quiz)[target];
  if (choices.slice().sort().join() !== realChoices.slice().sort().join()) {
    throw new Error("Social preview alternatives no longer match the real quiz.");
  }
  const places = GEOGRAFI_QUIZ_DATA.places ?? GEOGRAFI_QUIZ_DATA.countries;
  const answers = document.querySelector(".social-answers");
  for (const code of choices) {
    const card = document.createElement("div");
    card.className = "answer-card";
    const content = document.createElement("span");
    content.className = "map-answer-content";
    const frame = document.createElement("span");
    frame.className = "flag-frame map-answer-flag";
    const flag = document.createElement("img");
    flag.className = "flag";
    flag.src = `../../flags/${code}.svg`;
    flag.alt = "";
    const label = document.createElement("strong");
    label.textContent = places.find((place) => place.code === code).name.en;
    frame.append(flag);
    content.append(frame, label);
    card.append(content);
    answers.append(card);
  }

  const map = document.querySelector(".question-map");
  const view = GEOGRAFI_QUIZ_MAP_DATA.quizRegions.europe;
  const namespace = "http://www.w3.org/2000/svg";
  function element(tag, attributes) {
    const node = document.createElementNS(namespace, tag);
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    map.append(node);
    return node;
  }
  function paths(features, className) {
    for (const feature of features) {
      element("path", { class: className, d: feature.path,
        "data-map-country-code": feature.code ?? "", "vector-effect": "non-scaling-stroke" });
      if (feature.cropPath) element("path", { class: `${className} is-crop-edge`,
        d: feature.cropPath, "vector-effect": "non-scaling-stroke" });
    }
  }
  element("rect", { class: "question-map-ocean", x: -10000, y: -10000, width: 20000, height: 20000 });
  const surrounding = [...view.backgroundFeatures, ...view.features.filter((item) => item.code !== target)];
  const highlighted = view.features.filter((item) => item.code === target);
  paths(surrounding, "question-map-country");
  paths(highlighted, "question-map-country is-target");
  paths(highlighted, "question-map-target-halo");
  paths(surrounding, "question-map-country-border");
  paths(highlighted, "question-map-country-border is-target");

  const boxes = [...map.querySelectorAll(".question-map-country.is-target:not(.is-crop-edge)")].map((path) => path.getBBox());
  const x = Math.min(...boxes.map((box) => box.x));
  const y = Math.min(...boxes.map((box) => box.y));
  const bounds = { x, y,
    width: Math.max(...boxes.map((box) => box.x + box.width)) - x,
    height: Math.max(...boxes.map((box) => box.y + box.height)) - y };
  const api = GEOGRAFI_MAP_VIEW;
  const rectangle = map.getBoundingClientRect();
  const fitted = api.fitViewBoxToAspect(api.parseViewBox(view.viewBox), rectangle.width / rectangle.height);
  const nearby = api.nearbyViewBox(fitted, bounds, api.parseViewBox(view.bleedViewBox));
  map.setAttribute("viewBox", api.serializeViewBox(nearby));
  const unitsPerPixel = nearby.width / rectangle.width;
  for (const marker of view.markers) {
    const readable = Number.isFinite(marker.readableSize) && marker.readableSize / unitsPerPixel >= 5;
    if (Number.isFinite(marker.readableSize)) {
      for (const path of map.querySelectorAll(`[data-map-country-code="${marker.code}"]`)) {
        path.classList.toggle("is-locator-hidden", !readable);
      }
    }
    element("circle", { class: `question-map-marker${readable ? " is-geometry-readable" : ""}`,
      cx: marker.x, cy: marker.y, r: 3 * unitsPerPixel, "vector-effect": "non-scaling-stroke" });
  }
  await document.fonts.ready;
  await Promise.all([...document.images].map((image) => image.decode()));
  // Force final layout; headless virtual time may not advance animation frames.
  document.querySelector(".social-preview").getBoundingClientRect();
  document.documentElement.dataset.captureReady = "true";
})().catch((error) => { document.title = `Capture failed: ${error.message}`; console.error(error); });
