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
  {
    mode: "country-capital",
    region: "europe",
    seed: "ABC",
    choiceCount: 6,
    total: 44,
    first: [
      ["pl", ["lt", "al", "sm", "va", "pl", "se"]],
      ["fr", ["lv", "me", "si", "fr", "it", "ch"]],
      ["ee", ["md", "be", "ee", "se", "cz", "pl"]],
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

const canonicalQuestions = round("country-capital", "europe", "ABC", 6).slice(
  0,
  3,
);
const canonicalSnapshot = codes(canonicalQuestions);
const lowChoiceOrder = challenge.randomizeChoiceOrder(
  canonicalQuestions,
  () => 0,
);
const highChoiceOrder = challenge.randomizeChoiceOrder(
  canonicalQuestions,
  () => 0.999,
);
assert.deepEqual(
  lowChoiceOrder.map((question) => question.country.code),
  canonicalQuestions.map((question) => question.country.code),
);
assert.deepEqual(
  lowChoiceOrder.map((question) =>
    question.choices.map((choice) => choice.code).sort(),
  ),
  canonicalQuestions.map((question) =>
    question.choices.map((choice) => choice.code).sort(),
  ),
);
assert.deepEqual(codes(canonicalQuestions), canonicalSnapshot);
assert.notDeepEqual(codes(lowChoiceOrder), codes(highChoiceOrder));
assert.notEqual(lowChoiceOrder[0], canonicalQuestions[0]);
assert.notEqual(lowChoiceOrder[0].choices, canonicalQuestions[0].choices);

assert.equal(challenge.normalizeSeed(" kxwpr "), "KXWPR");
assert.equal(challenge.normalizeSeed(" abc "), "ABC");
for (const invalid of [
  "AB",
  "ABCD",
  "ABCDEF",
  "AB1",
  "AIC",
  "AOC",
  "AB1DE",
  "ABIDE",
  "ABODE",
  "",
]) {
  assert.equal(challenge.normalizeSeed(invalid), null);
}

const fakeCrypto = {
  getRandomValues(bytes) {
    for (let index = 0; index < bytes.length; index += 1) bytes[index] = index;
    return bytes;
  },
};
assert.equal(challenge.createRandomSeed(fakeCrypto), "ABC");
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
  const shortRecipe = { ...recipe, seed: "ABC" };
  const shortProof = await challenge.createScoreProof(shortRecipe);
  assert.equal(shortProof, "Hg_AspvV34I");
  assert.equal(await challenge.verifyScoreProof(shortRecipe, shortProof), true);
  assert.equal(
    await challenge.verifyScoreProof(
      { ...shortRecipe, seed: "ABD" },
      shortProof,
    ),
    false,
  );
  for (const score of [0, 1, 195, 196]) {
    const edgeRecipe = { ...recipe, region: "world", score };
    const edgeProof = await challenge.createScoreProof(edgeRecipe);
    assert.equal(await challenge.verifyScoreProof(edgeRecipe, edgeProof), true);
  }
  const curriculumRecipe = { quizId: "pack-nordics:country-flag", revision: 1, score: 5 };
  const curriculumProof = await challenge.createCurriculumScoreProof(curriculumRecipe);
  assert.equal(curriculumProof, "U5VCUGVvI7k");
  assert.equal(await challenge.verifyCurriculumScoreProof(curriculumRecipe, curriculumProof), true);
  assert.equal(await challenge.verifyCurriculumScoreProof({ ...curriculumRecipe, score: 4 }, curriculumProof), false);
  console.log("Challenge compatibility tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
