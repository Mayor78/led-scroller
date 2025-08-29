import { create } from 'zustand';
import { presets } from './presets';

export const useScrollerStore = create((set) => ({
  // Text properties
  text: '',
  font: "'Orbitron', monospace",
  textCase: 'uppercase',
  letterSpacing: 3,
  lineHeight: 1.2,
  fontSize: 50,
  textSkew: 0,
  textRotation: 0,
  textStyle: "normal",

  ...presets.default,

  loadPreset: (presetName) => {
    const presetToLoad = presets[presetName] || presets.default;
    set({ ...presetToLoad });
  },

  flickerEnabled: false,
  flickerSpeed: 5,
  flickerIntensity: 0,
  flickerColors: ['#ff0000', '#00ff00', '#0000ff'],

  // Color & effects
  color: '#00ff00',
  outlineColor: '#000000',
  outlineWidth: 0,
  shadowColor: '#00ff00',
  shadowBlur: 10,
  reflection: 0,

  // Animation
  direction: 'left',
  speed: 5,
  easing: 'linear',
  delay: 0,
  isPlaying: false,
  animationType: 'slide',
  animationDuration: 0.5,
  animationDelay: 0,
  transitionStyle: 'easeInOut',

  // Background & display
  background: 'matrix',
  bgColor: '#000000',
  frameStyle: 'led',
  cornerLights: true,
  backgroundImage: null,

  // Audio reactivity
  audioSource: 'none',
  sensitivity: 100,
  reactTo: 'brightness',
  intensity: 50,

  rgbBorderEnabled: false,
  rgbBorderSpeed: 5,
  rgbBorderColors: ['#ff0000', '#00ff00', '#0000ff'],

  saveCurrentPreset: (name) => {
    console.log("Would save preset:", name);
  },

  // New display mode state
  displayMode: 'scrolling', // 'scrolling' or 'static'
  setDisplayMode: (mode) => set({ displayMode: mode }),

  // Static text properties
  staticText: '',
  setStaticText: (text) => set({ staticText: text }),
  staticTextPosition: 'center', // 'top', 'center', 'bottom'
  setStaticTextPosition: (position) => set({ staticTextPosition: position }),
  staticTextAlignment: 'center', // 'left', 'center', 'right'
  setStaticTextAlignment: (alignment) => set({ staticTextAlignment: alignment }),
  staticTextFontSize: 24, // in pixels
  setStaticTextFontSize: (size) => set({ staticTextFontSize: size }),

  // Actions - FIXED: Added missing individual outline functions
  setFontSize: (fontSize) => set({ fontSize }),
  setTextSkew: (textSkew) => set({ textSkew }),
  setTextRotation: (textRotation) => set({ textRotation }),
  setFlickerIntensity: (flickerIntensity) => set({ flickerIntensity }),

  // Individual outline controls (FIXED)
  setOutlineColor: (outlineColor) => set({ outlineColor }),
  setOutlineWidth: (outlineWidth) => set({ outlineWidth }),

  // Individual shadow controls (FIXED)
  setShadowColor: (shadowColor) => set({ shadowColor }),
  setShadowBlur: (shadowBlur) => set({ shadowBlur }),

  // Existing actions
  toggleRgbBorder: () => set((state) => ({ rgbBorderEnabled: !state.rgbBorderEnabled })),
  setRgbBorderSpeed: (speed) => set({ rgbBorderSpeed: speed }),
  setRgbBorderColors: (colors) => set({ rgbBorderColors: colors }),
  toggleFlicker: () => set((state) => ({ flickerEnabled: !state.flickerEnabled })),
  setFlickerSpeed: (speed) => set({ flickerSpeed: speed }),
  setFlickerColors: (colors) => set({ flickerColors: colors }),
  setText: (text) => set({ text }),
  setFont: (font) => set({ font }),
  setTextCase: (textCase) => set({ textCase }),
  setLetterSpacing: (letterSpacing) => set({ letterSpacing }),
  setLineHeight: (lineHeight) => set({ lineHeight }),
  setColor: (color) => set({ color }),
  setReflection: (reflection) => set({ reflection }),
  setDirection: (direction) => set({ direction }),
  setSpeed: (speed) => set({ speed }),
  setEasing: (easing) => set({ easing }),
  setDelay: (delay) => set({ delay }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setBackground: (background) => set({ background }),
  setBackgroundImage: (backgroundImage) => set({ backgroundImage }),
  setBgColor: (bgColor) => set({ bgColor }),
  setFrameStyle: (frameStyle) => set({ frameStyle }),
  toggleCornerLights: () => set((state) => ({ cornerLights: !state.cornerLights })),
  setAudioSource: (audioSource) => set({ audioSource }),
  setSensitivity: (sensitivity) => set({ sensitivity }),
  setReactTo: (reactTo) => set({ reactTo }),
  setIntensity: (intensity) => set({ intensity }),
  setTextStyle: (textStyle) => set({ textStyle }),

  // New animation actions
  setAnimationType: (animationType) => set({ animationType }),
  setAnimationDuration: (animationDuration) => set({ animationDuration }),
  setAnimationDelay: (animationDelay) => set({ animationDelay }),
  setTransitionStyle: (transitionStyle) => set({ transitionStyle }),
}));