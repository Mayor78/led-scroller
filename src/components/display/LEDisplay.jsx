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
  const [showLandscapePrompt, setShowLandscapePrompt] = useState(false);

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
      if (isCurrentlyLandscape && showLandscapePrompt) {
        setShowLandscapePrompt(false);
      }
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [showLandscapePrompt]);

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
          setShowLandscapePrompt(true);
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

  const displayClasses = `
    led-display relative overflow-hidden border-2 border-gray-700 bg-black
    ${isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none' : 'h-64 w-full rounded-xl'}
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

        {/* Landscape Orientation Prompt */}
        <AnimatePresence>
          {isFullscreen && isMobile && showLandscapePrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20"
              onClick={() => setShowLandscapePrompt(false)}
            >
              <div className="text-center text-white p-8 max-w-md">
                <motion.div
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mx-auto mb-6 w-20 h-20 border-4 border-green-400 rounded-lg flex items-center justify-center"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
                    <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03L12 2.03c1.33.07 2.59.32 3.81.7L18 5.92l-1.41 1.41-.69-.69c-.9-.24-1.84-.4-2.81-.46V2.52h1.39zm-.7 3.61c.81.25 1.58.59 2.28 1.01l1.14-1.14c-.96-.65-2.02-1.15-3.17-1.46l-.25 1.59zM12 19.96c-3.87-.78-6.8-3.71-7.58-7.58L2.42 12c.88 4.84 4.94 8.64 9.58 9.56v-1.6zm-1.71-1.71c1.33.07 2.59.32 3.81.7l2.19-3.19-1.41-1.41-.69.69c-.9.24-1.84.4-2.81.46v3.75h-1.09zm7.58-7.58c-.78-3.87-3.71-6.8-7.58-7.58L12 1.04c4.84.88 8.64 4.94 9.56 9.58h-1.6zm-15.73 0c.78 3.87 3.71 6.8 7.58 7.58L12 22.96c-4.84-.88-8.64-4.94-9.56-9.58h1.6z"/>
                  </svg>
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold mb-4"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Please Rotate Your Device
                </motion.h3>
                
                <p className="text-lg text-gray-300 mb-6">
                  For the best LED display experience, please rotate your device to landscape orientation.
                </p>
                
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <span className="text-3xl">📱</span>
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: [0, 90] }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                  >
                    ↻
                  </motion.span>
                  <span className="text-3xl">📱</span>
                </div>

                <motion.button
                  className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLandscapePrompt(false)}
                >
                  Continue Anyway
                </motion.button>
              </div>
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