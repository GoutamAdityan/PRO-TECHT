import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const SoundToggle = () => {
    const { isPlaying, toggleSound } = useSound();

    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleSound}
                className="relative text-foreground hover:text-emerald-400 transition-colors"
                title={isPlaying ? "Mute sounds" : "Unmute sounds"}
            >
                {isPlaying ? (
                    <Volume2 className="h-5 w-5" />
                ) : (
                    <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
                {isPlaying && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                )}
            </Button>
        </motion.div>
    );
};
