/**
 * CINEMATIC 3D TRAJECTORY SIMULATOR (Three.js)
 * High-contrast, cel-shaded chalk cartoon rocket & chalkboard astrodynamics trajectory visualizer.
 * Supports: Apollo 11, Perseverance (Mars 2020), Curiosity, Voyager 1, Cassini, Viking 1.
 */

class TrajectorySimulator {
  constructor(solarApp) {
    this.app = solarApp;
    this.scene = solarApp.scene;
    this.camera = solarApp.camera;
    this.controls = solarApp.controls;

    this.isActive = false;
    this.currentMission = null;
    this.progress = 0.0; // 0.0 to 1.0 along the trajectory curve
    this.simSpeed = 0.016; // Pacing: ~60 seconds for full voyage at 1x speed
    this.timeMultiplier = 1.0;
    this.isPaused = false;
    this.cameraMode = 'follow'; // 'follow', 'orbit', 'solar'

    // Blast-off Hold state
    this.blastoffHoldDuration = 1.8; // 1.8s hold on launchpad building thrust
    this.blastoffHoldTimer = 0.0;
    this.isHoldingBlastoff = false;
    this.wasAppPaused = false;

    // Visual elements
    this.rocketGroup = null;
    this.flamePuff1 = null;
    this.flamePuff2 = null;
    this.flamePuff3 = null;
    this.particlesGroup = null;
    this.trajectoryTube = null;
    this.chalkDashedLine = null;
    this.activeTrailMesh = null;
    this.trajectoryCurve = null;
    this.trajectoryPoints = [];
    this.landingBeacon = null;
    this.chalkLander = null;
    this.hasLanderPopped = false;
    this.stagedBooster = null;
    this.isStaged = false;
    this.waypointGroup = null;

    // DOM references
    this.hudElement = null;
    this.exitBtn = null;
    this.scrubberInput = null;
    this.phasePill = null;
    this.hazardCard = null;
    this.metricsGrid = null;
    this.memorialCard = null;

    // Mission Astrodynamics & Historical Database
    this.missions = {
      'apollo-11': {
        id: 'apollo-11',
        name: 'Apollo 11',
        callsign: 'Columbia & Eagle',
        targetBody: 'Moon',
        targetPlanet: 'Earth',
        craftType: 'lunar-module',
        color: 0x38bdf8,
        colorHex: '#38BDF8',
        accentColor: '#38BDF8',
        landingSite: 'Mare Tranquillitatis',
        landingCoords: '0.674° N, 23.473° E',
        landingDate: 'July 20, 1969',
        solsActive: '8 days total (21.6 hrs on lunar surface)',
        discardReason: 'The Apollo 11 Lunar Module descent stage served as a stationary launch platform for the ascent stage, left behind intentionally to save return payload weight.',
        weatheringInfo: 'Exposed to unfiltered solar ultraviolet radiation, micro-meteorite sandblasting, and thermal swings from -170°C to +120°C for over half a century.',
        legacy: 'Humanity\'s first footprint on another celestial body. The retroreflector experiment remains active today, bounced by lasers from Earth to measure lunar drift.',
        distanceTotalKm: 384400,
        transitDurationStr: '3 Days, 3 Hours, 49 Mins',
        maxVelocityKmS: 11.2,
        waypoints: [
          { t: 0.15, label: 'EARTH DEPARTURE / TLI' },
          { t: 0.50, label: 'CISLUNAR MID-COURSE' },
          { t: 0.90, label: 'LUNAR ORBIT / PDI' }
        ],
        phases: [
          {
            threshold: 0.15,
            name: 'PHASE 1: SATURN V LIFTOFF & MAX-Q',
            tag: 'LIFTOFF',
            hazard: 'Structural Max-Q dynamic pressure at 13.5 km altitude. Saturn V generates 34.5 million Newtons of thrust.',
            details: 'Five F-1 engines burn 15 metric tons of kerosene and liquid oxygen per second. The vehicle clears Earth\'s dense troposphere onto an elliptical parking orbit.'
          },
          {
            threshold: 0.35,
            name: 'PHASE 2: TRANSLUNAR INJECTION (TLI)',
            tag: 'TLI BURN',
            hazard: 'S-IVB third-stage reignition. A 350-second burn boosts crew capsule to 39,000 km/h escape velocity.',
            details: 'Translunar injection sends Apollo onto a free-return trajectory. If lunar orbit insertion fails, lunar gravity automatically slingshots the craft back to Earth.'
          },
          {
            threshold: 0.75,
            name: 'PHASE 3: CISLUNAR TRANSIT & RADIATION',
            tag: 'COAST',
            hazard: 'Traversing Van Allen radiation belts. Barbecue-roll rotation (PTC) at 3 revs/hr balances extreme solar heating.',
            details: 'Unpowered ballistic cruise across the Earth-Moon gravitational null point. Star-sighting sextant navigations confirm trajectory alignment.'
          },
          {
            threshold: 0.90,
            name: 'PHASE 4: LUNAR DESCENT & PDI',
            tag: 'DESCENT',
            hazard: 'Powered Descent Initiation (PDI). 1201/1202 computer overload alarms sound inside the Eagle cockpit.',
            details: 'Neil Armstrong takes manual attitude control over boulder-strewn West Crater, touching down with less than 25 seconds of descent fuel remaining.'
          },
          {
            threshold: 1.0,
            name: 'PHASE 5: TRANQUILITY BASE (RESTING SITE)',
            tag: 'LANDED',
            hazard: 'Stationary resting site on lunar regolith. Desolation, solar radiation, vacuum.',
            details: 'Eagle descent stage, commemorative plaque, and United States flag remain undisturbed on the sea of tranquility.'
          }
        ]
      },
      'perseverance': {
        id: 'perseverance',
        name: 'Perseverance (Mars 2020)',
        callsign: 'Mars 2020 & Ingenuity',
        targetBody: 'Mars',
        targetPlanet: 'Mars',
        craftType: 'mars-rover',
        color: 0xfb923c,
        colorHex: '#FB923C',
        accentColor: '#FB923C',
        landingSite: 'Jezero Crater Delta',
        landingCoords: '18.38° N, 77.58° E',
        landingDate: 'February 18, 2021',
        solsActive: '1,300+ Sols (Active Mission)',
        discardReason: 'The cruise stage, aeroshell heatshield, supersonic parachute, and rocket-powered skycrane were intentionally jettisoned during the 7 Minutes of Terror.',
        weatheringInfo: 'Martian dust storms, atmospheric dust devils, and intense perchlorate chemical oxidizers in the regolith continually weather the hardware.',
        legacy: 'Cached 24 hermetically sealed rock cores for the future Mars Sample Return mission and hosted Ingenuity, the first powered aircraft on an alien planet.',
        distanceTotalKm: 470000000,
        transitDurationStr: '6 Months, 20 Days',
        maxVelocityKmS: 24.6,
        waypoints: [
          { t: 0.15, label: 'EARTH DEPARTURE / ESCAPE' },
          { t: 0.50, label: 'HOHMANN INTERPLANETARY APHELION' },
          { t: 0.90, label: 'MARS ATMOSPHERIC ENTRY (EDL)' }
        ],
        phases: [
          {
            threshold: 0.15,
            name: 'PHASE 1: ATLAS V LAUNCH & ESCAPE',
            tag: 'LIFTOFF',
            hazard: 'High energy launch from Cape Canaveral SLC-41 directly into heliocentric planetary transfer orbit.',
            details: 'Atlas V 541 configuration deploys the 1,025 kg nuclear-powered rover, cruise stage, and Ingenuity helicopter into interplanetary trajectory.'
          },
          {
            threshold: 0.35,
            name: 'PHASE 2: HOHMANN TRANSFER INJECTION',
            tag: 'INJECTION',
            hazard: 'Centaur upper stage burn timed to meet Mars at future orbital rendezvous 200 days ahead.',
            details: 'The craft departs Earth at 11.5 km/s, coasting along an elliptical orbit tangent to both Earth and Mars orbital planes around the Sun.'
          },
          {
            threshold: 0.75,
            name: 'PHASE 3: INTERPLANETARY CRUISE & SOLAR WIND',
            tag: 'DEEP SPACE',
            hazard: 'Solar Particle Events (SPE) and cosmic rays. Radio round-trip delay stretches from seconds to 22 minutes.',
            details: 'Eight trajectory correction maneuvers (TCM) refine the entry flight path angle within a precise 0.15-degree entry corridor.'
          },
          {
            threshold: 0.90,
            name: 'PHASE 4: 7 MINUTES OF TERROR (EDL)',
            tag: 'ATMOSPHERIC ENTRY',
            hazard: 'Peak deceleration heating reaches 1,300°C. Autonomous Terrain-Relative Navigation guides the craft.',
            details: '21.5-meter supersonic parachute deploys at Mach 1.7. Skycrane fires 8 monopropellant thrusters, lowering Perseverance onto cables into Jezero Crater.'
          },
          {
            threshold: 1.0,
            name: 'PHASE 5: JEZERO CRATER DELTA',
            tag: 'SURFACE OPS',
            hazard: 'Extreme Martian chill (-90°C), global dust storms, ionizing surface radiation.',
            details: 'Perseverance drills ancient lakebed sediments while discarded heatshield and skycrane fragments rest in the outer crater plains.'
          }
        ]
      },
      'voyager-1': {
        id: 'voyager-1',
        name: 'Voyager 1',
        callsign: 'Voyager Interstellar',
        targetBody: 'Deep Space',
        targetPlanet: 'Jupiter',
        craftType: 'probe',
        color: 0xfde047,
        colorHex: '#FDE047',
        accentColor: '#FDE047',
        landingSite: 'Interstellar Space (Heliopause)',
        landingCoords: 'Declination +12° 02\', R.A. 17h 14m',
        landingDate: 'Crossed Heliopause August 25, 2012',
        solsActive: '48+ Years (Still Transmitting)',
        discardReason: 'Titan IIIE Centaur booster, propulsion module, and shroud detached as the probe exceeded solar escape velocity.',
        weatheringInfo: 'Drifting through galactic cosmic rays and cold interstellar plasma at 3 Kelvin (-270°C). Micrometeoroid impacts pit its gold-coated bus.',
        legacy: 'Farthest human-made object in history (over 24 billion km from Earth). Carries the Golden Record containing Earth sounds, images, and greetings.',
        distanceTotalKm: 24300000000,
        transitDurationStr: '48 Years, 6 Months',
        maxVelocityKmS: 61.2,
        waypoints: [
          { t: 0.15, label: 'EARTH DEPARTURE' },
          { t: 0.40, label: 'JUPITER GRAVITY ASSIST (+16 km/s)' },
          { t: 0.65, label: 'SATURN GRAVITY ASSIST (+35° DEFLECTION)' }
        ],
        phases: [
          {
            threshold: 0.15,
            name: 'PHASE 1: TITAN IIIE CENTAUR LAUNCH',
            tag: 'LIFTOFF',
            hazard: 'Titan IIIE solid rocket motor staging over Cape Canaveral on September 5, 1977.',
            details: 'Direct interplanetary injection onto a hyperbolic high-energy trajectory aimed at the Jovian gravity well.'
          },
          {
            threshold: 0.35,
            name: 'PHASE 2: JUPITER GRAVITY ASSIST',
            tag: 'SLINGSHOT 1',
            hazard: 'Extreme Jovian radiation belts capable of destroying unshielded CMOS electronics.',
            details: 'Closest approach of 349,000 km steals orbital momentum from Jupiter, accelerating Voyager 1 by 16 km/s outward toward Saturn.'
          },
          {
            threshold: 0.65,
            name: 'PHASE 3: SATURN ENCOUNTER & TITAN DIVE',
            tag: 'SLINGSHOT 2',
            hazard: 'Titan close flyby deflects trajectory 35° out of the ecliptic plane into deep space.',
            details: 'Voyager inspects Saturn\'s F-ring and Titan\'s nitrogen atmosphere before sling-shooting northward at hyperbolic escape velocity.'
          },
          {
            threshold: 0.85,
            name: 'PHASE 4: TERMINATION SHOCK & HELIOSHEATH',
            tag: 'HELIOPAUSE',
            hazard: 'Solar wind drops abruptly from supersonic (400 km/s) to subsonic speeds in the turbulent heliosheath.',
            details: 'Plasma wave detectors record high-frequency vibrations confirming transition beyond the Sun\'s magnetic bubble.'
          },
          {
            threshold: 1.0,
            name: 'PHASE 5: THE INTERSTELLAR VOYAGER',
            tag: 'INTERSTELLAR',
            hazard: 'Nuclear decay of plutonium RTG fuel. Power decreases ~4 Watts per year.',
            details: 'Voyager 1 will drift silently among the Milky Way stars for millions of years, outliving humanity and planet Earth itself.'
          }
        ]
      },
      'curiosity': {
        id: 'curiosity',
        name: 'Curiosity (MSL)',
        callsign: 'Mars Science Laboratory',
        targetBody: 'Mars',
        targetPlanet: 'Mars',
        craftType: 'mars-rover',
        color: 0x34d399,
        colorHex: '#34D399',
        accentColor: '#34D399',
        landingSite: 'Gale Crater (Mount Sharp)',
        landingCoords: '4.59° S, 137.44° E',
        landingDate: 'August 6, 2012',
        solsActive: '4,300+ Sols (Active Mission)',
        discardReason: 'Aeroshell, heatshield, and skycrane severed and crashed safely kilometers away following the wheels-down signal.',
        weatheringInfo: 'Ten years of sharp Martian basalt rocks have punched holes in the aluminum wheels, and atmospheric dust coats the RTG radiator.',
        legacy: 'Proved ancient Mars possessed hospitable conditions for microbial life: neutral water, carbon, nitrogen, hydrogen, oxygen, phosphorus, and sulfur.',
        distanceTotalKm: 567000000,
        transitDurationStr: '8 Months, 11 Days',
        maxVelocityKmS: 22.8,
        waypoints: [
          { t: 0.15, label: 'EARTH DEPARTURE / TLI' },
          { t: 0.50, label: 'INTERPLANETARY CRUISE' },
          { t: 0.90, label: 'GALE CRATER SKYCRANE EDL' }
        ],
        phases: [
          {
            threshold: 0.2,
            name: 'PHASE 1: EARTH DEPARTURE & MAX-Q',
            tag: 'LIFTOFF',
            hazard: 'Atlas V 541 lifts the heaviest planetary science payload up to that point.',
            details: 'Nuclear-powered rover enclosed in an aerodynamic aeroshell enters parking orbit and fires for trans-Mars injection.'
          },
          {
            threshold: 0.5,
            name: 'PHASE 2: HOHMANN TRANSIT COAST',
            tag: 'CRUISE',
            hazard: 'Radiation Assessment Detector (RAD) measures interplanetary cosmic radiation.',
            details: 'Spin-stabilized cruise stage keeps solar arrays oriented toward the Sun during the 254-day transit.'
          },
          {
            threshold: 0.8,
            name: 'PHASE 3: GUIDED ENTRY & SKYCRANE',
            tag: '7 MIN OF TERROR',
            hazard: 'Ballistic entry with guided lifting vector. First-ever use of the rocket-powered skycrane.',
            details: 'Bridle cables deploy Curiosity at 0.75 m/s onto the floor of Gale Crater, cutting tethers as the crane flies off to crash.'
          },
          {
            threshold: 1.0,
            name: 'PHASE 4: MOUNT SHARP EXPEDITION',
            tag: 'ACTIVE SURFACE',
            hazard: 'Wheel wear, dust buildup, sub-zero Martian nights.',
            details: 'Curiosity continues ascending the layered sedimentary slopes of Mount Sharp, reading billions of years of planetary history.'
          }
        ]
      },
      'cassini': {
        id: 'cassini',
        name: 'Cassini-Huygens',
        callsign: 'Cassini Orbiter',
        targetBody: 'Saturn',
        targetPlanet: 'Saturn',
        craftType: 'probe',
        color: 0xfbbf24,
        colorHex: '#FBBF24',
        accentColor: '#FBBF24',
        landingSite: 'Saturn Upper Atmosphere (Grand Finale)',
        landingCoords: 'Sub-Saturn Equator Entry',
        landingDate: 'September 15, 2017',
        solsActive: '19 Years, 11 Months',
        discardReason: 'Intentionally vaporized in Saturn\'s crushing atmosphere to protect potentially habitable moons Enceladus and Titan from Earth microbes.',
        weatheringInfo: 'Completely atomized into Saturn\'s hydrogen-helium atmosphere; its molecules are now permanently part of the gas giant.',
        legacy: 'Discovered global liquid subsurface ocean on Enceladus spraying geysers into space, and landed the Huygens probe on liquid methane lakes of Titan.',
        distanceTotalKm: 3400000000,
        transitDurationStr: '6 Years, 8 Months to Saturn',
        maxVelocityKmS: 34.0,
        waypoints: [
          { t: 0.15, label: 'EARTH DEPARTURE' },
          { t: 0.50, label: 'VVEJGA GRAVITY ASSISTS' },
          { t: 0.85, label: 'SATURN RING PLANE INSERTION' }
        ],
        phases: [
          {
            threshold: 0.2,
            name: 'PHASE 1: TITAN IVB LAUNCH',
            tag: 'LIFTOFF',
            hazard: 'Massive 5.6-ton flagship probe departs Earth in October 1997.',
            details: 'Equipped with 3 RTGs and the European Space Agency\'s Huygens Titan lander.'
          },
          {
            threshold: 0.5,
            name: 'PHASE 2: VVEJGA INTERPLANETARY LOOPS',
            tag: 'GRAVITY ASSISTS',
            hazard: 'Venus-Venus-Earth-Jupiter Gravity Assist maneuvers across 7 years.',
            details: 'Robbed orbital speed from Venus twice, Earth once, and Jupiter once to climb up the solar gravity well to Saturn.'
          },
          {
            threshold: 0.8,
            name: 'PHASE 3: SATURN ORBIT INSERTION',
            tag: 'SOI BURN',
            hazard: 'Crossing through the gap between Saturn\'s F and G rings. Dust impact shields active.',
            details: 'Main engine fires for 96 minutes, braking into orbit and beginning 13 years of revolutionary exploration.'
          },
          {
            threshold: 1.0,
            name: 'PHASE 4: THE GRAND FINALE DIVE',
            tag: 'FINAL DESCENT',
            hazard: 'Atmospheric frictional heating destroys the spacecraft while thrusters fire to keep antenna aimed at Earth.',
            details: 'Until the final millisecond, Cassini beamed direct samples of Saturn\'s atmosphere back to Earth before melting into the planet.'
          }
        ]
      }
    };

    this.init();
  }

  init() {
    this.createDOMElements();
    this.createProceduralRocket();
  }

  // --- 1. PROCEDURAL MINIATURE CEL-SHADED CHALK ROCKET (SCALE = 0.55) ---
  createProceduralRocket() {
    this.rocketGroup = new THREE.Group();
    this.rocketGroup.name = 'TrajectoryRocketGroup';

    // Cel-shaded ("shell-shaded"), matte chalk-colored materials with toon gradient
    const toonGrad = this.app.toonGradient || null;

    // 1. Chalk White Fuselage
    const chalkWhiteMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      roughness: 0.9,
      gradientMap: toonGrad
    });

    // 2. Chalk Crimson Accents (Nose & Fins)
    const chalkCrimsonMat = new THREE.MeshToonMaterial({
      color: 0xf43f5e,
      roughness: 0.9,
      gradientMap: toonGrad
    });

    // 3. Chalk Cyan Porthole
    const chalkCyanMat = new THREE.MeshToonMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      gradientMap: toonGrad
    });

    // 4. Charcoal Engine Base
    const charcoalMat = new THREE.MeshToonMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      gradientMap: toonGrad
    });

    // High-Contrast Dark Ink Outline Material
    const inkOutlineMat = new THREE.MeshBasicMaterial({
      color: 0x050816,
      side: THREE.BackSide
    });

    // --- A. Fuselage: Bulbous capsule cylinder with slight taper ---
    const fuselageGeo = new THREE.CylinderGeometry(0.36, 0.44, 1.7, 20);
    const fuselage = new THREE.Mesh(fuselageGeo, chalkWhiteMat);
    fuselage.castShadow = true;
    this.rocketGroup.add(fuselage);

    // Inverted hull ink outline for fuselage
    const fuseOutlineGeo = new THREE.CylinderGeometry(0.36 * 1.08, 0.44 * 1.08, 1.7 * 1.02, 20);
    const fuseOutline = new THREE.Mesh(fuseOutlineGeo, inkOutlineMat);
    this.rocketGroup.add(fuseOutline);

    // Chalk crimson mid-stripe band
    const stripeGeo = new THREE.CylinderGeometry(0.405, 0.405, 0.28, 20);
    const stripe = new THREE.Mesh(stripeGeo, chalkCrimsonMat);
    stripe.position.y = 0.25;
    this.rocketGroup.add(stripe);

    // --- B. Conical Chalk-Red Nosecone ---
    const noseGeo = new THREE.ConeGeometry(0.36, 0.85, 20);
    const nose = new THREE.Mesh(noseGeo, chalkCrimsonMat);
    nose.position.y = 1.275;
    this.rocketGroup.add(nose);

    const noseOutlineGeo = new THREE.ConeGeometry(0.36 * 1.08, 0.85 * 1.05, 20);
    const noseOutline = new THREE.Mesh(noseOutlineGeo, inkOutlineMat);
    noseOutline.position.y = 1.275;
    this.rocketGroup.add(noseOutline);

    // Tiny radio antenna needle at tip
    const needleGeo = new THREE.CylinderGeometry(0.02, 0.035, 0.45, 8);
    const needle = new THREE.Mesh(needleGeo, charcoalMat);
    needle.position.y = 1.88;
    this.rocketGroup.add(needle);

    // --- C. Round Chalk-Cyan Observation Porthole ---
    const windowGroup = new THREE.Group();
    const portHoleGeo = new THREE.CircleGeometry(0.13, 18);
    const portHole = new THREE.Mesh(portHoleGeo, chalkCyanMat);
    portHole.position.set(0, 0.32, 0.405);

    const portHoleRimGeo = new THREE.RingGeometry(0.125, 0.17, 18);
    const portHoleRim = new THREE.Mesh(portHoleRimGeo, charcoalMat);
    portHoleRim.position.set(0, 0.32, 0.406);
    windowGroup.add(portHole);
    windowGroup.add(portHoleRim);
    this.rocketGroup.add(windowGroup);

    // --- D. 3 Angled Cartoon Fins with Distinct Dark Bevel Borders ---
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.55, -0.32);
    finShape.lineTo(0.48, -0.72);
    finShape.lineTo(0, -0.55);
    finShape.closePath();

    const extrudeSettings = { depth: 0.06, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);

    for (let i = 0; i < 3; i++) {
      const fin = new THREE.Mesh(finGeo, chalkCrimsonMat);
      fin.rotation.y = (i * Math.PI * 2) / 3;
      fin.position.y = -0.42;
      this.rocketGroup.add(fin);

      // Dark outline for fin
      const finOut = new THREE.Mesh(finGeo, inkOutlineMat);
      finOut.rotation.y = (i * Math.PI * 2) / 3;
      finOut.position.y = -0.42;
      finOut.scale.set(1.08, 1.08, 1.08);
      this.rocketGroup.add(finOut);
    }

    // --- E. Retro-Rocket Engine Nozzle ---
    const nozzleGeo = new THREE.CylinderGeometry(0.15, 0.35, 0.45, 16, 1, true);
    const nozzle = new THREE.Mesh(nozzleGeo, charcoalMat);
    nozzle.position.y = -1.05;
    this.rocketGroup.add(nozzle);

    const nozzleOutGeo = new THREE.CylinderGeometry(0.15 * 1.1, 0.35 * 1.1, 0.45 * 1.02, 16, 1, true);
    const nozzleOut = new THREE.Mesh(nozzleOutGeo, inkOutlineMat);
    nozzleOut.position.y = -1.05;
    this.rocketGroup.add(nozzleOut);

    // --- F. Chalk Flame Puffs (Layered Cartoon Teardrops/Spheres) ---
    // Outer flame puff (Chalk Tangerine #FB923C)
    const flameGeo1 = new THREE.SphereGeometry(0.28, 12, 12);
    const flameMat1 = new THREE.MeshBasicMaterial({
      color: 0xfb923c,
      transparent: true,
      opacity: 0.95
    });
    this.flamePuff1 = new THREE.Mesh(flameGeo1, flameMat1);
    this.flamePuff1.position.y = -1.35;
    this.flamePuff1.scale.set(1.0, 1.4, 1.0);
    this.rocketGroup.add(this.flamePuff1);

    // Inner bright core (Chalk Lemon #FDE047)
    const flameGeo2 = new THREE.SphereGeometry(0.18, 10, 10);
    const flameMat2 = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.98
    });
    this.flamePuff2 = new THREE.Mesh(flameGeo2, flameMat2);
    this.flamePuff2.position.y = -1.28;
    this.flamePuff2.scale.set(0.9, 1.2, 0.9);
    this.rocketGroup.add(this.flamePuff2);

    // Lower trailing spark pop
    const flameGeo3 = new THREE.SphereGeometry(0.12, 8, 8);
    this.flamePuff3 = new THREE.Mesh(flameGeo3, flameMat2.clone());
    this.flamePuff3.position.y = -1.72;
    this.rocketGroup.add(this.flamePuff3);

    // MINIATURE PROPORTIONS: scale = 0.55 (Total height ~ 1.2 units)
    this.rocketGroup.scale.setScalar(0.55);
    this.rocketGroup.visible = false;
    this.scene.add(this.rocketGroup);

    // 7. Trailing Chalk Dust Particle System
    this.createSmokeParticleSystem();

    // 8. Destination Chalk Landing Beacon
    this.createLandingBeacon();
  }

  createSmokeParticleSystem() {
    this.particlesGroup = new THREE.Group();
    this.particles = [];
    const count = 45;
    const geo = new THREE.SphereGeometry(0.12, 8, 8);
    const chalkColors = [0xfde047, 0xfb923c, 0xfef08a, 0xffffff];

    for (let i = 0; i < count; i++) {
      const col = chalkColors[i % chalkColors.length];
      const mat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.8
      });
      const p = new THREE.Mesh(geo, mat);
      p.visible = false;
      p.userData = {
        life: 0,
        maxLife: 0.9,
        vel: new THREE.Vector3()
      };
      this.particlesGroup.add(p);
      this.particles.push(p);
    }
    this.scene.add(this.particlesGroup);
  }

  // --- 2. DESTINATION CHALK LANDING BEACON & POP-UP LANDER ---
  createLandingBeacon() {
    this.landingBeacon = new THREE.Group();
    this.landingBeacon.name = 'TrajectoryLandingBeacon';

    // 1. Concentric Chalk Target Rings on Surface
    const ringGeo1 = new THREE.RingGeometry(0.7, 0.85, 32);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    this.landingBeacon.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(1.15, 1.25, 32);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    this.landingBeacon.add(ring2);

    // 2. Miniature Cel-shaded Lander & Memorial Flag
    this.chalkLander = new THREE.Group();

    // Golden foil octagonal descent stage
    const baseGeo = new THREE.CylinderGeometry(0.28, 0.38, 0.2, 8);
    const baseMat = new THREE.MeshToonMaterial({
      color: 0xf59e0b,
      gradientMap: this.app.toonGradient
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.1;
    this.chalkLander.add(baseMesh);

    // Outline
    const baseOutGeo = new THREE.CylinderGeometry(0.28 * 1.1, 0.38 * 1.1, 0.2 * 1.1, 8);
    const outMat = new THREE.MeshBasicMaterial({ color: 0x050816, side: THREE.BackSide });
    baseMesh.add(new THREE.Mesh(baseOutGeo, outMat));

    // White capsule top
    const capGeo = new THREE.DodecahedronGeometry(0.16);
    const capMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      gradientMap: this.app.toonGradient
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 0.28;
    this.chalkLander.add(capMesh);

    // 4 Landing Struts
    for (let i = 0; i < 4; i++) {
      const legGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.35, 6);
      const legMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
      const leg = new THREE.Mesh(legGeo, legMat);
      const angle = (i * Math.PI) / 2;
      leg.position.set(Math.cos(angle) * 0.28, 0.07, Math.sin(angle) * 0.28);
      leg.rotation.z = Math.PI / 6;
      this.chalkLander.add(leg);
    }

    // Miniature Flagpole & Chalk Crimson Flag
    const poleGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.8, 6);
    const poleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0.22, 0.4, 0);
    this.chalkLander.add(pole);

    const flagShape = new THREE.Shape();
    flagShape.moveTo(0, 0);
    flagShape.lineTo(0.28, 0.09);
    flagShape.lineTo(0, 0.18);
    flagShape.closePath();
    const flagGeo = new THREE.ShapeGeometry(flagShape);
    const flagMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0.22, 0.58, 0);
    this.chalkLander.add(flag);

    this.chalkLander.scale.set(0.001, 0.001, 0.001);
    this.landingBeacon.add(this.chalkLander);

    this.landingBeacon.visible = false;
    this.scene.add(this.landingBeacon);
  }

  // --- 3. HIGH-CONTRAST CHALK-SKETCH TRAJECTORY DESIGN ---
  generateMissionSpline(mission) {
    // Clear old elements
    if (this.chalkDashedLine) {
      this.scene.remove(this.chalkDashedLine);
      this.chalkDashedLine.geometry.dispose();
      this.chalkDashedLine.material.dispose();
      this.chalkDashedLine = null;
    }
    if (this.trajectoryTube) {
      this.scene.remove(this.trajectoryTube);
      this.trajectoryTube.geometry.dispose();
      this.trajectoryTube.material.dispose();
      this.trajectoryTube = null;
    }
    if (this.activeTrailMesh) {
      this.scene.remove(this.activeTrailMesh);
      if (this.activeTrailMesh.geometry) this.activeTrailMesh.geometry.dispose();
      this.activeTrailMesh = null;
    }
    if (this.waypointGroup) {
      this.scene.remove(this.waypointGroup);
      this.waypointGroup = null;
    }

    const earthObj = this.app.planets['Earth'];
    const earthPos = new THREE.Vector3();
    if (earthObj && earthObj.mesh) {
      earthObj.mesh.getWorldPosition(earthPos);
    } else {
      earthPos.set(95, 0, 0);
    }

    const points = [];

    if (mission.id === 'apollo-11') {
      // Earth to Moon Translunar Free-Return Loop
      const moonObj = earthObj && earthObj.moons && earthObj.moons[0];
      const moonPos = new THREE.Vector3();
      if (moonObj) {
        moonObj.getWorldPosition(moonPos);
      } else {
        moonPos.copy(earthPos).add(new THREE.Vector3(7.5, 0, 0));
      }

      // Point 1: Launch Pad at Earth's surface
      points.push(earthPos.clone().add(new THREE.Vector3(0, 4.0, 0)));
      // Point 2: Low Earth Orbit (LEO)
      points.push(earthPos.clone().add(new THREE.Vector3(3.5, 4.8, 1.8)));
      // Point 3: Translunar Injection coast
      const mid1 = new THREE.Vector3().lerpVectors(earthPos, moonPos, 0.45).add(new THREE.Vector3(0, 4.5, 2.5));
      points.push(mid1);
      // Point 4: Approaching Moon gravity well
      const mid2 = new THREE.Vector3().lerpVectors(earthPos, moonPos, 0.8).add(new THREE.Vector3(0, -1.8, -1.2));
      points.push(mid2);
      // Point 5: Lunar Orbit insertion
      points.push(moonPos.clone().add(new THREE.Vector3(-1.2, 1.8, 0.9)));
      // Point 6: Touchdown at Tranquility Base
      points.push(moonPos.clone().add(new THREE.Vector3(0, 1.15, 0)));

    } else if (mission.id === 'perseverance' || mission.id === 'curiosity' || mission.id === 'viking-1') {
      // Sun-Centered Elliptical Hohmann Transfer Orbit to Mars
      const marsObj = this.app.planets['Mars'];
      const marsPos = new THREE.Vector3();
      if (marsObj && marsObj.mesh) {
        marsObj.mesh.getWorldPosition(marsPos);
      } else {
        marsPos.set(130, 0, 0);
      }

      // Point 1: Earth Liftoff
      points.push(earthPos.clone().add(new THREE.Vector3(0, 4.0, 0)));
      // Point 2: Earth Escape Trajectory
      points.push(earthPos.clone().add(new THREE.Vector3(6, 5.5, 4.5)));

      const rEarth = earthPos.length();
      const rMars = marsPos.length();
      const angleEarth = Math.atan2(earthPos.z, earthPos.x);
      const angleMars = Math.atan2(marsPos.z, marsPos.x);

      // Arc spanning heliocentric angles
      const steps = 7;
      for (let s = 1; s <= steps; s++) {
        const frac = s / (steps + 1);
        const currentAngle = angleEarth + (angleMars - angleEarth) * frac;
        const currentRadius = THREE.MathUtils.lerp(rEarth, rMars, Math.sin((frac * Math.PI) / 2));
        const yOffset = Math.sin(frac * Math.PI) * 7.5;
        points.push(new THREE.Vector3(
          Math.cos(currentAngle) * currentRadius,
          yOffset,
          Math.sin(currentAngle) * currentRadius
        ));
      }

      // Approach Mars entry interface
      points.push(marsPos.clone().add(new THREE.Vector3(-4.5, 5, -3.5)));
      // Parachute & Skycrane descent
      points.push(marsPos.clone().add(new THREE.Vector3(0, 3.2, 0)));

    } else if (mission.id === 'voyager-1') {
      // Earth -> Jupiter Gravity Assist -> Saturn Gravity Assist -> Interstellar Hyperbolic Escape
      const jupObj = this.app.planets['Jupiter'];
      const satObj = this.app.planets['Saturn'];

      const jupPos = (jupObj && jupObj.mesh) ? jupObj.mesh.position.clone() : new THREE.Vector3(195, 0, 0);
      const satPos = (satObj && satObj.mesh) ? satObj.mesh.position.clone() : new THREE.Vector3(255, 0, 0);

      points.push(earthPos.clone().add(new THREE.Vector3(0, 4.0, 0)));
      points.push(earthPos.clone().add(new THREE.Vector3(10, 7, 7)));
      points.push(new THREE.Vector3().lerpVectors(earthPos, jupPos, 0.5).add(new THREE.Vector3(0, 6, -10)));
      points.push(jupPos.clone().add(new THREE.Vector3(-14, 8, 12)));
      points.push(new THREE.Vector3().lerpVectors(jupPos, satPos, 0.5).add(new THREE.Vector3(0, 18, -15)));
      points.push(satPos.clone().add(new THREE.Vector3(-12, 22, -18)));
      points.push(satPos.clone().add(new THREE.Vector3(90, 85, -120)));
      points.push(satPos.clone().add(new THREE.Vector3(180, 160, -240)));

    } else {
      // Default Interplanetary Arc (Cassini / general)
      const satObj = this.app.planets['Saturn'];
      const satPos = (satObj && satObj.mesh) ? satObj.mesh.position.clone() : new THREE.Vector3(255, 0, 0);

      points.push(earthPos.clone().add(new THREE.Vector3(0, 4.0, 0)));
      points.push(earthPos.clone().add(new THREE.Vector3(12, 9, 9)));
      points.push(new THREE.Vector3(140, 18, 40));
      points.push(satPos.clone().add(new THREE.Vector3(-8, 12, -8)));
      points.push(satPos.clone().add(new THREE.Vector3(0, 4, 0)));
    }

    this.trajectoryCurve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
    this.trajectoryPoints = points;

    // --- 1. Primary Line: Bold, Unlit Chalk-Dashed Ribbon ---
    const curvePoints = this.trajectoryCurve.getPoints(120);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const lineMat = new THREE.LineDashedMaterial({
      color: mission.color,
      dashSize: 1.8,
      gapSize: 0.8,
      scale: 1,
      linewidth: 3
    });
    this.chalkDashedLine = new THREE.Line(lineGeo, lineMat);
    this.chalkDashedLine.computeLineDistances();
    this.chalkDashedLine.name = 'ChalkDashedLine';
    this.scene.add(this.chalkDashedLine);

    // --- 2. Overlay Glowing Chalk-Dust Tube (translucent soft glow) ---
    const tubeGeo = new THREE.TubeGeometry(this.trajectoryCurve, 120, 0.35, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: mission.color,
      emissive: mission.color,
      emissiveIntensity: 0.8,
      roughness: 0.85,
      transparent: true,
      opacity: 0.35
    });
    this.trajectoryTube = new THREE.Mesh(tubeGeo, tubeMat);
    this.trajectoryTube.name = 'TrajectoryTube';
    this.scene.add(this.trajectoryTube);

    // --- 3. Chalk Waypoint Markers (Target Rings & Delta-V Arrows) ---
    this.createWaypointMarkers(mission);
  }

  createWaypointMarkers(mission) {
    this.waypointGroup = new THREE.Group();
    this.waypointGroup.name = 'TrajectoryWaypoints';

    const waypoints = mission.waypoints || [
      { t: 0.15, label: 'EARTH DEPARTURE / TLI' },
      { t: 0.50, label: 'MID-COURSE BURN' },
      { t: 0.90, label: 'DESTINATION INSERTION' }
    ];

    waypoints.forEach(wp => {
      const pos = this.trajectoryCurve.getPointAt(wp.t);
      const tangent = this.trajectoryCurve.getTangentAt(wp.t);

      // Chalk target ring group aligned with curve
      const wpGroup = new THREE.Group();
      wpGroup.position.copy(pos);
      wpGroup.lookAt(pos.clone().add(tangent));

      // Concentric dashed rings
      const r1Geo = new THREE.RingGeometry(1.6, 1.75, 32);
      const r1Mat = new THREE.MeshBasicMaterial({
        color: mission.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const r1 = new THREE.Mesh(r1Geo, r1Mat);
      wpGroup.add(r1);

      const r2Geo = new THREE.RingGeometry(2.2, 2.32, 32);
      const r2Mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const r2 = new THREE.Mesh(r2Geo, r2Mat);
      wpGroup.add(r2);

      // Chalk Delta-V direction arrow cone pointing along flight tangent
      const arrowGeo = new THREE.ConeGeometry(0.35, 1.1, 10);
      arrowGeo.rotateX(Math.PI / 2);
      const arrowMat = new THREE.MeshBasicMaterial({
        color: mission.color
      });
      const arrow = new THREE.Mesh(arrowGeo, arrowMat);
      arrow.position.set(0, 0, 0.6);
      wpGroup.add(arrow);

      this.waypointGroup.add(wpGroup);

      // Floating billboard canvas sprite label
      const sprite = this.createLabelSprite(wp.label, mission.colorHex);
      sprite.position.copy(pos).add(new THREE.Vector3(0, 2.6, 0));
      this.waypointGroup.add(sprite);
    });

    this.scene.add(this.waypointGroup);
  }

  createLabelSprite(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Background pill
    ctx.fillStyle = 'rgba(6, 11, 26, 0.88)';
    ctx.strokeStyle = colorHex || '#38BDF8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(16, 16, 480, 96, 20);
    } else {
      ctx.rect(16, 16, 480, 96);
    }
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.font = 'bold 30px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(12, 3, 1);
    return sprite;
  }

  updateActiveTrail() {
    if (!this.trajectoryCurve || this.progress <= 0.015) {
      if (this.activeTrailMesh) this.activeTrailMesh.visible = false;
      return;
    }

    // Dynamic glowing trail drawn from t=0 to current progress
    const sampleCount = Math.max(8, Math.round(this.progress * 100));
    const trailPoints = [];
    for (let i = 0; i <= sampleCount; i++) {
      const u = (i / sampleCount) * this.progress;
      trailPoints.push(this.trajectoryCurve.getPointAt(u));
    }

    if (trailPoints.length >= 2) {
      const trailCurve = new THREE.CatmullRomCurve3(trailPoints, false, 'centripetal', 0.5);
      const geo = new THREE.TubeGeometry(trailCurve, sampleCount * 2, 0.5, 8, false);

      if (!this.activeTrailMesh) {
        const mat = new THREE.MeshStandardMaterial({
          color: (this.currentMission && this.currentMission.color) ? this.currentMission.color : 0x38bdf8,
          emissive: (this.currentMission && this.currentMission.color) ? this.currentMission.color : 0x38bdf8,
          emissiveIntensity: 1.8,
          roughness: 0.2,
          transparent: true,
          opacity: 0.85
        });
        this.activeTrailMesh = new THREE.Mesh(geo, mat);
        this.activeTrailMesh.name = 'ActiveTrajectoryTrail';
        this.scene.add(this.activeTrailMesh);
      } else {
        this.activeTrailMesh.geometry.dispose();
        this.activeTrailMesh.geometry = geo;
        this.activeTrailMesh.visible = true;
      }
    }
  }

  // --- 4. DOM HUD CREATION & EVENT LISTENERS ---
  createDOMElements() {
    let hud = document.getElementById('flight-telemetry-hud');
    if (!hud) {
      hud = document.createElement('aside');
      hud.id = 'flight-telemetry-hud';
      hud.className = 'flight-telemetry-hud';
      hud.innerHTML = `
        <div class="fth-header">
          <div class="fth-mission-info">
            <span id="fth-target-pill" class="fth-pill">MOON</span>
            <h3 id="fth-mission-title" class="fth-title">Apollo 11</h3>
            <div id="fth-callsign" class="fth-sub">Columbia & Eagle</div>
          </div>
          <button id="fth-cam-toggle" class="fth-icon-btn" title="Toggle Camera Mode">🎥 <span id="fth-cam-mode-text">FOLLOW</span></button>
        </div>

        <!-- Scrubber & Playback Controls -->
        <div class="fth-playback-card">
          <div class="fth-scrubber-row">
            <span class="fth-scrubber-time" id="fth-scrub-label">0%</span>
            <input type="range" id="fth-timeline-scrubber" min="0" max="1000" value="0" step="1" class="fth-scrubber-range">
            <span class="fth-scrubber-time">100%</span>
          </div>

          <div class="fth-controls-row">
            <button id="fth-btn-rewind" class="fth-ctrl-btn" title="Restart Voyage">⏮</button>
            <button id="fth-btn-play" class="fth-ctrl-btn active" title="Play / Pause">⏸</button>
            <div class="fth-speed-pills">
              <button class="fth-speed-btn" data-speed="0.5">0.5x</button>
              <button class="fth-speed-btn active" data-speed="1.0">1x</button>
              <button class="fth-speed-btn" data-speed="2.0">2x</button>
              <button class="fth-speed-btn" data-speed="5.0">5x</button>
            </div>
          </div>
        </div>

        <!-- Mission Phase Indicator Pill -->
        <div class="fth-phase-card">
          <div class="fth-phase-badge-row">
            <span class="fth-phase-dot"></span>
            <span id="fth-phase-indicator" class="fth-phase-indicator">PHASE 1: LIFTOFF & MAX-Q</span>
          </div>
          <p id="fth-phase-hazard" class="fth-phase-hazard">Vehicle ascending through dense atmosphere.</p>
        </div>

        <!-- Live Astrodynamics Metrics Grid -->
        <div class="fth-metrics-grid">
          <div class="fth-metric-box">
            <span class="fth-metric-label">DISTANCE FROM EARTH</span>
            <span id="fth-val-distance" class="fth-metric-val">12,450 km</span>
          </div>
          <div class="fth-metric-box">
            <span class="fth-metric-label">CURRENT VELOCITY</span>
            <span id="fth-val-speed" class="fth-metric-val">10.8 km/s</span>
          </div>
          <div class="fth-metric-box">
            <span class="fth-metric-label">RADIO LATENCY</span>
            <span id="fth-val-latency" class="fth-metric-val">0.04 sec</span>
          </div>
          <div class="fth-metric-box">
            <span class="fth-metric-label">PROPELLANT / BATTERY</span>
            <span id="fth-val-fuel" class="fth-metric-val">98%</span>
          </div>
        </div>

        <!-- Dynamic Hazard & Engineering Card -->
        <div class="fth-hazard-card">
          <div class="fth-hazard-title">MISSION HAZARD & ASTRODYNAMICS</div>
          <p id="fth-hazard-details" class="fth-hazard-text">Calculating orbital delta-v budget and trajectory correction maneuvers.</p>
        </div>

        <!-- Climax Memorial Hardware Card (Displayed at 100% arrival) -->
        <div id="fth-memorial-card" class="fth-memorial-card hidden">
          <div class="fth-memorial-header">
            <span class="fth-memorial-theme">WHERE THEY REMAIN</span>
            <h4 id="fth-memorial-site" class="fth-memorial-title">Mare Tranquillitatis</h4>
          </div>
          <div class="fth-memorial-meta">
            <div class="fth-memorial-row"><span>Coordinates:</span> <strong id="fth-mem-coords">0.674° N, 23.473° E</strong></div>
            <div class="fth-memorial-row"><span>Landing Date:</span> <strong id="fth-mem-date">July 20, 1969</strong></div>
            <div class="fth-memorial-row"><span>Operational Life:</span> <strong id="fth-mem-sols">21.6 hours</strong></div>
          </div>
          <p id="fth-mem-discard" class="fth-memorial-desc">Descent stage left resting on regolith.</p>
          <div class="fth-memorial-weathering">
            <strong>Space Weathering:</strong>
            <span id="fth-mem-weathering">Thermal swings, micro-meteorites.</span>
          </div>
          <div class="fth-memorial-actions">
            <button id="fth-btn-replay" class="fth-action-btn secondary">↺ Replay Launch</button>
            <button id="fth-btn-story" class="fth-action-btn primary">Explore Story →</button>
          </div>
        </div>
      `;
      document.body.appendChild(hud);
    }
    this.hudElement = hud;

    // Top-Left Exit Button
    let exitBar = document.getElementById('simulation-exit-bar');
    if (!exitBar) {
      exitBar = document.createElement('div');
      exitBar.id = 'simulation-exit-bar';
      exitBar.className = 'simulation-exit-bar';
      exitBar.innerHTML = `
        <button id="btn-exit-simulation" class="btn-exit-simulation">
          <span class="exit-icon">✕</span>
          <span>Exit Simulation</span>
          <kbd class="exit-kbd">Esc</kbd>
        </button>
        <div class="sim-brand-pill">
          <span class="sim-pulse-dot"></span>
          <span id="sim-mission-badge">APOLLO 11 • REPLAY</span>
        </div>
      `;
      document.body.appendChild(exitBar);
    }
    this.exitBtn = document.getElementById('btn-exit-simulation');

    this.bindHUDEvents();
  }

  bindHUDEvents() {
    if (this.exitBtn) {
      this.exitBtn.addEventListener('click', () => {
        this.stopSimulation();
      });
    }

    this.scrubberInput = document.getElementById('fth-timeline-scrubber');
    if (this.scrubberInput) {
      this.scrubberInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 1000;
        this.isHoldingBlastoff = false;
        this.setProgress(val);
      });
    }

    const playBtn = document.getElementById('fth-btn-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        playBtn.textContent = this.isPaused ? '▶' : '⏸';
        playBtn.classList.toggle('active', !this.isPaused);
      });
    }

    const rewindBtn = document.getElementById('fth-btn-rewind');
    if (rewindBtn) {
      rewindBtn.addEventListener('click', () => {
        this.isHoldingBlastoff = true;
        this.blastoffHoldTimer = this.blastoffHoldDuration;
        this.hasLanderPopped = false;
        this.setProgress(0.0);
      });
    }

    document.querySelectorAll('.fth-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fth-speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.timeMultiplier = parseFloat(btn.dataset.speed) || 1.0;
      });
    });

    const camBtn = document.getElementById('fth-cam-toggle');
    const camText = document.getElementById('fth-cam-mode-text');
    if (camBtn) {
      camBtn.addEventListener('click', () => {
        if (this.cameraMode === 'follow') {
          this.cameraMode = 'orbit';
          if (camText) camText.textContent = 'ORBIT';
        } else if (this.cameraMode === 'orbit') {
          this.cameraMode = 'solar';
          if (camText) camText.textContent = 'SOLAR';
        } else {
          this.cameraMode = 'follow';
          if (camText) camText.textContent = 'FOLLOW';
        }
      });
    }

    const replayBtn = document.getElementById('fth-btn-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.isHoldingBlastoff = true;
        this.blastoffHoldTimer = this.blastoffHoldDuration;
        this.hasLanderPopped = false;
        this.setProgress(0.0);
      });
    }

    const storyBtn = document.getElementById('fth-btn-story');
    if (storyBtn) {
      storyBtn.addEventListener('click', () => {
        const missionName = this.currentMission ? this.currentMission.name : '';
        this.stopSimulation();
        if (window.navigationShell) {
          window.navigationShell.switchView('archive', { search: missionName });
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (this.isActive && e.key === 'Escape') {
        this.stopSimulation();
      }
    });
  }

  // --- 5. LAUNCH MISSION (MAIN ENTRY POINT) ---
  launchMission(missionId) {
    const mission = this.missions[missionId] || this.missions['apollo-11'];
    this.currentMission = mission;
    this.isActive = true;
    this.progress = 0.0;
    this.isPaused = false;
    this.isStaged = false;
    this.hasLanderPopped = false;
    this.cameraMode = 'follow';

    // 1. Disable Camera Orbit Conflicts
    this.app.focusedObject = null;
    this.app.isTracking = false;
    this.wasAppPaused = this.app.isPaused;
    this.app.isPaused = true; // Lock planetary positions during flight simulation

    // 2. Setup Blastoff Hold (1.8s build-up on pad)
    this.isHoldingBlastoff = true;
    this.blastoffHoldTimer = this.blastoffHoldDuration;

    // 3. Collapse any 2D modal / catalog views to orbit
    if (window.navigationShell) {
      window.navigationShell.switchView('explore');
    }

    // 4. Show flight telemetry HUD and exit bar
    document.body.classList.add('in-trajectory-simulation');
    if (this.hudElement) this.hudElement.classList.add('active');
    const exitBar = document.getElementById('simulation-exit-bar');
    if (exitBar) exitBar.classList.add('active');

    // 5. Update Mission Badge
    const badge = document.getElementById('sim-mission-badge');
    if (badge) badge.textContent = `${mission.name.toUpperCase()} • 3D TRAJECTORY`;

    // 6. Generate chalk-drawn 3D trajectory curve in solar system
    this.generateMissionSpline(mission);

    // 7. Reset rocket position
    this.rocketGroup.visible = true;
    this.setProgress(0.0);

    // 8. Stage A (Earth Blast-off Tight Framing):
    // Smoothly tween camera to a tight, dramatic view of Earth and launchpad
    const earthObj = this.app.planets['Earth'];
    if (earthObj && earthObj.mesh) {
      const earthPos = new THREE.Vector3();
      earthObj.mesh.getWorldPosition(earthPos);

      const destCam = new THREE.Vector3(earthPos.x + 2.8, earthPos.y + 5.2, earthPos.z + 3.8);
      const destTarget = new THREE.Vector3(earthPos.x, earthPos.y + 4.0, earthPos.z);

      if (window.TWEEN) {
        new TWEEN.Tween(this.camera.position)
          .to(destCam, 1400)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();

        new TWEEN.Tween(this.controls.target)
          .to(destTarget, 1400)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();
      } else {
        this.camera.position.copy(destCam);
        this.controls.target.copy(destTarget);
      }
    }

    if (this.app.soundEngine && typeof this.app.soundEngine.playUI === 'function') {
      this.app.soundEngine.playUI('confirm');
    }

    this.updateHUDDisplay();
  }

  // --- 6. PROGRESS & SCRUBBING ---
  setProgress(t) {
    if (t > 0.001) {
      this.isHoldingBlastoff = false;
    }
    this.progress = THREE.MathUtils.clamp(t, 0.0, 1.0);
    if (this.scrubberInput) {
      this.scrubberInput.value = Math.round(this.progress * 1000);
    }
    const scrubLabel = document.getElementById('fth-scrub-label');
    if (scrubLabel) {
      scrubLabel.textContent = `${(this.progress * 100).toFixed(0)}%`;
    }

    this.updateRocketTransform();
    this.updateActiveTrail();
    this.updateHUDDisplay();
  }

  updateRocketTransform() {
    if (!this.trajectoryCurve || !this.rocketGroup) return;

    // Get current 3D position along curve
    const pos = this.trajectoryCurve.getPointAt(this.progress);
    this.rocketGroup.position.copy(pos);

    // Orient rocket tangent to curve direction
    const tangent = this.trajectoryCurve.getTangentAt(Math.min(this.progress + 0.005, 1.0));
    const lookTarget = pos.clone().add(tangent);
    this.rocketGroup.lookAt(lookTarget);

    // Rotate so nosecone (+Y) points along the forward flight tangent
    this.rocketGroup.rotateX(Math.PI / 2);

    // Dynamic Chalk Flame Puffs Animation (pulsing cartoon teardrops)
    const isEngineFiring = this.progress < 0.95;
    if (this.flamePuff1 && this.flamePuff2 && this.flamePuff3) {
      this.flamePuff1.visible = isEngineFiring;
      this.flamePuff2.visible = isEngineFiring;
      this.flamePuff3.visible = isEngineFiring;

      if (isEngineFiring) {
        const pulse = 1.0 + Math.sin(Date.now() * 0.035) * 0.35;
        this.flamePuff1.scale.set(pulse, pulse * (1.1 + Math.random() * 0.25), pulse);
        this.flamePuff2.scale.set(pulse * 0.85, pulse * 0.95, pulse * 0.85);
        this.flamePuff3.position.y = -1.65 - Math.sin(Date.now() * 0.04) * 0.15;
      }
    }

    // Destination Chalk Landing Beacon & Pop-up Lander
    if (this.landingBeacon) {
      const showLanding = this.progress >= 0.90;
      this.landingBeacon.visible = showLanding;
      if (showLanding && this.trajectoryPoints.length > 0) {
        const destPos = this.trajectoryPoints[this.trajectoryPoints.length - 1];
        this.landingBeacon.position.copy(destPos);

        // Trigger Pop-up Lander bounce animation
        if (!this.hasLanderPopped && window.TWEEN && this.chalkLander) {
          this.hasLanderPopped = true;
          this.chalkLander.scale.set(0.001, 0.001, 0.001);
          new TWEEN.Tween(this.chalkLander.scale)
            .to({ x: 1, y: 1, z: 1 }, 700)
            .easing(TWEEN.Easing.Back.Out)
            .start();
        }
      } else {
        this.hasLanderPopped = false;
        if (this.chalkLander) this.chalkLander.scale.set(0.001, 0.001, 0.001);
      }
    }
  }

  // --- 7. ANIMATION TICK (Called from script.js animate loop) ---
  update(delta) {
    if (!this.isActive) return;

    // Handle initial Blast-off Hold at launchpad
    if (this.isHoldingBlastoff) {
      this.blastoffHoldTimer -= delta;
      this.setProgress(0.0);
      this.emitChalkDustPuffs(delta);

      if (this.blastoffHoldTimer <= 0) {
        this.isHoldingBlastoff = false;
      }
    } else if (!this.isPaused && this.progress < 1.0) {
      // Advance flight progress along spline at paced simSpeed
      const step = (this.simSpeed * this.timeMultiplier * delta);
      this.setProgress(this.progress + step);
    }

    // Emit trailing chalk dust puffs while cruising
    if (this.progress > 0.0 && this.progress < 0.95 && !this.isPaused) {
      this.emitChalkDustPuffs(delta);
    }

    // Update chalk dust particles
    if (this.particles) {
      this.particles.forEach(p => {
        if (!p.visible) return;
        p.userData.life += delta;
        if (p.userData.life >= p.userData.maxLife) {
          p.visible = false;
        } else {
          p.position.addScaledVector(p.userData.vel, delta);
          const lifeFraction = p.userData.life / p.userData.maxLife;
          p.material.opacity = (1.0 - lifeFraction) * 0.8;
          p.scale.setScalar(1.0 + lifeFraction * 2.2);
        }
      });
    }

    // Tight Camera Follow
    this.updateCameraFollow(delta);
  }

  emitChalkDustPuffs(delta) {
    if (!this.particles || !this.rocketGroup) return;
    const pos = this.rocketGroup.position;
    for (let i = 0; i < 2; i++) {
      const p = this.particles[Math.floor(Math.random() * this.particles.length)];
      if (p && !p.visible) {
        p.visible = true;
        p.position.copy(pos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        ));
        p.userData.life = 0;
        p.userData.maxLife = 0.85;
        p.userData.vel.set(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8
        );
      }
    }
  }

  // --- 8. TIGHT CHASE CAMERA FRAMING ---
  updateCameraFollow(delta) {
    if (!this.rocketGroup || !this.rocketGroup.visible) return;

    const rocketPos = this.rocketGroup.position;

    if (this.cameraMode === 'follow') {
      if (this.isHoldingBlastoff || this.progress < 0.08) {
        // Stage A (Earth Blast-off): Tight dramatic view on Earth surface launchpad
        const earthObj = this.app.planets['Earth'];
        const earthPos = new THREE.Vector3();
        if (earthObj && earthObj.mesh) earthObj.mesh.getWorldPosition(earthPos);
        else earthPos.set(95, 0, 0);

        const stageAPos = new THREE.Vector3(earthPos.x + 2.8, earthPos.y + 5.2, earthPos.z + 3.8);
        this.camera.position.lerp(stageAPos, 0.06);
        this.controls.target.lerp(rocketPos, 0.12);

      } else if (this.progress >= 0.90) {
        // Stage C (Arrival & Landing Site Climax): Tight framing on destination landing site
        if (this.trajectoryPoints.length > 0) {
          const destPos = this.trajectoryPoints[this.trajectoryPoints.length - 1];
          const destCamOffset = new THREE.Vector3(3.2, 2.4, 3.6);
          const desiredDestCam = destPos.clone().add(destCamOffset);

          this.camera.position.lerp(desiredDestCam, 0.06);
          this.controls.target.lerp(destPos, 0.08);
        }

      } else {
        // Stage B (Interplanetary Chase Cam): Tight chase view locked behind miniature rocket
        const tangent = this.trajectoryCurve.getTangentAt(Math.min(this.progress + 0.005, 1.0));
        const camOffset = tangent.clone().negate().multiplyScalar(3.8).add(new THREE.Vector3(0, 1.4, 0));
        const desiredCamPos = rocketPos.clone().add(camOffset);

        this.camera.position.lerp(desiredCamPos, 0.08);
        this.controls.target.lerp(rocketPos, 0.15);
      }

    } else if (this.cameraMode === 'orbit') {
      // OrbitControls target locked on miniature rocket, user can freely rotate around it
      this.controls.target.lerp(rocketPos, 0.15);

    } else if (this.cameraMode === 'solar') {
      // Wide overview of entire solar system showing full trajectory ribbon
      const solarTarget = new THREE.Vector3(0, 0, 0);
      this.controls.target.lerp(solarTarget, 0.05);
    }
  }

  // --- 9. HUD METRICS & PHASES SYNCHRONIZATION ---
  updateHUDDisplay() {
    const mission = this.currentMission;
    if (!mission) return;

    // Header info
    const titleEl = document.getElementById('fth-mission-title');
    const callsignEl = document.getElementById('fth-callsign');
    const targetPillEl = document.getElementById('fth-target-pill');

    if (titleEl) titleEl.textContent = mission.name;
    if (callsignEl) callsignEl.textContent = mission.callsign;
    if (targetPillEl) {
      targetPillEl.textContent = mission.targetBody.toUpperCase();
      targetPillEl.style.borderColor = mission.colorHex;
      targetPillEl.style.color = mission.colorHex;
    }

    // Determine active flight phase
    let activePhase = mission.phases[0];
    for (let i = 0; i < mission.phases.length; i++) {
      if (this.progress <= mission.phases[i].threshold) {
        activePhase = mission.phases[i];
        break;
      }
    }

    const phaseIndEl = document.getElementById('fth-phase-indicator');
    const phaseHazEl = document.getElementById('fth-phase-hazard');
    const hazDetEl = document.getElementById('fth-hazard-details');

    if (phaseIndEl) {
      if (this.isHoldingBlastoff) {
        phaseIndEl.textContent = 'PHASE 1: ENGINES IGNITING (T-0)';
      } else {
        phaseIndEl.textContent = activePhase.name;
      }
    }
    if (phaseHazEl) phaseHazEl.textContent = activePhase.hazard;
    if (hazDetEl) hazDetEl.textContent = activePhase.details;

    // Live Metrics calculations
    const distValEl = document.getElementById('fth-val-distance');
    const speedValEl = document.getElementById('fth-val-speed');
    const latencyValEl = document.getElementById('fth-val-latency');
    const fuelValEl = document.getElementById('fth-val-fuel');

    const currentDistKm = mission.distanceTotalKm * this.progress;
    if (distValEl) {
      if (currentDistKm >= 1e9) {
        distValEl.textContent = `${(currentDistKm / 1e9).toFixed(3)}B km (${(currentDistKm / 1.496e8).toFixed(2)} AU)`;
      } else if (currentDistKm >= 1e6) {
        distValEl.textContent = `${(currentDistKm / 1e6).toFixed(2)}M km`;
      } else {
        distValEl.textContent = `${Math.round(currentDistKm).toLocaleString()} km`;
      }
    }

    // Speed profile
    const speedProfile = mission.maxVelocityKmS * (0.4 + 0.6 * Math.sin(this.progress * Math.PI));
    if (speedValEl) speedValEl.textContent = `${speedProfile.toFixed(1)} km/s`;

    // Radio latency (light speed = 300,000 km/s)
    const latencySec = currentDistKm / 300000;
    if (latencyValEl) {
      if (latencySec < 60) {
        latencyValEl.textContent = `${latencySec.toFixed(2)} sec`;
      } else {
        const mins = Math.floor(latencySec / 60);
        const secs = Math.round(latencySec % 60);
        latencyValEl.textContent = `${mins}m ${secs}s`;
      }
    }

    // Fuel remaining
    const fuelPct = Math.max(0, Math.round(100 - (this.progress * 82)));
    if (fuelValEl) fuelValEl.textContent = `${fuelPct}%`;

    // Memorial Hardware Card Display (when progress >= 90%)
    const memorialCard = document.getElementById('fth-memorial-card');
    if (memorialCard) {
      const isLanded = this.progress >= 0.90;
      memorialCard.classList.toggle('hidden', !isLanded);

      if (isLanded) {
        const siteEl = document.getElementById('fth-memorial-site');
        const coordsEl = document.getElementById('fth-mem-coords');
        const dateEl = document.getElementById('fth-mem-date');
        const solsEl = document.getElementById('fth-mem-sols');
        const descEl = document.getElementById('fth-mem-discard');
        const weatherEl = document.getElementById('fth-mem-weathering');

        if (siteEl) siteEl.textContent = mission.landingSite;
        if (coordsEl) coordsEl.textContent = mission.landingCoords;
        if (dateEl) dateEl.textContent = mission.landingDate;
        if (solsEl) solsEl.textContent = mission.solsActive;
        if (descEl) descEl.textContent = mission.discardReason;
        if (weatherEl) weatherEl.textContent = mission.weatheringInfo;
      }
    }
  }

  // --- 10. CLEAN EXIT & RESTORE ORBIT ---
  stopSimulation() {
    this.isActive = false;
    this.isPaused = true;
    this.isHoldingBlastoff = false;
    this.hasLanderPopped = false;

    // Hide rocket and markers
    if (this.rocketGroup) this.rocketGroup.visible = false;
    if (this.landingBeacon) this.landingBeacon.visible = false;
    if (this.chalkDashedLine) this.chalkDashedLine.visible = false;
    if (this.trajectoryTube) this.trajectoryTube.visible = false;
    if (this.activeTrailMesh) this.activeTrailMesh.visible = false;
    if (this.waypointGroup) this.waypointGroup.visible = false;

    if (this.particles) {
      this.particles.forEach(p => p.visible = false);
    }

    // Restore planetary orbits
    if (this.wasAppPaused !== undefined) {
      this.app.isPaused = this.wasAppPaused;
    }

    // Hide simulation HUDs
    document.body.classList.remove('in-trajectory-simulation');
    if (this.hudElement) this.hudElement.classList.remove('active');
    const exitBar = document.getElementById('simulation-exit-bar');
    if (exitBar) exitBar.classList.remove('active');

    // Smoothly reset camera to default solar system overview
    if (this.app && typeof this.app.resetCamera === 'function') {
      this.app.resetCamera();
    }

    if (this.app.soundEngine && typeof this.app.soundEngine.playUI === 'function') {
      this.app.soundEngine.playUI('close');
    }
  }
}

// Global initialization bridge
if (typeof window !== 'undefined') {
  window.TrajectorySimulator = TrajectorySimulator;
}
