# Flag Files

The flags in this directory are local 4:3 SVG files from
[lipis/flag-icons](https://github.com/lipis/flag-icons), specifically the
project's
[`flags/4x3`](https://github.com/lipis/flag-icons/tree/main/flags/4x3)
directory. The project is distributed under the MIT License. A local copy of
the license is stored in
[`../licenses/flag-icons-MIT.txt`](../licenses/flag-icons-MIT.txt).

The exact version from which the current files were originally retrieved is
not documented. File names are lowercase country codes, normally ISO 3166-1
alpha-2, for example `no.svg`. `xk.svg` is used for Kosovo; `XK` is a commonly
used user-assigned code, but is not an official ISO 3166-1 code.

Later targeted updates:

- France, Hungary, Latvia, Poland, and Ukraine were updated from
  [source commit `40daebaa`](https://github.com/lipis/flag-icons/commit/40daebaa74b023fe63fb9f82489c022dc2c63b9d)
  (March 3, 2026), which fixes color bleeding in Chrome.
- Panama was updated from
  [source commit `086f7e97`](https://github.com/lipis/flag-icons/commit/086f7e97d657358203916dbe84f61c2bccaa81eb)
  (April 7, 2026), which removes an unintended white border.

## Updating flags or countries

1. Review the
   [flag-icons changelog](https://github.com/lipis/flag-icons/blob/main/CHANGELOG.md)
   and compare the relevant files in `flags/4x3`.
2. Replace only the SVG files used by the quiz, and retain lowercase file
   names.
3. Update countries, Norwegian names, capitals, and regions separately in
   [`../countries.js`](../countries.js). These data are not imported from the
   flag project.
4. Confirm that the dataset still has unique country codes and that every code
   has exactly one corresponding SVG file in this directory.
