# Geography game curriculum — draft 1

This document defines the proposed progression game built on top of the
existing 196-country dataset. It is a product and content specification, not
yet an implementation contract.

## Design principles

- The home screen offers **Continue game** and **Explore the world** as its two
  primary actions.
- Explore opens in the map view. The existing country list remains available
  as a secondary view.
- Every quiz contains exactly one question type. Question types are never mixed
  within a scored quiz.
- All levels and quizzes are always available. The order below is recommended,
  not enforced.
- Continue chooses the first unmastered quiz in curriculum order. If the most
  recently played quiz is not mastered, it is offered first.
- Country-pack quizzes are short and use every country in their level's pack
  once. They therefore contain five to eight questions.
- Recurring **World Tour** levels mix regions, deliberately remain easier, and
  provide previews and spaced review between longer regional stretches.
- A quiz is mastered by answering every question correctly in one attempt.
- A level is mastered when all four quizzes in it are mastered.
- Progress records the best score for each quiz revision.
- The final challenges are intentionally difficult. Regional challenges use
  every country in the region; world challenges use all 196 countries.

## The four quiz modes

Every regular and mastery level contains these four quizzes in this recommended
order:

1. **Find the flag** (`country-flag`) — a country name is shown; choose its flag.
2. **Name the country** (`flag-country`) — a flag is shown; choose the country.
3. **Find it on the map** (`map-country`) — a country is highlighted; choose its name.
4. **Find the capital** (`country-capital`) — a country is shown; choose its capital.

Capital is last because it usually requires recall of a less visible fact than
the flag or location. This ordering can be changed without invalidating quiz
progress because quiz identity does not depend on display position.

## Quiz identity and repeatability

Each level has an order-independent stable ID such as `pack-nordics`. Its
quizzes use compound IDs:

- `pack-nordics:country-flag`
- `pack-nordics:flag-country`
- `pack-nordics:map-country`
- `pack-nordics:country-capital`

Each quiz definition also has an integer `revision`, initially `1`, and a fixed
seed used to select its answer alternatives.

- The countries being tested are fixed.
- The alternative answers offered for each question are fixed by the quiz seed.
- Question order is shuffled for every attempt.
- Answer positions are shuffled for every attempt.
- Regular-level alternatives come from the current country pack, so an
  introductory quiz does not require knowledge of countries not yet introduced.
- Regional mastery alternatives come from the relevant region.
- World mastery alternatives come from all 196 countries.

This keeps attempts equivalent without teaching the player that "Sweden is
always the second button."

## Difficulty curve

Difficulty increases slowly through the recommended journey:

| Curriculum group | Tier | Alternatives per question | Questions per quiz |
|---|---|---:|---:|
| Opening World Tour and first European packs | Introduction | 3 | 5–9 |
| Remaining Europe and mainland Americas | Foundation | 4 | 5–6 |
| Africa and Asia | Explorer | 5 | 5–8 |
| Caribbean and Oceania | Advanced | 6 | 5–7 |
| World Tours 1–2 | Easy mixed review | 3 | 9–10 |
| World Tours 3–5 | Mixed review | 4 | 10–12 |
| Regional mastery | Mastery | 9 for Find the flag; 6 for other modes | Entire region |
| World mastery | Ultimate | 9 for Find the flag; 6 for other modes | 196 |

If a pack contains fewer countries than the configured alternative count, the
alternative count is capped at the pack size. Difficulty can later be tuned per
quiz without changing the curriculum structure. A material difficulty change
increments that quiz's revision.

## Complete journey order

The table below is the actual order used by Continue and the displayed level
numbers. Stable IDs deliberately contain no ordering number, so a future move
does not invalidate progress.

Every country is assigned to exactly one systematic country pack. World Tours
reuse selected countries intentionally for preview and spaced review. They use
the same four single-mode quizzes as every other level, with alternatives drawn
only from the tour's country set.

| Level | Stable level ID | Working title | Countries | Size | Alternatives |
|---:|---|---|---|---:|---:|
| 1 | `tour-hello-world` | Hello, world! | Norway (`no`), United States (`us`), Brazil (`br`), Egypt (`eg`), South Africa (`za`), India (`in`), China (`cn`), Japan (`jp`), Australia (`au`) | 9 | 3 |
| 2 | `pack-nordics` | Nordic countries | Norway (`no`), Sweden (`se`), Denmark (`dk`), Finland (`fi`), Iceland (`is`) | 5 | 3 |
| 3 | `pack-western-europe` | Western Europe | United Kingdom (`gb`), Ireland (`ie`), France (`fr`), Belgium (`be`), Netherlands (`nl`), Luxembourg (`lu`) | 6 | 3 |
| 4 | `tour-world-icons` | More world icons | France (`fr`), Germany (`de`), United Kingdom (`gb`), Italy (`it`), Canada (`ca`), Mexico (`mx`), Argentina (`ar`), Jamaica (`jm`), Türkiye (`tr`), Russia (`ru`) | 10 | 3 |
| 5 | `pack-baltic-neighbours` | Baltic neighbours | Estonia (`ee`), Latvia (`lv`), Lithuania (`lt`), Poland (`pl`), Germany (`de`) | 5 | 4 |
| 6 | `pack-iberia-alps` | Iberia and the Alps | Spain (`es`), Portugal (`pt`), Italy (`it`), Switzerland (`ch`), Austria (`at`), Liechtenstein (`li`) | 6 | 4 |
| 7 | `pack-central-europe` | Central Europe | Czechia (`cz`), Slovakia (`sk`), Hungary (`hu`), Slovenia (`si`), Croatia (`hr`), Bosnia and Herzegovina (`ba`) | 6 | 4 |
| 8 | `pack-balkans` | The Balkans | Serbia (`rs`), Montenegro (`me`), Kosovo (`xk`), Albania (`al`), North Macedonia (`mk`), Bulgaria (`bg`) | 6 | 4 |
| 9 | `pack-eastern-europe` | Eastern and southeastern Europe | Romania (`ro`), Moldova (`md`), Ukraine (`ua`), Belarus (`by`), Greece (`gr`) | 5 | 4 |
| 10 | `pack-european-microstates` | European microstates and Malta | Andorra (`ad`), Monaco (`mc`), San Marino (`sm`), Vatican City (`va`), Malta (`mt`) | 5 | 4 |
| 11 | `pack-north-america` | North America and its southern gateway | Canada (`ca`), United States (`us`), Mexico (`mx`), Belize (`bz`), Guatemala (`gt`) | 5 | 4 |
| 12 | `pack-central-america` | Central America | El Salvador (`sv`), Honduras (`hn`), Nicaragua (`ni`), Costa Rica (`cr`), Panama (`pa`) | 5 | 4 |
| 13 | `pack-northern-south-america` | The Andes and the Guianas | Colombia (`co`), Venezuela (`ve`), Guyana (`gy`), Suriname (`sr`), Ecuador (`ec`), Peru (`pe`) | 6 | 4 |
| 14 | `pack-southern-south-america` | Southern South America | Brazil (`br`), Bolivia (`bo`), Paraguay (`py`), Uruguay (`uy`), Argentina (`ar`), Chile (`cl`) | 6 | 4 |
| 15 | `pack-north-africa` | North Africa | Morocco (`ma`), Algeria (`dz`), Tunisia (`tn`), Libya (`ly`), Egypt (`eg`) | 5 | 5 |
| 16 | `pack-sahel` | The Sahel | Mauritania (`mr`), Mali (`ml`), Burkina Faso (`bf`), Niger (`ne`), Chad (`td`), Senegal (`sn`) | 6 | 5 |
| 17 | `pack-atlantic-west-africa` | Atlantic West Africa | Cape Verde (`cv`), Gambia (`gm`), Guinea (`gn`), Guinea-Bissau (`gw`), Sierra Leone (`sl`), Liberia (`lr`), Côte d’Ivoire (`ci`) | 7 | 5 |
| 18 | `pack-gulf-guinea` | Gulf of Guinea and Central Africa | Ghana (`gh`), Togo (`tg`), Benin (`bj`), Nigeria (`ng`), Cameroon (`cm`), Central African Republic (`cf`), Equatorial Guinea (`gq`), São Tomé and Príncipe (`st`) | 8 | 5 |
| 19 | `tour-island-world` | Island world | Iceland (`is`), Ireland (`ie`), Cuba (`cu`), Barbados (`bb`), Madagascar (`mg`), Mauritius (`mu`), Sri Lanka (`lk`), Indonesia (`id`), Japan (`jp`), New Zealand (`nz`), Fiji (`fj`) | 11 | 4 |
| 20 | `pack-east-asia` | East Asia | China (`cn`), Japan (`jp`), South Korea (`kr`), North Korea (`kp`), Mongolia (`mn`), Russia (`ru`) | 6 | 5 |
| 21 | `pack-south-asia` | South Asia | Afghanistan (`af`), Pakistan (`pk`), India (`in`), Bangladesh (`bd`), Nepal (`np`), Bhutan (`bt`), Sri Lanka (`lk`), Maldives (`mv`) | 8 | 5 |
| 22 | `pack-mainland-southeast-asia` | Mainland Southeast Asia | Myanmar (`mm`), Thailand (`th`), Laos (`la`), Cambodia (`kh`), Vietnam (`vn`), Malaysia (`my`) | 6 | 5 |
| 23 | `pack-maritime-southeast-asia` | Maritime Southeast Asia | Indonesia (`id`), Philippines (`ph`), Singapore (`sg`), Brunei (`bn`), Timor-Leste (`tl`) | 5 | 5 |
| 24 | `pack-horn-nile` | The Horn of Africa and the Upper Nile | Sudan (`sd`), South Sudan (`ss`), Eritrea (`er`), Djibouti (`dj`), Ethiopia (`et`), Somalia (`so`), Uganda (`ug`) | 7 | 5 |
| 25 | `pack-great-lakes-congo` | Great Lakes and the Congo basin | Kenya (`ke`), Tanzania (`tz`), Rwanda (`rw`), Burundi (`bi`), Democratic Republic of the Congo (`cd`), Republic of the Congo (`cg`), Gabon (`ga`) | 7 | 5 |
| 26 | `pack-southern-africa` | Southern Africa | Angola (`ao`), Zambia (`zm`), Zimbabwe (`zw`), Botswana (`bw`), Namibia (`na`), South Africa (`za`), Lesotho (`ls`) | 7 | 5 |
| 27 | `pack-southeast-africa-islands` | Southeast Africa and the Indian Ocean | Eswatini (`sz`), Mozambique (`mz`), Malawi (`mw`), Madagascar (`mg`), Comoros (`km`), Mauritius (`mu`), Seychelles (`sc`) | 7 | 5 |
| 28 | `tour-around-equator` | Around the Equator | Ecuador (`ec`), Brazil (`br`), Gabon (`ga`), Republic of the Congo (`cg`), Democratic Republic of the Congo (`cd`), Uganda (`ug`), Kenya (`ke`), Somalia (`so`), Indonesia (`id`), Kiribati (`ki`) | 10 | 4 |
| 29 | `pack-eastern-mediterranean` | Eastern Mediterranean | Türkiye (`tr`), Cyprus (`cy`), Israel (`il`), Palestine (`ps`), Lebanon (`lb`), Jordan (`jo`) | 6 | 5 |
| 30 | `pack-arabian-gulf` | Arabia and the Gulf | Saudi Arabia (`sa`), Yemen (`ye`), Oman (`om`), United Arab Emirates (`ae`), Qatar (`qa`), Bahrain (`bh`), Kuwait (`kw`) | 7 | 5 |
| 31 | `pack-caucasus-mesopotamia` | Caucasus and Mesopotamia | Armenia (`am`), Azerbaijan (`az`), Georgia (`ge`), Iran (`ir`), Iraq (`iq`), Syria (`sy`) | 6 | 5 |
| 32 | `pack-central-asia` | Central Asia | Kazakhstan (`kz`), Kyrgyzstan (`kg`), Tajikistan (`tj`), Turkmenistan (`tm`), Uzbekistan (`uz`) | 5 | 5 |
| 33 | `tour-world-favourites` | World favourites | Germany (`de`), Spain (`es`), United States (`us`), Brazil (`br`), Argentina (`ar`), Jamaica (`jm`), Egypt (`eg`), South Africa (`za`), Türkiye (`tr`), India (`in`), Japan (`jp`), Australia (`au`) | 12 | 4 |
| 34 | `pack-greater-caribbean` | The larger Caribbean states | Cuba (`cu`), Haiti (`ht`), Dominican Republic (`do`), Jamaica (`jm`), Bahamas (`bs`), Trinidad and Tobago (`tt`) | 6 | 6 |
| 35 | `pack-lesser-antilles` | The Lesser Antilles | Barbados (`bb`), Antigua and Barbuda (`ag`), Dominica (`dm`), Grenada (`gd`), Saint Kitts and Nevis (`kn`), Saint Lucia (`lc`), Saint Vincent and the Grenadines (`vc`) | 7 | 6 |
| 36 | `pack-australia-western-pacific` | Australia, New Zealand and the Pacific gateways | Australia (`au`), New Zealand (`nz`), Papua New Guinea (`pg`), Fiji (`fj`), Solomon Islands (`sb`), Vanuatu (`vu`), Samoa (`ws`) | 7 | 6 |
| 37 | `pack-pacific-islands` | Pacific island states | Tonga (`to`), Tuvalu (`tv`), Kiribati (`ki`), Nauru (`nr`), Marshall Islands (`mh`), Micronesia (`fm`), Palau (`pw`) | 7 | 6 |

The opening World Tour is based on familiarity rather than strict
representation of the app's nine organisational regions. It spans every
inhabited continent. The second tour soon adds Jamaica for the Caribbean and
Türkiye for West and Central Asia.

The systematic Caribbean and Oceania packs come late because small island
states are often less familiar, have less familiar capitals, and can be harder
to locate. `tour-island-world` previews island countries much earlier so the
end does not feel like an entirely new category.

Mixed-region map quizzes select the relevant regional map separately for each
question. The question type remains purely map-to-country; only the displayed
region changes between questions.

## Mastery levels

Mastery levels are displayed in a final **Mastery challenges** section. They
are open from the beginning, but Continue reaches them only after the regular
learning levels. Every mastery level contains four separate, single-mode
quizzes. Perfect scores are intentionally required for mastery.

| No. | Stable level ID | Challenge | Countries per quiz | Total questions across four quizzes |
|---:|---|---|---:|---:|
| 38 | `mastery-europe` | Europe mastery | 44 | 176 |
| 39 | `mastery-north-central-america` | North and Central America mastery | 10 | 40 |
| 40 | `mastery-south-america` | South America mastery | 12 | 48 |
| 41 | `mastery-north-west-africa` | North and West Africa mastery | 26 | 104 |
| 42 | `mastery-east-south-asia` | East and South Asia mastery | 25 | 100 |
| 43 | `mastery-east-south-africa` | East and South Africa mastery | 28 | 112 |
| 44 | `mastery-west-central-asia` | West and Central Asia mastery | 24 | 96 |
| 45 | `mastery-caribbean` | Caribbean mastery | 13 | 52 |
| 46 | `mastery-oceania` | Oceania mastery | 14 | 56 |
| 47 | `mastery-whole-world` | Whole world mastery | 196 | 784 |

The whole-world level therefore contains the four ultimate challenges:

1. Find all 196 flags.
2. Name all 196 countries from their flags.
3. Name all 196 countries on the map.
4. Find all 196 capitals.

Each challenge is clearly labelled **196 questions · long challenge** before
the player starts. A best score such as `155/196` remains visible even when the
challenge has not been mastered.

## Curriculum totals

- 32 learning levels
- 5 World Tour interludes
- 10 mastery levels
- 47 levels in total
- 128 short learning quizzes
- 20 World Tour quizzes
- 36 regional mastery quizzes
- 4 whole-world ultimate quizzes
- 188 quizzes in total
- 196 countries, each assigned to exactly one systematic country pack
- Every country practised in all four quiz modes before the mastery section

## Progress display and next action

Quiz states:

- **Unplayed:** unread dot, no score
- **Played:** best score, for example `3/5`
- **Mastered:** perfect score and checkmark, for example `5/5 ✓`

Level states:

- **Unplayed:** unread dot
- **In progress:** mastered count, for example `2/4 mastered`
- **Mastered:** `4/4 ✓`

Result-screen priority:

- After a perfect result: **Next quiz** is primary; **Play again** is secondary.
- After a non-perfect result: **Try again** is primary; **Next quiz** is secondary.
- **View level** is always available as a quiet tertiary action.

## Content evolution

Progress is stored against `quiz-id@revision`.

- Renaming, moving or translating a quiz does not change its revision.
- Adding a new level or quiz does not affect existing progress. The new item
  appears with an unread dot.
- A material change to countries, answers or difficulty increments only that
  quiz's revision. The current revision then appears unplayed.
- Removed quiz records remain harmlessly in saved/exported progress but are not
  displayed.
- After a curriculum update, show one concise message: **Some quizzes have been
  updated and are ready to play again.**

## Playtesting and tuning boundaries

The 47-level order, country assignments, four single-mode quizzes per level and
mastery structure are the approved initial curriculum. Playtesting may tune
presentation details such as answer-feedback timing, card layout and responsive
density without changing quiz identity.

Changing a country set, choice count, fixed alternatives or other material
difficulty requires deliberate curriculum review and the revision handling
described above. Missed countries are reviewed through the optional Explore
Cards flow defined in `PRODUCT-SPEC.md`; additional review levels are not part
of the initial 47-level curriculum.
