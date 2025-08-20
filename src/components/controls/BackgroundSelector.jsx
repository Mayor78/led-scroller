// components/BackgroundSelector.jsx
import React from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const BackgroundSelector = () => {
  const { background, bgColor, setBackground, setBgColor } = useScrollerStore();

  const backgroundOptions = [
    { value: 'solid', label: 'Solid Color', icon: '🎨' },
    { value: 'matrix', label: 'Matrix Rain', icon: '💻' },
    { value: 'stars', label: 'Cosmic Stars', icon: '✨' },
    { value: 'circuit', label: 'Neural Network', icon: '🧠' },
    { value: 'cyber', label: 'Cyber Grid', icon: '🔷' }
  ];

  const handlePreset = (type, color) => {
    setBackground(type);
    setBgColor(color);
  };

  const presetColors = [
    { name: 'Matrix Green', color: '#001a00' },
    { name: 'Cyber Blue', color: '#000033' },
    { name: 'Neon Purple', color: '#330033' },
    { name: 'Deep Space', color: '#000011' }
  ];

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
      <h3 className="text-lg font-semibold text-green-400 mb-4">Background Settings</h3>
      
      <div className="space-y-4">
        {/* Background Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Background Type
          </label>
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all"
          >
            {backgroundOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border border-gray-600"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quick Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presetColors.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePreset(backgroundOptions[index + 1].value, preset.color)}
                className="p-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={{ 
                  background: `linear-gradient(45deg, ${preset.color}20, ${preset.color}40)`,
                  border: `1px solid ${preset.color}60`
                }}
              >
                <span style={{ color: preset.color }}>●</span>
                <span className="text-gray-300">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;