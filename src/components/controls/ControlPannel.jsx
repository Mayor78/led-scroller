import React, { useState, useEffect } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import { FaChevronRight, FaChevronDown, FaPalette, FaSave, FaUpload, FaUnderline, FaSyncAlt } from "react-icons/fa";
import { FaInfo,  } from "react-icons/fa6";
import { MdOutlinePauseCircleOutline, MdPlayArrow, MdHelpOutline, MdSwapHoriz } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import FontControls from './FontControls';
import ColorControls from './ColorControls';
import SpeedControl from './SpeedControl';
import BackgroundSelector from './BackgroundSelector';
import FlickerControls from './FlickerControls';
import AudioControls from './AudioControls';
import ExportControls from './ExportControls';
import EffectControls from './EffectControls';
import RgbBorderControls from './RgbBorderControls';
import PresetManager from '../../contexts/PresetManager';
import TextLimiter from '../display/TextLimiter';

// Animation constants
const sectionAnimations = {
  open: { opacity: 1, height: "auto" },
  collapsed: { opacity: 0, height: 0 }
};

const ControlSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div 
      className="bg-gray-900/70 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800/50 glass-effect"
      initial={false}
      animate={{ 
        boxShadow: isOpen ? "0 0 15px rgba(0, 255, 100, 0.3)" : "none"
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-800/50 transition-all"
        whileHover={{ x: 2 }}
      >
        <div className="flex items-center gap-2">
          <motion.span 
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaChevronRight size={18} className="text-green-400" />
          </motion.span>
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-300">
            {title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={sectionAnimations}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-4 space-y-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ControlPanel = () => {
  const { text, setText, isPlaying, togglePlay, background, speed, setSpeed, setBackground } = useScrollerStore();
  const [activeHelp, setActiveHelp] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('matrix');
  const [isMirrored, setIsMirrored] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('left');
  const [brightness, setBrightness] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [presets] = useState([
    { name: "Matrix", colors: ["#00ff00", "#001a00"], bg: "matrix" },
    { name: "Neon", colors: ["#ff00ff", "#110011"], bg: "neon" },
    { name: "Cyber", colors: ["#00ffff", "#001a33"], bg: "cyber" }
  ]);

  const themes = {
    matrix: { primary: "#00ff41", bg: "#000" },
    cyber: { primary: "#00ff9d", bg: "#0a0e17" },
    neon: { primary: "#ff00ff", bg: "#110011" }
  };

  // Detect mobile and handle play toggle
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && !isPlaying && togglePlay) {
      setShowModal(true);
    }
  }, [isPlaying, togglePlay]);

  const handlePlayToggle = () => {
    if (window.innerWidth <= 768 && !isPlaying) {
      setShowModal(true);
      return;
    }
    togglePlay();
    if (!isPlaying) {
      const element = document.querySelector('.led-display');
      if (element?.requestFullscreen) {
        element.requestFullscreen().catch(e => console.log("Fullscreen error:", e));
      }
    }
  };

  const confirmLandscape = () => {
    setShowModal(false);
    togglePlay();
    const element = document.querySelector('.led-display');
    if (element?.requestFullscreen) {
      element.requestFullscreen().catch(e => console.log("Fullscreen error:", e));
    }
  };

  const cancelLandscape = () => {
    setShowModal(false);
  };

  return (
    <motion.div 
      className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg space-y-6 border border-gray-800/60 glass-effect"
      style={{
        '--primary': themes[currentTheme].primary,
        '--bg': themes[currentTheme].bg,
        background: `linear-gradient(135deg, rgba(0, 0, 0, 0.8), var(--bg))`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with theme and preset selector */}
      <motion.div className="flex justify-between items-center mb-4">
        <motion.h2 
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-300"
          whileHover={{ scale: 1.02 }}
        >
          HOLO SCROLLER CONTROL
        </motion.h2>
        <div className="flex gap-2">
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            className="bg-gray-800 text-white px-3 py-1 rounded-lg border border-gray-700 hover:border-green-500 transition-all"
          >
            {Object.keys(themes).map(theme => (
              <option key={theme} value={theme}>{theme.toUpperCase()}</option>
            ))}
          </select>
          <select
            onChange={(e) => {
              const preset = presets.find(p => p.name === e.target.value);
              setBackground(preset.bg);
              setCurrentTheme(preset.name.toLowerCase());
            }}
            className="bg-gray-800 text-white px-3 py-1 rounded-lg border border-gray-700 hover:border-green-500 transition-all"
          >
            <option value="">Load Preset</option>
            {presets.map(preset => (
              <option key={preset.name} value={preset.name}>{preset.name}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Quick Access Toolbar */}
      <motion.div 
        className="flex justify-center gap-3 p-2 bg-gray-800/50 rounded-xl glow-pulse"
        whileHover={{ scale: 1.02 }}
      >
        <motion.button
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-green-400 glow"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaPalette size={18} />
        </motion.button>
        <motion.button
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-green-400 glow"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaSave size={18} />
        </motion.button>
      </motion.div>

      {/* Text Input & Playback */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800/30 p-4 rounded-xl border border-gray-700/30 glow-pulse"
        whileHover={{ scale: 1.01 }}
      >
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-300">Display Text</label>
            <div className="relative group">
              <FaInfo size={14} className="text-gray-400 hover:text-white cursor-help" />
              <div className="absolute z-10 hidden group-hover:block w-64 p-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-xs">
                Type your message here. It will scroll across the LED display.
              </div>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-gray-700/70 text-white p-3 rounded-md border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all"
            rows={3}
            placeholder="Enter your holographic message..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <motion.button
            onClick={handlePlayToggle}
            className={`w-full py-3 px-4 rounded-md font-bold flex items-center justify-center gap-2 transition-all ${
              isPlaying ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
            } glow-pulse text-white`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <>
                <MdOutlinePauseCircleOutline size={20} /> PAUSE
              </>
            ) : (
              <>
                <MdPlayArrow size={20} /> PLAY
              </>
            )}
          </motion.button>
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaSave size={16} className="text-gray-400" />
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
              className="w-full accent-green-500"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Preset Buttons */}
      <motion.div className="flex flex-wrap gap-3">
        {presets.map((preset) => (
          <motion.button
            key={preset.name}
            onClick={() => {
              setBackground(preset.bg);
              setCurrentTheme(preset.name.toLowerCase());
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gray-800/70 hover:bg-gray-700/70 transition-all glow"
            style={{ 
              borderLeft: `4px solid ${preset.colors[0]}`,
              borderRight: `4px solid ${preset.colors[1]}`
            }}
          >
            {preset.name} <span className="text-xl">{preset.icon}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Collapsible Control Sections */}
      <motion.div className="space-y-4">
        <ControlSection title="Text Styling" defaultOpen={true}>
          <FontControls />
          <TextLimiter />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Mirror Text</label>
            <motion.button
              onClick={() => setIsMirrored(!isMirrored)}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-green-400 glow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaSyncAlt size={16} />
            </motion.button>
          </div>
        </ControlSection>

        <ControlSection title="Visual Effects">
          <ColorControls />
          <EffectControls />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Scroll Direction</label>
            <select
              value={scrollDirection}
              onChange={(e) => setScrollDirection(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded-md border border-gray-600"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </div>
        </ControlSection>

        <ControlSection title="Animation & Speed">
          <SpeedControl />
        </ControlSection>

        <ControlSection title="Environment">
          <BackgroundSelector />
          <FlickerControls />
          <RgbBorderControls />
        </ControlSection>

        {background !== 'solid' && (
          <ControlSection title="Audio Sync">
            <AudioControls />
          </ControlSection>
        )}

        <ControlSection title="Save & Load">
          <ExportControls />
          <div className="pt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-md font-semibold text-gray-300">Presets</h3>
              <div className="relative group">
                <MdHelpOutline size={14} />
                <div className="absolute z-10 hidden group-hover:block w-64 p-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-xs">
                  Save your current settings as a preset for quick access later.
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <motion.button 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm flex items-center gap-2 glow-pulse"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSave size={14} /> Save
              </motion.button>
              <motion.button 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm flex items-center gap-2 glow-pulse"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUpload size={14} /> Load
              </motion.button>
            </div>
          </div>
        </ControlSection>
        <ControlSection title="Presets" defaultOpen={true}>
          <PresetManager />
        </ControlSection>
      </motion.div>

      {/* Undo/Redo & Help */}
      <motion.div 
        className="flex justify-between gap-2 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 glow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaUnderline size={16} />
        </motion.button>
        <motion.button
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 glow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MdHelpOutline size={16} />
        </motion.button>
      </motion.div>

      {/* Landscape Modal for Mobile */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-xl border border-green-500 text-white text-center"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
            >
              <h3 className="text-xl font-bold mb-4 text-green-400">Landscape Mode Required</h3>
              <p className="mb-4">Please rotate your device to landscape mode for the best LED screen experience.</p>
              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={confirmLandscape}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirm
                </motion.button>
                <motion.button
                  onClick={cancelLandscape}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Add CSS-in-JS for custom styles
const styles = `
  .glass-effect {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2));
    backdrop-filter: blur(10px);
  }
  .glow {
    box-shadow: 0 0 10px rgba(0, 255, 100, 0.3);
    transition: box-shadow 0.3s;
  }
  .glow-pulse {
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 5px rgba(0, 255, 100, 0.3); }
    50% { box-shadow: 0 0 15px rgba(0, 255, 100, 0.6); }
    100% { box-shadow: 0 0 5px rgba(0, 255, 100, 0.3); }
  }
  @keyframes scrollLeft {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

// Apply styles (assuming a way to inject CSS, e.g., styled-components or a CSS file)
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);
document.adoptedStyleSheets = [styleSheet];

export default ControlPanel;