'use client';

import { motion } from 'framer-motion';
import { Layers, Grid } from 'lucide-react';

export function ModeToggle({ isSlideMode, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed bottom-8 right-8 z-[10000] p-4 rounded-full bg-[var(--main-color)] text-white shadow-lg hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={isSlideMode ? 'Switch to Normal Mode' : 'Switch to Slide Mode'}
    >
      {isSlideMode ? (
        <Grid size={24} />
      ) : (
        <Layers size={24} />
      )}
    </motion.button>
  );
}
