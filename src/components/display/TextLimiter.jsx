import React from 'react';
import { motion } from 'framer-motion';
import { useScrollerStore } from '../../stores/useScrollerStore';

const TextLimiter = () => {
  const { text, setText, maxLength, setMaxLength } = useScrollerStore();
  
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">
          Text Length ({text.length}/{maxLength})
        </label>
        <div className="text-xs text-gray-400">
          {text.length > maxLength ? '⚠️ Too long' : '✓ Good'}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="20"
          max="150"
          value={maxLength}
          onChange={(e) => setMaxLength(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-xs w-8 text-center">{maxLength}</span>
      </div>
      
      {text.length > maxLength && (
        <motion.div 
          className="text-xs text-yellow-400 p-2 bg-yellow-900/30 rounded"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          Text will be truncated to {maxLength} characters on small screens
        </motion.div>
      )}
    </motion.div>
  );
};

export default TextLimiter;