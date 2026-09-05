# Coherent-fantasy artwork revision

## Status

The user approved Tourist v2 as the visual standard. All six reviewed second
editions are now installed in `images/puzzles/`. Originals are preserved in
`originals/`, and `installed-sha256.json` records both editions' hashes.
Open [the comparison and fragment viewer](review.html) to inspect any stage.
All generations and local corrections used the built-in imagegen tool.

`tourist-v2-draft.png` records the first rebuild. Its map and ticket contained
pseudo-writing, so it was rejected as a final candidate and edited locally.
The exact generation and correction prompts are retained alongside the images.

## Review method

1. Trace the whole scene: ground planes, perspective, connected vehicles,
   supports, gravity, scale and actions. Separate intentional fantasy from
   accidental contradictions.
2. Inspect individual characters and objects at full resolution: anatomy,
   gestures, contact, grips, duplication, mechanisms, and merging boundaries.
   An occluded limb is not automatically a missing limb.
3. Inspect every actual SVG-clipped piece at enlarged size. A recognizable
   object or environmental detail is sufficient; a separate joke per tile is
   not required. Do not sacrifice coherent construction for density.

After an edit, repeat the whole-image review for regressions. Rendering and
automated tests verify integration, not the anatomical correctness of artwork.

## Original image audit

Locations refer to the original 1536 × 1024 images. This is a defect inventory
for rebuilding, not a claim to have found every drawing problem.

| Image | Structural / narrative defects | Local defects or ambiguous details to resolve |
|---|---|---|
| Tourist | Middle-background locomotive points across the apparent direction of the carriages and rails; its relationship to the rest of the train cannot be traced coherently. Right-side trolley has ambiguous rail/support connections. | Waving hands and window-passenger gestures have irregular digits. Upper-right hands, plant pot and luggage overlap unclearly. Clock markings and printed maps/tickets contain malformed pseudo-detail. |
| Explorer | Blue-cap child recurs on the upper bridge, inside multiple caves and the submarine; yellow-coat child also repeats. The image reads as several moments superimposed. Lower-centre cave/submarine water and neighbouring dry caves lack a clearly explained cutaway boundary. | Upper-right bridge ropes, handholds and platform connections become hard to distinguish from vines. Lower cave figures and tools merge with surrounding rock detail. Rebuild these relationships rather than treating all foliage as a defect. |
| Navigator | Main children and fox appear both on the central pier and in the underwater scene. The diving fox's face is exposed while human divers use enclosed helmets; this needs either a defined fantasy rule or a coherent breathing arrangement. | Rigging, ropes, hooks and supports around the upper-middle boats/crane are difficult to trace. Small dockside bodies, cargo and trolley parts overlap ambiguously. Keep underwater animals natural; do not infer incorrect limb counts solely from occlusion. |
| Globetrotter | The layered central transport routes are difficult to follow as continuous tracks, bridges or cable lines. The descending green vehicle at centre-right has an unclear running/suspension connection. | Lower-right bicycle frames, wheels, rider limbs and hands crowd together. Upper vehicles and balloon attachments need individual construction checks, not just plausible silhouettes. Simplify the number of crossing transport systems. |
| Cartographer | The intentional living-map fantasy is mixed with uncertain scale: mouse-sized explorers and the much larger main cast share unclear ground planes. The centre train/bridge and map edges need an explicit continuous route. | Upper-right instrument combines map-like surface, clock-like markings, a ladder and ambiguous fittings. Lower-right paper boats and dark spill reflections blur their contact with the surface. Preserve deliberate rivers flowing off the map, but make their sources, edges and receiving vessels readable. |
| World Master | The main children and fox repeat in the centre, workshop and lower station area. Curved-world transport routes and the various standing surfaces do not establish a consistent relationship to the planet. | Upper-left passenger rides in a suitcase-like hanging container whose construction needs clarification. Lower train/child scale and track attachment to the globe edge are unclear. Floating islands and balloons may remain intentional, with coherent local supports and suspension. |

## Tourist candidate: first two review passes

- Train rebuilt along one left-to-right axis: front/boiler on the left, cab
  behind it, carriages continuing to the right. Wheel/rail contact is visible.
- Three main travellers each appear once. Adult traveller, vendor, driver and
  passengers have separate readable poses; hands are separated from held props.
- Trolley has a traceable load bed, handle and visible near-side wheels. Far-side
  wheels can be occluded by the trolley; no extra unsupported frame is present.
- Cat rests inside a visibly hinged suitcase; bird grips its ticket; luggage,
  journal, picnic basket, paper boat and standing characters contact the ground.
- Clock uses marks instead of invented Roman numerals. The initial rebuild's
  pseudo-written map and ticket were replaced with a simple fictional route
  diagram and a train-symbol ticket, preserving the grips and paper folds.
- Rechecked the edited whole image: train orientation and character arrangement
  remain intact. No additional definite structural or anatomical defect was
  identified in these passes. This is a visual judgment, not a guarantee that
  the image is artifact-free.

## Completed pilot checks

All sixteen actual clipped fragments were visually reviewed in `tourist-review.html`:
clock; steam domes and canopy; pigeon and lamp; flower basket and nest; vendor;
engine mechanisms and waving child; carriage passenger; adult traveller; pastries
and suitcase; backpack; map reader and fox; camera and trolley; suitcase cat;
ticket/boots/paper boat; journal and fox tail; dog and picnic basket. No fragment
is blank. The upper-middle pieces are quieter architectural/mechanical details;
this deliberate reduction in visual density is part of the calibration decision.

The candidate was substituted only inside an isolated browser test, using request
interception, while the installed asset remained unchanged. Twelve desktop/phone
result, collection and milestone views passed across Norwegian and English;
zoom enlargement and scrolling were checked. No unexpected page/console errors
or horizontal page overflow were observed. Screenshots were visually inspected.
An initial assertion about automatic zoom centering timed out; enlargement and
manual scrolling then passed. No gameplay code was changed in this artwork task.

`python3 tools/check.py` passed all 35 tests and the map/data validations. PNG
canvas dimensions and original-asset/geometry hashes were also verified.
The user approved the side-by-side Tourist comparison before the remaining five
were generated. These pilot results are retained as review history.

## Replacement procedure after calibration

Before installing an accepted revision, preserve the original file under a
versioned archive path. Replace only the corresponding image asset and update
its prompt/review record. Keep dimensions, puzzle geometry, quiz mappings and
progress formats unchanged. Run `python3 tools/check.py` after integration.

## Remaining five: scene and object review

| Revision | Structural review | Character and object review |
|---|---|---|
| Explorer | Treehouse rests on trunk and braces; bridge connects rocky landings. Caves have distinct rock walls and floors beside the lower pool. Stream descends on the right. | Three unique travellers stand on one path; straps, map grips and boots read separately. Monkey, lizard, birds and butterflies are distinct; kettle hangs from a supported camping frame. |
| Navigator | One surface separates harbour and underwater cutaway. Pier posts continue below water; boats float above. Lighthouse has rock foundation; wreck rests on seabed. | Travellers appear once on pier; submarine operator is a distinct adult inside glass. Turtle, fish, seahorse and crab are separate from props. Crab's picnic is intentional anthropomorphic play. |
| Globetrotter | Tram is aligned with bridge rails; stone arches reach ground. Cable car has hanger and continuous cable; balloon baskets have suspension ropes. Town terraces and square are readable. | Separate sellers and travellers; duck family has grounded feet. Parked bicycle avoids rider/limb entanglement. Targeted edit added compass, journal, leaflet and feather to sparse paving. Whole scene was rechecked afterwards. |
| Cartographer | Ordinary workshop table and miniature map terrain are distinct scales. Railway follows a visible supported route; river falls from map/table edge to a cup on a stool below. | Children lean behind the table with separate hands. Fox grips its map. Globe, dividers, magnifier, jar, suitcase cat and mouse are recognizable; the living map is the declared magic. |
| World Master | Floating world has a single picnic ground plane. Treehouse, cottages and lighthouse have local supports; submarine floats in contained inlet. Railway follows supported front terrace. | Main travellers appear once with readable seated limbs, cups and pastries. Cat, dog, birds and baskets contact their surfaces. Tiny landmark scale is intentional; balloon baskets are conventional. |

No identified structural, anatomical or object-construction issue remained
unresolved at installation. This is a visual review judgment, not an automated
proof that a drawing contains no possible artifact.

## Fragment review

All 232 actual SVG-clipped fragments were rendered and visually inspected,
with candidate sheets using 290 × 240 display boxes. The corrected Globetrotter
was checked again after editing. The existing piece boundaries and order stayed
unchanged. Calmer clouds, foliage, stone and paving fragments are deliberate;
not every reward contains an entire character or a separate visual joke.

- Tourist 1–16: architecture, train components, travellers, luggage and animals.
- Explorer 1–8: canopy, treehouse, bird and island skyline; 9–16: supports,
  coastline, travellers and camp; 17–24: bridge, grips, boots, kettle and stream;
  25–32: roots, lizard, cave walls and waterfall; 33–40: plants, chest, crystals
  and pool.
- Navigator 1–9: village, birds, clouds, lighthouse and mast; 10–17: travellers,
  coastline and sails; 18–26: baskets, pier, boats and buoy; 27–35: posts,
  submarine fittings and marine life; 36–44: coral, submarine operator and wreck;
  45–52: shells, crab picnic and starfish.
- Globetrotter 1–8: roofs, balloons, cable and stations; 9–16: flowers, suspended
  baskets and terraces; 17–24: awnings, tram and rooftops; 25–32: stalls, bridge
  arches and fountain; 33–40: sellers, pastries, travellers and produce;
  41–48: flowers, ducks, boots, fox, cat and bicycle; 49–56: paving, duck feet,
  compass, journal, leaflet, basket, suitcase and feather.
- Cartographer 1–7: maps, globe, shelves and window; 8–15: workshop storage,
  faces, bird and plant; 16–22: brushes, hands, miniature terrain and scrolls;
  23–29: tools, railway, river and map edge; 30–37: suitcase, table, waterfall,
  cup and jug; 38–44: cat, mouse, stool and puzzle tray.
- World Master 1–6: balloons, nests, roofs and lighthouse; 7–12: treehouse,
  travellers and harbour; 13–18: plants, pets, picnic and railway; 19–24:
  supported arches, roots, crystals and surrounding clouds.

## Integration verification

The canonical `python3 tools/check.py` passed all 35 tests and generated/map/data
validation after installation. The browser harness passed 80 localized puzzle
states across direct files and a static server, desktop, tablet, portrait phone
and short landscape. It covered both entry points, both locales, keyboard dialog
focus restoration, reduced motion, zoom/reset, immediate continuation, final
piece seam fade, milestone-to-world sequence and image-load failure. No
unexpected console errors or horizontal page overflow were observed.

All six images additionally passed desktop/phone result, zoom/pan and milestone
checks. Original archives and all installed dimensions/hashes were verified.
No gameplay JavaScript, CSS, piece mappings, quiz revisions or storage formats
were changed.
