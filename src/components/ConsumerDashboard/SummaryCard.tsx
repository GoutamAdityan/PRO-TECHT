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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2), 0 0 30px rgba(34,197,94,0.15)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="h-full cursor-pointer rounded-2xl transition-all duration-300 ease-out"
    >
      <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col items-start justify-between h-full">
        <div className="flex items-center mb-3">
          <Icon className="w-6 h-6 text-emerald-400 mr-3" />
          <h3 className="text-lg font-medium text-foreground/90">{title}</h3>
        </div>
        <p className="text-4xl font-bold text-foreground mb-4">{value}</p>
        <Button
          onClick={onCtaClick}
          className="mt-auto px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                     hover:translate-y-[-2px] transition-all duration-200 ease-out
                     shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
        >
          {ctaText}
        </Button>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;