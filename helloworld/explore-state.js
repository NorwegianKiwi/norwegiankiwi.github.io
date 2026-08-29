(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_EXPLORE_STATE = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function uniqueCodes(codes) {
    return [...new Set((codes ?? []).filter((code) => typeof code === "string"))];
  }

  function initialExtent(codes, regionForCode) {
    const regions = new Set(
      uniqueCodes(codes).map(regionForCode).filter(Boolean),
    );
    if (regions.size === 1) return [...regions][0];
    return "world";
  }

  function sortCodes(codes, nameForCode, locale) {
    const collator = new Intl.Collator(locale, { sensitivity: "base" });
    return uniqueCodes(codes).sort((first, second) =>
      collator.compare(nameForCode(first), nameForCode(second)),
    );
  }

  function zoomInExtent(extent, selectedRegion) {
    if (!selectedRegion) return extent;
    if (extent === "world") return selectedRegion;
    return extent;
  }

  function zoomOutExtent(extent) {
    if (extent === "world") return "world";
    return "world";
  }

  function extentForSelection(extent, selectedRegion) {
    if (!selectedRegion || extent === "world") return extent;
    if (extent === selectedRegion) return extent;
    return selectedRegion;
  }

  return Object.freeze({
    uniqueCodes,
    sortCodes,
    initialExtent,
    zoomInExtent,
    zoomOutExtent,
    extentForSelection,
  });
});
