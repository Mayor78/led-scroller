import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChevronRight, 
  FaChevronDown, 
  FaPalette, 
  FaSave, 
  FaUpload, 
  FaUnderline,
  FaPlay,
  FaPause,
  FaMagic,
  FaBolt,
  FaEye,
  FaRocket,
  FaMobile,
  FaExpand
} from "react-icons/fa";
import { 
  FaInfo, 
  FaPallet,
  FaWandMagicSparkles,
  FaGear
} from "react-icons/fa6";
import { 
  MdOutlinePauseCircleOutline, 
  MdPlayArrow, 
  MdHelpOutline,
  MdFullscreen,
  MdScreenRotation,
  MdClose
} from "react-icons/md";

// Mock store hook for demonstration
const useScrollerStore = () => {
  const [text, setText] = useState('Welcome to LED Scroller!');
  const [isPlaying, setIsPlaying] = useState(false);
  const [background, setBackground] = useState('solid');
  const [speed, setSpeed] = useState(5);
  
  return {
    text,
    setText,
    isPlaying,
    togglePlay: () => setIsPlaying(!isPlaying),
    background,
    speed
  };
};

// Mobile Detection Hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

// Landscape Modal Component
const LandscapeModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-green-500/30 shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 90, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <MdScreenRotation size={32} className="text-green-400" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                Rotate to Landscape
              </h3>
              
              <p className="text-gray-300 mb-6">
                For the best LED display experience, please rotate your device to landscape mode. 
                The display will automatically enter fullscreen.
              </p>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <MdFullscreen size={18} />
                  Continue
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Unique Control Section with Neon Theme
const ControlSection = ({ title, children, defaultOpen = false, icon: Icon, color = "green" }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colorVariants = {
    green: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    orange: "from-orange-500/20 to-red-500/20 border-orange-500/30"
  };

  return (
    <motion.div 
      className={`bg-gradient-to-r ${colorVariants[color]} backdrop-blur-sm rounded-2xl overflow-hidden border-2 shadow-lg`}
      initial={false}
      animate={{ 
        boxShadow: isOpen ? `0 0 20px rgba(0, 255, 0, 0.3)` : "0 0 5px rgba(0, 0, 0, 0.2)"
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 hover:bg-white/10 transition-all"
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <motion.div
              animate={{ rotate: isOpen ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="p-2 rounded-full bg-white/10"
            >
              <Icon size={20} className="text-white" />
            </motion.div>
          )}
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="text-white/70" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-4 space-y-4 bg-black/20"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, color = "green", active = false }) => {
  const colorClasses = {
    green: active ? "bg-green-500 text-white" : "bg-green-500/20 text-green-400 hover:bg-green-500/30",
    blue: active ? "bg-blue-500 text-white" : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
    purple: active ? "bg-purple-500 text-white" : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30",
    orange: active ? "bg-orange-500 text-white" : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
  };

  return (
    <motion.button
      onClick={onClick}
      className={`p-3 rounded-xl transition-all ${colorClasses[color]} border border-current/30`}
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      title={label}
    >
      <Icon size={20} />
    </motion.button>
  );
};

// Main Control Panel Component
const ControlPanel = () => {
  const { text, setText, isPlaying, togglePlay, background, speed } = useScrollerStore();
  const isMobile = useIsMobile();
  const [showLandscapeModal, setShowLandscapeModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('cyberpunk');
  const [aiMode, setAiMode] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState(false);

  const themes = {
    cyberpunk: { 
      primary: "from-green-400 to-emerald-500", 
      bg: "from-gray-900 via-green-900/20 to-gray-900",
      accent: "green"
    },
    neon: { 
      primary: "from-pink-400 to-purple-500", 
      bg: "from-gray-900 via-purple-900/20 to-gray-900",
      accent: "purple"
    },
    cyber: { 
      primary: "from-cyan-400 to-blue-500", 
      bg: "from-gray-900 via-blue-900/20 to-gray-900",
      accent: "blue"
    },
    retro: { 
      primary: "from-orange-400 to-red-500", 
      bg: "from-gray-900 via-orange-900/20 to-gray-900",
      accent: "orange"
    }
  };

  const handlePlayToggle = () => {
    if (!isPlaying && isMobile) {
      setShowLandscapeModal(true);
    } else {
      togglePlay();
      enterFullscreen();
    }
  };

  const enterFullscreen = () => {
    const element = document.querySelector('.led-display') || document.documentElement;
    if (element?.requestFullscreen) {
      element.requestFullscreen().catch(e => console.log("Fullscreen error:", e));
    }
  };

  const handleLandscapeConfirm = () => {
    setShowLandscapeModal(false);
    togglePlay();
    
    // Force landscape orientation if supported
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(e => console.log("Orientation lock error:", e));
    }
    
    enterFullscreen();
  };

  const generateAIText = () => {
    const aiTexts = [
      "✨ WELCOME TO THE FUTURE ✨",
      "🚀 CYBERPUNK VIBES ACTIVATED 🚀",
      "💫 NEON DREAMS LOADING... 💫",
      "⚡ DIGITAL REVOLUTION NOW ⚡",
      "🌟 MATRIX MODE ENGAGED 🌟"
    ];
    setText(aiTexts[Math.floor(Math.random() * aiTexts.length)]);
    setAiMode(true);
    setTimeout(() => setAiMode(false), 2000);
  };

  return (
    <>
      <motion.div 
        className={`bg-gradient-to-br ${themes[currentTheme].bg} backdrop-blur-md p-6 rounded-3xl shadow-2xl space-y-6 border-2 border-white/20 relative overflow-hidden`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-current rounded-full"
              animate={{
                x: [0, Math.random() * 400],
                y: [0, Math.random() * 400],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
            />
          ))}
        </div>

        {/* Header with Theme Selector */}
        <motion.div className="flex justify-between items-center relative z-10">
          <motion.h2 
            className={`text-2xl font-bold bg-gradient-to-r ${themes[currentTheme].primary} bg-clip-text text-transparent`}
            whileHover={{ scale: 1.02 }}
          >
            🚀 QUANTUM LED CONTROLLER
          </motion.h2>
          
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            className="bg-black/50 text-white text-sm rounded-xl px-3 py-2 border border-white/30 backdrop-blur-sm"
          >
            {Object.keys(themes).map(theme => (
              <option key={theme} value={theme}>{theme.toUpperCase()}</option>
            ))}
          </select>
        </motion.div>

        {/* Quick Action Toolbar */}
        <motion.div 
          className="flex justify-center gap-4 p-4 bg-black/30 rounded-2xl border border-white/20"
          whileHover={{ scale: 1.01 }}
        >
          <QuickActionButton 
            icon={FaMagic} 
            label="AI Generate" 
            onClick={generateAIText}
            color={themes[currentTheme].accent}
            active={aiMode}
          />
          <QuickActionButton 
            icon={FaBolt} 
            label="Speed Boost" 
            onClick={() => {}}
            color={themes[currentTheme].accent}
          />
          <QuickActionButton 
            icon={FaEye} 
            label="Visualizer" 
            onClick={() => setVisualizerMode(!visualizerMode)}
            color={themes[currentTheme].accent}
            active={visualizerMode}
          />
          <QuickActionButton 
            icon={FaRocket} 
            label="Blast Mode" 
            onClick={() => {}}
            color={themes[currentTheme].accent}
          />
        </motion.div>

        {/* Text Input & Enhanced Playback */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/30 p-6 rounded-2xl border border-white/20"
          whileHover={{ scale: 1.005 }}
        >
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-lg font-bold text-white">
                💬 Quantum Message
              </label>
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.1 }}
              >
                <FaInfo size={16} className="text-white/70 hover:text-white cursor-help" />
                <div className="absolute z-10 hidden group-hover:block w-64 p-3 bg-black/90 
                                border border-white/30 rounded-xl shadow-xl text-sm backdrop-blur-sm">
                  🚀 Enter your cosmic message here! Use emojis for extra flair ✨
                </div>
              </motion.div>
            </div>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-black/50 text-white p-4 rounded-xl border-2 border-white/30 
                         focus:border-green-500 focus:ring-2 focus:ring-green-500/30 
                         backdrop-blur-sm transition-all"
              rows={3}
              placeholder="🌟 Enter your stellar message... ✨"
            />
          </div>
          
          <div className="flex items-end">
            <motion.button
              onClick={handlePlayToggle}
              className={`w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg
                ${isPlaying 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/30' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/30'
                }`}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <>
                  <MdOutlinePauseCircleOutline size={24} /> PAUSE
                </>
              ) : (
                <>
                  <MdPlayArrow size={24} /> 
                  {isMobile ? 'LANDSCAPE' : 'LAUNCH'}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Live Hologram Preview */}
        <motion.div 
          className="p-4 rounded-2xl bg-black border-2 border-green-500/50 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="h-16 w-full relative overflow-hidden">
            <motion.div 
              className="absolute top-1/2 whitespace-nowrap text-2xl font-bold"
              style={{
                color: '#00ff41',
                textShadow: '0 0 10px #00ff41, 0 0 20px #00ff41',
                transform: 'translateY(-50%)'
              }}
              animate={{ 
                x: [800, -800],
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {text || "🌟 Your hologram preview... ✨"}
            </motion.div>
          </div>
          
          {/* Hologram scan lines */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-0.5 bg-green-400/30"
                style={{ top: `${(i + 1) * 12.5}%` }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Control Sections */}
        <motion.div className="space-y-4">
          <ControlSection title="🎨 Visual Matrix" icon={FaPalette} color={themes[currentTheme].accent} defaultOpen={true}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-2">Font Style</label>
                <select className="w-full bg-black/50 text-white rounded-lg p-2 border border-white/30">
                  <option>Matrix</option>
                  <option>Cyberpunk</option>
                  <option>Retro</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 mb-2">Text Size</label>
                <input type="range" className="w-full" min="10" max="100" defaultValue="50" />
              </div>
            </div>
          </ControlSection>

          <ControlSection title="⚡ Power Settings" icon={FaBolt} color={themes[currentTheme].accent}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-2">Speed Warp</label>
                <input type="range" className="w-full" min="1" max="20" defaultValue={speed} />
              </div>
              <div>
                <label className="block text-white/80 mb-2">Intensity</label>
                <input type="range" className="w-full" min="1" max="10" defaultValue="5" />
              </div>
            </div>
          </ControlSection>

          <ControlSection title="🌈 Quantum Effects" icon={FaWandMagicSparkles} color={themes[currentTheme].accent}>
            <div className="grid grid-cols-2 gap-2">
              {['Neon Glow', 'Matrix Rain', 'Hologram', 'Cyber Pulse'].map((effect) => (
                <motion.button
                  key={effect}
                  className="p-3 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-all border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {effect}
                </motion.button>
              ))}
            </div>
          </ControlSection>

          <ControlSection title="🎵 Audio Sync" icon={FaGear} color={themes[currentTheme].accent}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Music Reactive</span>
                <motion.button 
                  className="w-12 h-6 bg-green-500 rounded-full relative"
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                    animate={{ x: [1, 23] }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
              <div>
                <label className="block text-white/80 mb-2">Beat Sensitivity</label>
                <input type="range" className="w-full" min="1" max="10" defaultValue="5" />
              </div>
            </div>
          </ControlSection>
        </motion.div>

        {/* Floating Action Buttons */}
        <motion.div 
          className="flex justify-center gap-4 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaSave size={20} />
          </motion.button>
          
          <motion.button
            className="p-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
            whileHover={{ scale: 1.1, rotate: -180 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaUpload size={20} />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Landscape Modal */}
      <LandscapeModal 
        isOpen={showLandscapeModal}
        onClose={() => setShowLandscapeModal(false)}
        onConfirm={handleLandscapeConfirm}
      />
    </>
  );
};

export default ControlPanel;