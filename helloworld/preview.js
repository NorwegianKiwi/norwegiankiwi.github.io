(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_PREVIEW = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const resultPreviewNames = new Set([
    "result-next-quiz", "result-next-level", "result-failed-next", "result-failed-no-next", "share-fallback",
    "result-failed-next-quiz", "result-skip-quiz", "result-failed-skip-quiz",
    "result-skip-level", "result-failed-skip-level", "result-wrap",
    "result-failed-wrap", "result-new-record", "result-below-best",
    "result-replay-mastered", "result-all-mastered", "result-failed-all-mastered",
  ]);
  const previewNames = new Set([
    "puzzle-first", "puzzle-partial", "puzzle-final", "puzzle-replay", "puzzle-collection",
    "puzzle-level", "puzzle-world", "puzzle-missing-image",
    "puzzle-view-empty", "puzzle-view-partial", "puzzle-view-complete",
    ...resultPreviewNames, "milestone-result", "milestone-celebration",
    "milestone-question", "milestone-replay", "level-final-gap-question", "navigator-tourist-gap-question",
    "tourist-world-final-question", "final-question", "final-result", "final-celebration",
  ]);

  function readName(params) {
    const name = params.get("preview");
    return previewNames.has(name) ? name : null;
  }

  // Build isolated preview data; the application owns all browser effects.
  function prepare(params, locale, { curriculum, progress, countriesByCode }, timestamp) {
    const initialPreview = readName(params);
    if (!initialPreview) return null;
    let progressStore;
    const state = {};
    const currentProfile = () => progress.activeProfile(progressStore);
    const prepared = (action = { type: "render" }) => ({ store: progressStore, state, action });

    function setQuizResult(quiz, score = quiz.countryCodes.length, wrongAnswers = []) {
      state.curriculumQuizId = quiz.id;
      state.activeLevelId = quiz.levelId;
      state.mode = quiz.mode;
      state.questions = quiz.countryCodes.map((code) => ({ country: countriesByCode.get(code), choices: [] }));
      state.score = score;
      state.wrongAnswers = wrongAnswers;
    }

    function previewStage() {
      return curriculum.stages.find((stage) => stage.id === params.get("stage"))
        ?? curriculum.stages[0];
    }

    function previewStageQuizzes(stage) {
      return curriculum.levels
        .slice(stage.startLevel - 1, stage.endLevel)
        .flatMap((level) => level.quizzes.map((baseQuiz) => curriculum.quizById.get(baseQuiz.id)));
    }

    function previewStageFinalQuiz(stage, mode = "country-capital") {
      const level = curriculum.levels[stage.endLevel - 1];
      const baseQuiz = level.quizzes.find((quiz) => quiz.mode === mode) ?? level.quizzes.at(-1);
      return curriculum.quizById.get(baseQuiz.id);
    }

    function resetPreviewProgress(id) {
      progressStore = progress.createEmptyStore({ id: `preview-${id}`, defaultName: "Preview", now: timestamp });
    }

    function masterPreviewQuizzes(predicate) {
      for (const level of curriculum.levels) {
        for (const baseQuiz of level.quizzes) {
          const quiz = curriculum.quizById.get(baseQuiz.id);
          if (predicate(quiz)) {
            progressStore = progress.recordResult(
              progressStore,
              progressStore.activeProfileId,
              quiz,
              quiz.countryCodes.length,
              { now: timestamp },
            );
          }
        }
      }
    }

    function preparePreviewResult(stage, previewName) {
      resetPreviewProgress(previewName);
      const stageQuizIds = new Set(previewStageQuizzes(stage).map((quiz) => quiz.id));
      masterPreviewQuizzes((quiz) => stageQuizIds.has(quiz.id));
      const quiz = previewStageFinalQuiz(stage);
      setQuizResult(quiz);
      state.resultRecorded = true;
      state.resultBestScore = state.score;
      state.resultPreviousBestScore = null;
      state.resultNewQuizMastery = true;
      state.resultNewLevelMastery = true;
      state.resultNewStageMastery = true;
      state.resultCelebrationPending = false;
      state.screen = "result";
    }

    function startLastQuestionPreview(quiz, previewName) {
      const attemptSeed = `preview-${previewName}`;
      const recipe = curriculum.createAttempt(quiz, attemptSeed);
      const answers = recipe.slice(0, -1).map((question) => ({
        targetCode: question.countryCode,
        selectedCode: question.countryCode,
        correct: true,
      }));
      progressStore = progress.saveMasteryAttempt(progressStore, progressStore.activeProfileId, {
        quizId: quiz.id,
        revision: quiz.revision,
        attemptSeed,
        questionIndex: answers.length,
        score: answers.length,
        answers,
        correctionPending: null,
        startedAt: timestamp,
        updatedAt: timestamp,
      }, { now: timestamp });
      return prepared({ type: "start-quiz", quizId: quiz.id });
    }

    if (initialPreview.startsWith("puzzle-")) {
      const stage = initialPreview === "puzzle-world"
        ? curriculum.stages.at(-1)
        : previewStage();
      const quizzes = previewStageQuizzes(stage);
      const isViewer = initialPreview.startsWith("puzzle-view-") || initialPreview === "puzzle-collection";
      const index = ["puzzle-final", "puzzle-world"].includes(initialPreview) ? quizzes.length - 1
        : ["puzzle-partial", "puzzle-view-partial"].includes(initialPreview) ? Math.floor(quizzes.length / 2)
        : initialPreview === "puzzle-level" ? 3 : 0;
      const quiz = quizzes[index];
      resetPreviewProgress(initialPreview);
      const earnedCount = initialPreview === "puzzle-view-empty" ? 0
        : ["puzzle-view-complete", "puzzle-collection"].includes(initialPreview) ? quizzes.length
        : index + (initialPreview === "puzzle-replay" ? 1 : 0);
      const earnedIds = new Set(quizzes.slice(0, earnedCount).map((q) => q.id));
      masterPreviewQuizzes((q) => initialPreview === "puzzle-world" ? q.id !== quiz.id : earnedIds.has(q.id));
      if (isViewer) {
        state.screen = "levels";
        state.puzzleStageId = stage.id;
        return prepared({ type: "puzzle-viewer", stageId: stage.id });
      }
      setQuizResult(quiz);
      state.resultRecorded = false;
      return prepared({
        type: "finish-quiz", stageId: stage.id,
        imageFailure: initialPreview === "puzzle-missing-image",
      });
    }
    if (initialPreview === "level-final-gap-question") {
      const level = curriculum.levels[0];
      const targetQuiz = curriculum.quizById.get(level.quizzes[2].id);
      resetPreviewProgress(initialPreview);
      masterPreviewQuizzes((quiz) => quiz.levelId === level.id && quiz.id !== targetQuiz.id);
      return startLastQuestionPreview(targetQuiz, initialPreview);
    }
    if (initialPreview === "tourist-world-final-question") {
      const tourist = curriculum.stages.find((stage) => stage.id === "tourist");
      const targetQuiz = previewStageFinalQuiz(tourist, "country-flag");
      resetPreviewProgress(initialPreview);
      masterPreviewQuizzes((quiz) => quiz.id !== targetQuiz.id);
      return startLastQuestionPreview(targetQuiz, initialPreview);
    }
    if (initialPreview === "navigator-tourist-gap-question") {
      const tourist = curriculum.stages.find((stage) => stage.id === "tourist");
      const navigator = curriculum.stages.find((stage) => stage.id === "navigator");
      const touristGap = previewStageFinalQuiz(tourist, "flag-country");
      const navigatorTarget = previewStageFinalQuiz(navigator);
      const selectedQuizIds = new Set([
        ...previewStageQuizzes(tourist),
        ...previewStageQuizzes(navigator),
      ].map((quiz) => quiz.id));
      resetPreviewProgress(initialPreview);
      masterPreviewQuizzes((quiz) => selectedQuizIds.has(quiz.id) && ![touristGap.id, navigatorTarget.id].includes(quiz.id));
      return startLastQuestionPreview(navigatorTarget, initialPreview);
    }
    if (initialPreview === "milestone-question") {
      const stage = previewStage();
      const targetQuiz = previewStageFinalQuiz(stage);
      const stageQuizIds = new Set(previewStageQuizzes(stage).map((quiz) => quiz.id));
      resetPreviewProgress(`${initialPreview}-${stage.id}`);
      masterPreviewQuizzes((quiz) => stageQuizIds.has(quiz.id) && quiz.id !== targetQuiz.id);
      return startLastQuestionPreview(targetQuiz, `${initialPreview}-${stage.id}`);
    }
    if (initialPreview === "final-question") {
      const finalLevel = curriculum.levels.at(-1);
      const finalQuiz = curriculum.quizById.get(finalLevel.quizzes.at(-1).id);
      resetPreviewProgress(initialPreview);
      masterPreviewQuizzes((quiz) => quiz.id !== finalQuiz.id);
      return startLastQuestionPreview(finalQuiz, initialPreview);
    }
    if (initialPreview === "final-result" || initialPreview === "final-celebration") {
      resetPreviewProgress(initialPreview);
      masterPreviewQuizzes(() => true);
      const level = curriculum.levels.at(-1);
      const quiz = curriculum.quizById.get(level.quizzes.at(-1).id);
      setQuizResult(quiz);
      state.resultRecorded = true;
      state.resultBestScore = state.score;
      state.resultPreviousBestScore = null;
      state.resultNewQuizMastery = true;
      state.resultNewLevelMastery = true;
      state.resultNewStageMastery = initialPreview === "final-result";
      state.resultCelebrationPending = false;
      state.screen = "result";
      return prepared({ type: initialPreview === "final-celebration" ? "world-celebration" : "render" });
    }
    if (["milestone-result", "milestone-celebration", "milestone-replay"].includes(initialPreview)) {
      const stage = previewStage();
      preparePreviewResult(stage, `${initialPreview}-${stage.id}`);
      if (initialPreview === "milestone-replay") {
        const source = params.get("source") === "levels" ? "levels" : "home";
        state.screen = source === "levels" ? "levels" : "setup";
        state.selectedLevelId = source === "levels" ? curriculum.levels[stage.endLevel - 1].id : null;
        return prepared({ type: "milestone-celebration", stageId: stage.id, origin: `${source}-replay` });
      }
      return prepared(initialPreview === "milestone-celebration"
        ? { type: "milestone-celebration", stageId: stage.id, origin: "newly-earned" }
        : { type: "render" });
    }
    if (resultPreviewNames.has(initialPreview)) {
      resetPreviewProgress(initialPreview);
      const longestLevelIndex = curriculum.levels.reduce((longestIndex, candidate, index) =>
        candidate.title[locale].length > curriculum.levels[longestIndex].title[locale].length ? index : longestIndex, 0);
      const crossLevel = ["result-next-level", "result-failed-next", "result-skip-level", "result-failed-skip-level"].includes(initialPreview);
      const wraps = initialPreview.endsWith("wrap");
      const skipsWithinLevel = initialPreview.endsWith("skip-quiz");
      const skipsAcrossLevels = initialPreview.endsWith("skip-level");
      const allMastered = initialPreview.endsWith("all-mastered");
      const failedResult = initialPreview.startsWith("result-failed-") || ["result-new-record", "result-below-best"].includes(initialPreview);
      const level = curriculum.levels[wraps ? curriculum.levels.length - 1 : crossLevel ? Math.max(0, longestLevelIndex - 1) : 0];
      const quiz = curriculum.quizById.get(level.quizzes[wraps || crossLevel ? 3 : 0].id);
      const resultScore = quiz.countryCodes.length - (failedResult ? 1 : 0);
      if (allMastered) masterPreviewQuizzes(() => true);
      else if (initialPreview === "result-failed-no-next") masterPreviewQuizzes((candidate) => candidate.id !== quiz.id);
      else if (crossLevel) {
        masterPreviewQuizzes((candidate) => candidate.levelId === level.id && candidate.id !== quiz.id);
        if (skipsAcrossLevels) {
          const firstNextQuiz = curriculum.levels[longestLevelIndex].quizzes[0];
          masterPreviewQuizzes((candidate) => candidate.id === firstNextQuiz.id);
        }
      } else if (skipsWithinLevel) {
        masterPreviewQuizzes((candidate) => candidate.id === level.quizzes[1].id);
      }
      if (["result-new-record", "result-below-best", "result-replay-mastered"].includes(initialPreview)) {
        progressStore = progress.recordResult(progressStore, progressStore.activeProfileId, quiz,
          quiz.countryCodes.length - (initialPreview === "result-new-record" ? 2 : 0), { now: timestamp });
      }
      const previousRecord = progress.currentRecord(currentProfile(), quiz);
      const previousState = progress.quizState(currentProfile(), quiz);
      const previousLevelMastered = progress.levelProgress(currentProfile(), level).mastered;
      progressStore = progress.recordResult(progressStore, progressStore.activeProfileId, quiz, resultScore, { now: timestamp });
      setQuizResult(quiz, resultScore, failedResult ? [countriesByCode.get(quiz.countryCodes[0])] : []);
      state.resultRecorded = true;
      state.resultBestScore = progress.currentRecord(currentProfile(), quiz).bestScore;
      state.resultPreviousBestScore = previousRecord?.bestScore ?? null;
      state.resultNewQuizMastery = !failedResult && previousState !== "mastered";
      state.resultNewLevelMastery = previousLevelMastered < 4 && progress.levelProgress(currentProfile(), level).mastered === 4;
      state.resultNewStageMastery = false;
      state.resultCelebrationPending = false;
      state.screen = "result";
      return prepared();
    }
  }

  return { readName, prepare };
});
