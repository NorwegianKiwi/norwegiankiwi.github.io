"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("legal page contains both static locales and every local licence record", () => {
  const html = read("licenses-and-privacy.html");

  assert.match(html, /data-legal-locale="nb"/);
  assert.match(html, /data-legal-locale="en"/);
  assert.doesNotMatch(html, /data-legal-locale="(?:nb|en)"[^>]*\shidden(?:\s|>)/);
  assert.match(html, /mailto:privacy@lanceolav\.com/);

  for (const file of [
    "flag-icons-MIT.txt",
    "local-flags.txt",
    "twemoji-CC-BY-4.0.txt",
    "natural-earth-public-domain.txt",
  ]) {
    assert.match(html, new RegExp(`href="\\./licenses/${file.replaceAll(".", "\\.")}"`));
    assert.ok(fs.existsSync(path.join(root, "licenses", file)));
  }
});

test("home footer uses the localized legal link", () => {
  const app = read("app.js");

  assert.match(app, /licenses-and-privacy\.html/);
  assert.match(app, /t\("licencesAndPrivacy"\)/);
  assert.match(app, /state\.locale === "en" \? "\?lang=en" : ""/);
});

test("runtime documents contain no browser analytics endpoint", () => {
  const runtime = [
    "index.html",
    "licenses-and-privacy.html",
    "app.js",
    "legal-page.js",
  ].map(read).join("\n");

  assert.doesNotMatch(runtime, /static\.cloudflareinsights\.com/i);
  assert.doesNotMatch(runtime, /cloudflareinsights\.com\/cdn-cgi\/rum/i);
  assert.doesNotMatch(runtime, /\/cdn-cgi\/rum/i);
  assert.doesNotMatch(runtime, /beacon\.min\.js/i);
});
