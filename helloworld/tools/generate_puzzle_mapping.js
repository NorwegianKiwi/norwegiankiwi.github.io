"use strict";

// Prints a candidate manifest. Review the reveal sequences before checking it in.
global.window = global;
require("../countries.js");
const curriculum = require("../curriculum.js");
const puzzles = require("../puzzles.js");

function buildManifest() {
  return puzzles.stages.map((stage) => {
    let seed = 2166136261;
    for (const char of `puzzle-spread-v2|${stage.id}`) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
    function shuffle(items) {
      const result = [...items];
      for (let i = result.length - 1; i > 0; i -= 1) {
        seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
        const j = Math.floor((seed >>> 0) / 4294967296 * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }
    const quadrants = [[], [], [], []];
    for (const piece of stage.pieces) {
      const quadrant = Number(piece.x + piece.width / 2 >= puzzles.width / 2)
        + 2 * Number(piece.y + piece.height / 2 >= puzzles.height / 2);
      quadrants[quadrant].push(piece.id);
    }
    const remaining = quadrants.map(shuffle);
    const order = [];
    while (remaining.some((items) => items.length)) {
      order.push(...shuffle(remaining.flatMap((items) => items.splice(0, 2))));
    }
    const source = curriculum.stages.find((candidate) => candidate.id === stage.id);
    const quizzes = curriculum.levels.slice(source.startLevel - 1, source.endLevel).flatMap((level) => level.quizzes);
    const quizIds = [];
    order.forEach((pieceId, index) => { quizIds[pieceId] = quizzes[index].id; });
    return { id: stage.id, rows: [...stage.rows], quizIds };
  });
}

if (require.main === module) console.log(JSON.stringify(buildManifest(), null, 2));
module.exports = { buildManifest };
