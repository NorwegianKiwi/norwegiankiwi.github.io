(function () {
  "use strict";

  const url = new URL(window.location.href);
  const locale = url.searchParams.get("lang") === "en" ? "en" : "nb";
  const metadata = locale === "en"
    ? {
        title: "Licences and privacy – Hello World!",
        description: "Licence, local storage, sharing and privacy information for Hello World!",
        brand: "Hello World!",
        home: "./?lang=en",
      }
    : {
        title: "Lisenser og personvern – Hei verden!",
        description: "Informasjon om lisenser, lokal lagring, deling og personvern i Hei verden!",
        brand: "Hei verden!",
        home: "./",
      };

  document.documentElement.lang = locale;
  document.documentElement.classList.add("legal-page-enhanced");
  document.title = metadata.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
  const homeLink = document.querySelector("[data-legal-home-link]");
  if (homeLink) homeLink.setAttribute("href", metadata.home);
  const brand = document.querySelector("[data-legal-brand]");
  if (brand) brand.textContent = metadata.brand;

  document.querySelectorAll("[data-legal-locale]").forEach((article) => {
    article.hidden = article.getAttribute("data-legal-locale") !== locale;
  });
  document.querySelectorAll("[data-legal-language]").forEach((link) => {
    if (link.getAttribute("data-legal-language") === locale) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
})();
