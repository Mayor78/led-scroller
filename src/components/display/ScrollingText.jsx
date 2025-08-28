import React, { useEffect, useState } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import { motion } from 'framer-motion';

const ScrollingText = () => {
  const {
    text,
    color,
    font,
    textCase,
    letterSpacing,
    lineHeight,
    fontSize,
    textSkew,
    textRotation,
    outlineColor,
    outlineWidth,
    shadowColor,
    shadowBlur,
    reflection,
    direction,
    speed,
    isPlaying,
    flickerIntensity,
    textStyle, // Destructured from store
  } = useScrollerStore();

  const [isLandscape, setIsLandscape] = useState(false);
  const [flicker, setFlicker] = useState(1);

  // Check screen orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Flicker effect
  useEffect(() => {
    if (flickerIntensity > 0 && isPlaying) {
      const interval = setInterval(() => {
        setFlicker(Math.random() > (flickerIntensity / 100) ? 1 : 0.3 + Math.random() * 0.7);
      }, 100 + Math.random() * 200);
      
      return () => clearInterval(interval);
    } else {
      setFlicker(1);
    }
  }, [flickerIntensity, isPlaying]);

  // Animation stylesheet management
  useEffect(() => {
    const styleId = 'scroll-animations';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      @keyframes leftScroll {
        0% { transform: translateX(0) translateY(-50%); }
        100% { transform: translateX(-100%) translateY(-50%); }
      }
      @keyframes rightScroll {
        0% { transform: translateX(-100%) translateY(-50%); }
        100% { transform: translateX(0) translateY(-50%); }
      }
      @keyframes bounceScroll {
        0%, 100% { transform: translateX(0) translateY(-50%); }
        50% { transform: translateX(-100%) translateY(-50%); }
      }
      @keyframes glitchScroll {
        0% { transform: translateX(0) translateY(-50%); }
        25% { transform: translateX(-5%) translateY(-48%); }
        50% { transform: translateX(-50%) translateY(-52%); }
        75% { transform: translateX(-95%) translateY(-48%); }
        100% { transform: translateX(-100%) translateY(-50%); }
      }
      .scrolling-text-container {
        position: absolute;
        top: 50%;
        left: 0;
        width: 200%;
        display: flex;
      }
      .text-glitch {
        position: relative;
      }
      .text-glitch::before,
      .text-glitch::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.8;
      }
      .text-glitch::before {
        color: #ff00ff;
        animation: glitch-anim 0.3s infinite;
        clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
        transform: translate(-2px, -2px);
      }
      .text-glitch::after {
        color: #00ffff;
        animation: glitch-anim2 0.3s infinite;
        clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
        transform: translate(2px, 2px);
      }
      @keyframes glitch-anim {
        0% { clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); }
        20% { clip-path: polygon(0 15%, 100% 15%, 100% 35%, 0 35%); }
        40% { clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); }
        60% { clip-path: polygon(0 45%, 100% 45%, 100% 55%, 0 55%); }
        80% { clip-path: polygon(0 25%, 100% 25%, 100% 75%, 0 75%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); }
      }
      @keyframes glitch-anim2 {
        0% { clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%); }
        20% { clip-path: polygon(0 25%, 100% 25%, 100% 100%, 0 100%); }
        40% { clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%); }
        60% { clip-path: polygon(0 70%, 100% 70%, 100% 90%, 0 90%); }
        80% { clip-path: polygon(0 10%, 100% 10%, 100% 65%, 0 65%); }
        100% { clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%); }
      }
      .pixel-text {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
      }
      .bullet-text::before {
        content: "•";
        position: absolute;
        left: -20px;
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
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(2px, -2px); }
        60% { transform: translate(-2px, -2px); }
        80% { transform: translate(2px, 2px); }
        100% { transform: translate(0); }
      }
    `;

    return () => {
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const getAnimationName = () => {
    switch (direction) {
      case 'right':
        return 'rightScroll';
      case 'bounce':
        return 'bounceScroll';
      case 'glitch':
        return 'glitchScroll';
      default:
        return 'leftScroll';
    }
  };

  const getFontSize = () => {
    return `${fontSize}px`;
  };

  const computedTextStyle = { // Renamed to avoid conflict
    color: color || '#00ff00',
    fontFamily: font || 'monospace',
    fontSize: getFontSize(),
    fontWeight: 'bold',
    textTransform: textCase || 'uppercase',
    letterSpacing: `${letterSpacing || 3}px`,
    lineHeight: `${lineHeight || 1.2}`,
    textShadow: `
      ${shadowColor || '#00ff00'} 0 0 ${shadowBlur || 10}px,
      ${shadowColor || '#00ff00'} 0 0 ${(shadowBlur || 10) * 2}px,
      ${shadowColor || '#00ff00'} 0 0 ${(shadowBlur || 10) * 3}px
    `,
    WebkitTextStroke: `${outlineWidth || 0}px ${outlineColor || '#000000'}`,
    whiteSpace: 'nowrap',
    padding: '0 50px',
    flexShrink: 0,
    width: '100%',
    opacity: flicker,
    filter: `blur(${flickerIntensity > 50 ? '1px' : '0px'})`,
    transition: 'opacity 0.1s ease, filter 0.1s ease',
    transform: `skew(${textSkew || 0}deg) rotate(${textRotation || 0}deg)`,
    ...(textStyle === 'bullet' && { position: 'relative', className: 'bullet-text' }),
    ...(textStyle === 'cloud' && { className: 'cloud-text' }),
    ...(textStyle === 'funky' && { className: 'funky-text' }),
  };

  const containerStyle = {
    animation: isPlaying ? `${getAnimationName()} ${Math.max(3, 20 - (speed || 5))}s linear infinite` : 'none',
    willChange: 'transform',
  };

  const renderText = (content) => {
    if (direction === 'glitch') {
      return (
        <span className={`text-glitch ${computedTextStyle.className || ''}`} data-text={content} style={computedTextStyle}>
          {content}
        </span>
      );
    }
    return (
      <span className={computedTextStyle.className || ''} style={computedTextStyle}>
        {content}
      </span>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ minHeight: '200px' }}>
      {/* Main scrolling text */}
      <div className="scrolling-text-container" style={containerStyle}>
        {renderText(text || 'LED SCROLLER')}
        {renderText(text || 'LED SCROLLER')}
      </div>

      {/* Reflection effect */}
      {reflection > 0 && (
        <div className="scrolling-text-container" style={{
          ...containerStyle,
          top: '150%',
          opacity: (reflection || 0) / 100,
          maskImage: 'linear-gradient(to bottom, transparent, black 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 70%)',
          transform: 'scaleY(-1)',
        }}>
          {renderText(text || 'LED SCROLLER')}
          {renderText(text || 'LED SCROLLER')}
        </div>
      )}

      {/* Scan lines overlay for retro effect */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             backgroundImage: `
               linear-gradient(to bottom, 
                 transparent 0%, 
                 rgba(0, 255, 65, 0.05) 50%, 
                 transparent 100%)
             `,
             backgroundSize: '100% 4px',
             opacity: 0.3,
           }} />

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.8)' }} />

      {/* Subtle glow behind text */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPlaying ? 0.1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `radial-gradient(ellipse at center, ${color || '#00ff00'}20 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
};

export default ScrollingText;