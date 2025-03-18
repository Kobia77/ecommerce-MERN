// components/Input.tsx
"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="space-y-1">
        {label && (
          <label className="block font-medium text-gray-700">{label}</label>
        )}
        <div className="relative">
          <motion.div
            animate={focused ? { opacity: 1, scale: 1.02 } : { opacity: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-70"
          />
          <input
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`relative w-full bg-white border ${
              error ? "border-red-300" : focused ? "border-transparent" : "border-gray-300"
            } rounded-xl p-3 text-gray-800 placeholder-gray-400 outline-none transition-all ${className}`}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Input.displayName = "Input";