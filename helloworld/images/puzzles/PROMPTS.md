# Stage artwork prompts and maintenance

These maintenance prompts describe the finished artwork requirements. They are
not verbatim generation records. Use the shared art direction with the relevant
stage prompt when creating an illustration with the built-in imagegen tool.
The six PNGs in this directory are the runtime assets. Use `tourist.png` as the
style and recurring-character reference for the other stages.

## Shared art direction

Create a 1536 × 1024 landscape, full-bleed storybook illustration in warm
textured gouache and fine ink. Use golden light, teal, coral, mustard and cream,
with cute expressive faces and readable details. Include each recurring
traveller once: a child in a yellow raincoat with a red backpack, a child in a
blue cap with round spectacles, and a small russet fox carrying a rolled map.

Establish one coherent viewpoint, ground surfaces and scale relationships.
Figures have natural joints, coherent species-appropriate anatomy, readable
hands and grips, and convincing contact with their surroundings. Vehicles have
connected components and traceable tracks or suspension. Objects have clear
supports, handles and contact shadows. Occlusion should explain hidden parts.

The upright clothed fox is intentional fantasy. Additional fantasy is specified
per scene; ordinary gravity, water flow, construction and perspective still
apply. Avoid fused objects, accidental character duplication, extra limbs,
floating props and untraceable machinery. Simplify crowded actions and complex
mechanisms when needed for clarity.

Distribute recognizable characters, props, animals, architecture and nature
across the fixed puzzle layout. Calmer clouds, foliage, stone and paving are
welcome where they help the composition; each piece need not contain a whole
character or a separate joke. No lettering, pseudo-writing, logos, borders,
panels, painted grids or puzzle seams. Printed maps use simple route lines and
recognizable symbols; clocks use clear tick marks and two hands.

## Tourist — 16 pieces, 4 × 4

A bustling departure station viewed almost side-on. One straight track runs
left to right behind a parallel foreground platform. A black steam locomotive
faces left, its boiler parallel to the rails, cab immediately behind it and
cream-and-teal carriages coupled behind the cab to the right. Wheels rest on
the rails; the engine, carriages and track share one continuous alignment.
Teal columns and roof beams support the canopy, clock, lamps, flowers and nest.

The yellow-coat child waves towards a carriage window; the blue-cap child holds
a simple local route map in both hands; the fox holds its rolled map. Separate
poses keep gestures readable. A pastry seller stands behind a supported counter
on the left. A pigeon grips a plain bordered ticket bearing a train symbol.
An adult traveller with a camera stands beside a luggage trolley with a load
bed, connected handle and wheels. Include a cat inside a visibly hinged open
suitcase, a dog beside a picnic basket, a paper boat and travel journal on the
platform. Passengers remain distinct within carriage windows. Fantasy is the
clothed fox; the station and train have ordinary physical construction.

## Explorer — 40 pieces, 8 × 5

An elevated three-quarter view of a lush island hillside. A treehouse rests on
a sturdy trunk and braces. A short rope bridge has continuous planks, handrails,
anchor posts and solid landings across a ravine. The three travellers stand
together on a broad path leading to a campsite. A stream descends over rocks
into a lower pool. A cutaway rock face reveals caves with distinct stone walls
and dry floors above the pool; separate water from dry passages clearly.

Include a monkey with a stolen hat, birds, butterflies, a lizard, roots,
crystals, a closed chest, tent and kettle hanging from a supported frame.
Distribute these discoveries among foliage and rock. The cutaway is an
illustration convention; the clothed fox is fantasy. Terrain, bridge supports
and water flow remain convincing.

## Navigator — 52 pieces, row counts 9, 8, 9, 9, 8, 9

An oblique coastal harbour above a clearly defined water surface, with an
illustrative underwater cross-section below. The three travellers stand once
on a broad timber pier with a continuous deck and posts extending below water.
A rowboat and a modest single-mast sailboat float at the surface with coherent
hulls and simple connected rigging. A lighthouse rests on a rocky headland.
Village houses, baskets, flowers and seabirds enliven the shore.

Below water, a small sealed yellow submarine has a distinct adult operator
visible through a glazed porthole, an enclosed hull and connected propulsion.
No exposed humans or foxes breathe underwater. A wooden wreck rests on the
seabed among coral, shells, fish, a turtle, seahorse and starfish. A crab arranges
shells for a playful picnic. Animal play and the clothed fox are fantasy;
marine anatomy, buoyancy, supports and air spaces remain coherent.

## Globetrotter — 56 pieces, 8 × 7

An elevated view across a terraced travel town with buildings supported by
visible streets and terraces. One teal tram runs along continuous rails on a
stone bridge with grounded arches. One cable car hangs from a continuous cable
between visible stations. Two balloons have conventional baskets attached by
clear suspension ropes. Keep these transport systems visually traceable.

The three travellers stand together in a cobbled market square. Separate bakery
and fruit sellers, a fountain flowing into its basin, flowers, window boxes,
rooftop gardens, bird nests, a duck family and a cat beside luggage provide
discoveries. A parked bicycle has two wheels and a coherent frame. Small travel
props rest on the foreground paving: a simple compass, closed journal, folded
route leaflet and feather, all with sensible perspective and contact shadows.
The picturesque town and clothed fox are fantasy; vehicles and structures have
convincing connections and supports.

## Cartographer — 44 pieces, row counts 7, 8, 7, 7, 8, 7

An oblique view of a cozy mapmaker's workshop with a sturdy rectangular table.
The children and fox stand behind it at one scale, their hands visibly resting
on its edge or holding a map. A cream paper map on the tabletop becomes a
miniature landscape at a distinct smaller scale. Paper edges remain visible
beneath hills, trees and towns. One aligned miniature train follows continuous
rails across a supported bridge over a river.

The river flows towards the front map edge and falls into a teacup on a stool
below the table. Its source, descending fall and receiving cup are clear.
Shelves hold books, rolled maps and jars; a globe has a conventional ring stand.
Dividers, pencils, brushes, twine and a magnifying glass are recognizable tools.
Include a window bird, plants, a suitcase cat, mouse and puzzle tray. The living
map and clothed fox are magic; ordinary objects retain coherent scale, support,
contact and anatomy. Use filename `regional-expert.png` for this stage.

## World Master — 24 pieces, 6 × 4

A small floating fictional world seen in three-quarter perspective. Its rounded
rocky underside supports a broad grassy picnic terrace. The three travellers
appear once, seated together with clearly separated limbs, cups and pastries.
A cat sleeps in an open suitcase, a dog rests on grass, and birds, flowers,
butterflies, a journal and picnic basket surround them.

Smaller landmarks recall the journey: a supported treehouse, cottages, a
lighthouse on rock and a yellow submarine floating in a contained harbour.
A short railway follows a supported front terrace; locomotive, cab and coupled
carriage align with the rails under their wheels. Buildings follow their local
ground plane. Balloons have connected baskets. Roots and crystals enliven the
rock underside. The floating world, miniature landmarks and clothed fox are
intentional fantasy; local supports, anatomy and physical actions are coherent.

## Maintenance checklist

- Preserve the six runtime filenames, 1536 × 1024 dimensions, fixed geometry and
  permanent quiz-to-piece mappings in `../../puzzles.js`.
- Review scene structure first: perspective, scale, supports, machinery,
  connections, ground contact and readable actions.
- Inspect anatomy, faces, grips and object construction at full resolution.
  Repair isolated defects and recheck the whole illustration for regressions.
- Open [the artwork viewer](review.html) and inspect every actual clipped
  fragment at enlarged size for recognizable detail and useful composition.
- Verify replacement artwork in result reveals, collection zoom and milestone
  celebrations on desktop and phone, with both locales and direct-file access.
  Check keyboard operation, reduced motion and image-load failure behavior.
- Run `python3 tools/check.py` from the repository root. Keep only active images
  here; Git retains earlier assets and documentation.
