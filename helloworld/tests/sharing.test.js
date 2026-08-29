"use strict";

const test = require("node:test");

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
