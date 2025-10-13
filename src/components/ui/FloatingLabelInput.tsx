import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from './input'; // Assuming existing shadcn/ui Input

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, id, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const showLabel = isFocused || hasValue;

    return (
      <div className="relative">
        <motion.label
          htmlFor={id}
          initial={false}
          animate={showLabel ? { y: -36, x: 0, scale: 0.8, opacity: 1 } : { y: 0, x: 0, scale: 1, opacity: 0.7 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none origin-top-left
            ${showLabel ? 'text-xs text-green-400' : 'text-base'}
          `}
        >
          {label}
        </motion.label>
        <Input
          id={id}
          ref={ref}
          className={`h-11 px-4 py-2.5 w-full bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-lg text-foreground/80 placeholder:text-muted-foreground placeholder:opacity-80
            focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition-all duration-150 ease-out
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingLabelInput };
