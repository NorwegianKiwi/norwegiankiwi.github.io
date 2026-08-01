# Hello World!

A static geography site covering 196 countries, with local SVG flags, four
quiz modes, flashcards, and an Explore section with an alphabetical list and
interactive regional maps. The map quiz highlights one country on a regional
map and provides six country names to choose from. When Whole world is
selected, the user chooses a single region before starting the map quiz.

Open `index.html` directly in a browser. The site requires no installation,
development server, build process, or third-party packages.

## Install as an app

The hosted site can be installed as an online-only web app. On iPhone or iPad,
open the site in Safari, use Share → Add to Home Screen, enable Open as Web
App, and tap Add. On Android, use the browser menu and choose Install app or
Add to Home screen. The installed app is named “Hello World!” on every
platform and still requires a network connection.

The site is available in Norwegian and English. The language and selected
region are stored in the URL, while quiz progress is retained only in the
open tab. Norwegian and Whole world are the defaults and are omitted from the
URL:

- `?lang=en` – English
- `?region=europe` – Norwegian with Europe selected
- `?lang=en&region=europe` – English with Europe selected

The language can be changed from anywhere on the site without resetting an
active quiz, flashcard round, or Explore view.

## Result-screen previews

Internal query parameters can open deterministic result screens for visual
testing:

- `?_result=perfect` – every answer correct, without a review section
- `?_result=mixed` – approximately two-thirds correct
- `?_result=wrong` – every answer wrong

An optional `_mode` parameter accepts `country-flag`, `flag-country`,
`country-capital`, or `map-country`; it defaults to `country-flag`. Existing
`lang` and `region` parameters can be combined with the previews, for example
`?_result=wrong&_mode=country-capital&lang=en&region=caribbean`.

Previews use every country from the selected region, so the all-wrong case
shows the complete review list. These parameters are testing conveniences,
not private or secure functionality.

## Files

- `index.html` – document shell and default metadata
- `manifest.webmanifest` and `icons/` – installable web-app metadata and icons
- `styles/` – presentation split into base, quiz, Explore, flashcard, and
  responsive stylesheets
- `countries.js` – bilingual country and region data
- `distractors.js` – curated relationships used by the two flag quizzes
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

`world-map.js` also contains pregenerated region-centred azimuthal equidistant
geometry with automatically fitted cameras for the nine individual regions
used by the map quiz, plus an Explore-only overview of all 54 African
countries.
Oceania is Pacific-centred so that island states on both sides of the date
line appear together. Reprojection does not run in the browser and adds no
runtime dependencies.

Source versions, exact archive URLs, checksums, code overrides, projection
seeds, and editorial rules are stored in `tools/map-sources.json`.
Read `MAP-DATA.md` before verifying or updating map data. Run the quick,
offline consistency check with:

```sh
python3 tools/map_maintenance.py validate
```

The map quiz also includes a small shape inset in the lower-left corner with
north-up country silhouettes generated from Natural Earth 1:10m Admin 0
Countries, version 5.1.1. The higher level of detail provides visible outlines
for microstates and small island states. Each silhouette uses one
country-centered equirectangular projection with a fixed standard parallel,
then is scaled and compressed in advance. Keeping the horizontal scale fixed
across the whole country prevents north–south shear.
Components below the normal readability threshold remain real polygon
geometry: they render without an outline in the compact inset and gain a thin
outline when enlarged. Only countries whose complete silhouette is sub-pixel
use up to eight representative dots in the compact inset; those dots disappear
in the enlarged view so the detailed polygons take over.
For countries with remote territories, declarative editorial rules can instead
fit the recognizable main form in the compact inset and compose selected remote
areas in separate, independently scaled frames when enlarged. This affects the
silhouette only, not any quiz or Explore map.

The Maps view in Explore reuses the same regional azimuthal equidistant maps and
silhouettes. Active countries with Natural Earth tiny-country locator points
use 1:10m foreground geometry on regional maps, while other foreground and all
background geography use 1:50m. A map is available for each of the nine
individual regions;
Whole world instead presents a region choice. From either African region,
Explore can temporarily show a full-Africa overview without changing the
selected quiz region. East and South Asia always shows its complete regional
view, including all of Russia. The Africa control is Explore-only and does not
change the selected region or URL. Regional maps use
an independent background layer generated with the same transform as its
active countries. Every non-active country polygon intersecting the responsive
frame is retained, without a relevance or proximity filter. The camera expands
to the rendered card shape without mismatched borders, distortion, or cropped
active countries.
Tiny-country dots retain a constant on-screen size. The map data connects to
`countries.js` through
country codes rather than duplicating region membership.
Explore maps support map-local touchscreen and trackpad pinch zoom,
touchscreen two-finger panning, and desktop press-and-drag panning, with
keyboard-accessible controls from 100% to 800%; the surrounding page remains
at its normal scale.

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

Flag quizzes reserve up to two answer slots for useful distractors from the
curated groups in `distractors.js`. Primary groups contain close matches; the
first curated slot uses one of these when available. Secondary groups contain
broader colour, shape, and symbol similarities. The second slot uses any
remaining related country, and both slots may use secondary matches when no
primary match exists. Remaining slots are filled randomly from the selected
region, while curated distractors may cross region boundaries. Pairs listed
as flag conflicts are never shown together because their flags are not
reliably distinguishable at quiz size. Capital and map quizzes keep their
uniform regional answer selection. A country may belong to multiple groups;
new groups must declare either `primary` or `secondary` strength.

When a country, flag, or capital changes, check both language variants and
the corresponding local SVG. Interface translations are collected in
`app.js`. Both languages must expose the same translation keys; missing keys
produce a clear loading error.

Each country has one `region`. The project uses the UN
[M49 classification](https://unstats.un.org/unsd/methodology/m49/overview/)
as a starting point, with balanced educational macro-regions for Africa and
Asia: North and West Africa (26), East and South Africa (28), West and Central
Asia (24), and East and South Asia (25). Russia is a deliberate exception: it
belongs to East and South Asia, and both the regional map and silhouette show
the complete country. Cyprus and Türkiye belong
to West and Central Asia. Countries in the Americas store the most specific
region (`north-central-america`, `south-america`, or `caribbean`).

The initial country notes explain Russia and Türkiye's continental placement
with support from
[Store norske leksikon](https://snl.no/Europa), Cyprus's geographic placement
and EU membership with support from
[UN M49](https://unstats.un.org/unsd/methodology/m49/overview/) and the
[European Union](https://european-union.europa.eu/principles-countries-history/eu-countries/cyprus_en),
and South Africa's three capitals with support from the
[South African Government](https://www.gov.za/south-africa-glance).
