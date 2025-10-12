import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div
      className="bg-card-bg p-6 rounded-lg border border-gray-800 shadow-lg"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="text-accent mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-heading mb-2">{title}</h3>
      <p className="text-text">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
