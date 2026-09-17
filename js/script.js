let travelData = null;

async function loadTravelData() {
  if (travelData) return travelData;
  const res = await fetch('js/travel_recommendation_api.json');
  travelData = await res.json();
  return travelData;
}

function cardTemplate(item) {
  return `
    <div class="result-card">
      <div class="images">
        <img src="${item.imageUrl}" alt="${item.name}">
        <img src="${item.imageUrl2}" alt="${item.name}">
      </div>
      <div class="info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button onclick="clearResults()">Not interested</button>
      </div>
    </div>
  `;
}

function renderResults(items) {
  const results = document.getElementById('results');
  if (!results) return;
  if (!items || items.length === 0) {
    results.innerHTML = '<p style="text-align:center;grid-column:1/-1;">No recommendations found. Try "beach", "temple", or a country name.</p>';
    return;
  }
  results.innerHTML = items.map(cardTemplate).join('');
}

function clearResults() {
  const results = document.getElementById('results');
  if (results) results.innerHTML = '';
}

async function searchDestinations(term) {
  const data = await loadTravelData();
  const query = term.trim().toLowerCase();

  if (!query) {
    renderResults([]);
    return;
  }

  if (query.includes('beach')) {
    renderResults(data.beaches);
    return;
  }

  if (query.includes('temple')) {
    renderResults(data.temples);
    return;
  }

  const matchedCountries = data.countries.filter(c =>
    c.name.toLowerCase().includes(query) || query.includes(c.name.toLowerCase())
  );
  if (matchedCountries.length > 0) {
    renderResults(matchedCountries);
    return;
  }

  renderResults([]);
}

function setupSearch() {
  const input = document.getElementById('search-input');
  const button = document.getElementById('search-button');
  if (!button || !input) return;

  button.addEventListener('click', () => searchDestinations(input.value));
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchDestinations(input.value);
  });

  document.querySelectorAll('.category-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      input.value = category;
      searchDestinations(category);
    });
  });
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    status.textContent = 'Thank you! Your message has been sent.';
    status.style.color = 'green';
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSearch();
  setupContactForm();
});
