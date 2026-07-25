// join.js — logique de la page d'adhésion (Chamber of Commerce)

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

// ---------- Timestamp caché (date/heure de chargement du formulaire) ----------

document.querySelector("#timestamp").value = new Date().toISOString();

// ---------- Modales (HTML <dialog>) ----------

const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalCloseButtons = document.querySelectorAll(".modal-close");

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modalId = trigger.dataset.modal;
    const modal = document.querySelector(`#${modalId}`);
    if (modal) {
      modal.showModal();
    }
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest("dialog");
    if (modal) {
      modal.close();
    }
  });
});

// Fermer la modale si l'utilisateur clique en dehors du contenu (sur le fond)
document.querySelectorAll(".membership-modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    const rect = modal.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedOutside) {
      modal.close();
    }
  });
});