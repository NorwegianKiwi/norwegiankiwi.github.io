"use strict";

const test = require("node:test");

test("classifies bare and embedded shared links", () => {
  const assert = require("node:assert/strict");
  global.window = global;
  require("../countries.js");
  const curriculum = require("../curriculum.js");
  const challenge = require("../challenge.js");
  const progress = require("../progress.js");
  const sharedLink = require("../shared-link.js");
  const currentUrl = "https://example.test/helloworld/?lang=en";
  const dependencies = {
    quizById: curriculum.quizById,
    readChallenge: challenge.readUrl,
    decodeTransfer: progress.decodeTransfer,
  };

  const quiz = curriculum.quizById.get("pack-nordics:country-flag");
  const challengeUrl = challenge.createUrl(currentUrl, {
    quizId: quiz.id,
    revision: quiz.revision,
    score: 4,
  }, "en");
  assert.equal(
    sharedLink.classify(challengeUrl.href, currentUrl, dependencies).kind,
    "challenge",
  );
  assert.equal(
    sharedLink.classify(`Try this round:\n${challengeUrl.href}`, currentUrl, dependencies).kind,
    "challenge",
  );

  const store = progress.createEmptyStore({
    id: "transfer-profile",
    defaultName: "Transfer Test",
    now: "2026-08-29T00:00:00.000Z",
  });
  const payload = progress.encodeTransfer(progress.activeProfile(store));
  const transferUrl = `${currentUrl}#progress=${payload}`;
  const transfer = sharedLink.classify(
    `Profile transfer\n${transferUrl}.`,
    currentUrl,
    dependencies,
  );
  assert.equal(transfer.kind, "transfer");
  assert.equal(transfer.locale, "en");
  assert.equal(transfer.payload, payload);

  assert.equal(
    sharedLink.classify("https://example.test/helloworld/", currentUrl, dependencies).kind,
    "invitation",
  );
  assert.equal(
    sharedLink.classify("https://example.test/helloworld/index.html?lang=en", currentUrl, dependencies).kind,
    "invitation",
  );
});

test("rejects ambiguous, foreign, corrupt, and unsupported shared links", () => {
  const assert = require("node:assert/strict");
  global.window = global;
  require("../countries.js");
  const curriculum = require("../curriculum.js");
  const challenge = require("../challenge.js");
  const progress = require("../progress.js");
  const sharedLink = require("../shared-link.js");
  const currentUrl = "https://example.test/helloworld/";
  const dependencies = {
    quizById: curriculum.quizById,
    readChallenge: challenge.readUrl,
    decodeTransfer: progress.decodeTransfer,
  };

  assert.equal(sharedLink.classify("", currentUrl, dependencies).error, "sharedLinkRequired");
  assert.equal(sharedLink.classify("not a URL", currentUrl, dependencies).error, "sharedLinkMalformed");
  assert.equal(
    sharedLink.classify(
      "Use https://example.test/helloworld/ or https://example.test/helloworld/?lang=en",
      currentUrl,
      dependencies,
    ).error,
    "sharedLinkMalformed",
  );
  assert.equal(
    sharedLink.classify("https://other.test/helloworld/", currentUrl, dependencies).error,
    "sharedLinkWrongApp",
  );
  assert.equal(
    sharedLink.classify("https://example.test/other/", currentUrl, dependencies).error,
    "sharedLinkWrongApp",
  );
  assert.equal(
    sharedLink.classify("https://example.test/helloworld/?cv=999", currentUrl, dependencies).error,
    "sharedLinkInvalidChallenge",
  );
  assert.equal(
    sharedLink.classify("https://example.test/helloworld/#progress=broken", currentUrl, dependencies).error,
    "sharedLinkInvalidTransfer",
  );
  assert.equal(
    sharedLink.classify("https://example.test/helloworld/?view=levels", currentUrl, dependencies).error,
    "sharedLinkUnsupported",
  );

  const quiz = curriculum.quizById.get("pack-nordics:country-flag");
  const mixed = `https://example.test/helloworld/?cv=2&quiz=${encodeURIComponent(quiz.id)}&rev=${quiz.revision}#progress=broken`;
  assert.equal(
    sharedLink.classify(mixed, currentUrl, dependencies).kind,
    "challenge",
    "challenge parameters keep precedence over a transfer fragment",
  );
});

test("accepts canonical public links in local development without weakening production checks", () => {
  const assert = require("node:assert/strict");
  global.window = global;
  require("../countries.js");
  const curriculum = require("../curriculum.js");
  const challenge = require("../challenge.js");
  const progress = require("../progress.js");
  const sharedLink = require("../shared-link.js");
  const canonicalUrl = "https://lanceolav.com/helloworld/";
  const dependencies = {
    canonicalUrl,
    quizById: curriculum.quizById,
    readChallenge: challenge.readUrl,
    decodeTransfer: progress.decodeTransfer,
  };

  assert.equal(
    sharedLink.classify(canonicalUrl, "file:///tmp/helloworld/index.html", dependencies).kind,
    "invitation",
  );
  assert.equal(
    sharedLink.classify(canonicalUrl, "http://localhost:8765/", dependencies).kind,
    "invitation",
  );
  assert.equal(
    sharedLink.classify(
      "https://copy.example/helloworld/",
      "https://copy.example/helloworld/",
      dependencies,
    ).error,
    "sharedLinkWrongApp",
  );
});
