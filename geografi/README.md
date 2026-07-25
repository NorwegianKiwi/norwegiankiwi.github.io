# Geografi-quiz

En statisk geografi-quiz med 196 land, lokale SVG-flagg, tre quizmoduser,
flashcards og en alfabetisk landoversikt.

Åpne `index.html` direkte i en nettleser. Siden krever ingen installasjon,
utviklingsserver, bygging eller tredjepakker.

## Filer

- `index.html` – dokument og metadata
- `styles.css` – utforming og responsiv layout
- `countries.js` – land- og regiondata
- `world-map.js` – lokalt, projisert kartgrunnlag fra Natural Earth
- `app.js` – quizlogikk og rendering
- `favicon.svg` – jordklode brukt som favicon og dekorasjon i heroen
- `flags/` – de 196 flaggene quizen bruker, med
  [kilde- og oppdateringsinformasjon](flags/README.md)
- `licenses/` – lisenser for flaggfilene og jordkloden

## Verdenskart

Det interaktive verdenskartet er generert fra Natural Earth 1:50m Admin 0
Countries og Tiny Country Points, versjon 5.1.1. Kartet bruker Equal
Earth-projeksjon og er forenklet for visning i nettleseren. Natural Earth-data
er public domain; kilde- og bruksvilkår er dokumentert i
`licenses/natural-earth-public-domain.txt`.

## Jordklode

Jordkloden er Twemojis
[Globe showing Europe–Africa](https://github.com/twitter/twemoji/blob/master/assets/svg/1f30d.svg).
Grafikken brukes uendret og er lisensiert under
[CC BY 4.0](https://github.com/twitter/twemoji/blob/master/LICENSE-GRAPHICS).
En lokal kopi av lisensen ligger i `licenses/twemoji-CC-BY-4.0.txt`.

## Vedlikehold av landdata

Norske landnavn, hovedsteder og regioninndeling vedlikeholdes lokalt i
`countries.js`; de importeres ikke automatisk fra flaggkilden. Når et land,
flagg eller en hovedstad endres, bør både landdataene og de tilhørende lokale
SVG-filene kontrolleres.

Hvert land tilhører én overordnet verdensdel etter FNs
[M49-inndeling](https://unstats.un.org/unsd/methodology/m49/overview/). Det gir
Russland plassering i Europa, mens Kypros og Tyrkia plasseres i Asia. De
amerikanske landene har i tillegg en underregion og den samlede
`americas`-kategorien.
