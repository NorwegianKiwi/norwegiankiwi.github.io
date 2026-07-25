# Geografi-quiz

En statisk geografi-quiz med 196 land, lokale SVG-flagg, tre quizmoduser og en
alfabetisk landoversikt.

Åpne `index.html` direkte i en nettleser. Siden krever ingen installasjon,
utviklingsserver, bygging eller tredjepakker.

## Filer

- `index.html` – dokument og metadata
- `styles.css` – utforming og responsiv layout
- `countries.js` – land- og regiondata
- `app.js` – quizlogikk og rendering
- `flags/` – de 196 flaggene quizen bruker, med
  [kilde- og oppdateringsinformasjon](flags/README.md)
- `licenses/` – lisens for flaggfilene

## Vedlikehold av landdata

Norske landnavn, hovedsteder og regioninndeling vedlikeholdes lokalt i
`countries.js`; de importeres ikke automatisk fra flaggkilden. Når et land,
flagg eller en hovedstad endres, bør både landdataene og de tilhørende lokale
SVG-filene kontrolleres.
