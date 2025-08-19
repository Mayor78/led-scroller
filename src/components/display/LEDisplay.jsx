import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from './Background';
import ScrollingText from './ScrollingText';
import LEDEffects from './LEDEffect';
import { useScrollerStore } from '../../stores/useScrollerStore';

// Mobile detection hook
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



export default function LEDDisplay() {
  const { 
    background, 
    bgColor,
    frameStyle,
    cornerLights,
    text,
    color,
    speed,
    isPlaying,
    togglePlay
  } = useScrollerStore();
  
  const displayRef = useRef(null);
  const isMobile = useIsMobile();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showLandscapeModal, setShowLandscapeModal] = useState(false);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Pause playback if exiting fullscreen
      if (!isCurrentlyFullscreen && isPlaying) {
        togglePlay();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isPlaying, togglePlay]);

  // Monitor orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      const isCurrentlyLandscape = window.innerWidth > window.innerHeight;
      setIsLandscape(isCurrentlyLandscape);
      if (isCurrentlyLandscape && showLandscapeModal) {
        setShowLandscapeModal(false);
      }
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [showLandscapeModal]);

  // Enter fullscreen landscape mode
  const enterFullscreenLandscape = async () => {
    if (displayRef.current) {
      try {
        if (displayRef.current.requestFullscreen) {
          await displayRef.current.requestFullscreen();
        } else if (displayRef.current.webkitRequestFullscreen) {
          await displayRef.current.webkitRequestFullscreen();
        } else if (displayRef.current.mozRequestFullScreen) {
          await displayRef.current.mozRequestFullScreen();
        } else if (displayRef.current.msRequestFullscreen) {
          await displayRef.current.msRequestFullscreen();
        }
        if (isMobile && !isLandscape) {
          setShowLandscapeModal(true);
        }
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    }
  };

  // Trigger fullscreen on play for mobile
  useEffect(() => {
    if (isPlaying && isMobile && !isFullscreen) {
      enterFullscreenLandscape();
    }
  }, [isPlaying, isMobile, isFullscreen]);

  // Exit fullscreen when not playing
  useEffect(() => {
    if (!isPlaying && isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }, [isPlaying, isFullscreen]);

  const handleConfirmLandscape = () => {
    setShowLandscapeModal(false);
  };

  const handleCancelLandscape = () => {
    setShowLandscapeModal(false);
    togglePlay(); // Pause playback if user cancels
  };

  const displayClasses = `
    led-display relative overflow-hidden border-2 border-gray-700 bg-black
    ${isFullscreen ? 'fixed inset-0 z-40 w-screen h-screen rounded-none border-none' : 'h-64 w-full rounded-xl'}
  `;

  return (
    <>
      <div 
        ref={displayRef}
        className={displayClasses}
      >
        {/* Background Layer */}
        <Background type={background} color={bgColor} />
        
        {/* LED Screen Effect */}
        <div className="absolute inset-0 led-screen-effect">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{
                 backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 255, 65, 0.1) 50%)',
                 backgroundSize: '100% 4px'
               }} />
          {isFullscreen && (
            <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"
                 style={{
                   boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.8)'
                 }} />
          )}
        </div>
        
        {/* Scrolling Text */}
        <ScrollingText
          text={text}
          color={color}
          speed={speed}
          isPlaying={isPlaying}
        />
        
        {/* Visual Effects */}
        <LEDEffects 
          frameStyle={frameStyle} 
          cornerLights={cornerLights} 
        />
        
        {/* Reflection Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>

        {/* Fullscreen Controls */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 z-10 flex gap-2"
            >
              <motion.button
                onClick={() => togglePlay()}
                className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-black/70 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Landscape Modal - Positioned relative to the LED display */}
        <AnimatePresence>
          {showLandscapeModal && (
            <motion.div 
              className="absolut inset-0 b-black/80 backdrop-blur-md z-50 flex items-cente justify-cente p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-gray-800/90 backdrop-blur-lg border border-green-500/30 rounded-xl p-6 max-w-md w-full mx-4"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
                      <path d="M19 12v-1c0-1.33-2.67-2-4-2-1.33 0-4 .67-4 2v1c0 1.33 2.67 2 4 2 1.33 0 4-.67 4-2zm-4-6c-1.11 0-2 .89-2 2v.5c0 .83.67 1.5 1.5 1.5h1c.83 0 1.5-.67 1.5-1.5V8c0-1.11-.89-2-2-2zm6-2h-4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 0H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">Landscape Mode Required</h3>
                  <p className="text-gray-300">
                    For the best experience, please rotate your device to landscape orientation.
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={handleConfirmLandscape}
                    className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    I've Rotated My Device
                  </motion.button>
                  <motion.button
                    onClick={handleCancelLandscape}
                    className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .led-display {
          position: relative;
        }
        
        .led-display::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(90deg, transparent 98%, rgba(0, 255, 65, 0.1) 100%),
            linear-gradient(0deg, transparent 98%, rgba(0, 255, 65, 0.1) 100%);
          background-size: 4px 4px;
          pointer-events: none;
          opacity: 0.3;
        }

        .led-screen-effect {
          position: absolute;
          inset: 0;
        }

        .led-display:fullscreen,
        .led-display:-webkit-full-screen,
        .led-display:-moz-full-screen {
          border-radius: 0 !important;
          border: none !important;
        }

        @media screen and (orientation: landscape) and (max-height: 500px) {
          .led-display:fullscreen .scrolling-text {
            font-size: 4rem;
          }
        }

        @media screen and (orientation: portrait) and (max-width: 500px) {
          .led-display:fullscreen {
            background: #000;
          }
        }
      `}</style>
    </>
  );
}