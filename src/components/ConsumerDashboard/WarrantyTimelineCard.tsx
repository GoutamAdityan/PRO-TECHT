import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { WarrantyEvent } from '../../hooks/useConsumerDashboardData';

interface WarrantyTimelineCardProps {
  warrantyHistory: WarrantyEvent[];
  delay?: number;
}

const getBadgeColor = (status: 'active' | 'nearing_expiry' | 'expired') => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'nearing_expiry':
      return 'bg-yellow-500';
    case 'expired':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const WarrantyTimelineCard: React.FC<WarrantyTimelineCardProps> = ({ warrantyHistory, delay = 0 }) => {
  const relevantWarranties = warrantyHistory.filter(event =>
    event.type === 'Warranty Expiry' || event.status === 'nearing_expiry' || event.status === 'expired'
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: delay, ease: "easeOut" }}
      whileHover={{ translateY: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className="h-full"
    >
      <Card className="bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-2xl p-5 h-full flex flex-col">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Warranty Timeline</h3>
        {relevantWarranties.length > 0 ? (
          <ul className="space-y-4 flex-grow">
            {relevantWarranties.slice(0, 4).map((event) => (
              <li key={event.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${getBadgeColor(event.status)}`} />
                <div>
                  <p className="text-gray-100 font-medium">{event.productName}</p>
                  <p className="text-gray-400 text-sm">{event.description} on {event.date}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 flex-grow">No relevant warranty events.</p>
        )}
        <Button className="mt-6 px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
          View Full Warranty Tracker
        </Button>
      </Card>
    </motion.div>
  );
};

export default WarrantyTimelineCard;
