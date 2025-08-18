// presets.js
const defaultPreset = {
  text: "YOUR TEXT HERE",
  font: "'Orbitron', monospace",
  textCase: "uppercase",
  letterSpacing: 3,
  lineHeight: 1.2,
  color: "#00ff00",
  outlineColor: "#000000",
  outlineWidth: 0,
  shadowColor: "#00ff00",
  shadowBlur: 10,
  reflection: 0,
  direction: "left",
  speed: 5,
  easing: "linear",
  delay: 0,
  isPlaying: false,
  background: "matrix",
  bgColor: "#000000",
  frameStyle: "led",
  cornerLights: true,
  audioSource: "none",
  sensitivity: 100,
  reactTo: "brightness",
  intensity: 50,
  flickerEnabled: false,
  flickerSpeed: 5,
  flickerColors: ["#ff0000", "#00ff00", "#0000ff"],
  rgbBorderEnabled: false,
  rgbBorderSpeed: 5,
  rgbBorderColors: ["#ff0000", "#00ff00", "#0000ff"]
};

export const presets = {
  // Default Preset
  default: defaultPreset,

  // Popular Presets
  matrix: {
    ...defaultPreset,
    text: "MATRIX",
    color: "#00ff41",
    font: "'Courier New', monospace",
    background: "matrix",
    bgColor: "#001a00",
    rgbBorderEnabled: true,
    rgbBorderColors: ["#00ff41", "#00b341", "#008241"],
    outlineWidth: 1
  },

  cyberpunk: {
    ...defaultPreset,
    text: "CYBERPUNK",
    color: "#ff00ff",
    font: "'Rajdhani', sans-serif",
    background: "circuit",
    bgColor: "#110011",
    outlineWidth: 2,
    outlineColor: "#00ffff",
    rgbBorderEnabled: true,
    rgbBorderColors: ["#ff00ff", "#00ffff", "#ffff00"],
    shadowBlur: 15
  },

  neon: {
    ...defaultPreset,
    text: "NEON",
    color: "#ffff00",
    font: "'Iceland', cursive",
    background: "solid",
    bgColor: "#000033",
    frameStyle: "neon",
    rgbBorderEnabled: true,
    rgbBorderColors: ["#ff0000", "#ffff00", "#ff00ff"],
    shadowColor: "#ffff00",
    shadowBlur: 20
  },

  // Special Effect Presets
  rgbParty: {
    ...defaultPreset,
    text: "RGB PARTY!",
    rgbBorderEnabled: true,
    rgbBorderSpeed: 10,
    rgbBorderColors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
    flickerEnabled: true,
    flickerSpeed: 8,
    flickerColors: ["#ff0000", "#00ff00", "#0000ff"],
    shadowBlur: 15
  },

  // Minimal Preset
  minimal: {
    ...defaultPreset,
    text: "MINIMAL",
    color: "#ffffff",
    font: "'Roboto', sans-serif",
    background: "solid",
    bgColor: "#000000",
    frameStyle: "none",
    outlineWidth: 0,
    shadowBlur: 0,
    cornerLights: false
  }
};

// Helper function to get preset names for UI
export const getPresetNames = () => {
  return Object.keys(presets).filter(name => name !== 'default');
};