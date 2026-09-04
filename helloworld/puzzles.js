(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_PUZZLES = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  // Fixed artwork coordinates and row layouts. Never reshuffle existing quiz IDs.
  const width = 1536;
  const height = 1024;
  const manifest = [
  {
    "id": "tourist",
    "rows": [
      4,
      4,
      4,
      4
    ],
    "quizIds": [
      "tour-hello-world:country-flag",
      "pack-nordics:country-capital",
      "tour-world-icons:map-country",
      "pack-nordics:flag-country",
      "tour-world-icons:country-flag",
      "tour-hello-world:country-capital",
      "pack-western-europe:map-country",
      "tour-hello-world:flag-country",
      "pack-western-europe:country-flag",
      "tour-world-icons:country-capital",
      "pack-nordics:map-country",
      "tour-world-icons:flag-country",
      "pack-nordics:country-flag",
      "pack-western-europe:country-capital",
      "tour-hello-world:map-country",
      "pack-western-europe:flag-country"
    ]
  },
  {
    "id": "explorer",
    "rows": [
      8,
      8,
      8,
      8,
      8
    ],
    "quizIds": [
      "pack-baltic-neighbours:country-flag",
      "pack-northern-south-america:flag-country",
      "pack-north-america:map-country",
      "pack-eastern-europe:country-capital",
      "pack-balkans:country-flag",
      "pack-iberia-alps:flag-country",
      "pack-southern-south-america:map-country",
      "pack-central-america:country-capital",
      "pack-north-america:country-flag",
      "pack-eastern-europe:flag-country",
      "pack-central-europe:map-country",
      "pack-baltic-neighbours:country-capital",
      "pack-southern-south-america:country-flag",
      "pack-central-america:flag-country",
      "pack-european-microstates:map-country",
      "pack-balkans:country-capital",
      "pack-central-europe:country-flag",
      "pack-baltic-neighbours:flag-country",
      "pack-northern-south-america:map-country",
      "pack-north-america:country-capital",
      "pack-european-microstates:country-flag",
      "pack-balkans:flag-country",
      "pack-iberia-alps:map-country",
      "pack-southern-south-america:country-capital",
      "pack-northern-south-america:country-flag",
      "pack-north-america:flag-country",
      "pack-eastern-europe:map-country",
      "pack-central-europe:country-capital",
      "pack-iberia-alps:country-flag",
      "pack-southern-south-america:flag-country",
      "pack-central-america:map-country",
      "pack-european-microstates:country-capital",
      "pack-eastern-europe:country-flag",
      "pack-central-europe:flag-country",
      "pack-baltic-neighbours:map-country",
      "pack-northern-south-america:country-capital",
      "pack-central-america:country-flag",
      "pack-european-microstates:flag-country",
      "pack-balkans:map-country",
      "pack-iberia-alps:country-capital"
    ]
  },
  {
    "id": "navigator",
    "rows": [
      9,
      8,
      9,
      9,
      8,
      9
    ],
    "quizIds": [
      "pack-north-africa:country-flag",
      "pack-great-lakes-congo:country-capital",
      "pack-maritime-southeast-asia:map-country",
      "pack-south-asia:flag-country",
      "tour-island-world:country-flag",
      "pack-sahel:country-capital",
      "pack-southeast-africa-islands:map-country",
      "pack-great-lakes-congo:flag-country",
      "pack-maritime-southeast-asia:country-flag",
      "pack-east-asia:country-capital",
      "pack-gulf-guinea:map-country",
      "pack-sahel:flag-country",
      "pack-southeast-africa-islands:country-flag",
      "pack-horn-nile:country-capital",
      "pack-mainland-southeast-asia:map-country",
      "pack-east-asia:flag-country",
      "pack-gulf-guinea:country-flag",
      "pack-north-africa:country-capital",
      "pack-southern-africa:map-country",
      "pack-horn-nile:flag-country",
      "pack-mainland-southeast-asia:country-flag",
      "tour-island-world:country-capital",
      "pack-atlantic-west-africa:map-country",
      "pack-north-africa:flag-country",
      "pack-southern-africa:country-flag",
      "pack-maritime-southeast-asia:country-capital",
      "pack-south-asia:map-country",
      "tour-island-world:flag-country",
      "pack-atlantic-west-africa:country-flag",
      "pack-southeast-africa-islands:country-capital",
      "pack-great-lakes-congo:map-country",
      "pack-maritime-southeast-asia:flag-country",
      "pack-south-asia:country-flag",
      "pack-gulf-guinea:country-capital",
      "pack-sahel:map-country",
      "pack-southeast-africa-islands:flag-country",
      "pack-great-lakes-congo:country-flag",
      "pack-mainland-southeast-asia:country-capital",
      "pack-east-asia:map-country",
      "pack-gulf-guinea:flag-country",
      "pack-sahel:country-flag",
      "pack-southern-africa:country-capital",
      "pack-horn-nile:map-country",
      "pack-mainland-southeast-asia:flag-country",
      "pack-east-asia:country-flag",
      "pack-atlantic-west-africa:country-capital",
      "pack-north-africa:map-country",
      "pack-southern-africa:flag-country",
      "pack-horn-nile:country-flag",
      "pack-south-asia:country-capital",
      "tour-island-world:map-country",
      "pack-atlantic-west-africa:flag-country"
    ]
  },
  {
    "id": "globetrotter",
    "rows": [
      8,
      8,
      8,
      8,
      8,
      8,
      8
    ],
    "quizIds": [
      "tour-around-equator:country-flag",
      "pack-arabian-gulf:flag-country",
      "pack-central-asia:map-country",
      "pack-greater-caribbean:country-capital",
      "pack-pacific-islands:country-flag",
      "pack-caribbean-territories:flag-country",
      "pack-world-special-regions:map-country",
      "pack-eastern-mediterranean:country-capital",
      "pack-central-asia:country-flag",
      "pack-greater-caribbean:flag-country",
      "pack-australia-western-pacific:map-country",
      "pack-north-atlantic-autonomies:country-capital",
      "pack-world-special-regions:country-flag",
      "pack-eastern-mediterranean:flag-country",
      "pack-caucasus-mesopotamia:map-country",
      "tour-world-favourites:country-capital",
      "pack-australia-western-pacific:country-flag",
      "pack-north-atlantic-autonomies:flag-country",
      "pack-pacific-associated-territories:map-country",
      "tour-around-equator:country-capital",
      "pack-caucasus-mesopotamia:country-flag",
      "tour-world-favourites:flag-country",
      "pack-lesser-antilles:map-country",
      "pack-pacific-islands:country-capital",
      "pack-pacific-associated-territories:country-flag",
      "tour-around-equator:flag-country",
      "pack-arabian-gulf:map-country",
      "pack-central-asia:country-capital",
      "pack-lesser-antilles:country-flag",
      "pack-pacific-islands:flag-country",
      "pack-caribbean-territories:map-country",
      "pack-world-special-regions:country-capital",
      "pack-arabian-gulf:country-flag",
      "pack-central-asia:flag-country",
      "pack-greater-caribbean:map-country",
      "pack-australia-western-pacific:country-capital",
      "pack-caribbean-territories:country-flag",
      "pack-world-special-regions:flag-country",
      "pack-eastern-mediterranean:map-country",
      "pack-caucasus-mesopotamia:country-capital",
      "pack-greater-caribbean:country-flag",
      "pack-australia-western-pacific:flag-country",
      "pack-north-atlantic-autonomies:map-country",
      "pack-pacific-associated-territories:country-capital",
      "pack-eastern-mediterranean:country-flag",
      "pack-caucasus-mesopotamia:flag-country",
      "tour-world-favourites:map-country",
      "pack-lesser-antilles:country-capital",
      "pack-north-atlantic-autonomies:country-flag",
      "pack-pacific-associated-territories:flag-country",
      "tour-around-equator:map-country",
      "pack-arabian-gulf:country-capital",
      "tour-world-favourites:country-flag",
      "pack-lesser-antilles:flag-country",
      "pack-pacific-islands:map-country",
      "pack-caribbean-territories:country-capital"
    ]
  },
  {
    "id": "regional-expert",
    "rows": [
      7,
      8,
      7,
      7,
      8,
      7
    ],
    "quizIds": [
      "mastery-north-central-america:country-flag",
      "mastery-south-america:country-capital",
      "mastery-oceania:map-country",
      "mastery-asia-west:flag-country",
      "mastery-asia-east:country-flag",
      "mastery-europe-central-south-east:country-capital",
      "mastery-other-places-world:map-country",
      "mastery-south-america:flag-country",
      "mastery-oceania:country-flag",
      "mastery-europe-north-west:country-capital",
      "mastery-africa-north-west:map-country",
      "mastery-europe-central-south-east:flag-country",
      "mastery-other-places-world:country-flag",
      "mastery-north-central-america:country-capital",
      "mastery-caribbean:map-country",
      "mastery-europe-north-west:flag-country",
      "mastery-africa-north-west:country-flag",
      "mastery-asia-east:country-capital",
      "mastery-africa-central-east-south:map-country",
      "mastery-north-central-america:flag-country",
      "mastery-caribbean:country-flag",
      "mastery-oceania:country-capital",
      "mastery-asia-west:map-country",
      "mastery-asia-east:flag-country",
      "mastery-africa-central-east-south:country-flag",
      "mastery-other-places-world:country-capital",
      "mastery-south-america:map-country",
      "mastery-oceania:flag-country",
      "mastery-asia-west:country-flag",
      "mastery-africa-north-west:country-capital",
      "mastery-europe-central-south-east:map-country",
      "mastery-other-places-world:flag-country",
      "mastery-south-america:country-flag",
      "mastery-caribbean:country-capital",
      "mastery-europe-north-west:map-country",
      "mastery-africa-north-west:flag-country",
      "mastery-europe-central-south-east:country-flag",
      "mastery-africa-central-east-south:country-capital",
      "mastery-north-central-america:map-country",
      "mastery-caribbean:flag-country",
      "mastery-europe-north-west:country-flag",
      "mastery-asia-west:country-capital",
      "mastery-asia-east:map-country",
      "mastery-africa-central-east-south:flag-country"
    ]
  },
  {
    "id": "world-master",
    "rows": [
      6,
      6,
      6,
      6
    ],
    "quizIds": [
      "mastery-americas:country-flag",
      "mastery-africa:country-capital",
      "mastery-whole-world:map-country",
      "mastery-africa:flag-country",
      "mastery-whole-world:country-flag",
      "mastery-europe:country-capital",
      "mastery-countries-world:map-country",
      "mastery-europe:flag-country",
      "mastery-countries-world:country-flag",
      "mastery-americas:country-capital",
      "mastery-asia-oceania:map-country",
      "mastery-americas:flag-country",
      "mastery-asia-oceania:country-flag",
      "mastery-whole-world:country-capital",
      "mastery-africa:map-country",
      "mastery-whole-world:flag-country",
      "mastery-africa:country-flag",
      "mastery-countries-world:country-capital",
      "mastery-europe:map-country",
      "mastery-countries-world:flag-country",
      "mastery-europe:country-flag",
      "mastery-asia-oceania:country-capital",
      "mastery-americas:map-country",
      "mastery-asia-oceania:flag-country"
    ]
  }
];

  // Every internal edge is constructed in one canonical direction, then reversed
  // for its neighbour. This gives exact shared boundaries without gaps/overlaps.
  function edge(x1, y1, x2, y2, tab, reverse = false) {
    const dx = x2 - x1, dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    const point = (along, normal) => [x1 + dx * along - dy / length * normal, y1 + dy * along + dx / length * normal];
    const depth = tab ? Math.min(length * 0.16, 24) * tab : 0;
    const segments = depth ? [
      [point(0, 0), point(.36, 0)],
      [point(.36, 0), point(.46, 0), point(.28, depth), point(.5, depth)],
      [point(.5, depth), point(.72, depth), point(.54, 0), point(.64, 0)],
      [point(.64, 0), point(1, 0)],
    ] : [[point(0, 0), point(1, 0)]];
    if (reverse) segments.reverse().forEach((segment) => segment.reverse());
    return segments.map((s) => s.length === 2 ? `L ${s[1].join(" ")}` : `C ${s.slice(1).map((p) => p.join(" ")).join(" ")}`).join(" ");
  }

  function layout(rows) {
    const pieces = [];
    const rowHeight = height / rows.length;
    rows.forEach((columns, row) => {
      for (let column = 0; column < columns; column += 1) {
        const x = column * width / columns, y = row * rowHeight;
        const right = (column + 1) * width / columns, bottom = (row + 1) * rowHeight;
        const topTab = row > 0 && rows[row - 1] === columns ? (column % 2 ? 1 : -1) : 0;
        const bottomTab = row < rows.length - 1 && rows[row + 1] === columns ? (column % 2 ? 1 : -1) : 0;
        const path = `M ${x} ${y} ${edge(x, y, right, y, topTab)} ${edge(right, y, right, bottom, column < columns - 1 ? (row % 2 ? 1 : -1) : 0)} ${edge(x, bottom, right, bottom, bottomTab, true)} ${edge(x, y, x, bottom, column > 0 ? (row % 2 ? 1 : -1) : 0, true)} Z`;
        pieces.push(Object.freeze({ id: pieces.length, path, x, y, width: right - x, height: rowHeight, bounds: [Math.max(0, x - 24), Math.max(0, y - 24), Math.min(width, right + 24) - Math.max(0, x - 24), Math.min(height, bottom + 24) - Math.max(0, y - 24)] }));
      }
    });
    return Object.freeze(pieces);
  }

  const stages = Object.freeze(manifest.map((entry) => Object.freeze({
    ...entry,
    rows: Object.freeze(entry.rows),
    quizIds: Object.freeze(entry.quizIds),
    image: `./images/puzzles/${entry.id}.png`,
    pieces: layout(entry.rows),
  })));

  function stageProgress(profile, stageId, curriculum, progress) {
    const stage = stages.find((candidate) => candidate.id === stageId);
    if (!stage) return null;
    const earned = stage.quizIds.map((id) => {
      const quiz = curriculum.quizById.get(id);
      return Boolean(quiz && progress.quizState(profile, quiz) === "mastered");
    });
    return { stage, earned, count: earned.filter(Boolean).length, total: earned.length, complete: earned.every(Boolean) };
  }

  function pieceForQuiz(quizId) {
    for (const stage of stages) {
      const index = stage.quizIds.indexOf(quizId);
      if (index !== -1) return { stageId: stage.id, piece: stage.pieces[index] };
    }
    return null;
  }

  return { width, height, stages, stageProgress, pieceForQuiz };
});
