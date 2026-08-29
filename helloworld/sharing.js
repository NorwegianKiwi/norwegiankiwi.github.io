(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_SHARING = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function createEmailUrl(subject, body) {
    return `mailto:?subject=${encodeURIComponent(String(subject ?? ""))}&body=${encodeURIComponent(String(body ?? ""))}`;
  }

  return { createEmailUrl };
});
