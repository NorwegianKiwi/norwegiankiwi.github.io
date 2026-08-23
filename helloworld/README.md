# Hello World!

A static, bilingual geography progression game covering 196 countries in 47
levels and 188 fixed single-mode quizzes. It includes multiple local profiles,
best scores, resumable mastery challenges, progress transfer and backup, plus
an independent, viewport-fitted Explore workspace with world, regional, and
contextual country maps plus a country list and Flashcards action.

Open `index.html` directly in a browser. The site requires no installation,
development server, build process, or third-party packages.

## Install as an app

The hosted site can be installed as an online-only web app. On iPhone or iPad,
open the site in Safari, use Share → Add to Home Screen, enable Open as Web
App, and tap Add. On Android, use the browser menu and choose Install app or
Add to Home screen. The installed app is named “Hello World!” on every
platform and still requires a network connection.

The site is available in Norwegian and English. The language and selected
Explore region are stored in the URL. Norwegian and Whole world are the
defaults and are omitted from the URL:

- `?lang=en` – English
- `?region=europe` – Norwegian with Europe selected
- `?lang=en&region=europe` – English with Europe selected

The language can be changed from anywhere without resetting an active quiz,
card deck, saved mastery attempt, or Explore workspace. Game progress is stored in
versioned local profiles under the `hello-world-progress` localStorage key.
First use creates Player 1 automatically.

The complete ordered curriculum is defined in `CURRICULUM.md` and implemented
in `curriculum.js`. Profile, persistence, transfer and backup behavior lives in
`progress.js`. Both are dependency-free UMD modules so they work directly in a
browser and in the Node-based domain tests.

## Test profiles

Import `fixtures/test-profiles-backup.json` through **Settings → Import backup
file → Import all profiles** to add ten switchable test profiles. They cover a
new player, played and partially mastered states, progression milestones, all
regular levels complete, all but whole-world mastery, and all 188 quizzes
mastered. Their IDs begin with `test-`, so importing the file again safely
merges the same profiles instead of creating duplicates. Because imports never
reduce progress, delete the existing `Test · …` profiles before re-importing if
you want to restore their original baseline after playing them.

Regenerate the file after changing the curriculum with:

```sh
node tools/generate_test_profiles_backup.js
```

## Friend challenges

Curriculum quiz results can be shared as version 2 deterministic friend
challenges. The recipe identifies the stable quiz and revision, plus the score
to beat and a casual-tamper proof:

`?cv=2&quiz=pack-nordics%3Acountry-flag&rev=1&score=5&proof=U5VCUGVvI7k`

Valid current-revision curriculum challenges record normal progress for the
active profile. They never include transferable profile data.

The recipe fixes the quiz identity and revision. Each attempt keeps the same
alternatives while shuffling question and answer order from its own attempt
identifier. The proof detects casual edits to the public score fields, but it
is not authentication: this is a static site and a determined person can
recreate a valid proof. An invalid or missing score proof removes the score to
beat but does not prevent the curriculum quiz from being played.

The home screen offers **Open challenge** so installed-app users can paste a
complete challenge URL when external-link capture is unavailable. Run the
version 2 challenge tests with:

```sh
node tests/challenge.test.js
```

## Files

- `index.html` – document shell and default metadata
- `manifest.webmanifest` and `icons/` – installable web-app metadata and icons
- `styles/` – presentation split into base, quiz, Explore, flashcard, and
  responsive stylesheets
- `countries.js` – bilingual country and region data
- `curriculum.js` – the 47 ordered levels, 188 quizzes, stable identities and
  deterministic curriculum attempt construction
- `progress.js` – local profiles, progress derivation, persistence, transfer,
  backup and safe merging
- `explore-state.js` – session-only Explore scope and geographic map-extent rules
- `fixtures/test-profiles-backup.json` – importable browser test profiles ranging
  from brand new to every level mastered; regenerate it with
  `node tools/generate_test_profiles_backup.js`
- `world-map.js` – local projected map data derived from Natural Earth
- `MAP-DATA.md` – map-data verification and update procedure
- `tools/` – machine-readable map manifest and dependency-free maintenance tools
- `app.js` – application state, rendering, localization and interaction
  orchestration
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
areas in separate, independently scaled frames when enlarged. These relocation
frames preserve approximate compass direction and ordering, not exact distance
or scale. A true zoom inset instead includes a source rectangle and connector
lines. This affects the silhouette only, not any quiz or Explore map.
Dispersed island states can use representative extent dots in the compact view
and reveal their geographically positioned polygon geometry when enlarged.
Frames are unlabelled. Enlarged silhouettes mark each listed capital with a
small five-pointed star; compact silhouettes and regional maps do not. Monaco
and Vatican City are explicit exceptions because each capital is effectively
coextensive with its city-state. Capital coordinates come from Natural Earth
1:10m Populated Places with documented editorial overrides. Cyprus and Somalia
are the silhouettes whose enlarged views add a dashed internal division guide.
Cyprus follows the UN buffer zone, while Somalia's guide follows the shared
Natural Earth boundary with Somaliland.

Explore reuses the same regional azimuthal equidistant maps and
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
at its normal scale. The Explore workspace itself stays within the viewport;
only its country list scrolls. The selected-country label below the map opens
the large flag, while the region/count control opens the interactive world-map
region picker. Flashcards use exactly the countries visible in the list.

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
Somaliland is included in Somalia's regional geometry and silhouette as a
pedagogical de jure country outline, while the enlarged silhouette retains its
de facto separation as a dashed guide. This combines Natural Earth's
[de facto boundary policy](https://www.naturalearthdata.com/about/disputed-boundaries-policy/)
with the UN Security Council's reaffirmation of Somalia's sovereignty,
territorial integrity, and unity in
[resolution 2809 (2025)](https://digitallibrary.un.org/record/4096834?ln=en).
On the front-page world map, the existing Somaliland and Northern Cyprus
context polygons are assigned to Somalia and Cyprus respectively without
reprojecting or altering any other world geometry.
