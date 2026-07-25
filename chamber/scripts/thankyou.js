// thankyou.js — affiche les données soumises via le formulaire d'adhésion

// ---------- Menu hamburger ----------

const hamburgerBtn = document.querySelector("#hamburger");
const primaryNav = document.querySelector("#primaryNav");

hamburgerBtn.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  hamburgerBtn.classList.toggle("open", isOpen);
  hamburgerBtn.setAttribute("aria-expanded", isOpen);
});

// ---------- Footer : date de dernière modification + année ----------

document.querySelector("#copyrightYear").textContent = new Date().getFullYear();

document.querySelector("#lastModified").textContent =
  `Dernière modification : ${document.lastModified}`;

// ---------- Lecture des paramètres GET envoyés par join.html ----------

const params = new URLSearchParams(window.location.search);

function formatTimestamp(isoString) {
  if (!isoString) return "Non disponible";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function displayValue(elementId, value, fallback = "Non renseigné") {
  document.querySelector(`#${elementId}`).textContent = value || fallback;
}

displayValue("summaryFirstName", params.get("firstName"));
displayValue("summaryLastName", params.get("lastName"));
displayValue("summaryEmail", params.get("email"));
displayValue("summaryMobile", params.get("mobile"));
displayValue("summaryOrgName", params.get("orgName"));
displayValue("summaryTimestamp", formatTimestamp(params.get("timestamp")));