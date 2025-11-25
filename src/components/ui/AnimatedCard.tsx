import React, { useRef, useState } from "react";
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/context/SoundContext";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    hoverEffect?: "lift" | "glow" | "scale" | "none";
    enable3D?: boolean;
}

const AnimatedCard = ({
    children,
    className,
    delay = 0,
    hoverEffect = "lift",
    enable3D = true,
    ...props
}: AnimatedCardProps) => {
    const { playHoverSound } = useSound();
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 30 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current || !enable3D) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;

        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        if (!enable3D) return;
        x.set(0);
        y.set(0);
    };

    const hoverVariants = {
        lift: {
            y: -10,
            boxShadow: "0 20px 40px rgba(0, 204, 102, 0.2)",
        },
        glow: {
            boxShadow: "0 0 20px rgba(0, 204, 102, 0.6)",
            borderColor: "rgba(0, 204, 102, 0.5)",
        },
        scale: {
            scale: 1.05,
        },
        none: {},
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            whileHover={hoverVariants[hoverEffect]}
            style={{
                rotateX: enable3D ? rotateX : 0,
                rotateY: enable3D ? rotateY : 0,
                transformStyle: "preserve-3d",
            }}
            className={cn(
                "glass-card rounded-2xl p-6 relative overflow-hidden group perspective-1000",
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseLeave={(e) => {
                handleMouseLeave();
                props.onMouseLeave?.(e);
            }}
            onMouseEnter={(e) => {
                playHoverSound();
                props.onMouseEnter?.(e);
            }}
            {...props}
        >
            {enable3D && (
                <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    style={{
                        background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.1) 0%, transparent 80%)`,
                    }}
                />
            )}
            <div className="relative z-0">
                {children}
            </div>
        </motion.div>
    );
};

export default AnimatedCard;
