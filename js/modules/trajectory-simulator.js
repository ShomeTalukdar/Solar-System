/**
 * CINEMATIC 3D TRAJECTORY SIMULATOR (Three.js)
 * High-fidelity, stylized cartoon rocket & interplanetary trajectory visualizer.
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
    this.simSpeed = 0.08; // Base progress speed per second
    this.timeMultiplier = 1.0;
    this.isPaused = false;
    this.cameraMode = 'follow'; // 'follow', 'orbit', 'solar'

    // Visual elements
    this.rocketGroup = null;
    this.flameMesh = null;
    this.flameCore = null;
    this.particlesGroup = null;
    this.trajectoryTube = null;
    this.trajectoryCurve = null;
    this.trajectoryPoints = [];
    this.landingBeacon = null;
    this.stagedBooster = null;
    this.isStaged = false;
    this.activeLander = null;

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
        color: 0xf97316,
        colorHex: '#F97316',
        accentColor: '#F97316',
        landingSite: 'Jezero Crater',
        landingCoords: '18.38° N, 77.58° E',
        landingDate: 'February 18, 2021',
        solsActive: '1,300+ Sols (Active Mission)',
        discardReason: 'The cruise stage, aeroshell heatshield, supersonic parachute, and rocket-powered skycrane were intentionally jettisoned during the 7 Minutes of Terror.',
        weatheringInfo: 'Martian dust storms, atmospheric dust devils, and intense perchlorate chemical oxidizers in the regolith continually weather the hardware.',
        legacy: 'Cached 24 hermetically sealed rock cores for the future Mars Sample Return mission and hosted Ingenuity, the first powered aircraft on an alien planet.',
        distanceTotalKm: 470000000,
        transitDurationStr: '6 Months, 20 Days',
        maxVelocityKmS: 24.6,
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
        color: 0xa855f7,
        colorHex: '#A855F7',
        accentColor: '#A855F7',
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
        color: 0x10b981,
        colorHex: '#10B981',
        accentColor: '#10B981',
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
        color: 0xf59e0b,
        colorHex: '#F59E0B',
        accentColor: '#F59E0B',
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

  // --- 1. PROCEDURAL 3D CARTOON ROCKET & FLAME MESH ---
  createProceduralRocket() {
    this.rocketGroup = new THREE.Group();
    this.rocketGroup.name = 'TrajectoryRocketGroup';

    // Cel-shaded / toon material matching solar system aesthetic
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.15
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.25,
      metalness: 0.2
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.4
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.85,
      roughness: 0.2
    });

    // 1. Fuselage cylinder
    const fuselageGeo = new THREE.CylinderGeometry(0.42, 0.55, 2.6, 16);
    const fuselage = new THREE.Mesh(fuselageGeo, bodyMat);
    fuselage.castShadow = true;
    this.rocketGroup.add(fuselage);

    // Red racing stripe
    const stripeGeo = new THREE.CylinderGeometry(0.47, 0.47, 0.35, 16);
    const stripe = new THREE.Mesh(stripeGeo, accentMat);
    stripe.position.y = 0.4;
    this.rocketGroup.add(stripe);

    // 2. Conical Nosecone
    const noseGeo = new THREE.ConeGeometry(0.42, 1.1, 16);
    const nose = new THREE.Mesh(noseGeo, accentMat);
    nose.position.y = 1.85;
    this.rocketGroup.add(nose);

    // Tip needle
    const needleGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.5, 8);
    const needle = new THREE.Mesh(needleGeo, darkMat);
    needle.position.y = 2.5;
    this.rocketGroup.add(needle);

    // 3. Four Cartoon Aerodynamic Fins
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.65, -0.4);
    finShape.lineTo(0.55, -0.85);
    finShape.lineTo(0, -0.65);
    finShape.closePath();

    const extrudeSettings = { depth: 0.06, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);

    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeo, accentMat);
      fin.rotation.y = (i * Math.PI) / 2;
      fin.position.y = -0.55;
      this.rocketGroup.add(fin);
    }

    // 4. Rocket Engine Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.18, 0.42, 0.55, 14, 1, true);
    const nozzle = new THREE.Mesh(nozzleGeo, darkMat);
    nozzle.position.y = -1.55;
    this.rocketGroup.add(nozzle);

    // 5. Cartoon Flame Cone & Emissive Core
    const flameGeo = new THREE.ConeGeometry(0.38, 1.8, 12);
    flameGeo.translate(0, -0.9, 0);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.85
    });
    this.flameMesh = new THREE.Mesh(flameGeo, flameMat);
    this.flameMesh.position.y = -1.55;
    this.rocketGroup.add(this.flameMesh);

    // Inner bright cyan/white core
    const coreGeo = new THREE.ConeGeometry(0.2, 1.1, 10);
    coreGeo.translate(0, -0.55, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95
    });
    this.flameCore = new THREE.Mesh(coreGeo, coreMat);
    this.flameCore.position.y = -1.55;
    this.rocketGroup.add(this.flameCore);

    // Scale rocket to fit Solar System scene proportions
    this.rocketGroup.scale.setScalar(1.2);
    this.rocketGroup.visible = false;
    this.scene.add(this.rocketGroup);

    // 6. Thrust Particle Smoke Puffs
    this.createSmokeParticleSystem();

    // 7. Landing Beacon Marker
    this.createLandingBeacon();
  }

  createSmokeParticleSystem() {
    this.particlesGroup = new THREE.Group();
    this.particles = [];
    const count = 35;
    const geo = new THREE.SphereGeometry(0.18, 6, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });

    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(geo, mat.clone());
      p.visible = false;
      p.userData = {
        life: 0,
        maxLife: 1.0,
        vel: new THREE.Vector3()
      };
      this.particlesGroup.add(p);
      this.particles.push(p);
    }
    this.scene.add(this.particlesGroup);
  }

  createLandingBeacon() {
    this.landingBeacon = new THREE.Group();
    this.landingBeacon.name = 'TrajectoryLandingBeacon';

    // Glowing target ring
    const ringGeo = new THREE.RingGeometry(0.8, 1.1, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    this.landingBeacon.add(ring);

    // Vertical holographic laser column
    const laserGeo = new THREE.CylinderGeometry(0.08, 0.08, 7.0, 10);
    laserGeo.translate(0, 3.5, 0);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55
    });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    this.landingBeacon.add(laser);

    // Top pulsing diamond
    const diamondGeo = new THREE.OctahedronGeometry(0.5, 0);
    diamondGeo.translate(0, 7.2, 0);
    const diamondMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.beaconDiamond = new THREE.Mesh(diamondGeo, diamondMat);
    this.landingBeacon.add(this.beaconDiamond);

    this.landingBeacon.visible = false;
    this.scene.add(this.landingBeacon);
  }

  // --- 2. TRAJECTORY SPLINE GENERATOR ---
  generateMissionSpline(mission) {
    if (this.trajectoryTube) {
      this.scene.remove(this.trajectoryTube);
      this.trajectoryTube.geometry.dispose();
      this.trajectoryTube.material.dispose();
      this.trajectoryTube = null;
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

      // Point 1: Launch Pad on Earth
      points.push(earthPos.clone().add(new THREE.Vector3(0, 3.9, 0)));
      // Point 2: Low Earth Orbit (LEO)
      points.push(earthPos.clone().add(new THREE.Vector3(5, 5, 2)));
      // Point 3: Translunar Injection coast
      const mid1 = new THREE.Vector3().lerpVectors(earthPos, moonPos, 0.45).add(new THREE.Vector3(0, 4, 3));
      points.push(mid1);
      // Point 4: Approaching Moon gravity well
      const mid2 = new THREE.Vector3().lerpVectors(earthPos, moonPos, 0.8).add(new THREE.Vector3(0, -2, -1.5));
      points.push(mid2);
      // Point 5: Lunar Orbit insertion & descent
      points.push(moonPos.clone().add(new THREE.Vector3(-1.2, 1.5, 0.8)));
      // Point 6: Touchdown at Tranquility Base
      points.push(moonPos.clone().add(new THREE.Vector3(0, 1.05, 0)));

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
      points.push(earthPos.clone().add(new THREE.Vector3(8, 6, 6)));
      // Point 3 & 4: The wide heliocentric ellipse sweeping outwards across solar system
      const rEarth = earthPos.length();
      const rMars = marsPos.length();
      const sunCenter = new THREE.Vector3(0, 0, 0);

      const angleEarth = Math.atan2(earthPos.z, earthPos.x);
      const angleMars = Math.atan2(marsPos.z, marsPos.x);

      // Arc spanning heliocentric angles
      const steps = 7;
      for (let s = 1; s <= steps; s++) {
        const frac = s / (steps + 1);
        const currentAngle = angleEarth + (angleMars - angleEarth) * frac;
        const currentRadius = THREE.MathUtils.lerp(rEarth, rMars, Math.sin((frac * Math.PI) / 2));
        const yOffset = Math.sin(frac * Math.PI) * 7.5; // slight orbital inclination out of ecliptic plane
        points.push(new THREE.Vector3(
          Math.cos(currentAngle) * currentRadius,
          yOffset,
          Math.sin(currentAngle) * currentRadius
        ));
      }

      // Approach Mars entry interface
      points.push(marsPos.clone().add(new THREE.Vector3(-4, 5, -3)));
      // Parachute & Skycrane descent
      points.push(marsPos.clone().add(new THREE.Vector3(0, 2.9, 0)));

    } else if (mission.id === 'voyager-1') {
      // Earth -> Jupiter Gravity Assist -> Saturn Gravity Assist -> Interstellar Hyperbolic Escape
      const jupObj = this.app.planets['Jupiter'];
      const satObj = this.app.planets['Saturn'];

      const jupPos = (jupObj && jupObj.mesh) ? jupObj.mesh.position.clone() : new THREE.Vector3(195, 0, 0);
      const satPos = (satObj && satObj.mesh) ? satObj.mesh.position.clone() : new THREE.Vector3(255, 0, 0);

      points.push(earthPos.clone().add(new THREE.Vector3(0, 4.0, 0)));
      points.push(earthPos.clone().add(new THREE.Vector3(12, 8, 8)));
      points.push(new THREE.Vector3().lerpVectors(earthPos, jupPos, 0.5).add(new THREE.Vector3(0, 6, -10)));
      // Jupiter slingshot flyby point
      points.push(jupPos.clone().add(new THREE.Vector3(-14, 8, 12)));
      // Transit to Saturn
      points.push(new THREE.Vector3().lerpVectors(jupPos, satPos, 0.5).add(new THREE.Vector3(0, 18, -15)));
      // Saturn slingshot deflection out of ecliptic
      points.push(satPos.clone().add(new THREE.Vector3(-12, 22, -18)));
      // Interstellar outward vector
      points.push(satPos.clone().add(new THREE.Vector3(90, 85, -120)));
      points.push(satPos.clone().add(new THREE.Vector3(180, 160, -240)));

    } else {
      // Default Interplanetary Arc
      points.push(earthPos.clone().add(new THREE.Vector3(0, 4.0, 0)));
      points.push(earthPos.clone().add(new THREE.Vector3(15, 10, 10)));
      points.push(new THREE.Vector3(140, 18, 40));
      points.push(new THREE.Vector3(200, 25, 80));
    }

    this.trajectoryCurve = new THREE.CatmullRomCurve3D(points, false, 'centripetal', 0.5);
    this.trajectoryPoints = points;

    // Build glowing 3D trajectory tube
    const tubeGeo = new THREE.TubeGeometry(this.trajectoryCurve, 180, 0.28, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: mission.color,
      emissive: mission.color,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.65
    });

    this.trajectoryTube = new THREE.Mesh(tubeGeo, tubeMat);
    this.trajectoryTube.name = 'TrajectoryTube';
    this.scene.add(this.trajectoryTube);
  }

  // --- 3. DOM HUD CREATION & EVENT LISTENERS ---
  createDOMElements() {
    // 1. Right-side Flight Telemetry HUD
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

    // 2. Top-Left Exit Button
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
    // Exit simulation
    if (this.exitBtn) {
      this.exitBtn.addEventListener('click', () => {
        this.stopSimulation();
      });
    }

    // Scrubber input
    this.scrubberInput = document.getElementById('fth-timeline-scrubber');
    if (this.scrubberInput) {
      this.scrubberInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 1000;
        this.setProgress(val);
      });
    }

    // Play/Pause button
    const playBtn = document.getElementById('fth-btn-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        playBtn.textContent = this.isPaused ? '▶' : '⏸';
        playBtn.classList.toggle('active', !this.isPaused);
      });
    }

    // Rewind / restart
    const rewindBtn = document.getElementById('fth-btn-rewind');
    if (rewindBtn) {
      rewindBtn.addEventListener('click', () => {
        this.setProgress(0.0);
      });
    }

    // Speed buttons
    document.querySelectorAll('.fth-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fth-speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.timeMultiplier = parseFloat(btn.dataset.speed) || 1.0;
      });
    });

    // Camera toggle mode
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

    // Memorial Card buttons
    const replayBtn = document.getElementById('fth-btn-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
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

    // Global Esc shortcut to exit simulation
    window.addEventListener('keydown', (e) => {
      if (this.isActive && e.key === 'Escape') {
        this.stopSimulation();
      }
    });
  }

  // --- 4. LAUNCH MISSION (MAIN ENTRY POINT) ---
  launchMission(missionId) {
    const mission = this.missions[missionId] || this.missions['apollo-11'];
    this.currentMission = mission;
    this.isActive = true;
    this.progress = 0.0;
    this.isPaused = false;
    this.isStaged = false;
    this.cameraMode = 'follow';

    // 1. Collapse any 2D modal / catalog views to orbit
    if (window.navigationShell) {
      window.navigationShell.switchView('explore');
    }

    // 2. Hide standard orbit docks and show flight telemetry HUD
    document.body.classList.add('in-trajectory-simulation');
    if (this.hudElement) this.hudElement.classList.add('active');
    const exitBar = document.getElementById('simulation-exit-bar');
    if (exitBar) exitBar.classList.add('active');

    // 3. Update Mission Badge
    const badge = document.getElementById('sim-mission-badge');
    if (badge) badge.textContent = `${mission.name.toUpperCase()} • 3D TRAJECTORY`;

    // 4. Generate 3D trajectory curve in solar system
    this.generateMissionSpline(mission);

    // 5. Position rocket at initial trajectory point (Earth launch site)
    this.rocketGroup.visible = true;
    this.setProgress(0.0);

    // 6. Smoothly zoom camera directly in on Earth for blastoff!
    const earthObj = this.app.planets['Earth'];
    if (earthObj && earthObj.mesh) {
      const earthPos = new THREE.Vector3();
      earthObj.mesh.getWorldPosition(earthPos);

      if (window.TWEEN) {
        new TWEEN.Tween(this.camera.position)
          .to({ x: earthPos.x + 10, y: earthPos.y + 7, z: earthPos.z + 14 }, 1400)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();

        new TWEEN.Tween(this.controls.target)
          .to({ x: earthPos.x, y: earthPos.y, z: earthPos.z }, 1400)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();
      }
    }

    // Play confirm chime
    if (this.app.soundEngine && typeof this.app.soundEngine.playUI === 'function') {
      this.app.soundEngine.playUI('confirm');
    }

    // Initial HUD update
    this.updateHUDDisplay();
  }

  // --- 5. PROGRESS & SCRUBBING ---
  setProgress(t) {
    this.progress = THREE.MathUtils.clamp(t, 0.0, 1.0);
    if (this.scrubberInput) {
      this.scrubberInput.value = Math.round(this.progress * 1000);
    }
    const scrubLabel = document.getElementById('fth-scrub-label');
    if (scrubLabel) {
      scrubLabel.textContent = `${(this.progress * 100).toFixed(0)}%`;
    }

    this.updateRocketTransform();
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

    // Rotate so nosecone (+Y) points along the forward tangent
    this.rocketGroup.rotateX(Math.PI / 2);

    // Pulsing flame animation (engine firing during ascent and cruise burns)
    const isEngineFiring = this.progress < 0.95;
    if (this.flameMesh && this.flameCore) {
      this.flameMesh.visible = isEngineFiring;
      this.flameCore.visible = isEngineFiring;

      if (isEngineFiring) {
        const pulse = 1.0 + Math.sin(Date.now() * 0.02) * 0.25;
        this.flameMesh.scale.set(pulse, pulse * (1.0 + Math.random() * 0.2), pulse);
        this.flameCore.scale.set(pulse * 0.8, pulse * 0.9, pulse * 0.8);
      }
    }

    // Check Staging effect at t ~ 0.18
    if (this.progress >= 0.18 && !this.isStaged) {
      this.isStaged = true;
      this.triggerBoosterSeparation(pos);
    }

    // Check Landing Site Pin at t >= 0.96
    if (this.landingBeacon) {
      const showLanding = this.progress >= 0.90;
      this.landingBeacon.visible = showLanding;
      if (showLanding && this.trajectoryPoints.length > 0) {
        const destPos = this.trajectoryPoints[this.trajectoryPoints.length - 1];
        this.landingBeacon.position.copy(destPos);
      }
    }
  }

  triggerBoosterSeparation(position) {
    if (!this.particles) return;
    // Emit particle smoke puffs
    this.particles.forEach((p, idx) => {
      p.visible = true;
      p.position.copy(position).add(new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      ));
      p.userData.life = 0;
      p.userData.maxLife = 0.8 + Math.random() * 0.5;
      p.userData.vel.set(
        (Math.random() - 0.5) * 2.0,
        (Math.random() - 0.5) * 2.0,
        (Math.random() - 0.5) * 2.0
      );
    });
  }

  // --- 6. ANIMATION TICK (Called from script.js animate loop) ---
  update(delta) {
    if (!this.isActive) return;

    // Advance flight progress along spline if not paused
    if (!this.isPaused && this.progress < 1.0) {
      const step = (this.simSpeed * this.timeMultiplier * delta);
      this.setProgress(this.progress + step);
    }

    // Update smoke particles
    if (this.particles) {
      this.particles.forEach(p => {
        if (!p.visible) return;
        p.userData.life += delta;
        if (p.userData.life >= p.userData.maxLife) {
          p.visible = false;
        } else {
          p.position.addScaledVector(p.userData.vel, delta);
          const lifeFraction = p.userData.life / p.userData.maxLife;
          p.material.opacity = (1.0 - lifeFraction) * 0.6;
          p.scale.setScalar(1.0 + lifeFraction * 2.5);
        }
      });
    }

    // Pulse landing beacon diamond
    if (this.beaconDiamond && this.landingBeacon && this.landingBeacon.visible) {
      this.beaconDiamond.rotation.y += 0.04;
      const pulse = 1.0 + Math.sin(Date.now() * 0.005) * 0.15;
      this.beaconDiamond.scale.setScalar(pulse);
    }

    // Camera follow behavior
    this.updateCameraFollow(delta);
  }

  updateCameraFollow(delta) {
    if (!this.rocketGroup || !this.rocketGroup.visible) return;

    const rocketPos = this.rocketGroup.position;

    if (this.cameraMode === 'follow') {
      // Smooth chase camera locked right behind rocket
      const camOffset = new THREE.Vector3(0, 4.5, 12.0);
      if (this.trajectoryCurve) {
        const tangent = this.trajectoryCurve.getTangentAt(this.progress);
        camOffset.copy(tangent).negate().multiplyScalar(10).add(new THREE.Vector3(0, 4, 0));
      }

      const desiredCamPos = rocketPos.clone().add(camOffset);
      this.camera.position.lerp(desiredCamPos, 0.08);
      this.controls.target.lerp(rocketPos, 0.12);

    } else if (this.cameraMode === 'orbit') {
      // OrbitControls target follows rocket, user can rotate freely
      this.controls.target.lerp(rocketPos, 0.15);

    } else if (this.cameraMode === 'solar') {
      // Wide overview of entire solar system showing the full trajectory ribbon
      const solarTarget = new THREE.Vector3(0, 0, 0);
      this.controls.target.lerp(solarTarget, 0.05);
    }
  }

  // --- 7. HUD METRICS & PHASES SYNCHRONIZATION ---
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

    // Determine active flight phase based on progress threshold
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

    if (phaseIndEl) phaseIndEl.textContent = activePhase.name;
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

    // Speed curve (peaks at injection, minimum at mid-course, peaks at gravitational capture)
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

    // Fuel remaining (burns at phase 1 & 2, low usage in cruise)
    const fuelPct = Math.max(0, Math.round(100 - (this.progress * 82)));
    if (fuelValEl) fuelValEl.textContent = `${fuelPct}%`;

    // Memorial Hardware Card Display (when progress >= 95%)
    const memorialCard = document.getElementById('fth-memorial-card');
    if (memorialCard) {
      const isLanded = this.progress >= 0.95;
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

  // --- 8. CLEAN EXIT & RESTORE ORBIT ---
  stopSimulation() {
    this.isActive = false;
    this.isPaused = true;

    // Hide rocket and markers
    if (this.rocketGroup) this.rocketGroup.visible = false;
    if (this.landingBeacon) this.landingBeacon.visible = false;
    if (this.trajectoryTube) this.trajectoryTube.visible = false;
    if (this.particles) {
      this.particles.forEach(p => p.visible = false);
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

    // Play close sound
    if (this.app.soundEngine && typeof this.app.soundEngine.playUI === 'function') {
      this.app.soundEngine.playUI('close');
    }
  }
}

// Global initialization bridge
if (typeof window !== 'undefined') {
  window.TrajectorySimulator = TrajectorySimulator;
}
