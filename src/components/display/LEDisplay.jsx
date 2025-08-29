import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import Background from './Background';
import ScrollingText from './ScrollingText';
import LEDEffects from './LEDEffect';
import { useScrollerStore } from '../../stores/useScrollerStore';
import ControlPanel from '../controls/ControlPannel';

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
    backgroundImage,
    frameStyle,
    cornerLights,
    text,
    color,
    speed,
    isPlaying,
    togglePlay,
    displayMode,
    staticText,
    staticTextPosition,
    staticTextAlignment,
    staticTextFontSize,
    font,
    textCase,
    letterSpacing,
    lineHeight,
    fontSize,
    outlineWidth,
    outlineColor,
    shadowBlur,
    shadowColor,
    reflection,
    flickerIntensity,
    textSkew,
    textRotation,
    textStyle
  } = useScrollerStore();
  
  const displayRef = useRef(null);
  const isMobile = useIsMobile();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [renderKey, setRenderKey] = useState(Date.now()); // Dynamic key for re-mount

  // Log state changes
  useEffect(() => {
    console.log('LEDDisplay - background:', background, 'bgColor:', bgColor, 'displayMode:', displayMode, 'text:', text, 'staticText:', staticText, 'color:', color, 'font:', font);
    setRenderKey(Date.now()); // Update key on state change
  }, [background, bgColor, backgroundImage, displayMode, text, staticText, color, font]);

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

  const showLandscapeAlert = () => {
    Swal.fire({
      title: 'Landscape Mode Required',
      html: `
        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: rgba(0, 255, 65, 0.1); border-radius: 20%; display: flex; align-items: center; justify-content: center;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#00ff41">
              <path d="M19 12v-1c0-1.33-2.67-2-4-2-1.33 0-4 .67-4 2v1c0 1.33 2.67 2 4 2 1.33 0 4-.67 4-2zm-4-6c-1.11 0-2 .89-2 2v.5c0 .83.67 1.5 1.5 1.5h1c.83 0 1.5-.67 1.5-1.5V8c0-1.11-.89-2-2-2zm6-2h-4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 0H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <p style="color: #d1d5db; margin-bottom: 20px;">For the best experience, please rotate your device to landscape orientation.</p>
          <div style="display: flex; justify-content: center; gap: 10px; color: #00ff41; font-size: 24px;">
            <span>📱</span>
            <span style="display: inline-block; animation: rotate 2s infinite;">⟳</span>
            <span>📱</span>
          </div>
        </div>
      `,
      background: '#1f2937',
      color: 'white',
      showCancelButton: true,
      confirmButtonText: 'I\'ve Rotated My Device',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#4b5563',
      customClass: {
        popup: 'landscape-swal-popup',
        title: 'landscape-swal-title',
        htmlContainer: 'landscape-swal-html',
        confirmButton: 'landscape-swal-confirm',
        cancelButton: 'landscape-swal-cancel'
      },
      didOpen: () => {
        const style = document.createElement('style');
        style.textContent = `
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(90deg); }
          }
        `;
        document.head.appendChild(style);
      },
      willClose: () => {
        const style = document.querySelector('style[data-swal="rotate"]');
        if (style) style.remove();
      }
    }).then((result) => {
      if (result.isDismissed) {
        togglePlay();
      }
    });
  };

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
          setTimeout(() => {
            showLandscapeAlert();
          }, 300);
        }
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    }
  };

  useEffect(() => {
    if (isPlaying && isMobile && !isFullscreen) {
      enterFullscreenLandscape();
    }
  }, [isPlaying, isMobile, isFullscreen]);

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
    led-display relative overflow-hidden border-2 border-gray-700 bg-transparent
    ${isFullscreen ? 'fixed inset-0 z-0 w-screen h-screen rounded-none border-none' : 'h-64 w-full rounded-xl'}
  `;

  // Apply font styles to static text
  const textStyleClass = () => {
    let className = '';
    if (textStyle === 'bullet') className += ' bullet-text';
    if (textStyle === 'cloud') className += ' cloud-text';
    if (textStyle === 'funky') className += ' funky-text';
    return className;
  };

  return (
    <>
      <div 
        ref={displayRef}
        className={displayClasses}
      >
        <Background key={renderKey} /> {/* Use dynamic renderKey */}
        
        <div className="absolute inset-0 led-screen-effect" style={{ zIndex: 1 }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{
                 backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 255, 65, 0.1) 50%)',
                 backgroundSize: '100% 4px'
               }} />
          {isFullscreen && (
            <div className="absolute inset-0 bg-transparent opacity-20 pointer-events-none"
                 style={{
                   boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.8)'
                 }} />
          )}
        </div>
        
        {displayMode === 'scrolling' ? (
          <ScrollingText
            text={text}
            color={color}
            speed={speed}
            isPlaying={isPlaying}
            style={{
              fontFamily: font,
              textTransform: textCase,
              letterSpacing: `${letterSpacing}px`,
              lineHeight: lineHeight,
              fontSize: `${fontSize}px`,
              textShadow: outlineWidth > 0 ? `${outlineWidth}px 0 0 ${outlineColor}, -${outlineWidth}px 0 0 ${outlineColor}, 0 ${outlineWidth}px 0 ${outlineColor}, 0 -${outlineWidth}px 0 ${outlineColor}` : 'none',
              filter: shadowBlur > 0 ? `drop-shadow(0 0 ${shadowBlur}px ${shadowColor})` : 'none',
              transform: `skew(${textSkew}deg) rotate(${textRotation}deg)`,
              zIndex: 10 // Ensure text is above background
            }}
          />
        ) : (
          <div
            className={`absolute inset-0 flex text-center ${textStyleClass()}`}
            style={{
              color: color,
              fontFamily: font,
              textTransform: textCase,
              letterSpacing: `${letterSpacing}px`,
              lineHeight: lineHeight,
              fontSize: `${staticTextFontSize}px`,
              textShadow: outlineWidth > 0 ? `${outlineWidth}px 0 0 ${outlineColor}, -${outlineWidth}px 0 0 ${outlineColor}, 0 ${outlineWidth}px 0 ${outlineColor}, 0 -${outlineWidth}px 0 ${outlineColor}` : 'none',
              filter: shadowBlur > 0 ? `drop-shadow(0 0 ${shadowBlur}px ${shadowColor})` : 'none',
              transform: `skew(${textSkew}deg) rotate(${textRotation}deg)`,
              zIndex: 10, // Ensure text is above background
              justifyContent: staticTextAlignment === 'left' ? 'flex-start' : staticTextAlignment === 'right' ? 'flex-end' : 'center',
              alignItems: staticTextPosition === 'top' ? 'flex-start' : staticTextPosition === 'bottom' ? 'flex-end' : 'center',
            }}
          >
            {displayMode === 'static' ? staticText : text}
          </div>
        )}
        
        <LEDEffects 
          frameStyle={frameStyle} 
          cornerLights={cornerLights} 
          style={{ zIndex: 5 }} // Effects below text, above background
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-50" style={{ zIndex: 5 }}></div>

        <AnimatePresence>
          {isFullscreen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 z-20 flex gap-2" // Control buttons above all
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

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(2px, 2px); }
          100% { transform: translate(0); }
        }
        .bullet-text::before {
          content: "•";
          position: absolute;
          left: -1.5em;
          color: #00ff00;
          fontSize: 1.5em;
        }
        .cloud-text {
          fontFamily: 'cursive, sans-serif';
          color: #00ffff;
          textShadow: 2px 2px 4px #00ff00, -2px -2px 4px #00ffff;
          borderRadius: 10px;
          background: rgba(0, 0, 0, 0.3);
          padding: 15px;
        }
        .funky-text {
          color: #ff00ff;
          textShadow: 0 0 10px #ff00ff, 0 0 20px #00ff00;
          animation: glitch 0.5s infinite;
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

      <style jsx global>{`
        .landscape-swal-popup {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%) !important;
          border: 1px solid rgba(0, 255, 65, 0.3) !important;
          border-radius: 16px !important;
          box-shadow: 0 0 30px rgba(0, 255, 65, 0.2) !important;
        }
        
        .landscape-swal-title {
          color: #00ff41 !important;
          font-weight: bold !important;
          font-size: 1.5rem !important;
        }
        
        .landscape-swal-html {
          color: #d1d5db !important;
          line-height: 1.6 !important;
        }
        
        .landscape-swal-confirm {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
          border: none !important;
          border-radius: 8px !important;
          font-weight: bold !important;
          padding: 10px 24px !important;
        }
        
        .landscape-swal-cancel {
          background: #4b5563 !important;
          border: none !important;
          border-radius: 8px !important;
          color: white !important;
          padding: 10px 24px !important;
        }
        
        .landscape-swal-confirm:hover {
          background: linear-gradient(135deg, #15803d 0%, #166534 100%) !important;
          transform: translateY(-1px);
        }
        
        .landscape-swal-cancel:hover {
          background: #374151 !important;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}