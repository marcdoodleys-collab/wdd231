// Pet Haven — pets.js (ES module)
// Fetches data/pets.json, renders pet cards, handles species/status
// filters, a favorites feature backed by localStorage, and the
// pet-detail modal dialog.

const FAVORITES_KEY = "petHavenFavorites";

const careTips = {
  "Chien": "Une promenade quotidienne et une alimentation adaptée à sa taille sont essentielles.",
  "Chat": "Une litière propre et un griffoir aident à respecter ses instincts naturels.",
  "Lapin": "Du foin à volonté et des sorties surveillées dans un espace sécurisé.",
  "Oiseau": "Une cage spacieuse et des interactions sociales régulières le gardent équilibré.",
  "Cochon d'Inde": "De la vitamine C dans l'alimentation, idéalement avec un compagnon de sa race."
};

export async function loadPets() {
  try {
    const response = await fetch("data/pets.json");
    if (!response.ok) {
      throw new Error("Réponse réseau invalide.");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors du chargement des animaux :", error);
    throw new Error("Impossible de charger la liste des animaux pour le moment.");
  }
}

function getFavorites() {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }
  saveFavorites(favorites);
  return favorites;
}

function petCardTemplate(pet) {
  const badgeClass = pet.status === "Adoption" ? "badge--adoption" : "badge--vente";
  const isFav = getFavorites().includes(pet.id);
  return `
    <article class="pet-card" data-id="${pet.id}">
      <div class="pet-card__media">
        <img src="${pet.image}" alt="Illustration représentant un ${pet.species.toLowerCase()}" width="64" height="64" loading="lazy" />
        <button class="fav-btn" type="button" data-fav-id="${pet.id}" aria-pressed="${isFav}" aria-label="${isFav ? "Retirer des favoris" : "Ajouter aux favoris"}">${isFav ? "♥" : "♡"}</button>
      </div>
      <div class="pet-card__body">
        <div class="pet-card__top">
          <h3>${pet.name}</h3>
          <span class="badge ${badgeClass}">${pet.status}</span>
        </div>
        <p class="pet-card__meta">${pet.species} · ${pet.breed} · ${pet.age} · Taille ${pet.size}</p>
        <button class="pet-card__cta" type="button" data-detail-id="${pet.id}">Voir la fiche complète →</button>
      </div>
    </article>
  `;
}

function renderPets(container, pets) {
  if (!container) return;
  container.innerHTML = pets.length
    ? pets.map(petCardTemplate).join("")
    : `<p class="empty-state">Aucun animal ne correspond à ces filtres pour le moment.</p>`;
}

function applyFilters(pets, speciesValue, statusValue) {
  return pets.filter((pet) => {
    const speciesMatch = speciesValue === "Tous" || pet.species === speciesValue;
    const statusMatch = statusValue === "Tous" || pet.status === statusValue;
    return speciesMatch && statusMatch;
  });
}

function populateFilterOptions(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function openModal(pet) {
  const modal = document.querySelector("#pet-modal");
  if (!modal) return;
  const badgeClass = pet.status === "Adoption" ? "badge--adoption" : "badge--vente";
  modal.querySelector(".modal-content").innerHTML = `
    <div class="modal-content__top">
      <div>
        <h2 id="modal-title">${pet.name}</h2>
        <p class="pet-card__meta">${pet.species} · ${pet.breed} · ${pet.age} · Taille ${pet.size}</p>
      </div>
      <button class="modal-close" type="button" aria-label="Fermer">✕</button>
    </div>
    <span class="badge ${badgeClass}">${pet.status}</span>
    <p>${pet.blurb}</p>
    <div class="modal-tip"><strong>Conseil de soin :</strong> ${careTips[pet.species] || "Renseignez-vous auprès de notre équipe pour des conseils adaptés."}</div>
    <div class="hero-actions">
      <a class="btn btn--primary" href="contact.html?pet=${encodeURIComponent(pet.name)}">Demander plus d'infos</a>
    </div>
  `;
  modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
  modal.showModal();
}

function wireCardInteractions(container, pets) {
  container.addEventListener("click", (event) => {
    const favBtn = event.target.closest("[data-fav-id]");
    if (favBtn) {
      const id = favBtn.getAttribute("data-fav-id");
      const favorites = toggleFavorite(id);
      const isFav = favorites.includes(id);
      favBtn.setAttribute("aria-pressed", String(isFav));
      favBtn.setAttribute("aria-label", isFav ? "Retirer des favoris" : "Ajouter aux favoris");
      favBtn.textContent = isFav ? "♥" : "♡";
      return;
    }

    const detailBtn = event.target.closest("[data-detail-id]");
    if (detailBtn) {
      const id = detailBtn.getAttribute("data-detail-id");
      const pet = pets.find((item) => item.id === id);
      if (pet) openModal(pet);
    }
  });
}

export async function initHomeFeatured() {
  const featuredGrid = document.querySelector("#featured-grid");
  if (!featuredGrid) return;
  try {
    const pets = await loadPets();
    const featured = pets.filter((pet) => pet.featured).slice(0, 3);
    renderPets(featuredGrid, featured);
    wireCardInteractions(featuredGrid, pets);
  } catch (error) {
    featuredGrid.innerHTML = `<p class="empty-state">${error.message}</p>`;
  }
}

export async function initFavoritesStat() {
  const statEl = document.querySelector("#favorites-count");
  if (!statEl) return;
  const favorites = getFavorites();
  statEl.textContent = favorites.length;
}

export async function initCatalogPage() {
  const grid = document.querySelector("#pet-grid");
  if (!grid) return;

  const speciesSelect = document.querySelector("#filter-species");
  const statusSelect = document.querySelector("#filter-status");
  const countLabel = document.querySelector("#filter-count");

  try {
    const pets = await loadPets();

    const speciesValues = [...new Set(pets.map((pet) => pet.species))].sort();
    populateFilterOptions(speciesSelect, speciesValues);

    const statusValues = [...new Set(pets.map((pet) => pet.status))].sort();
    populateFilterOptions(statusSelect, statusValues);

    function update() {
      const filtered = applyFilters(pets, speciesSelect.value, statusSelect.value);
      renderPets(grid, filtered);
      if (countLabel) {
        const label = filtered.length > 1 ? "animaux" : "animal";
        countLabel.textContent = `${filtered.length} ${label} affiché${filtered.length > 1 ? "s" : ""} sur ${pets.length}`;
      }
    }

    speciesSelect.addEventListener("change", update);
    statusSelect.addEventListener("change", update);
    update();
    wireCardInteractions(grid, pets);

    const modal = document.querySelector("#pet-modal");
    if (modal) {
      modal.addEventListener("click", (event) => {
        const rect = modal.getBoundingClientRect();
        const inside =
          rect.top <= event.clientY && event.clientY <= rect.bottom &&
          rect.left <= event.clientX && event.clientX <= rect.right;
        if (!inside) modal.close();
      });
    }
  } catch (error) {
    grid.innerHTML = `<p class="empty-state">${error.message}</p>`;
  }
}
