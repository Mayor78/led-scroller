import React, { useEffect } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const ScrollingText = () => {
  const {
    text,
    color = '#00ff00',
    font = "'Orbitron', sans-serif", // More LED-appropriate font
    textCase = 'uppercase',
    letterSpacing = 5, // Increased from 3
    lineHeight = 1.1, // Tighter line height for large text
    outlineColor = '#000000',
    outlineWidth = 2, // Increased from 0
    shadowColor = '#00ff00',
    shadowBlur = 15, // Increased from 10
    reflection = 0,
    direction = 'left',
    speed = 5,
    isPlaying = false
  } = useScrollerStore();

  // Add this to your CSS or use a CSS-in-JS solution
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap');
      
      @keyframes leftScroll {
        0% { transform: translateX(100%) translateY(-50%); }
        100% { transform: translateX(-100%) translateY(-50%); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const textStyle = {
    color,
    fontFamily: font,
    fontSize: '6rem', // Increased from 4rem (use 8rem for even larger)
    fontWeight: 900, // Maximum boldness
    textTransform: textCase,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: lineHeight,
    textShadow: `
      ${shadowColor} 0 0 ${shadowBlur}px,
      ${shadowColor} 0 0 ${shadowBlur * 2}px,
      ${shadowColor} 0 0 ${shadowBlur * 3}px
    `, // Multi-layer glow
    WebkitTextStroke: `${outlineWidth}px ${outlineColor}`,
    whiteSpace: 'nowrap',
    padding: '0 100px' // Increased padding for larger text
  };

  const containerStyle = {
    position: 'absolute',
    top: '50%',
    left: isPlaying ? '100%' : '50%',
    transform: isPlaying ? 'translateY(-50%)' : 'translate(-50%, -50%)',
    animation: isPlaying 
      ? `leftScroll ${Math.max(5, 20 - speed)}s linear infinite` 
      : 'none',
    willChange: 'transform',
    zIndex: 10
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ minHeight: '300px' }}>
      {/* Main text element */}
      <div style={containerStyle}>
        <span style={textStyle}>{text || 'SAMPLE TEXT'}</span>
      </div>
      
      {/* Reflection effect */}
      {reflection > 0 && (
        <div style={{
          ...containerStyle,
          top: 'calc(100% + 20px)',
          opacity: reflection / 100,
          maskImage: 'linear-gradient(to bottom, transparent, black 50%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 50%)',
          transform: 'translateY(-50%) scaleY(-1)',
          zIndex: 9
        }}>
          <span style={textStyle}>{text || 'SAMPLE TEXT'}</span>
        </div>
      )}
    </div>
  );
};

export default ScrollingText;