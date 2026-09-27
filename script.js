/**
 * ============================================================================
 * SOLAR SYSTEM OBSERVATION SYSTEM // SCRIPT
 * Stylized 3D Cartoon Illustration Art Style (Pixar / Animated Film Aesthetic)
 * ============================================================================
 */

// --- CELESTIAL DATA REPOSITORY ---
const CELESTIAL_DATA = {
  Sun: {
    name: 'Sun',
    type: 'Yellow Dwarf Star (G2V)',
    tagline: 'Heart of the Solar System & 99.86% of its total mass',
    radius: 20,
    distance: 0,
    speed: 0,
    rotationSpeed: 0.002,
    tilt: 0.12,
    color: '#ffaa00',
    colorHex: 0xffaa00,
    diameter: '1,392,700 km',
    mass: '1.989 × 10³⁰ kg',
    gravity: '274.0 m/s² (27.9 g)',
    density: '1.41 g/cm³',
    temp: '5,500°C',
    tempRange: '5,500°C to 15,000,000°C',
    escapeVelocity: '617.7 km/s',
    atmosphere: [
      { gas: 'Hydrogen (H₂)', percent: 73.4 },
      { gas: 'Helium (He)', percent: 24.8 },
      { gas: 'Oxygen & Carbon', percent: 1.2 },
      { gas: 'Iron & Neon', percent: 0.6 }
    ],
    distFromSun: '0 AU (Center)',
    orbitPeriod: '230 Million Years',
    rotationPeriod: '27 Earth Days',
    orbitSpeed: '220 km/s (Galactic)',
    eccentricity: '0.000',
    inclination: '7.25°',
    moons: '8 Planets + Thousands of bodies',
    description: 'The Sun is an almost perfect sphere of superheated plasma at the gravitational center of our Solar System. Powered by nuclear fusion in its core, it radiates colossal energy into space, driving weather, climate, and life.',
    facts: [
      'Contains about 99.86% of the total mass of the entire Solar System.',
      'Fuses approximately 600 million tons of hydrogen into helium every second.',
      'About 1.3 million Earths could fit comfortably inside the Sun.',
      'Solar wind produces the protective heliosphere bubble shielding us from interstellar radiation.'
    ]
  },
  Mercury: {
    name: 'Mercury',
    type: 'Terrestrial Planet',
    tagline: 'The swift, cratered innermost scorched world',
    radius: 2.3,
    distance: 40,
    speed: 0.04,
    rotationSpeed: 0.005,
    tilt: 0.034,
    color: '#a8a29e',
    colorHex: 0x8b5cf6,
    diameter: '4,879 km',
    mass: '3.301 × 10²³ kg',
    gravity: '3.7 m/s² (0.38 g)',
    density: '5.43 g/cm³',
    temp: '167°C',
    tempRange: '-180°C to +430°C',
    escapeVelocity: '4.25 km/s',
    atmosphere: [
      { gas: 'Oxygen (O₂)', percent: 42.0 },
      { gas: 'Sodium (Na)', percent: 29.0 },
      { gas: 'Hydrogen (H₂)', percent: 22.0 },
      { gas: 'Helium (He)', percent: 6.0 }
    ],
    distFromSun: '0.39 AU (57.9M km)',
    orbitPeriod: '88 Earth Days',
    rotationPeriod: '58.6 Earth Days',
    orbitSpeed: '47.36 km/s',
    eccentricity: '0.2056',
    inclination: '7.00°',
    moons: '0',
    description: 'Mercury is the smallest planet and closest to the Sun. Its cratered crust covers a huge metallic iron core. Lacking an atmosphere to retain heat, it suffers the most extreme temperature swings in the Solar System.',
    facts: [
      'Orbits the Sun faster than any other planet at nearly 47 km/s.',
      'Has a massive iron core making up about 75% of its total diameter.',
      'Experiences double sunrises and sunsets from certain locations.',
      'Water ice deposits survive inside permanently shadowed polar craters.'
    ]
  },
  Venus: {
    name: 'Venus',
    type: 'Terrestrial Planet',
    tagline: 'Volcanic sister planet engulfed in runaway greenhouse inferno',
    radius: 3.5,
    distance: 65,
    speed: 0.015,
    rotationSpeed: -0.002,
    tilt: 3.1,
    color: '#fb923c',
    colorHex: 0xfb923c,
    diameter: '12,104 km',
    mass: '4.867 × 10²⁴ kg',
    gravity: '8.87 m/s² (0.90 g)',
    density: '5.24 g/cm³',
    temp: '465°C',
    tempRange: '462°C to 470°C',
    escapeVelocity: '10.36 km/s',
    atmosphere: [
      { gas: 'Carbon Dioxide (CO₂)', percent: 96.5 },
      { gas: 'Nitrogen (N₂)', percent: 3.5 },
      { gas: 'Sulfur Dioxide (SO₂)', percent: 0.015 }
    ],
    distFromSun: '0.72 AU (108.2M km)',
    orbitPeriod: '224.7 Earth Days',
    rotationPeriod: '243 Earth Days (Retrograde)',
    orbitSpeed: '35.02 km/s',
    eccentricity: '0.0067',
    inclination: '3.39°',
    moons: '0',
    description: 'Venus is nearly identical to Earth in size and mass, but possesses an infernal surface pressure 92 times greater than Earth’s. Super-dense clouds of sulfuric acid trap solar heat relentlessly, making it hotter even than Mercury.',
    facts: [
      'Rotates backwards (retrograde) compared to almost every other planet.',
      'A single Venusian day is longer than its entire orbital year around the Sun.',
      'Atmospheric pressure on the surface is equivalent to being 900 meters underwater on Earth.',
      'Brightest natural object in our night sky aside from the Moon.'
    ]
  },
  Earth: {
    name: 'Earth',
    type: 'Terrestrial Planet',
    tagline: 'The Blue Marble, dynamic biosphere & cradle of human civilization',
    radius: 3.9,
    distance: 95,
    speed: 0.01,
    rotationSpeed: 0.01,
    tilt: 0.41,
    color: '#0284c7',
    colorHex: 0x0284c7,
    diameter: '12,742 km',
    mass: '5.972 × 10²⁴ kg',
    gravity: '9.81 m/s² (1.00 g)',
    density: '5.51 g/cm³',
    temp: '15°C',
    tempRange: '-89°C to +57°C',
    escapeVelocity: '11.19 km/s',
    atmosphere: [
      { gas: 'Nitrogen (N₂)', percent: 78.1 },
      { gas: 'Oxygen (O₂)', percent: 20.9 },
      { gas: 'Argon (Ar)', percent: 0.93 },
      { gas: 'Carbon Dioxide & Trace', percent: 0.04 }
    ],
    distFromSun: '1.00 AU (149.6M km)',
    orbitPeriod: '365.25 Days',
    rotationPeriod: '24 Hours',
    orbitSpeed: '29.78 km/s',
    eccentricity: '0.0167',
    inclination: '0.00°',
    moons: '1 (The Moon)',
    description: 'Earth is our home oasis, the third planet from the Sun and the only world confirmed to harbor life. Liquid water oceans cover over 71% of its surface, stabilized by an active magnetosphere and dynamic oxygenated atmosphere.',
    facts: [
      'Possesses oceans of liquid surface water in continuous dynamic equilibrium.',
      'Its molten iron core drives a geomagnetic shield deflecting lethal solar cosmic rays.',
      'The Moon stabilizes Earth\'s axial tilt, keeping the global climate stable over millions of years.',
      'Earth is the densest major planet in the entire Solar System.'
    ],
    moonList: [
      { name: 'Moon', radius: 1.05, distance: 7.5, speed: 0.038, color: 0xc4b5fd, desc: 'Earth’s natural satellite, driving oceanic tides.' }
    ]
  },
  Mars: {
    name: 'Mars',
    type: 'Terrestrial Planet',
    tagline: 'The Red Planet & humanity’s next interplanetary frontier',
    radius: 2.8,
    distance: 130,
    speed: 0.008,
    rotationSpeed: 0.009,
    tilt: 0.44,
    color: '#f97316',
    colorHex: 0xf97316,
    diameter: '6,779 km',
    mass: '6.417 × 10²³ kg',
    gravity: '3.72 m/s² (0.38 g)',
    density: '3.93 g/cm³',
    temp: '-63°C',
    tempRange: '-140°C to +20°C',
    escapeVelocity: '5.03 km/s',
    atmosphere: [
      { gas: 'Carbon Dioxide (CO₂)', percent: 95.3 },
      { gas: 'Nitrogen (N₂)', percent: 2.6 },
      { gas: 'Argon (Ar)', percent: 1.9 }
    ],
    distFromSun: '1.52 AU (227.9M km)',
    orbitPeriod: '687 Earth Days',
    rotationPeriod: '24.6 Hours',
    orbitSpeed: '24.07 km/s',
    eccentricity: '0.0934',
    inclination: '1.85°',
    moons: '2 (Phobos, Deimos)',
    description: 'Mars is a cold, dusty desert world wrapped in a thin carbon dioxide atmosphere. Its iconic reddish color comes from pervasive iron oxide (rust). It hosts immense shield volcanoes and canyons deeper than any on Earth.',
    facts: [
      'Olympus Mons stands 21.9 km high, over 2.5 times the height of Mount Everest.',
      'Valles Marineris stretches 4,000 km across the equator, 4 times deeper than the Grand Canyon.',
      'Houses dual polar ice caps composed of water ice and seasonal frozen carbon dioxide.',
      'Robotic exploration has confirmed ancient river deltas, lakes, and organic compounds.'
    ],
    moonList: [
      { name: 'Phobos', radius: 0.52, distance: 4.8, speed: 0.065, color: 0xa78bfa, desc: 'Closest moon, orbiting just 6,000 km above Mars.' },
      { name: 'Deimos', radius: 0.42, distance: 6.8, speed: 0.035, color: 0x818cf8, desc: 'Outer, tiny captured asteroid.' }
    ]
  },
  Jupiter: {
    name: 'Jupiter',
    type: 'Gas Giant',
    tagline: 'King of the planets & colossal gravitational shield',
    radius: 9.8,
    distance: 195,
    speed: 0.004,
    rotationSpeed: 0.02,
    tilt: 0.05,
    color: '#ea580c',
    colorHex: 0x7e22ce,
    diameter: '139,820 km',
    mass: '1.898 × 10²⁷ kg',
    gravity: '24.79 m/s² (2.53 g)',
    density: '1.33 g/cm³',
    temp: '-110°C',
    tempRange: '-145°C to +24,000°C',
    escapeVelocity: '59.5 km/s',
    atmosphere: [
      { gas: 'Hydrogen (H₂)', percent: 89.8 },
      { gas: 'Helium (He)', percent: 10.2 },
      { gas: 'Methane (CH₄)', percent: 0.3 }
    ],
    distFromSun: '5.20 AU (778.5M km)',
    orbitPeriod: '11.86 Earth Years',
    rotationPeriod: '9.93 Hours',
    orbitSpeed: '13.07 km/s',
    eccentricity: '0.0489',
    inclination: '1.30°',
    moons: '95 confirmed',
    description: 'Jupiter is the largest planet in our Solar System, with more than twice the combined mass of all other planets combined. Beneath its turbulent, swirling atmospheric bands lies a vast ocean of liquid metallic hydrogen.',
    facts: [
      'The Great Red Spot is a monster storm raging for over 300 years, wider than Earth.',
      'Executes the fastest rotation of any planet, with a day lasting under 10 hours.',
      'Ganymede, its largest moon, is larger than planet Mercury.',
      'Europa conceals a vast liquid ocean beneath its icy shell containing twice Earth’s water.'
    ],
    moonList: [
      { name: 'Io', radius: 0.75, distance: 13.5, speed: 0.052, color: 0xfacc15, desc: 'Volcanic pizza moon with glowing eruption calderas.' },
      { name: 'Europa', radius: 0.68, distance: 17.0, speed: 0.038, color: 0x99f6e4, desc: 'Conceals a vast global subsurface saltwater ocean.' },
      { name: 'Ganymede', radius: 0.98, distance: 21.0, speed: 0.026, color: 0xc4b5fd, desc: 'Largest moon in the Solar System, bigger than Mercury.' },
      { name: 'Callisto', radius: 0.88, distance: 25.5, speed: 0.018, color: 0x7c3aed, desc: 'Deep purple-gray world with bright polka-dot craters.' }
    ]
  },
  Saturn: {
    name: 'Saturn',
    type: 'Gas Giant',
    tagline: 'The Ringed Marvel & least dense world in the planetary family',
    radius: 8.4,
    distance: 255,
    speed: 0.003,
    rotationSpeed: 0.018,
    tilt: 0.47,
    hasRings: true,
    ringInner: 11,
    ringOuter: 23,
    color: '#fde047',
    colorHex: 0xfde047,
    diameter: '116,460 km',
    mass: '5.683 × 10²⁶ kg',
    gravity: '10.44 m/s² (1.06 g)',
    density: '0.687 g/cm³',
    temp: '-140°C',
    tempRange: '-178°C to +11,700°C',
    escapeVelocity: '35.5 km/s',
    atmosphere: [
      { gas: 'Hydrogen (H₂)', percent: 96.3 },
      { gas: 'Helium (He)', percent: 3.25 },
      { gas: 'Methane (CH₄)', percent: 0.45 }
    ],
    distFromSun: '9.58 AU (1.43B km)',
    orbitPeriod: '29.45 Earth Years',
    rotationPeriod: '10.7 Hours',
    orbitSpeed: '9.68 km/s',
    eccentricity: '0.0565',
    inclination: '2.49°',
    moons: '146 confirmed',
    description: 'Saturn is the second-largest planet in the Solar System, world-renowned for its dazzling icy rings spanning up to 282,000 kilometers across yet only tens of meters thick. Its density is lower than liquid water.',
    facts: [
      'The ring system consists of billions of particles of pure water ice and rock.',
      'Saturn is so low in average density that it would float in water.',
      'Titan is the only moon with a dense nitrogen atmosphere and liquid methane lakes.',
      'Enceladus sprays plumes of water vapor and organic molecules into space from geysers.'
    ],
    moonList: [
      { name: 'Titan', radius: 0.95, distance: 27, speed: 0.022, color: 0xfb923c, desc: 'Warm peach-orange nitrogen atmosphere with liquid methane seas.' },
      { name: 'Enceladus', radius: 0.55, distance: 18, speed: 0.042, color: 0xf8fafc, desc: 'Icy geyser world with underground warm ocean.' }
    ]
  },
  Uranus: {
    name: 'Uranus',
    type: 'Ice Giant',
    tagline: 'The aquamarine ice giant revolving tilted completely on its side',
    radius: 5.7,
    distance: 310,
    speed: 0.002,
    rotationSpeed: -0.012,
    tilt: 1.71,
    hasRings: true,
    ringInner: 7.8,
    ringOuter: 11.2,
    color: '#06b6d4',
    colorHex: 0x06b6d4,
    diameter: '50,724 km',
    mass: '8.681 × 10²⁵ kg',
    gravity: '8.69 m/s² (0.89 g)',
    density: '1.27 g/cm³',
    temp: '-195°C',
    tempRange: '-224°C to -195°C',
    escapeVelocity: '21.3 km/s',
    atmosphere: [
      { gas: 'Hydrogen (H₂)', percent: 82.5 },
      { gas: 'Helium (He)', percent: 15.2 },
      { gas: 'Methane (CH₄)', percent: 2.3 }
    ],
    distFromSun: '19.2 AU (2.87B km)',
    orbitPeriod: '84.0 Earth Years',
    rotationPeriod: '17.2 Hours (Retrograde)',
    orbitSpeed: '6.80 km/s',
    eccentricity: '0.0463',
    inclination: '0.77°',
    moons: '28 confirmed',
    description: 'Uranus is an aquamarine ice giant dominated by water, ammonia, and methane over a rocky core. Methane gas filters out red light, giving the planet its serene pastel cyan luster. It uniquely orbits knocked 98° on its side.',
    facts: [
      'Orbits with an extreme 98° axial tilt, causing 21-year-long seasonal extremes.',
      'Holds the record for the coldest recorded atmospheric temperature at -224°C.',
      'Possesses 13 faint, dark vertical rings orbiting along its sideways tilted equator.',
      'First planet discovered in modern history using a telescope (1781).'
    ],
    moonList: [
      { name: 'Titania', radius: 0.65, distance: 14, speed: 0.026, color: 0x67e8f9, desc: 'Largest moon of Uranus, marked with fault canyons.' },
      { name: 'Miranda', radius: 0.48, distance: 9.5, speed: 0.045, color: 0xa7f3d0, desc: 'Topographic wonderland with Verona Rupes cliff.' }
    ]
  },
  Neptune: {
    name: 'Neptune',
    type: 'Ice Giant',
    tagline: 'Deep azure realm lashed by the fastest supersonic gales',
    radius: 5.5,
    distance: 360,
    speed: 0.0014,
    rotationSpeed: 0.014,
    tilt: 0.49,
    color: '#2563eb',
    colorHex: 0x4338ca,
    diameter: '49,244 km',
    mass: '1.024 × 10²⁶ kg',
    gravity: '11.15 m/s² (1.14 g)',
    density: '1.64 g/cm³',
    temp: '-200°C',
    tempRange: '-218°C to +7,000°C',
    escapeVelocity: '23.5 km/s',
    atmosphere: [
      { gas: 'Hydrogen (H₂)', percent: 80.0 },
      { gas: 'Helium (He)', percent: 19.0 },
      { gas: 'Methane (CH₄)', percent: 1.5 }
    ],
    distFromSun: '30.1 AU (4.50B km)',
    orbitPeriod: '164.8 Earth Years',
    rotationPeriod: '16.1 Hours',
    orbitSpeed: '5.43 km/s',
    eccentricity: '0.0095',
    inclination: '1.77°',
    moons: '16 confirmed',
    description: 'Neptune is the eighth and outermost planet from the Sun, an intense cobalt blue ice giant engulfed in supersonic storms exceeding 2,100 km/h. It was the first planet located through mathematical prediction before telescope observation.',
    facts: [
      'Windiest world in the Solar System with supersonic winds exceeding Mach 1.6.',
      'Triton orbits Neptune backwards and possesses active liquid nitrogen cryovolcanoes.',
      'Takes almost 165 Earth years to complete a single orbital circuit around the Sun.',
      'Discovered in 1846 following mathematical calculations by Le Verrier and Adams.'
    ],
    moonList: [
      { name: 'Triton', radius: 0.72, distance: 13.5, speed: -0.028, color: 0x93c5fd, desc: 'Giant retrograde moon with active nitrogen ice volcanoes.' }
    ]
  }
};

const PLANET_ORDER = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

// ============================================================================
// AUDIO SYSTEM (space sound.mp3 ambient + Web Audio API UI sounds)
// ============================================================================
class SpaceSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.ambientSound = new Audio('space sound.mp3');
    this.ambientSound.loop = true;
    this.ambientSound.volume = 0.28;
    this.isMuted = false;
    this.hasInteracted = false;

    const unlockAudio = () => {
      if (!this.hasInteracted) {
        this.hasInteracted = true;
        this.initContext();
        if (!this.isMuted) {
          this.ambientSound.play().catch(e => console.log('Autoplay prevented:', e));
        }
      }
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.ambientSound.pause();
    } else {
      this.ambientSound.play().catch(e => console.log('Audio error:', e));
    }
    return !this.isMuted;
  }

  playUI(type) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'tab') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.setValueAtTime(940, now + 0.03);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'confirm') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.12);
      osc2.frequency.setValueAtTime(659.25, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.16);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now + 0.05);
      osc1.stop(now + 0.22);
      osc2.stop(now + 0.22);
    } else if (type === 'close') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'toggle') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(740, now);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  }
}

// ============================================================================
// STYLIZED 3D CARTOON ILLUSTRATION TEXTURE GENERATOR
// ============================================================================
const TextureGenerator = {
  // Saturated cartoon ramp with deep violet shadow -> vivid indigo -> bright highlight
  createToonGradientMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 4;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const colors = ['#1e1b4b', '#4338ca', '#a5b4fc', '#ffffff'];
    colors.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(i, 0, 1, 1);
    });
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    return tex;
  },

  // SUN: Large vibrant yellow/orange body, stylized flame shapes & layered arches
  createSunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Vibrant sunny golden-yellow base
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.2, '#fde047');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(0.8, '#ea580c');
    grad.addColorStop(1, '#fde047');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Stylized bold cartoon solar flame swirls and arches
    const flameColors = ['#f97316', '#ef4444', '#fde047', '#fed7aa'];
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = flameColors[i % flameColors.length];
      ctx.beginPath();
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = Math.random() * 40 + 15;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Stylized inner ring
      ctx.strokeStyle = '#fffbeb';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Bold decorative flame curves
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 6;
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      const y = Math.random() * 512;
      ctx.ellipse(Math.random() * 1024, y, Math.random() * 120 + 40, Math.random() * 25 + 10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  },

  // MERCURY: Playful slate-purple / lavender with bold circular cartoon craters & highlights
  createMercuryTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Soft violet-slate cartoon base
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(0, 0, 512, 256);

    // Lighter lilac terrain patches
    ctx.fillStyle = '#8b5cf6';
    for (let i = 0; i < 16; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 256, Math.random() * 70 + 30, Math.random() * 40 + 20, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bold cartoon craters with rim highlights & shadow crescent
    for (let i = 0; i < 45; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const r = Math.random() * 16 + 5;

      // Dark purple interior shadow
      ctx.fillStyle = '#4c1d95';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Crisp pastel lilac rim highlight
      ctx.strokeStyle = '#ddd6fe';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(x - r * 0.2, y - r * 0.2, r * 0.9, Math.PI * 0.7, Math.PI * 1.8);
      ctx.stroke();

      // Cartoon crater center pip
      ctx.fillStyle = '#2e1065';
      ctx.beginPath();
      ctx.arc(x + r * 0.2, y + r * 0.2, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  },

  // VENUS: Warm creamsicle cartoon world with bold butterscotch, apricot & peach ribbons
  createVenusTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Warm apricot base
    ctx.fillStyle = '#f97316';
    ctx.fillRect(0, 0, 512, 256);

    // Alternating smooth cartoon bands of peach, butterscotch, and cream
    const bands = ['#fb923c', '#fde047', '#fbbf24', '#fed7aa', '#f43f5e', '#fde047'];
    bands.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      const y = idx * (256 / bands.length);
      ctx.fillRect(0, y, 512, 256 / bands.length);
    });

    // Flowing bold wavy cartoon cloud ribbons
    ctx.fillStyle = '#fff7ed';
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      const y = Math.random() * 256;
      ctx.ellipse(Math.random() * 512, y, Math.random() * 140 + 60, Math.random() * 16 + 6, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const y = Math.random() * 256;
      ctx.ellipse(256, y, 240, Math.random() * 20 + 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  },

  // EARTH: Recognizable world map rendered in vibrant 3D cartoon illustration aesthetic!
  createEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Rich cartoon cerulean blue ocean
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 2048, 1024);

    // Function to draw cartoon continents with turquoise coastal border and drop-stroke
    const drawCartoonLand = (coords, landColor) => {
      // 1. Thick cartoon turquoise coastal outline
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 28;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      coords.forEach((pt, idx) => {
        const x = (pt[0] / 360 + 0.5) * 2048;
        const y = (-pt[1] / 180 + 0.5) * 1024;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();

      // 2. Solid bold emerald-green cartoon land fill
      ctx.fillStyle = landColor;
      ctx.beginPath();
      coords.forEach((pt, idx) => {
        const x = (pt[0] / 360 + 0.5) * 2048;
        const y = (-pt[1] / 180 + 0.5) * 1024;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
    };

    // North America
    const northAmerica = [
      [-168, 66], [-160, 71], [-130, 70], [-95, 73], [-80, 70], [-60, 60],
      [-55, 50], [-65, 44], [-75, 35], [-80, 25], [-82, 23], [-90, 30],
      [-97, 26], [-97, 20], [-88, 16], [-83, 10], [-77, 8], [-85, 12],
      [-95, 16], [-105, 23], [-115, 32], [-124, 40], [-125, 49], [-135, 57],
      [-165, 60], [-168, 66]
    ];
    drawCartoonLand(northAmerica, '#10b981');

    // South America
    const southAmerica = [
      [-77, 8], [-60, 10], [-50, 0], [-35, -5], [-37, -12], [-40, -22],
      [-50, -30], [-58, -38], [-65, -54], [-75, -52], [-73, -40], [-71, -30],
      [-76, -18], [-81, -5], [-77, 8]
    ];
    drawCartoonLand(southAmerica, '#10b981');

    // Eurasia
    const eurasia = [
      [-10, 36], [0, 43], [5, 52], [10, 58], [25, 71], [40, 68],
      [70, 73], [105, 77], [140, 72], [170, 66], [140, 50], [130, 40],
      [120, 32], [110, 20], [100, 10], [90, 22], [80, 10], [70, 24],
      [55, 25], [45, 13], [35, 30], [28, 41], [15, 38], [0, 36], [-10, 36]
    ];
    drawCartoonLand(eurasia, '#059669');

    // Africa (warm savanna golden-ochre cartoon tone)
    const africa = [
      [-17, 15], [-5, 36], [10, 37], [25, 32], [35, 30], [44, 12],
      [51, 10], [40, -5], [35, -20], [26, -34], [18, -34], [12, -18],
      [8, 4], [-15, 11], [-17, 15]
    ];
    drawCartoonLand(africa, '#d97706');

    // Australia
    const australia = [
      [114, -22], [123, -15], [136, -12], [142, -11], [150, -23],
      [153, -28], [147, -38], [138, -35], [128, -32], [115, -34],
      [113, -26], [114, -22]
    ];
    drawCartoonLand(australia, '#f59e0b');

    // Pure white cartoon polar ice caps
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 890, 2048, 134);
    ctx.beginPath();
    ctx.ellipse(820, 120, 140, 85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stylized puffy cartoon cloud shapes with subtle drop shadows
    const clouds = [
      { x: 380, y: 320, r: 45 },
      { x: 420, y: 310, r: 60 },
      { x: 470, y: 325, r: 40 },
      { x: 920, y: 220, r: 50 },
      { x: 960, y: 200, r: 65 },
      { x: 1010, y: 220, r: 45 },
      { x: 1420, y: 440, r: 55 },
      { x: 1470, y: 420, r: 70 },
      { x: 1530, y: 440, r: 45 }
    ];

    // Shadow pass
    ctx.fillStyle = 'rgba(2, 60, 110, 0.35)';
    clouds.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x + 8, c.y + 12, c.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // White cloud pass
    ctx.fillStyle = '#ffffff';
    clouds.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });

    return new THREE.CanvasTexture(canvas);
  },

  // Outer rotating cartoon cloud sphere
  createEarthCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1024, 512);

    // Puffy rounded cartoon clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 35; i++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 512;
      const r = Math.random() * 25 + 15;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.arc(cx + r * 0.7, cy - r * 0.2, r * 1.2, 0, Math.PI * 2);
      ctx.arc(cx + r * 1.5, cy, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  },

  // MARS: Vibrant sunset orange & coral-red terrain with bold cartoon craters & white polar caps
  createMarsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Saturated cartoon coral-red base
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, 512, 256);

    // Stylized warm sunset orange patches
    ctx.fillStyle = '#f97316';
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 256, Math.random() * 80 + 30, Math.random() * 35 + 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bold darker crimson-purple craters and canyons
    ctx.fillStyle = '#881337';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const r = Math.random() * 15 + 4;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Cartoon highlight edge
      ctx.strokeStyle = '#fed7aa';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(x - r * 0.2, y - r * 0.2, r * 0.85, Math.PI * 0.8, Math.PI * 1.8);
      ctx.stroke();
    }

    // Stylized Valles Marineris canyon stripe
    ctx.strokeStyle = '#4c0519';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(180, 130);
    ctx.lineTo(340, 145);
    ctx.stroke();

    // Pure white cartoon polar caps
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(256, 10, 80, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(256, 246, 70, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  },

  // JUPITER: Bold colorful horizontal/curved bands (purple, orange, cream, coral) + Great Red Spot!
  createJupiterTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Bold saturated cartoon gas bands: deep royal purple, fiery orange, coral, vanilla cream
    const bands = [
      '#581c87', // deep purple
      '#ea580c', // fiery orange
      '#fffbeb', // cream
      '#7e22ce', // bright purple
      '#f97316', // bright orange
      '#f43f5e', // coral pink
      '#fed7aa', // pastel peach
      '#6b21a8', // purple
      '#ea580c', // fiery orange
      '#fffbeb'  // cream
    ];

    const h = 512 / bands.length;
    bands.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, i * h, 1024, h + 2);

      // Wavy cartoon boundary accent
      ctx.strokeStyle = i % 2 === 0 ? '#fde047' : '#f43f5e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, i * h);
      ctx.bezierCurveTo(256, i * h + 10, 768, i * h - 10, 1024, i * h);
      ctx.stroke();
    });

    // Swirling cartoon storm ovals
    ctx.fillStyle = '#fef08a';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, Math.random() * 512, Math.random() * 40 + 15, Math.random() * 12 + 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // THE GREAT RED SPOT: Huge bold graphic cartoon swirling oval
    ctx.fillStyle = '#b91c1c'; // Dark crimson outer ring
    ctx.beginPath();
    ctx.ellipse(680, 330, 65, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f43f5e'; // Bright coral pink core
    ctx.beginPath();
    ctx.ellipse(680, 330, 46, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a'; // Golden eye
    ctx.beginPath();
    ctx.ellipse(680, 330, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  },

  // SATURN: Stylized colorful body in pastel honey-gold & lavender-tan bands
  createSaturnTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const bands = ['#fde047', '#fed7aa', '#c084fc', '#fef08a', '#fb923c', '#e9d5ff', '#fde047'];
    const h = 256 / bands.length;
    bands.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, i * h, 512, h + 2);
    });

    // Cartoon ribbon accents
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const y = Math.random() * 256;
      ctx.ellipse(256, y, 240, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  },

  // SATURN RINGS: Bold, thick, colorful cartoon stripes (sunny yellow, coral, lavender, cyan)
  createSaturnRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.08, 'rgba(250, 204, 21, 0.95)'); // Bold yellow
    grad.addColorStop(0.28, 'rgba(251, 146, 60, 0.95)'); // Warm orange
    grad.addColorStop(0.48, 'rgba(244, 63, 94, 0.95)');  // Coral pink
    grad.addColorStop(0.53, 'rgba(30, 27, 75, 0.1)');    // Clean division gap
    grad.addColorStop(0.58, 'rgba(192, 132, 252, 0.95)'); // Lavender purple
    grad.addColorStop(0.82, 'rgba(34, 211, 238, 0.95)'); // Radiant cyan
    grad.addColorStop(0.96, 'rgba(254, 240, 138, 0.9)'); // Gold tip
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 64);

    // Graphic cartoon stripes along the ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(140, 0); ctx.lineTo(140, 64);
    ctx.moveTo(210, 0); ctx.lineTo(210, 64);
    ctx.moveTo(380, 0); ctx.lineTo(380, 64);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  },

  // URANUS: Vibrant turquoise-cyan with pastel mint swoops
  createUranusTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#a7f3d0'); // Pastel mint
    grad.addColorStop(0.3, '#22d3ee'); // Electric cyan
    grad.addColorStop(0.7, '#06b6d4'); // Deep turquoise
    grad.addColorStop(1, '#67e8f9'); // Sky cyan
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      const y = Math.random() * 256;
      ctx.ellipse(256, y, 240, 12, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  },

  // NEPTUNE: Deep royal blue & cobalt-indigo with electric cyan curved storm streaks
  createNeptuneTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#4338ca'); // Indigo
    grad.addColorStop(0.3, '#2563eb'); // Royal blue
    grad.addColorStop(0.7, '#1d4ed8'); // Deep blue
    grad.addColorStop(1, '#3b82f6'); // Azure
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Luminous cyan cartoon curved storm streaks
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 5;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      const y = Math.random() * 256;
      ctx.ellipse(Math.random() * 512, y, Math.random() * 110 + 40, Math.random() * 12 + 4, 0.05, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Stylized dark cartoon storm vortex
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(340, 160, 48, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(340, 160, 36, 16, 0, 0, Math.PI * 2);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  },

  // MOON TEXTURES: Stylized cartoon crater surfaces with unique patterns per moon
  createMoonTexture(baseColorHex, moonName) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Convert hex color to CSS string
    const r = (baseColorHex >> 16) & 0xff;
    const g = (baseColorHex >> 8) & 0xff;
    const b = baseColorHex & 0xff;
    const baseCSS = `rgb(${r},${g},${b})`;
    const darkerCSS = `rgb(${Math.max(0,r-60)},${Math.max(0,g-60)},${Math.max(0,b-60)})`;
    const lighterCSS = `rgb(${Math.min(255,r+70)},${Math.min(255,g+70)},${Math.min(255,b+70)})`;
    const darkestCSS = `rgb(${Math.max(0,r-100)},${Math.max(0,g-100)},${Math.max(0,b-100)})`;

    // Base gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, lighterCSS);
    grad.addColorStop(0.5, baseCSS);
    grad.addColorStop(1, darkerCSS);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 128);

    // Terrain variation patches
    ctx.fillStyle = darkerCSS;
    const seed = moonName ? moonName.charCodeAt(0) : 42;
    for (let i = 0; i < 8; i++) {
      const px = ((seed * (i + 7) * 37) % 230) + 13;
      const py = ((seed * (i + 3) * 23) % 100) + 14;
      ctx.beginPath();
      ctx.ellipse(px, py, 20 + (i * 5 % 25), 12 + (i * 3 % 15), 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bold cartoon craters with rim highlights
    const craterCount = 12 + (seed % 8);
    for (let i = 0; i < craterCount; i++) {
      const cx = ((seed * (i + 1) * 53) % 240) + 8;
      const cy = ((seed * (i + 2) * 31) % 112) + 8;
      const cr = 3 + ((seed * (i + 1)) % 9);

      // Dark crater interior
      ctx.fillStyle = darkestCSS;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();

      // Bright rim highlight (top-left lit)
      ctx.strokeStyle = lighterCSS;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - cr * 0.15, cy - cr * 0.15, cr * 0.85, Math.PI * 0.7, Math.PI * 1.7);
      ctx.stroke();

      // Shadow crescent (bottom-right)
      ctx.fillStyle = darkerCSS;
      ctx.beginPath();
      ctx.arc(cx + cr * 0.2, cy + cr * 0.2, cr * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }
};

// ============================================================================
// MAIN APPLICATION CONTROLLER
// ============================================================================
class SolarSystemApp {
  constructor() {
    window.solarApp = this;
    this.container = document.getElementById('canvas-container');
    this.isPaused = false;
    this.timeSpeed = 1.0;
    this.showOrbits = true;
    this.showAsteroids = true;
    this.showLabels = true;
    this.focusedObject = null;
    this.isTracking = true;
    this.clock = new THREE.Clock();

    this.planets = {};
    this.orbitLines = [];
    this.allLabels = [];
    this.interactiveObjects = [];

    this.mouse = new THREE.Vector2();
    this.pointerDownPos = { x: 0, y: 0 };
    this.raycaster = new THREE.Raycaster();
    this.hoveredObject = null;

    this.soundEngine = new SpaceSoundEngine();

    this.initThree();
    this.createSpaceEnvironment();
    this.createSolarSystem();
    this.createAsteroidBelt();
    this.setupUI();
    this.setupEvents();
    if (typeof TrajectorySimulator !== 'undefined') {
      this.trajectorySimulator = new TrajectorySimulator(this);
    }
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040714);
    this.scene.fog = new THREE.FogExp2(0x040714, 0.00035);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      9000
    );
    this.defaultCameraPos = new THREE.Vector3(0, 200, 440);
    this.camera.position.copy(this.defaultCameraPos);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 1600;
    this.controls.minDistance = 6;
    this.controls.target.set(0, 0, 0);

    // Central bright toon sunlight
    this.sunLight = new THREE.PointLight(0xfffaed, 2.6, 3200, 0.35);
    this.sunLight.position.set(0, 0, 0);
    this.scene.add(this.sunLight);

    // Saturated indigo space ambient light for Pixar/animated-film shadow tones
    const ambientLight = new THREE.AmbientLight(0x312e81, 0.95);
    this.scene.add(ambientLight);

    // Colorful top fill light
    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 0.35);
    fillLight.position.set(200, 400, 300);
    this.scene.add(fillLight);

    this.toonGradient = TextureGenerator.createToonGradientMap();
  }

  createSpaceEnvironment() {
    // 1. Nebula clouds
    this.nebulaGroup = new THREE.Group();
    const nebulaColors = [0x7000ff, 0x00f0ff, 0xec4899, 0x3b82f6];

    for (let i = 0; i < 14; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      const colHex = nebulaColors[i % nebulaColors.length];
      const col = new THREE.Color(colHex);
      grad.addColorStop(0, `rgba(${Math.floor(col.r * 255)}, ${Math.floor(col.g * 255)}, ${Math.floor(col.b * 255)}, 0.22)`);
      grad.addColorStop(0.5, `rgba(${Math.floor(col.r * 255)}, ${Math.floor(col.g * 255)}, ${Math.floor(col.b * 255)}, 0.07)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      const nebTex = new THREE.CanvasTexture(canvas);
      const nebMat = new THREE.SpriteMaterial({
        map: nebTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.5
      });

      const sprite = new THREE.Sprite(nebMat);
      const dist = 1400 + Math.random() * 1000;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      sprite.position.set(
        dist * Math.cos(theta) * Math.cos(phi),
        dist * Math.sin(phi),
        dist * Math.sin(theta) * Math.cos(phi)
      );
      const scale = 500 + Math.random() * 400;
      sprite.scale.set(scale, scale, 1);
      this.nebulaGroup.add(sprite);
    }
    this.scene.add(this.nebulaGroup);

    // 2. Stars
    const starCount = 5500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xa5b4fc),
      new THREE.Color(0x67e8f9),
      new THREE.Color(0xfde047),
      new THREE.Color(0xf472b6)
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 1100 + Math.random() * 2200;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      starPositions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      starPositions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      starPositions[i * 3 + 2] = radius * Math.cos(theta);

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);

    // 3. Meteors
    this.meteors = [];
    for (let i = 0; i < 5; i++) {
      const meteorGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(2 * 3);
      meteorGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const meteorMat = new THREE.LineBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: 0
      });

      const line = new THREE.Line(meteorGeo, meteorMat);
      line.userData = {
        active: false,
        speed: 9 + Math.random() * 7,
        progress: 0,
        startPos: new THREE.Vector3(),
        dir: new THREE.Vector3()
      };
      this.scene.add(line);
      this.meteors.push(line);
    }
  }

  spawnMeteor(line) {
    const range = 650;
    const start = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(range),
      THREE.MathUtils.randFloat(220, 500),
      THREE.MathUtils.randFloatSpread(range)
    );
    const dir = new THREE.Vector3(
      THREE.MathUtils.randFloat(-1, 1),
      THREE.MathUtils.randFloat(-0.8, -0.3),
      THREE.MathUtils.randFloat(-1, 1)
    ).normalize();

    line.userData.startPos.copy(start);
    line.userData.dir.copy(dir);
    line.userData.progress = 0;
    line.userData.active = true;
    line.material.opacity = 1.0;
  }

  updateMeteors(delta) {
    this.meteors.forEach(m => {
      if (!m.userData.active) {
        if (Math.random() < 0.007) {
          this.spawnMeteor(m);
        }
        return;
      }

      m.userData.progress += delta * m.userData.speed * 42;
      const head = m.userData.startPos.clone().addScaledVector(m.userData.dir, m.userData.progress);
      const tail = head.clone().addScaledVector(m.userData.dir, -36);

      const positions = m.geometry.attributes.position.array;
      positions[0] = head.x;
      positions[1] = head.y;
      positions[2] = head.z;
      positions[3] = tail.x;
      positions[4] = tail.y;
      positions[5] = tail.z;
      m.geometry.attributes.position.needsUpdate = true;

      if (m.userData.progress > 450) {
        m.material.opacity -= delta * 2.8;
        if (m.material.opacity <= 0) {
          m.userData.active = false;
        }
      }
    });
  }

  // --- CELESTIAL MESHES (STYLED 3D CARTOON ILLUSTRATION AESTHETIC) ---
  createSolarSystem() {
    // 1. SUN: Large vibrant golden-yellow body with stylized flame shapes & bright cartoon rim
    const sunData = CELESTIAL_DATA.Sun;
    const sunGeo = new THREE.SphereGeometry(sunData.radius, 48, 48);
    const sunTex = TextureGenerator.createSunTexture();
    const sunMat = new THREE.MeshBasicMaterial({ map: sunTex });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.sunMesh.userData = { name: 'Sun', data: sunData };
    this.scene.add(this.sunMesh);
    this.interactiveObjects.push(this.sunMesh);

    // Sun Label
    const sunLabelDiv = document.createElement('div');
    sunLabelDiv.className = 'planet-badge-label';
    sunLabelDiv.textContent = 'SUN';
    document.body.appendChild(sunLabelDiv);
    this.allLabels.push({
      name: 'Sun',
      mesh: this.sunMesh,
      radius: sunData.radius,
      labelEl: sunLabelDiv
    });

    // Thick cartoon outline for the Sun (dark crimson-orange silhouette)
    const sunOutlineGeo = new THREE.SphereGeometry(sunData.radius * 1.035, 36, 36);
    const sunOutlineMat = new THREE.MeshBasicMaterial({
      color: 0x7c2d12,
      side: THREE.BackSide
    });
    this.sunMesh.add(new THREE.Mesh(sunOutlineGeo, sunOutlineMat));

    // Layered cartoon flame corona spheres (animated pulse)
    const coronaGeo1 = new THREE.SphereGeometry(sunData.radius * 1.18, 32, 32);
    const coronaMat1 = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.38,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.sunCorona1 = new THREE.Mesh(coronaGeo1, coronaMat1);
    this.sunMesh.add(this.sunCorona1);

    const coronaGeo2 = new THREE.SphereGeometry(sunData.radius * 1.38, 32, 32);
    const coronaMat2 = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.sunCorona2 = new THREE.Mesh(coronaGeo2, coronaMat2);
    this.sunMesh.add(this.sunCorona2);

    // 2. PLANETS
    const textureMethods = {
      Mercury: TextureGenerator.createMercuryTexture,
      Venus: TextureGenerator.createVenusTexture,
      Earth: TextureGenerator.createEarthTexture,
      Mars: TextureGenerator.createMarsTexture,
      Jupiter: TextureGenerator.createJupiterTexture,
      Saturn: TextureGenerator.createSaturnTexture,
      Uranus: TextureGenerator.createUranusTexture,
      Neptune: TextureGenerator.createNeptuneTexture
    };

    PLANET_ORDER.forEach(name => {
      if (name === 'Sun') return;
      const data = CELESTIAL_DATA[name];

      const orbitPivot = new THREE.Group();
      this.scene.add(orbitPivot);

      const planetGeo = new THREE.SphereGeometry(data.radius, 40, 40);
      const texture = textureMethods[name] ? textureMethods[name]() : null;
      const planetMat = new THREE.MeshToonMaterial({
        map: texture,
        gradientMap: this.toonGradient
      });

      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetMesh.position.set(data.distance, 0, 0);
      planetMesh.rotation.z = data.tilt || 0;
      planetMesh.userData = { name, data, orbitPivot };
      orbitPivot.add(planetMesh);

      // Thick, clean cartoon outer silhouette outline (like 2D illustration converted to 3D!)
      const outlineGeo = new THREE.SphereGeometry(data.radius * 1.036, 32, 32);
      const outlineMat = new THREE.MeshBasicMaterial({
        color: 0x1e1035, // Deep illustrated ink outline
        side: THREE.BackSide
      });
      planetMesh.add(new THREE.Mesh(outlineGeo, outlineMat));

      // Earth Cloud Layer & Luminous Sky-Cyan Atmosphere Halo
      if (name === 'Earth') {
        const cloudGeo = new THREE.SphereGeometry(data.radius * 1.018, 40, 40);
        const cloudTex = TextureGenerator.createEarthCloudTexture();
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.88,
          roughness: 0.9
        });
        this.earthCloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        planetMesh.add(this.earthCloudMesh);

        // Luminous sky-cyan atmosphere halo
        const atmoGeo = new THREE.SphereGeometry(data.radius * 1.06, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.35,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        });
        planetMesh.add(new THREE.Mesh(atmoGeo, atmoMat));
      }

      // Saturn & Uranus Rings (Fully 3D, Thick, Colorful Cartoon Bands)
      if (data.hasRings) {
        if (name === 'Saturn') {
          const ringGeo = new THREE.RingGeometry(data.ringInner, data.ringOuter, 64);
          const ringTex = TextureGenerator.createSaturnRingTexture();
          const pos = ringGeo.attributes.position;
          const uv = ringGeo.attributes.uv;
          for (let i = 0; i < pos.count; i++) {
            const v = new THREE.Vector3().fromBufferAttribute(pos, i);
            uv.setXY(i, (v.length() - data.ringInner) / (data.ringOuter - data.ringInner), 0.5);
          }
          const ringMat = new THREE.MeshToonMaterial({
            map: ringTex,
            gradientMap: this.toonGradient,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.98
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2;
          planetMesh.add(ringMesh);

          // Cartoon ring edge outline
          const ringEdgeGeo = new THREE.RingGeometry(data.ringOuter, data.ringOuter + 0.3, 64);
          const ringEdgeMat = new THREE.MeshBasicMaterial({
            color: 0x1e1035,
            side: THREE.DoubleSide
          });
          const ringEdgeMesh = new THREE.Mesh(ringEdgeGeo, ringEdgeMat);
          ringEdgeMesh.rotation.x = Math.PI / 2;
          planetMesh.add(ringEdgeMesh);
        } else if (name === 'Uranus') {
          const ringGeo = new THREE.RingGeometry(data.ringInner, data.ringOuter, 48);
          const ringMat = new THREE.MeshBasicMaterial({
            color: 0x22d3ee,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.65
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2;
          planetMesh.add(ringMesh);
        }
      }

      // Moons with Stylized Cartoon Treatment, Crater Textures & Inverted-Hull Outlines
      const moonMeshes = [];
      if (data.moonList) {
        data.moonList.forEach(m => {
          const moonGeo = new THREE.SphereGeometry(m.radius, 24, 24);
          const moonTex = TextureGenerator.createMoonTexture(m.color, m.name);
          const moonMat = new THREE.MeshToonMaterial({
            map: moonTex,
            color: m.color,
            gradientMap: this.toonGradient
          });
          const moonMesh = new THREE.Mesh(moonGeo, moonMat);
          moonMesh.position.set(m.distance, 0, 0);
          moonMesh.userData = {
            name: `${name} - ${m.name}`,
            moonData: m,
            parentPlanet: name,
            speed: m.speed,
            distance: m.distance,
            angle: Math.random() * Math.PI * 2,
            isMoon: true,
            rotationSpeed: 0.008 + Math.random() * 0.006
          };

          // Cartoon outline for moon
          const moonOutlineGeo = new THREE.SphereGeometry(m.radius * 1.04, 16, 16);
          const moonOutlineMat = new THREE.MeshBasicMaterial({
            color: 0x1e1035,
            side: THREE.BackSide
          });
          moonMesh.add(new THREE.Mesh(moonOutlineGeo, moonOutlineMat));

          planetMesh.add(moonMesh);
          moonMeshes.push(moonMesh);
          this.interactiveObjects.push(moonMesh);
        });
      }

      // Orbit Line
      const orbitCurve = new THREE.EllipseCurve(0, 0, data.distance, data.distance);
      const points = orbitCurve.getPoints(128);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
      orbitGeo.rotateX(Math.PI / 2);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.22
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      this.scene.add(orbitLine);
      this.orbitLines.push(orbitLine);

      // Label
      const labelDiv = document.createElement('div');
      labelDiv.className = 'planet-badge-label';
      labelDiv.textContent = name;
      document.body.appendChild(labelDiv);

      this.allLabels.push({
        name: name,
        mesh: planetMesh,
        radius: data.radius,
        labelEl: labelDiv
      });

      this.planets[name] = {
        mesh: planetMesh,
        pivot: orbitPivot,
        data,
        moons: moonMeshes,
        angle: Math.random() * Math.PI * 2,
        labelEl: labelDiv
      };

      this.interactiveObjects.push(planetMesh);
    });
  }

  // ASTEROIDS: Irregular 3D rocky cartoon shapes, bold silhouettes & toon shading
  createAsteroidBelt() {
    this.asteroidCount = 750;
    const baseGeo = new THREE.DodecahedronGeometry(0.58, 1);
    
    const pos = baseGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      v.x += (Math.random() - 0.5) * 0.22;
      v.y += (Math.random() - 0.5) * 0.22;
      v.z += (Math.random() - 0.5) * 0.22;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    baseGeo.computeVertexNormals();

    const asteroidMat = new THREE.MeshToonMaterial({
      color: 0xffffff, // White base so instance colors tint properly
      gradientMap: this.toonGradient
    });

    this.asteroidInstancedMesh = new THREE.InstancedMesh(baseGeo, asteroidMat, this.asteroidCount);

    // Per-instance cartoon color variety: mix of purple, sandy-ochre, warm gray, rust
    const asteroidColorPalette = [
      new THREE.Color(0x8b5cf6), // Violet
      new THREE.Color(0x7c3aed), // Deep purple
      new THREE.Color(0xa78bfa), // Light lavender
      new THREE.Color(0xd97706), // Sandy ochre
      new THREE.Color(0x78716c), // Warm stone gray
      new THREE.Color(0xb45309), // Rust orange
      new THREE.Color(0x6d28d9), // Grape purple
      new THREE.Color(0x92400e)  // Dark amber
    ];
    this.asteroidData = [];

    // Create per-instance color buffer manually (r128 compatible)
    const instanceColors = new Float32Array(this.asteroidCount * 3);

    const dummy = new THREE.Object3D();
    const minR = 152;
    const maxR = 176;

    for (let i = 0; i < this.asteroidCount; i++) {
      const radius = minR + Math.random() * (maxR - minR);
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 14;
      const scale = 0.45 + Math.random() * 1.15;
      const orbitSpeed = (0.005 + Math.random() * 0.002) * (160 / radius);
      const rotSpeed = {
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.04
      };

      this.asteroidData.push({
        radius,
        angle,
        yOffset,
        scale,
        orbitSpeed,
        rotSpeed,
        rotation: { x: Math.random() * Math.PI, y: Math.random() * Math.PI, z: Math.random() * Math.PI }
      });

      dummy.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      this.asteroidInstancedMesh.setMatrixAt(i, dummy.matrix);

      // Assign per-instance cartoon color
      const col = asteroidColorPalette[i % asteroidColorPalette.length];
      instanceColors[i * 3] = col.r;
      instanceColors[i * 3 + 1] = col.g;
      instanceColors[i * 3 + 2] = col.b;
    }

    // Attach instance color buffer (r128 compatible approach)
    this.asteroidInstancedMesh.instanceColor = new THREE.InstancedBufferAttribute(instanceColors, 3);
    this.asteroidInstancedMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.asteroidInstancedMesh);
  }

  updateAsteroids(simSpeed) {
    if (!this.asteroidInstancedMesh || !this.showAsteroids) return;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.asteroidCount; i++) {
      const a = this.asteroidData[i];
      a.angle += a.orbitSpeed * simSpeed * 0.4;
      a.rotation.x += a.rotSpeed.x * (this.isPaused ? 0.1 : simSpeed);
      a.rotation.y += a.rotSpeed.y * (this.isPaused ? 0.1 : simSpeed);

      dummy.position.set(Math.cos(a.angle) * a.radius, a.yOffset, Math.sin(a.angle) * a.radius);
      dummy.rotation.set(a.rotation.x, a.rotation.y, a.rotation.z);
      dummy.scale.set(a.scale, a.scale, a.scale);
      dummy.updateMatrix();
      this.asteroidInstancedMesh.setMatrixAt(i, dummy.matrix);
    }
    this.asteroidInstancedMesh.instanceMatrix.needsUpdate = true;
  }

  // --- UI INTERFACE & EVENT HANDLERS ---
  setupUI() {
    this.audioToggleBtn = document.getElementById('audio-toggle');
    this.audioIconOn = document.getElementById('audio-icon-on');
    this.audioIconOff = document.getElementById('audio-icon-off');
    this.audioToggleBtn.addEventListener('click', () => {
      const isAudible = this.soundEngine.toggleMute();
      this.audioIconOn.classList.toggle('hidden', !isAudible);
      this.audioIconOff.classList.toggle('hidden', isAudible);
      this.soundEngine.playUI('click');
    });

    this.playPauseBtn = document.getElementById('btn-play-pause');
    this.playPauseIcon = document.getElementById('play-pause-icon');
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());

    this.speedSlider = document.getElementById('speed-slider');
    this.speedValue = document.getElementById('speed-value');
    if (this.speedSlider) {
      this.speedSlider.addEventListener('input', (e) => {
        this.setSpeed(parseFloat(e.target.value));
      });
    }

    this.orbitsBtn = document.getElementById('btn-toggle-orbits');
    this.orbitsBtn.addEventListener('click', () => {
      this.soundEngine.playUI('toggle');
      this.showOrbits = !this.showOrbits;
      this.orbitsBtn.classList.toggle('active', this.showOrbits);
      this.orbitLines.forEach(l => l.visible = this.showOrbits);
    });

    this.asteroidsBtn = document.getElementById('btn-toggle-asteroids');
    this.asteroidsBtn.addEventListener('click', () => {
      this.soundEngine.playUI('toggle');
      this.showAsteroids = !this.showAsteroids;
      this.asteroidsBtn.classList.toggle('active', this.showAsteroids);
      if (this.asteroidInstancedMesh) {
        this.asteroidInstancedMesh.visible = this.showAsteroids;
      }
    });

    this.labelsBtn = document.getElementById('btn-toggle-labels');
    this.labelsBtn.addEventListener('click', () => {
      this.soundEngine.playUI('toggle');
      this.showLabels = !this.showLabels;
      this.labelsBtn.classList.toggle('active', this.showLabels);
      this.allLabels.forEach(item => {
        if (item.labelEl) {
          item.labelEl.style.display = this.showLabels ? 'block' : 'none';
          if (!this.showLabels) item.labelEl.style.opacity = '0';
        }
      });
    });

    this.resetBtn = document.getElementById('btn-reset-view');
    this.resetBtn.addEventListener('click', () => {
      this.soundEngine.playUI('close');
      this.resetCamera();
    });

    this.tooltip = document.getElementById('hover-tooltip');
    this.tooltipName = document.getElementById('tooltip-name');
    this.tooltipType = document.getElementById('tooltip-type');

    this.infoPanel = document.getElementById('info-panel');
    this.btnClosePanel = document.getElementById('btn-close-panel');
    this.btnClosePanel.addEventListener('click', () => {
      this.soundEngine.playUI('close');
      this.closePanel();
    });

    // Mobile bottom sheet drag-handle click to dismiss
    const sheetHandle = document.querySelector('.mobile-sheet-handle');
    if (sheetHandle) {
      sheetHandle.addEventListener('click', () => {
        this.soundEngine.playUI('close');
        this.closePanel();
      });
    }

    // Touch swipe-down on bottom sheet to dismiss
    let touchStartY = 0;
    this.infoPanel.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.infoPanel.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchEndY - touchStartY > 65 && this.infoPanel.scrollTop <= 8) {
        this.soundEngine.playUI('close');
        this.closePanel();
      }
    }, { passive: true });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.soundEngine.playUI('tab');
        const tabId = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePane = document.getElementById(`tab-${tabId}`);
        if (activePane) activePane.classList.add('active');
      });
    });

    document.querySelectorAll('.dock-dot-btn').forEach(item => {
      item.addEventListener('click', () => {
        this.soundEngine.playUI('confirm');
        const planetName = item.dataset.planet;
        this.selectPlanetByName(planetName);
      });
    });
  }

  setupEvents() {
    window.addEventListener('resize', () => this.onWindowResize());

    // Track pointerdown to distinguish click/tap from camera drag/orbit
    window.addEventListener('pointerdown', (e) => {
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('click', (e) => this.onPointerClick(e));

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.code === 'KeyR') {
        this.soundEngine.playUI('close');
        this.resetCamera();
      } else if (e.code === 'KeyO') {
        this.orbitsBtn.click();
      } else if (e.code === 'KeyA') {
        this.asteroidsBtn.click();
      } else if (e.code === 'KeyL') {
        this.labelsBtn.click();
      } else if (e.code === 'Escape') {
        this.soundEngine.playUI('close');
        this.closePanel();
      }
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onPointerMove(e) {
    if (window.navigationShell && window.navigationShell.currentView !== 'explore') {
      if (this.tooltip) this.tooltip.classList.add('hidden');
      return;
    }

    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      this.hoveredObject = obj;
      document.body.style.cursor = 'pointer';

      let targetData = obj.userData.data;
      let name = obj.userData.name;
      let type = targetData ? targetData.type : (obj.userData.isMoon ? 'Natural Satellite' : 'Celestial Object');

      this.tooltipName.textContent = name;
      this.tooltipType.textContent = type;

      this.tooltip.style.left = `${e.clientX}px`;
      this.tooltip.style.top = `${e.clientY}px`;
      this.tooltip.classList.remove('hidden');
    } else {
      this.hoveredObject = null;
      document.body.style.cursor = 'default';
      this.tooltip.classList.add('hidden');
    }
  }

  onPointerClick(e) {
    if (e.target.closest('.minimal-header, .slide-panel, .minimal-dock, .floating-controls-bar, #audio-toggle, #left-nav, #radar-widget, #views-container, #mission-control-hud, .mission-control-btn, .hud-search-btn, .top-right-hud, #flight-telemetry-hud, #simulation-exit-bar')) return;
    if (this.trajectorySimulator && this.trajectorySimulator.isActive) return;
    if (window.navigationShell && window.navigationShell.currentView !== 'explore') return;

    // Reject camera rotation drag/pinch gestures (threshold 8px)
    const dragDistance = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
    if (dragDistance > 8) return;

    // Direct, reliable calculation from event client coordinates for touch & desktop
    const clickCoords = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    this.raycaster.setFromCamera(clickCoords, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

    if (intersects.length > 0) {
      this.soundEngine.playUI('confirm');
      const target = intersects[0].object;
      this.focusOnObject(target);
    } else {
      if (!this.infoPanel.classList.contains('hidden')) {
        this.soundEngine.playUI('close');
        this.closePanel();
      }
    }
  }

  togglePlayPause() {
    this.isPaused = !this.isPaused;
    this.soundEngine.playUI(this.isPaused ? 'toggle' : 'click');
    this.playPauseBtn.classList.toggle('active', !this.isPaused);
    this.playPauseIcon.textContent = this.isPaused ? '▶' : '⏸';
  }

  setSpeed(val) {
    this.timeSpeed = val;
    if (this.speedSlider) this.speedSlider.value = val;
    if (this.speedValue) this.speedValue.textContent = `${val.toFixed(1)}x`;
  }

  launchTrajectorySimulation(missionId) {
    if (this.trajectorySimulator) {
      this.trajectorySimulator.launchMission(missionId);
    }
  }

  selectPlanetByName(name) {
    if (name === 'Sun') {
      this.focusOnObject(this.sunMesh);
    } else if (this.planets[name]) {
      this.focusOnObject(this.planets[name].mesh);
    }
  }

  visitAdjacentPlanet(direction) {
    let currentIdx = 0;
    if (this.focusedObject) {
      currentIdx = PLANET_ORDER.indexOf(this.focusedObject.userData.name);
      if (currentIdx === -1) currentIdx = 0;
    }
    let nextIdx = (currentIdx + direction + PLANET_ORDER.length) % PLANET_ORDER.length;
    this.selectPlanetByName(PLANET_ORDER[nextIdx]);
  }

  focusOnObject(object) {
    this.focusedObject = object;
    this.isTracking = true;

    const targetPos = new THREE.Vector3();
    object.getWorldPosition(targetPos);

    const radius = (object.geometry && object.geometry.parameters && object.geometry.parameters.radius) ? object.geometry.parameters.radius : 4;
    const offset = new THREE.Vector3(radius * 2.8, radius * 1.8, radius * 3.5);
    const destCamPos = targetPos.clone().add(offset);

    if (window.TWEEN) {
      new TWEEN.Tween(this.camera.position)
        .to(destCamPos, 1300)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      new TWEEN.Tween(this.controls.target)
        .to(targetPos, 1300)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    } else {
      this.camera.position.copy(destCamPos);
      this.controls.target.copy(targetPos);
    }

    document.querySelectorAll('.dock-dot-btn').forEach(item => {
      item.classList.toggle('active', item.dataset.planet === object.userData.name);
    });

    if (object.userData.data) {
      this.displayPlanetData(object.userData.data);
    } else if (object.userData.isMoon) {
      this.displayMoonData(object.userData.moonData, object.userData.parentPlanet);
    }
  }

  displayPlanetData(data) {
    document.getElementById('info-name').textContent = data.name;
    document.getElementById('info-type').textContent = data.type.toUpperCase();
    document.getElementById('info-tagline').textContent = data.tagline;
    document.getElementById('quick-diameter').textContent = data.diameter;
    document.getElementById('quick-distance').textContent = data.distFromSun;
    document.getElementById('quick-year').textContent = data.orbitPeriod;

    document.getElementById('info-description').textContent = data.description;
    document.getElementById('info-temp').textContent = data.temp;

    document.getElementById('info-mass').textContent = data.mass;
    document.getElementById('info-diameter').textContent = data.diameter;
    document.getElementById('info-physical-gravity').textContent = data.gravity;
    document.getElementById('info-density').textContent = data.density;
    document.getElementById('info-temp-range').textContent = data.tempRange;
    document.getElementById('info-escape-velocity').textContent = data.escapeVelocity;

    const atmoContainer = document.getElementById('atmosphere-bars-container');
    atmoContainer.innerHTML = '';
    if (data.atmosphere && data.atmosphere.length > 0) {
      data.atmosphere.forEach(item => {
        const row = document.createElement('div');
        row.className = 'atmo-row';
        row.innerHTML = `
          <div class="atmo-meta">
            <span>${item.gas}</span>
            <span>${item.percent}%</span>
          </div>
          <div class="atmo-bar-bg">
            <div class="atmo-bar-fill" style="width: ${Math.min(item.percent, 100)}%;"></div>
          </div>
        `;
        atmoContainer.appendChild(row);
      });
    } else {
      atmoContainer.innerHTML = '<span style="font-size:0.75rem; color:#94a3b8; font-style:italic;">No substantial planetary atmosphere.</span>';
    }

    document.getElementById('info-distance').textContent = data.distFromSun;
    document.getElementById('info-orbit-period').textContent = data.orbitPeriod;
    document.getElementById('info-orbit-rotation').textContent = data.rotationPeriod;
    document.getElementById('info-orbit-speed').textContent = data.orbitSpeed;
    document.getElementById('info-eccentricity').textContent = data.eccentricity;
    document.getElementById('info-inclination').textContent = data.inclination;

    const moonCountBadge = document.getElementById('tab-moon-count');
    const moonsListContainer = document.getElementById('moons-cards-list');
    moonsListContainer.innerHTML = '';

    const moonList = data.moonList || [];
    moonCountBadge.textContent = moonList.length;

    if (moonList.length > 0) {
      moonList.forEach(m => {
        const btn = document.createElement('button');
        btn.className = 'moon-item-btn';
        btn.innerHTML = `
          <span class="moon-dot-pip" style="background-color: #${m.color.toString(16).padStart(6, '0')};"></span>
          <div class="moon-item-info">
            <span class="moon-item-name">${m.name}</span>
            <span class="moon-item-sub">${m.desc || 'Click to track'}</span>
          </div>
        `;
        btn.addEventListener('click', () => {
          this.soundEngine.playUI('confirm');
          const p = this.planets[data.name];
          if (p && p.moons) {
            const moonMesh = p.moons.find(item => item.userData.name.includes(m.name));
            if (moonMesh) this.focusOnObject(moonMesh);
          }
        });
        moonsListContainer.appendChild(btn);
      });
    } else {
      moonsListContainer.innerHTML = '<span style="font-size:0.75rem; color:#94a3b8; font-style:italic;">No major natural satellites.</span>';
    }

    const factsList = document.getElementById('info-facts-list');
    factsList.innerHTML = '';
    data.facts.forEach(fact => {
      const li = document.createElement('li');
      li.textContent = fact;
      factsList.appendChild(li);
    });

    const preview = document.getElementById('info-color-preview');
    if (preview) {
      preview.style.backgroundColor = data.color;
      preview.style.boxShadow = `0 0 10px ${data.color}`;
    }

    this.infoPanel.classList.remove('hidden');
    document.body.classList.add('panel-open');
  }

  displayMoonData(m, parentPlanet) {
    document.getElementById('info-name').textContent = m.name;
    document.getElementById('info-type').textContent = 'NATURAL SATELLITE';
    document.getElementById('info-tagline').textContent = `Satellite of ${parentPlanet}`;
    document.getElementById('quick-diameter').textContent = `${(m.radius * 2400).toFixed(0)} km`;
    document.getElementById('quick-distance').textContent = `${m.distance} km from ${parentPlanet}`;
    document.getElementById('quick-year').textContent = 'Synchronous';

    document.getElementById('info-description').textContent = `${m.name} is a natural moon revolving around ${parentPlanet}. ${m.desc || ''}`;
    document.getElementById('info-temp').textContent = 'Subzero Surface';

    this.infoPanel.classList.remove('hidden');
    document.body.classList.add('panel-open');
  }

  closePanel() {
    this.infoPanel.classList.add('hidden');
    document.body.classList.remove('panel-open');
    document.querySelectorAll('.dock-dot-btn').forEach(i => i.classList.remove('active'));
  }

  resetCamera() {
    this.focusedObject = null;
    this.closePanel();

    if (window.TWEEN) {
      new TWEEN.Tween(this.camera.position)
        .to(this.defaultCameraPos, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      new TWEEN.Tween(this.controls.target)
        .to(new THREE.Vector3(0, 0, 0), 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    } else {
      this.camera.position.copy(this.defaultCameraPos);
      this.controls.target.set(0, 0, 0);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    if (window.TWEEN) {
      TWEEN.update();
    }

    if (this.trajectorySimulator) {
      this.trajectorySimulator.update(delta);
    }

    this.updateMeteors(delta);

    if (this.stars) {
      this.stars.rotation.y += 0.00008;
    }
    if (this.nebulaGroup) {
      this.nebulaGroup.rotation.y += 0.00004;
    }

    if (this.sunMesh) {
      this.sunMesh.rotation.y += 0.002 * (this.isPaused ? 0.1 : this.timeSpeed);

      // Animated cartoon Sun corona pulsing (breathing glow effect)
      const pulse = Math.sin(Date.now() * 0.002) * 0.08;
      const pulse2 = Math.sin(Date.now() * 0.0013 + 1.0) * 0.06;
      if (this.sunCorona1) {
        this.sunCorona1.scale.setScalar(1.0 + pulse);
        this.sunCorona1.material.opacity = 0.32 + pulse * 0.5;
      }
      if (this.sunCorona2) {
        this.sunCorona2.scale.setScalar(1.0 + pulse2);
        this.sunCorona2.material.opacity = 0.16 + pulse2 * 0.4;
      }
    }

    const isTrajectoryActive = this.trajectorySimulator && this.trajectorySimulator.isActive;
    const simSpeed = (this.isPaused || isTrajectoryActive) ? 0 : this.timeSpeed;

    if (this.earthCloudMesh) {
      const cloudMult = isTrajectoryActive ? 0 : (this.isPaused ? 0.1 : this.timeSpeed);
      this.earthCloudMesh.rotation.y += 0.012 * cloudMult;
    }

    this.updateAsteroids(simSpeed);

    Object.keys(this.planets).forEach(name => {
      const p = this.planets[name];
      const rotMult = isTrajectoryActive ? 0 : (this.isPaused ? 0.1 : this.timeSpeed);

      p.mesh.rotation.y += p.data.rotationSpeed * rotMult;

      p.angle += p.data.speed * 0.4 * simSpeed;
      p.mesh.position.x = Math.cos(p.angle) * p.data.distance;
      p.mesh.position.z = Math.sin(p.angle) * p.data.distance;

      if (p.moons && p.moons.length > 0) {
        p.moons.forEach(m => {
          m.userData.angle += m.userData.speed * simSpeed;
          m.position.x = Math.cos(m.userData.angle) * m.userData.distance;
          m.position.z = Math.sin(m.userData.angle) * m.userData.distance;
          // Moon self-rotation on its axis
          if (m.userData.rotationSpeed) {
            const moonRotMult = isTrajectoryActive ? 0 : (this.isPaused ? 0.1 : this.timeSpeed);
            m.rotation.y += m.userData.rotationSpeed * moonRotMult;
          }
        });
      }

      p.mesh.updateMatrixWorld(true);
    });

    // Precise 3D Badge Label Projection for Sun and all planets
    if (this.showLabels && this.allLabels.length > 0) {
      const camDir = new THREE.Vector3();
      this.camera.getWorldDirection(camDir);
      const tempPos = new THREE.Vector3();
      const w = window.innerWidth;
      const h = window.innerHeight;

      this.allLabels.forEach(item => {
        if (!item.labelEl) return;

        item.mesh.updateMatrixWorld(true);
        item.mesh.getWorldPosition(tempPos);

        // Vector from camera to celestial body
        const toObj = tempPos.clone().sub(this.camera.position);

        // Strictly verify that the celestial body is in front of the camera plane
        if (camDir.dot(toObj) <= 0.2) {
          item.labelEl.style.opacity = '0';
          return;
        }

        // Float label neatly above the planet on screen by offsetting along camera.up
        const ringExtra = item.name === 'Saturn' ? 4.5 : (item.name === 'Sun' ? 2.8 : 0);
        tempPos.addScaledVector(this.camera.up, item.radius * 1.25 + 1.6 + ringExtra);

        // Project 3D position to Normalized Device Coordinates [-1, 1]
        const screenPos = tempPos.clone().project(this.camera);

        // Verify inside frustum depth
        if (screenPos.z < -1 || screenPos.z > 1) {
          item.labelEl.style.opacity = '0';
          return;
        }

        // Convert NDC to screen pixel coordinates
        const x = (screenPos.x * 0.5 + 0.5) * w;
        const y = (-(screenPos.y * 0.5) + 0.5) * h;

        // Verify within viewport with margin
        if (x < -60 || x > w + 60 || y < -30 || y > h + 30) {
          item.labelEl.style.opacity = '0';
          return;
        }

        item.labelEl.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translate(-50%, -100%)`;
        item.labelEl.style.opacity = '1';
      });
    }

    if (!this.trajectorySimulator || !this.trajectorySimulator.isActive) {
      if (this.focusedObject && this.isTracking) {
        const targetPos = new THREE.Vector3();
        this.focusedObject.getWorldPosition(targetPos);
        const camOffset = this.camera.position.clone().sub(this.controls.target);
        this.controls.target.copy(targetPos);
        this.camera.position.copy(targetPos).add(camOffset);
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new SolarSystemApp();
});
