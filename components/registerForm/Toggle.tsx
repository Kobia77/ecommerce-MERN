// components/Toggle.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
}

export const Toggle = ({ options, value, onChange }: ToggleProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const index = options.findIndex(option => option.value === value);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [value, options]);

  const handleToggle = (optionValue: string, index: number) => {
    setSelectedIndex(index);
    onChange(optionValue);
  };

  return (
    <div className="relative p-1 flex justify-between items-center rounded-xl bg-gray-100">
      {/* Background highlight for selected option */}
      <motion.div
        className="absolute h-full top-0 rounded-lg bg-white shadow-sm"
        initial={{ left: `${(selectedIndex * 100) / options.length}%`, width: `${100 / options.length}%` }}
        animate={{ left: `${(selectedIndex * 100) / options.length}%`, width: `${100 / options.length}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      
      {/* Toggle buttons */}
      {options.map((option, index) => (
        <motion.button
          key={option.value}
          type="button"
          onClick={() => handleToggle(option.value, index)}
          className={`relative z-10 py-3 px-6 rounded-lg flex-1 text-center font-medium transition-colors ${
            selectedIndex === index 
              ? 'text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
};