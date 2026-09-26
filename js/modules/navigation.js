/**
 * ============================================================================
 * NAVIGATION SHELL, VIEW SWITCHER & MISSION RADAR HUD (MINIMAL REDESIGN)
 * Calm, Space-First Architecture. 85-90% visual space reserved for 3D Orbit.
 * ============================================================================
 */

class NavigationShell {
  constructor() {
    this.currentView = 'explore';

    // Iconic NASA Missions for Bottom-Left Radar HUD
    this.radarMissions = [
      {
        id: 'apollo-11',
        name: 'Apollo 11',
        targetBody: 'Moon',
        targetPlanet: 'Earth',
        distanceBaseKm: 384400,
        rateKmS: 0.0004,
        fate: 'Resting on Moon',
        category: 'Lunar'
      },
      {
        id: 'perseverance',
        name: 'Perseverance',
        targetBody: 'Mars',
        targetPlanet: 'Mars',
        distanceBaseKm: 225412890,
        rateKmS: 11.2,
        fate: 'Active on Mars',
        category: 'Mars'
      },
      {
        id: 'voyager-1',
        name: 'Voyager 1',
        targetBody: 'Deep Space',
        targetPlanet: 'Sun',
        distanceBaseKm: 24385000000,
        rateKmS: 17.0,
        fate: 'Interstellar Drift',
        category: 'Deep Space'
      },
      {
        id: 'curiosity',
        name: 'Curiosity',
        targetBody: 'Mars',
        targetPlanet: 'Mars',
        distanceBaseKm: 225412890,
        rateKmS: 11.2,
        fate: 'Active on Mars',
        category: 'Mars'
      },
      {
        id: 'new-horizons',
        name: 'New Horizons',
        targetBody: 'Deep Space',
        targetPlanet: 'Neptune',
        distanceBaseKm: 8654000000,
        rateKmS: 14.1,
        fate: 'Kuiper Belt Drift',
        category: 'Deep Space'
      },
      {
        id: 'artemis-1',
        name: 'Artemis I',
        targetBody: 'Moon',
        targetPlanet: 'Earth',
        distanceBaseKm: 384400,
        rateKmS: 0.0004,
        fate: 'Mission Complete',
        category: 'Lunar'
      }
    ];

    this.currentRadarIndex = 0;
    this.distanceStartTime = Date.now();

    this.init();
  }

  init() {
    this.cacheDOMElements();
    this.setupViewSwitcher();
    this.setupRadarWidget();
    this.setupTopHUD();
    this.setupGlobalKeyboard();
    this.startRadarTelemetryLoop();
    this.setupCatalogInteractions();
    this.setupQuizInteractions();
  }

  cacheDOMElements() {
    this.leftNav = document.getElementById('left-nav');
    this.viewsContainer = document.getElementById('views-container');
    this.canvasBlurLayer = document.getElementById('canvas-blur-layer');
    this.hudSearchBtn = document.getElementById('hud-search-btn');

    // Radar DOM Elements
    this.radarWidget = document.getElementById('radar-widget');
    this.radarCallsign = document.getElementById('radar-callsign');
    this.radarTargetBadge = document.getElementById('radar-target-badge');
    this.radarDistanceVal = document.getElementById('radar-distance-val');
    this.radarFateBadge = document.getElementById('radar-fate-badge');
    this.radarPrevBtn = document.getElementById('radar-prev-btn');
    this.radarNextBtn = document.getElementById('radar-next-btn');
    this.radarActionBtn = document.getElementById('radar-action-btn');

    // Archive Search
    this.archiveSearchInput = document.getElementById('archive-search-input');
  }

  // --- 1. VIEW ROUTER & NAVIGATION ---
  setupViewSwitcher() {
    // Navigation rail button clicks
    const railButtons = document.querySelectorAll('.rail-item');
    railButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const view = btn.dataset.view;
        this.playSound('click');
        this.switchView(view);
      });
    });

    // Close buttons inside each view panel
    const closeButtons = document.querySelectorAll('.view-close-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playSound('close');
        this.switchView('explore');
      });
    });

    // Backdrop click: Clicking outside the active panel on #views-container returns to Explore
    if (this.viewsContainer) {
      this.viewsContainer.addEventListener('click', (e) => {
        if (e.target === this.viewsContainer) {
          this.playSound('close');
          this.switchView('explore');
        }
      });
    }

    // Blur layer click returns to Explore
    if (this.canvasBlurLayer) {
      this.canvasBlurLayer.addEventListener('click', () => {
        if (this.currentView !== 'explore') {
          this.playSound('close');
          this.switchView('explore');
        }
      });
    }
  }

  switchView(viewName, payload = null) {
    if (!viewName) return;
    this.currentView = viewName;

    // Update rail active styles
    document.querySelectorAll('.rail-item').forEach(btn => {
      const isActive = btn.dataset.view === viewName;
      btn.classList.toggle('active', isActive);
    });

    if (viewName === 'explore') {
      // 3D Orbit Mode: Hide all overlay panels and clear blur
      document.body.classList.remove('in-view-overlay');
      if (this.viewsContainer) {
        this.viewsContainer.classList.remove('active');
      }
      document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.remove('active');
      });
    } else {
      // Non-Explore View: Close any open planet info panel so only ONE view is active
      if (window.solarApp && typeof window.solarApp.closePanel === 'function') {
        window.solarApp.closePanel();
      }

      document.body.classList.add('in-view-overlay');
      if (this.viewsContainer) {
        this.viewsContainer.classList.add('active');
      }

      document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.remove('active');
      });

      const targetPanel = document.getElementById(`view-${viewName}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        const scrollBody = targetPanel.querySelector('.view-panel-body');
        if (scrollBody) scrollBody.scrollTop = 0;
      }
    }

    // Handle view-specific payload
    if (payload) {
      if (payload.search && this.archiveSearchInput) {
        this.archiveSearchInput.value = payload.search;
        this.filterMissionCatalog(payload.search);
        this.archiveSearchInput.focus();
      }
      if (payload.filterCategory) {
        this.setActiveFilterCategory(payload.filterCategory);
      }
    }

    // Emit event for state synchronization
    window.dispatchEvent(new CustomEvent('solar:view-change', {
      detail: { view: viewName, payload }
    }));
  }

  // --- 2. MINIMAL TOP HUD ACTIONS ---
  setupTopHUD() {
    if (this.hudSearchBtn) {
      this.hudSearchBtn.addEventListener('click', () => {
        this.playSound('confirm');
        this.switchView('archive');
        if (this.archiveSearchInput) {
          setTimeout(() => this.archiveSearchInput.focus(), 120);
        }
      });
    }
  }

  // --- 3. COMPACT MISSION RADAR WIDGET ---
  setupRadarWidget() {
    this.updateRadarDisplay();

    if (this.radarPrevBtn) {
      this.radarPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playSound('click');
        this.currentRadarIndex = (this.currentRadarIndex - 1 + this.radarMissions.length) % this.radarMissions.length;
        this.updateRadarDisplay();
      });
    }

    if (this.radarNextBtn) {
      this.radarNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playSound('click');
        this.currentRadarIndex = (this.currentRadarIndex + 1) % this.radarMissions.length;
        this.updateRadarDisplay();
      });
    }

    if (this.radarActionBtn) {
      this.radarActionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playSound('confirm');
        const mission = this.radarMissions[this.currentRadarIndex];

        window.dispatchEvent(new CustomEvent('solar:explore-story', {
          detail: mission
        }));

        this.switchView('archive', { search: mission.name });
      });
    }
  }

  updateRadarDisplay() {
    const mission = this.radarMissions[this.currentRadarIndex];
    if (!mission) return;

    if (this.radarCallsign) this.radarCallsign.textContent = mission.name;
    if (this.radarTargetBadge) {
      this.radarTargetBadge.textContent = mission.targetBody.toUpperCase();
    }
    if (this.radarFateBadge) {
      this.radarFateBadge.textContent = mission.fate;
    }

    this.updateRadarDistanceText(mission);
  }

  updateRadarDistanceText(mission) {
    if (!this.radarDistanceVal || !mission) return;
    const elapsedSec = (Date.now() - this.distanceStartTime) / 1000;
    const currentDist = mission.distanceBaseKm + (elapsedSec * mission.rateKmS);

    if (currentDist >= 1e9) {
      this.radarDistanceVal.textContent = `${(currentDist / 1e9).toFixed(1)}B km`;
    } else if (currentDist >= 1e6) {
      this.radarDistanceVal.textContent = `${(currentDist / 1e6).toFixed(1)}M km`;
    } else {
      this.radarDistanceVal.textContent = `${Math.round(currentDist).toLocaleString()} km`;
    }
  }

  startRadarTelemetryLoop() {
    setInterval(() => {
      const mission = this.radarMissions[this.currentRadarIndex];
      this.updateRadarDistanceText(mission);
    }, 500);
  }

  // --- 4. ARCHIVE CATALOG FILTERING & 3D JUMP ---
  setupCatalogInteractions() {
    if (this.archiveSearchInput) {
      this.archiveSearchInput.addEventListener('input', (e) => {
        this.filterMissionCatalog(e.target.value);
      });
    }

    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.playSound('click');
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.category;
        this.filterByCategory(cat);
      });
    });

    // "Track in 3D" buttons on mission cards
    document.addEventListener('click', (e) => {
      const trackBtn = e.target.closest('.card-track-3d');
      if (trackBtn) {
        e.stopPropagation();
        this.playSound('confirm');
        const planet = trackBtn.dataset.targetPlanet || 'Earth';
        this.switchView('explore');
        if (window.solarApp && typeof window.solarApp.selectPlanetByName === 'function') {
          window.solarApp.selectPlanetByName(planet);
        }
      }
    });
  }

  filterMissionCatalog(query) {
    const term = (query || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.mission-catalog-card');

    cards.forEach(card => {
      const title = (card.querySelector('.catalog-card-title')?.textContent || '').toLowerCase();
      const body = (card.querySelector('.catalog-card-body')?.textContent || '').toLowerCase();
      const match = !term || title.includes(term) || body.includes(term);
      card.style.display = match ? 'flex' : 'none';
    });
  }

  filterByCategory(category) {
    const cards = document.querySelectorAll('.mission-catalog-card');
    cards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  setActiveFilterCategory(cat) {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(c => {
      const isTarget = c.dataset.category === cat;
      c.classList.toggle('active', isTarget);
    });
    this.filterByCategory(cat);
  }

  // --- 5. LEARN & PLAY INTERACTION (Mini Quiz) ---
  setupQuizInteractions() {
    const quizOptions = document.querySelectorAll('.quiz-option-btn');
    quizOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.correct === 'true';
        this.playSound(isCorrect ? 'confirm' : 'toggle');

        const parent = btn.closest('.quiz-options-group');
        if (parent) {
          parent.querySelectorAll('.quiz-option-btn').forEach(b => {
            b.classList.remove('correct', 'wrong');
            if (b.dataset.correct === 'true') {
              b.classList.add('correct');
            }
          });
        }

        if (!isCorrect) {
          btn.classList.add('wrong');
        }
      });
    });
  }

  // --- 6. GLOBAL SHORTCUTS (Ctrl+K, Esc) ---
  setupGlobalKeyboard() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.playSound('confirm');
        this.switchView('archive');
        if (this.archiveSearchInput) {
          setTimeout(() => this.archiveSearchInput.focus(), 80);
        }
      }

      if (e.key === 'Escape') {
        if (this.currentView !== 'explore') {
          this.playSound('close');
          this.switchView('explore');
        }
      }
    });
  }

  playSound(type) {
    if (window.solarApp && window.solarApp.soundEngine && typeof window.solarApp.soundEngine.playUI === 'function') {
      window.solarApp.soundEngine.playUI(type);
    }
  }
}

// Global initializer function
function initNavigationShell() {
  if (!window.navigationShell) {
    window.navigationShell = new NavigationShell();
    window.switchSolarView = (view, payload) => {
      if (window.navigationShell) {
        window.navigationShell.switchView(view, payload);
      }
    };
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigationShell);
} else {
  initNavigationShell();
}
