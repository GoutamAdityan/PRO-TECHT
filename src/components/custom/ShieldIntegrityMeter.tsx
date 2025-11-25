import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShieldIntegrityMeterProps {
    expiryDate: string;
    purchaseDate?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const ShieldIntegrityMeter: React.FC<ShieldIntegrityMeterProps> = ({
    expiryDate,
    purchaseDate,
    size = 'md',
    className,
}) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const purchase = purchaseDate ? new Date(purchaseDate) : new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); // Default to 1 year ago if unknown

    const totalDuration = expiry.getTime() - purchase.getTime();
    const remainingDuration = expiry.getTime() - now.getTime();

    // Calculate integrity percentage (0 to 100)
    let integrity = Math.max(0, Math.min(100, (remainingDuration / totalDuration) * 100));

    // If purchase date wasn't provided, and we are just guessing, maybe rely on days remaining for color
    const daysRemaining = Math.ceil(remainingDuration / (1000 * 60 * 60 * 24));

    if (!purchaseDate) {
        // Fallback logic if we don't know the start: 
        // > 365 days = 100%
        // 0 days = 0%
        integrity = Math.max(0, Math.min(100, (daysRemaining / 365) * 100));
    }

    // Determine status color and icon
    let color = 'text-emerald-500';
    let strokeColor = '#10b981'; // emerald-500
    let Icon = ShieldCheck;
    let pulse = false;

    if (daysRemaining <= 0) {
        color = 'text-red-500';
        strokeColor = '#ef4444'; // red-500
        Icon = ShieldAlert;
        integrity = 0;
    } else if (daysRemaining <= 30) {
        color = 'text-orange-500';
        strokeColor = '#f97316'; // orange-500
        Icon = ShieldAlert;
        pulse = true;
    } else if (integrity < 50) {
        color = 'text-yellow-500';
        strokeColor = '#eab308'; // yellow-500
    }

    // Dimensions
    const sizeMap = {
        sm: { width: 60, stroke: 4, fontSize: 'text-[10px]', iconSize: 12 },
        md: { width: 120, stroke: 8, fontSize: 'text-xs', iconSize: 24 },
        lg: { width: 200, stroke: 12, fontSize: 'text-sm', iconSize: 48 },
    };

    const { width, stroke, fontSize, iconSize } = sizeMap[size];
    const radius = (width - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (integrity / 100) * circumference;

    return (
        <div className={cn("relative flex flex-col items-center justify-center", className)}>
            <div className="relative" style={{ width, height: width }}>
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={stroke}
                        fill="transparent"
                        className="text-muted/20"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        stroke={strokeColor}
                        strokeWidth={stroke}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className={cn(pulse && "animate-pulse")}
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <Icon className={cn("mb-1", color)} size={iconSize} />
                    <div className={cn("font-mono font-bold leading-none", color, size === 'sm' ? 'text-xs' : 'text-xl')}>
                        {Math.round(integrity)}%
                    </div>
                    {size !== 'sm' && (
                        <div className={cn("text-[10px] text-muted-foreground uppercase tracking-wider mt-1")}>
                            Integrity
                        </div>
                    )}
                </div>
            </div>

            {/* HUD Label */}
            {size !== 'sm' && (
                <div className="mt-2 text-center">
                    <div className={cn("font-mono font-bold", color)}>
                        {daysRemaining > 0 ? `${daysRemaining} DAYS` : 'EXPIRED'}
                    </div>
                </div>
            )}
        </div>
    );
};
