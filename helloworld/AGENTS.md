# Repository Engineering Guide

This file is the authoritative guide for maintaining and refactoring Hello World!. It applies to human contributors and coding agents working anywhere in this repository.

## Preserve the product contract

- Keep the application static, dependency-free at runtime, and usable by opening `index.html` directly. Do not introduce a required build step, framework, server, database, or account system without an explicit product decision.
- Treat refactors as behavior-preserving. If a cleanup exposes a bug, reproduce it, add a regression test where practical, and describe the behavior change separately.
- Preserve stable curriculum and quiz IDs, quiz revisions, URL parameters, the `hello-world-progress` storage schema, backup/transfer formats, and challenge recipes unless a planned migration explicitly changes them.
- Maintain Norwegian and English together. Every interface translation key, country name, capital, note, civic-centre role, and user-facing error must be complete in both locales.
- Preserve accessibility behavior: semantic controls, keyboard operation, focus restoration, dialog trapping, live announcements, reduced motion, and visible text alternatives are part of the feature contract.

## Architecture and sources of truth

- `countries.js` owns learnable places, localized geography data, relationships, civic centres, and primary regions.
- `curriculum.js` owns ordered levels, stable quiz definitions, fixed alternative sets, and deterministic attempt construction.
- `progress.js` owns profiles, persistence, progress derivation, transfer, backup, merging, and saved mastery attempts.
- `navigation.js`, `challenge.js`, `explore-state.js`, `localization.js`, and `map-view.js` are small dependency-free domain modules usable in both browsers and Node tests.
- `app.js` owns browser state, rendering orchestration, lifecycle, and event delegation. Extract code only when it forms a cohesive boundary with a small, explicit interface; do not split code solely to meet a line-count target.
- `world-map.js` and `fixtures/test-profiles-backup.json` are generated artifacts. Never edit them by hand.
- Feature CSS belongs in `base.css`, `progression.css`, `quiz.css`, `results.css`, `explore.css`, or `flashcards.css`. Keep responsive rules with their feature and keep `test-menu.css` standalone.

## Code and CSS practices

- Prefer plain JavaScript, explicit data flow, small pure functions, early returns, and names that describe domain intent.
- Share logic when the rule is stable and genuinely common. A little local duplication is preferable to an abstraction that couples unrelated screens or hides simple behavior.
- Keep browser-only effects at the application boundary. Pure calculations and validation belong in domain modules and should have Node tests.
- Escape dynamic HTML, validate external or persisted input before normalization, and fail safely when storage or optional browser APIs are unavailable.
- Keep selectors feature-scoped. Before deleting a selector, check template strings and dynamically constructed classes as well as literal HTML.
- Preserve responsive cascade intent and verify layout after moving rules; a brace-balanced stylesheet is not sufficient evidence.
- Do not add third-party runtime or development dependencies for tasks supported by browser APIs, Node built-ins, or the Python standard library.

## Verification

Run the canonical automated checks from the repository root:

```sh
python3 tools/check.py
```

For rendering or interaction changes, also test `index.html` and `test.html` directly and through a local static server. Cover representative desktop, tablet, portrait-phone, and short-landscape viewports; both locales; keyboard navigation; reduced motion; and affected dialogs or result states. There must be no unexpected console errors or horizontal overflow.

Regenerate intentional artifacts only with their documented tools:

```sh
node tools/generate_test_profiles_backup.js
python3 tools/generate_map_data.py --help
```

Read `MAP-DATA.md` before changing maps. A generated candidate must pass automated validation and visual review before replacing `world-map.js`.

## Documentation hygiene

- Keep `README.md` concise and operational.
- Keep product behavior in `PRODUCT-SPEC.md`, technical contracts in `TECHNICAL-SPEC.md`, curriculum content in `CURRICULUM.md`, and map-generation procedures in `MAP-DATA.md`.
- Update documentation in the same change as the behavior, interface, data, or maintenance command it describes. Remove obsolete plans rather than leaving contradictory historical instructions in current documents.
