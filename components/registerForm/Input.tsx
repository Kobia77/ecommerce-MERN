"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [filled, setFilled] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilled(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              setFilled(e.target.value.length > 0);
            }}
            onChange={handleChange}
            className={`
              w-full px-4 py-2.5 bg-white 
              border rounded-lg transition-all duration-200
              outline-none text-neutral-800 placeholder-neutral-400
              ${
                error
                  ? "border-red-400"
                  : focused
                  ? "border-indigo-500 ring-2 ring-indigo-100"
                  : "border-neutral-200 hover:border-neutral-300"
              }
              ${className}
            `}
            {...props}
          />

          {/* Subtle indicator for filled state */}
          {filled && !error && !focused && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </motion.svg>
            </div>
          )}
        </div>

        <AnimatePresence>
          {error ? (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-red-500 mt-1"
            >
              {error}
            </motion.p>
          ) : (
            helperText && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-neutral-500 mt-1"
              >
                {helperText}
              </motion.p>
            )
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
