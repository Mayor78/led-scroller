import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExpand } from "react-icons/fa";

const LandscapeModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-800/90 backdrop-blur-lg border border-green-500/30 rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <FaExpand className="text-green-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Landscape Mode Required</h3>
              <p className="text-gray-300">
                For the best experience, the LED display will open in fullscreen landscape mode.
                Please rotate your device if it doesn't happen automatically.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <motion.button
                onClick={onConfirm}
                className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue to Fullscreen
              </motion.button>
              <motion.button
                onClick={onCancel}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandscapeModal;