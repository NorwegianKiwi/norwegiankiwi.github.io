"use strict";

const test = require("node:test");

test("version 2 challenge recipes and score proofs", async () => {
  const assert = require("node:assert/strict");

  global.window = global;
  require("../countries.js");
  const curriculum = require("../curriculum.js");
  const challenge = require("../challenge.js");

  const quiz = curriculum.quizById.get("pack-nordics:country-flag");
  assert.ok(quiz, "focused v2 quiz must exist");

  const opened = challenge.readUrl(
    `https://example.test/helloworld/?cv=2&quiz=${quiz.id}&rev=${quiz.revision}&score=5&proof=U5VCUGVvI7k`,
    curriculum.quizById,
  );
  assert.deepEqual(opened, {
    valid: true,
    quizId: quiz.id,
    revision: quiz.revision,
    scoreParam: "5",
    proof: "U5VCUGVvI7k",
  });
  assert.equal(challenge.readUrl("https://example.test/helloworld/", curriculum.quizById), null);
  assert.deepEqual(
    challenge.readUrl(`https://example.test/helloworld/?cv=2&quiz=${quiz.id}&rev=999`, curriculum.quizById),
    { valid: false },
  );
  assert.deepEqual(
    challenge.readUrl("https://example.test/helloworld/?cv=1&mode=country-flag&region=europe&seed=ABC", curriculum.quizById),
    { valid: false },
  );

  const shared = challenge.createUrl(
    "https://example.test/helloworld/?region=europe#progress=old",
    { quizId: quiz.id, revision: quiz.revision, score: 5, proof: "U5VCUGVvI7k" },
    "en",
  );
  assert.equal(
    shared.href,
    `https://example.test/helloworld/?lang=en&cv=2&quiz=${encodeURIComponent(quiz.id)}&rev=${quiz.revision}&score=5&proof=U5VCUGVvI7k`,
  );
  assert.equal(shared.searchParams.has("mode"), false);
  assert.equal(shared.searchParams.has("region"), false);
  assert.equal(shared.searchParams.has("seed"), false);
  assert.deepEqual(challenge.readUrl(shared, curriculum.quizById), opened);

    const recipe = { quizId: quiz.id, revision: quiz.revision, score: 5 };
    const proof = await challenge.createScoreProof(recipe);
    assert.equal(proof, "U5VCUGVvI7k");
    assert.equal(await challenge.verifyScoreProof(recipe, proof), true);
    assert.equal(await challenge.verifyScoreProof({ ...recipe, score: 4 }, proof), false);
    assert.equal(await challenge.verifyScoreProof({ ...recipe, revision: 2 }, proof), false);
    assert.equal(await challenge.verifyScoreProof({ ...recipe, quizId: "other:quiz" }, proof), false);
    assert.equal(await challenge.verifyScoreProof(recipe, "not-a-proof"), false);
});
