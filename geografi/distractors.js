(function () {
  "use strict";

  const countryData = window.GEOGRAFI_QUIZ_DATA;
  if (!countryData) {
    throw new Error("Distractor data requires countries.js to load first");
  }

  const countryCodes = new Set(
    countryData.countries.map((country) => country.code),
  );
  const groupIds = new Set();
  const groupStrengths = new Set(["primary", "secondary"]);

  function flagGroup(strength, id, codes) {
    return { strength, id, codes };
  }

  const rawFlagDistractorGroups = [
    flagGroup("primary", "nordic-cross", ["dk", "fi", "is", "no", "se"]),
    flagGroup("primary", "union-jack-canton", ["au", "fj", "nz", "tv"]),
    flagGroup("primary", "green-white-warm-tricolour", [
      "ci", "ie", "it", "mx",
    ]),
    flagGroup("primary", "red-white-horizontal", ["id", "mc", "pl", "sg"]),
    flagGroup("primary", "netherlands-luxembourg", ["lu", "nl"]),
    flagGroup("primary", "yellow-blue-red-horizontal", ["co", "ec", "ve"]),
    flagGroup("primary", "pan-african-vertical", ["cm", "gn", "ml", "sn"]),
    flagGroup("primary", "serrated-red-white", ["bh", "qa"]),
    flagGroup("primary", "centred-disc", ["bd", "jp", "pw"]),
    flagGroup("primary", "stars-and-stripes", ["lr", "my", "us"]),
    flagGroup("primary", "pan-arab-triangle", ["jo", "ps", "sd"]),
    flagGroup("primary", "slavic-tricolour", ["hr", "ru", "rs", "si", "sk"]),
    flagGroup("primary", "central-america-blue-white", [
      "gt", "hn", "ni", "sv",
    ]),
    flagGroup("primary", "blue-white-stripes", ["gr", "uy"]),
    flagGroup("primary", "blue-yellow-red-vertical", [
      "ad", "md", "ro", "td",
    ]),
    flagGroup("primary", "red-crescent-star", ["tn", "tr"]),
    flagGroup("primary", "name-austria-australia", ["at", "au"]),
    flagGroup("primary", "name-niger-nigeria", ["ne", "ng"]),
    flagGroup("primary", "name-congos", ["cd", "cg"]),
    flagGroup("primary", "name-guineas", ["gq", "gn", "gw", "pg"]),
    flagGroup("primary", "name-sudans", ["sd", "ss"]),
    flagGroup("primary", "name-koreas", ["kp", "kr"]),
    flagGroup("primary", "india-niger", ["in", "ne"]),
    flagGroup("primary", "china-vietnam", ["cn", "vn"]),
    flagGroup("primary", "argentina-uruguay", ["ar", "uy"]),
    flagGroup("primary", "austria-latvia-lebanon", ["at", "lv", "lb"]),
    flagGroup("primary", "costa-rica-thailand-north-korea", [
      "cr", "th", "kp",
    ]),
    flagGroup("primary", "arab-liberation-tricolour", [
      "eg", "iq", "sy", "ye",
    ]),
    flagGroup("primary", "hungary-bulgaria", ["hu", "bg"]),
    flagGroup("primary", "lithuania-bolivia", ["lt", "bo"]),
    flagGroup("primary", "belgium-germany", ["be", "de"]),
    flagGroup("primary", "southern-cross", ["au", "nz", "pg", "ws"]),

    flagGroup("secondary", "red-white-blue-bands", [
      "bz", "cr", "kp", "th",
    ]),
    flagGroup("secondary", "horizontal-red-white-blue", [
      "hr", "lu", "nl", "py", "ru", "rs", "si", "sk",
    ]),
    flagGroup("secondary", "pan-arab-colours", [
      "ae", "eg", "iq", "jo", "kw", "ly", "ps", "sd", "sy", "ye",
    ]),
    flagGroup("secondary", "crescent-star", [
      "az", "dz", "km", "ly", "mr", "my", "pk", "sg", "tm", "tn",
      "tr", "uz",
    ]),
    flagGroup("secondary", "hoist-triangle-wedge", [
      "bs", "cu", "cz", "dj", "er", "gq", "gy", "jo", "km", "mz",
      "ph", "ps", "sd", "ss", "tl", "vu", "za", "zw",
    ]),
    flagGroup("secondary", "red-white-green", ["bg", "hu", "ir", "om", "tj"]),
    flagGroup("secondary", "red-white-red", ["at", "ca", "lb", "lv", "pe"]),
    flagGroup("secondary", "central-star", [
      "ao", "bf", "cm", "et", "gh", "ma", "mm", "py", "sn", "so",
      "sr", "vn",
    ]),
    flagGroup("secondary", "red-yellow-green", [
      "bj", "bo", "bf", "cg", "cm", "et", "gh", "gn", "gw", "lt",
      "ml", "mm", "mr", "sn", "tg", "zw",
    ]),
    flagGroup("secondary", "pacific-star-fields", [
      "au", "fm", "nz", "sb", "tv", "ws",
    ]),
    flagGroup("secondary", "red-white-blue-stars-stripes", [
      "cl", "cu", "lr", "my", "us",
    ]),
    flagGroup("secondary", "diagonal-bands", [
      "bn", "cd", "kn", "na", "pg", "sb", "tz", "tt",
    ]),
    flagGroup("secondary", "black-yellow-red", ["be", "de", "ug"]),
    flagGroup("secondary", "red-white-cross", ["dk", "ch"]),
    flagGroup("secondary", "blue-yellow", ["se", "ua"]),
  ];

  const rawFlagConflictPairs = [
    ["ro", "td"],
    ["id", "mc"],
  ];

  function validateCodes(codes, label) {
    const uniqueCodes = new Set(codes);
    if (codes.length < 2 || uniqueCodes.size !== codes.length) {
      throw new Error(`${label} must contain at least two unique country codes`);
    }
    codes.forEach((code) => {
      if (!countryCodes.has(code)) {
        throw new Error(`Unknown country code in ${label}: ${code}`);
      }
    });
  }

  const flagDistractorGroups = rawFlagDistractorGroups.map((group) => {
    if (!group.id || groupIds.has(group.id)) {
      throw new Error(`Invalid or duplicate flag distractor group: ${group.id}`);
    }
    groupIds.add(group.id);
    if (!groupStrengths.has(group.strength)) {
      throw new Error(
        `Invalid strength for flag distractor group ${group.id}: ${group.strength}`,
      );
    }
    validateCodes(group.codes, `flag distractor group ${group.id}`);
    return Object.freeze({
      id: group.id,
      strength: group.strength,
      codes: Object.freeze([...group.codes]),
    });
  });

  const conflictPairKeys = new Set();
  const flagConflictPairs = rawFlagConflictPairs.map((codes) => {
    if (codes.length !== 2 || codes[0] === codes[1]) {
      throw new Error("Flag conflict pairs must contain two different countries");
    }
    validateCodes(codes, "flag conflict pair");
    const key = [...codes].sort().join(":");
    if (conflictPairKeys.has(key)) {
      throw new Error(`Duplicate flag conflict pair: ${key}`);
    }
    conflictPairKeys.add(key);
    return Object.freeze([...codes]);
  });

  window.GEOGRAFI_QUIZ_DISTRACTOR_DATA = Object.freeze({
    flagDistractorGroups: Object.freeze(flagDistractorGroups),
    flagConflictPairs: Object.freeze(flagConflictPairs),
  });
})();
