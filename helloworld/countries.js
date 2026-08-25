(function () {
  "use strict";

const supportedLocales = ["nb", "en"];
const primaryRegions = new Set([
  "europe",
  "north-west-africa",
  "east-south-africa",
  "west-central-asia",
  "east-south-asia",
  "oceania",
  "north-central-america",
  "south-america",
  "caribbean",
]);
const countryCodes = new Set();

const centreOverrides = Object.freeze({
  za: [
    { name: { nb: "Pretoria", en: "Pretoria" }, role: { nb: "Administrativ hovedstad", en: "Administrative capital" }, kind: "quiz" },
    { name: { nb: "Cape Town", en: "Cape Town" }, role: { nb: "Lovgivende hovedstad", en: "Legislative capital" }, kind: "quiz" },
    { name: { nb: "Bloemfontein", en: "Bloemfontein" }, role: { nb: "Juridisk hovedstad", en: "Judicial capital" }, kind: "quiz" },
  ],
  lk: [
    { name: { nb: "Sri Jayawardenepura Kotte", en: "Sri Jayawardenepura Kotte" }, role: { nb: "Lovgivende hovedstad", en: "Legislative capital" }, kind: "quiz" },
    { name: { nb: "Colombo", en: "Colombo" }, role: { nb: "Kommersielt sentrum", en: "Commercial centre" }, kind: "secondary" },
  ],
  bo: [
    { name: { nb: "Sucre", en: "Sucre" }, role: { nb: "Konstitusjonell hovedstad", en: "Constitutional capital" }, kind: "quiz" },
    { name: { nb: "La Paz", en: "La Paz" }, role: { nb: "Regjeringssete", en: "Seat of government" }, kind: "secondary" },
  ],
  sz: [
    { name: { nb: "Mbabane", en: "Mbabane" }, role: { nb: "Administrativ hovedstad", en: "Administrative capital" }, kind: "quiz" },
    { name: { nb: "Lobamba", en: "Lobamba" }, role: { nb: "Kongelig og lovgivende hovedstad", en: "Royal and legislative capital" }, kind: "quiz" },
  ],
  my: [
    { name: { nb: "Kuala Lumpur", en: "Kuala Lumpur" }, role: { nb: "Nasjonal hovedstad", en: "National capital" }, kind: "quiz" },
    { name: { nb: "Putrajaya", en: "Putrajaya" }, role: { nb: "Administrativt sentrum", en: "Administrative centre" }, kind: "secondary" },
  ],
  ps: [
    { name: { nb: "Øst-Jerusalem", en: "East Jerusalem" }, role: { nb: "Krevd hovedstad", en: "Claimed capital" }, kind: "quiz" },
    { name: { nb: "Ramallah", en: "Ramallah" }, role: { nb: "Administrativt sentrum", en: "Administrative centre" }, kind: "quiz" },
  ],
  nr: [
    { name: { nb: "Yaren", en: "Yaren" }, role: { nb: "De facto regjeringssete", en: "De facto seat of government" }, kind: "quiz" },
  ],
  id: [
    { name: { nb: "Jakarta", en: "Jakarta" }, role: { nb: "Hovedstad", en: "Capital" }, kind: "quiz" },
    { name: { nb: "Nusantara", en: "Nusantara" }, role: { nb: "Planlagt framtidig hovedstad", en: "Planned future capital" }, kind: "planned" },
  ],
  eh: [
    { name: { nb: "El Aaiún", en: "El Aaiún" }, role: { nb: "Største administrative sentrum", en: "Largest administrative centre" }, kind: "quiz" },
    { name: { nb: "Tifariti", en: "Tifariti" }, role: { nb: "Midlertidig krevd hovedstad", en: "Temporary claimed capital" }, kind: "secondary" },
  ],
});

function defineCountry(country) {
  if (countryCodes.has(country.code)) {
    throw new Error(`Duplicate country code in countries.js: ${country.code}`);
  }
  if (!primaryRegions.has(country.region)) {
    throw new Error(`Invalid region in countries.js: ${country.region}`);
  }

  supportedLocales.forEach((locale) => {
    if (
      !country.name?.[locale]?.trim() ||
      !country.capital?.[locale]?.trim()
    ) {
      throw new Error(
        `Incomplete ${locale} data for country code: ${country.code}`,
      );
    }
    if (country.note && !country.note[locale]?.trim()) {
      throw new Error(
        `Incomplete ${locale} note for country code: ${country.code}`,
      );
    }
  });

  countryCodes.add(country.code);
  const centres = centreOverrides[country.code] ?? [
    { name: country.capital, role: { nb: "Hovedstad", en: "Capital" }, kind: "quiz" },
  ];
  return Object.freeze({
    ...country,
    category: country.category ?? "country",
    status: country.status ? Object.freeze(country.status) : null,
    relatedCountryCode: country.relatedCountryCode ?? null,
    flagStatus: country.flagStatus ?? "official",
    name: Object.freeze(country.name),
    capital: Object.freeze(country.capital),
    centres: Object.freeze(centres.map((centre) => Object.freeze({
      ...centre,
      name: Object.freeze(centre.name),
      role: Object.freeze(centre.role),
    }))),
    note: country.note ? Object.freeze(country.note) : null,
  });
}

const countries = [
  { code: "dz", region: "north-west-africa", name: { nb: "Algerie", en: "Algeria" }, capital: { nb: "Alger", en: "Algiers" } },
  { code: "ao", region: "east-south-africa", name: { nb: "Angola", en: "Angola" }, capital: { nb: "Luanda", en: "Luanda" } },
  { code: "bj", region: "north-west-africa", name: { nb: "Benin", en: "Benin" }, capital: { nb: "Porto-Novo", en: "Porto-Novo" } },
  { code: "bw", region: "east-south-africa", name: { nb: "Botswana", en: "Botswana" }, capital: { nb: "Gaborone", en: "Gaborone" } },
  { code: "bf", region: "north-west-africa", name: { nb: "Burkina Faso", en: "Burkina Faso" }, capital: { nb: "Ouagadougou", en: "Ouagadougou" } },
  { code: "bi", region: "east-south-africa", name: { nb: "Burundi", en: "Burundi" }, capital: { nb: "Gitega", en: "Gitega" } },
  { code: "cv", region: "north-west-africa", name: { nb: "Kapp Verde", en: "Cape Verde" }, capital: { nb: "Praia", en: "Praia" } },
  { code: "cm", region: "north-west-africa", name: { nb: "Kamerun", en: "Cameroon" }, capital: { nb: "Yaoundé", en: "Yaoundé" } },
  { code: "cf", region: "north-west-africa", name: { nb: "Den sentralafrikanske republikk", en: "Central African Republic" }, capital: { nb: "Bangui", en: "Bangui" } },
  { code: "td", region: "north-west-africa", name: { nb: "Tsjad", en: "Chad" }, capital: { nb: "N'Djamena", en: "N'Djamena" } },
  { code: "km", region: "east-south-africa", name: { nb: "Komorene", en: "Comoros" }, capital: { nb: "Moroni", en: "Moroni" } },
  { code: "cg", region: "east-south-africa", name: { nb: "Republikken Kongo", en: "Republic of the Congo" }, capital: { nb: "Brazzaville", en: "Brazzaville" } },
  { code: "cd", region: "east-south-africa", name: { nb: "Den demokratiske republikken Kongo", en: "Democratic Republic of the Congo" }, capital: { nb: "Kinshasa", en: "Kinshasa" } },
  { code: "ci", region: "north-west-africa", name: { nb: "Elfenbenskysten", en: "Côte d’Ivoire" }, capital: { nb: "Yamoussoukro", en: "Yamoussoukro" } },
  { code: "dj", region: "east-south-africa", name: { nb: "Djibouti", en: "Djibouti" }, capital: { nb: "Djibouti", en: "Djibouti" } },
  { code: "eg", region: "north-west-africa", name: { nb: "Egypt", en: "Egypt" }, capital: { nb: "Kairo", en: "Cairo" } },
  { code: "gq", region: "north-west-africa", name: { nb: "Ekvatorial-Guinea", en: "Equatorial Guinea" }, capital: { nb: "Malabo", en: "Malabo" } },
  { code: "er", region: "east-south-africa", name: { nb: "Eritrea", en: "Eritrea" }, capital: { nb: "Asmara", en: "Asmara" } },
  { code: "sz", region: "east-south-africa", name: { nb: "Eswatini", en: "Eswatini" }, capital: { nb: "Mbabane / Lobamba", en: "Mbabane / Lobamba" } },
  { code: "et", region: "east-south-africa", name: { nb: "Etiopia", en: "Ethiopia" }, capital: { nb: "Addis Abeba", en: "Addis Abeba" } },
  { code: "ga", region: "east-south-africa", name: { nb: "Gabon", en: "Gabon" }, capital: { nb: "Libreville", en: "Libreville" } },
  { code: "gm", region: "north-west-africa", name: { nb: "Gambia", en: "Gambia" }, capital: { nb: "Banjul", en: "Banjul" } },
  { code: "gh", region: "north-west-africa", name: { nb: "Ghana", en: "Ghana" }, capital: { nb: "Accra", en: "Accra" } },
  { code: "gn", region: "north-west-africa", name: { nb: "Guinea", en: "Guinea" }, capital: { nb: "Conakry", en: "Conakry" } },
  { code: "gw", region: "north-west-africa", name: { nb: "Guinea-Bissau", en: "Guinea-Bissau" }, capital: { nb: "Bissau", en: "Bissau" } },
  { code: "ke", region: "east-south-africa", name: { nb: "Kenya", en: "Kenya" }, capital: { nb: "Nairobi", en: "Nairobi" } },
  { code: "ls", region: "east-south-africa", name: { nb: "Lesotho", en: "Lesotho" }, capital: { nb: "Maseru", en: "Maseru" } },
  { code: "lr", region: "north-west-africa", name: { nb: "Liberia", en: "Liberia" }, capital: { nb: "Monrovia", en: "Monrovia" } },
  { code: "ly", region: "north-west-africa", name: { nb: "Libya", en: "Libya" }, capital: { nb: "Tripoli", en: "Tripoli" } },
  { code: "mg", region: "east-south-africa", name: { nb: "Madagaskar", en: "Madagascar" }, capital: { nb: "Antananarivo", en: "Antananarivo" } },
  { code: "mw", region: "east-south-africa", name: { nb: "Malawi", en: "Malawi" }, capital: { nb: "Lilongwe", en: "Lilongwe" } },
  { code: "ml", region: "north-west-africa", name: { nb: "Mali", en: "Mali" }, capital: { nb: "Bamako", en: "Bamako" } },
  { code: "mr", region: "north-west-africa", name: { nb: "Mauritania", en: "Mauritania" }, capital: { nb: "Nouakchott", en: "Nouakchott" } },
  { code: "mu", region: "east-south-africa", name: { nb: "Mauritius", en: "Mauritius" }, capital: { nb: "Port Louis", en: "Port Louis" } },
  { code: "ma", region: "north-west-africa", name: { nb: "Marokko", en: "Morocco" }, capital: { nb: "Rabat", en: "Rabat" } },
  { code: "mz", region: "east-south-africa", name: { nb: "Mosambik", en: "Mozambique" }, capital: { nb: "Maputo", en: "Maputo" } },
  { code: "na", region: "east-south-africa", name: { nb: "Namibia", en: "Namibia" }, capital: { nb: "Windhoek", en: "Windhoek" } },
  { code: "ne", region: "north-west-africa", name: { nb: "Niger", en: "Niger" }, capital: { nb: "Niamey", en: "Niamey" } },
  { code: "ng", region: "north-west-africa", name: { nb: "Nigeria", en: "Nigeria" }, capital: { nb: "Abuja", en: "Abuja" } },
  { code: "rw", region: "east-south-africa", name: { nb: "Rwanda", en: "Rwanda" }, capital: { nb: "Kigali", en: "Kigali" } },
  { code: "st", region: "north-west-africa", name: { nb: "São Tomé og Príncipe", en: "São Tomé and Príncipe" }, capital: { nb: "São Tomé", en: "São Tomé" } },
  { code: "sn", region: "north-west-africa", name: { nb: "Senegal", en: "Senegal" }, capital: { nb: "Dakar", en: "Dakar" } },
  { code: "sc", region: "east-south-africa", name: { nb: "Seychellene", en: "Seychelles" }, capital: { nb: "Victoria", en: "Victoria" } },
  { code: "sl", region: "north-west-africa", name: { nb: "Sierra Leone", en: "Sierra Leone" }, capital: { nb: "Freetown", en: "Freetown" } },
  { code: "so", region: "east-south-africa", name: { nb: "Somalia", en: "Somalia" }, capital: { nb: "Mogadishu", en: "Mogadishu" } },
  { code: "za", region: "east-south-africa", name: { nb: "Sør-Afrika", en: "South Africa" }, capital: { nb: "Pretoria / Cape Town / Bloemfontein", en: "Pretoria / Cape Town / Bloemfontein" }, note: { nb: "Sør-Afrika har tre hovedsteder: Pretoria er administrativ hovedstad, Cape Town er lovgivende hovedstad, og Bloemfontein er juridisk hovedstad.", en: "South Africa has three capitals: Pretoria is the administrative capital, Cape Town is the legislative capital, and Bloemfontein is the judicial capital." } },
  { code: "ss", region: "east-south-africa", name: { nb: "Sør-Sudan", en: "South Sudan" }, capital: { nb: "Juba", en: "Juba" } },
  { code: "sd", region: "east-south-africa", name: { nb: "Sudan", en: "Sudan" }, capital: { nb: "Khartoum", en: "Khartoum" } },
  { code: "tz", region: "east-south-africa", name: { nb: "Tanzania", en: "Tanzania" }, capital: { nb: "Dodoma", en: "Dodoma" } },
  { code: "tg", region: "north-west-africa", name: { nb: "Togo", en: "Togo" }, capital: { nb: "Lomé", en: "Lomé" } },
  { code: "tn", region: "north-west-africa", name: { nb: "Tunisia", en: "Tunisia" }, capital: { nb: "Tunis", en: "Tunis" } },
  { code: "ug", region: "east-south-africa", name: { nb: "Uganda", en: "Uganda" }, capital: { nb: "Kampala", en: "Kampala" } },
  { code: "zm", region: "east-south-africa", name: { nb: "Zambia", en: "Zambia" }, capital: { nb: "Lusaka", en: "Lusaka" } },
  { code: "zw", region: "east-south-africa", name: { nb: "Zimbabwe", en: "Zimbabwe" }, capital: { nb: "Harare", en: "Harare" } },
  { code: "ca", region: "north-central-america", name: { nb: "Canada", en: "Canada" }, capital: { nb: "Ottawa", en: "Ottawa" } },
  { code: "us", region: "north-central-america", name: { nb: "USA", en: "United States" }, capital: { nb: "Washington, D.C.", en: "Washington, D.C." } },
  { code: "mx", region: "north-central-america", name: { nb: "Mexico", en: "Mexico" }, capital: { nb: "Mexico by", en: "Mexico City" } },
  { code: "bz", region: "north-central-america", name: { nb: "Belize", en: "Belize" }, capital: { nb: "Belmopan", en: "Belmopan" } },
  { code: "cr", region: "north-central-america", name: { nb: "Costa Rica", en: "Costa Rica" }, capital: { nb: "San José", en: "San José" } },
  { code: "sv", region: "north-central-america", name: { nb: "El Salvador", en: "El Salvador" }, capital: { nb: "San Salvador", en: "San Salvador" } },
  { code: "gt", region: "north-central-america", name: { nb: "Guatemala", en: "Guatemala" }, capital: { nb: "Guatemala by", en: "Guatemala City" } },
  { code: "hn", region: "north-central-america", name: { nb: "Honduras", en: "Honduras" }, capital: { nb: "Tegucigalpa", en: "Tegucigalpa" } },
  { code: "ni", region: "north-central-america", name: { nb: "Nicaragua", en: "Nicaragua" }, capital: { nb: "Managua", en: "Managua" } },
  { code: "pa", region: "north-central-america", name: { nb: "Panama", en: "Panama" }, capital: { nb: "Panama by", en: "Panama City" } },
  { code: "ag", region: "caribbean", name: { nb: "Antigua og Barbuda", en: "Antigua and Barbuda" }, capital: { nb: "Saint John's", en: "Saint John's" } },
  { code: "bs", region: "caribbean", name: { nb: "Bahamas", en: "Bahamas" }, capital: { nb: "Nassau", en: "Nassau" } },
  { code: "bb", region: "caribbean", name: { nb: "Barbados", en: "Barbados" }, capital: { nb: "Bridgetown", en: "Bridgetown" } },
  { code: "cu", region: "caribbean", name: { nb: "Cuba", en: "Cuba" }, capital: { nb: "Havanna", en: "Havana" } },
  { code: "dm", region: "caribbean", name: { nb: "Dominica", en: "Dominica" }, capital: { nb: "Roseau", en: "Roseau" } },
  { code: "do", region: "caribbean", name: { nb: "Den dominikanske republikk", en: "Dominican Republic" }, capital: { nb: "Santo Domingo", en: "Santo Domingo" } },
  { code: "gd", region: "caribbean", name: { nb: "Grenada", en: "Grenada" }, capital: { nb: "Saint George's", en: "Saint George's" } },
  { code: "ht", region: "caribbean", name: { nb: "Haiti", en: "Haiti" }, capital: { nb: "Port-au-Prince", en: "Port-au-Prince" } },
  { code: "jm", region: "caribbean", name: { nb: "Jamaica", en: "Jamaica" }, capital: { nb: "Kingston", en: "Kingston" } },
  { code: "kn", region: "caribbean", name: { nb: "Saint Kitts og Nevis", en: "Saint Kitts and Nevis" }, capital: { nb: "Basseterre", en: "Basseterre" } },
  { code: "lc", region: "caribbean", name: { nb: "Saint Lucia", en: "Saint Lucia" }, capital: { nb: "Castries", en: "Castries" } },
  { code: "vc", region: "caribbean", name: { nb: "Saint Vincent og Grenadinene", en: "Saint Vincent and the Grenadines" }, capital: { nb: "Kingstown", en: "Kingstown" } },
  { code: "tt", region: "caribbean", name: { nb: "Trinidad og Tobago", en: "Trinidad and Tobago" }, capital: { nb: "Port of Spain", en: "Port of Spain" } },
  { code: "ar", region: "south-america", name: { nb: "Argentina", en: "Argentina" }, capital: { nb: "Buenos Aires", en: "Buenos Aires" } },
  { code: "bo", region: "south-america", name: { nb: "Bolivia", en: "Bolivia" }, capital: { nb: "Sucre / La Paz", en: "Sucre / La Paz" } },
  { code: "br", region: "south-america", name: { nb: "Brasil", en: "Brazil" }, capital: { nb: "Brasília", en: "Brasília" } },
  { code: "cl", region: "south-america", name: { nb: "Chile", en: "Chile" }, capital: { nb: "Santiago", en: "Santiago" } },
  { code: "co", region: "south-america", name: { nb: "Colombia", en: "Colombia" }, capital: { nb: "Bogotá", en: "Bogotá" } },
  { code: "ec", region: "south-america", name: { nb: "Ecuador", en: "Ecuador" }, capital: { nb: "Quito", en: "Quito" } },
  { code: "gy", region: "south-america", name: { nb: "Guyana", en: "Guyana" }, capital: { nb: "Georgetown", en: "Georgetown" } },
  { code: "py", region: "south-america", name: { nb: "Paraguay", en: "Paraguay" }, capital: { nb: "Asunción", en: "Asunción" } },
  { code: "pe", region: "south-america", name: { nb: "Peru", en: "Peru" }, capital: { nb: "Lima", en: "Lima" } },
  { code: "sr", region: "south-america", name: { nb: "Surinam", en: "Suriname" }, capital: { nb: "Paramaribo", en: "Paramaribo" } },
  { code: "uy", region: "south-america", name: { nb: "Uruguay", en: "Uruguay" }, capital: { nb: "Montevideo", en: "Montevideo" } },
  { code: "ve", region: "south-america", name: { nb: "Venezuela", en: "Venezuela" }, capital: { nb: "Caracas", en: "Caracas" } },
  { code: "af", region: "east-south-asia", name: { nb: "Afghanistan", en: "Afghanistan" }, capital: { nb: "Kabul", en: "Kabul" } },
  { code: "am", region: "west-central-asia", name: { nb: "Armenia", en: "Armenia" }, capital: { nb: "Jerevan", en: "Yerevan" } },
  { code: "az", region: "west-central-asia", name: { nb: "Aserbajdsjan", en: "Azerbaijan" }, capital: { nb: "Baku", en: "Baku" } },
  { code: "bh", region: "west-central-asia", name: { nb: "Bahrain", en: "Bahrain" }, capital: { nb: "Manama", en: "Manama" } },
  { code: "bd", region: "east-south-asia", name: { nb: "Bangladesh", en: "Bangladesh" }, capital: { nb: "Dhaka", en: "Dhaka" } },
  { code: "bt", region: "east-south-asia", name: { nb: "Bhutan", en: "Bhutan" }, capital: { nb: "Thimphu", en: "Thimphu" } },
  { code: "bn", region: "east-south-asia", name: { nb: "Brunei", en: "Brunei" }, capital: { nb: "Bandar Seri Begawan", en: "Bandar Seri Begawan" } },
  { code: "kh", region: "east-south-asia", name: { nb: "Kambodsja", en: "Cambodia" }, capital: { nb: "Phnom Penh", en: "Phnom Penh" } },
  { code: "cn", region: "east-south-asia", name: { nb: "Kina", en: "China" }, capital: { nb: "Beijing", en: "Beijing" } },
  { code: "cy", region: "west-central-asia", name: { nb: "Kypros", en: "Cyprus" }, capital: { nb: "Nikosia", en: "Nicosia" }, note: { nb: "FN plasserer Kypros i Vest-Asia i M49-inndelingen, mens landet har vært medlem av EU siden 2004.", en: "The UN places Cyprus in Western Asia in its M49 classification, while the country has been an EU member since 2004." } },
  { code: "ge", region: "west-central-asia", name: { nb: "Georgia", en: "Georgia" }, capital: { nb: "Tbilisi", en: "Tbilisi" } },
  { code: "in", region: "east-south-asia", name: { nb: "India", en: "India" }, capital: { nb: "New Delhi", en: "New Delhi" } },
  { code: "id", region: "east-south-asia", name: { nb: "Indonesia", en: "Indonesia" }, capital: { nb: "Jakarta", en: "Jakarta" } },
  { code: "ir", region: "west-central-asia", name: { nb: "Iran", en: "Iran" }, capital: { nb: "Teheran", en: "Tehran" } },
  { code: "iq", region: "west-central-asia", name: { nb: "Irak", en: "Iraq" }, capital: { nb: "Bagdad", en: "Baghdad" } },
  { code: "il", region: "west-central-asia", name: { nb: "Israel", en: "Israel" }, capital: { nb: "Jerusalem", en: "Jerusalem" } },
  { code: "jp", region: "east-south-asia", name: { nb: "Japan", en: "Japan" }, capital: { nb: "Tokyo", en: "Tokyo" } },
  { code: "jo", region: "west-central-asia", name: { nb: "Jordan", en: "Jordan" }, capital: { nb: "Amman", en: "Amman" } },
  { code: "kz", region: "west-central-asia", name: { nb: "Kasakhstan", en: "Kazakhstan" }, capital: { nb: "Astana", en: "Astana" } },
  { code: "kw", region: "west-central-asia", name: { nb: "Kuwait", en: "Kuwait" }, capital: { nb: "Kuwait by", en: "Kuwait City" } },
  { code: "kg", region: "west-central-asia", name: { nb: "Kirgisistan", en: "Kyrgyzstan" }, capital: { nb: "Bisjkek", en: "Bishkek" } },
  { code: "la", region: "east-south-asia", name: { nb: "Laos", en: "Laos" }, capital: { nb: "Vientiane", en: "Vientiane" } },
  { code: "lb", region: "west-central-asia", name: { nb: "Libanon", en: "Lebanon" }, capital: { nb: "Beirut", en: "Beirut" } },
  { code: "my", region: "east-south-asia", name: { nb: "Malaysia", en: "Malaysia" }, capital: { nb: "Kuala Lumpur", en: "Kuala Lumpur" } },
  { code: "mv", region: "east-south-asia", name: { nb: "Maldivene", en: "Maldives" }, capital: { nb: "Malé", en: "Malé" } },
  { code: "mn", region: "east-south-asia", name: { nb: "Mongolia", en: "Mongolia" }, capital: { nb: "Ulaanbaatar", en: "Ulaanbaatar" } },
  { code: "mm", region: "east-south-asia", name: { nb: "Myanmar", en: "Myanmar" }, capital: { nb: "Naypyidaw", en: "Naypyidaw" } },
  { code: "np", region: "east-south-asia", name: { nb: "Nepal", en: "Nepal" }, capital: { nb: "Katmandu", en: "Kathmandu" } },
  { code: "kp", region: "east-south-asia", name: { nb: "Nord-Korea", en: "North Korea" }, capital: { nb: "Pyongyang", en: "Pyongyang" } },
  { code: "om", region: "west-central-asia", name: { nb: "Oman", en: "Oman" }, capital: { nb: "Muskat", en: "Muscat" } },
  { code: "pk", region: "east-south-asia", name: { nb: "Pakistan", en: "Pakistan" }, capital: { nb: "Islamabad", en: "Islamabad" } },
  { code: "ps", region: "west-central-asia", name: { nb: "Palestina", en: "Palestine" }, capital: { nb: "Øst-Jerusalem / Ramallah", en: "East Jerusalem / Ramallah" } },
  { code: "ph", region: "east-south-asia", name: { nb: "Filippinene", en: "Philippines" }, capital: { nb: "Manila", en: "Manila" } },
  { code: "qa", region: "west-central-asia", name: { nb: "Qatar", en: "Qatar" }, capital: { nb: "Doha", en: "Doha" } },
  { code: "ru", region: "east-south-asia", name: { nb: "Russland", en: "Russia" }, capital: { nb: "Moskva", en: "Moscow" }, note: { nb: "Russland ligger i både Europa og Asia. I denne quizen er landet plassert i Øst- og Sør-Asia for å gi én tydelig regioninndeling. Både regionkartet og landformen viser hele Russland.", en: "Russia lies in both Europe and Asia. In this quiz it is placed in East and South Asia to provide one clear regional classification. Both the regional map and the country silhouette show the complete country." } },
  { code: "sa", region: "west-central-asia", name: { nb: "Saudi-Arabia", en: "Saudi Arabia" }, capital: { nb: "Riyadh", en: "Riyadh" } },
  { code: "sg", region: "east-south-asia", name: { nb: "Singapore", en: "Singapore" }, capital: { nb: "Singapore", en: "Singapore" } },
  { code: "kr", region: "east-south-asia", name: { nb: "Sør-Korea", en: "South Korea" }, capital: { nb: "Seoul", en: "Seoul" } },
  { code: "lk", region: "east-south-asia", name: { nb: "Sri Lanka", en: "Sri Lanka" }, capital: { nb: "Sri Jayawardenepura Kotte", en: "Sri Jayawardenepura Kotte" } },
  { code: "sy", region: "west-central-asia", name: { nb: "Syria", en: "Syria" }, capital: { nb: "Damaskus", en: "Damascus" } },
  { code: "tj", region: "west-central-asia", name: { nb: "Tadsjikistan", en: "Tajikistan" }, capital: { nb: "Dusjanbe", en: "Dushanbe" } },
  { code: "th", region: "east-south-asia", name: { nb: "Thailand", en: "Thailand" }, capital: { nb: "Bangkok", en: "Bangkok" } },
  { code: "tl", region: "east-south-asia", name: { nb: "Øst-Timor", en: "Timor-Leste" }, capital: { nb: "Dili", en: "Dili" } },
  { code: "tr", region: "west-central-asia", name: { nb: "Tyrkia", en: "Türkiye" }, capital: { nb: "Ankara", en: "Ankara" }, note: { nb: "Tyrkia ligger i både Asia og Europa. I denne quizen er landet plassert i Asia etter FNs M49-inndeling.", en: "Türkiye lies in both Asia and Europe. In this quiz it is placed in Asia in accordance with the UN M49 classification." } },
  { code: "tm", region: "west-central-asia", name: { nb: "Turkmenistan", en: "Turkmenistan" }, capital: { nb: "Asjkhabad", en: "Asjkhabad" } },
  { code: "ae", region: "west-central-asia", name: { nb: "De forente arabiske emirater", en: "United Arab Emirates" }, capital: { nb: "Abu Dhabi", en: "Abu Dhabi" } },
  { code: "uz", region: "west-central-asia", name: { nb: "Usbekistan", en: "Uzbekistan" }, capital: { nb: "Tasjkent", en: "Tashkent" } },
  { code: "vn", region: "east-south-asia", name: { nb: "Vietnam", en: "Vietnam" }, capital: { nb: "Hanoi", en: "Hanoi" } },
  { code: "ye", region: "west-central-asia", name: { nb: "Jemen", en: "Yemen" }, capital: { nb: "Sana", en: "Sana’a" } },
  { code: "al", region: "europe", name: { nb: "Albania", en: "Albania" }, capital: { nb: "Tirana", en: "Tirana" } },
  { code: "ad", region: "europe", name: { nb: "Andorra", en: "Andorra" }, capital: { nb: "Andorra la Vella", en: "Andorra la Vella" } },
  { code: "at", region: "europe", name: { nb: "Østerrike", en: "Austria" }, capital: { nb: "Wien", en: "Vienna" } },
  { code: "by", region: "europe", name: { nb: "Belarus", en: "Belarus" }, capital: { nb: "Minsk", en: "Minsk" } },
  { code: "be", region: "europe", name: { nb: "Belgia", en: "Belgium" }, capital: { nb: "Brussel", en: "Brussels" } },
  { code: "ba", region: "europe", name: { nb: "Bosnia-Hercegovina", en: "Bosnia and Herzegovina" }, capital: { nb: "Sarajevo", en: "Sarajevo" } },
  { code: "bg", region: "europe", name: { nb: "Bulgaria", en: "Bulgaria" }, capital: { nb: "Sofia", en: "Sofia" } },
  { code: "hr", region: "europe", name: { nb: "Kroatia", en: "Croatia" }, capital: { nb: "Zagreb", en: "Zagreb" } },
  { code: "cz", region: "europe", name: { nb: "Tsjekkia", en: "Czechia" }, capital: { nb: "Praha", en: "Prague" } },
  { code: "dk", region: "europe", name: { nb: "Danmark", en: "Denmark" }, capital: { nb: "København", en: "Copenhagen" } },
  { code: "ee", region: "europe", name: { nb: "Estland", en: "Estonia" }, capital: { nb: "Tallinn", en: "Tallinn" } },
  { code: "fi", region: "europe", name: { nb: "Finland", en: "Finland" }, capital: { nb: "Helsinki", en: "Helsinki" } },
  { code: "fr", region: "europe", name: { nb: "Frankrike", en: "France" }, capital: { nb: "Paris", en: "Paris" } },
  { code: "de", region: "europe", name: { nb: "Tyskland", en: "Germany" }, capital: { nb: "Berlin", en: "Berlin" } },
  { code: "gr", region: "europe", name: { nb: "Hellas", en: "Greece" }, capital: { nb: "Athen", en: "Athens" } },
  { code: "hu", region: "europe", name: { nb: "Ungarn", en: "Hungary" }, capital: { nb: "Budapest", en: "Budapest" } },
  { code: "is", region: "europe", name: { nb: "Island", en: "Iceland" }, capital: { nb: "Reykjavík", en: "Reykjavík" } },
  { code: "ie", region: "europe", name: { nb: "Irland", en: "Ireland" }, capital: { nb: "Dublin", en: "Dublin" } },
  { code: "it", region: "europe", name: { nb: "Italia", en: "Italy" }, capital: { nb: "Roma", en: "Rome" } },
  { code: "xk", region: "europe", name: { nb: "Kosovo", en: "Kosovo" }, capital: { nb: "Pristina", en: "Pristina" } },
  { code: "lv", region: "europe", name: { nb: "Latvia", en: "Latvia" }, capital: { nb: "Riga", en: "Riga" } },
  { code: "li", region: "europe", name: { nb: "Liechtenstein", en: "Liechtenstein" }, capital: { nb: "Vaduz", en: "Vaduz" } },
  { code: "lt", region: "europe", name: { nb: "Litauen", en: "Lithuania" }, capital: { nb: "Vilnius", en: "Vilnius" } },
  { code: "lu", region: "europe", name: { nb: "Luxembourg", en: "Luxembourg" }, capital: { nb: "Luxembourg", en: "Luxembourg" } },
  { code: "mt", region: "europe", name: { nb: "Malta", en: "Malta" }, capital: { nb: "Valletta", en: "Valletta" } },
  { code: "md", region: "europe", name: { nb: "Moldova", en: "Moldova" }, capital: { nb: "Chișinău", en: "Chișinău" } },
  { code: "mc", region: "europe", name: { nb: "Monaco", en: "Monaco" }, capital: { nb: "Monaco", en: "Monaco" } },
  { code: "me", region: "europe", name: { nb: "Montenegro", en: "Montenegro" }, capital: { nb: "Podgorica", en: "Podgorica" } },
  { code: "nl", region: "europe", name: { nb: "Nederland", en: "Netherlands" }, capital: { nb: "Amsterdam", en: "Amsterdam" } },
  { code: "mk", region: "europe", name: { nb: "Nord-Makedonia", en: "North Macedonia" }, capital: { nb: "Skopje", en: "Skopje" } },
  { code: "no", region: "europe", name: { nb: "Norge", en: "Norway" }, capital: { nb: "Oslo", en: "Oslo" } },
  { code: "pl", region: "europe", name: { nb: "Polen", en: "Poland" }, capital: { nb: "Warszawa", en: "Warsaw" } },
  { code: "pt", region: "europe", name: { nb: "Portugal", en: "Portugal" }, capital: { nb: "Lisboa", en: "Lisbon" } },
  { code: "ro", region: "europe", name: { nb: "Romania", en: "Romania" }, capital: { nb: "București", en: "Bucharest" } },
  { code: "sm", region: "europe", name: { nb: "San Marino", en: "San Marino" }, capital: { nb: "San Marino", en: "San Marino" } },
  { code: "rs", region: "europe", name: { nb: "Serbia", en: "Serbia" }, capital: { nb: "Beograd", en: "Belgrade" } },
  { code: "sk", region: "europe", name: { nb: "Slovakia", en: "Slovakia" }, capital: { nb: "Bratislava", en: "Bratislava" } },
  { code: "si", region: "europe", name: { nb: "Slovenia", en: "Slovenia" }, capital: { nb: "Ljubljana", en: "Ljubljana" } },
  { code: "es", region: "europe", name: { nb: "Spania", en: "Spain" }, capital: { nb: "Madrid", en: "Madrid" } },
  { code: "se", region: "europe", name: { nb: "Sverige", en: "Sweden" }, capital: { nb: "Stockholm", en: "Stockholm" } },
  { code: "ch", region: "europe", name: { nb: "Sveits", en: "Switzerland" }, capital: { nb: "Bern", en: "Bern" } },
  { code: "ua", region: "europe", name: { nb: "Ukraina", en: "Ukraine" }, capital: { nb: "Kyiv", en: "Kyiv" } },
  { code: "gb", region: "europe", name: { nb: "Storbritannia", en: "United Kingdom" }, capital: { nb: "London", en: "London" } },
  { code: "va", region: "europe", name: { nb: "Vatikanstaten", en: "Vatican City" }, capital: { nb: "Vatikanstaten", en: "Vatican City" } },
  { code: "au", region: "oceania", name: { nb: "Australia", en: "Australia" }, capital: { nb: "Canberra", en: "Canberra" } },
  { code: "fj", region: "oceania", name: { nb: "Fiji", en: "Fiji" }, capital: { nb: "Suva", en: "Suva" } },
  { code: "ki", region: "oceania", name: { nb: "Kiribati", en: "Kiribati" }, capital: { nb: "South Tarawa", en: "South Tarawa" } },
  { code: "mh", region: "oceania", name: { nb: "Marshalløyene", en: "Marshall Islands" }, capital: { nb: "Majuro", en: "Majuro" } },
  { code: "fm", region: "oceania", name: { nb: "Mikronesiaføderasjonen", en: "Micronesia" }, capital: { nb: "Palikir", en: "Palikir" } },
  { code: "nr", region: "oceania", name: { nb: "Nauru", en: "Nauru" }, capital: { nb: "Yaren", en: "Yaren" } },
  { code: "nz", region: "oceania", name: { nb: "New Zealand", en: "New Zealand" }, capital: { nb: "Wellington", en: "Wellington" } },
  { code: "pw", region: "oceania", name: { nb: "Palau", en: "Palau" }, capital: { nb: "Ngerulmud", en: "Ngerulmud" } },
  { code: "pg", region: "oceania", name: { nb: "Papua Ny-Guinea", en: "Papua New Guinea" }, capital: { nb: "Port Moresby", en: "Port Moresby" } },
  { code: "ws", region: "oceania", name: { nb: "Samoa", en: "Samoa" }, capital: { nb: "Apia", en: "Apia" } },
  { code: "sb", region: "oceania", name: { nb: "Salomonøyene", en: "Solomon Islands" }, capital: { nb: "Honiara", en: "Honiara" } },
  { code: "to", region: "oceania", name: { nb: "Tonga", en: "Tonga" }, capital: { nb: "Nukuʻalofa", en: "Nukuʻalofa" } },
  { code: "tv", region: "oceania", name: { nb: "Tuvalu", en: "Tuvalu" }, capital: { nb: "Funafuti", en: "Funafuti" } },
  { code: "vu", region: "oceania", name: { nb: "Vanuatu", en: "Vanuatu" }, capital: { nb: "Port Vila", en: "Port Vila" } },
  { code: "tw", region: "east-south-asia", name: { nb: "Taiwan", en: "Taiwan" }, capital: { nb: "Taipei", en: "Taipei" } },
].map(defineCountry);

const otherPlaces = [
  { code: "ax", region: "europe", name: { nb: "Åland", en: "Åland" }, capital: { nb: "Mariehamn", en: "Mariehamn" }, status: { nb: "Selvstyrt del av Finland", en: "Autonomous part of Finland" }, relatedCountryCode: "fi" },
  { code: "fo", region: "europe", name: { nb: "Færøyene", en: "Faroe Islands" }, capital: { nb: "Tórshavn", en: "Tórshavn" }, status: { nb: "Selvstyrt del av Kongeriket Danmark", en: "Self-governing part of the Kingdom of Denmark" }, relatedCountryCode: "dk" },
  { code: "im", region: "europe", name: { nb: "Man", en: "Isle of Man" }, capital: { nb: "Douglas", en: "Douglas" }, status: { nb: "Britisk kronbesittelse, ikke en del av Storbritannia", en: "Crown dependency, not part of the United Kingdom" }, relatedCountryCode: "gb" },
  { code: "je", region: "europe", name: { nb: "Jersey", en: "Jersey" }, capital: { nb: "Saint Helier", en: "Saint Helier" }, status: { nb: "Britisk kronbesittelse, ikke en del av Storbritannia", en: "Crown dependency, not part of the United Kingdom" }, relatedCountryCode: "gb" },
  { code: "gg", region: "europe", name: { nb: "Guernsey", en: "Guernsey" }, capital: { nb: "Saint Peter Port", en: "Saint Peter Port" }, status: { nb: "Britisk kronbesittelse, ikke en del av Storbritannia", en: "Crown dependency, not part of the United Kingdom" }, relatedCountryCode: "gb" },
  { code: "gi", region: "europe", name: { nb: "Gibraltar", en: "Gibraltar" }, capital: { nb: "Gibraltar", en: "Gibraltar" }, status: { nb: "Britisk oversjøisk territorium", en: "British Overseas Territory" }, relatedCountryCode: "gb" },
  { code: "gl", region: "north-central-america", name: { nb: "Grønland", en: "Greenland" }, capital: { nb: "Nuuk", en: "Nuuk" }, status: { nb: "Selvstyrt territorium i Kongeriket Danmark", en: "Autonomous territory within the Kingdom of Denmark" }, relatedCountryCode: "dk" },
  { code: "bm", region: "north-central-america", name: { nb: "Bermuda", en: "Bermuda" }, capital: { nb: "Hamilton", en: "Hamilton" }, status: { nb: "Britisk oversjøisk territorium", en: "British Overseas Territory" }, relatedCountryCode: "gb" },
  { code: "pr", region: "caribbean", name: { nb: "Puerto Rico", en: "Puerto Rico" }, capital: { nb: "San Juan", en: "San Juan" }, status: { nb: "Selvstyrt amerikansk territorium", en: "Self-governing United States territory" }, relatedCountryCode: "us" },
  { code: "vi", region: "caribbean", name: { nb: "De amerikanske Jomfruøyene", en: "US Virgin Islands" }, capital: { nb: "Charlotte Amalie", en: "Charlotte Amalie" }, status: { nb: "Amerikansk territorium", en: "United States territory" }, relatedCountryCode: "us" },
  { code: "aw", region: "caribbean", name: { nb: "Aruba", en: "Aruba" }, capital: { nb: "Oranjestad", en: "Oranjestad" }, status: { nb: "Konstituerende land i Kongeriket Nederlandene", en: "Constituent country within the Kingdom of the Netherlands" }, relatedCountryCode: "nl" },
  { code: "cw", region: "caribbean", name: { nb: "Curaçao", en: "Curaçao" }, capital: { nb: "Willemstad", en: "Willemstad" }, status: { nb: "Konstituerende land i Kongeriket Nederlandene", en: "Constituent country within the Kingdom of the Netherlands" }, relatedCountryCode: "nl" },
  { code: "sx", region: "caribbean", name: { nb: "Sint Maarten", en: "Sint Maarten" }, capital: { nb: "Philipsburg", en: "Philipsburg" }, status: { nb: "Konstituerende land i Kongeriket Nederlandene", en: "Constituent country within the Kingdom of the Netherlands" }, relatedCountryCode: "nl" },
  { code: "gp", region: "caribbean", name: { nb: "Guadeloupe", en: "Guadeloupe" }, capital: { nb: "Basse-Terre", en: "Basse-Terre" }, status: { nb: "Oversjøisk region i Frankrike", en: "Overseas region of France" }, relatedCountryCode: "fr", flagStatus: "established-local" },
  { code: "mq", region: "caribbean", name: { nb: "Martinique", en: "Martinique" }, capital: { nb: "Fort-de-France", en: "Fort-de-France" }, status: { nb: "Oversjøisk region i Frankrike", en: "Overseas region of France" }, relatedCountryCode: "fr" },
  { code: "ky", region: "caribbean", name: { nb: "Caymanøyene", en: "Cayman Islands" }, capital: { nb: "George Town", en: "George Town" }, status: { nb: "Britisk oversjøisk territorium", en: "British Overseas Territory" }, relatedCountryCode: "gb" },
  { code: "gf", region: "south-america", name: { nb: "Fransk Guyana", en: "French Guiana" }, capital: { nb: "Cayenne", en: "Cayenne" }, status: { nb: "Oversjøisk region i Frankrike", en: "Overseas region of France" }, relatedCountryCode: "fr", flagStatus: "established-local" },
  { code: "fk", region: "south-america", name: { nb: "Falklandsøyene", en: "Falkland Islands" }, capital: { nb: "Stanley", en: "Stanley" }, status: { nb: "Britisk oversjøisk territorium; kreves av Argentina", en: "British Overseas Territory; claimed by Argentina" }, relatedCountryCode: "gb" },
  { code: "eh", region: "north-west-africa", name: { nb: "Vest-Sahara", en: "Western Sahara" }, capital: { nb: "El Aaiún / Tifariti", en: "El Aaiún / Tifariti" }, status: { nb: "Omstridt territorium", en: "Disputed territory" }, note: { nb: "El Aaiún er det største administrative sentrumet. Saharawiske myndigheter regner Tifariti som en midlertidig hovedstad.", en: "El Aaiún is the largest administrative centre. Sahrawi authorities identify Tifariti as a temporary capital." } },
  { code: "re", region: "east-south-africa", name: { nb: "Réunion", en: "Réunion" }, capital: { nb: "Saint-Denis", en: "Saint-Denis" }, status: { nb: "Oversjøisk region i Frankrike", en: "Overseas region of France" }, relatedCountryCode: "fr", flagStatus: "established-local" },
  { code: "yt", region: "east-south-africa", name: { nb: "Mayotte", en: "Mayotte" }, capital: { nb: "Mamoudzou", en: "Mamoudzou" }, status: { nb: "Oversjøisk departement i Frankrike; kreves av Komorene", en: "Overseas department of France; claimed by Comoros" }, relatedCountryCode: "fr", flagStatus: "established-local" },
  { code: "hk", region: "east-south-asia", name: { nb: "Hongkong", en: "Hong Kong" }, capital: { nb: "Hongkong", en: "Hong Kong" }, status: { nb: "Spesiell administrativ region i Kina", en: "Special administrative region of China" }, relatedCountryCode: "cn" },
  { code: "mo", region: "east-south-asia", name: { nb: "Macao", en: "Macau" }, capital: { nb: "Macao", en: "Macau" }, status: { nb: "Spesiell administrativ region i Kina", en: "Special administrative region of China" }, relatedCountryCode: "cn" },
  { code: "ck", region: "oceania", name: { nb: "Cookøyene", en: "Cook Islands" }, capital: { nb: "Avarua", en: "Avarua" }, status: { nb: "Selvstyrt stat i fri assosiasjon med New Zealand", en: "Self-governing state in free association with New Zealand" }, relatedCountryCode: "nz" },
  { code: "nu", region: "oceania", name: { nb: "Niue", en: "Niue" }, capital: { nb: "Alofi", en: "Alofi" }, status: { nb: "Selvstyrt stat i fri assosiasjon med New Zealand", en: "Self-governing state in free association with New Zealand" }, relatedCountryCode: "nz" },
  { code: "gu", region: "oceania", name: { nb: "Guam", en: "Guam" }, capital: { nb: "Hagåtña", en: "Hagåtña" }, status: { nb: "Amerikansk territorium", en: "United States territory" }, relatedCountryCode: "us" },
  { code: "mp", region: "oceania", name: { nb: "Nord-Marianene", en: "Northern Mariana Islands" }, capital: { nb: "Saipan", en: "Saipan" }, status: { nb: "Samvelde i politisk union med USA", en: "Commonwealth in political union with the United States" }, relatedCountryCode: "us" },
  { code: "as", region: "oceania", name: { nb: "Amerikansk Samoa", en: "American Samoa" }, capital: { nb: "Pago Pago", en: "Pago Pago" }, status: { nb: "Amerikansk territorium", en: "United States territory" }, relatedCountryCode: "us" },
  { code: "nc", region: "oceania", name: { nb: "Ny-Caledonia", en: "New Caledonia" }, capital: { nb: "Nouméa", en: "Nouméa" }, status: { nb: "Fransk særkollektivitet", en: "Special collectivity of France" }, relatedCountryCode: "fr" },
  { code: "pf", region: "oceania", name: { nb: "Fransk Polynesia", en: "French Polynesia" }, capital: { nb: "Papeete", en: "Papeete" }, status: { nb: "Oversjøisk land i Frankrike", en: "Overseas country of France" }, relatedCountryCode: "fr" },
].map((place) => defineCountry({ ...place, category: "other-place" }));

const places = [...countries, ...otherPlaces];

if (countries.length !== 197) {
  throw new Error(
    `Expected 197 countries in countries.js, found ${countries.length}`,
  );
}
if (otherPlaces.length !== 30 || places.length !== 227) {
  throw new Error(`Expected 30 other places and 227 total places, found ${otherPlaces.length} and ${places.length}`);
}
const officialCountryCodes = new Set(countries.map((country) => country.code));
places.forEach((place) => {
  if (!new Set(["country", "other-place"]).has(place.category)) {
    throw new Error(`Invalid category for place code: ${place.code}`);
  }
  if (!new Set(["official", "established-local"]).has(place.flagStatus)) {
    throw new Error(`Invalid flag status for place code: ${place.code}`);
  }
  if (place.category === "country" && (place.status || place.relatedCountryCode)) {
    throw new Error(`Countries cannot have relationship metadata: ${place.code}`);
  }
  if (place.category === "other-place" && !place.status) {
    throw new Error(`Other place is missing status metadata: ${place.code}`);
  }
  if (place.relatedCountryCode && !officialCountryCodes.has(place.relatedCountryCode)) {
    throw new Error(`Unknown related country for place code: ${place.code}`);
  }
  if (!place.centres.length) {
    throw new Error(`Place is missing civic centres: ${place.code}`);
  }
  place.centres.forEach((centre) => {
    if (!new Set(["quiz", "secondary", "planned"]).has(centre.kind)) {
      throw new Error(`Invalid civic-centre kind for place code: ${place.code}`);
    }
    supportedLocales.forEach((locale) => {
      if (!centre.name[locale]?.trim() || !centre.role[locale]?.trim()) {
        throw new Error(`Incomplete ${locale} civic-centre data for place code: ${place.code}`);
      }
    });
  });
});

const regionOptions = [
  { id: "world", label: { nb: "Hele verden", en: "Whole world" } },
  { id: "europe", label: { nb: "Europa", en: "Europe" } },
  {
    id: "north-west-africa",
    label: { nb: "Afrika (Nord/Vest)", en: "Africa (North/West)" },
  },
  {
    id: "east-south-africa",
    label: { nb: "Afrika (Øst/Sør)", en: "Africa (East/South)" },
  },
  {
    id: "west-central-asia",
    label: { nb: "Asia (Vest/Sentral)", en: "Asia (West/Central)" },
  },
  {
    id: "east-south-asia",
    label: { nb: "Asia (Øst/Sør)", en: "Asia (East/South)" },
  },
  { id: "oceania", label: { nb: "Oseania", en: "Oceania" } },
  {
    id: "north-central-america",
    label: {
      nb: "Nord- og Mellom-Amerika",
      en: "North and Central America",
    },
  },
  { id: "south-america", label: { nb: "Sør-Amerika", en: "South America" } },
  { id: "caribbean", label: { nb: "Karibia", en: "Caribbean" } },
].map((region) => {
  supportedLocales.forEach((locale) => {
    if (!region.label[locale]?.trim()) {
      throw new Error(
        `Incomplete ${locale} name for region: ${region.id}`,
      );
    }
  });
  return Object.freeze({
    ...region,
    label: Object.freeze(region.label),
  });
});

window.GEOGRAFI_QUIZ_DATA = Object.freeze({
  countries: Object.freeze(countries),
  otherPlaces: Object.freeze(otherPlaces),
  places: Object.freeze(places),
  regionOptions: Object.freeze(regionOptions),
});
})();
