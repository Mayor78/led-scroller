import React from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const AudioControls = () => {
  const { 
    audioSource, 
    sensitivity, 
    reactTo, 
    intensity,
    setAudioSource, 
    setSensitivity, 
    setReactTo, 
    setIntensity 
  } = useScrollerStore();

  const audioSources = [
    { value: 'none', label: 'None' },
    { value: 'microphone', label: 'Microphone' },
    { value: 'file', label: 'Audio File' },
    { value: 'line-in', label: 'Line In' }
  ];

  const reactToOptions = [
    { value: 'brightness', label: 'Brightness' },
    { value: 'size', label: 'Size' },
    { value: 'speed', label: 'Speed' },
    { value: 'color', label: 'Color' }
  ];

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-3">Audio Reactive</h3>
      
      <div className="space-y-4">
        {/* Audio Source */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Audio Source
          </label>
          <select
            value={audioSource}
            onChange={(e) => setAudioSource(e.target.value)}
            className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-green-500"
          >
            {audioSources.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Audio Reactivity Settings (only show if audio source is selected) */}
        {audioSource !== 'none' && (
          <>
            {/* React To */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                React To
              </label>
              <div className="grid grid-cols-2 gap-2">
                {reactToOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setReactTo(option.value)}
                    className={`py-2 px-3 rounded text-sm font-medium ${
                      reactTo === option.value
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sensitivity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sensitivity: {sensitivity}%
              </label>
              <input
                type="range"
                min="1"
                max="200"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Intensity: {intensity}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </>
        )}

        {/* Audio Status */}
        <div className="pt-2 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Status:</span>
            <span className={`text-sm font-medium ${
              audioSource !== 'none' ? 'text-green-400' : 'text-gray-400'
            }`}>
              {audioSource !== 'none' ? 'Ready' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioControls;