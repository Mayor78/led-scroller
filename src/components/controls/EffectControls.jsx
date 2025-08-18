import React from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const EffectControls = () => {
  const { reflection, setReflection } = useScrollerStore();

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-3">Effects</h3>
      
      <div className="space-y-4">
        {/* Reflection */}
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
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>None</span>
            <span>Full</span>
          </div>
        </div>

        {/* Preset Effects */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quick Effects
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setReflection(0)}
              className="py-2 px-3 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded text-sm"
            >
              No Reflection
            </button>
            <button
              onClick={() => setReflection(30)}
              className="py-2 px-3 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded text-sm"
            >
              Subtle
            </button>
            <button
              onClick={() => setReflection(60)}
              className="py-2 px-3 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded text-sm"
            >
              Medium
            </button>
            <button
              onClick={() => setReflection(90)}
              className="py-2 px-3 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded text-sm"
            >
              Strong
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffectControls;