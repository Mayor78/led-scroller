import React, { useState, useEffect } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import { FaChevronRight, FaSlidersH, FaChevronDown, FaPalette, FaSave, FaUpload, FaUndo, FaRedo, FaCamera } from "react-icons/fa";
import { FaInfo, } from "react-icons/fa6";
import { MdOutlinePauseCircleOutline, MdPlayArrow, MdHelpOutline, MdOutlineScreenshot } from "react-icons/md";
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
import TextLimiter from '../display/TextLimiter';
import PresetManager from '../../contexts/PresetManager';

// Animation constants
const sectionAnimations = {
  open: { opacity: 1, height: "auto" },
  collapsed: { opacity: 0, height: 0 }
};

// Dropdown Section Component
const ControlSection = ({ title, children, defaultOpen = false, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div 
      className="bg-gray-700/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-600/20 hover:border-green-400/30 transition-all"
      initial={false}
      animate={{ 
        boxShadow: isOpen ? "0 0 15px rgba(0, 255, 0, 0.15)" : "none"
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-600/20 transition-all group"
        whileHover={{ x: 3 }}
      >
        <div className="flex items-center gap-3">
          <motion.span 
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-green-400"
          >
            <FaChevronRight size={16} />
          </motion.span>
          {Icon && <Icon className="text-green-400/80" size={18} />}
          <h3 className="text-lg font-medium text-green-300 group-hover:text-green-400 transition-colors">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 group-hover:text-gray-300"
        >
          <FaChevronDown size={14} />
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
            className="p-4 space-y-4 border-t border-gray-600/20"
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
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const themes = {
    matrix: { primary: "#00ff41", bg: "#000", name: "MATRIX" },
    cyber: { primary: "#00ff9d", bg: "#0a0e17", name: "CYBERPUNK" },
    neon: { primary: "#ff00ff", bg: "#110011", name: "NEON DREAMS" },
    retro: { primary: "#ff9900", bg: "#1a0f29", name: "RETRO WAVE" },
    oceanic: { primary: "#00ffff", bg: "#001a33", name: "DEEP OCEAN" }
  };

  const presetButtons = [
    { name: "Matrix", colors: ["#00ff00", "#001a00"], icon: "🌐" },
    { name: "Neon", colors: ["#ff00ff", "#110011"], icon: "💡" },
    { name: "Cyber", colors: ["#00ffff", "#001a33"], icon: "🔮" },
    { name: "Retro", colors: ["#ff9900", "#1a0f29"], icon: "🕹️" }
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

  // Toolbar icons with improved styling
  const toolbarIcons = [
    { icon: FaSlidersH, tooltip: "Text Options" },
    { icon: FaPalette, tooltip: "Color Controls" },
    { icon: FaSlidersH, tooltip: "Adjust Settings" },
    { icon: FaSlidersH, tooltip: "Effects" }
  ];

  return (
    <motion.div 
      className="bg-gray-900/95 backdrop-blur-lg p-5 rounded-2xl shadow-2xl space-y-5 border border-gray-700/30 relative overflow-hidden"
      style={{
        '--primary': themes[currentTheme].primary,
        '--bg': themes[currentTheme].bg,
        background: `linear-gradient(145deg, #1a202c 0%, #2d3748 100%)`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-green-400/10 blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-blue-400/10 blur-xl"></div>
      
      {/* Header with theme selector */}
      <motion.div className="flex justify-between items-center relative z-10">
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.02 }}
        >
          NEO-LED CONTROL HUB
        </motion.h2>
        <div className="relative group">
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-600/50 focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none cursor-pointer pr-8"
          >
            {Object.entries(themes).map(([key, theme]) => (
              <option key={key} value={key}>{theme.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <FaChevronDown className="text-gray-400" size={12} />
          </div>
          <div className="absolute z-10 hidden group-hover:block w-48 p-2 bg-gray-800 
                          border border-gray-600 rounded-lg shadow-lg text-xs bottom-full mb-2">
            Choose a visual theme for your control panel
          </div>
        </div>
      </motion.div>

      {/* Quick Access Toolbar */}
      <motion.div 
        className="flex justify-center gap-3 p-3 bg-gray-800/40 rounded-xl border border-gray-700/20"
        whileHover={{ scale: 1.01 }}
      >
        {toolbarIcons.map((item, i) => (
          <motion.button
            key={i}
            className="p-3 rounded-xl bg-gray-700/50 hover:bg-gray-600/70 text-green-400 relative group"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <item.icon size={20} />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 py-1 px-2 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.tooltip}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Text Input & Playback */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800/40 p-5 rounded-xl border border-gray-700/20"
        whileHover={{ scale: 1.005 }}
      >
        <div className="md:col-span-2">
          <div className="flex items-center gap-1 mb-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <FaSlidersH size={14} className="text-green-400" />
              Display Text
            </label>
            <div className="relative group">
              <FaInfo size={14} className="text-gray-400 hover:text-white cursor-help" />
              <div className="absolute z-10 hidden group-hover:block w-64 p-3 bg-gray-800 
                              border border-gray-600 rounded-lg shadow-lg text-xs left-6 -translate-x-full">
                Type your message here. It will scroll across the LED display with your selected effects.
              </div>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-gray-700/50 text-white p-3 rounded-lg border border-gray-600/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all"
            rows={3}
            placeholder="Enter your scrolling message..."
          />
        </div>
        <div className="flex flex-col justify-between gap-3">
          <motion.button
            onClick={handlePlayToggle}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              isPlaying 
                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
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
          
          <div className="flex gap-2">
            <motion.button
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600/70 text-gray-300 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUndo size={14} />
            </motion.button>
            <motion.button
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600/70 text-gray-300 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRedo size={14} />
            </motion.button>
            <motion.button
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600/70 text-gray-300 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdOutlineScreenshot size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Preset Quick Select */}
      <motion.div className="flex flex-wrap gap-2 justify-center">
        {presetButtons.map((preset) => (
          <motion.button
            key={preset.name}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm 
                     bg-gray-800/60 hover:bg-gray-700/70 transition-all border border-gray-700/30"
            style={{ 
              background: `linear-gradient(45deg, ${preset.colors[0]}20, ${preset.colors[1]}20)`,
              borderColor: `${preset.colors[0]}40`
            }}
          >
            <span className="text-lg">{preset.icon}</span> 
            <span>{preset.name}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Collapsible Control Sections */}
      <motion.div className="space-y-4">
        <ControlSection title="Text Appearance" defaultOpen={true} icon={FaSlidersH}>
          <FontControls />
          <TextLimiter/>
        </ControlSection>

        <ControlSection title="Color & Effects" icon={FaPalette}>
          <ColorControls />
          <EffectControls />
        </ControlSection>

        <ControlSection title="Animation Settings" icon={FaSlidersH}>
          <SpeedControl />
        </ControlSection>

        <ControlSection title="Background & Border" icon={FaSlidersH}>
          <BackgroundSelector />
          <FlickerControls />
          <RgbBorderControls />
        </ControlSection>

        {background !== 'solid' && (
          <ControlSection title="Audio Reactivity" icon={FaSlidersH}>
            <AudioControls />
          </ControlSection>
        )}

        <ControlSection title="Export & Save" icon={FaSave}>
          <ExportControls />
        </ControlSection>
        
        <ControlSection title="Presets" defaultOpen={true}>
          <PresetManager />
        </ControlSection>
      </motion.div>
    </motion.div>
  );
};

export default ControlPanel;