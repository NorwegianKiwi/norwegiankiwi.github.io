(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_CHALLENGE = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = 1;
  const SEED_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const GENERATED_SEED_LENGTH = 3;
  const SEED_PATTERN =
    /^(?:[ABCDEFGHJKMNPQRSTUVWXYZ]{3}|[ABCDEFGHJKMNPQRSTUVWXYZ]{5})$/;
  const PROOF_PREFIX = "hello-world-friend-challenge";

  function normalizeSeed(value) {
    const seed = String(value ?? "").trim().toUpperCase();
    return SEED_PATTERN.test(seed) ? seed : null;
  }

  function createRandomSeed(cryptoObject = globalThis.crypto) {
    let seed = "";
    const maximumUnbiasedByte =
      Math.floor(256 / SEED_ALPHABET.length) * SEED_ALPHABET.length;

    if (cryptoObject?.getRandomValues) {
      while (seed.length < GENERATED_SEED_LENGTH) {
        const bytes = new Uint8Array(8);
        cryptoObject.getRandomValues(bytes);
        for (const byte of bytes) {
          if (byte >= maximumUnbiasedByte) continue;
          seed += SEED_ALPHABET[byte % SEED_ALPHABET.length];
          if (seed.length === GENERATED_SEED_LENGTH) break;
        }
      }
      return seed;
    }

    while (seed.length < GENERATED_SEED_LENGTH) {
      seed += SEED_ALPHABET[Math.floor(Math.random() * SEED_ALPHABET.length)];
    }
    return seed;
  }

  function xmur3(value) {
    let hash = 1779033703 ^ value.length;
    for (let index = 0; index < value.length; index += 1) {
      hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
      hash = (hash << 13) | (hash >>> 19);
    }
    return function nextHash() {
      hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
      hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
      return (hash ^= hash >>> 16) >>> 0;
    };
  }

  function sfc32(a, b, c, d) {
    return function random() {
      a >>>= 0;
      b >>>= 0;
      c >>>= 0;
      d >>>= 0;
      const result = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + result) | 0;
      return (result >>> 0) / 4294967296;
    };
  }

  function createSeededRandom(seed, version = VERSION) {
    const normalizedSeed = normalizeSeed(seed);
    if (version !== VERSION || !normalizedSeed) {
      throw new Error("Unsupported challenge recipe");
    }
    const seedHash = xmur3(`v${version}:${normalizedSeed}`);
    return sfc32(seedHash(), seedHash(), seedHash(), seedHash());
  }

  function shuffle(items, random) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function createQuestions({
    pool,
    allCountries,
    flagDistractorGroups,
    flagConflictPairs,
    choiceCount = 9,
    mode,
    seed,
    version = VERSION,
  }) {
    const random = createSeededRandom(seed, version);
    const countriesByCode = new Map(
      allCountries.map((country) => [country.code, country]),
    );
    const primaryCodes = new Map();
    const secondaryCodes = new Map();
    const conflictCodes = new Map();

    function addRelatedCode(map, code, relatedCode) {
      if (!map.has(code)) map.set(code, new Set());
      map.get(code).add(relatedCode);
    }

    for (const group of flagDistractorGroups) {
      const target = group.strength === "primary" ? primaryCodes : secondaryCodes;
      for (const code of group.codes) {
        for (const relatedCode of group.codes) {
          if (relatedCode !== code) addRelatedCode(target, code, relatedCode);
        }
      }
    }
    for (const [first, second] of flagConflictPairs) {
      addRelatedCode(conflictCodes, first, second);
      addRelatedCode(conflictCodes, second, first);
    }

    function selectCompatible(candidates, count, selectedCodes) {
      if (count <= 0) return [];
      const selected = [];
      for (const candidate of shuffle(candidates, random)) {
        const conflicts = conflictCodes.get(candidate.code);
        if (
          selectedCodes.has(candidate.code) ||
          [...(conflicts ?? [])].some((code) => selectedCodes.has(code))
        ) {
          continue;
        }
        selected.push(candidate);
        selectedCodes.add(candidate.code);
        if (selected.length === count) break;
      }
      return selected;
    }

    const usesFlagDistractors =
      mode === "country-flag" || mode === "flag-country";

    return shuffle(pool, random).map((country) => {
      let distractors;
      if (usesFlagDistractors) {
        const selectedCodes = new Set([country.code]);
        const primary = [...(primaryCodes.get(country.code) ?? [])];
        const secondary = [...(secondaryCodes.get(country.code) ?? [])];
        const primaryDistractors = selectCompatible(
          primary.map((code) => countriesByCode.get(code)),
          Math.min(1, choiceCount - 1),
          selectedCodes,
        );
        const related = new Set([...primary, ...secondary]);
        const otherRelatedDistractors = selectCompatible(
          [...related].map((code) => countriesByCode.get(code)),
          Math.min(2, choiceCount - 1) - primaryDistractors.length,
          selectedCodes,
        );
        const relatedDistractors = [
          ...primaryDistractors,
          ...otherRelatedDistractors,
        ];
        const randomDistractors = selectCompatible(
          pool,
          choiceCount - 1 - relatedDistractors.length,
          selectedCodes,
        );
        distractors = [...relatedDistractors, ...randomDistractors];
      } else {
        distractors = shuffle(
          pool.filter((item) => item.code !== country.code),
          random,
        ).slice(0, choiceCount - 1);
      }
      return {
        country,
        choices: shuffle([country, ...distractors], random),
      };
    });
  }

  function randomizeChoiceOrder(questions, random = Math.random) {
    return questions.map((question) => ({
      ...question,
      choices: shuffle(question.choices, random),
    }));
  }

  function proofMessage({ version, mode, region, seed, score }) {
    return `${PROOF_PREFIX}|${version}|${mode}|${region}|${seed}|${score}`;
  }

  function base64Url(bytes) {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary)
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replace(/=+$/, "");
  }

  async function createScoreProof(recipe, cryptoObject = globalThis.crypto) {
    if (!cryptoObject?.subtle) {
      throw new Error("Score proof requires Web Crypto");
    }
    const digest = await cryptoObject.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(proofMessage(recipe)),
    );
    return base64Url(new Uint8Array(digest).slice(0, 8));
  }

  async function verifyScoreProof(recipe, proof, cryptoObject = globalThis.crypto) {
    if (!/^[A-Za-z0-9_-]{11}$/.test(String(proof ?? ""))) return false;
    try {
      return (await createScoreProof(recipe, cryptoObject)) === proof;
    } catch {
      return false;
    }
  }

  function curriculumProofMessage({ quizId, revision, score }) {
    return `hello-world-curriculum-challenge|2|${quizId}|${revision}|${score}`;
  }

  async function createCurriculumScoreProof(recipe, cryptoObject = globalThis.crypto) {
    if (!cryptoObject?.subtle) throw new Error("Score proof requires Web Crypto");
    const digest = await cryptoObject.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(curriculumProofMessage(recipe)),
    );
    return base64Url(new Uint8Array(digest).slice(0, 8));
  }

  async function verifyCurriculumScoreProof(recipe, proof, cryptoObject = globalThis.crypto) {
    if (!/^[A-Za-z0-9_-]{11}$/.test(String(proof ?? ""))) return false;
    try { return (await createCurriculumScoreProof(recipe, cryptoObject)) === proof; }
    catch { return false; }
  }

  return {
    VERSION,
    SEED_ALPHABET,
    normalizeSeed,
    createRandomSeed,
    createSeededRandom,
    createQuestions,
    randomizeChoiceOrder,
    createScoreProof,
    verifyScoreProof,
    createCurriculumScoreProof,
    verifyCurriculumScoreProof,
  };
});
