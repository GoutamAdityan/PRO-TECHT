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
          animate={showLabel ? { y: -24, x: 0, scale: 0.8, opacity: 1 } : { y: 0, x: 0, scale: 1, opacity: 0.7 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none origin-top-left
            ${showLabel ? 'text-xs text-primary-foreground' : 'text-base'}
          `}
        >
          {label}
        </motion.label>
        <Input
          id={id}
          ref={ref}
          className={`pl-3 pr-3 py-2 w-full bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-md text-white
            focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-0 focus-visible:border-green-400
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
