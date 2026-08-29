(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GEOGRAFI_SHARING = Object.freeze(api);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const PUBLIC_APP_URL = "https://lanceolav.com/helloworld/";

  function createEmailUrl(subject, body) {
    return `mailto:?subject=${encodeURIComponent(String(subject ?? ""))}&body=${encodeURIComponent(String(body ?? ""))}`;
  }

  function personalizedName(value, placeholder = "Player 1") {
    const name = String(value ?? "").trim();
    return name && name !== placeholder ? name : null;
  }

  function createSharePayload({ title, text, url, emailCallToAction }) {
    const normalized = {
      title: String(title ?? ""),
      text: String(text ?? ""),
      url: String(url ?? ""),
    };
    return {
      native: normalized,
      email: {
        subject: normalized.title,
        body: `${normalized.text}\n\n${String(emailCallToAction ?? "")}\n${normalized.url}`,
      },
    };
  }

  function createFallbackMessage(payload) {
    return `${payload.email.subject}\n\n${payload.email.body}`;
  }

  return {
    PUBLIC_APP_URL,
    createEmailUrl,
    createFallbackMessage,
    createSharePayload,
    personalizedName,
  };
});
