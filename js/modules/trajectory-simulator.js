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
    this.dustRing = null;
    this.hasDustRingTriggered = false;
    this.chalkLander = null;
    this.hasLanderPopped = false;
    this.stagedBooster = null;
    this.isStaged = false;
    this.waypointGroup = null;
    this.probeAddonGroup = null;
    this.rocketNoseGroup = null;
    this.rocketFinGroup = null;
    this.secondaryChalkLine = null;

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
        landingSite: 'Mare Tranquillitatis (Tranquility Base)',
        landingCoords: '0.674° N, 23.473° E',
        landingDate: 'July 20, 1969',
        solsActive: '8 days total (21.6 hrs on lunar surface)',
        discardReason: 'Why Abandoned: The Lunar Module descent stage served as a stationary launch pad for the ascent stage. Leaving the descent engine, lunar roving vehicle, life-support backpacks (PLSS), and science experiments behind was crucial—every kilogram abandoned on the Moon saved critical propellant needed to return 21.55 kg of lunar rock samples back to Earth.',
        weatheringInfo: 'Over 55+ years of space weathering: Unfiltered ultraviolet radiation has bleached the commemorative nylon flag, micro-meteorite bombardment continually pits the thermal Kapton foil, and extreme thermal cycling (-150°C night to +120°C day) causes constant structural expansion and contraction.',
        legacy: 'Humanity\'s first footprint on another celestial body. The retroreflector experiment remains active today, bounced by lasers from Earth to measure lunar drift.',
        distanceTotalKm: 384400,
        transitDurationStr: '3 Days, 3 Hours, 49 Mins',
        maxVelocityKmS: 11.2,
        scientificPayloads: [
          {
            name: 'Laser Ranging Retroreflector',
            acronym: 'LRRR',
            purpose: 'Array of 100 quartz corner-cube prisms that reflect ground laser pulses back to Earth, measuring Moon distance to millimeter precision and tracking lunar orbital drift.'
          },
          {
            name: 'Passive Seismic Experiment',
            acronym: 'PSEP',
            purpose: 'Solar-powered seismometer that recorded moonquakes, meteoroid impacts, and tidal crustal stresses to determine internal lunar structure.'
          },
          {
            name: 'Early Apollo Scientific Experiments Package',
            acronym: 'EASEP',
            purpose: 'Contained the Solar Wind Composition foil sheet deployed by Buzz Aldrin to trap noble gas ions directly emitted from the Sun.'
          }
        ],
        scorecard: {
          surfaceSols: '21.6 Hours (1 Lunar Day)',
          distanceTraversed: '250 meters',
          massLeftBehind: '2,240 kg (Descent stage & gear)',
          sampleMassReturned: '21.55 kg (Priceless lunar regolith)'
        },
        waypoints: [
          { t: 0.15, label: 'EARTH DEPARTURE / TLI' },
          { t: 0.50, label: 'CISLUNAR MID-COURSE' },
          { t: 0.90, label: 'LUNAR ORBIT / PDI' }
        ],
        phases: [
          {
            threshold: 0.15,
            name: 'PHASE 1: LIFTOFF & ESCAPE PHYSICS',
            tag: 'LIFTOFF',
            hazard: 'Saturn V 3-stage vehicle generates 34.5 million Newtons of thrust, consuming 15 metric tons of RP-1 and LOX per second. Endures structural Max-Q dynamic pressure at 13.5 km altitude.',
            details: 'Five colossal Rocketdyne F-1 engines accelerate the 3,000-tonne Saturn V through Earth\'s dense atmosphere. S-IC and S-II staging is followed by an S-IVB burn inserting Apollo into an Earth parking orbit at 7.8 km/s (28,000 km/h).'
          },
          {
            threshold: 0.35,
            name: 'PHASE 2: TRANSLUNAR INJECTION (TLI) & FREE-RETURN',
            tag: 'TLI BURN',
            hazard: 'Re-ignition of S-IVB third stage in vacuum. Critical astrodynamic commit: free-return figure-8 trajectory ensures crew survival without SPS engine burn.',
            details: 'A 350-second TLI burn boosts velocity to 39,000 km/h escape speed. Apollo enters a figure-8 free-return loop: if the Service Propulsion System (SPS) fails, lunar gravity automatically loops the spacecraft around the Moon and slingshots it safely back to Earth without burning propellant.'
          },
          {
            threshold: 0.75,
            name: 'PHASE 3: CISLUNAR CRUISE & SPACE HAZARDS',
            tag: 'COAST',
            hazard: 'Crossing the lethal Van Allen radiation belts; extreme thermal gradients require Passive Thermal Control (PTC) "Barbecue Roll" at 3 revolutions per hour.',
            details: 'Unpowered ballistic cruise across the 384,400 km gravitational null point. The PTC slow-roll prevents one side from freezing (-150°C) while the other bakes (+120°C). Astronauts verify trajectory with navigational sextant star-sightings.'
          },
          {
            threshold: 0.90,
            name: 'PHASE 4: POWERED DESCENT INITIATION & THE 1202 ALARM',
            tag: 'DESCENT',
            hazard: 'Powered Descent Initiation (PDI). Historic 1201 and 1202 radar computer overload alarms sound inside the Lunar Module Eagle as radar data floods the AGC memory.',
            details: 'Priority scheduling software keeps attitude thrusters functioning. Neil Armstrong takes manual semi-attitude control over boulder-strewn West Crater, touching down with only 25 seconds of descent propellant remaining.'
          },
          {
            threshold: 1.0,
            name: 'PHASE 5: TRANQUILITY BASE & WHERE THEY REMAIN',
            tag: 'LANDED',
            hazard: 'The Apollo 11 descent stage, commemorative plaque, and scientific experiments remain undisturbed under extreme hard vacuum.',
            details: 'Every kilogram left on the Moon saved critical fuel to return 21.55 kg of lunar rock samples. Over 55+ years, unfiltered solar UV radiation has bleached the materials while micrometeoroid impacts and thermal cycling (-150°C to +120°C) slowly weather the historic artifacts.'
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
      'voyager-1-2': {
        id: 'voyager-1-2',
        name: 'Voyager 1 & 2',
        callsign: 'Voyager 1 (VGR-1) & Voyager 2 (VGR-2)',
        targetBody: 'Deep Space',
        targetPlanet: 'Interstellar',
        craftType: 'probe',
        color: 0xfde047,
        colorHex: '#FDE047',
        accentColor: '#FDE047',
        landingSite: 'Interstellar Space (Constellation Ophiuchus)',
        landingCoords: 'Declination +12° 02\', R.A. 17h 14m (24.4B km / 163.1 AU)',
        landingDate: 'Crossed Heliopause August 25, 2012',
        solsActive: '48+ Years (Still Transmitting)',
        discardReason: 'Titan IIIE Centaur booster stages detached in solar orbit. The probe carries the Golden Record into interstellar space.',
        weatheringInfo: 'Drifting through galactic cosmic rays and cold interstellar plasma at 3 Kelvin (-270°C). Micrometeoroid impacts pit its gold-coated bus while RTG output slowly decays by 4 Watts per year.',
        legacy: 'Farthest human-made object in history (over 24.4 billion km from Earth). Carries the 12-inch gold-plated copper phonograph record containing sounds, music, and images of Earth.',
        distanceTotalKm: 24400000000,
        transitDurationStr: '48 Years, 6 Months (Active Interstellar Mission)',
        maxVelocityKmS: 61.2,
        scientificPayloads: [
          {
            name: 'Plasma Wave Subsystem',
            acronym: 'PWS',
            purpose: 'Measures density oscillations in surrounding space; recorded the jump from solar wind (0.002 e-/cm³) to interstellar plasma (0.08 e-/cm³), confirming exit from the heliosphere.'
          },
          {
            name: 'Cosmic Ray Subsystem',
            acronym: 'CRS',
            purpose: 'Detects energetic atomic nuclei originating from supernova remnants outside our solar system.'
          },
          {
            name: 'Low-Energy Charged Particle',
            acronym: 'LECP',
            purpose: 'Measures differential energy spectra and angular distributions of electrons and ions in the heliosheath.'
          },
          {
            name: 'Triaxial Fluxgate Magnetometer',
            acronym: 'MAG',
            purpose: 'Mounted on a 13-meter deployable fiberglass boom to detect changes in interplanetary and interstellar magnetic field strength.'
          },
          {
            name: 'The Golden Record',
            acronym: 'AUDIO-VISUAL',
            purpose: '12-inch gold-plated copper disc containing 115 analog images, natural sounds, greetings in 55 languages, and 90 minutes of diverse human musical traditions.'
          }
        ],
        scorecard: {
          surfaceSols: '48+ Years (Active Mission)',
          distanceTraversed: '24.4 Billion km (163.1 AU)',
          massLeftBehind: 'Booster stages in solar orbit',
          sampleMassReturned: 'In-situ interstellar plasma telemetry'
        },
        waypoints: [
          { t: 0.08, label: 'EARTH DEPARTURE / HYPERBOLIC ESCAPE' },
          { t: 0.36, label: 'JUPITER GRAVITY ASSIST (+16 km/s)' },
          { t: 0.62, label: 'SATURN & TITAN FLYBY (+35° DEFLECTION)' },
          { t: 0.82, label: 'TERMINATION SHOCK & HELIOSHEATH' },
          { t: 1.00, label: 'HELIOPAUSE (TRUE INTERSTELLAR SPACE)' }
        ],
        phases: [
          {
            threshold: 0.12,
            name: 'PHASE 1: TITAN IIIE CENTAUR LAUNCH',
            tag: 'LIFTOFF',
            hazard: 'High-energy hyperbolic injection at 15.2 km/s (55,000 km/h) escape speed.',
            details: 'Titan IIIE booster with Centaur D-1T upper stage and TE-M-364-4 solid rocket motor blasts Voyager directly onto an interstellar trajectory.'
          },
          {
            threshold: 0.40,
            name: 'PHASE 2: JUPITER GRAVITY ASSIST & IO VOLCANOES',
            tag: 'SLINGSHOT 1',
            hazard: 'Intense Jovian magnetic radiation belts. 349,000 km closest periapsis.',
            details: 'Voyager skims past Jupiter, stealing orbital angular momentum. Jovian gravity accelerates the spacecraft by +16 km/s, slinging it across interplanetary space towards Saturn.'
          },
          {
            threshold: 0.68,
            name: 'PHASE 3: SATURN ENCOUNTER & TITAN FLYBY',
            tag: 'SLINGSHOT 2',
            hazard: 'Titan close atmospheric encounter (6,490 km) and ring plane crossing.',
            details: 'Titan\'s gravitational pull bends Voyager 1\'s trajectory 35° North out of the ecliptic plane into deep space, while Voyager 2 continues along the Grand Tour to Uranus and Neptune.'
          },
          {
            threshold: 0.86,
            name: 'PHASE 4: TERMINATION SHOCK & THE PALE BLUE DOT',
            tag: 'HELIOSHEATH',
            hazard: 'Solar wind abruptly decelerates from supersonic (400 km/s) to subsonic in the turbulent heliosheath.',
            details: 'At 6 billion km, Carl Sagan directs Voyager to take the historic "Pale Blue Dot" family portrait. Cosmic ray sensors record the boundaries of the Sun\'s magnetic bubble.'
          },
          {
            threshold: 1.0,
            name: 'PHASE 5: THE INTERSTELLAR MONUMENT',
            tag: 'INTERSTELLAR',
            hazard: 'Galactic cosmic rays, cold interstellar plasma at 3 Kelvin (-270°C). RTG electrical output decays ~4W/year.',
            details: 'On August 25, 2012, Voyager 1 became the first human-made craft to cross the heliopause into true interstellar space. Drifting silently at 17 km/s with the Golden Record, it will wander the Milky Way for eternity.'
          }
        ]
      },
      'voyager-1': null, // initialized below
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
      'cassini-huygens': {
        id: 'cassini-huygens',
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
          { t: 0.85, label: 'SATURN RING PLANE INSERTION' },
          { t: 1.00, label: 'SATURN GRAND FINALE PLUNGE' }
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
      },
      'cassini': null, // initialized below
      'perseverance-ingenuity': null, // alias for perseverance
      'apollo-15': {
        id: 'apollo-15',
        name: 'Apollo 15',
        callsign: 'Endeavour & Falcon',
        targetBody: 'Moon',
        targetPlanet: 'Earth',
        craftType: 'lunar-module',
        color: 0x60a5fa,
        colorHex: '#60A5FA',
        accentColor: '#60A5FA',
        landingSite: 'Hadley-Apennine (Hadley Rille)',
        landingCoords: '26.132° N, 3.633° E',
        landingDate: 'July 30, 1971',
        solsActive: '12 days (66.9 hours on lunar surface)',
        discardReason: 'Lunar Roving Vehicle (LRV-001) parked on lunar regolith at VIP site alongside descent stage.',
        weatheringInfo: 'Extreme lunar thermal cycling, cosmic ray bombardment, and solar UV bleaching.',
        legacy: 'First mission to deploy the Lunar Roving Vehicle, driving 27.9 km across Hadley Rille.',
        distanceTotalKm: 384400,
        transitDurationStr: '3 Days, 1 Hour',
        maxVelocityKmS: 11.2,
        waypoints: [
          { t: 0.15, label: 'EARTH DEPARTURE / TLI' },
          { t: 0.50, label: 'TRANSLUNAR COAST' },
          { t: 0.90, label: 'HADLEY RILLE DESCENT' }
        ],
        phases: [
          { threshold: 0.2, name: 'PHASE 1: SATURN V LAUNCH', tag: 'LIFTOFF', hazard: 'High payload mass with Lunar Rover.', details: 'Heaviest Apollo payload launched into translunar injection.' },
          { threshold: 0.7, name: 'PHASE 2: TRANSLUNAR CRUISE', tag: 'COAST', hazard: 'High-latitude orbital insertion.', details: 'Translunar injection into inclined orbit around the lunar poles.' },
          { threshold: 1.0, name: 'PHASE 3: HADLEY RILLE LANDING', tag: 'SURFACE', hazard: 'Landing between 4,500m peaks of the Apennine Mountains.', details: 'Falcon touches down near Hadley Rille canyon.' }
        ]
      },
      'viking-1-2': {
        id: 'viking-1-2',
        name: 'Viking 1 & 2',
        callsign: 'Viking 1 (VL-1) & Viking 2 (VL-2)',
        targetBody: 'Mars',
        targetPlanet: 'Mars',
        craftType: 'lander',
        color: 0xf97316,
        colorHex: '#F97316',
        accentColor: '#F97316',
        landingSite: 'Chryse Planitia & Utopia Planitia',
        landingCoords: '22.48° N, 312.05° E (VL-1)',
        landingDate: 'July 20, 1976',
        solsActive: 'VL-1: 2,307 Sols / VL-2: 1,316 Sols',
        discardReason: 'Both stationary landers completed primary biology life-detection experiments and remain silent monuments.',
        weatheringInfo: 'Severe global dust storms and iron oxide regolith abrasion.',
        legacy: 'First successful long-duration American landings on Mars.',
        distanceTotalKm: 700000000,
        transitDurationStr: '10 Months, 11 Days',
        maxVelocityKmS: 24.0,
        waypoints: [
          { t: 0.15, label: 'EARTH ESCAPE' },
          { t: 0.50, label: 'INTERPLANETARY TRANSIT' },
          { t: 0.90, label: 'MARS ATMOSPHERIC ENTRY' }
        ],
        phases: [
          { threshold: 0.2, name: 'PHASE 1: TITAN IIIE LAUNCH', tag: 'LIFTOFF', hazard: 'Titan Centaur escape.', details: 'Dual spacecraft launched in 1975.' },
          { threshold: 0.7, name: 'PHASE 2: HELIOCENTRIC CRUISE', tag: 'CRUISE', hazard: 'Solar cosmic radiation.', details: '10-month transit to Mars.' },
          { threshold: 1.0, name: 'PHASE 3: CHRYSE PLANITIA LANDING', tag: 'LANDED', hazard: 'Parachute and terminal descent engines.', details: 'Historic touchdown on the golden Martian plain.' }
        ]
      },
      'viking-1': null, // alias
      'pathfinder-sojourner': {
        id: 'pathfinder-sojourner',
        name: 'Mars Pathfinder & Sojourner',
        callsign: 'Carl Sagan Memorial Station & Sojourner',
        targetBody: 'Mars',
        targetPlanet: 'Mars',
        craftType: 'mars-rover',
        color: 0xfb923c,
        colorHex: '#FB923C',
        accentColor: '#FB923C',
        landingSite: 'Ares Vallis (Flood Plain)',
        landingCoords: '19.33° N, 326.45° E',
        landingDate: 'July 4, 1997',
        solsActive: '83 Sols (3x design life)',
        discardReason: 'Airbag tetrahedron lander base and 10.6 kg microrover remain at Ares Vallis.',
        weatheringInfo: 'Martian dust fallout coats solar cells and cold thermal cycling (-85°C nights).',
        legacy: 'First mobile robotic wheeled rover on Mars, revolutionizing low-cost exploration.',
        distanceTotalKm: 497000000,
        transitDurationStr: '6 Months, 28 Days',
        maxVelocityKmS: 24.1,
        waypoints: [
          { t: 0.15, label: 'EARTH DEPARTURE' },
          { t: 0.50, label: 'INTERPLANETARY CRUISE' },
          { t: 0.90, label: 'AIRBAG BOUNCE LANDING' }
        ],
        phases: [
          { threshold: 0.2, name: 'PHASE 1: DELTA II LAUNCH', tag: 'LIFTOFF', hazard: 'Direct injection.', details: 'Delta II launch from Cape Canaveral.' },
          { threshold: 0.7, name: 'PHASE 2: INTERPLANETARY TRANSIT', tag: 'CRUISE', hazard: 'Autonomous cruise maneuvers.', details: 'Fast transit directly onto Mars atmospheric entry.' },
          { threshold: 1.0, name: 'PHASE 3: AIRBAG BOUNCE & ROLLOUT', tag: 'LANDED', hazard: '24-airbag cluster bounce at 50 km/h.', details: 'Pathfinder bounces 15 times before resting at Ares Vallis.' }
        ]
      },
      'spirit-opportunity': {
        id: 'spirit-opportunity',
        name: 'Spirit & Opportunity',
        callsign: 'MER-A (Spirit) & MER-B (Opportunity)',
        targetBody: 'Mars',
        targetPlanet: 'Mars',
        craftType: 'mars-rover',
        color: 0xef4444,
        colorHex: '#EF4444',
        accentColor: '#EF4444',
        landingSite: 'Gusev Crater & Meridiani Planum',
        landingCoords: '14.57° S, 175.47° E (Spirit) / 1.95° S, 354.47° E (Oppy)',
        landingDate: 'January 4 & January 25, 2004',
        solsActive: 'Spirit: 2,210 Sols / Opportunity: 5,111 Sols',
        discardReason: 'Solar panels covered by dust storms; rovers remain preserved on Mars.',
        weatheringInfo: 'Martian dust devils, global dust storms, wheel seizure, cold thermal cycling.',
        legacy: 'Opportunity drove a marathon 45.16 km, confirming ancient liquid water on Mars.',
        distanceTotalKm: 487000000,
        transitDurationStr: '6 Months, 24 Days',
        maxVelocityKmS: 24.2,
        waypoints: [
          { t: 0.15, label: 'EARTH ESCAPE' },
          { t: 0.50, label: 'HOHMANN CRUISE' },
          { t: 0.90, label: 'AIRBAG IMPACT & INFLATION' }
        ],
        phases: [
          { threshold: 0.2, name: 'PHASE 1: DELTA II HEAVY LAUNCH', tag: 'LIFTOFF', hazard: 'Twin launches June/July 2003.', details: 'MER twin rovers launched on Delta II Heavy.' },
          { threshold: 0.7, name: 'PHASE 2: HOHMANN TRANSIT', tag: 'CRUISE', hazard: 'Solar radiation.', details: 'Cruise stage attitude control.' },
          { threshold: 1.0, name: 'PHASE 3: AIRBAG TOUCHDOWN', tag: 'LANDED', hazard: 'High-speed airbag bounce.', details: 'Bounced into Gusev Crater and Meridiani Planum.' }
        ]
      },
      'hubble-jwst': {
        id: 'hubble-jwst',
        name: 'Hubble & James Webb (JWST)',
        callsign: 'HST & JWST Cosmic Sentinels',
        targetBody: 'Lagrange L2',
        targetPlanet: 'Earth',
        craftType: 'space-telescope',
        color: 0x06b6d4,
        colorHex: '#06B6D4',
        accentColor: '#06B6D4',
        landingSite: 'Sun-Earth L2 Halo Orbit (1.5 Million km from Earth)',
        landingCoords: 'Lagrangian Point L2 Halo Orbit',
        landingDate: 'Arrived at L2 January 24, 2022',
        solsActive: 'Active Telescopes (HST: 34+ yrs, JWST: 2+ yrs)',
        discardReason: 'HST jettisoned early servicing components; JWST operates in ultra-cold deep halo orbit.',
        weatheringInfo: 'Micrometeoroid impacts on golden beryllium mirrors; deep space cold at 40 Kelvin (-233°C).',
        legacy: 'Revolutionized human cosmology, revealing the first galaxies formed after the Big Bang.',
        distanceTotalKm: 1500000,
        transitDurationStr: '29 Days to L2 Halo Orbit',
        maxVelocityKmS: 10.5,
        waypoints: [
          { t: 0.15, label: 'EARTH DEPARTURE / ARIANE 5' },
          { t: 0.50, label: 'SUNSHIELD TENSIONING CRUISE' },
          { t: 1.00, label: 'L2 LAGRANGE HALO INSERTION' }
        ],
        phases: [
          { threshold: 0.2, name: 'PHASE 1: ARIANE 5 LAUNCH', tag: 'LIFTOFF', hazard: 'Flawless precision injection by Ariane 5 from Kourou.', details: 'Saved propellant to extend mission lifetime to 20+ years.' },
          { threshold: 0.6, name: 'PHASE 2: SUNSHIELD & MIRROR UNFOLDING', tag: 'DEPLOYMENT', hazard: '344 single-point failures resolved autonomously in deep space.', details: 'Tennis-court-sized Kapton sunshield deployed successfully.' },
          { threshold: 1.0, name: 'PHASE 3: L2 HALO ORBIT INSERTION', tag: 'ORBITAL', hazard: 'Station-keeping around gravitational equilibrium.', details: 'JWST enters halo orbit 1.5M km from Earth.' }
        ]
      }
    };

    // Aliases
    this.missions['voyager-1'] = this.missions['voyager-1-2'];
    this.missions['cassini'] = this.missions['cassini-huygens'];
    this.missions['perseverance-ingenuity'] = this.missions['perseverance'];
    this.missions['viking-1'] = this.missions['viking-1-2'];

    this.init();
  }

  init() {
    this.createDOMElements();
    this.createProceduralRocket();
  }

  // --- 1. PROCEDURAL MINIATURE CEL-SHADED CHALK ROCKET (CUTE CHIBI TOY STYLE) ---
  createProceduralRocket() {
    this.rocketGroup = new THREE.Group();
    this.rocketGroup.name = 'TrajectoryRocketGroup';

    // 1. High-Contrast 3-Step Toon Ramp for Ultra-Crisp Shell Shading
    const toonCanvas = document.createElement('canvas');
    toonCanvas.width = 3;
    toonCanvas.height = 1;
    const toonCtx = toonCanvas.getContext('2d');
    toonCtx.fillStyle = '#0f172a'; // Deep cosmic shadow
    toonCtx.fillRect(0, 0, 1, 1);
    toonCtx.fillStyle = '#6366f1'; // Vivid midtone
    toonCtx.fillRect(1, 0, 1, 1);
    toonCtx.fillStyle = '#ffffff'; // Pure chalk highlight
    toonCtx.fillRect(2, 0, 1, 1);
    const sharpToonGrad = new THREE.CanvasTexture(toonCanvas);
    sharpToonGrad.minFilter = THREE.NearestFilter;
    sharpToonGrad.magFilter = THREE.NearestFilter;

    // Materials
    const chalkWhiteMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      roughness: 0.6,
      gradientMap: sharpToonGrad
    });

    const chalkCrimsonMat = new THREE.MeshToonMaterial({
      color: 0xf43f5e,
      roughness: 0.6,
      gradientMap: sharpToonGrad
    });

    const chalkCyanMat = new THREE.MeshToonMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      gradientMap: sharpToonGrad
    });

    const charcoalMat = new THREE.MeshToonMaterial({
      color: 0x111827,
      roughness: 0.7,
      gradientMap: sharpToonGrad
    });

    const lemonMat = new THREE.MeshToonMaterial({
      color: 0xfde047,
      roughness: 0.5,
      gradientMap: sharpToonGrad
    });

    // Pitch-black inverted hull shell outline for maximum cartoon pop
    const inkOutlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    });

    // --- A. Fuselage: Chubby Rounded Chibi Capsule ---
    const bodyGroup = new THREE.Group();

    // Central cylinder
    const cylGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.95, 24);
    const cylMesh = new THREE.Mesh(cylGeo, chalkWhiteMat);
    bodyGroup.add(cylMesh);

    // Cyl outline
    const cylOutGeo = new THREE.CylinderGeometry(0.38 * 1.16, 0.44 * 1.16, 0.95 * 1.04, 24);
    bodyGroup.add(new THREE.Mesh(cylOutGeo, inkOutlineMat));

    // Upper shoulder dome
    const topDomeGeo = new THREE.SphereGeometry(0.38, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDome = new THREE.Mesh(topDomeGeo, chalkWhiteMat);
    topDome.position.y = 0.475;
    bodyGroup.add(topDome);

    const topDomeOutGeo = new THREE.SphereGeometry(0.38 * 1.16, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDomeOut = new THREE.Mesh(topDomeOutGeo, inkOutlineMat);
    topDomeOut.position.y = 0.475;
    bodyGroup.add(topDomeOut);

    // Lower skirt dome
    const btmDomeGeo = new THREE.SphereGeometry(0.44, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const btmDome = new THREE.Mesh(btmDomeGeo, chalkWhiteMat);
    btmDome.position.y = -0.475;
    bodyGroup.add(btmDome);

    const btmDomeOutGeo = new THREE.SphereGeometry(0.44 * 1.16, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const btmDomeOut = new THREE.Mesh(btmDomeOutGeo, inkOutlineMat);
    btmDomeOut.position.y = -0.475;
    bodyGroup.add(btmDomeOut);

    // Vibrant Crimson Waist Band
    const stripeGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.22, 24);
    const stripe = new THREE.Mesh(stripeGeo, chalkCrimsonMat);
    stripe.position.y = 0.0;
    bodyGroup.add(stripe);

    // Two cute cartoon gold rivet dots on the waist band
    const rivetGeo = new THREE.SphereGeometry(0.045, 10, 10);
    const rivetL = new THREE.Mesh(rivetGeo, lemonMat);
    rivetL.position.set(-0.20, 0.0, 0.38);
    bodyGroup.add(rivetL);

    const rivetR = new THREE.Mesh(rivetGeo, lemonMat);
    rivetR.position.set(0.20, 0.0, 0.38);
    bodyGroup.add(rivetR);

    this.rocketGroup.add(bodyGroup);

    // --- B. Conical Chubby Nosecone with Cartoon Bobble Antenna (Grouped for Probe Toggling) ---
    this.rocketNoseGroup = new THREE.Group();
    const noseGeo = new THREE.ConeGeometry(0.38, 0.62, 24);
    const nose = new THREE.Mesh(noseGeo, chalkCrimsonMat);
    nose.position.y = 0.95;
    this.rocketNoseGroup.add(nose);

    const noseOutGeo = new THREE.ConeGeometry(0.38 * 1.16, 0.62 * 1.10, 24);
    const noseOut = new THREE.Mesh(noseOutGeo, inkOutlineMat);
    noseOut.position.y = 0.95;
    this.rocketNoseGroup.add(noseOut);

    // Cute retro bobble antenna on top
    const stemGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.28, 10);
    const stem = new THREE.Mesh(stemGeo, charcoalMat);
    stem.position.y = 1.34;
    this.rocketNoseGroup.add(stem);

    // Bright lemon bobble sphere with ink outline
    const bobbleGeo = new THREE.SphereGeometry(0.095, 16, 16);
    const bobble = new THREE.Mesh(bobbleGeo, lemonMat);
    bobble.position.y = 1.50;
    this.rocketNoseGroup.add(bobble);

    const bobbleOutGeo = new THREE.SphereGeometry(0.095 * 1.25, 16, 16);
    const bobbleOut = new THREE.Mesh(bobbleOutGeo, inkOutlineMat);
    bobbleOut.position.y = 1.50;
    this.rocketNoseGroup.add(bobbleOut);

    this.rocketGroup.add(this.rocketNoseGroup);

    // --- C. Big Chubby Bubble Porthole with Cartoon Glass Glints ---
    const windowGroup = new THREE.Group();
    windowGroup.position.set(0, 0.28, 0.39);

    // Dark charcoal bezel
    const rimGeo = new THREE.TorusGeometry(0.18, 0.035, 12, 24);
    const rim = new THREE.Mesh(rimGeo, charcoalMat);
    windowGroup.add(rim);

    // Convex cyan bubble glass
    const glassGeo = new THREE.SphereGeometry(0.17, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const glass = new THREE.Mesh(glassGeo, chalkCyanMat);
    glass.rotation.x = Math.PI / 2;
    windowGroup.add(glass);

    // Cartoon glass glints in pure white
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    // Primary oval highlight (top-left)
    const glint1Geo = new THREE.CircleGeometry(0.045, 14);
    const glint1 = new THREE.Mesh(glint1Geo, glintMat);
    glint1.position.set(-0.05, 0.06, 0.09);
    glint1.scale.set(1.4, 0.8, 1);
    glint1.rotation.z = Math.PI / 4;
    windowGroup.add(glint1);

    // Secondary sparkle dot (bottom-right)
    const glint2Geo = new THREE.CircleGeometry(0.02, 10);
    const glint2 = new THREE.Mesh(glint2Geo, glintMat);
    glint2.position.set(0.06, -0.05, 0.09);
    windowGroup.add(glint2);

    this.rocketGroup.add(windowGroup);

    // --- D. 3 Chunky Swept Cartoon Fins (Grouped for Probe Toggling) ---
    this.rocketFinGroup = new THREE.Group();
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0.08);
    finShape.quadraticCurveTo(0.48, 0.05, 0.58, -0.18);
    finShape.quadraticCurveTo(0.52, -0.52, 0.16, -0.56);
    finShape.lineTo(0, -0.38);
    finShape.closePath();

    const extrudeSettings = {
      depth: 0.065,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025
    };
    const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);

    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;

      const fin = new THREE.Mesh(finGeo, chalkCrimsonMat);
      fin.rotation.y = angle;
      fin.position.y = -0.35;
      this.rocketFinGroup.add(fin);

      // Thick black ink outline for fin
      const finOut = new THREE.Mesh(finGeo, inkOutlineMat);
      finOut.rotation.y = angle;
      finOut.position.y = -0.35;
      finOut.scale.set(1.16, 1.16, 1.16);
      this.rocketFinGroup.add(finOut);
    }
    this.rocketGroup.add(this.rocketFinGroup);

    // --- D.2. Interstellar Probe Accessories (Voyager HGA Dish, Golden Record, RTG & Mag Booms) ---
    this.probeAddonGroup = new THREE.Group();
    this.probeAddonGroup.name = 'ProbeAddonGroup';

    // 1. High-Gain Antenna (HGA) Parabolic Dish (White with ink outline)
    const dishGeo = new THREE.SphereGeometry(0.54, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.7);
    const dishMesh = new THREE.Mesh(dishGeo, chalkWhiteMat);
    dishMesh.rotation.x = -Math.PI / 2;
    dishMesh.position.set(0, 0.72, 0);
    this.probeAddonGroup.add(dishMesh);

    const dishOutGeo = new THREE.SphereGeometry(0.54 * 1.14, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.7);
    const dishOut = new THREE.Mesh(dishOutGeo, inkOutlineMat);
    dishOut.rotation.x = -Math.PI / 2;
    dishOut.position.set(0, 0.72, 0);
    this.probeAddonGroup.add(dishOut);

    // Sub-reflector feed horn
    const hornGeo = new THREE.CylinderGeometry(0.022, 0.035, 0.28, 12);
    const hornMesh = new THREE.Mesh(hornGeo, charcoalMat);
    hornMesh.position.set(0, 1.05, 0);
    this.probeAddonGroup.add(hornMesh);

    const hornTipGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const hornTip = new THREE.Mesh(hornTipGeo, lemonMat);
    hornTip.position.set(0, 1.20, 0);
    this.probeAddonGroup.add(hornTip);

    // 2. The Golden Record (Mounted on the right side)
    const recordGeo = new THREE.CylinderGeometry(0.20, 0.20, 0.025, 28);
    const recordMat = new THREE.MeshToonMaterial({
      color: 0xfacc15,
      emissive: 0xca8a04,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const recordMesh = new THREE.Mesh(recordGeo, recordMat);
    recordMesh.rotation.z = Math.PI / 2;
    recordMesh.position.set(0.44, 0.05, 0.0);
    this.probeAddonGroup.add(recordMesh);

    const recordOut = new THREE.Mesh(new THREE.CylinderGeometry(0.20 * 1.15, 0.20 * 1.15, 0.025 * 1.05, 28), inkOutlineMat);
    recordOut.rotation.z = Math.PI / 2;
    recordOut.position.set(0.44, 0.05, 0.0);
    this.probeAddonGroup.add(recordOut);

    const recordRingGeo = new THREE.RingGeometry(0.08, 0.12, 24);
    const recordRingMat = new THREE.MeshBasicMaterial({ color: 0x78350f, side: THREE.DoubleSide });
    const recordRing = new THREE.Mesh(recordRingGeo, recordRingMat);
    recordRing.rotation.y = Math.PI / 2;
    recordRing.position.set(0.455, 0.05, 0.0);
    this.probeAddonGroup.add(recordRing);

    // 3. Magnetometer Boom (Deployable fiberglass lattice extending left)
    const magBoomGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.95, 8);
    const magBoom = new THREE.Mesh(magBoomGeo, charcoalMat);
    magBoom.rotation.z = Math.PI / 2.3;
    magBoom.position.set(-0.85, 0.22, 0.0);
    this.probeAddonGroup.add(magBoom);

    const magSensor = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), chalkCyanMat);
    magSensor.position.set(-1.25, 0.38, 0.0);
    this.probeAddonGroup.add(magSensor);

    // 4. RTG Power Canister Cluster (Extending rear-left)
    const rtgBoomGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.65, 8);
    const rtgBoom = new THREE.Mesh(rtgBoomGeo, charcoalMat);
    rtgBoom.rotation.x = Math.PI / 3;
    rtgBoom.position.set(0.0, -0.25, -0.65);
    this.probeAddonGroup.add(rtgBoom);

    const rtgCanisterGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.24, 12);
    const rtgCanisterMat = new THREE.MeshToonMaterial({ color: 0x475569, roughness: 0.6 });
    const rtgMesh = new THREE.Mesh(rtgCanisterGeo, rtgCanisterMat);
    rtgMesh.rotation.x = Math.PI / 3;
    rtgMesh.position.set(0.0, -0.42, -0.92);
    this.probeAddonGroup.add(rtgMesh);

    this.probeAddonGroup.visible = false;
    this.rocketGroup.add(this.probeAddonGroup);

    // --- E. Retro Flared Bell Engine Nozzle ---
    const nozzleGeo = new THREE.CylinderGeometry(0.16, 0.36, 0.35, 20, 1, true);
    const nozzle = new THREE.Mesh(nozzleGeo, charcoalMat);
    nozzle.position.y = -0.72;
    this.rocketGroup.add(nozzle);

    const nozzleLipGeo = new THREE.TorusGeometry(0.36, 0.03, 10, 20);
    const nozzleLip = new THREE.Mesh(nozzleLipGeo, charcoalMat);
    nozzleLip.position.y = -0.895;
    nozzleLip.rotation.x = Math.PI / 2;
    this.rocketGroup.add(nozzleLip);

    const nozzleOutGeo = new THREE.CylinderGeometry(0.16 * 1.16, 0.36 * 1.16, 0.35 * 1.05, 20, 1, true);
    const nozzleOut = new THREE.Mesh(nozzleOutGeo, inkOutlineMat);
    nozzleOut.position.y = -0.72;
    this.rocketGroup.add(nozzleOut);

    // --- F. Layered Cartoon Flame Puffs (Squash-and-Stretch Animated) ---
    // Outer flame puff (Chalk Tangerine #FB923C)
    const flameGeo1 = new THREE.SphereGeometry(0.24, 14, 14);
    const flameMat1 = new THREE.MeshBasicMaterial({
      color: 0xfb923c,
      transparent: true,
      opacity: 0.95
    });
    this.flamePuff1 = new THREE.Mesh(flameGeo1, flameMat1);
    this.flamePuff1.position.y = -1.08;
    this.rocketGroup.add(this.flamePuff1);

    // Middle bright flame (Chalk Lemon #FDE047)
    const flameGeo2 = new THREE.SphereGeometry(0.16, 12, 12);
    const flameMat2 = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.98
    });
    this.flamePuff2 = new THREE.Mesh(flameGeo2, flameMat2);
    this.flamePuff2.position.y = -1.02;
    this.rocketGroup.add(this.flamePuff2);

    // Inner hot white core (#ffffff)
    const flameGeo3 = new THREE.SphereGeometry(0.09, 10, 10);
    const flameMat3 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.99
    });
    this.flamePuff3 = new THREE.Mesh(flameGeo3, flameMat3);
    this.flamePuff3.position.y = -0.98;
    this.rocketGroup.add(this.flamePuff3);

    // Trailing spark pop
    const sparkGeo = new THREE.SphereGeometry(0.08, 8, 8);
    this.flamePuff4 = new THREE.Mesh(sparkGeo, flameMat2.clone());
    this.flamePuff4.position.y = -1.45;
    this.rocketGroup.add(this.flamePuff4);

    // MINIATURE PROPORTIONS: scale = 0.16 (Total height ~ 0.35 units, width ~ 0.14 units)
    this.rocketGroup.scale.setScalar(0.16);
    this.rocketGroup.visible = false;
    this.scene.add(this.rocketGroup);

    // 7. Trailing Chalk Dust Particle System (Cute Delicate Flecks)
    this.createSmokeParticleSystem();

    // 8. Destination Chalk Landing Beacon
    this.createLandingBeacon();
  }

  createSmokeParticleSystem() {
    this.particlesGroup = new THREE.Group();
    this.particles = [];
    const count = 40;
    // Tiny delicate chalk dust particles, much smaller than rocket
    const geo = new THREE.SphereGeometry(0.035, 6, 6);
    const chalkColors = [0xfde047, 0xfb923c, 0xfef08a, 0xffffff];

    for (let i = 0; i < count; i++) {
      const col = chalkColors[i % chalkColors.length];
      const mat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.85
      });
      const p = new THREE.Mesh(geo, mat);
      p.visible = false;
      p.userData = {
        life: 0,
        maxLife: 0.65,
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

    // 1. Concentric Chalk Target Rings on Surface with crisp contrast pad base
    const padBaseGeo = new THREE.CircleGeometry(0.95, 32);
    const padBaseMat = new THREE.MeshBasicMaterial({
      color: 0x070e1e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const padBase = new THREE.Mesh(padBaseGeo, padBaseMat);
    padBase.rotation.x = Math.PI / 2;
    padBase.position.y = 0.002;
    this.landingBeacon.add(padBase);

    const ringGeo1 = new THREE.RingGeometry(0.50, 0.62, 32);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.006;
    this.landingBeacon.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(0.80, 0.90, 32);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 0.004;
    this.landingBeacon.add(ring2);

    // 2. Miniature Cel-shaded Lander & Memorial Flag (positioned beside pad to avoid rocket clipping)
    this.chalkLander = new THREE.Group();
    this.chalkLander.position.set(1.25, 0, 0.35);

    // Golden foil octagonal descent stage
    const baseGeo = new THREE.CylinderGeometry(0.22, 0.30, 0.16, 8);
    const baseMat = new THREE.MeshToonMaterial({
      color: 0xf59e0b,
      gradientMap: this.app.toonGradient
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.08;
    this.chalkLander.add(baseMesh);

    // Outline
    const baseOutGeo = new THREE.CylinderGeometry(0.22 * 1.15, 0.30 * 1.15, 0.16 * 1.1, 8);
    const outMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
    baseMesh.add(new THREE.Mesh(baseOutGeo, outMat));

    // White capsule top
    const capGeo = new THREE.DodecahedronGeometry(0.13);
    const capMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      gradientMap: this.app.toonGradient
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 0.22;
    this.chalkLander.add(capMesh);

    // 4 Landing Struts
    for (let i = 0; i < 4; i++) {
      const legGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.28, 6);
      const legMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
      const leg = new THREE.Mesh(legGeo, legMat);
      const angle = (i * Math.PI) / 2;
      leg.position.set(Math.cos(angle) * 0.22, 0.06, Math.sin(angle) * 0.22);
      leg.rotation.z = Math.PI / 6;
      this.chalkLander.add(leg);
    }

    // Miniature Flagpole & Chalk Crimson Flag
    const poleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.65, 6);
    const poleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0.18, 0.32, 0);
    this.chalkLander.add(pole);

    const flagShape = new THREE.Shape();
    flagShape.moveTo(0, 0);
    flagShape.lineTo(0.22, 0.07);
    flagShape.lineTo(0, 0.14);
    flagShape.closePath();
    const flagGeo = new THREE.ShapeGeometry(flagShape);
    const flagMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0.18, 0.46, 0);
    this.chalkLander.add(flag);

    this.chalkLander.scale.set(0.001, 0.001, 0.001);
    this.landingBeacon.add(this.chalkLander);

    // 3. Regolith Chalk Dust Ring (one-time expanding landing shockwave)
    const dustGeo = new THREE.RingGeometry(0.12, 0.28, 32);
    const dustMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0
    });
    this.dustRing = new THREE.Mesh(dustGeo, dustMat);
    this.dustRing.rotation.x = Math.PI / 2;
    this.dustRing.position.y = 0.01;
    this.landingBeacon.add(this.dustRing);

    // Pad scale proportioned for miniature rocket (scale = 0.16)
    this.landingBeacon.scale.setScalar(0.35);

    this.landingBeacon.visible = false;
    this.scene.add(this.landingBeacon);
  }

  triggerDustRing() {
    if (this.hasDustRingTriggered || !this.dustRing) return;
    this.hasDustRingTriggered = true;
    this.dustRing.scale.set(1.0, 1.0, 1.0);
    this.dustRing.material.opacity = 0.85;

    if (window.TWEEN) {
      new TWEEN.Tween(this.dustRing.scale)
        .to({ x: 5.5, y: 5.5, z: 5.5 }, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
      new TWEEN.Tween(this.dustRing.material)
        .to({ opacity: 0.0 }, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    }
  }

  // --- 2.5 AUTHENTIC MISSION PLANETARY ALIGNMENT HELPERS ---
  alignPlanetsForMission(missionId) {
    if (!this.app || !this.app.planets) return;

    // Backup current orbital angles
    ['Earth', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Mars'].forEach(k => {
      const pl = this.app.planets[k];
      if (pl && pl.angleBackup === undefined) {
        pl.angleBackup = pl.angle;
      }
    });

    const earthObj = this.app.planets['Earth'];
    const earthAngle = earthObj ? earthObj.angle : 0;

    if (missionId.includes('voyager')) {
      // Authentic 1977 Grand Tour planetary alignment geometry:
      // Earth at departure, Jupiter ~49° ahead (0.85 rad), Saturn ~89° ahead (1.55 rad),
      // Uranus ~123° ahead (2.15 rad), Neptune ~152° ahead (2.65 rad)
      if (this.app.planets['Jupiter']) {
        this.app.planets['Jupiter'].angle = earthAngle + 0.85;
        this.syncPlanetPosition('Jupiter');
      }
      if (this.app.planets['Saturn']) {
        this.app.planets['Saturn'].angle = earthAngle + 1.55;
        this.syncPlanetPosition('Saturn');
      }
      if (this.app.planets['Uranus']) {
        this.app.planets['Uranus'].angle = earthAngle + 2.15;
        this.syncPlanetPosition('Uranus');
      }
      if (this.app.planets['Neptune']) {
        this.app.planets['Neptune'].angle = earthAngle + 2.65;
        this.syncPlanetPosition('Neptune');
      }
    } else if (
      missionId.includes('perseverance') || missionId.includes('curiosity') ||
      missionId.includes('viking') || missionId.includes('pathfinder') || missionId.includes('spirit')
    ) {
      // Hohmann transfer geometry: Mars is positioned at orbital rendezvous angle (~140° ahead)
      if (this.app.planets['Mars']) {
        this.app.planets['Mars'].angle = earthAngle + 2.45;
        this.syncPlanetPosition('Mars');
      }
    } else if (missionId.includes('cassini')) {
      if (this.app.planets['Jupiter']) {
        this.app.planets['Jupiter'].angle = earthAngle + 1.05;
        this.syncPlanetPosition('Jupiter');
      }
      if (this.app.planets['Saturn']) {
        this.app.planets['Saturn'].angle = earthAngle + 2.25;
        this.syncPlanetPosition('Saturn');
      }
    }
  }

  syncPlanetPosition(name) {
    const pl = this.app.planets[name];
    if (pl && pl.mesh && pl.mesh.position && pl.data) {
      pl.mesh.position.x = Math.cos(pl.angle) * pl.data.distance;
      pl.mesh.position.z = Math.sin(pl.angle) * pl.data.distance;
    }
  }

  restorePlanetPositions() {
    if (!this.app || !this.app.planets) return;
    ['Earth', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Mars'].forEach(k => {
      const pl = this.app.planets[k];
      if (pl && pl.angleBackup !== undefined) {
        pl.angle = pl.angleBackup;
        delete pl.angleBackup;
        if (pl.mesh && pl.mesh.position && pl.data) {
          pl.mesh.position.x = Math.cos(pl.angle) * pl.data.distance;
          pl.mesh.position.z = Math.sin(pl.angle) * pl.data.distance;
        }
      }
    });
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
    if (this.secondaryChalkLine) {
      this.scene.remove(this.secondaryChalkLine);
      if (this.secondaryChalkLine.geometry) this.secondaryChalkLine.geometry.dispose();
      if (this.secondaryChalkLine.material) this.secondaryChalkLine.material.dispose();
      this.secondaryChalkLine = null;
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

    if (mission.id === 'apollo-11' || mission.id.includes('apollo') || mission.targetBody === 'Moon' || mission.targetPlanet === 'Moon') {
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
      // Point 5.5: Vertical terminal descent corridor directly above pad
      points.push(moonPos.clone().add(new THREE.Vector3(-0.12, 1.50, 0.08)));
      // Point 6: Touchdown at Tranquility Base / Hadley Rille
      points.push(moonPos.clone().add(new THREE.Vector3(0, 1.15, 0)));

    } else if (
      mission.id === 'voyager-1' || mission.id === 'voyager-1-2' || mission.id.includes('voyager') ||
      mission.targetBody === 'Deep Space' || mission.targetPlanet === 'Interstellar'
    ) {
      // Authentic Voyager 1 & 2 Interstellar Flight Dynamics
      // Earth -> Jupiter Gravity Assist (+16 km/s) -> Saturn & Titan Gravity Assist (+35° North deflection) -> Interstellar Space
      const jupObj = this.app.planets['Jupiter'];
      const satObj = this.app.planets['Saturn'];

      const jupPos = new THREE.Vector3();
      if (jupObj && jupObj.mesh) jupObj.mesh.getWorldPosition(jupPos);
      else jupPos.set(195, 0, 0);

      const satPos = new THREE.Vector3();
      if (satObj && satObj.mesh) satObj.mesh.getWorldPosition(satPos);
      else satPos.set(255, 0, 0);

      // Local tangents and radial directions
      const tEarth = new THREE.Vector3(-earthPos.z, 0, earthPos.x).normalize();
      const rEarth = new THREE.Vector3(earthPos.x, 0, earthPos.z).normalize();

      const tJup = new THREE.Vector3(-jupPos.z, 0, jupPos.x).normalize();
      const rJup = new THREE.Vector3(jupPos.x, 0, jupPos.z).normalize();

      const tSat = new THREE.Vector3(-satPos.z, 0, satPos.x).normalize();
      const rSat = new THREE.Vector3(satPos.x, 0, satPos.z).normalize();

      // Point 0: Launch Pad on Earth's surface
      points.push(earthPos.clone().add(new THREE.Vector3(0, 4.0, 0)));

      // Point 1: Direct heliocentric injection burn (15.2 km/s escape speed)
      points.push(earthPos.clone().add(tEarth.clone().multiplyScalar(10)).add(rEarth.clone().multiplyScalar(4)).add(new THREE.Vector3(0, 2.5, 0)));

      // Point 2: Interplanetary transit through Asteroid Belt past Mars orbit
      const midEJ = new THREE.Vector3().lerpVectors(earthPos, jupPos, 0.48);
      midEJ.y = 2.0;
      midEJ.add(tEarth.clone().multiplyScalar(8));
      points.push(midEJ);

      // Point 3: Jupiter inbound corridor (approaching trailing flank of giant planet)
      points.push(jupPos.clone().sub(tJup.clone().multiplyScalar(22)).sub(rJup.clone().multiplyScalar(8)).add(new THREE.Vector3(0, 1.5, 0)));

      // Point 4: Jovian Periapsis - close gravitational slingshot (+16 km/s boost)
      points.push(jupPos.clone().sub(tJup.clone().multiplyScalar(2)).add(rJup.clone().multiplyScalar(13)).add(new THREE.Vector3(0, 3.8, 0)));

      // Point 5: Post-Jupiter outbound trajectory accelerated towards Saturn
      const jupExit = jupPos.clone().add(tJup.clone().multiplyScalar(20)).add(rJup.clone().multiplyScalar(18)).add(new THREE.Vector3(0, 6.0, 0));
      points.push(jupExit);

      // Point 6: Interplanetary void between Jupiter and Saturn orbits
      points.push(new THREE.Vector3().lerpVectors(jupExit, satPos, 0.50).add(new THREE.Vector3(0, 8.5, 0)));

      // Point 7: Saturn & Titan inbound approach corridor
      points.push(satPos.clone().sub(tSat.clone().multiplyScalar(18)).sub(rSat.clone().multiplyScalar(6)).add(new THREE.Vector3(0, 9.0, 0)));

      // Point 8: Saturn periapsis & Titan flyby - close gravitational slingshot
      points.push(satPos.clone().sub(tSat.clone().multiplyScalar(2)).add(rSat.clone().multiplyScalar(12)).add(new THREE.Vector3(0, 14.0, 0)));

      // Point 9: Historic Northward Deflection (+35° Ecliptic Inclination into deep space)
      const escapeDir = new THREE.Vector3().addScaledVector(rSat, 0.72).addScaledVector(tSat, 0.40).add(new THREE.Vector3(0, 0.85, 0)).normalize();
      points.push(satPos.clone().add(escapeDir.clone().multiplyScalar(85)));

      // Point 10: Heliosheath & Termination Shock crossing
      points.push(satPos.clone().add(escapeDir.clone().multiplyScalar(200)));

      // Point 11: Heliopause (121.6 AU) - True Interstellar Space (Constellation Ophiuchus)
      points.push(satPos.clone().add(escapeDir.clone().multiplyScalar(380)));

      // Hide planetary landing beacon for deep space missions
      if (this.landingBeacon) {
        this.landingBeacon.visible = false;
      }

      // Draw secondary Grand Tour trajectory for Voyager 2 (branching to Uranus and Neptune)
      const uranObj = this.app.planets['Uranus'];
      const neptObj = this.app.planets['Neptune'];
      if (uranObj && neptObj && uranObj.mesh && neptObj.mesh) {
        const uranPos = new THREE.Vector3();
        uranObj.mesh.getWorldPosition(uranPos);
        const neptPos = new THREE.Vector3();
        neptObj.mesh.getWorldPosition(neptPos);

        const v2Points = [
          points[4].clone(), // Jupiter exit
          points[6].clone(), // Mid JS
          satPos.clone().add(new THREE.Vector3(-6, 2, 10)), // Saturn flyby (staying in ecliptic)
          new THREE.Vector3().lerpVectors(satPos, uranPos, 0.5).add(new THREE.Vector3(0, -2, 0)),
          uranPos.clone().add(new THREE.Vector3(-4, -2, 6)), // Uranus flyby (Jan 1986)
          new THREE.Vector3().lerpVectors(uranPos, neptPos, 0.5).add(new THREE.Vector3(0, -6, 0)),
          neptPos.clone().add(new THREE.Vector3(-4, -5, 5)), // Neptune flyby (Aug 1989)
          neptPos.clone().add(new THREE.Vector3(60, -85, 120)) // Southward interstellar ejection (-32°)
        ];
        const v2Curve = new THREE.CatmullRomCurve3(v2Points, false, 'centripetal', 0.5);
        const v2Geo = new THREE.BufferGeometry().setFromPoints(v2Curve.getPoints(90));
        const v2Mat = new THREE.LineDashedMaterial({
          color: 0x38bdf8,
          dashSize: 1.2,
          gapSize: 0.8,
          scale: 1,
          transparent: true,
          opacity: 0.70
        });
        this.secondaryChalkLine = new THREE.Line(v2Geo, v2Mat);
        this.secondaryChalkLine.computeLineDistances();
        this.secondaryChalkLine.name = 'SecondaryChalkLine';
        this.scene.add(this.secondaryChalkLine);
      }

    } else if (
      mission.id === 'cassini' || mission.id === 'cassini-huygens' || mission.id.includes('cassini') ||
      mission.targetBody === 'Saturn' || mission.targetPlanet === 'Saturn'
    ) {
      // Cassini Saturn Orbit Insertion & Grand Finale Dive
      const satObj = this.app.planets['Saturn'];
      const satPos = new THREE.Vector3();
      if (satObj && satObj.mesh) satObj.mesh.getWorldPosition(satPos);
      else satPos.set(255, 0, 0);

      points.push(earthPos.clone().add(new THREE.Vector3(0, 4.0, 0)));
      points.push(earthPos.clone().add(new THREE.Vector3(12, 8, 8)));
      points.push(new THREE.Vector3(140, 16, 35));
      points.push(satPos.clone().add(new THREE.Vector3(-14, 15, -12)));
      points.push(satPos.clone().add(new THREE.Vector3(-6, 8, 6))); // Ring plane crossing
      points.push(satPos.clone().add(new THREE.Vector3(0, 3.8, 0))); // Grand Finale dive into atmosphere

    } else if (mission.id.includes('jwst') || mission.id.includes('hubble') || mission.targetBody.includes('Lagrange') || mission.targetBody.includes('L2')) {
      // Sun-Earth Lagrange L2 Halo Orbit
      const dirEarthOut = earthPos.clone().normalize();
      const l2Pos = earthPos.clone().add(dirEarthOut.clone().multiplyScalar(15.0));

      points.push(earthPos.clone().add(new THREE.Vector3(0, 4.0, 0)));
      points.push(earthPos.clone().add(new THREE.Vector3(2.5, 3.5, 1.5)));
      points.push(earthPos.clone().add(dirEarthOut.clone().multiplyScalar(7.0)).add(new THREE.Vector3(0, 2.5, 0)));
      points.push(l2Pos.clone().add(new THREE.Vector3(-1.5, 2.0, 1.5)));
      points.push(l2Pos.clone().add(new THREE.Vector3(1.5, -1.5, -1.5)));
      points.push(l2Pos.clone());

    } else if (
      mission.id === 'perseverance' || mission.id === 'curiosity' || mission.id === 'viking-1' ||
      mission.id.includes('perseverance') || mission.id.includes('curiosity') || mission.id.includes('viking') ||
      mission.id.includes('pathfinder') || mission.id.includes('spirit') ||
      mission.targetBody === 'Mars' || mission.targetPlanet === 'Mars'
    ) {
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
      // Vertical terminal descent corridor directly above pad
      points.push(marsPos.clone().add(new THREE.Vector3(-0.35, 4.2, -0.25)));
      // Parachute & Skycrane touchdown on landing pad
      points.push(marsPos.clone().add(new THREE.Vector3(0, 3.2, 0)));

    } else {
      // Default Interplanetary Arc (general)
      const satObj = this.app.planets['Saturn'];
      const satPos = (satObj && satObj.mesh) ? satObj.mesh.position.clone() : new THREE.Vector3(255, 0, 0);

      points.push(earthPos.clone().add(new THREE.Vector3(0, 4.0, 0)));
      points.push(earthPos.clone().add(new THREE.Vector3(12, 9, 9)));
      points.push(new THREE.Vector3(140, 18, 40));
      points.push(satPos.clone().add(new THREE.Vector3(-8, 12, -8)));
      points.push(satPos.clone().add(new THREE.Vector3(-0.4, 5.5, -0.4)));
      points.push(satPos.clone().add(new THREE.Vector3(0, 4, 0)));
    }

    this.trajectoryCurve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
    this.trajectoryPoints = points;

    // --- 1. Primary Line: Fine, High-Contrast Chalk-Dashed Ribbon ---
    const curvePoints = this.trajectoryCurve.getPoints(120);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const lineMat = new THREE.LineDashedMaterial({
      color: mission.color,
      dashSize: 1.0,
      gapSize: 0.5,
      scale: 1,
      linewidth: 2
    });
    this.chalkDashedLine = new THREE.Line(lineGeo, lineMat);
    this.chalkDashedLine.computeLineDistances();
    this.chalkDashedLine.name = 'ChalkDashedLine';
    this.scene.add(this.chalkDashedLine);

    // --- 2. Overlay Soft Chalk Glow Line (Zero Perspective Ballooning) ---
    const glowLineMat = new THREE.LineBasicMaterial({
      color: mission.color,
      transparent: true,
      opacity: 0.45
    });
    this.trajectoryTube = new THREE.Line(lineGeo, glowLineMat);
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

      // Delicate concentric dashed rings
      const r1Geo = new THREE.RingGeometry(0.60, 0.70, 32);
      const r1Mat = new THREE.MeshBasicMaterial({
        color: mission.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const r1 = new THREE.Mesh(r1Geo, r1Mat);
      wpGroup.add(r1);

      const r2Geo = new THREE.RingGeometry(0.88, 0.96, 32);
      const r2Mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const r2 = new THREE.Mesh(r2Geo, r2Mat);
      wpGroup.add(r2);

      // Chalk Delta-V direction arrow cone pointing along flight tangent
      const arrowGeo = new THREE.ConeGeometry(0.16, 0.48, 8);
      arrowGeo.rotateX(Math.PI / 2);
      const arrowMat = new THREE.MeshBasicMaterial({
        color: mission.color
      });
      const arrow = new THREE.Mesh(arrowGeo, arrowMat);
      arrow.position.set(0, 0, 0.35);
      wpGroup.add(arrow);

      this.waypointGroup.add(wpGroup);

      // Floating billboard canvas sprite label (compact proportions)
      const sprite = this.createLabelSprite(wp.label, mission.colorHex);
      sprite.position.copy(pos).add(new THREE.Vector3(0, 1.25, 0));
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
    ctx.font = 'bold 28px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(5.5, 1.38, 1);
    return sprite;
  }

  updateActiveTrail() {
    if (this.activeTrailMesh) {
      this.scene.remove(this.activeTrailMesh);
      if (this.activeTrailMesh.geometry) this.activeTrailMesh.geometry.dispose();
      this.activeTrailMesh = null;
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

        <!-- Interactive Fact & Specs Drawer: Expandable Accordions -->
        <div class="fth-accordion-group">
          <!-- Scientific Payloads Accordion -->
          <div class="fth-accordion" id="fth-acc-payloads">
            <button class="fth-accordion-header" id="fth-hdr-payloads" type="button">
              <span>🔬 SCIENTIFIC PAYLOADS</span>
              <span class="fth-accordion-chevron">▶</span>
            </button>
            <div class="fth-accordion-body" id="fth-body-payloads">
              <!-- Dynamically populated payload cards -->
            </div>
          </div>

          <!-- Mission Scorecard Accordion -->
          <div class="fth-accordion" id="fth-acc-scorecard">
            <button class="fth-accordion-header" id="fth-hdr-scorecard" type="button">
              <span>📊 MISSION SCORECARD</span>
              <span class="fth-accordion-chevron">▶</span>
            </button>
            <div class="fth-accordion-body" id="fth-body-scorecard">
              <!-- Dynamically populated scorecard grid -->
            </div>
          </div>
        </div>

        <!-- Climax Memorial Hardware Card (Displayed at 100% arrival) -->
        <div id="fth-memorial-card" class="fth-memorial-card hidden">
          <div class="fth-memorial-header">
            <span class="fth-memorial-theme">WHERE THEY REMAIN</span>
            <h4 id="fth-memorial-site" class="fth-memorial-title">Mare Tranquillitatis</h4>
          </div>
          <div class="fth-memorial-meta">
            <div class="fth-memorial-row"><span id="fth-mem-coords-label">Coordinates:</span> <strong id="fth-mem-coords">0.674° N, 23.473° E</strong></div>
            <div class="fth-memorial-row"><span id="fth-mem-date-label">Landing Date:</span> <strong id="fth-mem-date">July 20, 1969</strong></div>
            <div class="fth-memorial-row"><span id="fth-mem-sols-label">Operational Life:</span> <strong id="fth-mem-sols">21.6 hours</strong></div>
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

    // Accordion toggle handlers
    document.querySelectorAll('.fth-accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const accordion = header.closest('.fth-accordion');
        if (accordion) {
          accordion.classList.toggle('open');
        }
      });
    });

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
    const idMap = {
      'voyager-1-2': 'voyager-1-2',
      'voyager-1': 'voyager-1-2',
      'cassini-huygens': 'cassini-huygens',
      'cassini': 'cassini-huygens',
      'perseverance-ingenuity': 'perseverance-ingenuity',
      'perseverance': 'perseverance-ingenuity',
      'viking-1-2': 'viking-1-2',
      'viking-1': 'viking-1-2',
      'spirit-opportunity': 'spirit-opportunity',
      'pathfinder-sojourner': 'pathfinder-sojourner',
      'apollo-15': 'apollo-15',
      'apollo-11': 'apollo-11',
      'curiosity': 'curiosity',
      'hubble-jwst': 'hubble-jwst'
    };
    const normId = idMap[missionId] || missionId;
    let mission = this.missions[normId] || this.missions[missionId];

    if (!mission && typeof window !== 'undefined' && window.NASADataEngine) {
      const dataEngineMission = window.NASADataEngine.getMissionById(missionId) || window.NASADataEngine.getMissionById(normId);
      if (dataEngineMission) {
        let payloads = [];
        if (dataEngineMission.spacecraftSpecs && Array.isArray(dataEngineMission.spacecraftSpecs.instruments)) {
          payloads = dataEngineMission.spacecraftSpecs.instruments.map(inst => ({
            name: inst.name || inst.acronym || 'Scientific Instrument',
            acronym: inst.acronym || 'INSTR',
            purpose: inst.purpose || inst.targetAnalysis || 'Planetary science investigation.'
          }));
        }
        const scorecard = {
          surfaceSols: dataEngineMission.solsActive || 'N/A',
          distanceTraversed: dataEngineMission.distanceTotalKm ? `${(dataEngineMission.distanceTotalKm / 1e6).toFixed(1)}M km` : 'N/A',
          massLeftBehind: (dataEngineMission.spacecraftSpecs && dataEngineMission.spacecraftSpecs.dryMassKg) ? `${dataEngineMission.spacecraftSpecs.dryMassKg.toLocaleString()} kg` : 'Hardware left on surface',
          sampleMassReturned: (dataEngineMission.legacy && dataEngineMission.legacy.toLowerCase().includes('sample')) ? 'Samples Cached' : 'Telemetry Data Transmitted'
        };

        let targetBody = 'Mars';
        let targetPlanet = 'Mars';
        let craftType = 'lander';
        if (dataEngineMission.landingSiteCoordinates && dataEngineMission.landingSiteCoordinates.celestialBody) {
          targetBody = dataEngineMission.landingSiteCoordinates.celestialBody;
          targetPlanet = targetBody;
        } else if (dataEngineMission.fateCategory === 'deep_space') {
          targetBody = 'Deep Space';
          targetPlanet = 'Interstellar';
          craftType = 'probe';
        } else if (dataEngineMission.fateCategory === 'active_orbit' || (dataEngineMission.destinations && dataEngineMission.destinations.some(d => d.includes('L2')))) {
          targetBody = 'Lagrange L2';
          targetPlanet = 'Earth';
          craftType = 'space-telescope';
        } else if (dataEngineMission.destinations && dataEngineMission.destinations.length > 0) {
          const dStr = dataEngineMission.destinations.join(' ');
          if (dStr.includes('Saturn')) { targetBody = 'Saturn'; targetPlanet = 'Saturn'; craftType = 'probe'; }
          else if (dStr.includes('Jupiter')) { targetBody = 'Jupiter'; targetPlanet = 'Jupiter'; craftType = 'probe'; }
          else if (dStr.includes('Moon')) { targetBody = 'Moon'; targetPlanet = 'Earth'; craftType = 'lunar-module'; }
          else if (dStr.includes('Mars')) { targetBody = 'Mars'; targetPlanet = 'Mars'; craftType = 'mars-rover'; }
          else { targetBody = 'Deep Space'; targetPlanet = 'Interstellar'; craftType = 'probe'; }
        }

        mission = Object.assign({
          targetBody: targetBody,
          targetPlanet: targetPlanet,
          craftType: craftType,
          color: 0x38bdf8,
          colorHex: '#38BDF8',
          accentColor: '#38BDF8',
          scientificPayloads: payloads,
          scorecard: scorecard,
          waypoints: [
            { t: 0.15, label: 'EARTH DEPARTURE' },
            { t: 0.50, label: 'INTERPLANETARY CRUISE' },
            { t: 0.90, label: 'DESTINATION APPROACH' }
          ],
          phases: [
            { threshold: 0.2, name: 'PHASE 1: LIFTOFF & MAX-Q', tag: 'LIFTOFF', hazard: 'Atmospheric dynamic pressure.', details: 'Booster ascent.' },
            { threshold: 0.8, name: 'PHASE 2: INTERPLANETARY TRANSIT', tag: 'CRUISE', hazard: 'Deep space radiation.', details: 'Coast phase.' },
            { threshold: 1.0, name: 'PHASE 3: TARGET ARRIVAL', tag: 'DESTINATION', hazard: 'Arrival at destination.', details: 'Stationary at destination.' }
          ]
        }, dataEngineMission);
      }
    }
    if (!mission) mission = this.missions['apollo-11'];
    this.currentMission = mission;
    this.isActive = true;
    this.progress = 0.0;
    this.isPaused = false;
    this.isStaged = false;
    this.hasLanderPopped = false;
    this.cameraMode = 'follow';

    // 1. Disable Camera Orbit Conflicts & Freeze Planetary Movement
    this.app.focusedObject = null;
    this.app.isTracking = false;
    this.wasAppPaused = this.app.isPaused;
    this.app.isPaused = true; // Lock planetary positions during flight simulation

    // Align celestial bodies along authentic mission astrodynamics
    this.alignPlanetsForMission(normId);

    // Stop Earth axial rotation so Moon does not revolve in world space
    if (this.app.planets && this.app.planets['Earth'] && this.app.planets['Earth'].data) {
      if (this.app.planets['Earth'].data.rotationSpeedBackup === undefined) {
        this.app.planets['Earth'].data.rotationSpeedBackup = this.app.planets['Earth'].data.rotationSpeed;
      }
      this.app.planets['Earth'].data.rotationSpeed = 0;
    }

    this.hasDustRingTriggered = false;

    // Toggle Probe vs Rocket Accessories
    const isProbe = (mission.craftType === 'probe' || mission.craftType === 'space-telescope' || normId.includes('voyager') || normId.includes('cassini'));
    if (this.probeAddonGroup) this.probeAddonGroup.visible = isProbe;
    if (this.rocketNoseGroup) this.rocketNoseGroup.visible = !isProbe;
    if (this.rocketFinGroup) this.rocketFinGroup.visible = !isProbe;

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

      const destCam = new THREE.Vector3(earthPos.x + 1.2, earthPos.y + 4.6, earthPos.z + 1.4);
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
    if (t < 0.85) {
      this.hasDustRingTriggered = false;
      if (this.dustRing) {
        this.dustRing.material.opacity = 0.0;
        this.dustRing.scale.set(1.0, 1.0, 1.0);
      }
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

  // Helper: Get World Center of Destination Body
  getDestinationCenter(mission) {
    if (!mission) return null;
    const targetBody = (mission.targetBody || '').toLowerCase();
    const targetPlanet = (mission.targetPlanet || '').toLowerCase();

    if (targetBody.includes('moon')) {
      const earthObj = this.app.planets && this.app.planets['Earth'];
      if (earthObj && earthObj.moons && earthObj.moons[0]) {
        const p = new THREE.Vector3();
        earthObj.moons[0].getWorldPosition(p);
        return p;
      }
    }

    const planetKeys = ['Mars', 'Saturn', 'Jupiter', 'Earth', 'Venus', 'Mercury', 'Uranus', 'Neptune'];
    for (let k of planetKeys) {
      if (targetBody.includes(k.toLowerCase()) || targetPlanet.includes(k.toLowerCase()) || (mission.id && mission.id.toLowerCase().includes(k.toLowerCase()))) {
        const pl = this.app.planets && this.app.planets[k];
        if (pl && pl.mesh) {
          const p = new THREE.Vector3();
          pl.mesh.getWorldPosition(p);
          return p;
        }
      }
    }
    return null;
  }

  // Helper: Get Outward Surface Normal at Landing Pad
  getDestinationNormal() {
    if (!this.trajectoryPoints || this.trajectoryPoints.length === 0) {
      return new THREE.Vector3(0, 1, 0);
    }
    const destPos = this.trajectoryPoints[this.trajectoryPoints.length - 1];
    const centerPos = this.getDestinationCenter(this.currentMission);
    if (centerPos) {
      const norm = new THREE.Vector3().subVectors(destPos, centerPos).normalize();
      if (norm.lengthSq() > 0.001) return norm;
    }
    return new THREE.Vector3(0, 1, 0);
  }

  // Helper: Get Outward Surface Normal at Launch Pad (Earth)
  getLaunchNormal() {
    if (!this.trajectoryPoints || this.trajectoryPoints.length === 0) {
      return new THREE.Vector3(0, 1, 0);
    }
    const launchPos = this.trajectoryPoints[0];
    const earthObj = this.app.planets && this.app.planets['Earth'];
    if (earthObj && earthObj.mesh) {
      const earthPos = new THREE.Vector3();
      earthObj.mesh.getWorldPosition(earthPos);
      const norm = new THREE.Vector3().subVectors(launchPos, earthPos).normalize();
      if (norm.lengthSq() > 0.001) return norm;
    }
    return new THREE.Vector3(0, 1, 0);
  }

  updateRocketTransform() {
    if (!this.trajectoryCurve || !this.rocketGroup) return;

    // 1. Get raw curve position and forward tangent
    const pos = this.trajectoryCurve.getPointAt(this.progress);
    const tangent = this.trajectoryCurve.getTangentAt(Math.min(this.progress + 0.005, 1.0)).normalize();

    // 2. Compute Cruise Flight Quaternion (qFlight)
    const dummy = new THREE.Object3D();
    dummy.position.copy(pos);
    dummy.lookAt(pos.clone().add(tangent));
    dummy.rotateX(Math.PI / 2);
    const qFlight = dummy.quaternion.clone();

    // 3. Mission types
    const isDeepSpace = this.currentMission && (
      this.currentMission.targetBody === 'Deep Space' ||
      (this.currentMission.id && this.currentMission.id.includes('voyager'))
    );
    const isMoonMission = this.currentMission && (
      this.currentMission.id === 'apollo-11' ||
      (this.currentMission.id && this.currentMission.id.includes('apollo')) ||
      (this.currentMission.targetBody && this.currentMission.targetBody.toLowerCase().includes('moon')) ||
      (this.currentMission.targetPlanet && this.currentMission.targetPlanet.toLowerCase().includes('moon'))
    );

    // 4. Compute Upright Quaternion at Destination Landing Pad (qUprightLand)
    const destNormal = this.getDestinationNormal();
    const upLand = destNormal.clone().normalize();
    let fwdLand = tangent.clone();
    fwdLand.sub(upLand.clone().multiplyScalar(fwdLand.dot(upLand)));
    if (fwdLand.lengthSq() < 0.001) {
      fwdLand.set(0, 0, 1);
      fwdLand.sub(upLand.clone().multiplyScalar(fwdLand.dot(upLand)));
    }
    if (fwdLand.lengthSq() < 0.001) {
      fwdLand.set(1, 0, 0);
      fwdLand.sub(upLand.clone().multiplyScalar(fwdLand.dot(upLand)));
    }
    fwdLand.normalize();
    const rightLand = new THREE.Vector3().crossVectors(upLand, fwdLand).normalize();
    const mLand = new THREE.Matrix4().makeBasis(rightLand, upLand, fwdLand);
    const qUprightLand = new THREE.Quaternion().setFromRotationMatrix(mLand);

    // 5. Compute Upright Quaternion at Launchpad on Earth (qUprightLaunch)
    const launchNormal = this.getLaunchNormal();
    const upLaunch = launchNormal.clone().normalize();
    let fwdLaunch = tangent.clone();
    fwdLaunch.sub(upLaunch.clone().multiplyScalar(fwdLaunch.dot(upLaunch)));
    if (fwdLaunch.lengthSq() < 0.001) {
      fwdLaunch.set(0, 0, 1);
      fwdLaunch.sub(upLaunch.clone().multiplyScalar(fwdLaunch.dot(upLaunch)));
    }
    fwdLaunch.normalize();
    const rightLaunch = new THREE.Vector3().crossVectors(upLaunch, fwdLaunch).normalize();
    const mLaunch = new THREE.Matrix4().makeBasis(rightLaunch, upLaunch, fwdLaunch);
    const qUprightLaunch = new THREE.Quaternion().setFromRotationMatrix(mLaunch);

    // 6. Smoothly blend flight attitude into upright landing / liftoff attitude
    const qTarget = new THREE.Quaternion().copy(qFlight);

    // Landing flare factor: 0.0 during cruise, ramps smoothly to 1.0 upright at touchdown (t >= 0.95)
    let landFactor = 0.0;
    if (!isDeepSpace) {
      landFactor = THREE.MathUtils.smoothstep(this.progress, 0.82, 0.95);
      if (landFactor > 0.0) {
        qTarget.slerpQuaternions(qFlight, qUprightLand, landFactor);
      }
    }

    // Launch climb factor: 1.0 at pad, ramps down to 0.0 after initial liftoff
    const launchFactor = 1.0 - THREE.MathUtils.smoothstep(this.progress, 0.0, 0.08);
    if (launchFactor > 0.0) {
      qTarget.slerpQuaternions(qTarget, qUprightLaunch, launchFactor);
    }

    this.rocketGroup.quaternion.copy(qTarget);

    // 7. Base offset calculation
    // Unscaled rocket nozzle lip is at y = -0.895. With scale = 0.16, offset = 0.895 * 0.16 = 0.1432
    const rocketScale = 0.16;
    const rocketBaseOffset = 0.895 * rocketScale;
    const finalPos = pos.clone();

    // Elevation offset for launchpad on Earth
    if (launchFactor > 0.0) {
      finalPos.add(upLaunch.clone().multiplyScalar(rocketBaseOffset * launchFactor));
    }

    // Dynamic Live Moon Surface Snapping (at t >= 0.85)
    let moonObj = null;
    if (isMoonMission) {
      const earthObj = this.app.planets && this.app.planets['Earth'];
      if (earthObj && earthObj.moons && earthObj.moons[0]) {
        moonObj = earthObj.moons[0];
      }
    }

    if (isMoonMission && moonObj && this.progress >= 0.85) {
      const currentMoonPos = new THREE.Vector3();
      moonObj.getWorldPosition(currentMoonPos);

      let rMoon = 0.9;
      if (moonObj.geometry && moonObj.geometry.parameters && moonObj.geometry.parameters.radius) {
        rMoon = moonObj.geometry.parameters.radius;
      } else if (moonObj.userData && moonObj.userData.moonData && moonObj.userData.moonData.radius) {
        rMoon = moonObj.userData.moonData.radius;
      }

      // Exact physical surface touchdown formula: P_surface = P_moon + n_landing * (R_moon + rocketBaseOffset)
      const surfaceLandingPos = currentMoonPos.clone().add(upLand.clone().multiplyScalar(rMoon + rocketBaseOffset));
      const snapProgress = THREE.MathUtils.smoothstep(this.progress, 0.85, 1.0);

      finalPos.lerp(surfaceLandingPos, snapProgress);

      if (this.progress >= 0.999) {
        finalPos.copy(surfaceLandingPos);
      }

      // Lock landing beacon to live moon surface
      if (this.landingBeacon) {
        const beaconPadPos = currentMoonPos.clone().add(upLand.clone().multiplyScalar(rMoon));
        this.landingBeacon.position.copy(beaconPadPos);
      }
    } else if (!isDeepSpace && landFactor > 0.0) {
      finalPos.add(upLand.clone().multiplyScalar(rocketBaseOffset * landFactor));
    }

    this.rocketGroup.position.copy(finalPos);

    // 8. Toy rocket micro-bank/wobble (suppressed when seated on pad or flaring)
    const wobbleFactor = (1.0 - landFactor) * (1.0 - launchFactor);
    if (wobbleFactor > 0.02) {
      const wobbleZ = Math.sin(Date.now() * 0.005) * 0.05 * wobbleFactor;
      const wobbleY = Math.cos(Date.now() * 0.004) * 0.03 * wobbleFactor;
      this.rocketGroup.rotateZ(wobbleZ);
      this.rocketGroup.rotateY(wobbleY);
    }

    // 9. Engine Flame Cutoff & Dust Shockwave at t >= 0.95
    const isEngineFiring = this.progress > 0.001 && (!isDeepSpace ? this.progress < 0.95 : this.progress < 0.99);
    if (this.flamePuff1 && this.flamePuff2 && this.flamePuff3) {
      this.flamePuff1.visible = isEngineFiring;
      this.flamePuff2.visible = isEngineFiring;
      this.flamePuff3.visible = isEngineFiring;
      if (this.flamePuff4) this.flamePuff4.visible = isEngineFiring;

      if (isEngineFiring) {
        const t = Date.now() * 0.024;
        const pop1 = 1.0 + Math.sin(t) * 0.24;
        const pop2 = 1.0 + Math.cos(t * 1.3) * 0.22;
        this.flamePuff1.scale.set(pop1 * 0.9, (2.1 - pop1) * 1.25, pop1 * 0.9);
        this.flamePuff2.scale.set((2.0 - pop2) * 0.85, pop2 * 1.1, (2.0 - pop2) * 0.85);
        this.flamePuff3.scale.set(pop1 * 0.75, pop2 * 0.85, pop1 * 0.75);
        if (this.flamePuff4) {
          this.flamePuff4.position.y = -1.35 - Math.sin(t * 1.2) * 0.15;
          this.flamePuff4.scale.setScalar(0.7 + Math.cos(t * 1.5) * 0.3);
        }
      }
    }

    // Regolith chalk dust ring shockwave at touchdown
    if (!isDeepSpace && this.progress >= 0.95) {
      this.triggerDustRing();
    }

    // 10. Destination Chalk Landing Beacon & Pop-up Lander
    if (this.landingBeacon) {
      const showLanding = !isDeepSpace && this.progress >= 0.80;
      this.landingBeacon.visible = showLanding;
      if (showLanding) {
        if (!isMoonMission && this.trajectoryPoints.length > 0) {
          const destPos = this.trajectoryPoints[this.trajectoryPoints.length - 1];
          this.landingBeacon.position.copy(destPos);
        }

        const defaultBeaconUp = new THREE.Vector3(0, 1, 0);
        this.landingBeacon.quaternion.setFromUnitVectors(defaultBeaconUp, destNormal);

        // Pop-up Lander bounce animation & resting lander display at t = 1.0
        if (!this.hasLanderPopped && window.TWEEN && this.chalkLander) {
          this.hasLanderPopped = true;
          this.chalkLander.scale.set(0.001, 0.001, 0.001);
          new TWEEN.Tween(this.chalkLander.scale)
            .to({ x: 1, y: 1, z: 1 }, 700)
            .easing(TWEEN.Easing.Back.Out)
            .start();
        } else if (this.progress >= 0.999 && this.chalkLander) {
          this.chalkLander.scale.set(1, 1, 1);
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

    // Update delicate chalk dust particles
    if (this.particles) {
      this.particles.forEach(p => {
        if (!p.visible) return;
        p.userData.life += delta;
        if (p.userData.life >= p.userData.maxLife) {
          p.visible = false;
        } else {
          p.position.addScaledVector(p.userData.vel, delta);
          const lifeFraction = p.userData.life / p.userData.maxLife;
          p.material.opacity = (1.0 - lifeFraction) * 0.85;
          p.scale.setScalar(1.0 + lifeFraction * 0.9);
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
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15
        ));
        p.userData.life = 0;
        p.userData.maxLife = 0.65;
        p.userData.vel.set(
          (Math.random() - 0.5) * 0.35,
          (Math.random() - 0.5) * 0.35,
          (Math.random() - 0.5) * 0.35
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

        const stageAPos = new THREE.Vector3(earthPos.x + 1.2, earthPos.y + 4.6, earthPos.z + 1.4);
        this.camera.position.lerp(stageAPos, 0.06);
        this.controls.target.lerp(rocketPos, 0.12);

      } else if (this.progress >= 0.90) {
        // Stage C (Arrival & Landing Site Climax): Tight intimate framing on destination landing site
        if (this.trajectoryPoints.length > 0) {
          const destPos = this.rocketGroup.position;
          const destCamOffset = new THREE.Vector3(1.1, 0.7, 1.2);
          const desiredDestCam = destPos.clone().add(destCamOffset);

          this.camera.position.lerp(desiredDestCam, 0.06);
          this.controls.target.lerp(destPos, 0.12);
        }

      } else {
        // Stage B (Interplanetary Chase Cam): Intimate close-up view showcasing cute rocket details
        const tangent = this.trajectoryCurve.getTangentAt(Math.min(this.progress + 0.005, 1.0));
        const up = new THREE.Vector3(0, 1, 0);
        let side = new THREE.Vector3().crossVectors(tangent, up).normalize();
        if (side.lengthSq() < 0.01) {
          side = new THREE.Vector3(1, 0, 0);
        }

        const camOffset = tangent.clone().negate().multiplyScalar(1.6)
          .add(side.multiplyScalar(0.55))
          .add(new THREE.Vector3(0, 0.45, 0));
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
      } else if (latencySec < 3600) {
        const mins = Math.floor(latencySec / 60);
        const secs = Math.round(latencySec % 60);
        latencyValEl.textContent = `${mins}m ${secs}s`;
      } else {
        const hours = Math.floor(latencySec / 3600);
        const mins = Math.floor((latencySec % 3600) / 60);
        latencyValEl.textContent = `${hours}h ${mins}m`;
      }
    }

    // Power remaining (Fuel for chemical rockets, radioactive decay for RTG nuclear probes)
    const isProbe = (mission.craftType === 'probe' || mission.craftType === 'space-telescope' || (mission.id && (mission.id.includes('voyager') || mission.id.includes('cassini'))));
    if (isProbe) {
      const rtgPct = Math.max(38, Math.round(100 - (this.progress * 58)));
      if (fuelValEl) fuelValEl.textContent = `${rtgPct}% (RTG)`;
    } else {
      const fuelPct = Math.max(0, Math.round(100 - (this.progress * 82)));
      if (fuelValEl) fuelValEl.textContent = `${fuelPct}%`;
    }

    // Update Interactive Accordions (Payloads & Scorecard)
    const payloadsBody = document.getElementById('fth-body-payloads');
    if (payloadsBody) {
      if (mission.scientificPayloads && mission.scientificPayloads.length > 0) {
        payloadsBody.innerHTML = mission.scientificPayloads.map(p => `
          <div class="fth-payload-card">
            <div class="fth-payload-head">
              <span class="fth-payload-name">${p.name}</span>
              <span class="fth-payload-acronym">${p.acronym}</span>
            </div>
            <p class="fth-payload-purpose">${p.purpose}</p>
          </div>
        `).join('');
      } else {
        payloadsBody.innerHTML = '<p class="fth-payload-purpose">Telemetry sensors & communication transponders.</p>';
      }
    }

    const scorecardBody = document.getElementById('fth-body-scorecard');
    if (scorecardBody) {
      const sc = mission.scorecard || {
        surfaceSols: mission.solsActive || 'N/A',
        distanceTraversed: mission.distanceTotalKm ? `${(mission.distanceTotalKm / 1e6).toFixed(1)}M km` : 'N/A',
        massLeftBehind: 'Hardware Abandoned',
        sampleMassReturned: 'Data Transmitted'
      };
      scorecardBody.innerHTML = `
        <div class="fth-scorecard-grid">
          <div class="fth-scorecard-item">
            <div class="fth-scorecard-label">Sols on Surface</div>
            <div class="fth-scorecard-val">${sc.surfaceSols}</div>
          </div>
          <div class="fth-scorecard-item">
            <div class="fth-scorecard-label">Distance Traversed</div>
            <div class="fth-scorecard-val">${sc.distanceTraversed}</div>
          </div>
          <div class="fth-scorecard-item">
            <div class="fth-scorecard-label">Mass Left Behind</div>
            <div class="fth-scorecard-val">${sc.massLeftBehind}</div>
          </div>
          <div class="fth-scorecard-item">
            <div class="fth-scorecard-label">Sample Mass Returned</div>
            <div class="fth-scorecard-val">${sc.sampleMassReturned}</div>
          </div>
        </div>
      `;
    }

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

        const coordsLbl = document.getElementById('fth-mem-coords-label');
        const dateLbl = document.getElementById('fth-mem-date-label');
        const solsLbl = document.getElementById('fth-mem-sols-label');

        const isDeepSpace = (mission.targetBody === 'Deep Space' || mission.targetPlanet === 'Interstellar' || (mission.id && mission.id.includes('voyager')));
        if (isDeepSpace) {
          if (coordsLbl) coordsLbl.textContent = 'Current Region:';
          if (dateLbl) dateLbl.textContent = 'Heliopause Crossed:';
          if (solsLbl) solsLbl.textContent = 'Mission Life:';
        } else if (mission.targetBody === 'Saturn') {
          if (coordsLbl) coordsLbl.textContent = 'Entry Location:';
          if (dateLbl) dateLbl.textContent = 'Grand Finale:';
          if (solsLbl) solsLbl.textContent = 'Flight Time:';
        } else {
          if (coordsLbl) coordsLbl.textContent = 'Coordinates:';
          if (dateLbl) dateLbl.textContent = 'Landing Date:';
          if (solsLbl) solsLbl.textContent = 'Operational Life:';
        }

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
    if (this.secondaryChalkLine) this.secondaryChalkLine.visible = false;
    if (this.activeTrailMesh) this.activeTrailMesh.visible = false;
    if (this.waypointGroup) this.waypointGroup.visible = false;

    // Reset probe accessory toggles
    if (this.probeAddonGroup) this.probeAddonGroup.visible = false;
    if (this.rocketNoseGroup) this.rocketNoseGroup.visible = true;
    if (this.rocketFinGroup) this.rocketFinGroup.visible = true;

    if (this.particles) {
      this.particles.forEach(p => p.visible = false);
    }

    // Restore planetary orbits & Earth axial rotation
    if (this.wasAppPaused !== undefined) {
      this.app.isPaused = this.wasAppPaused;
    }
    if (this.app.planets && this.app.planets['Earth'] && this.app.planets['Earth'].data) {
      if (this.app.planets['Earth'].data.rotationSpeedBackup !== undefined) {
        this.app.planets['Earth'].data.rotationSpeed = this.app.planets['Earth'].data.rotationSpeedBackup;
        delete this.app.planets['Earth'].data.rotationSpeedBackup;
      }
    }
    this.restorePlanetPositions();

    if (this.dustRing) {
      this.dustRing.material.opacity = 0.0;
      this.dustRing.scale.set(1.0, 1.0, 1.0);
    }
    this.hasDustRingTriggered = false;

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
