# Flaggfiler

Flaggene i denne mappen er lokale 4:3-SVG-filer fra
[lipis/flag-icons](https://github.com/lipis/flag-icons), nærmere bestemt
prosjektets mappe
[`flags/4x3`](https://github.com/lipis/flag-icons/tree/main/flags/4x3).
Prosjektet distribueres under MIT-lisensen. En lokal kopi av lisensen ligger i
[`../licenses/flag-icons-MIT.txt`](../licenses/flag-icons-MIT.txt).

Den eksakte versjonen som dagens filer opprinnelig ble hentet fra, er ikke
dokumentert. Filnavnene er landkoder med små bokstaver, normalt
ISO 3166-1 alpha-2, for eksempel `no.svg`. `xk.svg` brukes for Kosovo; `XK` er en
vanlig brukerdefinert kode, men er ikke en offisiell ISO 3166-1-kode.

Senere målrettede oppdateringer:

- Frankrike, Ungarn, Latvia, Polen og Ukraina ble oppdatert fra
  [kildecommit `40daebaa`](https://github.com/lipis/flag-icons/commit/40daebaa74b023fe63fb9f82489c022dc2c63b9d)
  (3. mars 2026), som retter fargeblødning i Chrome.
- Panama ble oppdatert fra
  [kildecommit `086f7e97`](https://github.com/lipis/flag-icons/commit/086f7e97d657358203916dbe84f61c2bccaa81eb)
  (7. april 2026), som fjerner en utilsiktet hvit kant.

## Oppdatere flagg eller land

1. Se gjennom
   [flag-icons-endringsloggen](https://github.com/lipis/flag-icons/blob/main/CHANGELOG.md)
   og sammenlign de relevante filene i `flags/4x3`.
2. Erstatt bare SVG-filene som quizen bruker, og behold filnavnene med små
   bokstaver.
3. Oppdater land, norske navn, hovedsteder og regioner separat i
   [`../countries.js`](../countries.js). Disse dataene importeres ikke fra
   flaggprosjektet.
4. Kontroller at datasettet fortsatt har unike landkoder, og at hver kode har
   nøyaktig én tilsvarende SVG-fil i denne mappen.
