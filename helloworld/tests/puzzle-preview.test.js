"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createPlayback, revealOrder } = require("../puzzle-preview.js");
global.window = global;
require("../countries.js");
const curriculum = require("../curriculum.js");
const puzzles = require("../puzzles.js");

test("preview follows curriculum order through the production piece mapping", () => {
  for (const stage of curriculum.stages) {
    const quizzes = curriculum.levels.slice(stage.startLevel - 1, stage.endLevel).flatMap((level) => level.quizzes);
    const order = revealOrder(stage.id, curriculum, puzzles);
    assert.equal(new Set(order.map((piece) => piece.id)).size, quizzes.length);
    order.forEach((piece, index) => assert.equal(piece, puzzles.pieceForQuiz(quizzes[index].id).piece));
  }
});

test("playback waits for artwork, steps, pauses, scrubs, resets and stops at completion", () => {
  const timers = new Map();
  let serial = 0;
  let state;
  const player = createPlayback((value) => { state = value; }, (callback, delay) => {
    assert.equal(delay, 200);
    timers.set(++serial, callback);
    return serial;
  }, (id) => timers.delete(id));
  const tick = () => [...timers.values()].forEach((callback) => callback());
  player.reset(16);
  player.toggle(); player.next();
  assert.equal(state.count, 0);
  assert.equal(timers.size, 0);
  player.loaded(); player.next();
  assert.equal(state.count, 1);
  player.toggle(); tick();
  assert.equal(state.count, 2);
  player.toggle(); tick();
  assert.equal(state.count, 2);
  player.toggle(); player.seek(14); tick();
  assert.equal(state.count, 14);
  assert.equal(state.playing, false);
  player.toggle(); tick(); tick(); tick();
  assert.equal(state.count, 16);
  assert.equal(timers.size, 0);
  player.next(); player.toggle();
  assert.equal(state.count, 16);
  assert.equal(state.playing, false);
  player.seek(0);
  assert.equal(state.count, 0);
  player.seek(-5); assert.equal(state.count, 0);
  player.seek(99); assert.equal(state.count, 16);
  player.seek(NaN); assert.equal(state.count, 16);
  player.seek(0); player.toggle(); player.reset(56); tick();
  assert.deepEqual(state, { count: 0, total: 56, playing: false, ready: false });
  player.loaded(); player.toggle(); player.pause(); tick();
  assert.equal(state.count, 0);
  assert.equal(timers.size, 0);
});
