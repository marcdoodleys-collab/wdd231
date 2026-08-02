import discoverItems from "../scripts/discover.mjs";

// ===== FOOTER META (year + last modified) =====
const yearSpan = document.getElementById("copyrightYear");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const lastModified = document.getElementById("lastModified");
if (lastModified) {
  lastModified.textContent = `Dernière modification : ${document.lastModified}`;
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById("hamburger");
const primaryNav = document.getElementById("primaryNav");
if (hamburger && primaryNav) {
  hamburger.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
  });
}

// ===== BUILD DISCOVER CARDS =====
function buildCard(item, index) {
  const card = document.createElement("article");
  card.className = `discover-card card-${index + 1}`;

  const title = document.createElement("h2");
  title.textContent = item.name;

  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.alt;
  img.width = 300;
  img.height = 200;
  img.loading = "lazy";
  figure.appendChild(img);

  const address = document.createElement("address");
  address.textContent = item.address;

  const description = document.createElement("p");
  description.textContent = item.description;

  const learnMoreBtn = document.createElement("button");
  learnMoreBtn.type = "button";
  learnMoreBtn.className = "learn-more-btn";
  learnMoreBtn.textContent = "Learn More";
  learnMoreBtn.addEventListener("click", () => {
    alert(`${item.name}\n${item.address}\n\n${item.description}`);
  });

  card.append(title, figure, address, description, learnMoreBtn);
  return card;
}

function renderDiscoverGrid() {
  const grid = document.getElementById("discoverGrid");
  if (!grid) return;

  grid.innerHTML = "";
  discoverItems.forEach((item, index) => {
    grid.appendChild(buildCard(item, index));
  });
}

renderDiscoverGrid();

// ===== LAST VISIT MESSAGE (localStorage) =====
function showVisitMessage() {
  const visitMessageEl = document.getElementById("visitMessage");
  if (!visitMessageEl) return;

  const now = Date.now();
  const lastVisit = localStorage.getItem("chamberDiscoverLastVisit");

  let message;

  if (!lastVisit) {
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    const daysBetween = Math.floor((now - Number(lastVisit)) / millisecondsInADay);

    if (daysBetween < 1) {
      message = "Back so soon! Awesome!";
    } else if (daysBetween === 1) {
      message = "You last visited 1 day ago.";
    } else {
      message = `You last visited ${daysBetween} days ago.`;
    }
  }

  visitMessageEl.textContent = message;
  localStorage.setItem("chamberDiscoverLastVisit", now.toString());
}

showVisitMessage();