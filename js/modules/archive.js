/**
 * ============================================================================
 * MISSION ARCHIVE & FILTER ENGINE (STAGE 3)
 * Dynamic, high-tech glassmorphism catalog and filtering system for the
 * 10 curated NASA missions in `window.NASA_MISSIONS`.
 * ============================================================================
 */

(function () {
  'use strict';

  class MissionArchiveEngine {
    constructor() {
      this.allMissions = [];
      this.filteredMissions = [];
      this.searchQuery = '';
      this.activeFate = 'all';
      this.activeDestination = 'all';
      this.activeSort = 'launch-desc';

      // DOM Cache
      this.gridContainer = null;
      this.emptyStateEl = null;
      this.searchInput = null;
      this.searchClearBtn = null;
      this.destSelect = null;
      this.sortSelect = null;
      this.fatePills = [];
      this.resetBtn = null;

      // Telemetry Counter DOM
      this.countVisibleEl = null;
      this.countMoonEl = null;
      this.countMarsEl = null;

      this.init();
    }

    init() {
      // Ensure dataset is loaded
      if (typeof window !== 'undefined' && window.NASA_MISSIONS) {
        this.allMissions = window.NASA_MISSIONS;
      } else if (typeof window !== 'undefined' && window.NASADataEngine) {
        this.allMissions = window.NASADataEngine.getAllMissions();
      }

      this.cacheDOM();
      this.bindEvents();
      this.updatePillCounts();
      this.applyFilters();
    }

    cacheDOM() {
      this.gridContainer = document.getElementById('mission-catalog-grid');
      this.emptyStateEl = document.getElementById('archive-empty-state');
      this.searchInput = document.getElementById('archive-search-input');
      this.searchClearBtn = document.getElementById('archive-search-clear');
      this.destSelect = document.getElementById('archive-dest-select');
      this.sortSelect = document.getElementById('archive-sort-select');
      this.fatePills = document.querySelectorAll('.fate-pill');
      this.resetBtn = document.getElementById('archive-btn-reset-filters');

      this.countVisibleEl = document.getElementById('archive-count-visible');
      this.countMoonEl = document.getElementById('archive-count-moon');
      this.countMarsEl = document.getElementById('archive-count-mars');
    }

    bindEvents() {
      // Real-time Search Input
      if (this.searchInput) {
        this.searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          if (this.searchClearBtn) {
            this.searchClearBtn.classList.toggle('hidden', !this.searchQuery);
          }
          this.applyFilters();
        });
      }

      // Search Clear Button
      if (this.searchClearBtn) {
        this.searchClearBtn.addEventListener('click', () => {
          if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.focus();
          }
          this.searchQuery = '';
          this.searchClearBtn.classList.add('hidden');
          this.applyFilters();
        });
      }

      // Destination Dropdown
      if (this.destSelect) {
        this.destSelect.addEventListener('change', (e) => {
          this.activeDestination = e.target.value;
          this.applyFilters();
        });
      }

      // Sort Dropdown
      if (this.sortSelect) {
        this.sortSelect.addEventListener('change', (e) => {
          this.activeSort = e.target.value;
          this.applyFilters();
        });
      }

      // Hardware Fate Filter Pills
      if (this.fatePills && this.fatePills.length > 0) {
        this.fatePills.forEach(pill => {
          pill.addEventListener('click', () => {
            this.fatePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            this.activeFate = pill.dataset.fate || 'all';
            this.applyFilters();
          });
        });
      }

      // Empty State Reset Button
      if (this.resetBtn) {
        this.resetBtn.addEventListener('click', () => {
          this.resetAllFilters();
        });
      }

      // Listen for view changes from NavigationShell (e.g. searching from radar widget or top HUD)
      window.addEventListener('solar:view-change', (e) => {
        if (e.detail && e.detail.view === 'archive' && e.detail.payload) {
          if (e.detail.payload.search) {
            this.setSearch(e.detail.payload.search);
          }
          if (e.detail.payload.fate) {
            this.setFate(e.detail.payload.fate);
          }
          if (e.detail.payload.destination) {
            this.setDestination(e.detail.payload.destination);
          }
        }
      });
    }

    setSearch(query) {
      if (this.searchInput) {
        this.searchInput.value = query;
      }
      this.searchQuery = (query || '').trim().toLowerCase();
      if (this.searchClearBtn) {
        this.searchClearBtn.classList.toggle('hidden', !this.searchQuery);
      }
      this.applyFilters();
    }

    setFate(fate) {
      this.activeFate = fate;
      if (this.fatePills) {
        this.fatePills.forEach(p => {
          p.classList.toggle('active', p.dataset.fate === fate);
        });
      }
      this.applyFilters();
    }

    setDestination(dest) {
      this.activeDestination = dest;
      if (this.destSelect) {
        this.destSelect.value = dest;
      }
      this.applyFilters();
    }

    resetAllFilters() {
      this.searchQuery = '';
      this.activeFate = 'all';
      this.activeDestination = 'all';
      this.activeSort = 'launch-desc';

      if (this.searchInput) this.searchInput.value = '';
      if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
      if (this.destSelect) this.destSelect.value = 'all';
      if (this.sortSelect) this.sortSelect.value = 'launch-desc';

      if (this.fatePills) {
        this.fatePills.forEach(p => {
          p.classList.toggle('active', p.dataset.fate === 'all');
        });
      }

      this.applyFilters();
    }

    updatePillCounts() {
      if (!this.allMissions || this.allMissions.length === 0) return;

      const counts = {
        all: this.allMissions.length,
        resting_moon: 0,
        silent_mars: 0,
        deep_space: 0,
        sacrificial_plunge: 0,
        active_surface: 0
      };

      this.allMissions.forEach(m => {
        if (m.fateCategory === 'resting_moon') counts.resting_moon++;
        else if (m.fateCategory === 'silent_mars') counts.silent_mars++;
        else if (m.fateCategory === 'deep_space') counts.deep_space++;
        else if (m.fateCategory === 'sacrificial_plunge') counts.sacrificial_plunge++;
        else if (m.fateCategory === 'active_surface' || m.fateCategory === 'active_orbit') counts.active_surface++;
      });

      const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setEl('fate-count-all', counts.all);
      setEl('fate-count-moon', counts.resting_moon);
      setEl('fate-count-mars', counts.silent_mars);
      setEl('fate-count-deep', counts.deep_space);
      setEl('fate-count-plunge', counts.sacrificial_plunge);
      setEl('fate-count-active', counts.active_surface);
      setEl('archive-count-moon', counts.resting_moon);
      setEl('archive-count-mars', counts.silent_mars);
    }

    applyFilters() {
      // 1. Filter by Search Query
      let results = this.allMissions.filter(m => {
        if (!this.searchQuery) return true;

        const q = this.searchQuery;
        const nameMatch = (m.name || '').toLowerCase().includes(q);
        const callsignMatch = (m.callsign || '').toLowerCase().includes(q);
        const agencyMatch = (m.agency || '').toLowerCase().includes(q);
        const launchVehicleMatch = (m.launchVehicle || '').toLowerCase().includes(q);

        const destMatch = (m.destinations || []).some(d => d.toLowerCase().includes(q));
        const bodyMatch = (m.landingSiteCoordinates && m.landingSiteCoordinates.celestialBody) ?
          m.landingSiteCoordinates.celestialBody.toLowerCase().includes(q) : false;
        const siteMatch = (m.landingSiteCoordinates && m.landingSiteCoordinates.siteName) ?
          m.landingSiteCoordinates.siteName.toLowerCase().includes(q) : false;

        const instrumentMatch = (m.spacecraftSpecs && Array.isArray(m.spacecraftSpecs.instruments)) ?
          m.spacecraftSpecs.instruments.some(inst =>
            (inst.name && inst.name.toLowerCase().includes(q)) ||
            (inst.acronym && inst.acronym.toLowerCase().includes(q)) ||
            (inst.purpose && inst.purpose.toLowerCase().includes(q))
          ) : false;

        const powerMatch = (m.spacecraftSpecs && m.spacecraftSpecs.powerSource) ?
          m.spacecraftSpecs.powerSource.toLowerCase().includes(q) : false;

        const descMatch = (m.currentStatusDescription || '').toLowerCase().includes(q);

        return (
          nameMatch || callsignMatch || agencyMatch || launchVehicleMatch ||
          destMatch || bodyMatch || siteMatch || instrumentMatch || powerMatch || descMatch
        );
      });

      // 2. Filter by Hardware Fate Category
      if (this.activeFate !== 'all') {
        results = results.filter(m => {
          if (this.activeFate === 'active_surface') {
            return m.fateCategory === 'active_surface' || m.fateCategory === 'active_orbit';
          }
          return m.fateCategory === this.activeFate;
        });
      }

      // 3. Filter by Destination
      if (this.activeDestination !== 'all') {
        const dest = this.activeDestination.toLowerCase();
        results = results.filter(m => {
          const body = (m.landingSiteCoordinates && m.landingSiteCoordinates.celestialBody || '').toLowerCase();
          const allDests = [body, ...(m.destinations || [])].join(' ').toLowerCase();

          if (dest === 'moon') return allDests.includes('moon');
          if (dest === 'mars') return allDests.includes('mars');
          if (dest === 'saturn') return allDests.includes('saturn');
          if (dest === 'outer') {
            return (
              allDests.includes('jupiter') || allDests.includes('saturn') ||
              allDests.includes('uranus') || allDests.includes('neptune') ||
              allDests.includes('interstellar') || allDests.includes('heliosphere') ||
              allDests.includes('heliopause') || allDests.includes('deep space')
            );
          }
          if (dest === 'l2') {
            return (
              allDests.includes('l2') || allDests.includes('lagrange') ||
              allDests.includes('space') || m.fateCategory === 'active_orbit'
            );
          }
          return true;
        });
      }

      // 4. Sort Results
      results.sort((a, b) => {
        if (this.activeSort === 'launch-desc') {
          return new Date(b.launchDate) - new Date(a.launchDate);
        } else if (this.activeSort === 'launch-asc') {
          return new Date(a.launchDate) - new Date(b.launchDate);
        } else if (this.activeSort === 'mass-desc') {
          const massA = (a.spacecraftSpecs && a.spacecraftSpecs.dryMassKg) || 0;
          const massB = (b.spacecraftSpecs && b.spacecraftSpecs.dryMassKg) || 0;
          return massB - massA;
        } else if (this.activeSort === 'mass-asc') {
          const massA = (a.spacecraftSpecs && a.spacecraftSpecs.dryMassKg) || 0;
          const massB = (b.spacecraftSpecs && b.spacecraftSpecs.dryMassKg) || 0;
          return massA - massB;
        } else if (this.activeSort === 'distance-desc') {
          const distA = this.getApproxDistanceKm(a);
          const distB = this.getApproxDistanceKm(b);
          return distB - distA;
        }
        return 0;
      });

      this.filteredMissions = results;
      this.render();
    }

    getApproxDistanceKm(mission) {
      if (mission.distanceTotalKm) return mission.distanceTotalKm;
      const body = (mission.landingSiteCoordinates && mission.landingSiteCoordinates.celestialBody) || '';
      if (body.toLowerCase().includes('moon')) return 384400;
      if (body.toLowerCase().includes('mars')) return 225000000;
      if (mission.destinations && mission.destinations.some(d => d.toLowerCase().includes('saturn'))) return 1500000000;
      if (mission.destinations && mission.destinations.some(d => d.toLowerCase().includes('interstellar'))) return 24300000000;
      if (mission.fateCategory === 'active_orbit') return 1500000;
      return 1000000;
    }

    render() {
      // Update Live Telemetry Counter
      if (this.countVisibleEl) {
        this.countVisibleEl.textContent = this.filteredMissions.length;
      }

      // Toggle Empty State vs Grid
      const hasResults = this.filteredMissions.length > 0;
      if (this.emptyStateEl) {
        this.emptyStateEl.classList.toggle('hidden', hasResults);
      }
      if (this.gridContainer) {
        this.gridContainer.style.display = hasResults ? 'grid' : 'none';
        if (hasResults) {
          this.gridContainer.innerHTML = this.filteredMissions.map(m => this.createCardHTML(m)).join('');
          this.bindCardActions();
        } else {
          this.gridContainer.innerHTML = '';
        }
      }
    }

    createCardHTML(m) {
      const fateInfo = this.getFateBadgeInfo(m.fateCategory);
      const destLabel = this.getDestinationBadge(m);
      const craftArtSVG = this.getCraftArtSVG(m.id, m.fateCategory);
      const launchYear = m.launchDate ? new Date(m.launchDate).getFullYear() : 'N/A';
      const durationStr = this.getMissionDurationStr(m);
      const powerStr = this.getPowerSourceStr(m.spacecraftSpecs?.powerSource);
      const massStr = (m.spacecraftSpecs && m.spacecraftSpecs.dryMassKg) ? `${m.spacecraftSpecs.dryMassKg.toLocaleString()} kg` : 'N/A';
      const instCount = (m.spacecraftSpecs && m.spacecraftSpecs.instruments) ? m.spacecraftSpecs.instruments.length : 0;
      const narrativeSnippet = this.getWhereNowSnippet(m);
      const has3D = true;

      return `
        <article class="archive-mission-card fate-${m.fateCategory}" data-mission-id="${m.id}">
          <!-- Hero Header with SVG Craft Art & Badges -->
          <div class="card-hero-header">
            <div class="card-hero-backdrop-glow"></div>
            <div class="card-hero-art" aria-hidden="true">
              ${craftArtSVG}
            </div>
            <div class="card-hero-badges">
              <span class="card-dest-pill">${destLabel}</span>
              <span class="card-agency-tag">${m.agency || 'NASA'}</span>
            </div>
          </div>

          <!-- Main Card Content -->
          <div class="card-main-body">
            <div class="card-title-row">
              <h4 class="card-mission-title">${m.name}</h4>
              <div class="card-callsign-sub">${m.callsign}</div>
            </div>

            <!-- Fate Indicator Badge Bar -->
            <div class="card-fate-bar">
              <div class="card-fate-badge ${m.fateCategory}">
                <span class="card-fate-dot"></span>
                <span>${fateInfo.label}</span>
              </div>
              <div class="card-signal-pill ${m.isStillTransmitting ? 'transmitting' : 'silent'}">
                <span class="signal-blip"></span>
                <span>${m.isStillTransmitting ? 'Active Telemetry' : 'Silent Monument'}</span>
              </div>
            </div>

            <!-- Launch & Duration Metadata -->
            <div class="card-timeline-row">
              <span class="card-timeline-item">
                <span>🚀 Launch:</span> <strong>${launchYear}</strong>
              </span>
              <span class="card-timeline-item">
                <span>⏱ Duration:</span> <strong>${durationStr}</strong>
              </span>
            </div>

            <!-- Technical Specification Chips -->
            <div class="card-specs-chips">
              <span class="spec-chip" title="Power Source">
                <span class="chip-icon">⚡</span> ${powerStr}
              </span>
              <span class="spec-chip" title="Spacecraft Mass">
                <span class="chip-icon">⚖</span> ${massStr}
              </span>
              <span class="spec-chip" title="Scientific Payloads">
                <span class="chip-icon">🔬</span> ${instCount} Instruments
              </span>
            </div>

            <!-- Narrative Teaser Snippet (Chapter 7: Where Is It Now?) -->
            <div class="card-narrative-teaser">
              <div class="card-narrative-label">
                <span>✦</span> WHERE IS IT NOW?
              </div>
              <p class="card-narrative-text">"${narrativeSnippet}"</p>
            </div>
          </div>

          <!-- Action Footer Buttons -->
          <div class="card-action-footer">
            <button class="card-btn primary btn-story-roadmap" data-mission-id="${m.id}" title="Launch 7-Stage Interactive Story Roadmap">
              <span>Story Roadmap</span> <span>→</span>
            </button>
            <button class="card-btn secondary btn-locate-hardware" data-mission-id="${m.id}" title="Locate on Planetary Atlas">
              <span>📍 Locate</span>
            </button>
            ${has3D ? `
              <button class="card-btn tertiary btn-sim-3d" data-mission-id="${m.id}" title="Simulate 3D Orbital Trajectory">
                <span>▶ 3D</span>
              </button>
            ` : ''}
          </div>
        </article>
      `;
    }

    bindCardActions() {
      // 1. Story Roadmap Launchers
      document.querySelectorAll('.btn-story-roadmap').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const missionId = btn.dataset.missionId;
          const mission = this.allMissions.find(m => m.id === missionId);

          if (window.soundEngine && typeof window.soundEngine.playUI === 'function') {
            window.soundEngine.playUI('confirm');
          }

          // Trigger Custom Events for Story Roadmap Modal
          window.dispatchEvent(new CustomEvent('solar:explore-story', {
            detail: mission
          }));

          window.dispatchEvent(new CustomEvent('solar:open-story-roadmap', {
            detail: { missionId, mission }
          }));

          // If a story roadmap modal engine is exposed
          if (window.storyRoadmapModal && typeof window.storyRoadmapModal.open === 'function') {
            window.storyRoadmapModal.open(missionId);
          } else if (window.storyModal && typeof window.storyModal.open === 'function') {
            window.storyModal.open(missionId);
          } else {
            console.log(`[Archive] Story Roadmap triggered for mission: ${mission?.name} (${missionId})`);
          }
        });
      });

      // 2. Locate Hardware on Atlas
      document.querySelectorAll('.btn-locate-hardware').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const missionId = btn.dataset.missionId;
          const mission = this.allMissions.find(m => m.id === missionId);

          if (window.soundEngine && typeof window.soundEngine.playUI === 'function') {
            window.soundEngine.playUI('click');
          }

          if (window.switchSolarView) {
            window.switchSolarView('where-they-remain', { missionId, mission });
          } else if (window.navigationShell) {
            window.navigationShell.switchView('where-they-remain', { missionId, mission });
          }
        });
      });

      // 3. 3D Flight Simulation
      document.querySelectorAll('.btn-sim-3d').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const missionId = btn.dataset.missionId;

          if (window.soundEngine && typeof window.soundEngine.playUI === 'function') {
            window.soundEngine.playUI('confirm');
          }

          if (window.switchSolarView) {
            window.switchSolarView('explore');
          } else if (window.navigationShell) {
            window.navigationShell.switchView('explore');
          }

          if (window.solarApp && typeof window.solarApp.launchTrajectorySimulation === 'function') {
            window.solarApp.launchTrajectorySimulation(missionId);
          }
        });
      });
    }

    getFateBadgeInfo(fate) {
      switch (fate) {
        case 'resting_moon':
          return { label: 'Resting on Moon', color: '#8CC8FF' };
        case 'silent_mars':
          return { label: 'Silent on Mars', color: '#F97316' };
        case 'deep_space':
          return { label: 'Deep Space', color: '#FACC15' };
        case 'sacrificial_plunge':
          return { label: 'Sacrificial Plunge', color: '#8B5CF6' };
        case 'active_surface':
          return { label: 'Active Surface', color: '#10B981' };
        case 'active_orbit':
          return { label: 'Active Orbit (L2)', color: '#06B6D4' };
        default:
          return { label: 'Historic Monument', color: '#38BDF8' };
      }
    }

    getDestinationBadge(m) {
      if (m.landingSiteCoordinates && m.landingSiteCoordinates.celestialBody) {
        return m.landingSiteCoordinates.celestialBody.toUpperCase();
      }
      if (m.destinations && m.destinations.length > 0) {
        const last = m.destinations[m.destinations.length - 1];
        if (last.includes('Saturn')) return 'SATURN';
        if (last.includes('Interstellar') || last.includes('Deep Space')) return 'DEEP SPACE';
        if (last.includes('L2') || last.includes('Lagrange')) return 'SUN-EARTH L2';
        return 'SOLAR SYSTEM';
      }
      return 'DEEP SPACE';
    }

    getMissionDurationStr(m) {
      if (m.solsActive) {
        if (m.solsActive.includes('hrs') || m.solsActive.includes('hours')) return '21.6 hrs on Moon';
        if (m.solsActive.includes('Sols')) return m.solsActive.split('(')[0].trim();
        return m.solsActive;
      }
      if (m.launchDate && m.endDate) {
        const start = new Date(m.launchDate);
        const end = new Date(m.endDate);
        const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
        if (days < 30) return `${days} Days`;
        if (days < 365) return `${Math.round(days / 30)} Months`;
        return `${(days / 365.25).toFixed(1)} Years`;
      }
      return 'Multi-Year';
    }

    getPowerSourceStr(p) {
      if (!p) return 'Solar Arrays';
      const pl = p.toLowerCase();
      if (pl.includes('mmrtg') || pl.includes('rtg') || pl.includes('radioisotope') || pl.includes('snap-19')) {
        return '⚛ MMRTG Nuclear';
      }
      if (pl.includes('battery') || pl.includes('batteries') || pl.includes('silver-zinc')) {
        return '🔋 Ag-Zn Batteries';
      }
      if (pl.includes('solar')) {
        return '☀️ Triple-Junction Solar';
      }
      return '⚡ Electrical Power';
    }

    getWhereNowSnippet(m) {
      if (m.storyRoadmap && Array.isArray(m.storyRoadmap)) {
        const ch7 = m.storyRoadmap.find(c => c.chapterNumber === 7 || c.chapterId === 'where_is_it_now');
        if (ch7 && ch7.narrative) {
          return ch7.narrative;
        }
      }
      return m.currentStatusDescription || 'Historic monument permanently resting across planetary regolith.';
    }

    getCraftArtSVG(id, fate) {
      const fateColor = (
        fate === 'resting_moon' ? '#8cc8ff' :
        fate === 'silent_mars' ? '#f97316' :
        fate === 'deep_space' ? '#facc15' :
        fate === 'sacrificial_plunge' ? '#8b5cf6' :
        fate === 'active_surface' ? '#10b981' :
        '#38bdf8'
      );

      // Tailored vector artwork silhouettes for each mission archetype
      if (id.includes('apollo-11') || id.includes('apollo-15')) {
        // Lunar Module & Surface Flag
        return `
          <svg viewBox="0 0 100 100" width="86" height="86" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="${fateColor}" fill-opacity="0.1" stroke="${fateColor}" stroke-opacity="0.3" stroke-width="1.5"/>
            <!-- Lunar Ground -->
            <path d="M 12 78 Q 50 72 88 78 L 88 88 L 12 88 Z" fill="#334155" fill-opacity="0.5"/>
            <!-- LM Descent Stage Gold Octagon -->
            <polygon points="34,68 42,56 58,56 66,68 60,76 40,76" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
            <!-- LM Ascent Stage -->
            <polygon points="42,56 46,44 54,44 58,56" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
            <!-- LM Legs -->
            <line x1="34" y1="68" x2="22" y2="82" stroke="#cbd5e1" stroke-width="2"/>
            <line x1="66" y1="68" x2="78" y2="82" stroke="#cbd5e1" stroke-width="2"/>
            <line x1="44" y1="76" x2="40" y2="83" stroke="#cbd5e1" stroke-width="1.5"/>
            <line x1="56" y1="76" x2="60" y2="83" stroke="#cbd5e1" stroke-width="1.5"/>
            <!-- Flag -->
            <line x1="82" y1="58" x2="82" y2="82" stroke="#f8fafc" stroke-width="1.5"/>
            <rect x="82" y="58" width="12" height="8" fill="#f43f5e"/>
          </svg>
        `;
      } else if (id.includes('perseverance') || id.includes('curiosity') || id.includes('spirit')) {
        // Mars Rover & Mastcam
        return `
          <svg viewBox="0 0 100 100" width="86" height="86" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="${fateColor}" fill-opacity="0.1" stroke="${fateColor}" stroke-opacity="0.3" stroke-width="1.5"/>
            <!-- Mars Ground -->
            <path d="M 10 80 Q 50 74 90 80 L 90 90 L 10 90 Z" fill="#9a3412" fill-opacity="0.4"/>
            <!-- Rover Body Chassis -->
            <rect x="32" y="54" width="38" height="16" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
            <!-- Mastcam Neck & Head -->
            <line x1="38" y1="54" x2="38" y2="34" stroke="#94a3b8" stroke-width="2"/>
            <rect x="33" y="28" width="10" height="7" rx="2" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2"/>
            <!-- Robotic Arm -->
            <polyline points="64,62 76,52 82,60" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
            <!-- Rocker Bogie Wheels -->
            <circle cx="28" cy="78" r="6" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5"/>
            <circle cx="48" cy="78" r="6" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5"/>
            <circle cx="72" cy="78" r="6" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5"/>
          </svg>
        `;
      } else if (id.includes('pathfinder') || id.includes('viking')) {
        // Viking / Pathfinder Lander
        return `
          <svg viewBox="0 0 100 100" width="86" height="86" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="${fateColor}" fill-opacity="0.1" stroke="${fateColor}" stroke-opacity="0.3" stroke-width="1.5"/>
            <!-- Ground -->
            <path d="M 12 78 Q 50 72 88 78 L 88 88 L 12 88 Z" fill="#7c2d12" fill-opacity="0.4"/>
            <!-- Petals / Base -->
            <polygon points="30,68 70,68 62,56 38,56" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
            <!-- Dish -->
            <ellipse cx="50" cy="44" rx="14" ry="6" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
            <line x1="50" y1="44" x2="50" y2="32" stroke="#cbd5e1" stroke-width="1.5"/>
            <!-- Struts -->
            <line x1="30" y1="68" x2="18" y2="82" stroke="#cbd5e1" stroke-width="2"/>
            <line x1="70" y1="68" x2="82" y2="82" stroke="#cbd5e1" stroke-width="2"/>
          </svg>
        `;
      } else if (id.includes('voyager')) {
        // Voyager High-Gain Reflector
        return `
          <svg viewBox="0 0 100 100" width="86" height="86" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="${fateColor}" fill-opacity="0.1" stroke="${fateColor}" stroke-opacity="0.3" stroke-width="1.5"/>
            <!-- High Gain Parabolic Dish -->
            <path d="M 24 44 Q 50 30 76 44 L 70 50 Q 50 38 30 50 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
            <!-- Feed Horn Mast -->
            <line x1="50" y1="36" x2="50" y2="20" stroke="#facc15" stroke-width="2"/>
            <polygon points="47,20 53,20 50,15" fill="#facc15"/>
            <!-- Central Bus -->
            <polygon points="42,50 58,50 54,64 46,64" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
            <!-- 13m Magnetometer Boom -->
            <line x1="42" y1="56" x2="14" y2="78" stroke="#94a3b8" stroke-width="1.8"/>
            <!-- RTG Boom -->
            <line x1="58" y1="56" x2="84" y2="68" stroke="#f97316" stroke-width="2"/>
            <!-- Golden Record representation -->
            <circle cx="50" cy="57" r="4.5" fill="#eab308" stroke="#ca8a04" stroke-width="1"/>
          </svg>
        `;
      } else if (id.includes('cassini')) {
        // Cassini & Saturn Rings
        return `
          <svg viewBox="0 0 100 100" width="86" height="86" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="${fateColor}" fill-opacity="0.1" stroke="${fateColor}" stroke-opacity="0.3" stroke-width="1.5"/>
            <!-- Saturn Rings Background -->
            <ellipse cx="50" cy="56" rx="42" ry="12" fill="none" stroke="#fde047" stroke-opacity="0.35" stroke-width="3" transform="rotate(-18 50 56)"/>
            <!-- Orbiter Main Dish -->
            <ellipse cx="50" cy="38" rx="18" ry="7" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
            <line x1="50" y1="38" x2="50" y2="25" stroke="#38bdf8" stroke-width="1.5"/>
            <!-- Cylindrical Bus -->
            <rect x="44" y="44" width="12" height="20" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
            <!-- Huygens Probe on side -->
            <circle cx="40" cy="54" r="5" fill="#f59e0b" stroke="#b45309" stroke-width="1.2"/>
            <!-- Magnetometer boom -->
            <line x1="56" y1="52" x2="82" y2="40" stroke="#cbd5e1" stroke-width="1.5"/>
          </svg>
        `;
      } else if (id.includes('jwst')) {
        // JWST Gold Hexagonal Mirror & Sunshield
        return `
          <svg viewBox="0 0 100 100" width="86" height="86" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="${fateColor}" fill-opacity="0.1" stroke="${fateColor}" stroke-opacity="0.3" stroke-width="1.5"/>
            <!-- Kite Sunshield Layers -->
            <polygon points="12,58 50,48 88,58 50,68" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
            <polygon points="16,61 50,51 84,61 50,71" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/>
            <!-- Gold Hexagonal Primary Mirror Array -->
            <polygon points="43,26 57,26 64,38 57,50 43,50 36,38" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
            <!-- Secondary Mirror Struts -->
            <line x1="50" y1="38" x2="50" y2="18" stroke="#cbd5e1" stroke-width="1.5"/>
            <circle cx="50" cy="18" r="3" fill="#38bdf8"/>
          </svg>
        `;
      }

      // Default Deep Space Probe
      return `
        <svg viewBox="0 0 100 100" width="86" height="86" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="${fateColor}" fill-opacity="0.1" stroke="${fateColor}" stroke-opacity="0.3" stroke-width="1.5"/>
          <circle cx="50" cy="50" r="14" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
          <line x1="22" y1="50" x2="36" y2="50" stroke="#38bdf8" stroke-width="3"/>
          <line x1="64" y1="50" x2="78" y2="50" stroke="#38bdf8" stroke-width="3"/>
        </svg>
      `;
    }
  }

  // Self-instantiate on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.missionArchiveEngine = new MissionArchiveEngine();
    });
  } else {
    window.missionArchiveEngine = new MissionArchiveEngine();
  }

})();
