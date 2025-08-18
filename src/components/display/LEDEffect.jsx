import React, { useState, useEffect } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const LEDEffects = () => {
  const {
    frameStyle,
    cornerLights,
    rgbBorderEnabled,
    rgbBorderSpeed,
    rgbBorderColors
  } = useScrollerStore();
  
  const [currentBorderColor, setCurrentBorderColor] = useState('#00ff00');

  // Handle RGB border effect
  useEffect(() => {
    if (!rgbBorderEnabled) return;

    let colorIndex = 0;
    const interval = setInterval(() => {
      colorIndex = (colorIndex + 1) % rgbBorderColors.length;
      setCurrentBorderColor(rgbBorderColors[colorIndex]);
    }, 1000 / rgbBorderSpeed);

    return () => clearInterval(interval);
  }, [rgbBorderEnabled, rgbBorderSpeed, rgbBorderColors]);

  const getFrameStyle = () => {
    const baseStyles = {
      position: 'absolute',
      inset: 0,
      borderRadius: '0.5rem',
      pointerEvents: 'none',
      borderWidth: '4px',
      borderStyle: 'solid',
      transition: 'border-color 0.3s ease',
    };

    switch(frameStyle) {
      case 'led':
        return {
          ...baseStyles,
          borderColor: rgbBorderEnabled ? currentBorderColor : '#00ff00',
          boxShadow: rgbBorderEnabled 
            ? `0 0 20px ${currentBorderColor}, inset 0 0 20px ${currentBorderColor}`
            : '0 0 15px #00ff00, inset 0 0 15px #00ff00'
        };
      case 'neon':
        return {
          ...baseStyles,
          borderColor: rgbBorderEnabled ? currentBorderColor : '#00ffff',
          boxShadow: rgbBorderEnabled
            ? `0 0 30px ${currentBorderColor}, inset 0 0 30px ${currentBorderColor}`
            : '0 0 30px #00ffff, inset 0 0 30px #00ffff'
        };
      default:
        return {
          ...baseStyles,
          borderColor: rgbBorderEnabled ? currentBorderColor : '#333',
          boxShadow: 'none'
        };
    }
  };

  return (
    <>
      {/* RGB Border */}
      <div style={getFrameStyle()}></div>
      
      {/* Corner Lights */}
      {cornerLights && (
        <>
          {[['top-0', 'left-0'], ['top-0', 'right-0'], 
            ['bottom-0', 'left-0'], ['bottom-0', 'right-0']].map(([top, left]) => (
            <div 
              key={`${top}-${left}`}
              className={`absolute ${top} ${left} w-4 h-4 rounded-full shadow-lg`}
              style={{
                backgroundColor: rgbBorderEnabled ? currentBorderColor : '#00ff00',
                boxShadow: rgbBorderEnabled 
                  ? `0 0 10px ${currentBorderColor}, 0 0 20px ${currentBorderColor}`
                  : '0 0 10px #00ff00, 0 0 20px #00ff00'
              }}
            ></div>
          ))}
        </>
      )}
      
      {/* Screen Effect */}
      <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none led-screen-effect"></div>
    </>
  );
};

export default LEDEffects;