"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
global.window = global;
require("../countries.js");
const curriculum = require("../curriculum.js");
const progress = require("../progress.js");
const puzzles = require("../puzzles.js");
const localization = require("../localization.js");

test("every curriculum quiz owns exactly one permanent piece in its own stage", () => {
  assert.deepEqual(puzzles.stages.map((s) => s.pieces.length), [16, 40, 52, 56, 44, 24]);
  const allIds = puzzles.stages.flatMap((s) => s.quizIds);
  assert.equal(new Set(allIds).size, 232);
  assert.deepEqual([...allIds].sort(), [...curriculum.quizById.keys()].sort());
  for (const stage of puzzles.stages) {
    const source = curriculum.stages.find((s) => s.id === stage.id);
    const expected = curriculum.levels.slice(source.startLevel - 1, source.endLevel).flatMap((l) => l.quizzes.map((q) => q.id));
    assert.deepEqual([...stage.quizIds].sort(), expected.sort());
    assert.equal(stage.pieces.length, stage.quizIds.length);
    for (const locale of ["nb", "en"]) assert.ok(localization.translate(locale, `puzzleDescription_${stage.id}`).length > 30);
  }
  assert.equal(puzzles.pieceForQuiz("tour-hello-world:country-flag").piece.id, 0);
  assert.equal(puzzles.pieceForQuiz("tour-hello-world:flag-country").piece.id, 7);
  assert.equal(puzzles.pieceForQuiz("unknown"), null);
});

test("rewards derive from revision-aware mastery, survive transfer, and stay profile-local", () => {
  let store = progress.createEmptyStore({ id: "puzzle-owner" });
  const value = (profile = progress.activeProfile(store), c = curriculum) => puzzles.stageProgress(profile, "tourist", c, progress);
  assert.equal(value().count, 0);
  const stage = puzzles.stages[0];
  const quiz = curriculum.quizById.get(stage.quizIds[9]);
  store = progress.recordResult(store, store.activeProfileId, quiz, quiz.countryCodes.length - 1);
  assert.equal(value().count, 0);
  store = progress.recordResult(store, store.activeProfileId, quiz, quiz.countryCodes.length);
  assert.equal(value().count, 1);
  assert.equal(value().earned[9], true);
  store = progress.recordResult(store, store.activeProfileId, quiz, 0);
  assert.equal(value().count, 1, "replay cannot add or take away a piece");
  const revised = { ...curriculum, quizById: new Map(curriculum.quizById) };
  revised.quizById.set(quiz.id, { ...quiz, revision: quiz.revision + 1 });
  assert.equal(value(progress.activeProfile(store), revised).count, 0);
  assert.equal(value(progress.activeProfile(progress.createEmptyStore({ id: "someone-else" }))).count, 0);
  const imported = progress.parseBackup(progress.createBackup(store))[0];
  assert.equal(value(imported).count, 1);
  assert.equal(value(progress.mergeProfiles(progress.activeProfile(store), imported)).count, 1);
  for (const id of stage.quizIds) {
    const q = curriculum.quizById.get(id);
    store = progress.recordResult(store, store.activeProfileId, q, q.countryCodes.length);
  }
  assert.equal(value().complete, true);
  assert.equal(value().count, 16);
  store = progress.clearProgress(store, store.activeProfileId);
  assert.equal(value().count, 0);
});

// Independently flatten SVG paths to polygons to check the actual curved regions,
// including where rows have different piece counts (not just their bounding boxes).
function polygon(path) {
  const tokens = path.match(/[MLCZ]|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi);
  const points = [];
  let i = 0, last;
  const point = () => [Number(tokens[i++]), Number(tokens[i++])];
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === "M" || command === "L") { last = point(); points.push(last); }
    else if (command === "C") {
      const a = last, b = point(), c = point(), d = point();
      for (let step = 1; step <= 24; step++) {
        const t = step / 24, u = 1 - t;
        points.push([0, 1].map((axis) => u ** 3 * a[axis] + 3 * u ** 2 * t * b[axis] + 3 * u * t ** 2 * c[axis] + t ** 3 * d[axis]));
      }
      last = d;
    }
  }
  return points;
}
function contains(points, x, y) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i], b = points[j];
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
test("curved pieces tile each image without holes or overlapping interiors", () => {
  for (const stage of puzzles.stages) {
    const polygons = stage.pieces.map((p) => polygon(p.path));
    for (const points of polygons) for (const [x, y] of points) {
      assert.ok(x >= -1e-8 && x <= puzzles.width + 1e-8);
      assert.ok(y >= -1e-8 && y <= puzzles.height + 1e-8);
    }
    for (let y = 3.73; y < puzzles.height; y += 13) for (let x = 4.17; x < puzzles.width; x += 13) {
      assert.equal(polygons.filter((p) => contains(p, x, y)).length, 1, `${stage.id} at ${x},${y}`);
    }
  }
});
