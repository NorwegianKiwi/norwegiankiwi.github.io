(function () {
  "use strict";

const supportedLocales = ["nb", "en"];
const primaryRegions = new Set([
  "europe",
  "africa",
  "asia",
  "oceania",
  "north-central-america",
  "south-america",
  "caribbean",
]);
const countryCodes = new Set();

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
  return Object.freeze({
    ...country,
    name: Object.freeze(country.name),
    capital: Object.freeze(country.capital),
    note: country.note ? Object.freeze(country.note) : null,
  });
}

const countries = [
  { code: "dz", region: "africa", name: { nb: "Algerie", en: "Algeria" }, capital: { nb: "Alger", en: "Algiers" } },
  { code: "ao", region: "africa", name: { nb: "Angola", en: "Angola" }, capital: { nb: "Luanda", en: "Luanda" } },
  { code: "bj", region: "africa", name: { nb: "Benin", en: "Benin" }, capital: { nb: "Porto-Novo", en: "Porto-Novo" } },
  { code: "bw", region: "africa", name: { nb: "Botswana", en: "Botswana" }, capital: { nb: "Gaborone", en: "Gaborone" } },
  { code: "bf", region: "africa", name: { nb: "Burkina Faso", en: "Burkina Faso" }, capital: { nb: "Ouagadougou", en: "Ouagadougou" } },
  { code: "bi", region: "africa", name: { nb: "Burundi", en: "Burundi" }, capital: { nb: "Gitega", en: "Gitega" } },
  { code: "cv", region: "africa", name: { nb: "Kapp Verde", en: "Cape Verde" }, capital: { nb: "Praia", en: "Praia" } },
  { code: "cm", region: "africa", name: { nb: "Kamerun", en: "Cameroon" }, capital: { nb: "Yaoundé", en: "Yaoundé" } },
  { code: "cf", region: "africa", name: { nb: "Den sentralafrikanske republikk", en: "Central African Republic" }, capital: { nb: "Bangui", en: "Bangui" } },
  { code: "td", region: "africa", name: { nb: "Tsjad", en: "Chad" }, capital: { nb: "N'Djamena", en: "N'Djamena" } },
  { code: "km", region: "africa", name: { nb: "Komorene", en: "Comoros" }, capital: { nb: "Moroni", en: "Moroni" } },
  { code: "cg", region: "africa", name: { nb: "Republikken Kongo", en: "Republic of the Congo" }, capital: { nb: "Brazzaville", en: "Brazzaville" } },
  { code: "cd", region: "africa", name: { nb: "Den demokratiske republikken Kongo", en: "Democratic Republic of the Congo" }, capital: { nb: "Kinshasa", en: "Kinshasa" } },
  { code: "ci", region: "africa", name: { nb: "Elfenbenskysten", en: "Côte d’Ivoire" }, capital: { nb: "Yamoussoukro", en: "Yamoussoukro" } },
  { code: "dj", region: "africa", name: { nb: "Djibouti", en: "Djibouti" }, capital: { nb: "Djibouti", en: "Djibouti" } },
  { code: "eg", region: "africa", name: { nb: "Egypt", en: "Egypt" }, capital: { nb: "Kairo", en: "Cairo" } },
  { code: "gq", region: "africa", name: { nb: "Ekvatorial-Guinea", en: "Equatorial Guinea" }, capital: { nb: "Malabo", en: "Malabo" } },
  { code: "er", region: "africa", name: { nb: "Eritrea", en: "Eritrea" }, capital: { nb: "Asmara", en: "Asmara" } },
  { code: "sz", region: "africa", name: { nb: "Eswatini", en: "Eswatini" }, capital: { nb: "Mbabane / Lobamba", en: "Mbabane / Lobamba" } },
  { code: "et", region: "africa", name: { nb: "Etiopia", en: "Ethiopia" }, capital: { nb: "Addis Abeba", en: "Addis Abeba" } },
  { code: "ga", region: "africa", name: { nb: "Gabon", en: "Gabon" }, capital: { nb: "Libreville", en: "Libreville" } },
  { code: "gm", region: "africa", name: { nb: "Gambia", en: "Gambia" }, capital: { nb: "Banjul", en: "Banjul" } },
  { code: "gh", region: "africa", name: { nb: "Ghana", en: "Ghana" }, capital: { nb: "Accra", en: "Accra" } },
  { code: "gn", region: "africa", name: { nb: "Guinea", en: "Guinea" }, capital: { nb: "Conakry", en: "Conakry" } },
  { code: "gw", region: "africa", name: { nb: "Guinea-Bissau", en: "Guinea-Bissau" }, capital: { nb: "Bissau", en: "Bissau" } },
  { code: "ke", region: "africa", name: { nb: "Kenya", en: "Kenya" }, capital: { nb: "Nairobi", en: "Nairobi" } },
  { code: "ls", region: "africa", name: { nb: "Lesotho", en: "Lesotho" }, capital: { nb: "Maseru", en: "Maseru" } },
  { code: "lr", region: "africa", name: { nb: "Liberia", en: "Liberia" }, capital: { nb: "Monrovia", en: "Monrovia" } },
  { code: "ly", region: "africa", name: { nb: "Libya", en: "Libya" }, capital: { nb: "Tripoli", en: "Tripoli" } },
  { code: "mg", region: "africa", name: { nb: "Madagaskar", en: "Madagascar" }, capital: { nb: "Antananarivo", en: "Antananarivo" } },
  { code: "mw", region: "africa", name: { nb: "Malawi", en: "Malawi" }, capital: { nb: "Lilongwe", en: "Lilongwe" } },
  { code: "ml", region: "africa", name: { nb: "Mali", en: "Mali" }, capital: { nb: "Bamako", en: "Bamako" } },
  { code: "mr", region: "africa", name: { nb: "Mauritania", en: "Mauritania" }, capital: { nb: "Nouakchott", en: "Nouakchott" } },
  { code: "mu", region: "africa", name: { nb: "Mauritius", en: "Mauritius" }, capital: { nb: "Port Louis", en: "Port Louis" } },
  { code: "ma", region: "africa", name: { nb: "Marokko", en: "Morocco" }, capital: { nb: "Rabat", en: "Rabat" } },
  { code: "mz", region: "africa", name: { nb: "Mosambik", en: "Mozambique" }, capital: { nb: "Maputo", en: "Maputo" } },
  { code: "na", region: "africa", name: { nb: "Namibia", en: "Namibia" }, capital: { nb: "Windhoek", en: "Windhoek" } },
  { code: "ne", region: "africa", name: { nb: "Niger", en: "Niger" }, capital: { nb: "Niamey", en: "Niamey" } },
  { code: "ng", region: "africa", name: { nb: "Nigeria", en: "Nigeria" }, capital: { nb: "Abuja", en: "Abuja" } },
  { code: "rw", region: "africa", name: { nb: "Rwanda", en: "Rwanda" }, capital: { nb: "Kigali", en: "Kigali" } },
  { code: "st", region: "africa", name: { nb: "São Tomé og Príncipe", en: "São Tomé and Príncipe" }, capital: { nb: "São Tomé", en: "São Tomé" } },
  { code: "sn", region: "africa", name: { nb: "Senegal", en: "Senegal" }, capital: { nb: "Dakar", en: "Dakar" } },
  { code: "sc", region: "africa", name: { nb: "Seychellene", en: "Seychelles" }, capital: { nb: "Victoria", en: "Victoria" } },
  { code: "sl", region: "africa", name: { nb: "Sierra Leone", en: "Sierra Leone" }, capital: { nb: "Freetown", en: "Freetown" } },
  { code: "so", region: "africa", name: { nb: "Somalia", en: "Somalia" }, capital: { nb: "Mogadishu", en: "Mogadishu" } },
  { code: "za", region: "africa", name: { nb: "Sør-Afrika", en: "South Africa" }, capital: { nb: "Pretoria / Cape Town / Bloemfontein", en: "Pretoria / Cape Town / Bloemfontein" }, note: { nb: "Sør-Afrika har tre hovedsteder: Pretoria er administrativ hovedstad, Cape Town er lovgivende hovedstad, og Bloemfontein er juridisk hovedstad.", en: "South Africa has three capitals: Pretoria is the administrative capital, Cape Town is the legislative capital, and Bloemfontein is the judicial capital." } },
  { code: "ss", region: "africa", name: { nb: "Sør-Sudan", en: "South Sudan" }, capital: { nb: "Juba", en: "Juba" } },
  { code: "sd", region: "africa", name: { nb: "Sudan", en: "Sudan" }, capital: { nb: "Khartoum", en: "Khartoum" } },
  { code: "tz", region: "africa", name: { nb: "Tanzania", en: "Tanzania" }, capital: { nb: "Dodoma", en: "Dodoma" } },
  { code: "tg", region: "africa", name: { nb: "Togo", en: "Togo" }, capital: { nb: "Lomé", en: "Lomé" } },
  { code: "tn", region: "africa", name: { nb: "Tunisia", en: "Tunisia" }, capital: { nb: "Tunis", en: "Tunis" } },
  { code: "ug", region: "africa", name: { nb: "Uganda", en: "Uganda" }, capital: { nb: "Kampala", en: "Kampala" } },
  { code: "zm", region: "africa", name: { nb: "Zambia", en: "Zambia" }, capital: { nb: "Lusaka", en: "Lusaka" } },
  { code: "zw", region: "africa", name: { nb: "Zimbabwe", en: "Zimbabwe" }, capital: { nb: "Harare", en: "Harare" } },
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
  { code: "af", region: "asia", name: { nb: "Afghanistan", en: "Afghanistan" }, capital: { nb: "Kabul", en: "Kabul" } },
  { code: "am", region: "asia", name: { nb: "Armenia", en: "Armenia" }, capital: { nb: "Jerevan", en: "Yerevan" } },
  { code: "az", region: "asia", name: { nb: "Aserbajdsjan", en: "Azerbaijan" }, capital: { nb: "Baku", en: "Baku" } },
  { code: "bh", region: "asia", name: { nb: "Bahrain", en: "Bahrain" }, capital: { nb: "Manama", en: "Manama" } },
  { code: "bd", region: "asia", name: { nb: "Bangladesh", en: "Bangladesh" }, capital: { nb: "Dhaka", en: "Dhaka" } },
  { code: "bt", region: "asia", name: { nb: "Bhutan", en: "Bhutan" }, capital: { nb: "Thimphu", en: "Thimphu" } },
  { code: "bn", region: "asia", name: { nb: "Brunei", en: "Brunei" }, capital: { nb: "Bandar Seri Begawan", en: "Bandar Seri Begawan" } },
  { code: "kh", region: "asia", name: { nb: "Kambodsja", en: "Cambodia" }, capital: { nb: "Phnom Penh", en: "Phnom Penh" } },
  { code: "cn", region: "asia", name: { nb: "Kina", en: "China" }, capital: { nb: "Beijing", en: "Beijing" } },
  { code: "cy", region: "asia", name: { nb: "Kypros", en: "Cyprus" }, capital: { nb: "Nikosia", en: "Nicosia" }, note: { nb: "FN plasserer Kypros i Vest-Asia i M49-inndelingen, mens landet har vært medlem av EU siden 2004.", en: "The UN places Cyprus in Western Asia in its M49 classification, while the country has been an EU member since 2004." } },
  { code: "ge", region: "asia", name: { nb: "Georgia", en: "Georgia" }, capital: { nb: "Tbilisi", en: "Tbilisi" } },
  { code: "in", region: "asia", name: { nb: "India", en: "India" }, capital: { nb: "New Delhi", en: "New Delhi" } },
  { code: "id", region: "asia", name: { nb: "Indonesia", en: "Indonesia" }, capital: { nb: "Jakarta / Nusantara", en: "Jakarta / Nusantara" } },
  { code: "ir", region: "asia", name: { nb: "Iran", en: "Iran" }, capital: { nb: "Teheran", en: "Tehran" } },
  { code: "iq", region: "asia", name: { nb: "Irak", en: "Iraq" }, capital: { nb: "Bagdad", en: "Baghdad" } },
  { code: "il", region: "asia", name: { nb: "Israel", en: "Israel" }, capital: { nb: "Jerusalem", en: "Jerusalem" } },
  { code: "jp", region: "asia", name: { nb: "Japan", en: "Japan" }, capital: { nb: "Tokyo", en: "Tokyo" } },
  { code: "jo", region: "asia", name: { nb: "Jordan", en: "Jordan" }, capital: { nb: "Amman", en: "Amman" } },
  { code: "kz", region: "asia", name: { nb: "Kasakhstan", en: "Kazakhstan" }, capital: { nb: "Astana", en: "Astana" } },
  { code: "kw", region: "asia", name: { nb: "Kuwait", en: "Kuwait" }, capital: { nb: "Kuwait by", en: "Kuwait City" } },
  { code: "kg", region: "asia", name: { nb: "Kirgisistan", en: "Kyrgyzstan" }, capital: { nb: "Bisjkek", en: "Bishkek" } },
  { code: "la", region: "asia", name: { nb: "Laos", en: "Laos" }, capital: { nb: "Vientiane", en: "Vientiane" } },
  { code: "lb", region: "asia", name: { nb: "Libanon", en: "Lebanon" }, capital: { nb: "Beirut", en: "Beirut" } },
  { code: "my", region: "asia", name: { nb: "Malaysia", en: "Malaysia" }, capital: { nb: "Kuala Lumpur / Putrajaya", en: "Kuala Lumpur / Putrajaya" } },
  { code: "mv", region: "asia", name: { nb: "Maldivene", en: "Maldives" }, capital: { nb: "Malé", en: "Malé" } },
  { code: "mn", region: "asia", name: { nb: "Mongolia", en: "Mongolia" }, capital: { nb: "Ulaanbaatar", en: "Ulaanbaatar" } },
  { code: "mm", region: "asia", name: { nb: "Myanmar", en: "Myanmar" }, capital: { nb: "Naypyidaw", en: "Naypyidaw" } },
  { code: "np", region: "asia", name: { nb: "Nepal", en: "Nepal" }, capital: { nb: "Katmandu", en: "Kathmandu" } },
  { code: "kp", region: "asia", name: { nb: "Nord-Korea", en: "North Korea" }, capital: { nb: "Pyongyang", en: "Pyongyang" } },
  { code: "om", region: "asia", name: { nb: "Oman", en: "Oman" }, capital: { nb: "Muskat", en: "Muscat" } },
  { code: "pk", region: "asia", name: { nb: "Pakistan", en: "Pakistan" }, capital: { nb: "Islamabad", en: "Islamabad" } },
  { code: "ps", region: "asia", name: { nb: "Palestina", en: "Palestine" }, capital: { nb: "Øst-Jerusalem / Ramallah", en: "East Jerusalem / Ramallah" } },
  { code: "ph", region: "asia", name: { nb: "Filippinene", en: "Philippines" }, capital: { nb: "Manila", en: "Manila" } },
  { code: "qa", region: "asia", name: { nb: "Qatar", en: "Qatar" }, capital: { nb: "Doha", en: "Doha" } },
  { code: "ru", region: "asia", name: { nb: "Russland", en: "Russia" }, capital: { nb: "Moskva", en: "Moscow" }, note: { nb: "Russland ligger i både Europa og Asia. I denne quizen er landet plassert i Asia for å gi én tydelig regioninndeling og et mer lesbart regionkart.", en: "Russia lies in both Europe and Asia. In this quiz it is placed in Asia to provide one clear regional classification and a more legible regional map." } },
  { code: "sa", region: "asia", name: { nb: "Saudi-Arabia", en: "Saudi Arabia" }, capital: { nb: "Riyadh", en: "Riyadh" } },
  { code: "sg", region: "asia", name: { nb: "Singapore", en: "Singapore" }, capital: { nb: "Singapore", en: "Singapore" } },
  { code: "kr", region: "asia", name: { nb: "Sør-Korea", en: "South Korea" }, capital: { nb: "Seoul", en: "Seoul" } },
  { code: "lk", region: "asia", name: { nb: "Sri Lanka", en: "Sri Lanka" }, capital: { nb: "Sri Jayawardenepura Kotte / Colombo", en: "Sri Jayawardenepura Kotte / Colombo" } },
  { code: "sy", region: "asia", name: { nb: "Syria", en: "Syria" }, capital: { nb: "Damaskus", en: "Damascus" } },
  { code: "tj", region: "asia", name: { nb: "Tadsjikistan", en: "Tajikistan" }, capital: { nb: "Dusjanbe", en: "Dushanbe" } },
  { code: "th", region: "asia", name: { nb: "Thailand", en: "Thailand" }, capital: { nb: "Bangkok", en: "Bangkok" } },
  { code: "tl", region: "asia", name: { nb: "Øst-Timor", en: "Timor-Leste" }, capital: { nb: "Dili", en: "Dili" } },
  { code: "tr", region: "asia", name: { nb: "Tyrkia", en: "Türkiye" }, capital: { nb: "Ankara", en: "Ankara" }, note: { nb: "Tyrkia ligger i både Asia og Europa. I denne quizen er landet plassert i Asia etter FNs M49-inndeling.", en: "Türkiye lies in both Asia and Europe. In this quiz it is placed in Asia in accordance with the UN M49 classification." } },
  { code: "tm", region: "asia", name: { nb: "Turkmenistan", en: "Turkmenistan" }, capital: { nb: "Asjkhabad", en: "Asjkhabad" } },
  { code: "ae", region: "asia", name: { nb: "De forente arabiske emirater", en: "United Arab Emirates" }, capital: { nb: "Abu Dhabi", en: "Abu Dhabi" } },
  { code: "uz", region: "asia", name: { nb: "Usbekistan", en: "Uzbekistan" }, capital: { nb: "Tasjkent", en: "Tashkent" } },
  { code: "vn", region: "asia", name: { nb: "Vietnam", en: "Vietnam" }, capital: { nb: "Hanoi", en: "Hanoi" } },
  { code: "ye", region: "asia", name: { nb: "Jemen", en: "Yemen" }, capital: { nb: "Sana", en: "Sana’a" } },
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
].map(defineCountry);

if (countries.length !== 196) {
  throw new Error(
    `Expected 196 countries in countries.js, found ${countries.length}`,
  );
}

const regionOptions = [
  { id: "world", label: { nb: "Hele verden", en: "Whole world" } },
  { id: "europe", label: { nb: "Europa", en: "Europe" } },
  { id: "africa", label: { nb: "Afrika", en: "Africa" } },
  { id: "asia", label: { nb: "Asia", en: "Asia" } },
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
  regionOptions: Object.freeze(regionOptions),
});
})();
