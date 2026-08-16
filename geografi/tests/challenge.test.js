"use strict";

const assert = require("node:assert/strict");

global.window = global;
require("../countries.js");
require("../distractors.js");
const challenge = require("../challenge.js");

const { countries } = global.GEOGRAFI_QUIZ_DATA;
const distractors = global.GEOGRAFI_QUIZ_DISTRACTOR_DATA;

function round(mode, region, seed, choiceCount) {
  const pool = countries.filter(
    (country) => region === "world" || country.region === region,
  );
  return challenge.createQuestions({
    pool,
    allCountries: countries,
    ...distractors,
    choiceCount,
    mode,
    seed,
  });
}

function codes(questions, count = 3) {
  return questions.slice(0, count).map((question) => [
    question.country.code,
    question.choices.map((country) => country.code),
  ]);
}

const goldenVectors = [
  {
    mode: "country-flag",
    region: "europe",
    seed: "KXWPR",
    choiceCount: 9,
    total: 44,
    first: [
      ["al", ["li", "xk", "sm", "ie", "md", "si", "al", "hr", "mc"]],
      ["rs", ["hr", "li", "pl", "rs", "at", "sk", "hu", "si", "de"]],
      ["fi", ["no", "lv", "fi", "dk", "fr", "mk", "se", "li", "ch"]],
    ],
  },
  {
    mode: "flag-country",
    region: "world",
    seed: "ABCDE",
    choiceCount: 6,
    total: 196,
    first: [
      ["cf", ["bt", "cf", "no", "rw", "ae", "mh"]],
      ["bd", ["pw", "lr", "mv", "jp", "bd", "cd"]],
      ["rw", ["mu", "cl", "dj", "pk", "mn", "rw"]],
    ],
  },
  {
    mode: "country-capital",
    region: "caribbean",
    seed: "QWERT",
    choiceCount: 6,
    total: 13,
    first: [
      ["vc", ["do", "lc", "bs", "vc", "dm", "tt"]],
      ["gd", ["do", "ht", "kn", "cu", "gd", "vc"]],
      ["tt", ["bb", "do", "ag", "vc", "tt", "cu"]],
    ],
  },
  {
    mode: "map-country",
    region: "oceania",
    seed: "ZAPES",
    choiceCount: 6,
    total: 14,
    first: [
      ["to", ["nr", "to", "ws", "fm", "fj", "tv"]],
      ["mh", ["pg", "fm", "fj", "mh", "nz", "pw"]],
      ["ws", ["tv", "nz", "nr", "ws", "fj", "ki"]],
    ],
  },
];

for (const vector of goldenVectors) {
  const questions = round(
    vector.mode,
    vector.region,
    vector.seed,
    vector.choiceCount,
  );
  assert.equal(questions.length, vector.total);
  assert.deepEqual(codes(questions), vector.first);
  assert.deepEqual(
    codes(
      round(vector.mode, vector.region, vector.seed, vector.choiceCount),
      vector.total,
    ),
    codes(questions, vector.total),
  );
}

assert.equal(challenge.normalizeSeed(" kxwpr "), "KXWPR");
for (const invalid of ["ABCD", "ABCDEF", "AB1DE", "ABIDE", "ABODE", ""]) {
  assert.equal(challenge.normalizeSeed(invalid), null);
}

const fakeCrypto = {
  getRandomValues(bytes) {
    for (let index = 0; index < bytes.length; index += 1) bytes[index] = index;
    return bytes;
  },
};
assert.equal(challenge.createRandomSeed(fakeCrypto), "ABCDE");
assert.throws(() => challenge.createSeededRandom("ABCDE", 2));

(async () => {
  const recipe = {
    version: 1,
    mode: "country-flag",
    region: "europe",
    seed: "KXWPR",
    score: 23,
  };
  const proof = await challenge.createScoreProof(recipe);
  assert.equal(proof, "AcJBW5KX36Q");
  assert.equal(await challenge.verifyScoreProof(recipe, proof), true);
  assert.equal(
    await challenge.verifyScoreProof({ ...recipe, score: 24 }, proof),
    false,
  );
  assert.equal(
    await challenge.verifyScoreProof({ ...recipe, region: "caribbean" }, proof),
    false,
  );
  assert.equal(
    await challenge.verifyScoreProof({ ...recipe, mode: "flag-country" }, proof),
    false,
  );
  assert.equal(
    await challenge.verifyScoreProof({ ...recipe, seed: "ABCDE" }, proof),
    false,
  );
  assert.equal(await challenge.verifyScoreProof(recipe, "not-a-proof"), false);
  for (const score of [0, 1, 195, 196]) {
    const edgeRecipe = { ...recipe, region: "world", score };
    const edgeProof = await challenge.createScoreProof(edgeRecipe);
    assert.equal(await challenge.verifyScoreProof(edgeRecipe, edgeProof), true);
  }
  console.log("Challenge compatibility tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
