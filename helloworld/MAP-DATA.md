# Map Data Maintenance

This document is the starting point for a person or an AI reviewing or updating
the maps. The website uses only the finished `world-map.js`; the tools described
here are maintenance tools and are not part of the runtime.

## Quick version

1. Run `python3 tools/map_maintenance.py validate`.
2. Read this document and `tools/map-sources.json`.
3. Check whether Natural Earth has a newer release than the pinned version.
4. If the source is newer, download it to a temporary directory, compare
   countries and borders, and create a separate candidate for `world-map.js`.
5. Never replace the map file until both automated checks and visual browser
   checks have passed.

## Authoritative sources and division of responsibility

- `countries.js` determines which 197 countries and 30 other places are
  learnable, their Norwegian names and civic centres, and exactly one quiz
  region per place.
- Natural Earth determines map outlines and geographic context, but must never
  automatically add or remove quiz countries.
- `tools/map-sources.json` is the machine-readable manifest for the data
  version, exact download URLs, SHA-256 checksums, code overrides, projections,
  regional extents, and editorial rules.
- `world-map.js` contains generated runtime data. The SVG paths must not be
  edited by hand.

The geometry sources are Natural Earth Admin 0 Countries at 1:50m and 1:10m,
as well as 1:50m Tiny Country Points. Capital coordinates use the independently
versioned Natural Earth 1:10m Populated Places dataset. The standard global
dataset with Natural Earth's **de facto default view** is used. Do not switch
to a country-specific POV dataset without an explicit editorial decision.

## Validation without updating

Run from the project root:

```sh
python3 tools/map_maintenance.py validate
```

The validation requires only the Python 3 standard library and verifies, among
other things:

- 227 learnable places and unique codes
- valid single-region assignments
- one local SVG flag per place
- map geometry or a marker for every learnable place
- one silhouette per place
- the expected 234 civic-centre markers across 225 silhouettes
- complete coverage in each of the nine quiz-region maps and the Africa
  overview map
- the expected Natural Earth version and projections

The validation does not determine whether political borders or the country
list are substantively up to date. They must be compared with new sources.

## Download and audit the pinned source

Use a directory outside the project, or an ignored working directory:

```sh
python3 tools/map_maintenance.py download /tmp/geografi-map-sources
python3 tools/map_maintenance.py audit-sources /tmp/geografi-map-sources
```

`download` uses the exact URLs in the manifest and rejects files with incorrect
SHA-256 checksums. `audit-sources` reads the DBF files directly without GIS
packages and confirms that Natural Earth has polygon data for every quiz code.
Kosovo is explicitly mapped to `xk`; new code overrides must be added to
`countryCodeOverrides` with an explanation in this document.

## How to evaluate a new Natural Earth version

1. Read Natural Earth's version history and changelog. Look especially for
   Admin 0 changes, new or deleted entities, code changes, and changes in the
   treatment of disputed areas.
2. Copy `tools/map-sources.json` to a temporary file and update the version,
   URLs, and SHA-256 checksums there first. Do not overwrite the current
   manifest yet.
3. Run the source audit against the new extracted files. Investigate every
   quiz code that no longer matches `ISO_A2_EH`; do not guess from names alone.
4. Compare the list of sovereign states with UN M49 and the project's editorial
   country list. A Natural Earth object is not automatically a new quiz country,
   and a dependency or territory should normally appear only as map context.
5. Determine whether the change requires updates to `countries.js`, flags,
   region counts, country notes, or only geometry.

If a country appears or disappears, this is a content change across the entire
project, not merely a map update. Update the country data, flags, map code, and
documented expected counts together.

## Regenerating geometry

The committed geometry consists of three separate products:

1. World map: 1:50m, Equal Earth, `0 0 1000 500`.
2. Region maps: 1:50m, north-up, region-centered azimuthal equidistant
   projection with an automatically fitted camera based on active countries.
   Active countries with a Natural Earth tiny-country point use 1:10m geometry,
   so islands missing from the 1:50m source remain available when zoomed in.
   Background geography remains at 1:50m. Oceania wraps around 180°.
3. Shape inset: 1:10m, north-up silhouette, `0 0 100 100`. Very small
   components are retained as separate polygon geometry with lighter stroke
   treatment. Countries whose entire geometry is below the readability
   threshold receive up to eight representative points in the compact shape
   inset. An editorial rule can force the same compact-marker treatment for a
   dispersed island state whose few readable components would otherwise hide
   the country's full extent; the real geometry always replaces those markers
   when enlarged.

Countries with dispersed islands or remote territories can have editorial
silhouette rules in `silhouetteOverrides` in `tools/map-sources.json`. Their
compact shape is fitted from an explicit set of geographic components. The
expanded composition may place remote inhabited areas in separate, unlabelled
frames with independent scales. Relocated island frames preserve approximate
compass direction and ordering relative to the main form, but do not imply
exact distance or a shared scale. A true enlargement of geometry already shown
in the nationwide overview has a source rectangle and two connector lines.
Compositions may include an optional `divisionPath` for internal geographic
context. A division can select polygon geometry, as with Cyprus's UN buffer
zone, or derive only the shared open boundary between two named source objects,
as with Somalia and Somaliland. Shared-boundary generation fails when the two
objects do not have matching source segments, preventing a coastline or closed
territory outline from being substituted accidentally. Named Natural Earth
objects without a quiz code can be included explicitly when a complete land
form spans multiple source objects. These rules affect only silhouettes; they
must never be reused to filter the world or regional maps. Frames remain
unlabelled.

Expanded silhouettes mark the capitals listed in `countries.js` with small
five-pointed stars. The generator matches the English editorial names against
Natural Earth Populated Places and uses `capitalOverrides` for current names,
policy-sensitive places, or cities absent from that release. It fails rather
than guessing when a city is missing or ambiguous. Multi-capital countries
receive one point per listed city. A point covered by an inset is projected
only into that most detailed panel, not duplicated in the overview. Compact
silhouettes and regional maps never render these points. `capitalExclusions`
omits Monaco and Vatican City; San Marino follows the normal rule.

`markerOverrides` corrects a tiny-country locator whose Natural Earth point is
not on the pedagogically useful main island. `regionalGeometryOverrides` is a
separate, narrowly scoped mechanism for combining source objects on a regional
map; it must not alter the world map or silently change quiz membership.
Somaliland is combined with Somalia in regional views and silhouettes, but it
does not become a separate quiz country. The enlarged Somalia silhouette marks
their shared de facto boundary with the same dashed guide style used for other
internal geographic context.

The geometry was simplified and coordinates were rounded to one decimal place.
Natural Earth tiny-country points are used when a polygon is too small to be
readable. Country membership in region maps must always be looked up in
`countries.js`; the `CONTINENT`, `REGION_UN`, and `SUBREGION` fields in Natural
Earth serve only as a basis for comparison.

The Africa overview is a separate map extent under `overviewRegions` and
combines the two African quiz regions. It is not an overlapping quiz region.

The dependency-free reference generator creates a separate candidate:

```sh
python3 tools/generate_map_data.py \
  /tmp/geografi-map-sources \
  /tmp/world-map.candidate.js
python3 tools/map_maintenance.py validate \
  --map-file /tmp/world-map.candidate.js
```

When region maps change, preserve the existing Equal Earth world map and shape
insets with `--base-map`. All region maps and the Africa overview are always
regenerated through the same azimuthal-equidistant pipeline:

```sh
python3 tools/generate_map_data.py \
  /tmp/geografi-map-sources \
  /tmp/world-map.candidate.js \
  --base-map world-map.js
```

When the shape insets must also be regenerated without changing the Equal Earth
world map, add `--refresh-silhouettes`. Without this flag, `--base-map` retains
the existing shape insets:

```sh
python3 tools/generate_map_data.py \
  /tmp/geografi-map-sources \
  /tmp/world-map.candidate.js \
  --base-map world-map.js \
  --refresh-silhouettes
```

To update only the editorial overrides while preserving every other map and
silhouette byte-for-byte, use:

```sh
python3 tools/generate_map_data.py \
  /tmp/geografi-map-sources \
  /tmp/world-map.candidate.js \
  --base-map world-map.js \
  --refresh-silhouette-overrides
```

Existing generated context polygons can be assigned to a quiz country through
`worldGeometryOverrides`. This changes only their country code and localized
name; paths, ordering, markers, regional maps, and silhouettes remain
byte-for-byte unchanged. Apply these rules without reprojection using:

```sh
python3 tools/generate_map_data.py \
  /tmp/geografi-map-sources \
  /tmp/world-map.candidate.js \
  --base-map world-map.js \
  --refresh-world-overrides
```

The command fails if a configured generated feature name is missing or
ambiguous. Use it instead of a full world regeneration when the checked-in
legacy world projection must remain unchanged.

Each region map has active countries in `features` and `markers`, while
`backgroundFeatures` contains only inactive geography. All three collections
use the same central meridian, projection, and simplification tolerance.
Each tiny-country marker has a `readableSize`, calculated from the largest
minor axis of an actual polygon component. The interface therefore does not
show the polygon until a single component is readable; the combined bounding
box of a dispersed island nation is not sufficient.
The projection's latitude center is always the midpoint of the geographic
selection extent; this rule is the same for all regions.
Active polygon components that intersect the geographic selection extent with
a 10% safety margin are retained in full. The camera is calculated from active
objects with 6% padding. The background is then selected purely spatially: all
inactive polygon fragments intersecting `bleedViewBox` are retained, without a
relevance or distance filter. Only the visible portion of a distant component
is included. The background is generated out to `bleedViewBox`, allowing the
interface to expand the map's viewBox to the card's actual aspect ratio.
Consequently, background geography reaches the visible frame instead of ending
at an inset rectangle. Artificial edges exist only at the outer boundary of
the bleed area and are covered with the ocean color if an extreme screen shape
reaches them. An active quiz country must never have `cropPath`; validation
rejects the candidate if the canonical extent cuts through a country belonging
to the region.

The antipode of an azimuthal projection has no unambiguous direction. The same
general seam protection is therefore used in all maps: a distant background
ring that jumps across the antipode is omitted instead of being closed with an
artificial line through the visible map. Active countries always lie outside
this protection zone.

`bleedViewBox` covers aspect ratios from 0.75 to 2.4. The interface can go
outside this range for extreme card shapes; in that case, more ocean is shown
instead of distortion or letterboxing.

`viewBox` always shows the complete region, both in the map quiz and Explore.

The generator reads SHP/DBF directly, then projects and simplifies the geometry.
The silhouettes use a country-centered equirectangular projection with one
fixed standard parallel for the entire country. This preserves north-up
orientation without giving different latitudes different horizontal scales
and thereby skewing the shape.
All compact shape insets are placed in the lower-left corner. Expanded
compositions can contain unlabelled internal frames defined by the manifest.
Remote groups are placed in their approximate direction from the main form;
zoom frames use a generated source locator and connector lines. The generator
refuses to write directly to `world-map.js`. If a future update requires more
advanced geometry processing, GDAL/QGIS, D3 Geo, or Mapshaper may be used
offline, but the result must still be serialized to the same public interface:

```js
window.GEOGRAFI_QUIZ_MAP_DATA = {
  viewBox,
  source,
  projection,
  features,
  markers,
  quizProjection,
  quizRegions: { [id]: { viewBox, bleedViewBox, backgroundFeatures, features, markers } },
  overviewRegions: { [id]: { viewBox, bleedViewBox, backgroundFeatures, features, markers } },
  silhouetteViewBox,
  silhouettes,
  silhouetteCapitals: { [countryCode]: { main, insets } }
};
```

None of these tools should become runtime dependencies. `corner` must be
`bottom-left` for every shape inset.

The manifest's geographic extents select relevant polygon components and give
the projection a stable scale; they are not visible cameras. Complete
components intersecting the extent are retained, while distant overseas
components do not automatically make the main region unreadable.

## Candidate approval checklist

Before replacing `world-map.js`:

- Run local validation with the candidate data connected.
- Confirm 197 countries, 30 other places, 227 flags, and 227 silhouettes.
- Confirm 234 civic-centre markers across 225 silhouettes, with none for Monaco or
  Vatican City.
- Confirm that unavailable territories are map context and cannot be selected.
- Check that Russia appears only in East and South Asia, and Cyprus and Türkiye
  in West and Central Asia. Both the region map and the shape inset must show
  all of Russia, including Kaliningrad and the geometry at the date line.
- Inspect Kosovo, Palestine, and all new code overrides separately.
- Confirm that Somalia includes Somaliland in its active regional geometry and
  compact silhouette, while only the enlarged silhouette shows their shared
  boundary as an open dashed line that does not follow the coast.
- Inspect the date line for Russia, the United States, Fiji, Kiribati, and
  Oceania.
- Inspect microstates and island nations, especially Vatican City, Monaco,
  Bahrain, the Maldives, Nauru, Tuvalu, and the Caribbean.
- Expand ordinary, multi-capital, and inset silhouettes. Confirm that San
  Marino has a star, Monaco and Vatican City do not, and Tonga and Tuvalu place
  their stars only in the detailed inset.
- Check all nine quiz-region maps, the Africa overview, and the shape inset's
  four possible corners.
- Test the front-page map's mouse, keyboard, hover, focus, and selected region.
- Test the map quiz with correct answers, incorrect answers, and corrections in
  every region.
- Test 1440×900, 1024×768, 768×768, and 390×844.
- Confirm there are no console errors or network calls, and that direct
  `file://` loading works.

Keep the previous `world-map.js` until the visual comparison is complete. Map
borders are both a data decision and an editorial decision; an automated update
must therefore never be published without review.
