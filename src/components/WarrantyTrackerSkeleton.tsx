import React from 'react';
import { motion } from 'framer-motion';

const WarrantyTrackerSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      {[...Array(3)].map((_, i) => (
        <div key={i} className="relative overflow-hidden rounded-2xl bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] p-5 h-48">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
          <div className="space-y-3">
            <div className="h-4 bg-[rgba(255,255,255,0.1)] rounded w-3/4"></div>
            <div className="h-3 bg-[rgba(255,255,255,0.08)] rounded w-1/2"></div>
            <div className="h-3 bg-[rgba(255,255,255,0.08)] rounded w-full"></div>
            <div className="h-3 bg-[rgba(255,255,255,0.08)] rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default WarrantyTrackerSkeleton;
