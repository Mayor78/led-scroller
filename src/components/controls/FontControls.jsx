import React, { useState } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import { FaFont, FaTextHeight, FaArrowsAltH, FaMagic, FaUndo, FaPlus, FaMinus } from 'react-icons/fa';
import { MdOutlineTextRotationNone, MdOutlineTextRotationAngleup } from 'react-icons/md';

const FontControls = () => {
  const { 
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
    textStyle, // Added from TextControls
    setFont, 
    setTextCase, 
    setLetterSpacing, 
    setLineHeight,
    setFontSize,
    setOutlineWidth,
    setOutlineColor,
    setShadowBlur,
    setShadowColor,
    setReflection,
    setFlickerIntensity,
    setTextSkew,
    setTextRotation,
    setTextStyle // Added from TextControls
  } = useScrollerStore();

  // Initial values for reset
  const initialValues = {
    font: "'Orbitron', monospace",
    textCase: 'uppercase',
    letterSpacing: 3,
    lineHeight: 1.2,
    fontSize: 50,
    outlineWidth: 0,
    outlineColor: '#000000',
    shadowBlur: 10,
    shadowColor: '#00ff00',
    reflection: 0,
    flickerIntensity: 0,
    textSkew: 0,
    textRotation: 0,
    textStyle: 'normal' // Added default text style
  };

  // Reset all font styles to initial values
  const resetStyles = () => {
    setFont(initialValues.font);
    setTextCase(initialValues.textCase);
    setLetterSpacing(initialValues.letterSpacing);
    setLineHeight(initialValues.lineHeight);
    setFontSize(initialValues.fontSize);
    setOutlineWidth(initialValues.outlineWidth);
    setOutlineColor(initialValues.outlineColor);
    setShadowBlur(initialValues.shadowBlur);
    setShadowColor(initialValues.shadowColor);
    setReflection(initialValues.reflection);
    setFlickerIntensity(initialValues.flickerIntensity);
    setTextSkew(initialValues.textSkew);
    setTextRotation(initialValues.textRotation);
    setTextStyle(initialValues.textStyle); // Reset text style
  };

  // Increment/Decrement handlers for skew and rotation
  const handleSkewChange = (delta) => {
    const newSkew = Math.max(-45, Math.min(45, textSkew + delta));
    setTextSkew(newSkew);
  };

  const handleRotationChange = (delta) => {
    const newRotation = Math.max(-180, Math.min(180, textRotation + delta));
    setTextRotation(newRotation);
  };

  const fontOptions = [
    { value: "'Orbitron', monospace", label: "Orbitron", category: "Digital" },
    { value: "'Courier New', monospace", label: "Courier New", category: "Monospace" },
    { value: "'Arial', sans-serif", label: "Arial", category: "Sans" },
    { value: "'Impact', sans-serif", label: "Impact", category: "Sans" },
    { value: "'Times New Roman', serif", label: "Times", category: "Serif" },
    { value: "'Helvetica', sans-serif", label: "Helvetica", category: "Sans" },
    { value: "'Georgia', serif", label: "Georgia", category: "Serif" },
    { value: "'Verdana', sans-serif", label: "Verdana", category: "Sans" },
    { value: "'Trebuchet MS', sans-serif", label: "Trebuchet", category: "Sans" },
    { value: "'Comic Sans MS', cursive", label: "Comic Sans", category: "Casual" },
    { value: "'Palatino', serif", label: "Palatino", category: "Serif" },
    { value: "'Garamond', serif", label: "Garamond", category: "Serif" }
  ];

  const caseOptions = [
    { value: 'none', label: 'Normal', icon: <MdOutlineTextRotationNone /> },
    { value: 'uppercase', label: 'UPPER', icon: <FaTextHeight /> },
    { value: 'lowercase', label: 'lower', icon: <FaTextHeight /> },
    { value: 'capitalize', label: 'Title', icon: <MdOutlineTextRotationAngleup /> }
  ];

  const groupedFonts = fontOptions.reduce((acc, font) => {
    if (!acc[font.category]) {
      acc[font.category] = [];
    }
    acc[font.category].push(font);
    return acc;
  }, {});

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="lg:text-2xl text-sm md:text-lg font-semibold text-green-400 flex items-center gap-2">
          <FaFont className="text-green-400" />
          Typography Controls
        </h3>
        <button
          onClick={resetStyles}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-all"
          title="Reset all font styles to default"
        >
          <FaUndo size={14} />
          Reset
        </button>
      </div>
      
      <div className="space-y-5">
        {/* Font Size */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <FaTextHeight className="text-green-400" />
              Font Size: {fontSize}px
            </label>
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {fontSize}px
            </span>
          </div>
          <input
            type="range"
            min="12"
            max="200"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Small</span>
            <span>Large</span>
          </div>
        </div>

        {/* Font Family with categories */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <FaFont className="text-green-400" />
            Font Family
          </label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all"
          >
            {Object.entries(groupedFonts).map(([category, fonts]) => (
              <optgroup key={category} label={category}>
                {fonts.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Text Case */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Text Transformation
          </label>
          <div className="grid grid-cols-4 gap-2">
            {caseOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTextCase(option.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium flex flex-col items-center justify-center gap-1 transition-all ${
                  textCase === option.value
                    ? 'bg-green-600 lg:text-2xl text-sm md:text-lg text-white shadow-lg shadow-green-500/25'
                    : 'bg-gray-700 lg:text-2xl text-sm md:text-lg text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
                title={option.label}
              >
                <span className="text-lg">{option.icon}</span>
                <span className="text-xs">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Style */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Text Style
          </label>
          <select
            value={textStyle}
            onChange={(e) => setTextStyle(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all"
          >
            <option value="normal">Normal</option>
            <option value="bullet">Bullet</option>
            <option value="cloud">Cloud</option>
            <option value="funky">Funky</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Letter Spacing */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FaArrowsAltH className="text-green-400" />
                Letter Spacing
              </label>
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                {letterSpacing}px
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="20"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
            />
          </div>

          {/* Line Height */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FaTextHeight className="text-green-400" />
                Line Height
              </label>
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                {lineHeight}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
            />
          </div>
        </div>

        {/* Advanced Effects Section */}
        <div className="pt-4 border-t border-gray-700/30">
          <h4 className="text-md font-semibold text-green-400 mb-3 flex items-center gap-2">
            <FaMagic className="text-green-400" />
            Advanced Effects
          </h4>

          <div className="space-y-4">
            {/* Outline Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Outline Width
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={outlineWidth}
                  onChange={(e) => setOutlineWidth(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
                <span className="text-xs text-gray-400">{outlineWidth}px</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Outline Color
                </label>
                <input
                  type="color"
                  value={outlineColor}
                  onChange={(e) => setOutlineColor(e.target.value)}
                  className="w-full h-8 rounded-lg border border-gray-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Shadow Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Shadow Blur
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={shadowBlur}
                  onChange={(e) => setShadowBlur(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                />
                <span className="text-xs text-gray-400">{shadowBlur}px</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Shadow Color
                </label>
                <input
                  type="color"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  className="w-full h-8 rounded-lg border border-gray-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Reflection & Flicker */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reflection: {reflection}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={reflection}
                  onChange={(e) => setReflection(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Flicker: {flickerIntensity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={flickerIntensity}
                  onChange={(e) => setFlickerIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500"
                />
              </div>
            </div>

            {/* Transform Effects with Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Text Skew: {textSkew}°
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSkewChange(-1)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2"
                  >
                    <FaMinus />
                  </button>
                  <button
                    onClick={() => handleSkewChange(1)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rotation: {textRotation}°
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRotationChange(-1)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2"
                  >
                    <FaMinus />
                  </button>
                  <button
                    onClick={() => handleRotationChange(1)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
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
            .bullet-text::before {
              content: "•";
              position: absolute;
              left: 0;
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
          `}
        </style>
      </div>
    </div>
  );
};

export default FontControls;