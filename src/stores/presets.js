// presets.js
const buildPresets = () => {
  const defaultPreset = {
    text: "YOUR TEXT HERE",
    color: "#00ff00",
    font: "'Orbitron', sans-serif",
    textCase: "uppercase",
    letterSpacing: 3,
    lineHeight: 1.2,
    outlineColor: "#000000",
    outlineWidth: 1,
    shadowColor: "#00ff00",
    shadowBlur: 10,
    reflection: 0,
    direction: "left",
    speed: 5,
    isPlaying: false,
    background: "matrix",
    bgColor: "#000000",
    frameStyle: "led",
    cornerLights: true,
    flickerEnabled: false,
    flickerSpeed: 5,
    flickerColors: ["#ff0000", "#00ff00", "#0000ff"],
    rgbBorderEnabled: false,
    rgbBorderSpeed: 5,
    rgbBorderColors: ["#ff0000", "#00ff00", "#0000ff"],
    maxLength: 50,
    verticalText: false,
    mirroredText: false,
    textStyle: "normal", // New: Default text style
  };

  return {
    default: defaultPreset,
    matrix: {
      ...defaultPreset,
      text: "MATRIX",
      color: "#00ff41",
      font: "'Courier New', monospace",
      background: "matrix",
      bgColor: "#001a00",
      rgbBorderEnabled: true,
      rgbBorderColors: ["#00ff41", "#00b341", "#008241"],
      textStyle: "bullet", // Bullet style for matrix theme
    },
    cyberpunk: {
      ...defaultPreset,
      text: "CYBERPUNK 2077",
      color: "#ff00ff",
      font: "'Rajdhani', sans-serif",
      background: "circuit",
      bgColor: "#110011",
      outlineWidth: 2,
      outlineColor: "#00ffff",
      rgbBorderEnabled: true,
      rgbBorderColors: ["#ff00ff", "#00ffff", "#ffff00"],
      textStyle: "funky", // Funky style for cyberpunk theme
    },
    neon: {
      ...defaultPreset,
      text: "NEON LIGHTS",
      color: "#ffff00",
      font: "'Iceland', cursive",
      background: "solid",
      bgColor: "#000033",
      frameStyle: "neon",
      rgbBorderEnabled: true,
      rgbBorderColors: ["#ff0000", "#ffff00", "#ff00ff"],
      textStyle: "cloud", // Cloud style for neon theme
    },
    rgbParty: {
      ...defaultPreset,
      text: "RGB PARTY!",
      rgbBorderEnabled: true,
      rgbBorderSpeed: 10,
      rgbBorderColors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
      flickerEnabled: true,
      flickerSpeed: 8,
      flickerColors: ["#ff0000", "#00ff00", "#0000ff"],
      textStyle: "funky", // Funky style for party effect
    },
    minimalWhite: {
      ...defaultPreset,
      text: "MINIMAL",
      color: "#ffffff",
      font: "'Roboto', sans-serif",
      background: "solid",
      bgColor: "#000000",
      frameStyle: "none",
      outlineWidth: 0,
      shadowBlur: 0,
      textStyle: "normal", // Normal style for minimal theme
    },
  };
};

export const presets = buildPresets();

// Helper function to apply presets
export const applyPreset = (presetName) => {
  const preset = presets[presetName] || presets.default;
  return preset;
};