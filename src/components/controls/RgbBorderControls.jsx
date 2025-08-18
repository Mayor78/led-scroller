import React from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const RgbBorderControls = () => {
  const {
    rgbBorderEnabled,
    rgbBorderSpeed,
    rgbBorderColors,
    toggleRgbBorder,
    setRgbBorderSpeed,
    setRgbBorderColors
  } = useScrollerStore();

  const handleColorChange = (index, color) => {
    const newColors = [...rgbBorderColors];
    newColors[index] = color;
    setRgbBorderColors(newColors);
  };

  const addColor = () => {
    setRgbBorderColors([...rgbBorderColors, '#ffffff']);
  };

  const removeColor = (index) => {
    if (rgbBorderColors.length > 1) {
      const newColors = rgbBorderColors.filter((_, i) => i !== index);
      setRgbBorderColors(newColors);
    }
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-300">RGB Border Lighting</h3>
        <button
          onClick={toggleRgbBorder}
          className={`px-3 py-1 rounded-md ${
            rgbBorderEnabled
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-gray-600 hover:bg-gray-500'
          } text-white`}
        >
          {rgbBorderEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {rgbBorderEnabled && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Speed: {rgbBorderSpeed}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={rgbBorderSpeed}
              onChange={(e) => setRgbBorderSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color Sequence
            </label>
            <div className="space-y-2">
              {rgbBorderColors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="w-8 h-8"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm"
                  />
                  <button
                    onClick={() => removeColor(index)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={addColor}
                className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
              >
                + Add Color
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RgbBorderControls;