# Hello World!

A static, bilingual geography progression game covering 197 countries and 30
other places in 58 levels and 232 fixed single-mode quizzes. It includes local
profiles, best scores, resumable mastery challenges, progress transfer and
backup, an Explore workspace, and flashcards.

The application has no runtime dependencies, installation step, or build
process. Open `index.html` directly in a browser or serve this directory with
any static web server.

## Using the application

The interface is available in Norwegian and English. The selected language,
stable screen, and Explore scope are represented in the query string so browser
Back/Forward and reload work within the application. Examples:

- `?lang=en` — English
- `?view=levels&level=pack-nordics` — Levels with one level expanded
- `?view=explore&region=europe` — Explore Europe
- `?view=quiz&id=pack-nordics%3Acountry-flag&source=levels` — a curriculum quiz
- `?view=cards&source=level&level=pack-nordics` — level flashcards

Reloading a quiz or flashcard deck restarts that activity. Progress is stored
locally under the versioned `hello-world-progress` key. Quiz reviews, card
position, selected countries, map zoom, and open dialogs remain session-only.
First use creates Player 1 automatically.

The hosted site can be installed as an online-only web app. Use **Add to Home
Screen** or **Install app** in the browser. The installed application still
requires a network connection to the hosted site. The compact in-page install
action is limited to eligible phones and tablets; desktop browsers keep their
own installation controls.

Challenge links, profile-transfer links, and ordinary invitations can be
pasted into **Open shared link** on Home. This is the reliable way to use a
transfer link in an installed app when tapping it opens a browser instead. A
transfer previews one profile before anything is written. **Import backup
file** previews a saved file containing every profile from another device.

## Development and verification

Development requires a current Node.js release and Python 3, but no package
installation. Run the complete maintenance suite from the repository root:

```sh
python3 tools/check.py
```

This runs all JavaScript unit tests, country/flag/map validation, generated
fixture checks, and repository-hygiene checks.

Open `test.html` for the unlinked manual preview catalog. It contains result,
celebration, replay, one-question, out-of-order progression, and final-completion
states in both languages. Preview progress is temporary and never changes saved
profiles.

Import `fixtures/test-profiles-backup.json` through **Settings → Import backup
file → Import all profiles** to add reusable browser test profiles ranging from
a new player to full mastery. Regenerate the fixture after an intentional
curriculum change:

```sh
node tools/generate_test_profiles_backup.js
```

The project’s coding, refactoring, accessibility, and documentation rules are
in [AGENTS.md](AGENTS.md).

## Project structure

- `index.html`, `manifest.webmanifest`, and `icons/` — document shell and
  installable-app metadata
- `app.js` — browser state, rendering orchestration, lifecycle, and events
- `localization.js` — bilingual interface catalogs and interpolation
- `countries.js` — localized place, relationship, civic-centre, and region data
- `curriculum.js` — ordered levels, stable quizzes, and deterministic attempts
- `progress.js` — profiles, persistence, transfer, backup, and progress rules
- `navigation.js`, `challenge.js`, `shared-link.js`, and `sharing.js` — stable
  routes, friend challenges, pasted-link classification, and email drafts
- `explore-state.js` and `map-view.js` — pure Explore scope and map viewport
  calculations
- `world-map.js` — generated Natural Earth map and silhouette data
- `styles/` — shared and feature-owned CSS
- `tests/` — dependency-free Node tests
- `test.html` and `test-menu.js` — standalone manual preview catalog
- `tools/` — unified checks, map maintenance/generation, and test-profile
  generation
- `flags/` and `licenses/` — local assets and their source/licence records

## Product and maintenance documentation

- [PRODUCT-SPEC.md](PRODUCT-SPEC.md) — current product behavior and boundaries
- [TECHNICAL-SPEC.md](TECHNICAL-SPEC.md) — storage, identity, routing, and
  compatibility contracts
- [CURRICULUM.md](CURRICULUM.md) — the complete ordered learning journey
- [MAP-DATA.md](MAP-DATA.md) — authoritative map sources, validation, generation,
  and visual-review procedure
- [flags/README.md](flags/README.md) — flag provenance and update procedure

## Friend challenges

Curriculum results can be shared as deterministic version 2 challenge URLs. The
recipe contains the stable quiz ID and revision, score to beat, and a
casual-tamper proof. Valid current-revision challenges record normal progress;
they never contain transferable profile data. The proof is not authentication,
because all code and inputs are public in this static application.

Milestone and World Master celebrations provide **Share my progress**. Browsers
with a native Share menu use it; other browsers open an in-game choice to launch
a prepared email draft or explicitly copy the complete message. Challenge
sharing follows the same rule. **Copy transfer link** remains the explicit way
to copy a private progress payload.
Native sharing and email use the same explanatory copy; a customised profile
name identifies the sender, while the default **Player 1** name is omitted.
All invitation, challenge, and transfer links use the canonical deployment at
`https://lanceolav.com/helloworld/`, including when testing from `file://` or
localhost.

## Data and licences

The application uses 227 local 4:3 SVG flags. Most come from
[flag-icons](https://github.com/lipis/flag-icons) under the MIT License; local
representative flags have individual source records in
`licenses/local-flags.txt`.

World, regional, and silhouette geometry is generated from pinned Natural Earth
datasets. Natural Earth data is public domain. Exact versions, URLs, checksums,
projection settings, and editorial overrides are stored in
`tools/map-sources.json`; see [MAP-DATA.md](MAP-DATA.md) before updating it.

The globe graphic is Twemoji’s Globe showing Europe–Africa, used unchanged under
CC BY 4.0. Local licence copies are stored in `licenses/`.
