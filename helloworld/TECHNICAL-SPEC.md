# Hello World! progression game — technical specification

**Status:** Current implementation contract
**Companion specifications:** `PRODUCT-SPEC.md`, `CURRICULUM.md`
**Purpose:** Define storage, identity, compatibility, data ownership and
implementation boundaries for the progression system.

This specification describes the current behavior and compatibility contract. It does not require code to remain in particular files or prescribe incidental CSS structure.

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

The product has not yet been published. The current schemas and URL recipes are
versioned for validation, but no obsolete pre-release shape requires migration
or compatibility handling.

## 2. Sources of truth

The implementation should maintain clear boundaries:

- `countries.js`: country names, capitals, notes and primary regions
- `world-map.js`: regional maps and country silhouettes
- `curriculum.js`: ordered levels, stable IDs, revisions, country sets, modes,
  seeds, alternative counts, and fixed visual-conflict rules
- `progress.js`: profiles, persistence, validation, import/export, merging and
  Continue selection
- `challenge.js`: the explicitly versioned curriculum challenge recipe
- `shared-link.js`: extraction and classification of pasted app links/messages
- `sharing.js`: dependency-free construction of encoded email draft URLs
- `localization.js`: complete bilingual interface catalogs and interpolation
- `map-view.js`: pure map viewport, zoom, pan and coordinate calculations
- `app.js`: application state, rendering and interaction orchestration

Curriculum and progress logic must remain outside the browser orchestration in
`app.js`.

## 3. Curriculum data model

The runtime curriculum is ordered. Each level should have this conceptual
shape:

```js
{
  id: "pack-nordics",
  titleKey: "levelNordics",
  kind: "pack", // "pack", "tour", "regional-mastery", "world-mastery"
  countryCodes: ["no", "se", "dk", "fi", "is"],
  region: null,             // one primary region for a regional challenge
  regions: null,            // primary-region union for a composite challenge
  sourcePackIds: null,      // systematic-pack union for a review challenge
  category: null,           // category selector for a world challenge
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
- World masteries contain exactly 197 countries, 30 other places, and all 227
  places respectively.
- Displayed order is array order, not an encoded numeric prefix in the stable
  ID.

The initial definitions must match `CURRICULUM.md`.

## 4. Deterministic quiz construction

Curriculum quizzes and version 2 friend challenges share the current
curriculum identity and deterministic attempt construction.

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

## 5. Persistent storage

Progress is stored in `localStorage`. The namespaced root key is:

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

## 6. Schema validation and recovery

- Every persisted or transferred payload has a schema version.
- Load functions validate before normalising data.
- Unknown future schema versions are not imported as if understood.
- A future schema change must add an explicit migration when that version is
  introduced; the initial version has no pre-release formats to preserve.
- A storage failure should surface a concise, localised warning and leave the
  app usable without persistence.
- Clearing progress removes quiz records for one profile but retains its ID,
  name and active selection.
- Deleting a profile removes that profile. If it was active, another profile is
  selected or a default profile is created.

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

1. Return the saved attempt's quiz if it belongs to a regional or world mastery
   level and its ID and revision match the current curriculum.
2. Resolve `lastQuizId` against the current curriculum. Search from the following
   quiz for the first unmastered current revision, wrapping once. The previous
   quiz is eligible only after all others have been considered.
3. If `lastQuizId` is missing or unknown, search from the first quiz.
4. If none exists, return `all-mastered`; the primary action selects a surprise
   mastered quiz that has not been played recently.

The existing `{ type: "quiz", quiz }` / `{ type: "all-mastered" }` interface and
storage schema remain unchanged. `lastQuizId` advances only on result recording.
Stale saved attempts and unknown last-quiz IDs do not delete unrelated progress.
Levels uses this same selection for its recommendation. Completion recognition
uses mastery totals rather than the continuation outcome.

Results independently use the forward unmastered search after the completed
quiz, excluding the current quiz from the offered Next action. They do not
prioritize a paused mastery attempt. Results render only two Next layouts:
same-level destinations use Next: {mode} without destination text above;
different-level destinations use one taller semantic button with a centered
badge and level-name row followed by Next: {mode} and its arrow. The badge
appears once, and no standalone heading or divider is rendered. Both rows have
explicit text sizes, with the level name slightly stronger. Skips and wraps use
the same layouts as immediate successors.
Accessible button names always identify the destination's level and mode.
Try Again remains primary after non-perfect results;
celebrations retain precedence after perfect results.

## 9. Recording a result

Result recording is a pure update:

1. Validate the profile, quiz ID, revision, score and total.
2. Ignore or reject scores outside `0..total`.
3. If there is no current-revision record, create one.
4. If there is one, store `max(existing.bestScore, newScore)`.
5. Update `lastPlayedAt`, profile `updatedAt` and `lastQuizId`.
6. Persist the validated root object.

Friend-challenge results update curriculum progress only when the challenge
identifies and faithfully reproduces a current curriculum quiz revision.

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
- Starting the same current quiz ID and revision resumes the saved attempt
  directly. Starting any other scored quiz, including short quizzes and shared
  challenges, passes through the same accessible confirmation guard. Explicitly
  starting a fresh challenge round also requires confirmation when an attempt
  is saved. Confirmation clears only the unfinished attempt before starting the
  selected quiz; dismissal preserves it and restores focus. Explore and
  flashcards do not clear saved attempts. Home Continue keeps saved-attempt
  priority without displaying an answered count.
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

A single-profile preview has no redundant row-level Import action. If the
stable ID already exists, the primary action clearly updates that profile; if
it is new, the primary action creates it. Explicit merge targets exclude the
matching-ID profile. Multi-profile imports retain Import all and per-profile
Import actions.

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
- Stable routes use `view=levels|explore|quiz|cards`, with validated stable IDs
  and a quiz/card source where needed. Home has no `view` parameter.
- Level expansion is encoded with `level`; quiz identity uses `id` so it cannot
  conflict with the friend-challenge `quiz` field.
- Screen transitions push browser history. Changes within a screen replace the
  current entry or remain session-only. Popstate reconstructs the destination
  from the validated route.
- Transfer data uses the fragment so it does not conflict with query-based
  friend challenges.
- Only the version 2 curriculum challenge query shape is accepted.
- Internal result-preview parameters remain testing conveniences and must not
  create stored progress.
- Ordinary curriculum routes expose quiz identity and launch source, but never
  answers, score, question position or attempt seed.
- **Open shared link** accepts a bare URL or text containing exactly one URL,
  requires the current origin and normalised app path, and classifies a current
  challenge, `#progress` transfer or ordinary Home invitation. Challenge query
  fields retain precedence if a link also contains a transfer fragment.

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

The shared challenge includes quiz title, mode, score, approximate time and a
direct link. It must not contain profile-transfer data. Milestone celebration
sharing names the earned stage and level range; World Master sharing states the
58-level and 232-quiz completion. Both use the ordinary game URL and do not
encode or grant access to saved progress.

Native `navigator.share` is used when available. Otherwise an accessible modal
offers explicit controls to open the prepared `mailto:` subject/body or copy the
complete title, explanation, call to action and URL. Native cancellation is not
an error. A missing or blocked email handler cannot be detected; the copy action
provides a handler-independent alternative without silently changing behaviour.
The fallback dialog uses the initiating action label as its accessible title,
has no capability-explanation copy, and closes with a top-corner close button.

Both channels derive from one share payload containing `title`, explanatory
`text` and `url`. The email subject equals the native title; its body contains
the same text, a localised call to action and the same URL. A profile name is
included only when its normalised value is not the default `Player 1` placeholder.
Challenge result screens prepare the signed URL and share payload before enabling
the share control, so native sharing and fallback-dialog opening begin inside the
player's click rather than after an asynchronous proof calculation.

`sharing.PUBLIC_APP_URL` is the single canonical base for generated invitation,
challenge, and transfer links: `https://lanceolav.com/helloworld/`. The shared-link
classifier accepts that origin and normalised path. Local `file://` and localhost
copies may additionally recognize their own path for development, while an HTTP(S)
copy on another origin does not become an accepted production link source.

Custom install UI is shown only on eligible mobile/tablet HTTP(S) visits and is
hidden in standalone mode. iOS receives manual Safari guidance; Chromium mobile
requires an actionable `beforeinstallprompt`. Desktop install events are not
cancelled so browser-owned installation UI remains available.

## 17. Rendering and state separation

The application should distinguish:

- **Persistent state:** profiles, best results, saved mastery attempts, active
  profile and durable settings
- **Session state:** active attempt, question index, selected answer, result
  review, modal state, map interaction and temporary feedback
- **URL state:** stable screen/content identity, launch source, language,
  Explore region, challenge recipe and transfer import

Rendering should derive visible mastery and unread states from curriculum plus
persistent progress. UI elements must not independently mutate stored objects
without going through validated progress functions.

The home progress globe and its numeric label both derive from mastered levels
out of 58. Current-level progress derives from mastered quizzes out of four.
They must not use different hidden denominators.

Explore Flashcards are read-only learning state. Their deck is derived from the
current visible Explore scope. A card front
uses the flag; its revealed side uses country name, capital and the existing country silhouette.
Missed-country decks are constructed from the completed attempt's wrong-country
codes and do not write quiz progress.

Explore may also hold a contextual scope with a localized title, country codes
and a return target. Level scopes are reproducible from their stable level ID;
result-review scopes remain session-only. Map extent is independent of this membership:
the world and detailed regional maps may be traversed while the
scope list remains fixed. Contextual scopes are never persisted as saved lists.

Map-quiz area selection is likewise session-only, but intentionally resets to
the target country's regional extent for every new question. World and Nearby
change only the rendered map geometry and must not alter attempt, answer,
persistence or URL state. Nearby fits the target's regional geometry with
threefold context padding. When that frame exceeds 60% of the regional view,
half of the excess is retained so large countries receive gentle magnification
without changing smaller-country framing. It retains an 8× zoom ceiling and
clamps to the generated regional bleed extent; marker coordinates are the
zero-size fallback.

## 18. Tests and validation

At minimum, add automated coverage for:

### Curriculum

- 58 unique ordered level IDs
- Exactly four unique canonical modes per level
- 232 unique quiz IDs
- Valid positive revisions and fixed seeds
- All referenced country codes exist
- Exactly 227 unique systematic-pack assignments
- Exact pack-union and composite-region mastery membership
- Exact 197-country, 30-other-place, and 227-place world mastery memberships
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

### Sharing and routing

- Curriculum challenge recipe round trip and current-revision progress recording
- Progress sharing never contains transfer payload data
- Existing language and challenge URL parsing
- Stable route round trips, invalid-ID fallback and challenge/import precedence
- Browser Back/Forward and reload behaviour for each stable screen
- Result previews never persist progress
- Explore remains usable if storage is unavailable

Visual and interaction testing must cover phone, tablet and desktop layouts,
keyboard operation, reduced motion, Norwegian and English, and both empty and
heavily completed profiles.

The result section of `test.html` includes both perfect and imperfect results
for immediate successors, skipped quizzes within/across levels, and wrapping.
It also covers the sole remaining unmastered quiz, new and previous records,
mastered replays, and fully mastered profiles. Stage and final celebrations
remain available in their own sections. All previews are temporary and must
leave persisted player progress unchanged.

## 19. Acceptance criteria

The progression system must continue to satisfy these criteria:

- A new player can start Level 1 from the first viewport with one primary click;
  Player 1 is created automatically.
- A returning player can continue the correct quiz from the home screen.
- All 232 quizzes can be selected directly and record independent best scores.
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
- All 227 learnable places are covered as specified.
- Curriculum quiz challenges open directly and record valid current progress.
- Progress achievements can be shared without exposing transferable progress.
- The application remains static, bilingual and dependency-free at runtime.
