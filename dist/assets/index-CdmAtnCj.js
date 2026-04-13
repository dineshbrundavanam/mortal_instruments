(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`tmi-reading-progress`,t=class{static getAll(){try{return JSON.parse(localStorage.getItem(e)||`{}`)}catch{return{}}}static getBookProgress(e){return this.getAll()[e]||{lastChapterId:null,scrollPositions:{},completedChapters:[]}}static saveChapterPosition(t,n,r){let i=this.getAll();i[t]||(i[t]={lastChapterId:null,scrollPositions:{},completedChapters:[]}),i[t].lastChapterId=n,i[t].scrollPositions[n]=r,i[t].lastRead=Date.now(),localStorage.setItem(e,JSON.stringify(i))}static markChapterComplete(t,n){let r=this.getAll();r[t]||(r[t]={lastChapterId:null,scrollPositions:{},completedChapters:[]}),r[t].completedChapters.includes(n)||r[t].completedChapters.push(n),localStorage.setItem(e,JSON.stringify(r))}static getScrollPosition(e,t){return this.getBookProgress(e).scrollPositions[t]||0}static getLastRead(){let e=this.getAll(),t=null,n=0;for(let[r,i]of Object.entries(e))i.lastRead&&i.lastRead>n&&(n=i.lastRead,t={bookId:r,chapterId:i.lastChapterId});return t}static getBookCompletionPercent(e,t){let n=this.getBookProgress(e);return!n.completedChapters||!t?0:Math.round(n.completedChapters.length/t*100)}};function n(e,n){let r=t.getLastRead(),i=null,a=null;return r&&(i=n.books.find(e=>e.id===r.bookId),i&&(a=i.chapters.find(e=>e.id===r.chapterId))),e.innerHTML=`
    <div class="home-view">
      <!-- Hero Section -->
      <section class="hero">
        <svg class="hero-rune" viewBox="0 0 100 140" aria-label="Angelic Power Rune">
          <path d="M50 5 L50 135 M25 35 L75 35 M20 70 L80 70 M30 105 L70 105 M50 5 L25 35 M50 5 L75 35 M25 35 L20 70 M75 35 L80 70 M20 70 L30 105 M80 70 L70 105 M30 105 L50 135 M70 105 L50 135" 
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                style="color: var(--gold)"/>
        </svg>
        <h1 class="hero-title">The Mortal Instruments</h1>
        <p class="hero-subtitle">The Complete Collection</p>
        <p class="hero-author">by Cassandra Clare</p>
      </section>
      
      ${i&&a?`
        <!-- Continue Reading Banner -->
        <a href="#/read/${i.id}/${a.id}" class="continue-banner" id="continue-banner">
          <div class="continue-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <div class="continue-info">
            <div class="continue-label">Continue Reading</div>
            <div class="continue-title">${i.title}</div>
            <div class="continue-chapter">${a.number>0?`Chapter ${a.number}: `:``}${a.title}</div>
          </div>
        </a>
      `:``}
      
      <!-- Book Grid -->
      <div class="section-title">The Six Books</div>
      <div class="book-grid" id="book-grid">
        ${n.books.map(e=>{let n=t.getBookCompletionPercent(e.id,e.totalChapters),r=t.getBookProgress(e.id),i=r.lastChapterId?e.chapters.find(e=>e.id===r.lastChapterId):null;return`
            <article class="book-card" data-book-id="${e.id}" id="book-card-${e.bookNumber}">
              <div class="book-card-cover">
                <img src="${e.coverImage}" alt="${e.title} cover" loading="lazy" />
                <span class="book-number">Book ${e.bookNumber}</span>
              </div>
              <div class="book-card-body">
                <h2 class="book-card-title">${e.title}</h2>
                <div class="book-card-year">${e.year}</div>
                <p class="book-card-tagline">${e.tagline}</p>
                <div class="book-card-meta">
                  <span class="book-card-chapters">${e.totalChapters} chapters</span>
                  ${i?`<span style="color: var(--gold); font-size: 0.75rem;">📖 ${i.title}</span>`:``}
                </div>
              </div>
              <div class="book-progress">
                <div class="book-progress-fill" style="width: ${n}%; background: ${e.color};"></div>
              </div>
            </article>
          `}).join(``)}
      </div>
    </div>
  `,e.querySelectorAll(`.book-card`).forEach(e=>{e.addEventListener(`click`,()=>{let r=e.dataset.bookId,i=n.books.find(e=>e.id===r),a=t.getBookProgress(r);a.lastChapterId?window.location.hash=`#/read/${r}/${a.lastChapterId}`:window.location.hash=`#/read/${r}/${i.chapters[0].id}`})}),e.querySelectorAll(`.book-card`).forEach((e,t)=>{e.style.opacity=`0`,e.style.transform=`translateY(30px)`,e.style.transition=`opacity 0.5s ease ${t*.1}s, transform 0.5s ease ${t*.1}s`,requestAnimationFrame(()=>{e.style.opacity=`1`,e.style.transform=`translateY(0)`})}),null}async function r(e,n,r,a){let o=n.books.find(e=>e.id===r);if(!o)return e.innerHTML=`<p style="padding: 2rem; text-align: center;">Book not found.</p>`,null;if(!a)return a=t.getBookProgress(r).lastChapterId||o.chapters[0].id,window.location.hash=`#/read/${r}/${a}`,null;let s=o.chapters.findIndex(e=>e.id===a),c=o.chapters[s];if(!c)return e.innerHTML=`<p style="padding: 2rem; text-align: center;">Chapter not found.</p>`,null;let l=s>0?o.chapters[s-1]:null,u=s<o.chapters.length-1?o.chapters[s+1]:null,d=n.books.findIndex(e=>e.id===r),f=!u&&d<n.books.length-1?n.books[d+1]:null,p=!l&&d>0?n.books[d-1]:null,m=``;try{m=await(await fetch(`/${c.file}`)).text(),m=m.replace(/^\s*<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>\s*/,``)}catch{m=`<p>Error loading chapter content.</p>`}let h=localStorage.getItem(`tmi-reading-mode`)||`dark`,g=parseInt(localStorage.getItem(`tmi-font-size`)||`18`);e.innerHTML=`
    <div class="reader-view ${h===`dark`?``:`reader-${h}`}" id="reader-view">
      <!-- Reading progress bar -->
      <div class="reading-progress">
        <div class="reading-progress-fill" id="reading-progress-fill" style="width: 0%"></div>
      </div>
      
      <!-- TOC Overlay -->
      <div class="toc-overlay" id="toc-overlay"></div>
      
      <!-- TOC Sidebar -->
      <aside class="toc-sidebar" id="toc-sidebar">
        <div class="toc-header">
          <span class="toc-title">${o.title}</span>
          <button class="toc-close" id="toc-close" aria-label="Close table of contents">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        ${i(o.chapters,a,r)}
      </aside>
      
      <!-- Chapter Header -->
      <header class="chapter-header">
        <div class="chapter-book-title">${o.title}</div>
        <div class="chapter-part">${c.part}</div>
        ${c.number>0?`<div class="chapter-number">Chapter ${c.number}</div>`:``}
        <h1 class="chapter-title">${c.title}</h1>
        <div class="chapter-meta">
          <span>📖 ~${c.readingTime} min read</span>
          <span>•</span>
          <span>${s+1} of ${o.chapters.length}</span>
        </div>
        <div class="chapter-divider"></div>
      </header>
      
      <!-- Chapter Content -->
      <article class="chapter-content" id="chapter-content" style="--reader-font-size: ${g}px">
        ${m}
      </article>
      
      <!-- Chapter Navigation -->
      <nav class="chapter-nav">
        <button class="chapter-nav-btn prev" id="nav-prev" ${!l&&!p?`disabled`:``}>
          <span class="chapter-nav-label">← Previous</span>
          <span class="chapter-nav-title">${l?l.title:p?`${p.title} (Final)`:`Start of Book`}</span>
        </button>
        <button class="chapter-nav-btn next" id="nav-next" ${!u&&!f?`disabled`:``}>
          <span class="chapter-nav-label">Next →</span>
          <span class="chapter-nav-title">${u?u.title:f?`${f.title} (Begin)`:`End of Series`}</span>
        </button>
      </nav>
      
      <!-- Reader Controls -->
      <div class="reader-controls">
        <button class="reader-control-btn" id="btn-toc" title="Table of Contents (T)">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
        <button class="reader-control-btn" id="btn-font-up" title="Increase Font Size">A+</button>
        <button class="reader-control-btn" id="btn-font-down" title="Decrease Font Size">A−</button>
        <button class="reader-control-btn" id="btn-theme" title="Reading Theme">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a10 10 0 0 0 0 20z"/>
          </svg>
        </button>
      </div>
    </div>
  `;let _=document.getElementById(`toc-sidebar`),v=document.getElementById(`toc-overlay`);function y(e){_.classList.toggle(`open`,e),v.classList.toggle(`visible`,e)}document.getElementById(`btn-toc`).addEventListener(`click`,()=>y(!0)),document.getElementById(`toc-close`).addEventListener(`click`,()=>y(!1)),v.addEventListener(`click`,()=>y(!1)),document.getElementById(`nav-prev`).addEventListener(`click`,()=>{if(l)window.location.hash=`#/read/${r}/${l.id}`;else if(p){let e=p.chapters[p.chapters.length-1];window.location.hash=`#/read/${p.id}/${e.id}`}}),document.getElementById(`nav-next`).addEventListener(`click`,()=>{t.markChapterComplete(r,a),u?window.location.hash=`#/read/${r}/${u.id}`:f&&(window.location.hash=`#/read/${f.id}/${f.chapters[0].id}`)});let b=document.getElementById(`chapter-content`),x=g;document.getElementById(`btn-font-up`).addEventListener(`click`,()=>{x=Math.min(28,x+2),b.style.setProperty(`--reader-font-size`,`${x}px`),localStorage.setItem(`tmi-font-size`,x),$(`Font size: ${x}px`)}),document.getElementById(`btn-font-down`).addEventListener(`click`,()=>{x=Math.max(14,x-2),b.style.setProperty(`--reader-font-size`,`${x}px`),localStorage.setItem(`tmi-font-size`,x),$(`Font size: ${x}px`)});let S=[`dark`,`sepia`,`light`],C=S.indexOf(h);document.getElementById(`btn-theme`).addEventListener(`click`,()=>{C=(C+1)%S.length;let e=S[C],t=document.getElementById(`reader-view`);t.classList.remove(`reader-sepia`,`reader-light`),e!==`dark`&&t.classList.add(`reader-${e}`),localStorage.setItem(`tmi-reading-mode`,e),$(`${e.charAt(0).toUpperCase()+e.slice(1)} mode`)});function w(e){e.key===`ArrowLeft`&&l?window.location.hash=`#/read/${r}/${l.id}`:e.key===`ArrowRight`&&u?(t.markChapterComplete(r,a),window.location.hash=`#/read/${r}/${u.id}`):e.key===`t`||e.key===`T`?y(!_.classList.contains(`open`)):e.key===`Escape`&&y(!1)}document.addEventListener(`keydown`,w);let T=document.getElementById(`reading-progress-fill`),E=null;function D(){let e=window.scrollY,n=document.documentElement.scrollHeight-window.innerHeight,i=n>0?Math.min(100,e/n*100):0;T.style.width=`${i}%`,E&&clearTimeout(E),E=setTimeout(()=>{t.saveChapterPosition(r,a,i),i>95&&t.markChapterComplete(r,a)},300)}window.addEventListener(`scroll`,D);let O=t.getScrollPosition(r,a);O>5?setTimeout(()=>{let e=document.documentElement.scrollHeight-window.innerHeight,t=O/100*e;window.scrollTo({top:t,behavior:`smooth`})},300):window.scrollTo(0,0),t.saveChapterPosition(r,a,O||0);let k=window.scrollY,A=document.getElementById(`main-nav`);function j(){let e=window.scrollY;e>k&&e>100?A.classList.add(`nav-hidden`):A.classList.remove(`nav-hidden`),k=e}return window.addEventListener(`scroll`,j),()=>{document.removeEventListener(`keydown`,w),window.removeEventListener(`scroll`,D),window.removeEventListener(`scroll`,j),A.classList.remove(`nav-hidden`),E&&clearTimeout(E)}}function i(e,t,n){let r=``,i=``;for(let a of e){a.part!==r&&(r=a.part,i+=`<div class="toc-part">${r}</div>`);let e=a.id===t;a.number>0&&`${a.number}`,i+=`
      <a href="#/read/${n}/${a.id}" class="toc-item ${e?`active`:``}">
        ${a.number>0?`<span class="toc-item-number">${a.number}</span>`:``}
        ${a.title}
      </a>
    `}return i}var a=[{name:`Clary Fray`,alias:`Clarissa Adele Fairchild / Morgenstern`,species:`Shadowhunter`,image:`/images/generated/clary.webp`,gradient:`linear-gradient(135deg, #8b2500 0%, #cd4f39 40%, #c9a84c 100%)`,initials:`CF`,bio:`A seemingly ordinary teenager from Brooklyn who discovers she is a Shadowhunter — a descendant of the Angel Raziel born to fight demons. Gifted with the rare ability to create entirely new runes, Clary's hidden heritage draws her into a dangerous world of Downworlders, ancient rivalries, and a father whose ambitions threaten to destroy everything.`},{name:`Jace Herondale`,alias:`Jace Wayland / Morgenstern / Lightwood`,species:`Shadowhunter`,image:`/images/generated/jace.webp`,gradient:`linear-gradient(135deg, #8b7535 0%, #c9a84c 40%, #e8c44a 100%)`,initials:`JH`,bio:`Raised to be the perfect warrior, Jace is arrogant, devastatingly skilled, and haunted by a childhood shaped by Valentine Morgenstern. Behind his sharp wit lies deep vulnerability. His complicated identity — shifting between Wayland, Morgenstern, and finally Herondale — mirrors his journey from weapon to someone who learns what it means to love.`},{name:`Simon Lewis`,alias:`Simon Lovelace / Daylighter`,species:`Mundane → Vampire → Shadowhunter`,image:`/images/generated/simon.webp`,gradient:`linear-gradient(135deg, #2c1e3d 0%, #4a3060 40%, #7b5ea7 100%)`,initials:`SL`,bio:`Clary's loyal best friend and a self-proclaimed geek who finds himself transformed from mundane to vampire against his will. As the Daylighter — a vampire who can walk in sunlight — Simon becomes unique among the Night Children, bearing the Mark of Cain and eventually ascending to become a Shadowhunter himself.`},{name:`Isabelle Lightwood`,alias:`Izzy`,species:`Shadowhunter`,image:`/images/generated/isabelle.webp`,gradient:`linear-gradient(135deg, #1a0533 0%, #4a1580 40%, #9b59b6 100%)`,initials:`IL`,bio:`A fierce and glamorous Shadowhunter who wields her electrum whip with deadly precision. Isabelle's beauty is matched only by her skill in battle and her fierce loyalty to her family. She can cook terribly but fight brilliantly, and her journey explores the depth beneath her confident exterior.`},{name:`Alec Lightwood`,alias:`Alexander Gideon Lightwood`,species:`Shadowhunter`,image:`/images/generated/alec.webp`,gradient:`linear-gradient(135deg, #0a1628 0%, #1a3a5c 40%, #4a90d9 100%)`,initials:`AL`,bio:`The eldest Lightwood sibling, a talented archer and natural leader who struggles with his identity and his duty to his family. His relationship with Magnus Bane challenges Shadowhunter traditions and forces the Clave to confront its prejudices. Alec's quiet strength anchors the group through their darkest moments.`},{name:`Magnus Bane`,alias:`The High Warlock of Brooklyn`,species:`Warlock`,image:`/images/generated/magnus.webp`,gradient:`linear-gradient(135deg, #2d1060 0%, #7c3aed 30%, #c9a84c 70%, #e8c44a 100%)`,initials:`MB`,bio:`An eight-hundred-year-old warlock with cat's eyes, a flair for the dramatic, and an extensive wardrobe of glitter. Magnus has lived through centuries of Shadowhunter politics and Downworld conflict, and his relationship with Alec Lightwood is one of the series' most beloved arcs. His power is matched only by his style.`},{name:`Valentine Morgenstern`,alias:`Valentine`,species:`Shadowhunter`,image:`/images/generated/valentine.webp`,gradient:`linear-gradient(135deg, #1a0505 0%, #5c1010 40%, #8b1a1a 100%)`,initials:`VM`,bio:`The series' central antagonist — a former Shadowhunter who led the Circle in a rebellion against the Clave and the Accords. Valentine believes in Shadowhunter supremacy and seeks the Mortal Instruments to reshape the world. Charismatic and ruthless, he is both Clary's father and Jace's tormenter.`},{name:`Luke Garroway`,alias:`Lucian Graymark`,species:`Werewolf (formerly Shadowhunter)`,image:`/images/generated/luke.webp`,gradient:`linear-gradient(135deg, #1a2e15 0%, #3d6b30 40%, #6ba558 100%)`,initials:`LG`,bio:`Once Valentine's parabatai and a Shadowhunter of the Circle, Luke was bitten by a werewolf and cast out. He rebuilt his life as the leader of the New York werewolf pack and as Clary's stepfather, becoming her most steadfast protector. His loyalty, wisdom, and quiet courage make him one of the series' moral compasses.`}],o=[{name:`Angelic Power`,altName:`Enkeli`,svg:l(),desc:`The most sacred Mark — the symbol of the Shadowhunters' bond with the Angel Raziel. The first rune most Shadowhunters receive. Used to imbue weapons with angelic properties effective against demons.`},{name:`Iratze`,altName:`Healing Rune`,svg:u(),desc:`The fundamental healing Mark. Accelerates natural healing and can close wounds rapidly. Cannot heal all magical injuries or cure demonic poison. One of the most frequently drawn runes.`},{name:`Voyance`,altName:`The Sight`,svg:d(),desc:`Applied permanently to the back of the right hand. Enhances a Shadowhunter's ability to see through glamours and perceive the Shadow World. An essential Mark for all active Nephilim.`},{name:`Parabatai`,altName:`Bond Rune`,svg:f(),desc:`The sacred mark that bonds two warriors together as parabatai — closer than siblings, bound for life. The rune is placed over the heart and grants partners enhanced abilities when fighting together.`},{name:`Fearless`,altName:`Fortitude`,svg:p(),desc:`Temporarily removes the sensation of fear, granting absolute courage. Used strategically before major battles. Can be dangerous if overused, as healthy fear serves as a survival instinct.`},{name:`Strength`,altName:`Fortis`,svg:m(),desc:`Temporarily enhances physical strength beyond normal Shadowhunter levels. One of the most commonly applied combat preparation runes.`},{name:`Soundless`,altName:`Silence`,svg:h(),desc:`Muffles all sound made by the bearer, allowing for completely silent movement. Essential for stealth missions and demon-hunting operations.`},{name:`Wedded Union`,altName:`Marriage Rune`,svg:g(),desc:`The permanent mark exchanged during a Shadowhunter wedding ceremony, placed on the back of the hand. If a marriage ends, the rune is painfully severed from the skin.`},{name:`Mark of Cain`,altName:`Divine Protection`,svg:_(),desc:`An ancient and powerful mark that returns any harm done to the bearer sevenfold upon the attacker. Given to Simon Lewis, making him virtually invulnerable but also deeply feared.`},{name:`Nyx`,altName:`Night Vision`,svg:v(),desc:`Grants the ability to see clearly in darkness. Essential for navigating demon lairs, the tunnels of the Silent City, and nighttime operations.`},{name:`Courage in Combat`,altName:`Bravery`,svg:y(),desc:`Bolsters resolve and determination during battle. Unlike Fearless, this rune doesn't remove fear but enhances the bearer's ability to act despite it.`},{name:`Deflect`,altName:`Shield`,svg:b(),desc:`Creates a partial barrier against physical and some magical attacks. The rune's effectiveness depends on the strength of the incoming force and the skill of the bearer.`}],s=[{name:`Demons`,icon:x(),desc:`Interdimensional beings from the Void, the enemies of all life. They come in countless forms — from the mindless Ravener to the Greater Demons like Abbadon, Lilith, and Asmodeus. They can only be permanently killed by angelic weapons or heavenly fire.`,notables:`Abbadon, Lilith, Asmodeus, Azazel, Ravener demons, Iblis demons`},{name:`Vampires`,icon:S(),desc:`The Night Children — undead humans infected by the vampire bite. They possess superhuman speed and strength, can scale walls, and must drink blood to survive. Sunlight and holy water are deadly. Led by clan leaders in each major city.`,notables:`Raphael Santiago, Simon Lewis (Daylighter), Camille Belcourt, Maureen Brown`},{name:`Werewolves`,icon:C(),desc:`Humans infected with lycanthropy through a demon disease. They transform during full moons but experienced wolves can control the change. They organize in packs with an alpha leader and are generally allied with the Shadowhunters through the Accords.`,notables:`Luke Garroway (Lucian Graymark), Maia Roberts, Jordan Kyle (née Ashworth)`},{name:`Warlocks`,icon:w(),desc:`Half-demon, half-human offspring who wield powerful magic. Each warlock bears a unique physical mark of their demonic heritage (cat eyes, horns, blue skin, etc.). They are immortal and often serve as magical advisors and potion-makers.`,notables:`Magnus Bane, Catarina Loss, Ragnor Fell, Tessa Gray`},{name:`Faeries`,icon:T(),desc:`The Fair Folk — ancient beings of the Seelie and Unseelie Courts. Beautiful and treacherous, they cannot lie but are masters of half-truths and manipulation. They possess powerful nature magic and live in realms connected to the mundane world.`,notables:`The Seelie Queen, Meliorn, Kaelie Whitewillow`},{name:`Silent Brothers`,icon:E(),desc:`An order of male Shadowhunters who have undergone powerful runic transformations, sealing their eyes and mouths with marks. They serve as archivists, healers, and keepers of the Silent City. They communicate through telepathy.`,notables:`Brother Zachariah (Jem Carstairs), Brother Jeremiah, Brother Enoch`}],c=[{term:`Nephilim`,def:`The race of Shadowhunters — humans with angelic blood descended from the first Shadowhunter, Jonathan Shadowhunter, who drank from the Mortal Cup filled with the blood of the Angel Raziel.`},{term:`The Clave`,def:`The governing body of the Shadowhunter world. Based in Alicante (the City of Glass), the Clave sets laws, enforces the Accords, and oversees all Shadowhunter operations worldwide.`},{term:`The Accords`,def:`Peace agreements between Shadowhunters and the four Downworlder races (vampires, werewolves, warlocks, faeries). Signed in Accords Hall in Alicante, they are renewed every fifteen years.`},{term:`Parabatai`,def:`A pair of Shadowhunters bonded by a sacred oath and rune. They fight together and draw strength from each other. The bond is chosen voluntarily and is lifelong. Falling in love with one's parabatai is forbidden by Shadowhunter law.`},{term:`Stele`,def:`A crystalline tool used to draw runes on skin or objects. Each Shadowhunter typically carries their own stele. Made from adamas (heavenly stone), they glow when activated.`},{term:`Seraph Blades`,def:`The primary Shadowhunter weapon — blades of adamas that are activated by speaking the name of an angel. They glow with holy light and are lethal to demons.`},{term:`Witchlight`,def:`Stones of adamas that produce a clear, cold white light when held by a Shadowhunter. A standard part of every hunter's gear, they provide illumination without fire.`},{term:`Glamour`,def:`An illusion spell that hides magical creatures and objects from mundane sight. Shadowhunters use glamour runes; Downworlders use inherent magic.`},{term:`Idris`,def:`The secret homeland of the Shadowhunters, hidden in a pocket dimension between France, Germany, and Switzerland. Protected by wards, it is invisible to mundanes.`},{term:`Alicante`,def:`The City of Glass — the only city in Idris and the capital of the Shadowhunter world. Named for its demon towers that protect the city with their crystalline wards.`},{term:`The Mortal Instruments`,def:`Three sacred artifacts given to Shadowhunters by the Angel Raziel: the Mortal Cup (creates new Shadowhunters), the Mortal Sword (compels truth), and the Mortal Mirror (Lake Lyn).`},{term:`Institute`,def:`Shadowhunter bases located in major cities around the world, often disguised as religious buildings. They serve as headquarters, training grounds, and sanctuaries.`},{term:`The Circle`,def:`A secret organization founded by Valentine Morgenstern advocating for Shadowhunter supremacy and the destruction of Downworlders. They orchestrated the Uprising at the signing of the Accords.`},{term:`Downworlders`,def:`A collective term for the four supernatural races who share the Shadow World with Shadowhunters: vampires (Night Children), werewolves (Moon Children), warlocks (Lilith's Children), and faeries (Fair Folk).`},{term:`Mundanes`,def:`Ordinary humans who are unaware of the Shadow World. They cannot see through glamour unless they possess the Sight or are shown the truth by a Shadowhunter.`},{term:`The Gard`,def:`The fortress in Alicante that houses the Clave's council chambers, prison cells, and the only permitted Portal in the city. It is the seat of Shadowhunter government.`},{term:`Heavenly Fire`,def:`The divine fire of angels — an immensely powerful and purifying force. Used by the Angel Raziel and later wielded through Jace in City of Heavenly Fire.`},{term:`Ley Lines`,def:`Invisible lines of magical energy that crisscross the earth. Magical locations are often built on ley line convergence points.`},{term:`Adamas`,def:`A heavenly metal found in Idris, used to forge seraph blades, steles, and witchlight stones. It responds to angelic power and is integral to Shadowhunter technology.`},{term:`Portal`,def:`A magical doorway that allows instantaneous travel between locations. Created by warlocks, they are rare and heavily regulated by the Clave.`}];function l(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M32 4 L32 60 M16 20 L48 20 M12 38 L52 38 M20 52 L44 52 M32 4 L16 20 M32 4 L48 20"/>
  </svg>`}function u(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M12 32 Q32 8 52 32 Q32 56 12 32 M32 16 L32 48"/>
  </svg>`}function d(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M8 32 Q32 12 56 32 Q32 52 8 32"/>
    <circle cx="32" cy="32" r="8"/>
    <circle cx="32" cy="32" r="3" fill="currentColor"/>
  </svg>`}function f(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M20 8 Q8 32 20 56 M44 8 Q56 32 44 56 M20 32 L44 32 M32 8 L32 56"/>
  </svg>`}function p(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M32 4 L8 56 L56 56 Z M32 20 L32 38 M32 44 L32 48"/>
  </svg>`}function m(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M16 8 L16 56 L48 56 L48 8 M16 32 L48 32 M32 8 L32 56"/>
  </svg>`}function h(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M20 16 Q32 4 44 16 M20 48 Q32 60 44 48 M12 32 L52 32"/>
    <circle cx="32" cy="32" r="6"/>
  </svg>`}function g(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M32 8 Q16 24 32 40 Q48 24 32 8 M16 48 Q32 36 48 48 M32 40 L32 60"/>
  </svg>`}function _(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="32" cy="32" r="24"/>
    <path d="M32 8 L32 56 M8 32 L56 32 M16 16 L48 48 M48 16 L16 48"/>
  </svg>`}function v(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M24 8 Q8 32 24 56 Q40 32 24 8" fill="none"/>
    <circle cx="40" cy="20" r="3" fill="currentColor"/>
    <circle cx="48" cy="32" r="2" fill="currentColor"/>
    <circle cx="44" cy="44" r="2.5" fill="currentColor"/>
  </svg>`}function y(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M32 4 L4 28 L20 28 L12 60 L60 28 L40 28 L52 4 Z"/>
  </svg>`}function b(){return`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M32 4 L8 20 L8 44 L32 60 L56 44 L56 20 Z"/>
    <path d="M32 16 L20 24 L20 40 L32 48 L44 40 L44 24 Z"/>
  </svg>`}function x(){return`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M24 4 L14 18 L4 14 L12 28 L4 42 L18 36 L24 44 L30 36 L44 42 L36 28 L44 14 L34 18 Z"/></svg>`}function S(){return`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="24" cy="20" r="12"/><path d="M18 28 L16 40 M30 28 L32 40 M20 32 L24 36 L28 32"/></svg>`}function C(){return`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 14 Q24 4 34 14 Q38 24 34 34 Q24 44 14 34 Q10 24 14 14 M20 22 L20 24 M28 22 L28 24 M20 30 Q24 34 28 30"/></svg>`}function w(){return`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M24 4 L28 16 L40 16 L30 24 L34 36 L24 28 L14 36 L18 24 L8 16 L20 16 Z"/></svg>`}function T(){return`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M24 12 Q16 4 8 16 Q4 28 16 32 L24 44 L32 32 Q44 28 40 16 Q32 4 24 12 M24 20 L24 32"/></svg>`}function E(){return`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="24" cy="16" r="10"/><path d="M14 26 L14 44 L34 44 L34 26 M18 16 L22 16 M26 16 L30 16 M20 22 L28 22"/></svg>`}function D(e,t,n=`characters`){return e.innerHTML=`
    <div class="guide-view">
      <header class="guide-header">
        <h1 class="guide-title">The Shadowhunter's Codex</h1>
        <p class="guide-subtitle">A Complete Guide to the Shadow World</p>
      </header>
      
      <nav class="guide-tabs" id="guide-tabs">
        ${[`characters`,`runes`,`bestiary`,`glossary`].map(e=>`
          <a href="#/guide/${e}" class="guide-tab ${e===n?`active`:``}" data-tab="${e}">
            ${e.charAt(0).toUpperCase()+e.slice(1)}
          </a>
        `).join(``)}
      </nav>
      
      <div id="guide-content">
        ${O(n)}
      </div>
    </div>
  `,e.querySelectorAll(`.rune-card`).forEach(e=>{e.addEventListener(`click`,()=>{e.classList.toggle(`expanded`)})}),null}function O(e){switch(e){case`characters`:return k();case`runes`:return A();case`bestiary`:return j();case`glossary`:return M();default:return k()}}function k(){return`
    <div class="character-grid">
      ${a.map(e=>`
        <article class="character-card">
          <div class="character-image" style="background: ${e.gradient};">
            <img class="character-portrait" src="${e.image}" alt="${e.name}" loading="lazy"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; this.parentElement.querySelector('.character-initials').style.display='block';" />
            <svg class="character-rune-bg" viewBox="0 0 100 140" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" style="display:none;">
              <path d="M50 5 L50 135 M25 35 L75 35 M20 70 L80 70 M30 105 L70 105 M50 5 L25 35 M50 5 L75 35 M25 35 L20 70 M75 35 L80 70"/>
            </svg>
            <span class="character-initials" style="display:none;">${e.initials}</span>
          </div>
          <div class="character-info">
            <h3 class="character-name">${e.name}</h3>
            <div class="character-alias">${e.alias}</div>
            <span class="character-species">${e.species}</span>
            <p class="character-bio">${e.bio}</p>
          </div>
        </article>
      `).join(``)}
    </div>
  `}function A(){return`
    <div class="rune-grid">
      ${o.map(e=>`
        <div class="rune-card">
          <div class="rune-symbol">${e.svg}</div>
          <h3 class="rune-name">${e.name}</h3>
          <div class="rune-alt-name">${e.altName}</div>
          <p class="rune-description">${e.desc}</p>
        </div>
      `).join(``)}
    </div>
  `}function j(){return`
    <div class="bestiary-grid">
      ${s.map(e=>`
        <article class="bestiary-card">
          <div class="bestiary-icon">${e.icon}</div>
          <h3 class="bestiary-name">${e.name}</h3>
          <p class="bestiary-desc">${e.desc}</p>
          <div class="bestiary-notables"><strong>Notable:</strong> ${e.notables}</div>
        </article>
      `).join(``)}
    </div>
  `}function M(){return`
    <div class="glossary-list">
      ${c.map(e=>`
        <div class="glossary-item">
          <h4 class="glossary-term">${e.term}</h4>
          <p class="glossary-def">${e.def}</p>
        </div>
      `).join(``)}
    </div>
  `}var N=[{name:`The New York Institute`,desc:`Disguised as a decaying Gothic cathedral on the Upper East Side, the Institute is the headquarters for Shadowhunters in New York City. It houses living quarters, a vast library, a weapons room, a greenhouse, and an infirmary. Glamoured to appear abandoned to mundane eyes.`,books:`All six books`,x:68,y:28},{name:`Pandemonium Club`,desc:`An all-ages nightclub in Manhattan where Downworlders and mundanes mingle freely. The site of Clary's first encounter with the Shadow World — she watches Jace, Isabelle, and Alec kill a demon disguised as a human boy.`,books:`City of Bones, City of Ashes`,x:55,y:42},{name:`Hotel Dumort`,desc:`A derelict hotel in East Harlem serving as headquarters of the New York vampire clan. The name is a play on the French 'la mort' (death). Once an elegant hotel, now crumbling and occupied by the Night Children led by Raphael Santiago.`,books:`City of Bones, City of Fallen Angels`,x:62,y:25},{name:`Magnus Bane's Apartment`,desc:`A sprawling loft apartment in Brooklyn, decorated with centuries of collected artifacts and a notable amount of glitter. Serves as a frequent meeting point and safe house for the group. The party that changed everything was held here.`,books:`All six books`,x:52,y:58},{name:`Jade Wolf`,desc:`A Chinese restaurant on the waterfront that serves as a front for the New York werewolf pack's headquarters. Luke Garroway runs pack operations from the back rooms while the restaurant serves questionable cuisine to mundane customers.`,books:`City of Bones, City of Ashes, City of Glass`,x:38,y:65},{name:`Taki's Diner`,desc:`A Downworlder restaurant where Shadowhunters and various supernatural creatures eat side by side. Known for its eclectic menu catering to all species and its role as a neutral meeting ground.`,books:`City of Ashes, City of Glass`,x:72,y:35},{name:`Beth Israel Hospital`,desc:`The mundane hospital where Jocelyn Fray is kept in a magical coma after Valentine's attack. Clary visits frequently, trying to find a way to wake her mother.`,books:`City of Bones, City of Ashes`,x:48,y:48},{name:`Luke's Bookstore`,desc:`Luke Garroway's bookshop in Brooklyn, a cozy refuge filled with rare and secondhand books. Clary has spent many happy hours here. It serves as Luke's mundane cover.`,books:`City of Bones`,x:45,y:62}],P=[{name:`Alicante — City of Glass`,desc:`The only city in Idris and the capital of the Shadowhunter world. Named for its towering demon towers made of adamas that create a protective ward around the city, making them shimmer like glass. A medieval-styled city of narrow streets and canals.`,books:`City of Glass, City of Heavenly Fire`,x:50,y:42},{name:`The Gard`,desc:`The fortress-like headquarters of the Clave, perched on a hill above Alicante. Houses the council chambers, the Consul's office, and the city's only sanctioned Portal. The seat of Shadowhunter law and government.`,books:`City of Glass, City of Heavenly Fire`,x:48,y:35},{name:`Accords Hall`,desc:`The grand central hall of Alicante where the peace Accords between Shadowhunters and Downworlders are signed and renewed. A beautiful building of white stone and glass, symbolizing transparency and unity.`,books:`City of Glass, City of Heavenly Fire`,x:53,y:45},{name:`Lake Lyn`,desc:`The Mortal Mirror — a remote lake whose waters are poisonous to Shadowhunters, causing hallucinations and madness. Also known as the third of the Mortal Instruments, its true nature was hidden for centuries.`,books:`City of Glass, City of Lost Souls`,x:25,y:30},{name:`Brocelind Forest`,desc:`The great forest surrounding Alicante, separating the city from the rest of Idris. Dense old-growth woodland that is home to wild creatures both natural and supernatural. The site of major battles throughout Shadowhunter history.`,books:`City of Glass, City of Heavenly Fire`,x:35,y:55},{name:`The Imperishable Fields`,desc:`The sacred ground just outside Alicante's walls used for traditional Shadowhunter funeral rites. The dead are burned on pyres in the Nephilim tradition, their names spoken to the sky.`,books:`City of Glass, City of Heavenly Fire`,x:60,y:52},{name:`The Fairchild Manor`,desc:`The ancestral estate of the Fairchild family in the Idris countryside. Jocelyn Fairchild grew up here before marrying Valentine. Like many Shadowhunter manors, it holds generations of history and secrets.`,books:`City of Glass`,x:70,y:28},{name:`Herondale Manor`,desc:`The estate of the Herondale family, one of the oldest and most respected Shadowhunter bloodlines. Connected to both Will Herondale (The Infernal Devices) and Jace, the family's legacy spans centuries.`,books:`City of Glass, City of Heavenly Fire`,x:75,y:60}];function F(e,t,n=`nyc`){e.innerHTML=`
    <div class="map-view">
      <header class="map-header">
        <h1 class="map-title">The Shadow World — Locations</h1>
      </header>
      
      <nav class="map-tabs">
        <a href="#/map/nyc" class="map-tab ${n===`nyc`?`active`:``}" data-tab="nyc">New York City</a>
        <a href="#/map/idris" class="map-tab ${n===`idris`?`active`:``}" data-tab="idris">Idris</a>
      </nav>
      
      <div class="map-container" id="map-container">
        <img class="map-image" src="/images/generated/map_${n}.webp" alt="${n===`nyc`?`New York City Shadowhunter Map`:`Map of Idris`}"
             onerror="this.remove()"
             loading="lazy"/>
        ${I(n===`nyc`?N:P)}
        <div class="map-tooltip" id="map-tooltip">
          <h4 class="map-tooltip-name" id="tooltip-name"></h4>
          <p class="map-tooltip-desc" id="tooltip-desc"></p>
          <div class="map-tooltip-books" id="tooltip-books"></div>
        </div>
      </div>
      
      <div class="section-title" style="margin-top: var(--space-2xl);">
        ${n===`nyc`?`Key NYC Locations`:`Locations in Idris`}
      </div>
      
      <div class="map-locations">
        ${(n===`nyc`?N:P).map(e=>`
          <div class="map-location-card">
            <h4 class="map-location-name">${e.name}</h4>
            <p class="map-location-desc">${e.desc}</p>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: var(--space-sm);">
              📚 ${e.books}
            </div>
          </div>
        `).join(``)}
      </div>
    </div>
  `;let r=document.getElementById(`map-tooltip`),i=document.getElementById(`tooltip-name`),a=document.getElementById(`tooltip-desc`),o=document.getElementById(`tooltip-books`),s=document.getElementById(`map-container`),c=n===`nyc`?N:P;return e.querySelectorAll(`.map-marker`).forEach((e,t)=>{let n=c[t];e.addEventListener(`mouseenter`,t=>{i.textContent=n.name,a.textContent=n.desc.substring(0,150)+`...`,o.textContent=`📚 ${n.books}`;let c=s.getBoundingClientRect(),l=e.getBoundingClientRect(),u=l.left-c.left+30,d=l.top-c.top-10;u+300>c.width&&(u-=330),d<0&&(d=10),r.style.left=`${u}px`,r.style.top=`${d}px`,r.classList.add(`visible`)}),e.addEventListener(`mouseleave`,()=>{r.classList.remove(`visible`)})}),null}function I(e){return e.map((e,t)=>`
    <div class="map-marker" style="left: ${e.x}%; top: ${e.y}%;" 
         title="${e.name}" data-index="${t}"></div>
  `).join(``)}var L=null;function R(){let e=document.getElementById(`rune-particles`);if(!e)return;let t=e.getContext(`2d`),n=[],r,i;function a(){r=e.width=window.innerWidth,i=e.height=window.innerHeight}function o(){return{x:Math.random()*r,y:Math.random()*i,size:Math.random()*14+6,speedX:(Math.random()-.5)*.15,speedY:-Math.random()*.3-.05,opacity:Math.random()*.3+.05,rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-.5)*.005,type:Math.floor(Math.random()*6),life:0,maxLife:Math.random()*1e3+500}}function s(e,t,n,r,i,a){e.save(),e.translate(t,n),e.rotate(a),e.lineWidth=1,e.lineCap=`round`;let o=r/2;switch(i){case 0:e.beginPath(),e.moveTo(0,-o),e.lineTo(0,o),e.moveTo(-o*.6,-o*.3),e.lineTo(o*.6,-o*.3),e.stroke();break;case 1:e.beginPath(),e.moveTo(-o,0),e.quadraticCurveTo(0,-o*.8,o,0),e.quadraticCurveTo(0,o*.8,-o,0),e.stroke(),e.beginPath(),e.arc(0,0,o*.25,0,Math.PI*2),e.stroke();break;case 2:e.beginPath(),e.moveTo(0,-o),e.lineTo(-o*.7,o*.6),e.lineTo(o*.7,o*.6),e.closePath(),e.stroke();break;case 3:e.beginPath(),e.moveTo(0,-o),e.lineTo(o*.6,0),e.lineTo(0,o),e.lineTo(-o*.6,0),e.closePath(),e.moveTo(0,-o*.4),e.lineTo(0,o*.4),e.stroke();break;case 4:e.beginPath(),e.moveTo(-o*.4,-o),e.quadraticCurveTo(o*.5,-o*.2,-o*.2,o*.5),e.moveTo(o*.4,-o*.6),e.quadraticCurveTo(-o*.5,o*.2,o*.3,o),e.stroke();break;case 5:e.beginPath(),e.arc(0,0,o*.5,0,Math.PI*2),e.moveTo(0,-o),e.lineTo(0,o),e.stroke();break}e.restore()}function c(){t.clearRect(0,0,r,i),n.length<25&&n.push(o()),n.forEach((e,a)=>{e.x+=e.speedX,e.y+=e.speedY,e.rotation+=e.rotationSpeed,e.life++;let c=e.opacity;e.life<50&&(c*=e.life/50),e.life>e.maxLife-50&&(c*=(e.maxLife-e.life)/50),t.strokeStyle=`rgba(201, 168, 76, ${c})`,s(t,e.x,e.y,e.size,e.type,e.rotation),(e.life>e.maxLife||e.y<-50||e.x<-50||e.x>r+50)&&(n[a]=o(),n[a].y=i+20)}),L=requestAnimationFrame(c)}return a(),window.addEventListener(`resize`,a),c(),()=>{L&&cancelAnimationFrame(L),window.removeEventListener(`resize`,a)}}var z=[`ArrowUp`,`ArrowUp`,`ArrowDown`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`ArrowLeft`,`ArrowRight`,`b`,`a`],B=0;function ee(){let e=document.createElement(`div`);e.className=`portal-effect`,e.innerHTML=`
    <div class="portal-ring"></div>
  `,document.body.appendChild(e),$(`🌀 A Portal to Idris opens...`),setTimeout(()=>e.remove(),3500)}var V=0,H=null;function U(){V++,H&&clearTimeout(H),H=setTimeout(()=>{V=0},800),V>=3&&(V=0,W())}function W(){let e=document.createElement(`div`);e.className=`angel-flash`,e.innerHTML=`<span class="angel-flash-text">By the Angel!</span>`,document.body.appendChild(e),setTimeout(()=>e.remove(),1500)}function G(){if(document.addEventListener(`mousemove`,e=>{if(!document.querySelector(`.home-view`)||Math.random()>.15)return;let t=document.createElement(`div`);t.style.cssText=`
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 4px;
      height: 4px;
      background: rgba(201, 168, 76, 0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9000;
      animation: sparkFade 0.8s ease-out forwards;
    `,document.body.appendChild(t),setTimeout(()=>t.remove(),800)}),!document.getElementById(`spark-styles`)){let e=document.createElement(`style`);e.id=`spark-styles`,e.textContent=`
      @keyframes sparkFade {
        0% { opacity: 1; transform: scale(1) translateY(0); }
        100% { opacity: 0; transform: scale(0) translateY(-20px); }
      }
    `,document.head.appendChild(e)}}function K(){document.addEventListener(`keydown`,e=>{e.key===z[B]?(B++,B===z.length&&(ee(),B=0)):B=0}),document.addEventListener(`click`,e=>{e.target.closest(`.hero-rune`)&&U()}),G()}var q=document.getElementById(`app`),J=null,Y=null,X=null;async function Z(){return J||(J=await(await fetch(`/data/books.json`)).json(),J)}function te(){let e=(window.location.hash||`#/`).slice(2).split(`/`);return e[0]===``||e[0]===void 0?{view:`home`}:e[0]===`read`&&e[1]&&e[2]?{view:`reader`,bookId:e[1],chapterId:e[2]}:e[0]===`book`&&e[1]?{view:`reader`,bookId:e[1],chapterId:null}:e[0]===`guide`?{view:`guide`,tab:e[1]||`characters`}:e[0]===`map`?{view:`map`,tab:e[1]||`nyc`}:{view:`home`}}function ne(e){document.querySelectorAll(`.nav-link`).forEach(e=>{e.classList.remove(`active`)});let t={home:`nav-home`,reader:null,guide:`nav-guide`,map:`nav-map`}[e];t&&document.getElementById(t)?.classList.add(`active`)}async function Q(){let e=te(),t=await Z();X&&=(X(),null),Y&&(q.classList.add(`view-exit`),await new Promise(e=>setTimeout(e,200))),q.classList.remove(`view-exit`),q.innerHTML=``,ne(e.view);let i=document.getElementById(`rune-particles`);e.view===`reader`?i.style.display=`none`:i.style.display=`block`;let a=document.getElementById(`main-nav`);e.view===`reader`?a.classList.add(`reader-nav`):a.classList.remove(`reader-nav`);let o=null;switch(e.view){case`home`:o=n(q,t);break;case`reader`:o=await r(q,t,e.bookId,e.chapterId);break;case`guide`:o=D(q,t,e.tab);break;case`map`:o=F(q,t,e.tab);break;default:o=n(q,t)}X=o,Y=e.view,q.classList.add(`view-enter`),setTimeout(()=>q.classList.remove(`view-enter`),500),e.view!==`reader`&&window.scrollTo(0,0)}function re(){let e=document.getElementById(`glamour-overlay`);if(localStorage.getItem(`tmi-visited`)){e.classList.add(`hidden`);return}localStorage.setItem(`tmi-visited`,`true`),setTimeout(()=>{e.classList.add(`dissolving`),setTimeout(()=>{e.classList.add(`hidden`)},1500)},3e3)}function ie(){let e=document.getElementById(`witchlight-toggle`);localStorage.getItem(`tmi-witchlight`)===`true`&&(document.body.classList.add(`witchlight-mode`),e.classList.add(`active`)),e.addEventListener(`click`,()=>{let t=document.body.classList.toggle(`witchlight-mode`);e.classList.toggle(`active`,t),localStorage.setItem(`tmi-witchlight`,t),$(t?`✨ Witchlight activated`:`🌙 Witchlight off`)})}function $(e){let t=document.getElementById(`toast-container`),n=document.createElement(`div`);n.className=`toast`,n.textContent=e,t.appendChild(n),setTimeout(()=>n.remove(),3e3)}async function ae(){re(),R(),ie(),K(),window.addEventListener(`hashchange`,Q),await Q()}ae();