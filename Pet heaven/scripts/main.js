// Pet Haven — main.js (ES module)
// Handles the responsive hamburger nav (shared on every page) and
// dispatches to the page-specific initializers from pets.js.

import { initHomeFeatured, initFavoritesStat, initCatalogPage } from "./pets.js";

function initNavToggle() {
  const toggle = document.querySelector("#nav-toggle");
  const list = document.querySelector("#nav-list");
  if (!toggle || !list) return;

  toggle.addEventListener("click", () => {
    const isOpen = list.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initContactPrefill() {
  const petField = document.querySelector("#contact-form #pet");
  if (!petField) return;
  const params = new URLSearchParams(window.location.search);
  const petFromLink = params.get("pet");
  if (petFromLink) petField.value = petFromLink;
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initHomeFeatured();
  initFavoritesStat();
  initCatalogPage();
  initContactPrefill();
});
