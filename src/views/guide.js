/* ═══════════════════════════════════════════════════════════════════════════
   guide.js — Shadowhunter's Guide: Characters, Runes, Bestiary, Glossary
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Guide Data ─────────────────────────────────────────────────────────────

const CHARACTERS = [
  {
    name: "Clary Fray",
    alias: "Clarissa Adele Fairchild / Morgenstern",
    species: "Shadowhunter",
    image: "/images/generated/clary.webp",
    gradient: "linear-gradient(135deg, #8b2500 0%, #cd4f39 40%, #c9a84c 100%)",
    initials: "CF",
    bio: "A seemingly ordinary teenager from Brooklyn who discovers she is a Shadowhunter — a descendant of the Angel Raziel born to fight demons. Gifted with the rare ability to create entirely new runes, Clary's hidden heritage draws her into a dangerous world of Downworlders, ancient rivalries, and a father whose ambitions threaten to destroy everything."
  },
  {
    name: "Jace Herondale",
    alias: "Jace Wayland / Morgenstern / Lightwood",
    species: "Shadowhunter",
    image: "/images/generated/jace.webp",
    gradient: "linear-gradient(135deg, #8b7535 0%, #c9a84c 40%, #e8c44a 100%)",
    initials: "JH",
    bio: "Raised to be the perfect warrior, Jace is arrogant, devastatingly skilled, and haunted by a childhood shaped by Valentine Morgenstern. Behind his sharp wit lies deep vulnerability. His complicated identity — shifting between Wayland, Morgenstern, and finally Herondale — mirrors his journey from weapon to someone who learns what it means to love."
  },
  {
    name: "Simon Lewis",
    alias: "Simon Lovelace / Daylighter",
    species: "Mundane → Vampire → Shadowhunter",
    image: "/images/generated/simon.webp",
    gradient: "linear-gradient(135deg, #2c1e3d 0%, #4a3060 40%, #7b5ea7 100%)",
    initials: "SL",
    bio: "Clary's loyal best friend and a self-proclaimed geek who finds himself transformed from mundane to vampire against his will. As the Daylighter — a vampire who can walk in sunlight — Simon becomes unique among the Night Children, bearing the Mark of Cain and eventually ascending to become a Shadowhunter himself."
  },
  {
    name: "Isabelle Lightwood",
    alias: "Izzy",
    species: "Shadowhunter",
    image: "/images/generated/isabelle.webp",
    gradient: "linear-gradient(135deg, #1a0533 0%, #4a1580 40%, #9b59b6 100%)",
    initials: "IL",
    bio: "A fierce and glamorous Shadowhunter who wields her electrum whip with deadly precision. Isabelle's beauty is matched only by her skill in battle and her fierce loyalty to her family. She can cook terribly but fight brilliantly, and her journey explores the depth beneath her confident exterior."
  },
  {
    name: "Alec Lightwood",
    alias: "Alexander Gideon Lightwood",
    species: "Shadowhunter",
    image: "/images/generated/alec.webp",
    gradient: "linear-gradient(135deg, #0a1628 0%, #1a3a5c 40%, #4a90d9 100%)",
    initials: "AL",
    bio: "The eldest Lightwood sibling, a talented archer and natural leader who struggles with his identity and his duty to his family. His relationship with Magnus Bane challenges Shadowhunter traditions and forces the Clave to confront its prejudices. Alec's quiet strength anchors the group through their darkest moments."
  },
  {
    name: "Magnus Bane",
    alias: "The High Warlock of Brooklyn",
    species: "Warlock",
    image: "/images/generated/magnus.webp",
    gradient: "linear-gradient(135deg, #2d1060 0%, #7c3aed 30%, #c9a84c 70%, #e8c44a 100%)",
    initials: "MB",
    bio: "An eight-hundred-year-old warlock with cat's eyes, a flair for the dramatic, and an extensive wardrobe of glitter. Magnus has lived through centuries of Shadowhunter politics and Downworld conflict, and his relationship with Alec Lightwood is one of the series' most beloved arcs. His power is matched only by his style."
  },
  {
    name: "Valentine Morgenstern",
    alias: "Valentine",
    species: "Shadowhunter",
    image: "/images/generated/valentine.webp",
    gradient: "linear-gradient(135deg, #1a0505 0%, #5c1010 40%, #8b1a1a 100%)",
    initials: "VM",
    bio: "The series' central antagonist — a former Shadowhunter who led the Circle in a rebellion against the Clave and the Accords. Valentine believes in Shadowhunter supremacy and seeks the Mortal Instruments to reshape the world. Charismatic and ruthless, he is both Clary's father and Jace's tormenter."
  },
  {
    name: "Luke Garroway",
    alias: "Lucian Graymark",
    species: "Werewolf (formerly Shadowhunter)",
    image: "/images/generated/luke.webp",
    gradient: "linear-gradient(135deg, #1a2e15 0%, #3d6b30 40%, #6ba558 100%)",
    initials: "LG",
    bio: "Once Valentine's parabatai and a Shadowhunter of the Circle, Luke was bitten by a werewolf and cast out. He rebuilt his life as the leader of the New York werewolf pack and as Clary's stepfather, becoming her most steadfast protector. His loyalty, wisdom, and quiet courage make him one of the series' moral compasses."
  },
];

const RUNES = [
  { name: "Angelic Power", altName: "Enkeli", svg: runeAngelicPower(), desc: "The most sacred Mark — the symbol of the Shadowhunters' bond with the Angel Raziel. The first rune most Shadowhunters receive. Used to imbue weapons with angelic properties effective against demons." },
  { name: "Iratze", altName: "Healing Rune", svg: runeIratze(), desc: "The fundamental healing Mark. Accelerates natural healing and can close wounds rapidly. Cannot heal all magical injuries or cure demonic poison. One of the most frequently drawn runes." },
  { name: "Voyance", altName: "The Sight", svg: runeVoyance(), desc: "Applied permanently to the back of the right hand. Enhances a Shadowhunter's ability to see through glamours and perceive the Shadow World. An essential Mark for all active Nephilim." },
  { name: "Parabatai", altName: "Bond Rune", svg: runeParabatai(), desc: "The sacred mark that bonds two warriors together as parabatai — closer than siblings, bound for life. The rune is placed over the heart and grants partners enhanced abilities when fighting together." },
  { name: "Fearless", altName: "Fortitude", svg: runeFearless(), desc: "Temporarily removes the sensation of fear, granting absolute courage. Used strategically before major battles. Can be dangerous if overused, as healthy fear serves as a survival instinct." },
  { name: "Strength", altName: "Fortis", svg: runeStrength(), desc: "Temporarily enhances physical strength beyond normal Shadowhunter levels. One of the most commonly applied combat preparation runes." },
  { name: "Soundless", altName: "Silence", svg: runeSoundless(), desc: "Muffles all sound made by the bearer, allowing for completely silent movement. Essential for stealth missions and demon-hunting operations." },
  { name: "Wedded Union", altName: "Marriage Rune", svg: runeWedded(), desc: "The permanent mark exchanged during a Shadowhunter wedding ceremony, placed on the back of the hand. If a marriage ends, the rune is painfully severed from the skin." },
  { name: "Mark of Cain", altName: "Divine Protection", svg: runeMarkOfCain(), desc: "An ancient and powerful mark that returns any harm done to the bearer sevenfold upon the attacker. Given to Simon Lewis, making him virtually invulnerable but also deeply feared." },
  { name: "Nyx", altName: "Night Vision", svg: runeNyx(), desc: "Grants the ability to see clearly in darkness. Essential for navigating demon lairs, the tunnels of the Silent City, and nighttime operations." },
  { name: "Courage in Combat", altName: "Bravery", svg: runeCourage(), desc: "Bolsters resolve and determination during battle. Unlike Fearless, this rune doesn't remove fear but enhances the bearer's ability to act despite it." },
  { name: "Deflect", altName: "Shield", svg: runeDeflect(), desc: "Creates a partial barrier against physical and some magical attacks. The rune's effectiveness depends on the strength of the incoming force and the skill of the bearer." },
];

const BESTIARY = [
  {
    name: "Demons",
    icon: demonIcon(),
    desc: "Interdimensional beings from the Void, the enemies of all life. They come in countless forms — from the mindless Ravener to the Greater Demons like Abbadon, Lilith, and Asmodeus. They can only be permanently killed by angelic weapons or heavenly fire.",
    notables: "Abbadon, Lilith, Asmodeus, Azazel, Ravener demons, Iblis demons"
  },
  {
    name: "Vampires",
    icon: vampireIcon(),
    desc: "The Night Children — undead humans infected by the vampire bite. They possess superhuman speed and strength, can scale walls, and must drink blood to survive. Sunlight and holy water are deadly. Led by clan leaders in each major city.",
    notables: "Raphael Santiago, Simon Lewis (Daylighter), Camille Belcourt, Maureen Brown"
  },
  {
    name: "Werewolves",
    icon: werewolfIcon(),
    desc: "Humans infected with lycanthropy through a demon disease. They transform during full moons but experienced wolves can control the change. They organize in packs with an alpha leader and are generally allied with the Shadowhunters through the Accords.",
    notables: "Luke Garroway (Lucian Graymark), Maia Roberts, Jordan Kyle (née Ashworth)"
  },
  {
    name: "Warlocks",
    icon: warlockIcon(),
    desc: "Half-demon, half-human offspring who wield powerful magic. Each warlock bears a unique physical mark of their demonic heritage (cat eyes, horns, blue skin, etc.). They are immortal and often serve as magical advisors and potion-makers.",
    notables: "Magnus Bane, Catarina Loss, Ragnor Fell, Tessa Gray"
  },
  {
    name: "Faeries",
    icon: faerieIcon(),
    desc: "The Fair Folk — ancient beings of the Seelie and Unseelie Courts. Beautiful and treacherous, they cannot lie but are masters of half-truths and manipulation. They possess powerful nature magic and live in realms connected to the mundane world.",
    notables: "The Seelie Queen, Meliorn, Kaelie Whitewillow"
  },
  {
    name: "Silent Brothers",
    icon: silentBrotherIcon(),
    desc: "An order of male Shadowhunters who have undergone powerful runic transformations, sealing their eyes and mouths with marks. They serve as archivists, healers, and keepers of the Silent City. They communicate through telepathy.",
    notables: "Brother Zachariah (Jem Carstairs), Brother Jeremiah, Brother Enoch"
  },
];

const GLOSSARY = [
  { term: "Nephilim", def: "The race of Shadowhunters — humans with angelic blood descended from the first Shadowhunter, Jonathan Shadowhunter, who drank from the Mortal Cup filled with the blood of the Angel Raziel." },
  { term: "The Clave", def: "The governing body of the Shadowhunter world. Based in Alicante (the City of Glass), the Clave sets laws, enforces the Accords, and oversees all Shadowhunter operations worldwide." },
  { term: "The Accords", def: "Peace agreements between Shadowhunters and the four Downworlder races (vampires, werewolves, warlocks, faeries). Signed in Accords Hall in Alicante, they are renewed every fifteen years." },
  { term: "Parabatai", def: "A pair of Shadowhunters bonded by a sacred oath and rune. They fight together and draw strength from each other. The bond is chosen voluntarily and is lifelong. Falling in love with one's parabatai is forbidden by Shadowhunter law." },
  { term: "Stele", def: "A crystalline tool used to draw runes on skin or objects. Each Shadowhunter typically carries their own stele. Made from adamas (heavenly stone), they glow when activated." },
  { term: "Seraph Blades", def: "The primary Shadowhunter weapon — blades of adamas that are activated by speaking the name of an angel. They glow with holy light and are lethal to demons." },
  { term: "Witchlight", def: "Stones of adamas that produce a clear, cold white light when held by a Shadowhunter. A standard part of every hunter's gear, they provide illumination without fire." },
  { term: "Glamour", def: "An illusion spell that hides magical creatures and objects from mundane sight. Shadowhunters use glamour runes; Downworlders use inherent magic." },
  { term: "Idris", def: "The secret homeland of the Shadowhunters, hidden in a pocket dimension between France, Germany, and Switzerland. Protected by wards, it is invisible to mundanes." },
  { term: "Alicante", def: "The City of Glass — the only city in Idris and the capital of the Shadowhunter world. Named for its demon towers that protect the city with their crystalline wards." },
  { term: "The Mortal Instruments", def: "Three sacred artifacts given to Shadowhunters by the Angel Raziel: the Mortal Cup (creates new Shadowhunters), the Mortal Sword (compels truth), and the Mortal Mirror (Lake Lyn)." },
  { term: "Institute", def: "Shadowhunter bases located in major cities around the world, often disguised as religious buildings. They serve as headquarters, training grounds, and sanctuaries." },
  { term: "The Circle", def: "A secret organization founded by Valentine Morgenstern advocating for Shadowhunter supremacy and the destruction of Downworlders. They orchestrated the Uprising at the signing of the Accords." },
  { term: "Downworlders", def: "A collective term for the four supernatural races who share the Shadow World with Shadowhunters: vampires (Night Children), werewolves (Moon Children), warlocks (Lilith's Children), and faeries (Fair Folk)." },
  { term: "Mundanes", def: "Ordinary humans who are unaware of the Shadow World. They cannot see through glamour unless they possess the Sight or are shown the truth by a Shadowhunter." },
  { term: "The Gard", def: "The fortress in Alicante that houses the Clave's council chambers, prison cells, and the only permitted Portal in the city. It is the seat of Shadowhunter government." },
  { term: "Heavenly Fire", def: "The divine fire of angels — an immensely powerful and purifying force. Used by the Angel Raziel and later wielded through Jace in City of Heavenly Fire." },
  { term: "Ley Lines", def: "Invisible lines of magical energy that crisscross the earth. Magical locations are often built on ley line convergence points." },
  { term: "Adamas", def: "A heavenly metal found in Idris, used to forge seraph blades, steles, and witchlight stones. It responds to angelic power and is integral to Shadowhunter technology." },
  { term: "Portal", def: "A magical doorway that allows instantaneous travel between locations. Created by warlocks, they are rare and heavily regulated by the Clave." },
];

// ─── Rune SVG generators ────────────────────────────────────────────────────

function runeAngelicPower() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M32 4 L32 60 M16 20 L48 20 M12 38 L52 38 M20 52 L44 52 M32 4 L16 20 M32 4 L48 20"/>
  </svg>`;
}

function runeIratze() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M12 32 Q32 8 52 32 Q32 56 12 32 M32 16 L32 48"/>
  </svg>`;
}

function runeVoyance() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M8 32 Q32 12 56 32 Q32 52 8 32"/>
    <circle cx="32" cy="32" r="8"/>
    <circle cx="32" cy="32" r="3" fill="currentColor"/>
  </svg>`;
}

function runeParabatai() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M20 8 Q8 32 20 56 M44 8 Q56 32 44 56 M20 32 L44 32 M32 8 L32 56"/>
  </svg>`;
}

function runeFearless() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M32 4 L8 56 L56 56 Z M32 20 L32 38 M32 44 L32 48"/>
  </svg>`;
}

function runeStrength() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M16 8 L16 56 L48 56 L48 8 M16 32 L48 32 M32 8 L32 56"/>
  </svg>`;
}

function runeSoundless() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M20 16 Q32 4 44 16 M20 48 Q32 60 44 48 M12 32 L52 32"/>
    <circle cx="32" cy="32" r="6"/>
  </svg>`;
}

function runeWedded() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M32 8 Q16 24 32 40 Q48 24 32 8 M16 48 Q32 36 48 48 M32 40 L32 60"/>
  </svg>`;
}

function runeMarkOfCain() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="32" cy="32" r="24"/>
    <path d="M32 8 L32 56 M8 32 L56 32 M16 16 L48 48 M48 16 L16 48"/>
  </svg>`;
}

function runeNyx() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M24 8 Q8 32 24 56 Q40 32 24 8" fill="none"/>
    <circle cx="40" cy="20" r="3" fill="currentColor"/>
    <circle cx="48" cy="32" r="2" fill="currentColor"/>
    <circle cx="44" cy="44" r="2.5" fill="currentColor"/>
  </svg>`;
}

function runeCourage() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M32 4 L4 28 L20 28 L12 60 L60 28 L40 28 L52 4 Z"/>
  </svg>`;
}

function runeDeflect() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M32 4 L8 20 L8 44 L32 60 L56 44 L56 20 Z"/>
    <path d="M32 16 L20 24 L20 40 L32 48 L44 40 L44 24 Z"/>
  </svg>`;
}

// Bestiary icons
function demonIcon() {
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M24 4 L14 18 L4 14 L12 28 L4 42 L18 36 L24 44 L30 36 L44 42 L36 28 L44 14 L34 18 Z"/></svg>`;
}
function vampireIcon() {
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="24" cy="20" r="12"/><path d="M18 28 L16 40 M30 28 L32 40 M20 32 L24 36 L28 32"/></svg>`;
}
function werewolfIcon() {
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 14 Q24 4 34 14 Q38 24 34 34 Q24 44 14 34 Q10 24 14 14 M20 22 L20 24 M28 22 L28 24 M20 30 Q24 34 28 30"/></svg>`;
}
function warlockIcon() {
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M24 4 L28 16 L40 16 L30 24 L34 36 L24 28 L14 36 L18 24 L8 16 L20 16 Z"/></svg>`;
}
function faerieIcon() {
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M24 12 Q16 4 8 16 Q4 28 16 32 L24 44 L32 32 Q44 28 40 16 Q32 4 24 12 M24 20 L24 32"/></svg>`;
}
function silentBrotherIcon() {
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="24" cy="16" r="10"/><path d="M14 26 L14 44 L34 44 L34 26 M18 16 L22 16 M26 16 L30 16 M20 22 L28 22"/></svg>`;
}

// ─── Render ─────────────────────────────────────────────────────────────────

export function renderGuide(container, data, tab = 'characters') {
  const tabs = ['characters', 'runes', 'bestiary', 'glossary'];
  
  const html = `
    <div class="guide-view">
      <header class="guide-header">
        <h1 class="guide-title">The Shadowhunter's Codex</h1>
        <p class="guide-subtitle">A Complete Guide to the Shadow World</p>
      </header>
      
      <nav class="guide-tabs" id="guide-tabs">
        ${tabs.map(t => `
          <a href="#/guide/${t}" class="guide-tab ${t === tab ? 'active' : ''}" data-tab="${t}">
            ${t.charAt(0).toUpperCase() + t.slice(1)}
          </a>
        `).join('')}
      </nav>
      
      <div id="guide-content">
        ${renderTabContent(tab)}
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Rune card expand toggle
  container.querySelectorAll('.rune-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
  });
  
  return null;
}

function renderTabContent(tab) {
  switch (tab) {
    case 'characters': return renderCharacters();
    case 'runes': return renderRunes();
    case 'bestiary': return renderBestiary();
    case 'glossary': return renderGlossary();
    default: return renderCharacters();
  }
}

function renderCharacters() {
  return `
    <div class="character-grid">
      ${CHARACTERS.map(char => `
        <article class="character-card">
          <div class="character-image" style="background: ${char.gradient};">
            <img class="character-portrait" src="${char.image}" alt="${char.name}" loading="lazy"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; this.parentElement.querySelector('.character-initials').style.display='block';" />
            <svg class="character-rune-bg" viewBox="0 0 100 140" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" style="display:none;">
              <path d="M50 5 L50 135 M25 35 L75 35 M20 70 L80 70 M30 105 L70 105 M50 5 L25 35 M50 5 L75 35 M25 35 L20 70 M75 35 L80 70"/>
            </svg>
            <span class="character-initials" style="display:none;">${char.initials}</span>
          </div>
          <div class="character-info">
            <h3 class="character-name">${char.name}</h3>
            <div class="character-alias">${char.alias}</div>
            <span class="character-species">${char.species}</span>
            <p class="character-bio">${char.bio}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderRunes() {
  return `
    <div class="rune-grid">
      ${RUNES.map(rune => `
        <div class="rune-card">
          <div class="rune-symbol">${rune.svg}</div>
          <h3 class="rune-name">${rune.name}</h3>
          <div class="rune-alt-name">${rune.altName}</div>
          <p class="rune-description">${rune.desc}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderBestiary() {
  return `
    <div class="bestiary-grid">
      ${BESTIARY.map(entry => `
        <article class="bestiary-card">
          <div class="bestiary-icon">${entry.icon}</div>
          <h3 class="bestiary-name">${entry.name}</h3>
          <p class="bestiary-desc">${entry.desc}</p>
          <div class="bestiary-notables"><strong>Notable:</strong> ${entry.notables}</div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderGlossary() {
  return `
    <div class="glossary-list">
      ${GLOSSARY.map(item => `
        <div class="glossary-item">
          <h4 class="glossary-term">${item.term}</h4>
          <p class="glossary-def">${item.def}</p>
        </div>
      `).join('')}
    </div>
  `;
}
