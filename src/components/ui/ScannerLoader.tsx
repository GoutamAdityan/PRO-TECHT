import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScannerLoaderProps {
    children: React.ReactNode;
    className?: string;
    onScanComplete?: () => void;
}

export const ScannerLoader = ({
    children,
    className,
    onScanComplete,
}: ScannerLoaderProps) => {
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsScanning(false);
            onScanComplete?.();
        }, 2000); // Scan duration

        return () => clearTimeout(timer);
    }, [onScanComplete]);

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent z-50 pointer-events-none"
                        style={{
                            boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
                        }}
                    >
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{
                    opacity: isScanning ? 0.3 : 1,
                    filter: isScanning ? "blur(4px)" : "blur(0px)"
                }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>

            {isScanning && (
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px] pointer-events-none" />
            )}
        </div>
    );
};
