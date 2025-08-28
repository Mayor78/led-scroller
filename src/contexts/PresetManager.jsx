import React from 'react';
import { motion } from 'framer-motion';
import { useScrollerStore } from '../stores/useScrollerStore';
import { Save, Upload, RefreshCw } from 'react-feather';

const PresetManager = () => {
  const { loadPreset, savePreset, resetToDefault } = useScrollerStore();
  const [newPresetName, setNewPresetName] = React.useState('');
  const [saveMessage, setSaveMessage] = React.useState(''); // For feedback

  const presetOptions = [
    { name: 'default', label: 'Default' },
    { name: 'matrix', label: 'Matrix' },
    { name: 'cyberpunk', label: 'Cyberpunk' },
    { name: 'neon', label: 'Neon' },
    { name: 'rgbParty', label: 'RGB Party' },
    { name: 'minimalWhite', label: 'Minimal' }
  ];

  const handleSavePreset = () => {
    if (newPresetName) {
      savePreset(newPresetName);
      setSaveMessage(`Preset '${newPresetName}' saved!`);
      setTimeout(() => setSaveMessage(''), 2000); // Clear message after 2s
      setNewPresetName(''); // Reset input
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {presetOptions.map((preset) => (
          <motion.button
            key={preset.name}
            onClick={() => loadPreset(preset.name)}
            className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="New preset name"
            className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 text-sm"
          />
        </div>
        <motion.button
          onClick={handleSavePreset}
          disabled={!newPresetName}
          className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-sm flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save size={14} /> Save
        </motion.button>
      </div>

      {saveMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-green-400 text-sm text-center"
        >
          {saveMessage}
        </motion.div>
      )}

      <motion.button
        onClick={resetToDefault}
        className="w-full py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm flex items-center justify-center gap-1"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RefreshCw size={14} /> Reset to Default
      </motion.button>
    </div>
  );
};

export default PresetManager;