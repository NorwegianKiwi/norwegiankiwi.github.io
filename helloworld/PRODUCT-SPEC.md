# Hello World! progression game — product specification

**Status:** Current product contract
**Companion specifications:** `CURRICULUM.md`, `TECHNICAL-SPEC.md`
**Purpose:** Preserve the agreed product decisions and constrain future design
and implementation work.

In this document, **must** describes a settled requirement, **should** describes
the agreed default unless playtesting provides contrary evidence, and **may**
describes an optional later enhancement.

## 1. Product purpose

Hello World! exists to help children and adults want to learn countries, flags,
capitals and maps. Increased use should come from understandable goals, visible
learning, attainable completion and curiosity—not from punishment or
manipulative compulsion.

The product has two equally legitimate uses:

1. **Play:** follow a structured journey of quizzes and mastery challenges.
2. **Explore:** freely investigate countries on the interactive map or in the
   country list.

Explore is not a lesser mode or a reward that must be unlocked. The map is one
of the product's central features and must remain directly accessible.

## 2. Intended audience and defaults

- The primary audience is children and adults, initially with a Nordic and
  European perspective.
- The interface must continue to support Norwegian and English.
- The recommended journey may start with familiar Nordic and European content,
  but all levels remain open to people whose geographic familiarity differs.
- No account, email address, password or personal information is required.
- Progress is private and stored on the device unless the player explicitly
  transfers or exports it.

## 3. Core product model

The game contains:

- **Profiles:** separate local progress for people sharing a device.
- **Levels:** ordered country packs, World Tours and mastery challenges.
- **Quizzes:** one question type and one fixed country set per quiz.
- **Progress:** a best score and mastery state for every quiz.
- **Explore:** the existing interactive maps and country list.

The exact 58-level, 232-quiz journey is defined in `CURRICULUM.md`, which is the
content source of truth.

## 4. Home screen and information hierarchy

The home screen presents two primary actions:

### Continue game

For a new profile, the label is **Start game**. For an existing profile it is
**Continue game** and includes concise context, for example:

> Level 6 · Iberia and the Alps
> Find the flag

Activating it starts the correct quiz immediately; it must not open another
required choice screen.

The Continue card also shows overall and current-level progress:

- A globe that fills with colour in proportion to mastered levels
- An explicit accessible count such as **12 of 58 levels mastered**
- Current-level progress such as **2 of 4 quizzes mastered**

The globe and overall number must represent the same measurement. At 58/58 the
globe becomes fully coloured and may receive a subtle gold completion treatment.
The number remains the authoritative accessible representation; the globe is
never the only progress signal.

### Explore the world

Activating it opens the unified Explore workspace. The regional map and country
list are visible together without page scrolling; only the country list itself
scrolls.

### Secondary actions

The home screen may expose quieter actions for:

- Viewing all levels
- Switching profiles
- Opening settings
- Opening a shared challenge, profile transfer or invitation
- Installing the web app on an eligible phone or tablet

These must not compete visually with Continue game and Explore the world.

On phones, the two primary actions must appear in the first viewport without
requiring the player to scroll through a map or region list.

## 5. Level overview

All levels and quizzes must be open from the beginning. The displayed order is
a recommendation used by Continue, not an unlock gate.

The overview must make these states immediately legible.

### Quiz states

- **Unplayed:** an unread-style dot and no score
- **Played:** the best result, for example `3/5`
- **Mastered:** a perfect result and green checkmark, for example `5/5 ✓`

### Level states

- **Unplayed:** an unread-style dot
- **In progress:** mastered count, for example `2/4 mastered`
- **Mastered:** `4/4` with a trophy and subtle green card background

The unread dot, green quiz checkmarks and level trophies are the primary
collection mechanics. The first version must not add stars, experience points,
currencies, loot, leagues or a large badge system.

The level screen should make the recommended next quiz visually clear while
allowing any other quiz to be selected.

## 6. Continue behaviour

Continue must choose the next action without asking the player to configure a
region, mode or difficulty:

1. Resume a saved regional or world mastery attempt when its quiz ID and
   revision still match the current curriculum.
2. Otherwise, start with the quiz after the most recently completed quiz and
   choose the next unmastered quiz in displayed curriculum order, wrapping to
   the beginning when necessary. Attempted but unmastered quizzes remain eligible.
3. With no previous completed quiz, or an unknown previous quiz ID, choose the
   first unmastered quiz. Leaving a short quiz unfinished does not advance this
   position; short quizzes restart when abandoned.
4. If everything is mastered and no valid saved attempt exists, show
   **Surprise quiz** with **Choose a level** as the secondary action.

The home page has no separate saved-attempt bar or Resume button. The Continue
card shows the destination's level and quiz mode without an answered count.
Answered progress remains visible on Levels and inside the quiz. A saved attempt uses **Continue game** even before the
profile has completed its first quiz. Earned completion recognition remains
based on mastery totals, including while replaying a saved mastery quiz.
Players can choose any quiz from Levels at any time.

## 7. Quiz rules

- A quiz must contain exactly one of the four existing modes:
  - Find the flag (`country-flag`)
  - Name the country (`flag-country`)
  - Find it on the map (`map-country`)
  - Find the capital (`country-capital`)
- Modes must not be mixed within a scored quiz.
- A regular country-pack quiz asks about every country in that pack once.
- A World Tour asks about every country in its tour set once.
- Regional mastery asks about every country in that region once.
- Combined whole-world mastery asks about all 227 places once; separate world
  masteries cover the 197 countries and 30 other places.
- The question countries and available alternatives are fixed for a quiz
  revision.
- Question order and answer positions are shuffled for each attempt.
- Difficulty and alternative counts follow `CURRICULUM.md`.
- Mixed-region map quizzes select the appropriate regional map for each
  question without changing question type.
- Map questions open in a regional view with surrounding geography at normal
  prominence. A World–Region–Nearby scale control also provides global
  orientation and a fitted view of the target's immediate surroundings; each
  new question returns to the regional view. Nearby gently increases
  magnification for large targets without changing the established close
  framing of smaller targets.

The existing corrective learning interaction should remain: after an incorrect
answer, the correct option is clearly identified and the player confirms it
before continuing. The interface should explicitly say what was correct and
how to proceed rather than relying on colour alone.

The interface must not use lives or prevent further play because of mistakes.

Regional and world mastery attempts are resumable. They remain one attempt:
previous answers cannot be changed, and resuming does not reset mistakes.
Ordinary short quizzes restart when abandoned.
On the Levels screen, the matching level and quiz visibly show the saved
question position. Selecting that same quiz resumes it directly. Selecting a
different scored quiz, including a short quiz or shared challenge, opens an
in-app confirmation before the saved attempt is cancelled. Confirming starts
the selected quiz and clears only the unfinished attempt, keeping completed
scores. Dismissing preserves the attempt and restores focus. Explore, flashcards,
home navigation, and interruptions preserve it.

The confirmation uses **Start another quiz?**, **Your unfinished mastery quiz
will be cancelled.**, and **Go back** / **Start quiz**. Norwegian uses
**Starte en annen quiz?**, **Den påbegynte mestringsquizen blir avbrutt.**, and
**Tilbake** / **Start quiz**. It does not show counts or level references.

## 8. Mastery and scores

- A quiz is mastered by answering every question correctly in one attempt.
- A level is mastered when all four of its quizzes are mastered.
- Mastery is intentionally difficult in regional and world challenges.
- The four combined ultimate challenges each require all 227 answers correct in one
  attempt. That attempt may be safely resumed, but previous answers cannot be
  changed.
- A non-perfect best score remains visible, including results such as `200/227`.
- Playing again can improve but never lower the stored best result.
- Time may be shown as session information later, but the first version does
  not rank mastery by speed.

## 9. Result screen

The result screen must minimise decision-making.

After a perfect result:

- A green checkmark recognises quiz mastery. When the result newly completes
  the level, **Level mastered** and the level trophy replace that quiz-level
  heading; the completed quiz remains checked in the level-progress controls.
- Outside milestone and world-completion celebrations, the primary action
  offers the next unmastered quiz after the completed quiz, scanning forward
  and wrapping at the end. It does not redirect to a separately paused mastery
  attempt.
- Every Next action uses **Next: {mode}**. For a destination in another level,
  insert its numbered badge between **Next:** and the mode, and show its badge
  and level name above the button. Same-level destinations have no badge inside
  the button and no destination text above it.
- These two layouts apply equally to immediate successors, skips, and wraps.
  Accessible button names always identify the destination's level and mode.
- **Choose a level** is secondary. If no other unmastered quiz exists, Next is
  hidden and Choose a level becomes primary.
- Replaying the completed quiz remains available through its level-progress
  control rather than a separate **Play again** action.

After a non-perfect result:

- **Try again** is the primary action. When the Next action includes a level
  heading, a subtle divider separates that heading from Try again.
- Next is secondary and uses the same destination search, labels, and visible
  destination as after a perfect result. It is hidden if only the current quiz
  remains unmastered; Try again already offers that quiz.
- **Choose a level** is a visible tertiary action, promoted to secondary when
  no next action is offered.

The result must state whether the quiz was mastered, show the current score and
best score, and show all four quiz modes for the current level as direct,
clickable navigation. Each mode shows whether it is mastered, played but not
mastered, or unplayed; the quiz that produced the result is highlighted. A
newly earned level mastery uses the same trophy as the level overview. Wrong-
answer review may remain available, but must not displace the primary action.

When a result earns a stage milestone, its action uses **Completed**, followed
by the stage icon and localized stage name, rather than a generic milestone
star. **Challenge a friend** remains less prominent than **Choose a level**.

After a non-perfect result, an additional quiet **Review with flashcards**
action opens an optional temporary flashcard deck containing only missed
countries. Leaving or completing that deck returns to the preserved result,
where retry and next-quiz decisions remain available. Card review does not
alter scores or mastery.

Celebration should be proportional: a subtle response for a correct answer,
more visible recognition for quiz mastery, and a distinctive moment for level,
regional or world mastery. Sound must be optional if introduced.

## 10. Profiles

- Multiple local profiles must be supported so people sharing a device do not
  overwrite one another's progress.
- The active profile is remembered; profile selection is not required on every
  visit.
- First use automatically creates **Player 1** and does not interrupt Start with
  a naming prompt. The player can rename it later.
- A profile needs only a local display name and generated visual identity such
  as a coloured initial. Avatar selection is not required.
- The active profile appears as a compact header control.
- Profile management must support add, switch, rename, clear progress and
  delete profile.
- Clear progress keeps the profile but removes its game results after explicit
  confirmation.
- Delete profile is separate and also requires explicit confirmation.

Profile management belongs in a compact menu or settings surface, not in the
main play flow.

## 11. Progress transfer and backup

The active profile menu provides **Transfer this profile**, whose primary action
is **Copy transfer link**. A player should not need to understand files, JSON or
databases. Transfer links contain only the active profile.

Opening a transfer link must show an import preview, for example:

> Import Lance's progress?
> 28 quizzes played · 17 mastered

The recipient can:

- Create it as a new local profile
- Merge it with an existing profile
- Cancel

When an installed app does not receive a tapped web link, the player can copy
the complete link or shared message and paste it into **Open shared link** on
Home. The same entry point recognises friend challenges, profile transfers and
ordinary game invitations while rejecting links for another app or host.

Import must never silently replace or reduce existing progress. Merge keeps the
best current-revision score for each quiz and therefore preserves mastery.

Settings provides **Back up this device**, which downloads one backup containing
all local profiles. Importing a multi-profile backup shows a preview with
**Import all profiles** as the primary action and a smaller Import action beside
each individual profile. Existing profiles are merged and new profiles are
created; nothing is overwritten or reduced.

The interface uses action-oriented labels such as **Download backup file** and
**Import backup file** and does not ask the player to work with “JSON.”

## 12. Explore

- Explore remains available independently of profiles and game progress.
- Explore opens in the unified map-and-list workspace from the home screen.
- Whole world is a selectable workspace with 197 countries and 30 other places,
  alphabetized within their two groups.
- Levels and result review may open contextual country scopes. Level scopes use
  the stable level ID in the URL; result-review scopes remain session-only.
  Neither kind creates a saved list.
- The existing regional map navigation, country selection, zoom, silhouettes,
  capital markers, notes and country list should be preserved.
- The workspace stays within the viewport and exposes region selection, the
  selected country's large flag and region-scoped Flashcards contextually.
- Flashcards launched from Explore contain exactly the countries visible in the
  list and return to the preserved Explore state.
- The selected-country summary belongs with the map, while scope selection and
  Flashcards belong with the list. On mobile these groups stack in that order.
- Geographic map navigation is separate from geometric zoom. World and
  detailed regional extents may be traversed without changing the visible
  country list.
- Flashcards may be opened for a region, a curriculum level, or the missed
  countries from a completed quiz.
- Leaving or completing Flashcards offers one return action to its source:
  Explore, the result screen, or the level overview.
- A card shows the flag on its front. Revealing it shows country name, capital
  and a small map silhouette when that remains visually clear at the available
  size. The silhouette may move below the textual answer on narrow screens; it
  must not make the answer side cluttered.
- Flashcards are unscored and do not create mastery or persistent quiz progress.
- No level or mastery requirement restricts Explore content.
- Explore may later offer a contextual **Quiz me on these countries** action,
  but this is not required for the first progression release.

## 12.1 Navigation and reload behaviour

- Home, Levels, ordinary and level-scoped Explore, curriculum quizzes, and
  reproducible Flashcard decks have stable query-string URLs.
- Browser Back and Forward move between activity screens. Filters, level
  expansion, map interaction, country selection and dialogs do not create
  additional history steps.
- A quiz opened from Levels returns to its containing level. A quiz opened from
  Continue, Surprise Quiz or a friend challenge returns Home. The result screen
  keeps the same source-aware return action.
- Reloading a quiz or Flashcard URL restarts that activity. Existing resumable
  mastery-attempt behaviour takes precedence when a matching saved attempt exists.
- Result review, missed-country decks and result-scoped Explore remain temporary
  session state and fall back to the underlying quiz after a reload.

## 13. Ethical engagement

The product should encourage return through:

- Short achievable quizzes
- Visible personal progress
- Clear unfinished items
- Mastery checkmarks
- Gradual difficulty
- Useful repetition
- Curiosity about real places

The first version must not include:

- Public or global leaderboards
- Comparison against unknown players
- Energy systems or lives
- Punitive loss of access
- Required daily streaks
- Artificial scarcity or countdowns
- Purchases or advertisements

The player competes against their own previous results and the curriculum.

## 14. Accessibility and responsive behaviour

- All existing keyboard and screen-reader support must be preserved or
  improved.
- Correctness must never be communicated by colour alone.
- Interactive targets must remain comfortably usable by children on phones and
  tablets.
- Regional and world mastery attempts are saved after every answer and can
  resume after navigation, reload or browser closure.
- Reopening the matching mastery quiz resumes it directly from its saved
  position. Starting any different scored quiz requires clear in-app confirmation
  that the saved attempt will be cancelled, including short quizzes and shared
  challenges. Completed scores remain intact.
- Motion must respect reduced-motion preferences.
- Norwegian and English must expose the same interface capabilities and
  translation keys.

## 15. Sharing and friend challenges

The redesigned sharing model has two purposes:

### Challenge a friend

From a curriculum quiz result, the player can challenge someone to the same
stable quiz ID and revision with a score to beat. The message states the quiz,
score and approximate time commitment. The recipient opens a simple challenge
introduction and starts without choosing region, mode or difficulty.

Because **Player 1** is created automatically, a first-time challenge visitor
can play immediately and the result can be saved normally. They may rename the
profile later.

### Share my progress

Every earned milestone celebration, including a replay, offers **Share my
progress**. A stage share names the milestone and completed level range. The
World Master celebration shares completion of all 58 levels and 232 quizzes.
Home itself does not show a progress-sharing action.

This shares an invitation to the game, not the transferable profile payload.
Profile transfer remains a separate private action.

Where the Web Share API is available, progress and challenges open the system
share menu. Otherwise an accessible in-game dialog offers **Open email draft**
and **Copy message**. The application cannot detect whether an email handler is
configured or whether the draft is sent. Nothing is copied or opened until the
player chooses the corresponding explicit action. The dialog title matches the
sharing action and it closes through the standard top-corner close control.

Native shares and email drafts use the same recognisable title, explanatory
text and ordinary game or challenge URL. Email uses that title as its subject
and adds only a short localised call to action before the URL. A customised
profile name appears in the title and explanation; the untouched **Player 1**
placeholder is omitted and the copy uses first person instead.

Generated invitation, challenge, and transfer links always target the canonical
public game URL, `https://lanceolav.com/helloworld/`, even when the current copy
is opened from a local file or development server.

Sharing is secondary and must not displace Continue, Try Again or Next Quiz.

## 16. Retained features

- Existing Explore functionality must remain.
- Existing language URLs must remain supported.
- Version 2 curriculum challenge links open directly and record current
  curriculum progress.
- Unsupported challenge versions fail clearly and are never reinterpreted as
  curriculum quizzes.

## 17. Current non-goals

- Cloud storage or cross-device automatic synchronisation
- User accounts, passwords, email or social login
- Public leaderboards
- Mixed-mode scored quizzes
- Typed-answer expert mode
- Classroom administration
- Adaptive spaced-repetition algorithms beyond replay and best scores
- A native mobile application
- Counting repeated perfect completions as additional mastery
- Timed competitive modes

These may be reconsidered after observing actual use.

## 18. Completed-world state

After all 232 quizzes are mastered, the home screen celebrates the retained
achievement rather than suggesting that progress be erased:

> **World mastered**
> 58 of 58 levels · 232 of 232 quizzes

The completed progress globe carries a static trophy badge as an additional
visual celebration; the heading and counts remain the accessible statement of
the achievement.

The primary action is **Surprise quiz**, selecting a mastered quiz that
has not been played recently. **Choose a level** is secondary. Creating another
profile remains available through the profile menu, and Clear progress remains
in Settings behind confirmation.

The current release does not count repeated masteries and does not unlock a timed
mode. Those ideas may be reconsidered after observing real use.

## 19. Quiz revisions in the interface

When a material curriculum revision invalidates current mastery:

- The quiz appears ready to play again with an updated/unread marker.
- It no longer contributes to current level mastery until the new revision is
  mastered.
- Historical best results are retained internally and may appear in a details
  view, but must not compete with the current result in the main level display.
- One concise notice explains that some quizzes were updated.
