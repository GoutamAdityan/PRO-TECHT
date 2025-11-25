import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const TextReveal: React.FC<TextRevealProps> = ({ text, className, delay = 0 }) => {
    const [displayText, setDisplayText] = useState('');
    const [isScrambling, setIsScrambling] = useState(true);

    useEffect(() => {

        let interval: NodeJS.Timeout;

        const startScramble = () => {
            let iteration = 0;

            interval = setInterval(() => {
                setDisplayText(
                    text
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) {
                                return text[index];
                            }
                            return CHARS[Math.floor(Math.random() * CHARS.length)];
                        })
                        .join("")
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                    setIsScrambling(false);
                }

                iteration += 1 / 3;
            }, 30);
        };

        const timeout = setTimeout(startScramble, delay * 1000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, delay]);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {displayText}
        </motion.span>
    );
};

export default TextReveal;
