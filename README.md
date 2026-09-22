# 🌌 Solar System // 3D Observation System

An interactive, high-fidelity 3D Solar System exploration and observation platform built with **Three.js (WebGL)**, **HTML5**, and **Vanilla CSS**.

Featuring a stylized cartoon-realistic space aesthetic inspired by modern animated sci-fi films, accurate celestial mechanics, full responsive mobile support, interactive orbit tracking, and detailed planetary telemetry.

---

## ✨ Features

- **Stylized 3D Cartoon Art Direction**:
  - Procedurally generated canvas textures with vibrant cartoon surface bands, craters, storms, and atmospheric gradients.
  - Layered toon/cel shading using custom ramp gradient maps.
  - Soft ink outlines (`THREE.BackSide` silhouette rendering).
  - Dynamic animated Sun flame coronas and breathing glow effects.
  - Earth with independent revolving cloud layer and luminous atmosphere halo.
  - 3D cartoon asteroid belt with over 750 irregularly shaped, toon-shaded asteroids.
- **Spaceship Observation HUD & Controls**:
  - Minimalist top header with live simulation status and ambient space audio toggle.
  - Floating simulation controls bar: Play/Pause, speed adjustment slider (0x to 5x), orbital paths toggle, asteroid belt toggle, labels toggle, and camera reset.
  - Discreet bottom planet dock for quick navigation across the Sun and all 8 planets.
  - Clean slide-out observation telemetry panel with Overview, Physical Specs, Orbit Data, Moons, and Educational Facts.
- **Accurate 3D Planet Labels**:
  - Dynamically projected badges that hover directly above celestial bodies.
  - Camera up-vector alignment ensuring labels remain visible and correctly positioned from any viewing angle or camera pitch.
  - Behind-camera frustum culling preventing inverted phantom projections.
- **Full Mobile & Touch Responsiveness**:
  - Slide-out telemetry transforms into a native mobile bottom sheet with smooth gestures.
  - Swipe-down and drag-handle dismissal.
  - Touch-optimized raycasting with gesture drag-threshold detection to prevent accidental selections while rotating the camera.
  - Compact adaptive control bars fitted for screens from 320px wide up to 4K displays.

---

## 🎮 Keyboard Shortcuts

| Key | Action |
| :---: | :--- |
| <kbd>Space</kbd> | Play / Pause orbit simulation |
| <kbd>O</kbd> | Toggle orbital trajectory lines |
| <kbd>A</kbd> | Toggle Asteroid Belt visibility |
| <kbd>L</kbd> | Toggle 3D planet label badges |
| <kbd>R</kbd> | Reset camera to overview |
| <kbd>Esc</kbd> | Close information panel |

---

## 🛠️ Built With

- [Three.js](https://threejs.org/) (r128) - 3D WebGL rendering engine
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls) - 360° orbital camera controls
- [Tween.js](https://github.com/tweenjs/tween.js/) - Smooth camera transitions
- Google Fonts - [Orbitron](https://fonts.google.com/specimen/Orbitron) & [Inter](https://fonts.google.com/specimen/Inter)
- HTML5 Canvas & Web Audio API - Procedural textures and procedural ambient audio generator
