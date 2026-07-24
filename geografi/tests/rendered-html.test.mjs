import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the Atlas setup screen", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="nb">/i);
  assert.match(html, /<title>Atlas – lær land, flagg og hovedsteder<\/title>/i);
  assert.match(html, /Hvor godt kjenner/);
  assert.match(html, /Land → flagg/);
  assert.match(html, /Flagg → land/);
  assert.match(html, /Land \+ flagg → hovedstad/);
  assert.match(html, /Hele verden/);
  assert.match(html, /Start øvelsen/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("contains 196 unique countries and every quiz region", async () => {
  const source = await readFile(
    new URL("../app/countries.ts", import.meta.url),
    "utf8",
  );
  const rows = [
    ...source.matchAll(
      /^  \["([a-z]{2})", "([^"]+)", "([^"]+)", \[(.*?)\]\],$/gm,
    ),
  ];
  const codes = rows.map((match) => match[1]);

  assert.equal(rows.length, 196);
  assert.equal(new Set(codes).size, 196);
  assert.ok(codes.includes("xk"), "Kosovo should be included");

  for (const region of [
    "europe",
    "africa",
    "asia",
    "oceania",
    "americas",
    "north-central-america",
    "south-america",
    "caribbean",
  ]) {
    assert.match(source, new RegExp(`"${region}"`));
  }
});
