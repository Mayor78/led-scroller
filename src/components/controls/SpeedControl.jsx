import React from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import { motion } from 'framer-motion';

const SpeedControl = () => {
  const { 
    speed, 
    direction, 
    setSpeed, 
    setDirection, 
    animationType, 
    animationDuration, 
    transitionStyle,
    setAnimationType,
    setAnimationDuration,
    setTransitionStyle
  } = useScrollerStore();

  return (
    <motion.div
      className="bg-gray-700 p-4 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h3 className="text-lg font-semibold text-gray-300 mb-3">Animation</h3>
      
      <div className="space-y-4">
        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Speed: {speed}
          </label>
          <motion.input
            type="range"
            min="1"
            max="15"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            animate={{ 
              background: `linear-gradient(to right, #00ff41 ${((speed - 1) / 14) * 100}%, #4b5563 ${((speed - 1) / 14) * 100}%)`
            }}
            transition={{ duration: 0.3 }}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 5px #00ff41" }}
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
            <motion.button
              onClick={() => setDirection('left')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                direction === 'left'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.05, backgroundColor: direction === 'left' ? '#00cc33' : '#666' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              ← Left
            </motion.button>
            <motion.button
              onClick={() => setDirection('right')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                direction === 'right'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.05, backgroundColor: direction === 'right' ? '#00cc33' : '#666' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Right →
            </motion.button>
          </div>
        </div>

        {/* Animation Type Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Animation Type: {animationType}
          </label>
          <select
            value={animationType}
            onChange={(e) => setAnimationType(e.target.value)}
            className="w-full p-2 bg-gray-600 text-gray-300 rounded-md"
          >
            <option value="slide">Slide</option>
            <option value="fade">Fade</option>
            <option value="bounce">Bounce</option>
            <option value="scale">Scale</option>
          </select>
        </div>

        {/* Animation Duration Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration: {animationDuration}s
          </label>
          <motion.input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={animationDuration}
            onChange={(e) => setAnimationDuration(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            animate={{ 
              background: `linear-gradient(to right, #00ff41 ${((animationDuration - 0.1) / 1.9) * 100}%, #4b5563 ${((animationDuration - 0.1) / 1.9) * 100}%)`
            }}
            transition={{ duration: 0.3 }}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 5px #00ff41" }}
          />
        </div>

        {/* Transition Style Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Transition: {transitionStyle}
          </label>
          <select
            value={transitionStyle}
            onChange={(e) => setTransitionStyle(e.target.value)}
            className="w-full p-2 bg-gray-600 text-gray-300 rounded-md"
          >
            <option value="easeInOut">Ease In/Out</option>
            <option value="linear">Linear</option>
            <option value="spring">Spring</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default SpeedControl;