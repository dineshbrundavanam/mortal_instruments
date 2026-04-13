/* ═══════════════════════════════════════════════════════════════════════════
   map.js — Interactive Maps: NYC Shadowhunter Locations & Idris
   ═══════════════════════════════════════════════════════════════════════════ */

const NYC_LOCATIONS = [
  {
    name: "The New York Institute",
    desc: "Disguised as a decaying Gothic cathedral on the Upper East Side, the Institute is the headquarters for Shadowhunters in New York City. It houses living quarters, a vast library, a weapons room, a greenhouse, and an infirmary. Glamoured to appear abandoned to mundane eyes.",
    books: "All six books",
    x: 68, y: 28,
  },
  {
    name: "Pandemonium Club",
    desc: "An all-ages nightclub in Manhattan where Downworlders and mundanes mingle freely. The site of Clary's first encounter with the Shadow World — she watches Jace, Isabelle, and Alec kill a demon disguised as a human boy.",
    books: "City of Bones, City of Ashes",
    x: 55, y: 42,
  },
  {
    name: "Hotel Dumort",
    desc: "A derelict hotel in East Harlem serving as headquarters of the New York vampire clan. The name is a play on the French 'la mort' (death). Once an elegant hotel, now crumbling and occupied by the Night Children led by Raphael Santiago.",
    books: "City of Bones, City of Fallen Angels",
    x: 62, y: 25,
  },
  {
    name: "Magnus Bane's Apartment",
    desc: "A sprawling loft apartment in Brooklyn, decorated with centuries of collected artifacts and a notable amount of glitter. Serves as a frequent meeting point and safe house for the group. The party that changed everything was held here.",
    books: "All six books",
    x: 52, y: 58,
  },
  {
    name: "Jade Wolf",
    desc: "A Chinese restaurant on the waterfront that serves as a front for the New York werewolf pack's headquarters. Luke Garroway runs pack operations from the back rooms while the restaurant serves questionable cuisine to mundane customers.",
    books: "City of Bones, City of Ashes, City of Glass",
    x: 38, y: 65,
  },
  {
    name: "Taki's Diner",
    desc: "A Downworlder restaurant where Shadowhunters and various supernatural creatures eat side by side. Known for its eclectic menu catering to all species and its role as a neutral meeting ground.",
    books: "City of Ashes, City of Glass",
    x: 72, y: 35,
  },
  {
    name: "Beth Israel Hospital",
    desc: "The mundane hospital where Jocelyn Fray is kept in a magical coma after Valentine's attack. Clary visits frequently, trying to find a way to wake her mother.",
    books: "City of Bones, City of Ashes",
    x: 48, y: 48,
  },
  {
    name: "Luke's Bookstore",
    desc: "Luke Garroway's bookshop in Brooklyn, a cozy refuge filled with rare and secondhand books. Clary has spent many happy hours here. It serves as Luke's mundane cover.",
    books: "City of Bones",
    x: 45, y: 62,
  },
];

const IDRIS_LOCATIONS = [
  {
    name: "Alicante — City of Glass",
    desc: "The only city in Idris and the capital of the Shadowhunter world. Named for its towering demon towers made of adamas that create a protective ward around the city, making them shimmer like glass. A medieval-styled city of narrow streets and canals.",
    books: "City of Glass, City of Heavenly Fire",
    x: 50, y: 42,
  },
  {
    name: "The Gard",
    desc: "The fortress-like headquarters of the Clave, perched on a hill above Alicante. Houses the council chambers, the Consul's office, and the city's only sanctioned Portal. The seat of Shadowhunter law and government.",
    books: "City of Glass, City of Heavenly Fire",
    x: 48, y: 35,
  },
  {
    name: "Accords Hall",
    desc: "The grand central hall of Alicante where the peace Accords between Shadowhunters and Downworlders are signed and renewed. A beautiful building of white stone and glass, symbolizing transparency and unity.",
    books: "City of Glass, City of Heavenly Fire",
    x: 53, y: 45,
  },
  {
    name: "Lake Lyn",
    desc: "The Mortal Mirror — a remote lake whose waters are poisonous to Shadowhunters, causing hallucinations and madness. Also known as the third of the Mortal Instruments, its true nature was hidden for centuries.",
    books: "City of Glass, City of Lost Souls",
    x: 25, y: 30,
  },
  {
    name: "Brocelind Forest",
    desc: "The great forest surrounding Alicante, separating the city from the rest of Idris. Dense old-growth woodland that is home to wild creatures both natural and supernatural. The site of major battles throughout Shadowhunter history.",
    books: "City of Glass, City of Heavenly Fire",
    x: 35, y: 55,
  },
  {
    name: "The Imperishable Fields",
    desc: "The sacred ground just outside Alicante's walls used for traditional Shadowhunter funeral rites. The dead are burned on pyres in the Nephilim tradition, their names spoken to the sky.",
    books: "City of Glass, City of Heavenly Fire",
    x: 60, y: 52,
  },
  {
    name: "The Fairchild Manor",
    desc: "The ancestral estate of the Fairchild family in the Idris countryside. Jocelyn Fairchild grew up here before marrying Valentine. Like many Shadowhunter manors, it holds generations of history and secrets.",
    books: "City of Glass",
    x: 70, y: 28,
  },
  {
    name: "Herondale Manor",
    desc: "The estate of the Herondale family, one of the oldest and most respected Shadowhunter bloodlines. Connected to both Will Herondale (The Infernal Devices) and Jace, the family's legacy spans centuries.",
    books: "City of Glass, City of Heavenly Fire",
    x: 75, y: 60,
  },
];

export function renderMap(container, data, tab = 'nyc') {
  const html = `
    <div class="map-view">
      <header class="map-header">
        <h1 class="map-title">The Shadow World — Locations</h1>
      </header>
      
      <nav class="map-tabs">
        <a href="#/map/nyc" class="map-tab ${tab === 'nyc' ? 'active' : ''}" data-tab="nyc">New York City</a>
        <a href="#/map/idris" class="map-tab ${tab === 'idris' ? 'active' : ''}" data-tab="idris">Idris</a>
      </nav>
      
      <div class="map-container" id="map-container">
        <img class="map-image" src="/images/generated/map_${tab}.webp" alt="${tab === 'nyc' ? 'New York City Shadowhunter Map' : 'Map of Idris'}"
             onerror="this.remove()"
             loading="lazy"/>
        ${renderMarkers(tab === 'nyc' ? NYC_LOCATIONS : IDRIS_LOCATIONS)}
        <div class="map-tooltip" id="map-tooltip">
          <h4 class="map-tooltip-name" id="tooltip-name"></h4>
          <p class="map-tooltip-desc" id="tooltip-desc"></p>
          <div class="map-tooltip-books" id="tooltip-books"></div>
        </div>
      </div>
      
      <div class="section-title" style="margin-top: var(--space-2xl);">
        ${tab === 'nyc' ? 'Key NYC Locations' : 'Locations in Idris'}
      </div>
      
      <div class="map-locations">
        ${(tab === 'nyc' ? NYC_LOCATIONS : IDRIS_LOCATIONS).map(loc => `
          <div class="map-location-card">
            <h4 class="map-location-name">${loc.name}</h4>
            <p class="map-location-desc">${loc.desc}</p>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: var(--space-sm);">
              📚 ${loc.books}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Map marker interactions
  const tooltip = document.getElementById('map-tooltip');
  const tooltipName = document.getElementById('tooltip-name');
  const tooltipDesc = document.getElementById('tooltip-desc');
  const tooltipBooks = document.getElementById('tooltip-books');
  const mapContainer = document.getElementById('map-container');
  const locations = tab === 'nyc' ? NYC_LOCATIONS : IDRIS_LOCATIONS;
  
  container.querySelectorAll('.map-marker').forEach((marker, i) => {
    const loc = locations[i];
    
    marker.addEventListener('mouseenter', (e) => {
      tooltipName.textContent = loc.name;
      tooltipDesc.textContent = loc.desc.substring(0, 150) + '...';
      tooltipBooks.textContent = `📚 ${loc.books}`;
      
      const rect = mapContainer.getBoundingClientRect();
      const markerRect = marker.getBoundingClientRect();
      
      let left = markerRect.left - rect.left + 30;
      let top = markerRect.top - rect.top - 10;
      
      // Keep tooltip in bounds
      if (left + 300 > rect.width) left = left - 330;
      if (top < 0) top = 10;
      
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.classList.add('visible');
    });
    
    marker.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
  
  return null;
}

function renderMarkers(locations) {
  return locations.map((loc, i) => `
    <div class="map-marker" style="left: ${loc.x}%; top: ${loc.y}%;" 
         title="${loc.name}" data-index="${i}"></div>
  `).join('');
}
