import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  ctaText: string;
  onCtaClick: () => void;
  icon: LucideIcon; // Add icon prop
  delay?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, ctaText, onCtaClick, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: delay, ease: "easeOut" }}
      whileHover={{
        y: -3,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transition: { duration: 0.2 }
      }}
      className="h-full cursor-pointer"
      onClick={onCtaClick} // Make the whole card clickable
    >
      <Card className="bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-2xl p-5 flex flex-col items-start justify-between h-full">
        <div className="flex items-center mb-3">
          <Icon className="w-6 h-6 text-green-400 mr-3" />
          <h3 className="text-lg font-medium text-gray-200">{title}</h3>
        </div>
        <p className="text-3xl font-bold text-white mb-4">{value}</p>
        <Button
          onClick={onCtaClick}
          className="mt-auto px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
        >
          {ctaText}
        </Button>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;