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
  const runtime = fs.readdirSync(root)
    .filter((file) => /\.(?:html|js)$/.test(file))
    .map(read).join("\n");

  assert.doesNotMatch(runtime, /static\.cloudflareinsights\.com/i);
  assert.doesNotMatch(runtime, /cloudflareinsights\.com\/cdn-cgi\/rum/i);
  assert.doesNotMatch(runtime, /\/cdn-cgi\/rum/i);
  assert.doesNotMatch(runtime, /beacon\.min\.js/i);
  assert.doesNotMatch(runtime, /data-cf-beacon|__cfBeacon|zaraz\s*\.|\/cdn-cgi\/zaraz|navigator\.sendBeacon/i);
});

test("each locale links the shared notice and preserves every licence", () => {
  const html = read("licenses-and-privacy.html");
  for (const locale of ["nb", "en"]) {
    const article = html.match(new RegExp(`<article[^>]*data-legal-locale="${locale}"[^>]*>([\\s\\S]*?)</article>`))[1];
    assert.ok(article.includes("hello-world-progress"));
    assert.match(article, /NEL/);
    assert.ok(article.includes(locale === "en" ? 'href="../privacy.html"' : 'href="../privacy.html?lang=nb"'));
    const licences = [...article.matchAll(/href="\.\/licenses\/([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(licences.sort(), ["flag-icons-MIT.txt", "local-flags.txt", "natural-earth-public-domain.txt", "twemoji-CC-BY-4.0.txt"]);
    for (const file of licences) assert.ok(fs.statSync(path.join(root, "licenses", file)).isFile());
    assert.equal([...article.matchAll(/href="https:\/\/commons\.wikimedia\.org\/wiki\/File:/g)].length, 4);
    assert.match(article, /Twitter/);
    assert.match(article, /5\.1\.1/);
  }
});

test("legal enhancement selects language, metadata and navigation without storage", () => {
  const vm = require("node:vm");
  for (const base of ["https://example.com/helloworld/", "file:///tmp/helloworld/"]) for (const query of ["", "?lang=nb", "?lang=en", "?lang=fr"]) {
    const locale = query === "?lang=en" ? "en" : "nb";
    const element = (attributes = {}) => ({
      attributes, textContent: "", hidden: false,
      getAttribute(name) { return this.attributes[name]; },
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
    });
    const articles = ["nb", "en"].map((lang) => element({ "data-legal-locale": lang }));
    const links = ["nb", "en"].map((lang) => element({ "data-legal-language": lang, "aria-current": "page" }));
    const home = element(), brand = element(), description = element();
    const returns = [element({ href: "./index.html" }), element({ href: "./index.html?lang=en" })];
    const classes = new Set();
    const document = {
      documentElement: { classList: { add: (value) => classes.add(value) } },
      querySelector: (selector) => ({ '[data-legal-home-link]': home, '[data-legal-brand]': brand, 'meta[name="description"]': description })[selector],
      querySelectorAll: (selector) => selector === "[data-legal-locale]" ? articles : selector === ".legal-return a" ? returns : links,
    };
    vm.runInNewContext(read("legal-page.js"), { URL, document, window: { location: { href: `${base}licenses-and-privacy.html${query}` } } });
    assert.equal(document.documentElement.lang, locale);
    assert.ok(classes.has("legal-page-enhanced"));
    const homePath = base.startsWith("file:") ? "./index.html" : "./";
    assert.equal(home.attributes.href, homePath + (locale === "en" ? "?lang=en" : ""));
    assert.deepEqual(returns.map((link) => link.attributes.href), [homePath, `${homePath}?lang=en`]);
    assert.equal(brand.textContent, locale === "en" ? "Hello World!" : "Hei verden!");
    assert.match(document.title, locale === "en" ? /Licences and privacy/ : /Lisenser og personvern/);
    assert.ok(description.attributes.content);
    for (let i = 0; i < articles.length; i++) {
      const selected = articles[i].attributes["data-legal-locale"] === locale;
      assert.equal(articles[i].hidden, !selected);
      assert.equal(links[i].attributes["aria-current"], selected ? "page" : undefined);
    }
  }
});
