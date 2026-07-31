# Vedlikehold av kartdata

Dette dokumentet er inngangen for et menneske eller en AI som skal kontrollere
eller oppdatere kartene. Nettstedet bruker bare den ferdige `world-map.js`;
verktøyene her er vedlikeholdsverktøy og er ikke en del av runtime.

## Kortversjonen

1. Kjør `python3 tools/map_maintenance.py validate`.
2. Les dette dokumentet og `tools/map-sources.json`.
3. Kontroller om Natural Earth har en nyere utgave enn den låste versjonen.
4. Dersom kilden er nyere, last den ned i en midlertidig mappe, sammenlign
   land og grenser, og lag en separat kandidat til `world-map.js`.
5. Bytt aldri ut kartfilen før både maskinelle kontroller og visuell
   nettleserkontroll er bestått.

## Autoritative kilder og ansvarsdeling

- `countries.js` bestemmer hvilke 196 land som finnes i quizen, norske navn,
  hovedsteder og nøyaktig én quizregion per land.
- Natural Earth bestemmer kartkonturene og geografisk kontekst, men skal aldri
  automatisk legge til eller fjerne quizland.
- `tools/map-sources.json` er det maskinlesbare manifestet for dataversjon,
  eksakte nedlastingsadresser, SHA-256, kodeavvik, projeksjoner, regionale
  utsnitt og redaksjonelle regler.
- `world-map.js` er generert runtime-data. SVG-banene skal ikke redigeres for
  hånd.

Kildene er Natural Earth Admin 0 Countries i 1:50m og 1:10m samt 1:50m Tiny
Country Points. Det vanlige, globale datasettet med Natural Earths
**de facto-standardvisning** brukes. Ikke bytt til et landspesifikt POV-datasett
uten en uttrykkelig redaksjonell beslutning.

## Kontroll uten oppdatering

Kjør fra prosjektroten:

```sh
python3 tools/map_maintenance.py validate
```

Kontrollen krever bare Python 3-standardbiblioteket og verifiserer blant annet:

- 196 land og unike koder
- gyldige enkeltregioner
- ett lokalt SVG-flagg per land
- kartgeometri eller markør for alle quizland
- én silhuett per land
- full dekning i hvert av de ni quizregionkartene og oversiktskartet for Afrika
- forventet Natural Earth-versjon og projeksjoner

Kontrollen avgjør ikke om politiske grenser eller landlisten er faglig
oppdatert. Det må sammenlignes med nye kilder.

## Hent og kontroller den låste kilden

Bruk en mappe utenfor prosjektet, eller en ignorert arbeidsmappe:

```sh
python3 tools/map_maintenance.py download /tmp/geografi-map-sources
python3 tools/map_maintenance.py audit-sources /tmp/geografi-map-sources
```

`download` bruker de eksakte URL-ene i manifestet og avviser filer med feil
SHA-256. `audit-sources` leser DBF-filene direkte uten GIS-pakker og bekrefter
at Natural Earth har polygondata for alle quizkodene. Kosovo er eksplisitt
koblet til `xk`; nye kodeavvik skal legges i `countryCodeOverrides` med en
forklaring i dette dokumentet.

## Slik undersøkes en ny Natural Earth-versjon

1. Les Natural Earths versjonshistorikk og changelog. Se spesielt etter Admin
   0-endringer, nye eller slettede enheter, kodeendringer og endret behandling
   av omstridte områder.
2. Kopier `tools/map-sources.json` til en midlertidig fil og oppdater versjon,
   URL-er og SHA-256 der først. Ikke overskriv det gjeldende manifestet ennå.
3. Kjør kildeaudit mot de nye, utpakkede filene. Undersøk hver quizkode som
   ikke lenger matcher `ISO_A2_EH`; ikke gjett ut fra navn alene.
4. Sammenlign listen over selvstendige stater med UN M49 og prosjektets
   redaksjonelle landliste. Et Natural Earth-objekt er ikke automatisk et nytt
   quizland, og en avhengighet eller et territorium skal normalt bare være
   kartkontekst.
5. Avklar om endringen krever oppdatering av `countries.js`, flagg, regiontall,
   landnotater eller bare geometri.

Hvis et land oppstår eller forsvinner, er dette en innholdsendring i hele
prosjektet, ikke bare en kartoppdatering. Oppdater landdata, flagg, kartkode og
dokumenterte forventningstall samlet.

## Regenerering av geometri

Den innsjekkede geometrien består av tre separate produkter:

1. Verdenskart: 1:50m, Equal Earth, `0 0 1000 500`.
2. Regionkart: 1:50m, nordvendt, regionsentrert azimutal ekvidistant
   projeksjon med automatisk kamera fra aktive land. Oseania vikles rundt
   180°.
3. Formvindu: 1:10m, nordvendt silhuett, `0 0 100 100`, med synlige
   erstatningsmarkører for svært små komponenter.

Geometrien ble forenklet og koordinatene avrundet til én desimal. Smålandspunkter
fra Natural Earth brukes når polygonet er for lite til å være lesbart.
Landtilhørighet i regionkart må alltid slås opp i `countries.js`; feltene
`CONTINENT`, `REGION_UN` og `SUBREGION` i Natural Earth er bare
sammenligningsgrunnlag.

Afrikaoversikten er et eget kartutsnitt under `overviewRegions` og kombinerer
de to afrikanske quizregionene. Det er ikke en overlappende quizregion.

Den avhengighetsfrie referansegeneratoren lager en separat kandidat:

```sh
python3 tools/generate_map_data.py \
  /tmp/geografi-map-sources \
  /tmp/world-map.candidate.js
python3 tools/map_maintenance.py validate \
  --map-file /tmp/world-map.candidate.js
```

Ved endringer i regionkart skal eksisterende Equal Earth-verdenskart og
formvinduer bevares med `--base-map`. Alle regionkart og Afrikaoversikten
regenereres alltid gjennom den samme azimutal-ekvidistante pipelinen:

```sh
python3 tools/generate_map_data.py \
  /tmp/geografi-map-sources \
  /tmp/world-map.candidate.js \
  --base-map world-map.js
```

Hvert regionkart har aktive land i `features` og `markers`, mens
`backgroundFeatures` bare inneholder ikke-aktiv geografi. Alle tre samlingene
bruker samme sentralmeridian, projeksjon og forenklingstoleranse.
Projeksjonens breddegradssentrum er alltid midtpunktet i den geografiske
utvalgsrammen; dette er samme regel for alle regioner.
Aktive polygonkomponenter som treffer den geografiske utvalgsrammen med 10 %
sikkerhetsmargin beholdes hele. Kameraet beregnes fra aktive objekter med 6 %
luft. Bakgrunnen velges deretter rent romlig: alle ikke-aktive polygonbiter
som treffer `bleedViewBox` beholdes, uten relevans- eller avstandsfilter. Bare
den synlige delen av en fjern komponent tas med. Bakgrunnen genereres ut til
`bleedViewBox`, slik
at grensesnittet kan utvide kartets viewBox til kortets faktiske sideforhold.
Dermed treffer bakgrunnsgeografien den synlige rammen i stedet for å slutte i
et innfelt rektangel. Kunstige kanter finnes bare ytterst i bleed-området og
dekkes med havfargen dersom en ekstrem skjermform når dem. Et aktivt quizland
skal aldri ha `cropPath`; valideringen avviser kandidaten dersom det
kanoniske utsnittet skjærer et land som tilhører regionen.

Azimutalprojeksjonens antipode har ingen entydig retning. Den samme generelle
sømbeskyttelsen brukes derfor i alle kart: en fjern bakgrunnsring som hopper
over antipoden utelates i stedet for å lukkes med en kunstig linje gjennom det
synlige kartet. Aktive land ligger alltid utenfor denne beskyttelsessonen.

`bleedViewBox` dekker sideforhold fra 0,75 til 2,4. Grensesnittet kan gå utenfor
dette området ved ekstreme kortformer; da vises mer hav i stedet for
forvrengning eller letterboxing.

`east-south-asia` har i tillegg `focusViewBox`, et Explore-only
kameraalternativ beregnet med samme regel etter de 24 andre landene. Det kan
skjære Russland, men ikke noe annet aktivt land.
`viewBox` er fortsatt den komplette regionen og brukes alltid i kartquizen.

Generatoren leser SHP/DBF direkte, projiserer og forenkler geometrien og
beholder eksisterende `corner`-valg for formvinduene. Den nekter å skrive
direkte til `world-map.js`. Dersom en fremtidig oppdatering krever mer avansert
geometribehandling, kan GDAL/QGIS, D3 Geo eller Mapshaper brukes offline, men
resultatet må fortsatt serialiseres til samme offentlige grensesnitt:

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
  silhouettes
};
```

Ingen av disse verktøyene skal bli runtime-avhengigheter. Behold
`corner`-verdien for hvert eksisterende formvindu med mindre en visuell
kontroll viser at landet skjules.

Manifestets geografiske rammer velger relevante polygonkomponenter og gir
projeksjonen en stabil målestokk; de er ikke synlige kameraer. Hele komponenter
som treffer rammen beholdes, mens fjerne oversjøiske komponenter ikke automatisk
gjør hovedregionen uleselig.

## Godkjenningsliste for en kandidat

Før `world-map.js` erstattes:

- Kjør lokal validering med kandidatdataene koblet inn.
- Bekreft 196 land, 196 flagg og 196 silhuetter.
- Bekreft at utilgjengelige territorier er kartkontekst og ikke kan velges.
- Kontroller Russland kun i Øst- og Sør-Asia, og Kypros og Tyrkia i Vest- og
  Sentral-Asia. Både regionkartet og formvinduet skal vise hele Russland,
  inkludert Kaliningrad og geometrien ved datolinjen.
- Inspiser Kosovo, Palestina og alle nye kodeavvik særskilt.
- Inspiser datolinjen for Russland, USA, Fiji, Kiribati og Oseania.
- Inspiser mikrostater og øystater, særlig Vatikanstaten, Monaco, Bahrain,
  Maldivene, Nauru, Tuvalu og Karibia.
- Kontroller alle ni quizregionkart, Afrikaoversikten og formvinduets fire
  mulige hjørner.
- Test forsidekartets mus, tastatur, hover, fokus og valgte region.
- Test Kartquiz med riktig, feil og korrigering i alle regioner.
- Test 1440×900, 1024×768, 768×768 og 390×844.
- Bekreft ingen konsollfeil, ingen nettverkskall og direkte `file://`-lasting.

Ta vare på den forrige `world-map.js` til den visuelle sammenligningen er
ferdig. Kartgrenser er både en data- og redaksjonell beslutning; en automatisk
oppdatering skal derfor aldri publiseres uten gjennomgang.
