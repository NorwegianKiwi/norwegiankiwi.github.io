(function () {
  "use strict";
  const url = new URL(window.location.href);
  const locale = url.searchParams.get("lang") === "nb" ? "nb" : "en";
  document.documentElement.lang = locale;
  document.documentElement.classList.add("privacy-enhanced");
  document.title = `${locale === "nb" ? "Personvern" : "Privacy"} · lanceolav.com`;
  document.querySelector('meta[name="description"]').setAttribute("content", locale === "nb"
    ? "Personvern, lokal spillagring og tjenesteleverandører på lanceolav.com."
    : "Privacy, local game storage and service providers on lanceolav.com.");
  document.querySelectorAll("[data-privacy-locale]").forEach((article) => {
    article.hidden = article.getAttribute("data-privacy-locale") !== locale;
  });
  document.querySelectorAll("[data-privacy-language]").forEach((link) => {
    if (link.getAttribute("data-privacy-language") === locale) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
})();
