# Geografi-quiz

En statisk geografi-quiz med 196 land, lokale SVG-flagg, fire quizmoduser,
flashcards og en alfabetisk landoversikt. Kartquizen viser ett uthevet land på
et regionkart og gir seks landnavn å velge mellom.

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

`world-map.js` inneholder også forhåndsgenerert Mercator-geometri med
håndjusterte utsnitt for de sju enkeltregionene i Kartquiz. Oseania er
stillehavssentrert slik at øystatene på begge sider av datolinjen vises
samlet. Reprojiseringen skjer ikke i nettleseren og tilfører ingen
runtime-avhengigheter.

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

Hvert land har én `region`, med FNs
[M49-inndeling](https://unstats.un.org/unsd/methodology/m49/overview/) som
utgangspunkt. Russland er et bevisst pedagogisk unntak: Landet plasseres i
Asia for å gi én tydelig regioninndeling og lesbare regionkart. Kypros og
Tyrkia plasseres også i Asia.
Amerikanske land lagrer den mest spesifikke regionen
(`north-central-america`, `south-america` eller `caribbean`); den samlede
`americas`-kategorien utledes i applikasjonen.

Et land kan også ha et valgfritt, kort `note`-felt. De første notatene forklarer
verdensdelstilhørigheten til Russland og Tyrkia med støtte i
[Store norske leksikon](https://snl.no/Europa), Kypros' geografiske plassering
og EU-medlemskap med støtte i
[FN M49](https://unstats.un.org/unsd/methodology/m49/overview/) og
[Den europeiske union](https://european-union.europa.eu/principles-countries-history/eu-countries/cyprus_en),
og Sør-Afrikas tre hovedsteder med støtte i
[South African Government](https://www.gov.za/south-africa-glance).
