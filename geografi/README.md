# Hello World!

A static geography site covering 196 countries, with local SVG flags, four
quiz modes, flashcards, and an Explore section with an alphabetical list and
interactive regional maps. The map quiz highlights one country on a regional
map and provides six country names to choose from. When Whole world is
selected, the user chooses a single region before starting the map quiz.

Open `index.html` directly in a browser. The site requires no installation,
development server, build process, or third-party packages.

The site is available in Norwegian and English. The language and selected
region are stored in the URL, while quiz progress is retained only in the
open tab. Norwegian and Whole world are the defaults and are omitted from the
URL:

- `?lang=en` – English
- `?region=europe` – Norwegian with Europe selected
- `?lang=en&region=europe` – English with Europe selected

The language can be changed from anywhere on the site without resetting an
active quiz, flashcard round, or Explore view.

## Files

- `index.html` – document shell and default metadata
- `styles.css` – presentation and responsive layout
- `countries.js` – bilingual country and region data
- `world-map.js` – local projected map data derived from Natural Earth
- `MAP-DATA.md` – map-data verification and update procedure
- `tools/` – machine-readable map manifest and dependency-free maintenance tools
- `app.js` – quiz logic, localization, URL state, and rendering
- `favicon.svg` – globe used as the favicon and hero decoration
- `flags/` – the 196 flags used by the quiz, with
  [source and update information](flags/README.md)
- `licenses/` – licences for the flags, globe, and map sources

## World map

The interactive world map is generated from Natural Earth 1:50m Admin 0
Countries and Tiny Country Points, version 5.1.1. It uses the Equal Earth
projection and is simplified for browser display. Natural Earth data is
public domain; its source and terms are documented in
`licenses/natural-earth-public-domain.txt`.

`world-map.js` also contains pregenerated Mercator geometry with manually
adjusted extents for the seven individual regions used by the map quiz.
Oceania is Pacific-centred so that island states on both sides of the date
line appear together. Reprojection does not run in the browser and adds no
runtime dependencies.

Source versions, exact archive URLs, checksums, code overrides, projections,
fixed extents, and editorial rules are stored in `tools/map-sources.json`.
Read `MAP-DATA.md` before verifying or updating map data. Run the quick,
offline consistency check with:

```sh
python3 tools/map_maintenance.py validate
```

The map quiz also includes a small shape inset with north-up country
silhouettes generated from Natural Earth 1:10m Admin 0 Countries, version
5.1.1. The higher level of detail provides visible outlines for microstates
and small island states. Silhouettes are scaled and compressed in advance,
and very small island components are retained as local point markers.

The Map tab in Explore reuses the same regional Mercator maps and
silhouettes. A map is available for each of the seven individual regions;
Whole world instead presents a region choice. The map data does not duplicate
region membership, but connects to `countries.js` through country codes.

## Globe

The globe is Twemoji's
[Globe showing Europe–Africa](https://github.com/twitter/twemoji/blob/master/assets/svg/1f30d.svg).
The graphic is used unchanged and is licensed under
[CC BY 4.0](https://github.com/twitter/twemoji/blob/master/LICENSE-GRAPHICS).
A local copy of the licence is stored in
`licenses/twemoji-CC-BY-4.0.txt`.

## Maintaining country data

Norwegian and English country names, capitals, region names, and country
notes are maintained locally in `countries.js`; they are not imported
automatically from the flag source. Every country record keeps both locales
together and must contain non-empty names and capitals for each language.
Optional notes must also be complete in both languages. The file validates
these requirements when loaded.

When a country, flag, or capital changes, check both language variants and
the corresponding local SVG. Interface translations are collected in
`app.js`. Both languages must expose the same translation keys; missing keys
produce a clear loading error.

Each country has one `region`, based on the UN
[M49 classification](https://unstats.un.org/unsd/methodology/m49/overview/).
Russia is a deliberate educational exception: it is placed in Asia to
provide one clear region assignment and legible regional maps. Cyprus and
Türkiye are also placed in Asia. Countries in the Americas store the most
specific region (`north-central-america`, `south-america`, or `caribbean`).

The initial country notes explain Russia and Türkiye's continental placement
with support from
[Store norske leksikon](https://snl.no/Europa), Cyprus's geographic placement
and EU membership with support from
[UN M49](https://unstats.un.org/unsd/methodology/m49/overview/) and the
[European Union](https://european-union.europa.eu/principles-countries-history/eu-countries/cyprus_en),
and South Africa's three capitals with support from the
[South African Government](https://www.gov.za/south-africa-glance).
