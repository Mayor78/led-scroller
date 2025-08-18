import React from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const SpeedControl = () => {
  const { speed, direction, setSpeed, setDirection } = useScrollerStore();

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-3">Animation</h3>
      
      <div className="space-y-4">
        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Speed: {speed}
          </label>
          <input
            type="range"
            min="1"
            max="15"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Direction Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Direction
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setDirection('left')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                direction === 'left'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              ← Left
            </button>
            <button
              onClick={() => setDirection('right')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                direction === 'right'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              Right →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedControl;