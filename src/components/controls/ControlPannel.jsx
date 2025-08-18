import React, { useState } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import { FaChevronRight, FaChevronDown,FaPalette , FaSave, FaUpload, FaUnderline  } from "react-icons/fa";

import { FaInfo } from "react-icons/fa6";

import FontControls from './FontControls';
import ColorControls from './ColorControls';
import SpeedControl from './SpeedControl';
import BackgroundSelector from './BackgroundSelector';
import FlickerControls from './FlickerControls';
import AudioControls from './AudioControls';
import ExportControls from './ExportControls';
import EffectControls from './EffectControls';
import RgbBorderControls from './RgbBorderControls';
// Dropdown Section Component


import { FaPallet } from "react-icons/fa6";
import { MdOutlinePauseCircleOutline, MdPlayArrow, MdHelpOutline    } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import TextLimiter from '../display/TextLimiter';
import PresetManager from '../../contexts/PresetManager';

// Animation constants
const sectionAnimations = {
  open: { opacity: 1, height: "auto" },
  collapsed: { opacity: 0, height: 0 }
};

const ControlSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div 
      className="bg-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-600/30"
      initial={false}
      animate={{ 
        boxShadow: isOpen ? "0 0 10px rgba(0, 255, 0, 0.2)" : "none"
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-600/30 transition-all"
        whileHover={{ x: 2 }}
      >
        <div className="flex items-center gap-2">
          <motion.span 
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaChevronRight size={18} className="text-green-400" />
          </motion.span>
          <h3 className="text-lg font-medium text-green-400">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <faChevronDown className="text-gray-400" />
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
  const { text, setText, isPlaying, togglePlay, background, speed } = useScrollerStore();
  const [activeHelp, setActiveHelp] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('matrix');

  const themes = {
    matrix: { primary: "#00ff41", bg: "#000" },
    cyber: { primary: "#00ff9d", bg: "#0a0e17" },
    neon: { primary: "#ff00ff", bg: "#110011" }
  };

  const presetButtons = [
    { name: "Matrix", colors: ["#00ff00", "#001a00"], icon: "🌐" },
    { name: "Neon", colors: ["#ff00ff", "#110011"], icon: "💡" },
    { name: "Cyber", colors: ["#00ffff", "#001a33"], icon: "🔮" }
  ];

  const handlePlayToggle = () => {
    togglePlay();
    if (!isPlaying) {
      const element = document.querySelector('.led-display');
      if (element?.requestFullscreen) {
        element.requestFullscreen().catch(e => console.log("Fullscreen error:", e));
      }
    }
  };

  return (
    <motion.div 
      className="bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-2xl space-y-4 border border-gray-700/50"
      style={{
        '--primary': themes[currentTheme].primary,
        '--bg': themes[currentTheme].bg
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with theme selector */}
      <motion.div className="flex justify-between items-center">
        <motion.h2 
          className="text-xl font-bold text-green-400"
          whileHover={{ scale: 1.02 }}
        >
          LED SCROLLER CONTROLS
        </motion.h2>
        <select
          value={currentTheme}
          onChange={(e) => setCurrentTheme(e.target.value)}
          className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
        >
          {Object.keys(themes).map(theme => (
            <option key={theme} value={theme}>{theme.toUpperCase()}</option>
          ))}
        </select>
      </motion.div>

      {/* Quick Access Toolbar */}
      <motion.div 
        className="flex justify-center gap-4 p-2 bg-gray-700/50 rounded-lg"
        whileHover={{ scale: 1.01 }}
      >
        {/* {[type, FaPalette , Sliders, Zap].map((Icon, i) => (
          <motion.button
            key={i}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-green-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon size={18} />
          </motion.button>
        ))} */}
      </motion.div>

      {/* Text Input & Playback */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-700/30 p-4 rounded-lg border border-gray-600/30"
        whileHover={{ scale: 1.005 }}
      >
        <div className="md:col-span-2">
          <div className="flex items-center gap-1 mb-1">
            <label className="text-sm font-medium text-gray-300">
              Display Text
            </label>
            <div className="relative group">
              <FaInfo  size={14} className="text-gray-400 hover:text-white cursor-help" />
              <div className="absolute z-10 hidden group-hover:block w-64 p-2 bg-gray-800 
                              border border-gray-600 rounded shadow-lg text-xs">
                Type your message here. It will scroll across the LED display.
              </div>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-gray-600/70 text-white p-3 rounded-md border border-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            rows={2}
            placeholder="Enter your message..."
          />
        </div>
        <div className="flex items-end">
          <motion.button
            onClick={handlePlayToggle}
            className={`w-full py-3 px-4 rounded-md font-bold transition-all flex items-center justify-center gap-2 ${
              isPlaying 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isPlaying ? (
              <>
                <MdOutlinePauseCircleOutline size={18} /> PAUSE
              </>
            ) : (
              <>
                <MdPlayArrow  size={18} /> PLAY
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Live Preview
      <motion.div 
        className="p-2 rounded bg-black border border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="h-12 w-full relative overflow-hidden">
          <motion.div 
            className="absolute top-1/2 whitespace-nowrap"
            style={{
              animation: `scrollLeft ${20 - speed}s linear infinite`,
              fontSize: '1.2rem',
              color: 'var(--primary)',
              textShadow: '0 0 5px var(--primary)'
            }}
            animate={{ 
              x: [null, -1000],
              transition: { 
                duration: 20 - speed,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          >
            {text || "Your text preview..."}
          </motion.div>
        </div>
      </motion.div> */}

      {/* Preset Buttons */}
      <motion.div className="flex flex-wrap gap-2">
        {presetButtons.map((preset) => (
          <motion.button
            key={preset.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs 
                     bg-gray-700 hover:bg-gray-600 transition-all"
            style={{ 
              borderLeft: `3px solid ${preset.colors[0]}`,
              borderRight: `3px solid ${preset.colors[1]}`
            }}
          >
            {preset.icon} {preset.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Collapsible Control Sections */}
      <motion.div className="space-y-3">
        <ControlSection title="Text Appearance" defaultOpen={true}>
          <FontControls />
          <TextLimiter/>
        </ControlSection>

        <ControlSection title="Color & Effects">
          <ColorControls />
          <EffectControls />
        </ControlSection>

        <ControlSection title="Animation Settings">
          <SpeedControl />
        </ControlSection>

        <ControlSection title="Background & Border">
          <BackgroundSelector />
          <FlickerControls />
          <RgbBorderControls />
        </ControlSection>

        {background !== 'solid' && (
          <ControlSection title="Audio Reactivity">
            <AudioControls />
          </ControlSection>
        )}

        <ControlSection title="Export & Presets">
          <ExportControls />
          <div className="pt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-md font-semibold text-gray-300">Presets</h3>
              <div className="relative group">
                <MdHelpOutline  size={14} />
                <div className="absolute z-10 hidden group-hover:block w-64 p-2 bg-gray-800 
                                border border-gray-600 rounded shadow-lg text-xs">
                <FaSave /> your current settings as a preset for quick access later
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <motion.button 
                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-md text-sm transition-all flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSave  size={14} /> Save
              </motion.button>
              <motion.button 
                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-md text-sm transition-all flex items-center gap-1"
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

      {/* Undo/Redo Controls */}
      <motion.div 
        className="flex justify-end gap-2 pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaUnderline size={16} />
        </motion.button>
        <motion.button
          className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <camera size={16} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ControlPanel;