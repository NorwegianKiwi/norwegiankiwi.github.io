"use strict";

const test = require("node:test");

test("uses the public deployment as the canonical share target", () => {
  const assert = require("node:assert/strict");
  const sharing = require("../sharing.js");
  assert.equal(sharing.PUBLIC_APP_URL, "https://lanceolav.com/helloworld/");
});

test("builds an encoded email draft URL", () => {
  const assert = require("node:assert/strict");
  const sharing = require("../sharing.js");
  const value = sharing.createEmailUrl(
    "I reached Explorer & learned more",
    "I mastered levels 5–14.\n\nhttps://example.test/helloworld/?lang=en",
  );
  const url = new URL(value);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.searchParams.get("subject"), "I reached Explorer & learned more");
  assert.equal(
    url.searchParams.get("body"),
    "I mastered levels 5–14.\n\nhttps://example.test/helloworld/?lang=en",
  );
});

test("keeps native sharing and email drafts aligned", () => {
  const assert = require("node:assert/strict");
  const sharing = require("../sharing.js");
  const payload = sharing.createSharePayload({
    title: "Sølvi reached Explorer & Navigator",
    text: "Sølvi mastered levels 5–14.",
    url: "https://example.test/helloworld/?lang=en&from=share",
    emailCallToAction: "Explore Hello World!:",
  });

  assert.deepEqual(payload.native, {
    title: "Sølvi reached Explorer & Navigator",
    text: "Sølvi mastered levels 5–14.",
    url: "https://example.test/helloworld/?lang=en&from=share",
  });
  assert.deepEqual(payload.email, {
    subject: payload.native.title,
    body: `${payload.native.text}\n\nExplore Hello World!:\n${payload.native.url}`,
  });
  assert.equal(
    sharing.createFallbackMessage(payload),
    `${payload.native.title}\n\n${payload.native.text}\n\nExplore Hello World!:\n${payload.native.url}`,
  );

  const emailUrl = new URL(sharing.createEmailUrl(
    payload.email.subject,
    payload.email.body,
  ));
  assert.equal(emailUrl.searchParams.get("subject"), payload.native.title);
  assert.equal(emailUrl.searchParams.get("body"), payload.email.body);
});

test("omits only the default profile placeholder", () => {
  const assert = require("node:assert/strict");
  const sharing = require("../sharing.js");
  assert.equal(sharing.personalizedName("Player 1"), null);
  assert.equal(sharing.personalizedName("  Player 1  "), null);
  assert.equal(sharing.personalizedName(""), null);
  assert.equal(sharing.personalizedName("Sølvi"), "Sølvi");
});
