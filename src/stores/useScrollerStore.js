// stores/useScrollerStore.js
import { create } from 'zustand';
import {presets} from './presets';
export const useScrollerStore = create((set) => ({
   
  // Text properties
  text: '',
  font: "'Orbitron', monospace",
  textCase: 'uppercase',
  letterSpacing: 3,
  lineHeight: 1.2,
   ...presets.default,
   loadPreset: (presetName) => {
    const presetToLoad = presets[presetName] || presets.default;
    set({ ...presetToLoad });
  },
   flickerEnabled: false,
  flickerSpeed: 5, // 1-10
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
  
  // Background & display
  background: 'matrix',
  bgColor: '#000000',
  frameStyle: 'led',
  cornerLights: true,
  
  // Audio reactivity
  audioSource: 'none',
  sensitivity: 100,
  reactTo: 'brightness',
  intensity: 50,

  rgbBorderEnabled: false,
  rgbBorderSpeed: 5, // 1-10
  rgbBorderColors: ['#ff0000', '#00ff00', '#0000ff'],
  

  saveCurrentPreset: (name) => {
    // In a real app, you would save to localStorage or backend
    console.log("Would save preset:", name);
    // You would update your presets.js file here
  },
  // Actions
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
  setOutline: (outlineColor, outlineWidth) => set({ outlineColor, outlineWidth }),
  setShadow: (shadowColor, shadowBlur) => set({ shadowColor, shadowBlur }),
  setReflection: (reflection) => set({ reflection }),
  setDirection: (direction) => set({ direction }),
  setSpeed: (speed) => set({ speed }),
  setEasing: (easing) => set({ easing }),
  setDelay: (delay) => set({ delay }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setBackground: (background) => set({ background }),
  setBgColor: (bgColor) => set({ bgColor }),
  setFrameStyle: (frameStyle) => set({ frameStyle }),
  toggleCornerLights: () => set((state) => ({ cornerLights: !state.cornerLights })),
  setAudioSource: (audioSource) => set({ audioSource }),
  setSensitivity: (sensitivity) => set({ sensitivity }),
  setReactTo: (reactTo) => set({ reactTo }),
  setIntensity: (intensity) => set({ intensity }),
}));