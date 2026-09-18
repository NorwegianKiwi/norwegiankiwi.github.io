# lanceolav.com

Personal website published through GitHub Pages and proxied by Cloudflare.

## Privacy

`privacy.html` provides the shared notice in English and Norwegian (`?lang=nb`).
Both languages remain readable without JavaScript; games retain their local
licence records.

Hello World creates and saves a local profile immediately. The 2025 Christmas
quiz saves selected answers. Automatic browser storage supports continuity of
play without uploading these records or displaying a consent popup.

Cloudflare RUM is disabled. NEL is enabled to diagnose connection failures:
supported browsers cache reporting instructions and can send failure details,
addresses and timing to Cloudflare. Cloudflare documents transient IP processing
and derived network and approximate location information.

The consent assessment for first-visit saving and NEL remains unresolved;
disclosure does not replace consent where required. Accounts, cloud sync,
advertising, embeds or additional analytics would require reassessment.

Brain-teaser contributors submitted solutions knowing their names would be
published. Nicknames, omission and later changes or removal are available on
request. The privacy notice does not itself establish historical consent.

## Maintenance

The home/contents animation uses `solar-transitions.js` and `solar-transitions.css`
for native cross-document transitions. The optional compatibility layer is isolated
in `solar-transitions-fallback.js` and `solar-transitions-fallback.css`.
The head script checks native support immediately and loads those two files in the
background only when necessary (and motion is enabled). Links navigate normally
if clicked before initialization. Incoming animations use a short loading guard
to prevent a flash; a failed or slow load releases the content after at most 1.5s.
To retire the fallback, remove `loadFallback()` and its call from
`solar-transitions.js`, delete the two fallback files, and remove their associated
tests. Keep the native-support guard and native handlers. Run the checks with
`node --test tests/solar-transitions.test.cjs`.

`_layouts/default.html` supplies the shared footer for Jekyll documentation pages.
The local AnchorJS 4.1.0 copy preserves heading links without a cdnjs request;
its MIT licence is included alongside the script.

Email to the site’s contact addresses is forwarded through Cloudflare Email
Routing and stored in Gmail (Google).
