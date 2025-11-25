import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BinaryMorseLoaderProps {
    onComplete?: () => void;
    duration?: number;
}

// Morse code dictionary
const morseCode: Record<string, string> = {
    'A': '•−', 'B': '−•••', 'C': '−•−•', 'D': '−••', 'E': '•',
    'F': '••−•', 'G': '−−•', 'H': '••••', 'I': '••', 'J': '•−−−',
    'K': '−•−', 'L': '•−••', 'M': '−−', 'N': '−•', 'O': '−−−',
    'P': '•−−•', 'Q': '−−•−', 'R': '•−•', 'S': '•••', 'T': '−',
    'U': '••−', 'V': '•••−', 'W': '•−−', 'X': '−••−', 'Y': '−•−−',
    'Z': '−−••', ' ': '/'
};

// Convert text to morse code
const textToMorse = (text: string): string => {
    return text
        .toUpperCase()
        .split('')
        .map(char => morseCode[char] || '')
        .join(' ');
};

// Convert text to binary
const textToBinary = (text: string): string => {
    return text
        .split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
};

// Generate random binary stream
const generateBinaryStream = (length: number): string => {
    return Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0').join('');
};

const BinaryMorseLoader = ({ onComplete, duration = 4000 }: BinaryMorseLoaderProps) => {
    const [currentPhase, setCurrentPhase] = useState(0);
    const [binaryStream, setBinaryStream] = useState('');
    const [showDecoded, setShowDecoded] = useState(false);

    const messages = [
        'INITIALIZING',
        'LOADING VAULT',
        'ACCESS GRANTED'
    ];

    useEffect(() => {
        // Generate binary stream
        const interval = setInterval(() => {
            setBinaryStream(generateBinaryStream(80));
        }, 100);

        // Phase progression
        const phaseInterval = setInterval(() => {
            setCurrentPhase(prev => {
                if (prev < messages.length - 1) {
                    setShowDecoded(false);
                    return prev + 1;
                }
                return prev;
            });
        }, duration / messages.length);

        // Show decoded message after morse animation
        const decodeTimeout = setTimeout(() => {
            setShowDecoded(true);
        }, duration / messages.length / 2);

        // Complete loader
        const completeTimeout = setTimeout(() => {
            clearInterval(interval);
            clearInterval(phaseInterval);
            onComplete?.();
        }, duration);

        return () => {
            clearInterval(interval);
            clearInterval(phaseInterval);
            clearTimeout(decodeTimeout);
            clearTimeout(completeTimeout);
        };
    }, [duration, onComplete]);

    const currentMessage = messages[currentPhase];
    const currentMorse = textToMorse(currentMessage);
    const currentBinary = textToBinary(currentMessage);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Binary Stream Background */}
            <div className="absolute inset-0 opacity-10 font-mono text-xs text-emerald-500 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: '100vh', opacity: [0, 1, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: 'linear'
                        }}
                        className="whitespace-nowrap"
                    >
                        {binaryStream}
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center space-y-8">
                {/* Morse Code Display */}
                <motion.div
                    key={currentPhase}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-emerald-400 text-4xl md:text-6xl font-mono tracking-widest"
                >
                    {currentMorse.split('').map((char, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.5] }}
                            transition={{
                                duration: 0.3,
                                delay: i * 0.1,
                                repeat: 2
                            }}
                            className="inline-block mx-1"
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Binary Display */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    className="text-emerald-500/50 text-sm font-mono max-w-2xl break-all px-4"
                >
                    {currentBinary}
                </motion.div>

                {/* Decoded Message */}
                <AnimatePresence>
                    {showDecoded && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-emerald-300 text-2xl md:text-3xl font-bold tracking-wider"
                        >
                            {currentMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Indicator */}
                <div className="flex gap-2 justify-center mt-8">
                    {messages.map((_, i) => (
                        <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i <= currentPhase ? 'bg-emerald-400' : 'bg-emerald-900'
                                }`}
                            animate={{
                                scale: i === currentPhase ? [1, 1.5, 1] : 1,
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: i === currentPhase ? Infinity : 0
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Scanline Effect */}
            <motion.div
                animate={{ y: ['0vh', '100vh'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent"
            />
        </motion.div>
    );
};

export default BinaryMorseLoader;
