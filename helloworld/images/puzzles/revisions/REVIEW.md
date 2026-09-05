# Coherent-fantasy artwork revision

## Status

Tourist is the pilot. `tourist-v2.png` is the corrected candidate for visual
calibration, not the installed game asset. All six original game images remain
unchanged. The other five images will be regenerated after Tourist establishes
the agreed visual standard, as requested in the implementation plan.

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
The side-by-side comparison and fragment inspection page are ready for the user.
The remaining checkpoint is visual calibration before generating the other five
replacements and installing accepted assets.

## Replacement procedure after calibration

Before installing an accepted revision, preserve the original file under a
versioned archive path. Replace only the corresponding image asset and update
its prompt/review record. Keep dimensions, puzzle geometry, quiz mappings and
progress formats unchanged. Run `python3 tools/check.py` after integration.
