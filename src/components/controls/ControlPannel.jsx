import React, { useState, useEffect } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import { FaChevronRight, FaChevronDown, FaPalette, FaAmazonPay, FaSave, FaUpload, FaUndo, FaRedo, FaCamera, FaTypo3 } from "react-icons/fa";
import { FaInfo, FaSlideshare } from "react-icons/fa6";
import { MdOutlinePauseCircleOutline, MdPlayArrow, MdHelpOutline, MdOutlineScreenshot } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';

import FontControls from './FontControls'; // Updated from TextControls
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
const ControlSection = ({ title, children, isOpen, onToggle, icon: Icon }) => {
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
        onClick={() => onToggle(title)}
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
  const [activeSections, setActiveSections] = useState(new Set(['Text Appearance']));
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
    if (isMobile && !isPlaying) {
      if (window.confirm("For the best experience, the LED display will open in fullscreen landscape mode. Please rotate your device if it doesn't happen automatically. Continue?")) {
        togglePlay();
        enterFullscreen();
      }
    } else {
      togglePlay();
      if (!isPlaying) {
        enterFullscreen();
      }
    }
  };

  const enterFullscreen = () => {
    const element = document.querySelector('.led-display');
    if (element?.requestFullscreen) {
      element.requestFullscreen().catch(e => console.log("Fullscreen error:", e));
    }
    
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(e => console.log("Orientation lock error:", e));
    }
  };

  // Toolbar icons with improved styling
  const toolbarIcons = [
    { icon: FaAmazonPay, tooltip: "Text Options" },
    { icon: FaPalette, tooltip: "Color Controls" },
    { icon: FaSlideshare, tooltip: "Adjust Settings" },
    { icon: FaAmazonPay, tooltip: "Effects" }
  ];

  // Toggle section state
  const handleSectionToggle = (title) => {
    setActiveSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title); // Close the section if already open
      } else {
        newSet.add(title); // Open the section if not open
      }
      return newSet;
    });
  };

  return (
    <motion.div 
      className="bg-gray-900/95 backdrop-blur-lg p-5 rounded-2xl shadow-2xl space-y-5 border border-gray-700/30 relative overflow-hidden"
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
          className="text-lg md:text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.02 }}
        >
          NEO-LED CONTROL HUB
        </motion.h2>
        <div className="relative group">
          <div className="absolute z-10 hidden group-hover:block w-48 p-2 bg-gray-800 
                          border border-gray-600 rounded-lg shadow-lg text-xs bottom-full mb-2">
            Choose a visual theme for your control panel
          </div>
        </div>
      </motion.div>

      {/* Text Input & Playback */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800/40 p-5 rounded-xl border border-gray-700/20"
        whileHover={{ scale: 1.005 }}
      >
        <div className="md:col-span-2">
          <div className="flex items-center gap-1 mb-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <FaTypo3 size={14} className="text-green-400" />
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
                <MdOutlinePauseCircleOutline size={18} /> PAUSE
              </>
            ) : (
              <>
                <MdPlayArrow size={18} /> PLAY
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Collapsible Control Sections */}
      <motion.div className="space-y-4">
        <ControlSection 
          title="Text Appearance" 
          isOpen={activeSections.has('Text Appearance')} 
          onToggle={handleSectionToggle} 
          icon={FaAmazonPay}
        >
          <FontControls /> {/* Updated to use FontControls */}
          <TextLimiter />
        </ControlSection>

        <ControlSection 
          title="Color & Effects" 
          isOpen={activeSections.has('Color & Effects')} 
          onToggle={handleSectionToggle} 
          icon={FaPalette}
        >
          <ColorControls />
          <EffectControls />
        </ControlSection>

        <ControlSection 
          title="Animation Settings" 
          isOpen={activeSections.has('Animation Settings')} 
          onToggle={handleSectionToggle} 
          icon={FaAmazonPay}
        >
          <SpeedControl />
        </ControlSection>

        <ControlSection 
          title="Background & Border" 
          isOpen={activeSections.has('Background & Border')} 
          onToggle={handleSectionToggle} 
          icon={FaAmazonPay}
        >
          <BackgroundSelector />
          <FlickerControls />
          <RgbBorderControls />
        </ControlSection>

        {background !== 'solid' && (
          <ControlSection 
            title="Audio Reactivity" 
            isOpen={activeSections.has('Audio Reactivity')} 
            onToggle={handleSectionToggle} 
            icon={FaAmazonPay}
          >
            <AudioControls />
          </ControlSection>
        )}

        <ControlSection 
          title="Presets" 
          isOpen={activeSections.has('Presets')} 
          onToggle={handleSectionToggle} 
          icon={FaAmazonPay}
        >
          <PresetManager />
        </ControlSection>
      </motion.div>
    </motion.div>
  );
};

export default ControlPanel;