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

  const rawFlagDistractorGroups = [
    { id: "nordic-cross", codes: ["dk", "fi", "is", "no", "se"] },
    { id: "union-jack-canton", codes: ["au", "fj", "nz", "tv"] },
    { id: "green-white-warm-tricolour", codes: ["ci", "ie", "it", "mx"] },
    { id: "red-white-horizontal", codes: ["id", "mc", "pl"] },
    { id: "netherlands-luxembourg", codes: ["lu", "nl"] },
    { id: "yellow-blue-red-horizontal", codes: ["co", "ec", "ve"] },
    { id: "pan-african-vertical", codes: ["cm", "gn", "ml", "sn"] },
    { id: "serrated-red-white", codes: ["bh", "qa"] },
    { id: "centred-disc", codes: ["bd", "jp", "pw"] },
    { id: "stars-and-stripes", codes: ["lr", "my", "us"] },
    { id: "pan-arab-triangle", codes: ["jo", "ps", "sd"] },
    { id: "slavic-tricolour", codes: ["hr", "ru", "rs", "si", "sk"] },
    { id: "central-america-blue-white", codes: ["gt", "hn", "ni", "sv"] },
    { id: "blue-white-stripes", codes: ["gr", "uy"] },
    { id: "blue-yellow-red-vertical", codes: ["ad", "md", "ro", "td"] },
    { id: "red-crescent-star", codes: ["tn", "tr"] },
    { id: "name-austria-australia", codes: ["at", "au"] },
    { id: "name-niger-nigeria", codes: ["ne", "ng"] },
    { id: "name-congos", codes: ["cd", "cg"] },
    { id: "name-guineas", codes: ["gq", "gn", "gw", "pg"] },
    { id: "name-sudans", codes: ["sd", "ss"] },
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
    validateCodes(group.codes, `flag distractor group ${group.id}`);
    return Object.freeze({
      id: group.id,
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
