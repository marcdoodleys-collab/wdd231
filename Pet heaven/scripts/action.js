// Pet Haven — action.js (ES module)
// Reads the query string produced by the contact.html form submission
// (method="get") and displays the submitted values using template
// literals and DOM manipulation.

const fieldLabels = {
  name: "Nom complet",
  email: "Courriel",
  pet: "Animal qui vous intéresse",
  reason: "Raison du contact",
  message: "Message"
};

function renderSummary() {
  const container = document.querySelector("#submission-summary");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const entries = [...params.entries()].filter(([, value]) => value.trim() !== "");

  if (entries.length === 0) {
    container.innerHTML = `<p class="empty-state">Aucune donnée de formulaire n'a été reçue. <a href="contact.html">Retourner au formulaire</a>.</p>`;
    return;
  }

  const rows = entries
    .map(([key, value]) => `<dt>${fieldLabels[key] || key}</dt><dd>${value}</dd>`)
    .join("");

  container.innerHTML = `
    <div class="summary-card">
      <h2>Merci, votre message a bien été reçu !</h2>
      <dl>${rows}</dl>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", renderSummary);
