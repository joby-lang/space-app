# Space Weather Story App

An interactive 3D storytelling application for children to learn about space weather, solar flares, and their effects on Earth.

## Features

### 8 Interactive Scenes

1. **Scene 1: Meet Sunny the Sun** - Introduction to Sunny and Sparky with interactive ray launching
2. **Scene 2: Sparky's Journey** - Drag Sparky past planets and avoid space rocks
3. **Scene 3: Farmers & Engineers** - Cable matching mini-game to restore GPS and power
4. **Scene 4: Pilots & Auroras** - Paint beautiful auroras across the sky
5. **Scene 5: Learning Time** - Interactive educational definitions with TTS narration
6. **Scene 6: Memory Challenge** - Match pairs in a memory card game
7. **Scene 7: Space Challenges** - Protect astronauts from radiation and fix radio signals
8. **Scene 8: Final Restoration** - Complete all system repairs and celebrate

### Interactive Elements

- Tap, drag, and swipe interactions
- Mini-games with progressive difficulty
- Text-to-speech narration for all dialogue
- Sound effects for user interactions
- Particle effects and animations
- 3D cartoon-style characters

### Educational Content

Children learn about:
- Solar flares and their formation
- How space weather affects technology on Earth
- Auroras and their causes
- Magnetosphere and Earth's protection
- Space safety and radiation
- Problem-solving and memory skills

## Technology Stack

- **Three.js** - 3D graphics and animations
- **Vite** - Fast build tool and dev server
- **Web Speech API** - Text-to-speech narration
- **Web Audio API** - Interactive sound effects

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open automatically at http://localhost:3000

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
project/
├── scenes/          # 8 scene files (Scene01.js - Scene08.js)
├── scripts/         # Core application logic
│   ├── main.js           # Application entry point
│   ├── SceneManager.js   # Scene navigation and management
│   ├── AudioManager.js   # TTS and sound effects
│   └── UIManager.js      # UI overlay management
├── styles/          # CSS styling
│   └── main.css          # Main stylesheet
├── index.html       # HTML entry point
└── package.json     # Dependencies and scripts
```

## Controls

- **Mouse/Touch**: Click or tap to interact with objects
- **Drag**: Click and hold to drag Sparky or paint auroras
- **Swipe**: Swipe to create aurora effects
- **Buttons**: Click UI buttons to progress through scenes

## Browser Support

Works best in modern browsers with:
- WebGL support for 3D graphics
- Web Speech API for narration (optional)
- Web Audio API for sound effects

Recommended browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Educational Goals

This app helps children:
- Understand basic space weather concepts
- Learn about solar-terrestrial relationships
- Develop problem-solving skills through mini-games
- Practice memory and pattern recognition
- Build spatial awareness with 3D interactions
- Improve listening comprehension through narration

## License

ISC

## Credits

Created as an educational tool to teach children about space weather in a fun and interactive way.
