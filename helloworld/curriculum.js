(function (root, factory) {
  "use strict";

  const api = factory(
    root?.GEOGRAFI_QUIZ_DATA?.places ?? root?.GEOGRAFI_QUIZ_DATA?.countries ?? [],
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_CURRICULUM = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function (places) {
  "use strict";

  const MODES = Object.freeze([
    "country-flag",
    "flag-country",
    "map-country",
    "country-capital",
  ]);

  const definitions = [
    ["tour-hello-world", "tour", "Hei, verden!", "Hello, world!", "no us br eg za in cn jp au", 3],
    ["pack-nordics", "pack", "Nordiske land", "Nordic countries", "no se dk fi is", 3],
    ["pack-western-europe", "pack", "Vest-Europa", "Western Europe", "gb ie fr be nl lu", 3],
    ["tour-world-icons", "tour", "Flere verdensikoner", "More world icons", "fr de gb it ca mx ar jm tr ru", 3],
    ["pack-baltic-neighbours", "pack", "Baltiske naboer", "Baltic neighbours", "ee lv lt pl de", 4],
    ["pack-iberia-alps", "pack", "Iberia og Alpene", "Iberia and the Alps", "es pt it ch at li", 4],
    ["pack-central-europe", "pack", "Sentral-Europa", "Central Europe", "cz sk hu si hr ba", 4],
    ["pack-balkans", "pack", "Balkan", "The Balkans", "rs me xk al mk bg", 4],
    ["pack-eastern-europe", "pack", "Øst- og Sørøst-Europa", "Eastern and southeastern Europe", "ro md ua by gr", 4],
    ["pack-european-microstates", "pack", "Europeiske mikrostater og Malta", "European microstates and Malta", "ad mc sm va mt", 4],
    ["pack-north-america", "pack", "Nord-Amerika og porten mot sør", "North America and its southern gateway", "ca us mx bz gt", 4],
    ["pack-central-america", "pack", "Mellom-Amerika", "Central America", "sv hn ni cr pa", 4],
    ["pack-northern-south-america", "pack", "Andesfjellene og Guyana-landene", "The Andes and the Guianas", "co ve gy sr ec pe", 4],
    ["pack-southern-south-america", "pack", "Sørlige Sør-Amerika", "Southern South America", "br bo py uy ar cl", 4],
    ["pack-north-africa", "pack", "Nord-Afrika", "North Africa", "ma dz tn ly eg", 5],
    ["pack-sahel", "pack", "Sahel", "The Sahel", "mr ml bf ne td sn", 5],
    ["pack-atlantic-west-africa", "pack", "Atlanterhavskysten i Vest-Afrika", "Atlantic West Africa", "cv gm gn gw sl lr ci", 5],
    ["pack-gulf-guinea", "pack", "Guineabukta og Sentral-Afrika", "Gulf of Guinea and Central Africa", "gh tg bj ng cm cf gq st", 5],
    ["tour-island-world", "tour", "Øyverden", "Island world", "is ie cu bb mg mu lk id jp nz fj", 4],
    ["pack-east-asia", "pack", "Øst-Asia", "East Asia", "cn jp kr kp mn ru tw", 5],
    ["pack-south-asia", "pack", "Sør-Asia", "South Asia", "af pk in bd np bt lk mv", 5],
    ["pack-mainland-southeast-asia", "pack", "Fastlands-Sørøst-Asia", "Mainland Southeast Asia", "mm th la kh vn my", 5],
    ["pack-maritime-southeast-asia", "pack", "Maritime Sørøst-Asia", "Maritime Southeast Asia", "id ph sg bn tl", 5],
    ["pack-horn-nile", "pack", "Afrikas horn og øvre Nilen", "The Horn of Africa and the Upper Nile", "sd ss er dj et so ug", 5],
    ["pack-great-lakes-congo", "pack", "De store sjøene og Kongobassenget", "Great Lakes and the Congo basin", "ke tz rw bi cd cg ga", 5],
    ["pack-southern-africa", "pack", "Sørlige Afrika", "Southern Africa", "ao zm zw bw na za ls", 5],
    ["pack-southeast-africa-islands", "pack", "Sørøst-Afrika og Indiahavet", "Southeast Africa and the Indian Ocean", "sz mz mw mg km mu sc", 5],
    ["tour-around-equator", "tour", "Rundt ekvator", "Around the Equator", "ec br ga cg cd ug ke so id ki", 4],
    ["pack-eastern-mediterranean", "pack", "Østlige Middelhav", "Eastern Mediterranean", "tr cy il ps lb jo", 5],
    ["pack-arabian-gulf", "pack", "Arabia og Gulfen", "Arabia and the Gulf", "sa ye om ae qa bh kw", 5],
    ["pack-caucasus-mesopotamia", "pack", "Kaukasus og Mesopotamia", "Caucasus and Mesopotamia", "am az ge ir iq sy", 5],
    ["pack-central-asia", "pack", "Sentral-Asia", "Central Asia", "kz kg tj tm uz", 5],
    ["tour-world-favourites", "tour", "Verdensfavoritter", "World favourites", "de es us br ar jm eg za tr in jp au", 4],
    ["pack-greater-caribbean", "pack", "De større karibiske statene", "The larger Caribbean states", "cu ht do jm bs tt", 6],
    ["pack-lesser-antilles", "pack", "De små Antiller", "The Lesser Antilles", "bb ag dm gd kn lc vc", 6],
    ["pack-australia-western-pacific", "pack", "Australia, New Zealand og stillehavsportalene", "Australia, New Zealand and the Pacific gateways", "au nz pg fj sb vu ws", 6],
    ["pack-pacific-islands", "pack", "Stillehavsstatene", "Pacific island states", "to tv ki nr mh fm pw", 6],
    ["pack-north-atlantic-autonomies", "pack", "Selvstyrte områder i Nord-Atlanteren", "North Atlantic autonomies", "gl fo ax im je gg gi bm", 6],
    ["pack-caribbean-territories", "pack", "Karibiske territorier", "Caribbean territories", "pr vi aw cw sx gp mq ky", 6],
    ["pack-pacific-associated-territories", "pack", "Tilknyttede områder og territorier i Stillehavet", "Pacific associated places and territories", "ck nu gu mp as nc pf", 6],
    ["pack-world-special-regions", "pack", "Særlige områder i verden", "Special regions around the world", "gf fk eh re yt hk mo", 6],
  ];

  const mastery = [
    ["mastery-north-central-america", "Nord- og Mellom-Amerika-mestring", "North and Central America mastery", "region", "north-central-america"],
    ["mastery-south-america", "Sør-Amerika-mestring", "South America mastery", "region", "south-america"],
    ["mastery-caribbean", "Karibia-mestring", "Caribbean mastery", "region", "caribbean"],
    ["mastery-oceania", "Oseania-mestring", "Oceania mastery", "region", "oceania"],
    ["mastery-europe-north-west", "Nord- og Vest-Europa-mestring", "Northern and Western Europe mastery", "packs", "pack-nordics pack-western-europe pack-baltic-neighbours"],
    ["mastery-asia-west", "Asia (vest)-mestring", "Asia (West) mastery", "region", "asia-west"],
    ["mastery-africa-north-west", "Nord- og Vest-Afrika-mestring", "Northern and Western Africa mastery", "packs", "pack-north-africa pack-sahel pack-atlantic-west-africa pack-gulf-guinea"],
    ["mastery-asia-east", "Asia (øst)-mestring", "Asia (East) mastery", "region", "asia-east"],
    ["mastery-europe-central-south-east", "Sentral-, Sør- og Øst-Europa-mestring", "Central, Southern and Eastern Europe mastery", "packs", "pack-iberia-alps pack-central-europe pack-balkans pack-eastern-europe pack-european-microstates"],
    ["mastery-africa-central-east-south", "Sentral-, Øst- og Sør-Afrika-mestring", "Central, Eastern and Southern Africa mastery", "packs", "pack-horn-nile pack-great-lakes-congo pack-southern-africa pack-southeast-africa-islands"],
    ["mastery-other-places-world", "Andre steder i verden", "Other places of the world", "category", "other-place"],
    ["mastery-americas", "Amerika-mestring", "Americas mastery", "regions", "north-central-america south-america caribbean"],
    ["mastery-europe", "Europa-mestring", "Europe mastery", "region", "europe"],
    ["mastery-africa", "Afrika-mestring", "Africa mastery", "region", "africa"],
    ["mastery-asia-oceania", "Asia og Oseania-mestring", "Asia and Oceania mastery", "regions", "asia-west asia-east oceania"],
    ["mastery-countries-world", "Verdens land", "Countries of the world", "category", "country"],
    ["mastery-whole-world", "Hele verden", "The whole world", "all", "world"],
  ];

  const sections = Object.freeze([
    Object.freeze({
      id: "traveller", icon: "🚶", startLevel: 1, endLevel: 4,
      title: Object.freeze({ nb: "Reisende", en: "Traveller" }),
    }),
    Object.freeze({
      id: "explorer", icon: "🥾", startLevel: 5, endLevel: 14,
      title: Object.freeze({ nb: "Oppdager", en: "Explorer" }),
    }),
    Object.freeze({
      id: "navigator", icon: "🧭", startLevel: 15, endLevel: 27,
      title: Object.freeze({ nb: "Navigatør", en: "Navigator" }),
    }),
    Object.freeze({
      id: "globetrotter", icon: "✈️", startLevel: 28, endLevel: 41,
      title: Object.freeze({ nb: "Globetrotter", en: "Globetrotter" }),
    }),
    Object.freeze({
      id: "regional-expert", icon: "🗺️", startLevel: 42, endLevel: 52,
      title: Object.freeze({ nb: "Kartograf", en: "Cartographer" }),
    }),
    Object.freeze({
      id: "world-master", icon: "🌍", startLevel: 53, endLevel: 58,
      title: Object.freeze({ nb: "Verdensmester", en: "World Master" }),
    }),
  ]);

  function quizzesFor(levelId, choiceCount, kind) {
    return MODES.map((mode) => Object.freeze({
      id: `${levelId}:${mode}`,
      revision: 1,
      mode,
      seed: `curriculum-v1|${levelId}|${mode}`,
      choiceCount: kind.includes("mastery")
        ? mode === "country-flag" ? 9 : 6
        : choiceCount,
    }));
  }

  const levels = definitions.map(([id, kind, nb, en, codes, choiceCount]) => {
    const countryCodes = codes.split(" ");
    return Object.freeze({
      id, kind, title: Object.freeze({ nb, en }),
      countryCodes: Object.freeze(countryCodes),
      quizzes: Object.freeze(quizzesFor(id, choiceCount, kind)),
    });
  });

  const learningLevelById = new Map(levels.map((level) => [level.id, level]));
  for (const [id, nb, en, selector, value] of mastery) {
    const countryCodes = selector === "all"
      ? places.map((place) => place.code)
      : selector === "category"
        ? places.filter((place) => place.category === value).map((place) => place.code)
        : selector === "packs"
          ? value.split(" ").flatMap((packId) => learningLevelById.get(packId)?.countryCodes ?? [])
          : selector === "regions"
            ? places.filter((place) => place.category === "country" && value.split(" ").includes(place.region)).map((place) => place.code)
            : places.filter((place) => place.category === "country" && place.region === value).map((place) => place.code);
    const kind = ["region", "regions", "packs"].includes(selector) ? "regional-mastery" : "world-mastery";
    levels.push(Object.freeze({
      id, kind, region: selector === "region" ? value : null,
      regions: selector === "regions" ? Object.freeze(value.split(" ")) : null,
      sourcePackIds: selector === "packs" ? Object.freeze(value.split(" ")) : null,
      category: selector === "category" ? value : null,
      title: Object.freeze({ nb, en }),
      countryCodes: Object.freeze(countryCodes),
      quizzes: Object.freeze(quizzesFor(id, null, kind)),
    }));
  }

  const quizById = new Map();
  const levelById = new Map();
  levels.forEach((level, levelIndex) => {
    levelById.set(level.id, level);
    level.quizzes.forEach((quiz, quizIndex) => quizById.set(quiz.id, Object.freeze({
      ...quiz, levelId: level.id, levelIndex, quizIndex,
      countryCodes: level.countryCodes, kind: level.kind, region: level.region ?? null,
    })));
  });

  function hashSeed(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    let value = hashSeed(seed) || 1;
    return () => {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(items, random) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [copy[index], copy[other]] = [copy[other], copy[index]];
    }
    return copy;
  }

  function fixedAlternativeCodes(quiz) {
    const candidates = quiz.kind === "world-mastery"
      ? places.map((place) => place.code)
      : quiz.countryCodes;
    const count = Math.min(quiz.choiceCount, candidates.length);
    return Object.fromEntries(quiz.countryCodes.map((targetCode) => {
      const random = seededRandom(`${quiz.seed}|${targetCode}|alternatives`);
      const distractors = shuffle(candidates.filter((code) => code !== targetCode), random)
        .slice(0, count - 1);
      return [targetCode, [targetCode, ...distractors]];
    }));
  }

  function createAttempt(quizOrId, attemptSeed) {
    const quiz = typeof quizOrId === "string" ? quizById.get(quizOrId) : quizOrId;
    if (!quiz) throw new Error("Unknown curriculum quiz");
    const seed = String(attemptSeed || `${Date.now()}-${Math.random()}`);
    const alternatives = fixedAlternativeCodes(quiz);
    const targets = shuffle(quiz.countryCodes, seededRandom(`${seed}|questions`));
    return targets.map((countryCode, questionIndex) => ({
      countryCode,
      choiceCodes: shuffle(alternatives[countryCode], seededRandom(`${seed}|choices|${questionIndex}`)),
    }));
  }

  return Object.freeze({
    MODES,
    sections,
    levels: Object.freeze(levels),
    quizById,
    levelById,
    fixedAlternativeCodes,
    createAttempt,
  });
});
