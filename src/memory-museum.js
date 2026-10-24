import museumData from './memory-museum-data.json';
import confetti from 'canvas-confetti';

export function createMemoryMuseum(containerEl, onClose) {
  // Local storage for user review/approvals
  const STORAGE_KEY = 'kumkum_approved_memories';
  let approvedMemories = {};
  try {
    approvedMemories = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    approvedMemories = {};
  }

  const saveApprovals = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(approvedMemories));
    } catch (e) {}
  };

  containerEl.innerHTML = '';

  const museumWrap = document.createElement('div');
  museumWrap.className = 'museum-wrap';

  // Museum Header
  const header = document.createElement('div');
  header.className = 'museum-header';
  header.innerHTML = `
    <div class="museum-badge">✨ 37,523 Messages Deep Dive · 49 Days of Lore</div>
    <h2>Our Little Universe Memory Museum 🏛️💗</h2>
    <p>Every inside joke, late-night confession, and milestone across September 6 — October 24, 2026</p>
  `;
  museumWrap.appendChild(header);

  // Tab definitions for the 12 modules
  const tabs = [
    { id: 'wrapped', label: '📊 Chat Wrapped', icon: '📊' },
    { id: 'timeline', label: '📜 Story Timeline', icon: '📜' },
    { id: 'dictionary', label: '📖 Secret Dictionary', icon: '📖' },
    { id: 'detective', label: '🔍 Memory Detective', icon: '🔍' },
    { id: 'universe', label: '🌌 Conversation Universe', icon: '🌌' },
    { id: 'two-chapters', label: '👥 Two Chapters', icon: '👥' },
    { id: 'traditions', label: '🎀 Traditions', icon: '🎀' },
    { id: 'jar', label: '🏺 Memory Jar', icon: '🏺' },
    { id: 'capsule', label: '💌 Time Capsule', icon: '💌' },
    { id: 'search', label: '🔎 Search Archive', icon: '🔎' }
  ];

  let currentTab = 'wrapped';

  // Nav pills container
  const navScroll = document.createElement('div');
  navScroll.className = 'museum-nav-scroll';
  const nav = document.createElement('div');
  nav.className = 'museum-nav';

  const viewContainer = document.createElement('div');
  viewContainer.className = 'museum-view-container';

  const renderNav = () => {
    nav.innerHTML = '';
    tabs.forEach((tab) => {
      const btn = document.createElement('button');
      btn.className = `museum-tab-btn ${tab.id === currentTab ? 'active' : ''}`;
      btn.innerHTML = `<span>${tab.icon}</span> <span>${tab.label}</span>`;
      btn.onclick = () => {
        currentTab = tab.id;
        renderNav();
        renderActiveView();
      };
      nav.appendChild(btn);
    });
  };

  navScroll.appendChild(nav);
  museumWrap.appendChild(navScroll);
  museumWrap.appendChild(viewContainer);

  // Render individual modules
  const renderActiveView = () => {
    viewContainer.innerHTML = '';

    // ==========================================
    // 1. CHAT WRAPPED
    // ==========================================
    if (currentTab === 'wrapped') {
      const w = museumData.wrapped;
      const wrappedEl = document.createElement('div');
      wrappedEl.className = 'museum-section';
      wrappedEl.innerHTML = `
        <div class="wrapped-hero-card">
          <div class="wrapped-title">Our All-Time Chat Wrapped 💗</div>
          <div class="wrapped-subtitle">${w.dateRange} · 49 Consecutive Days of Talking</div>
          
          <div class="wrapped-bento">
            <div class="wrapped-stat">
              <span class="stat-value">${w.totalMessages.toLocaleString()}</span>
              <span class="stat-label">Total Messages Exchanged</span>
              <span class="stat-sub">~${w.avgMsgsPerDay} texts every single day</span>
            </div>
            <div class="wrapped-stat">
              <span class="stat-value">${(w.shaizanWords + w.kumkumWords).toLocaleString()}</span>
              <span class="stat-label">Total Words Written</span>
              <span class="stat-sub">Over 230,000 words of memories</span>
            </div>
            <div class="wrapped-stat">
              <span class="stat-value">50.6% / 49.4%</span>
              <span class="stat-label">Soulmate Symmetry</span>
              <span class="stat-sub">Shaizan: ${w.shaizanMsgs.toLocaleString()} · Kumkum: ${w.kumkumMsgs.toLocaleString()}</span>
            </div>
            <div class="wrapped-stat">
              <span class="stat-value">8,900+ 🌙</span>
              <span class="stat-label">Late-Night Texts</span>
              <span class="stat-sub">Sent between 10:00 PM and 2:00 AM</span>
            </div>
          </div>

          <div class="wrapped-section-title">Peak Conversation Hours ⏰</div>
          <div class="wrapped-hours-chart">
            ${w.peakHours.map(ph => `
              <div class="hour-row">
                <span class="hour-label">${ph.hour}</span>
                <div class="hour-bar-track">
                  <div class="hour-bar-fill" style="width: ${Math.round((ph.count / 2750) * 100)}%;"></div>
                </div>
                <span class="hour-count">${ph.count.toLocaleString()} msgs</span>
              </div>
            `).join('')}
          </div>

          <div class="wrapped-quote-box">
            “No gap in calculation, no algorithms making up numbers: these are the real 37,523 messages of our story.”
          </div>
        </div>
      `;
      viewContainer.appendChild(wrappedEl);
    }

    // ==========================================
    // 2. STORY TIMELINE
    // ==========================================
    else if (currentTab === 'timeline') {
      const timelineEl = document.createElement('div');
      timelineEl.className = 'museum-section';

      const intro = document.createElement('div');
      intro.className = 'section-intro';
      intro.innerHTML = `
        <h3>Our Relationship Story Timeline 📜</h3>
        <p>A chronological journey of verified turning points, from the very first apology to forever.</p>
      `;
      timelineEl.appendChild(intro);

      const list = document.createElement('div');
      list.className = 'timeline-stream';

      museumData.timeline.forEach((m, idx) => {
        const item = document.createElement('div');
        item.className = 'timeline-node';

        const isStarred = approvedMemories[`timeline-${idx}`];
        item.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="timeline-date">${m.date}</span>
              <span class="timeline-cat">${m.category}</span>
              <button class="star-btn ${isStarred ? 'starred' : ''}" data-id="timeline-${idx}">
                ${isStarred ? '⭐ Starred' : '☆ Star'}
              </button>
            </div>
            <div class="timeline-title">${m.title}</div>
            <div class="timeline-summary">${m.summary}</div>
            <div class="timeline-dialogue">
              ${m.excerpts.map(ex => `
                <div class="dialogue-line ${ex.sender === 'Shaizan' ? 'shaizan' : 'kumkum'}">
                  <strong>${ex.sender}:</strong> ${ex.text}
                </div>
              `).join('')}
            </div>
          </div>
        `;

        const starBtn = item.querySelector('.star-btn');
        starBtn.onclick = () => {
          approvedMemories[`timeline-${idx}`] = !approvedMemories[`timeline-${idx}`];
          saveApprovals();
          renderActiveView();
        };

        list.appendChild(item);
      });

      timelineEl.appendChild(list);
      viewContainer.appendChild(timelineEl);
    }

    // ==========================================
    // 3. OUR SECRET DICTIONARY
    // ==========================================
    else if (currentTab === 'dictionary') {
      const dictEl = document.createElement('div');
      dictEl.className = 'museum-section';

      dictEl.innerHTML = `
        <div class="section-intro">
          <h3>Our Secret Dictionary 📖</h3>
          <p>The unique, adorable language developed across 37,523 messages.</p>
        </div>
        <div class="dictionary-grid">
          ${museumData.dictionary.map(entry => `
            <div class="dict-card">
              <div class="dict-top">
                <span class="dict-term">${entry.term}</span>
                <span class="dict-cat">${entry.category}</span>
              </div>
              <div class="dict-speaker">Speaker: <strong>${entry.speaker}</strong> · Date: ${entry.date}</div>
              <div class="dict-def">${entry.definition}</div>
              <div class="dict-quote">${entry.exampleQuote}</div>
              <div class="dict-meaning">💡 <em>${entry.meaning}</em></div>
            </div>
          `).join('')}
        </div>
      `;
      viewContainer.appendChild(dictEl);
    }

    // ==========================================
    // 4. THE MEMORY DETECTIVE
    // ==========================================
    else if (currentTab === 'detective') {
      const detEl = document.createElement('div');
      detEl.className = 'museum-section';

      detEl.innerHTML = `
        <div class="section-intro">
          <h3>The Memory Detective 🔍</h3>
          <p>Memorable conversations uncovered and verified directly from our chat export.</p>
        </div>
        <div class="detective-grid">
          ${museumData.detectiveMemories.map((dm, idx) => {
            const isApproved = approvedMemories[dm.id] !== false; // Approved by default
            return `
              <div class="detective-card ${isApproved ? '' : 'hidden-card'}">
                <div class="det-header">
                  <span class="det-tag">${dm.category}</span>
                  <span class="det-date">${dm.date}</span>
                </div>
                <div class="det-title">${dm.title}</div>
                <div class="det-excerpt">${dm.excerpt}</div>
                <div class="det-exp">${dm.explanation}</div>
                <div class="det-footer">
                  <span class="det-speaker">Context: ${dm.speaker}</span>
                  <button class="approve-pill ${isApproved ? 'on' : ''}" data-id="${dm.id}">
                    ${isApproved ? '✓ Approved' : 'Hidden'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      detEl.querySelectorAll('.approve-pill').forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.id;
          approvedMemories[id] = approvedMemories[id] === false ? true : false;
          saveApprovals();
          renderActiveView();
        };
      });

      viewContainer.appendChild(detEl);
    }

    // ==========================================
    // 5. OUR CONVERSATION UNIVERSE
    // ==========================================
    else if (currentTab === 'universe') {
      const univEl = document.createElement('div');
      univEl.className = 'museum-section';

      univEl.innerHTML = `
        <div class="section-intro">
          <h3>Our Conversation Universe 🌌</h3>
          <p>Transparent topic distribution derived from message themes over our 49 days.</p>
        </div>
        <div class="universe-list">
          ${museumData.universe.map(u => `
            <div class="universe-card">
              <div class="universe-header">
                <span class="universe-title">${u.topic}</span>
                <span class="universe-pct">${u.percentage}% (${u.messageCount} texts)</span>
              </div>
              <div class="universe-track">
                <div class="universe-fill" style="width: ${u.percentage * 2}%; background: ${u.color};"></div>
              </div>
              <div class="universe-desc">${u.description}</div>
            </div>
          `).join('')}
        </div>
      `;
      viewContainer.appendChild(univEl);
    }

    // ==========================================
    // 6. TWO CHAPTERS, ONE STORY
    // ==========================================
    else if (currentTab === 'two-chapters') {
      const tc = museumData.twoChapters;
      const tcEl = document.createElement('div');
      tcEl.className = 'museum-section';

      tcEl.innerHTML = `
        <div class="section-intro">
          <h3>Two Chapters, One Story 👥</h3>
          <p>A playful, affectionate look at our texting styles and communication habits.</p>
        </div>
        <div class="chapters-grid">
          <!-- Shaizan -->
          <div class="chapter-card shaizan-side">
            <div class="chapter-name">${tc.shaizan.name}</div>
            <div class="chapter-role">${tc.shaizan.role}</div>
            <div class="chapter-stats">
              <span><strong>${tc.shaizan.totalMsgs.toLocaleString()}</strong> messages</span>
              <span><strong>${tc.shaizan.avgWordsPerMsg}</strong> words/text</span>
            </div>
            <div class="chapter-subheading">Texting Style & Habits:</div>
            <ul class="chapter-list">
              ${tc.shaizan.traits.map(t => `<li>${t}</li>`).join('')}
            </ul>
            <div class="chapter-subheading">Top Emojis:</div>
            <div class="emoji-row">
              ${tc.shaizan.topEmojis.map(e => `<span class="emoji-badge">${e.emoji} <em>${e.count}</em></span>`).join('')}
            </div>
          </div>

          <!-- Kumkum -->
          <div class="chapter-card kumkum-side">
            <div class="chapter-name">${tc.kumkum.name}</div>
            <div class="chapter-role">${tc.kumkum.role}</div>
            <div class="chapter-stats">
              <span><strong>${tc.kumkum.totalMsgs.toLocaleString()}</strong> messages</span>
              <span><strong>${tc.kumkum.avgWordsPerMsg}</strong> words/text</span>
            </div>
            <div class="chapter-subheading">Texting Style & Habits:</div>
            <ul class="chapter-list">
              ${tc.kumkum.traits.map(t => `<li>${t}</li>`).join('')}
            </ul>
            <div class="chapter-subheading">Top Emojis:</div>
            <div class="emoji-row">
              ${tc.kumkum.topEmojis.map(e => `<span class="emoji-badge">${e.emoji} <em>${e.count}</em></span>`).join('')}
            </div>
          </div>
        </div>
      `;
      viewContainer.appendChild(tcEl);
    }

    // ==========================================
    // 7. OUR LITTLE TRADITIONS
    // ==========================================
    else if (currentTab === 'traditions') {
      const tradEl = document.createElement('div');
      tradEl.className = 'museum-section';

      tradEl.innerHTML = `
        <div class="section-intro">
          <h3>Our Little Traditions 🎀</h3>
          <p>Recurring habits, rituals, and playful patterns that became uniquely ours.</p>
        </div>
        <div class="traditions-grid">
          ${museumData.traditions.map(tr => `
            <div class="tradition-card">
              <div class="trad-badge">${tr.frequency}</div>
              <div class="trad-title">${tr.title}</div>
              <div class="trad-ritual">${tr.ritual}</div>
            </div>
          `).join('')}
        </div>
      `;
      viewContainer.appendChild(tradEl);
    }

    // ==========================================
    // 8. THE MEMORY JAR
    // ==========================================
    else if (currentTab === 'jar') {
      const jarEl = document.createElement('div');
      jarEl.className = 'museum-section text-center';

      jarEl.innerHTML = `
        <div class="section-intro">
          <h3>The Memory Jar 🏺✨</h3>
          <p>Tap a folded origami paper to reveal a genuine candid message from our 37,523 texts.</p>
        </div>
        <div class="jar-display">
          <div class="jar-graphic" id="jar-trigger">
            <div class="origami-note">💌</div>
            <div class="jar-prompt">Tap To Unfold A Memory</div>
          </div>
          <div class="jar-revealed-card" id="jar-card" style="display:none;"></div>
        </div>
      `;

      const trigger = jarEl.querySelector('#jar-trigger');
      const revealed = jarEl.querySelector('#jar-card');

      trigger.onclick = () => {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        const randomMsg = museumData.sampleArchive[Math.floor(Math.random() * museumData.sampleArchive.length)];
        revealed.style.display = 'block';
        revealed.innerHTML = `
          <div class="revealed-tag">${randomMsg.date}</div>
          <div class="revealed-sender">${randomMsg.sender} wrote:</div>
          <div class="revealed-text">“${randomMsg.text}”</div>
          <button class="jar-again-btn" id="jar-again">Draw Another Note 🪄</button>
        `;
        revealed.querySelector('#jar-again').onclick = () => trigger.onclick();
      };

      viewContainer.appendChild(jarEl);
    }

    // ==========================================
    // 9. TIME CAPSULE LETTER
    // ==========================================
    else if (currentTab === 'capsule') {
      const capEl = document.createElement('div');
      capEl.className = 'museum-section';

      capEl.innerHTML = `
        <div class="section-intro">
          <h3>The Time Capsule Reflection 💌</h3>
          <p>A curated anniversary reflection synthesizing all verified milestones and themes.</p>
        </div>
        <div class="capsule-letter-card">
          <div class="capsule-watermark">For Kumkum ♡</div>
          <div class="capsule-body">${museumData.timeCapsuleLetter.replace(/\n\n/g, '<br><br>')}</div>
          <div class="capsule-footer">
            <em>Preserved forever in our Little Universe · Verified against 37,523 messages</em>
          </div>
        </div>
      `;
      viewContainer.appendChild(capEl);
    }

    // ==========================================
    // 10. MEMORY SEARCH
    // ==========================================
    else if (currentTab === 'search') {
      const searchEl = document.createElement('div');
      searchEl.className = 'museum-section';

      searchEl.innerHTML = `
        <div class="section-intro">
          <h3>Memory Search 🔎</h3>
          <p>Search questions or keywords across our entire memory archive.</p>
        </div>
        <div class="search-input-box">
          <input type="text" id="memory-search-input" placeholder="e.g. bunny cheeks, apologies, Kingdom of Joy, trust, love you..." />
        </div>
        <div class="search-suggestions">
          <span class="chip" data-q="bunny cheeks">🐰 Bunny Cheeks</span>
          <span class="chip" data-q="Kingdom of Joy">🎟️ Kingdom of Joy</span>
          <span class="chip" data-q="trust">🤍 Trust</span>
          <span class="chip" data-q="Kumkumon">🐾 Kumkumon</span>
          <span class="chip" data-q="love you">💖 Love you</span>
        </div>
        <div class="search-results-area" id="search-results">
          <p style="color:#716F77; font-size:14px; text-align:center; padding:20px;">Type a keyword above or click a suggestion chip to search.</p>
        </div>
      `;

      const input = searchEl.querySelector('#memory-search-input');
      const resultsArea = searchEl.querySelector('#search-results');

      const performSearch = (query) => {
        const q = query.trim().toLowerCase();
        if (!q) {
          resultsArea.innerHTML = `<p style="color:#716F77; font-size:14px; text-align:center; padding:20px;">Type a keyword above to search our memories.</p>`;
          return;
        }

        const hits = [];

        // Check milestones
        museumData.timeline.forEach(m => {
          if (m.title.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q) || m.excerpts.some(e => e.text.toLowerCase().includes(q))) {
            hits.push({ type: 'Milestone', title: m.title, text: m.summary, date: m.date });
          }
        });

        // Check dictionary
        museumData.dictionary.forEach(d => {
          if (d.term.toLowerCase().includes(q) || d.definition.toLowerCase().includes(q) || d.exampleQuote.toLowerCase().includes(q)) {
            hits.push({ type: 'Dictionary Entry', title: d.term, text: `${d.definition} — ${d.exampleQuote}`, date: d.date });
          }
        });

        // Check detective memories
        museumData.detectiveMemories.forEach(dm => {
          if (dm.title.toLowerCase().includes(q) || dm.excerpt.toLowerCase().includes(q) || dm.explanation.toLowerCase().includes(q)) {
            hits.push({ type: 'Memory Detective', title: dm.title, text: `${dm.excerpt} (${dm.explanation})`, date: dm.date });
          }
        });

        // Check sample archive
        museumData.sampleArchive.forEach(sa => {
          if (sa.text.toLowerCase().includes(q)) {
            hits.push({ type: 'Chat Excerpt', title: `${sa.sender} wrote:`, text: `“${sa.text}”`, date: sa.date });
          }
        });

        if (hits.length === 0) {
          resultsArea.innerHTML = `
            <div style="text-align:center; padding:30px; color:#716F77;">
              <p style="font-size:16px; font-weight:600;">No memories found for "${query}"</p>
              <p style="font-size:13px; margin-top:4px;">Try searching for "cheeks", "trip", "apology", "Kumkumon", or "kiss".</p>
            </div>
          `;
          return;
        }

        resultsArea.innerHTML = `
          <div style="font-size:13px; font-weight:700; color:var(--accent); margin-bottom:12px;">Found ${hits.length} memory match${hits.length > 1 ? 'es' : ''}:</div>
          <div class="search-results-list">
            ${hits.map(h => `
              <div class="search-hit-card">
                <div class="hit-top">
                  <span class="hit-type">${h.type}</span>
                  <span class="hit-date">${h.date}</span>
                </div>
                <div class="hit-title">${h.title}</div>
                <div class="hit-text">${h.text}</div>
              </div>
            `).join('')}
          </div>
        `;
      };

      input.oninput = (e) => performSearch(e.target.value);
      searchEl.querySelectorAll('.chip').forEach(chip => {
        chip.onclick = () => {
          input.value = chip.dataset.q;
          performSearch(chip.dataset.q);
        };
      });

      viewContainer.appendChild(searchEl);
    }
  };

  renderNav();
  renderActiveView();

  // Bottom action bar
  const bottomBar = document.createElement('div');
  bottomBar.className = 'museum-bottom-bar';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'museum-close-btn';
  closeBtn.textContent = '← Return to 3D Story 🌷';
  closeBtn.onclick = onClose;
  bottomBar.appendChild(closeBtn);
  museumWrap.appendChild(bottomBar);

  containerEl.appendChild(museumWrap);
}
