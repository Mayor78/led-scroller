import React, { useState } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const TextControls = () => {
  const { text, setText, fontSize, setFontSize, textSkew, setTextSkew, textRotation, setTextRotation, textStyle, setTextStyle } = useScrollerStore();

  const handleStyleChange = (e) => {
    setTextStyle(e.target.value);
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: `${fontSize || 80}px`,
      padding: '10px',
      transition: 'all 0.3s ease',
    };

    switch (textStyle) {
      case 'bullet':
        return {
          ...baseStyle,
          position: 'relative',
          paddingLeft: '20px',
          '&::before': {
            content: '"•"',
            position: 'absolute',
            left: '0',
            color: '#00ff00',
            fontSize: '1.5em',
          },
        };
      case 'cloud':
        return {
          ...baseStyle,
          fontFamily: 'cursive, sans-serif',
          color: '#00ffff',
          textShadow: '2px 2px 4px #00ff00, -2px -2px 4px #00ffff',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '15px',
        };
      case 'funky':
        return {
          ...baseStyle,
          color: '#ff00ff',
          textShadow: '0 0 10px #ff00ff, 0 0 20px #00ff00',
          transform: `skew(${textSkew || 0}deg) rotate(${textRotation || 0}deg)`,
          animation: 'glitch 0.5s infinite',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-300">Text Style:</label>
        <select
          value={textStyle}
          onChange={handleStyleChange}
          className="mt-1 p-2 bg-gray-700 text-white rounded"
        >
          <option value="normal">Normal</option>
          <option value="bullet">Bullet</option>
          <option value="cloud">Cloud</option>
          <option value="funky">Funky</option>
        </select>
      </div>
     
      <div>
        <label className="text-sm text-gray-300">Font Size (px):</label>
        <input
          type="number"
          value={fontSize || 80}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full p-2 bg-gray-700 text-white rounded"
          min="10"
          max="200"
        />
      </div>
      <div>
        <label className="text-sm text-gray-300">Skew (deg):</label>
        <input
          type="range"
          value={textSkew || 0}
          onChange={(e) => setTextSkew(Number(e.target.value))}
          className="w-full"
          min="-45"
          max="45"
        />
      </div>
      <div>
        <label className="text-sm text-gray-300">Rotation (deg):</label>
        <input
          type="range"
          value={textRotation || 0}
          onChange={(e) => setTextRotation(Number(e.target.value))}
          className="w-full"
          min="-45"
          max="45"
        />
      </div>

      <style>
        {`
          @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(2px, 2px); }
            100% { transform: translate(0); }
          }
        `}
      </style>
    </div>
  );
};

export default TextControls;