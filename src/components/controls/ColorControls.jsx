import React from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const ColorControls = () => {
  const { 
    color, 
    outlineColor, 
    outlineWidth, 
    shadowColor, 
    shadowBlur,
    setColor, 
    setOutline, 
    setShadow 
  } = useScrollerStore();

  const presetColors = [
    '#00ff00', '#ff0000', '#0000ff', '#ffff00', 
    '#ff00ff', '#00ffff', '#ffffff', '#ffa500'
  ];

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-3">Colors & Effects</h3>
      
      <div className="space-y-4">
        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Text Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-8 rounded border border-gray-600"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 bg-gray-600 text-white p-2 rounded text-sm"
              placeholder="#00ff00"
            />
          </div>
          
          {/* Preset Colors */}
          <div className="flex space-x-1 mt-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => setColor(presetColor)}
                className="w-6 h-6 rounded border-2 border-gray-500 hover:border-white"
                style={{ backgroundColor: presetColor }}
              />
            ))}
          </div>
        </div>

        {/* Outline */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Outline
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={outlineColor}
              onChange={(e) => setOutline(e.target.value, outlineWidth)}
              className="w-12 h-8 rounded border border-gray-600"
            />
            <input
              type="range"
              min="0"
              max="5"
              value={outlineWidth}
              onChange={(e) => setOutline(outlineColor, parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-400 w-8">{outlineWidth}px</span>
          </div>
        </div>

        {/* Shadow */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Glow/Shadow
          </label>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="color"
              value={shadowColor}
              onChange={(e) => setShadow(e.target.value, shadowBlur)}
              className="w-12 h-8 rounded border border-gray-600"
            />
            <input
              type="text"
              value={shadowColor}
              onChange={(e) => setShadow(e.target.value, shadowBlur)}
              className="flex-1 bg-gray-600 text-white p-2 rounded text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-12">Blur:</span>
            <input
              type="range"
              min="0"
              max="50"
              value={shadowBlur}
              onChange={(e) => setShadow(shadowColor, parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-400 w-8">{shadowBlur}px</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ColorControls;