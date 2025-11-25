import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer');

            setIsHovering(!!isInteractive);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseover', handleElementHover);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseover', handleElementHover);
        };
    }, [cursorX, cursorY]);

    if (typeof window === 'undefined') return null;

    return (
        <>
            {/* Main Dot */}
            <motion.div
                className={cn(
                    "fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999]",
                    !isVisible && "opacity-0"
                )}
                style={{
                    translateX: cursorX,
                    translateY: cursorY,
                    x: "-50%",
                    y: "-50%",
                    filter: "drop-shadow(0 0 4px rgba(0, 204, 102, 0.8))",
                }}
            />

            {/* Trailing Ring */}
            <motion.div
                className={cn(
                    "fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[9998] transition-all duration-200 ease-out",
                    !isVisible && "opacity-0",
                    isHovering && "w-16 h-16 bg-primary/10 border-primary/50"
                )}
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    x: "-50%",
                    y: "-50%",
                }}
            />
        </>
    );
};

export default CustomCursor;
