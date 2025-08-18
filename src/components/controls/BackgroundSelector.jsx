// components/BackgroundSelector.jsx
import React from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const BackgroundSelector = () => {
  const { background, bgColor, setBackground, setBgColor } = useScrollerStore();

  const backgroundOptions = [
    { value: 'solid', label: 'Solid Color' },
    { value: 'matrix', label: 'Matrix' },
    { value: 'stars', label: 'Stars' },
    { value: 'circuit', label: 'Circuit' }
  ];

  const handlePreset = (type, color) => {
    setBackground(type);
    setBgColor(color);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-green-400 mb-3">Background</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Background Type
          </label>
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
          >
            {backgroundOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quick Presets
          </label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handlePreset('solid', '#000000')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              Black
            </button>
            <button
              onClick={() => handlePreset('matrix', '#001a00')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              Matrix
            </button>
            <button
              onClick={() => handlePreset('stars', '#000033')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              Space
            </button>
            <button
              onClick={() => handlePreset('circuit', '#001100')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              Circuit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;