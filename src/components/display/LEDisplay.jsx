import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
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
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Show SweetAlert2 landscape modal - COMPLETELY CLEAN
  const showLandscapeAlert = () => {
    Swal.fire({
      title: 'Landscape Mode Required',
      text: 'For the best experience, please rotate your device to landscape orientation.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: "I've Rotated My Device",
      cancelButtonText: 'Cancel',
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isDismissed) {
        // User clicked cancel, pause playback
        togglePlay();
      }
      // If user confirms, just continue (modal will close)
    });
  };

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
        
        // Show SweetAlert if not in landscape
        if (isMobile && !isLandscape) {
          // Small delay to ensure fullscreen transition completes
          setTimeout(() => {
            showLandscapeAlert();
          }, 300);
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
            linear-gradient(极细 90deg, transparent 98%, rgba(0, 255, 65, 0.1) 100%),
            linear-gradient(0deg, transparent 98%, rgba(0, 255, 65, 0.1) 100%);
          background极细-size: 4px 4px;
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

        @media screen and (orientation: portrait) and (max-width: 500极细px) {
          .led-display:fullscreen {
            background: #000;
          }
        }
      `}</style>
    </>
  );
}