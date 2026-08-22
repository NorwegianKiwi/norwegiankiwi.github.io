# Hello World! progression game — technical specification

**Status:** Draft for owner approval  
**Companion specifications:** `PRODUCT-SPEC.md`, `CURRICULUM.md`  
**Purpose:** Define storage, identity, compatibility, data ownership and
implementation boundaries for the progression redesign.

This specification describes target behaviour. It does not require all code to
remain in the current files or prescribe incidental CSS structure.

## 1. Existing constraints to preserve

The application is currently:

- A static browser application
- Usable without a build process
- Free of third-party runtime packages
- Backed by local country, flag and map data
- Available in Norwegian and English
- Installable as an online-only web app
- Hostable on an ordinary static web server

The progression implementation should preserve this deployment model unless a
separate decision explicitly changes it. Local progress and transfer must not
require a server, database or account.

## 2. Sources of truth

The implementation should maintain clear boundaries:

- `countries.js`: country names, capitals, notes and primary regions
- `distractors.js`: curated flag relationships and visual conflicts
- `world-map.js`: regional maps and country silhouettes
- A new curriculum data module: ordered levels, stable IDs, revisions, country
  sets, modes, seeds and alternative counts
- A new progress module: profiles, persistence, migrations, import/export,
  merging and Continue selection
- `challenge.js`: isolated legacy version 1 friend-challenge recipe plus the
  explicitly versioned curriculum challenge recipe
- `app.js`: application state, rendering and interaction orchestration

The exact filenames for new modules may change, but curriculum and progress
logic should not be buried as unrelated constants throughout `app.js`.

## 3. Curriculum data model

The runtime curriculum is ordered. Each level should have this conceptual
shape:

```js
{
  id: "pack-nordics",
  titleKey: "levelNordics",
  kind: "pack", // "pack", "tour", "regional-mastery", "world-mastery"
  countryCodes: ["no", "se", "dk", "fi", "is"],
  quizzes: [
    {
      id: "pack-nordics:country-flag",
      revision: 1,
      mode: "country-flag",
      seed: "...",
      choiceCount: 3
    }
  ]
}
```

Requirements:

- Level and quiz IDs are stable, unique and independent of displayed order.
- IDs are language-independent.
- Each level has exactly four quizzes, one for each canonical mode.
- Each quiz revision is a positive integer.
- Every quiz seed is fixed and language-independent.
- Every referenced country code exists in `countries.js`.
- Every systematic pack country appears in exactly one systematic pack.
- World Tour repetition is intentional and allowed.
- Regional mastery sets exactly match the current primary-region membership.
- World mastery contains all 196 countries.
- Displayed order is array order, not an encoded numeric prefix in the stable
  ID.

The initial definitions must match `CURRICULUM.md`.

## 4. Deterministic quiz construction

Curriculum quizzes and legacy friend challenges are distinct recipes.

For a curriculum quiz revision:

- The target country set is fixed.
- The set of alternatives for each target is fixed by definition or by a
  stable seeded recipe.
- Alternative membership must not change across attempts of that revision.
- Target question order is shuffled for each attempt.
- Alternative positions are shuffled for each attempt.
- Regular pack and World Tour alternatives are restricted to that level's
  country set.
- Regional mastery alternatives are restricted to the region, except for an
  explicitly documented curated flag-conflict rule if needed.
- World mastery alternatives may use all countries.

If a generator change materially changes question difficulty or alternative
membership, affected curriculum quiz revisions must be incremented. There is no
requirement to keep an old curriculum revision playable; its historical score
may remain stored but is not treated as current mastery.

Legacy challenge version 1 remains isolated from curriculum construction. It
should be preserved while inexpensive, but the progression architecture must
not be distorted solely to retain legacy challenge UI.

## 5. Persistent storage

Progress is stored in `localStorage`. Use one namespaced root key, provisionally:

```text
hello-world-progress
```

The stored root object should have a versioned schema:

```js
{
  schemaVersion: 1,
  activeProfileId: "generated-profile-id",
  profiles: {
    "generated-profile-id": {
      id: "generated-profile-id",
      name: "Player 1",
      createdAt: "2026-08-22T10:00:00.000Z",
      updatedAt: "2026-08-22T10:30:00.000Z",
      lastQuizId: "pack-nordics:country-flag",
      savedMasteryAttempt: null,
      quizProgress: {
        "pack-nordics:country-flag": {
          revision: 1,
          bestScore: 5,
          total: 5,
          lastPlayedAt: "2026-08-22T10:30:00.000Z"
        }
      }
    }
  }
}
```

The exact serialized representation may be more compact, but its semantics must
remain equivalent.

### Storage rules

- Profile IDs are generated locally and are not display names.
- Profile names are plain local labels, not accounts.
- Best score never decreases.
- Mastery is derived from the current quiz revision having
  `bestScore === total`; it should not be stored as a second contradictory
  boolean.
- A record for an older revision does not master the current revision.
- Invalid, malformed or oversized stored data must fail safely and must not
  prevent Explore from opening.
- Writes should occur after a scored quiz result and after profile/settings
  changes. Saving after every answer is unnecessary for ordinary short quizzes.
- Regional and world mastery attempts are exceptional: save their active
  attempt after every answer so they can resume after reload or browser closure.
- A default **Player 1** profile is created automatically when no valid profile
  exists. Initial play is not blocked by a naming form.

## 6. Schema migration and recovery

- Every persisted or transferred payload has a schema version.
- Load functions validate before normalising or migrating data.
- Migrations are explicit functions from one known schema version to the next.
- Unknown future schema versions are not imported as if understood.
- A storage failure should surface a concise, localised warning and leave the
  app usable without persistence.
- Clearing progress removes quiz records for one profile but retains its ID,
  name and active selection.
- Deleting a profile removes that profile. If it was active, another profile is
  selected or a default profile is created.
- No migration from session-only historical quiz results is needed because the
  current application has no persistent result records.

## 7. Derived progress state

For each current quiz definition:

- **Unplayed:** no record matching its current revision
- **Played:** a current-revision record exists and `bestScore < total`
- **Mastered:** a current-revision record exists and `bestScore === total`

For each level:

- Mastered quiz count is derived from its four current quiz definitions.
- The level is mastered only when all four are mastered.
- A level is unplayed when none of its current quizzes has a current-revision
  record.
- A level shows an unread dot when unplayed. Newly added or revised quizzes may
  also make previously complete content visibly ready to play again.

Global counts shown during import or profile summaries are derived rather than
stored.

## 8. Continue algorithm

Given the active profile and ordered curriculum:

1. Resolve `lastQuizId` against the current curriculum.
2. If it exists and its current revision is not mastered, return it.
3. Otherwise return the first current quiz in curriculum order that is not
   mastered.
4. If none exists, return an explicit `all-mastered` outcome whose primary
   action selects a surprise mastered quiz that has not been played recently.

If a stored `lastQuizId` no longer exists, ignore it without deleting unrelated
progress.

After a perfect result, the result screen's Next Quiz uses the first subsequent
unmastered quiz, wrapping to the first unmastered quiz only when necessary.
After a non-perfect result, Try Again starts the same quiz revision.

## 9. Recording a result

Result recording is a pure update:

1. Validate the profile, quiz ID, revision, score and total.
2. Ignore or reject scores outside `0..total`.
3. If there is no current-revision record, create one.
4. If there is one, store `max(existing.bestScore, newScore)`.
5. Update `lastPlayedAt`, profile `updatedAt` and `lastQuizId`.
6. Persist the validated root object.

Friend-challenge results must not update curriculum progress unless the
challenge explicitly identifies and faithfully reproduces a current curriculum
quiz revision. Legacy version 1 regional challenges do not meet that condition.

## 10. Saved mastery attempts

Each profile may have at most one saved regional or world mastery attempt.
Ordinary short quizzes are not persisted mid-attempt.

A saved attempt contains only the state necessary to reproduce and continue the
same immutable attempt, conceptually:

```js
{
  quizId: "mastery-whole-world:country-capital",
  revision: 1,
  attemptSeed: "...",
  questionIndex: 137,
  score: 134,
  answers: [
    { targetCode: "no", selectedCode: "no", correct: true }
  ],
  correctionPending: null,
  startedAt: "2026-08-22T10:00:00.000Z",
  updatedAt: "2026-08-22T10:20:00.000Z"
}
```

The exact representation may use a deterministic attempt seed instead of
storing complete order arrays, provided it reconstructs identical question and
answer positions.

Rules:

- Save immediately after an answer and after correction-state changes.
- Resuming never permits changing a previous answer.
- Language changes do not invalidate an attempt because stored identities are
  language-independent.
- Starting another scored quiz while an attempt exists requires explicit
  confirmation; confirmation deletes the saved attempt.
- Completing the attempt records its best result and removes the saved attempt.
- Saved attempts are local operational state and are excluded from profile
  transfer links and backup imports.

## 11. Transfer and export format

The primary transfer mechanism is a link containing a versioned payload in the
URL fragment:

```text
https://host.example/geografi/#progress=<versioned-base64url-payload>
```

Requirements:

- The fragment is used so the static host does not receive the progress payload
  as part of the HTTP request.
- The payload contains one profile for the primary transfer flow.
- The payload includes schema/transfer version, profile identity and name, quiz
  IDs, revisions and best scores.
- It must not contain browsing history or unrelated application state.
- Encoding must be URL-safe and include an integrity check or checksum for
  accidental truncation/corruption. It is not authentication or encryption.
- The transfer decoder enforces a conservative maximum payload size before
  parsing or allocating large structures.
- Invalid payloads show a localised explanation and do not alter storage.
- The fragment should be removed or replaced after import/cancel so refreshing
  does not repeatedly prompt.

The exact compact encoding is an implementation decision. Prefer a
dependency-free, versioned encoding that keeps a fully mastered profile within
practical messaging-app URL lengths. Human-readable JSON is acceptable for the
advanced file backup but should not be exposed as the primary UX terminology.

## 12. Import preview and merge

Nothing is written until the player chooses **Create profile** or **Merge** in
the import preview.

### Create profile

- Preserve the imported profile ID unless it collides with an unrelated local
  profile.
- On collision, offer merge when identity matches; otherwise create a new local
  ID.
- Normalise the imported display name and allow later renaming.

### Merge

For every quiz ID and revision:

- Keep the greater valid best score.
- Never lower or remove an existing current score.
- Preserve records for unknown quiz IDs and old revisions within reasonable
  limits so future/restored content can recognise them.
- Prefer the later valid `lastPlayedAt` only for navigation metadata.
- Repeatedly importing the same payload must be idempotent.

Do not sum attempt counts or answer totals in the initial schema; doing so would
double-count repeated imports. This is why the first progress model stores best
results rather than lifetime statistics.

## 13. Backup file fallback

An advanced **Back up this device** file contains every local profile using the
same validated semantic profile payloads as transfer, with a descriptive
extension or `.json`. Saved active attempts are excluded. Import follows the
same preview and merge rules as a transfer link.

File handling is a fallback, not the primary transfer path. The interface says
**Download backup file** and **Import backup file**, not “export JSON.”

For a multi-profile file, the preview offers **Import all profiles** as the
primary action and an individual Import action for each profile. This avoids a
checkbox-selection workflow while supporting both needs.

## 14. Profile privacy and security model

- Progress is not uploaded automatically.
- There is no cloud identity or hidden account.
- A transfer link is a portable copy, not live synchronisation.
- Anyone who receives a transfer link can import that copied progress.
- The profile name may be included in a transfer preview, so the UI should not
  encourage entering sensitive personal information.
- Import data is untrusted input and must be validated just like network data.
- No secret key is embedded in client code to pretend that static data is
  authenticated.

## 15. URL state and routing

- `?lang=en` continues to select English; Norwegian remains the default.
- Explore may continue to use `region` in the query string.
- Transfer data uses the fragment so it does not conflict with query-based
  friend challenges.
- Valid legacy challenge query strings retain their existing behaviour while
  the best-effort version 1 reader remains present.
- Internal result-preview parameters remain testing conveniences and must not
  create stored progress.
- Ordinary curriculum navigation need not expose active progress in the URL.

## 16. Sharing and friend challenges

Curriculum quiz sharing ships with the progression release. Use a new recipe
version, conceptually:

```text
?cv=2&quiz=pack-nordics%3Acountry-flag&rev=1&score=5&proof=...
```

The canonical field names may be tuned, but the recipe must identify:

- Stable quiz ID
- Quiz revision
- Score to beat
- A casual-tamper score proof if score comparison is displayed

The curriculum definition supplies the fixed countries and alternatives, so a
separate random country seed is unnecessary. A valid current-revision challenge
result records normal curriculum progress for the active profile. Since a
default Player 1 is created automatically, first-time challenge visitors can
play and save without an onboarding form.

The shared message includes quiz title, mode, score, approximate time and a
direct link. It must not contain profile-transfer data.

Progress sharing is separate: generate a concise text achievement such as
levels/quizzes mastered plus the ordinary game URL. It does not encode or grant
access to saved progress.

Version 1 challenge behaviour documented in `README.md` is best-effort legacy
compatibility:

- Existing three- and five-letter seeds remain accepted.
- Existing URLs reproduce their original target order and alternative sets.
- While supported, version 1 seeded generation, score proofs and golden vectors
  remain unchanged.
- The legacy manual-code entry UI may be removed.

Do not retrofit curriculum rules into version 1. Preserve its URL reader when
that remains inexpensive, but do not block or complicate the progression
redesign solely for legacy compatibility. Update `README.md` during
implementation so it no longer promises a stronger contract than the product
owner intends.

## 17. Rendering and state separation

The application should distinguish:

- **Persistent state:** profiles, best results, saved mastery attempts, active
  profile and durable settings
- **Session state:** current screen, active attempt, question index, selected
  answer, modal state and temporary feedback
- **URL state:** language, Explore region, challenge recipe and transfer import

Rendering should derive visible mastery and unread states from curriculum plus
persistent progress. UI elements must not independently mutate stored objects
without going through validated progress functions.

The home progress globe and its numeric label both derive from mastered levels
out of 47. Current-level progress derives from mastered quizzes out of four.
They must not use different hidden denominators.

Explore Flashcards are read-only learning state. Their deck is derived from the
current visible Explore scope, including the all-Africa overview. A card front
uses the flag; its revealed side uses country name, capital and the existing country silhouette.
Missed-country decks are constructed from the completed attempt's wrong-country
codes and do not write quiz progress.

## 18. Tests and validation

At minimum, add automated coverage for:

### Curriculum

- 47 unique ordered level IDs
- Exactly four unique canonical modes per level
- 188 unique quiz IDs
- Valid positive revisions and fixed seeds
- All referenced country codes exist
- Exactly 196 unique systematic-pack assignments
- Exact regional mastery membership
- Exact 196-country world mastery membership
- Choice counts do not exceed valid candidate pools

### Progress

- Empty-store initialisation
- Automatic Player 1 creation without an onboarding form
- Multiple profiles and active-profile recovery
- Best score never decreases
- Mastery derivation by current revision
- Revised quiz becomes unplayed without deleting historical records
- Continue selection in new, partial and fully mastered profiles
- Clear progress versus delete profile
- Malformed storage recovery
- Saved mastery round trip, resume and explicit abandonment

### Transfer

- Encode/decode round trip
- Corruption and size rejection
- Import preview without mutation
- Merge keeps maximum score
- Merge is idempotent
- Unknown IDs and old revisions are safe

### Sharing and compatibility

- Curriculum challenge recipe round trip and current-revision progress recording
- Progress sharing never contains transfer payload data
- Existing challenge version 1 golden vectors while legacy support remains
- Existing language and challenge URL parsing
- Result previews never persist progress
- Explore remains usable if storage is unavailable

Visual and interaction testing must cover phone, tablet and desktop layouts,
keyboard operation, reduced motion, Norwegian and English, and both empty and
heavily completed profiles.

## 19. Suggested implementation sequence

1. Add machine-readable curriculum definitions and validation tests.
2. Add pure progress/profile functions and tests.
3. Add localStorage loading, migration and failure recovery.
4. Adapt quiz construction to fixed curriculum sets without modifying
   challenge version 1.
5. Build the simplified home screen and level overview.
6. Connect result recording, mastery displays and Continue behaviour.
7. Add profile management.
8. Add resumable regional and world mastery attempts.
9. Add transfer-link import preview and merge.
10. Add all-profile backup-file import/export.
11. Add curriculum quiz challenges and progress sharing.
12. Perform responsive, accessibility, bilingual and compatibility regression
    testing.

Implementation should remain incremental and keep the existing Explore surface
working throughout.

## 20. Completion criteria for the progression release

The first progression release is complete when:

- A new player can start Level 1 from the first viewport with one primary click;
  Player 1 is created automatically.
- A returning player can continue the correct quiz from the home screen.
- All 188 quizzes can be selected directly and record independent best scores.
- Quiz and level mastery are accurately derived and displayed.
- Multiple local profiles remain separated.
- Clear progress works for one profile without affecting others.
- A profile can be transferred by link and safely merged on another device.
- A device backup can restore all profiles or selected individual profiles.
- Regional and world mastery attempts resume without allowing answer changes.
- Explore opens to a viewport-fitted regional map and internally scrolling
  country list, with no document-level scrolling.
- Explore includes unscored Flashcards, and missed-country card review returns to the
  result flow.
- All 196 countries are covered as specified.
- Curriculum quiz challenges open directly and record valid current progress.
- Progress achievements can be shared without exposing transferable progress.
- Legacy version 1 links remain supported when preservation is inexpensive.
- The application remains static, bilingual and dependency-free at runtime.

## 21. Remaining implementation choices

The following should be decided before their implementation step:

1. The exact compact transfer encoding and checksum.
2. The exact version 2 challenge parameter names and score-proof message.
3. Whether the current single `app.js` is split further during the redesign or
   only the new curriculum/progress domains are extracted.
