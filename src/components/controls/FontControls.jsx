import React from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const FontControls = () => {
  const { 
    font, 
    textCase, 
    letterSpacing, 
    lineHeight,
    setFont, 
    setTextCase, 
    setLetterSpacing, 
    setLineHeight 
  } = useScrollerStore();

  const fontOptions = [
    { value: "'Orbitron', monospace", label: "Orbitron" },
    { value: "'Courier New', monospace", label: "Courier" },
    { value: "'Arial', sans-serif", label: "Arial" },
    { value: "'Impact', sans-serif", label: "Impact" },
    { value: "'Times New Roman', serif", label: "Times" },
    { value: "'Helvetica', sans-serif", label: "Helvetica" }
  ];

  const caseOptions = [
    { value: 'none', label: 'Normal' },
    { value: 'uppercase', label: 'UPPER' },
    { value: 'lowercase', label: 'lower' },
    { value: 'capitalize', label: 'Title' }
  ];

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-3">Typography</h3>
      
      <div className="space-y-4">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Font Family
          </label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-green-500"
          >
            {fontOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Text Case */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Text Case
          </label>
          <div className="grid grid-cols-2 gap-2">
            {caseOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTextCase(option.value)}
                className={`py-2 px-3 rounded text-sm font-medium ${
                  textCase === option.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Letter Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Letter Spacing: {letterSpacing}px
          </label>
          <input
            type="range"
            min="-5"
            max="20"
            value={letterSpacing}
            onChange={(e) => setLetterSpacing(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Line Height */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Line Height: {lineHeight}
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={lineHeight}
            onChange={(e) => setLineHeight(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default FontControls;