import React, { useEffect } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const ScrollingText = () => {
  const {
    text,
    color = '#00ff00',
    font = 'monospace',
    textCase = 'uppercase',
    letterSpacing = 3,
    lineHeight = 1.2,
    outlineColor = '#000000',
    outlineWidth = 0,
    shadowColor = '#00ff00',
    shadowBlur = 10,
    reflection = 0,
    direction = 'left',
    speed = 5,
    isPlaying = false
  } = useScrollerStore();

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
      .scrolling-text-container {
        position: absolute;
        top: 50%;
        left: 0;
        width: 200%;
        display: flex;
      }
    `;

    return () => {
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const textStyle = {
    color,
    fontFamily: font,
    fontSize: 'clamp(8rem, 5vw, 10rem)',
    fontWeight: 'bold',
    textTransform: textCase,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: `${lineHeight}`,
    textShadow: `${shadowColor} 0 0 ${shadowBlur}px`,
    WebkitTextStroke: `${outlineWidth}px ${outlineColor}`,
    whiteSpace: 'nowrap',
    padding: '0 50px',
    flexShrink: 0,
    width: '100%'
  };

  const containerStyle = {
    animation: isPlaying ? `leftScroll ${Math.max(3, 20 - speed)}s linear infinite` : 'none',
    willChange: 'transform'
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ minHeight: '200px' }}>
      {/* Double-width container with duplicated text for seamless looping */}
      <div className="scrolling-text-container" style={containerStyle}>
        <span style={textStyle}>{text || 'SAMPLE TEXT'}</span>
        <span style={textStyle}>{text || 'SAMPLE TEXT'}</span>
      </div>

      {/* Reflection effect */}
      {reflection > 0 && (
        <div className="scrolling-text-container" style={{
          ...containerStyle,
          top: '150%',
          opacity: reflection / 100,
          maskImage: 'linear-gradient(to bottom, transparent, black 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 70%)',
          transform: 'scaleY(-1)'
        }}>
          <span style={textStyle}>{text || 'SAMPLE TEXT'}</span>
          <span style={textStyle}>{text || 'SAMPLE TEXT'}</span>
        </div>
      )}
    </div>
  );
};

export default ScrollingText;