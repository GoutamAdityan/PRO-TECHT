import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { WarrantyEvent } from '../../hooks/useConsumerDashboardData';
import { ShieldCheck } from 'lucide-react'; // Import ShieldCheck icon

interface WarrantyTimelineCardProps {
  warrantyHistory: WarrantyEvent[];
  delay?: number;
}

const getBadgeColor = (status: 'active' | 'nearing_expiry' | 'expired') => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500';
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2), 0 0 30px rgba(34,197,94,0.15)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="h-full rounded-2xl transition-all duration-300 ease-out"
    >
      <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <ShieldCheck className="w-6 h-6 text-emerald-400 mr-3" />
          <h3 className="text-lg font-medium text-foreground/90">Warranty Timeline</h3>
        </div>
        {relevantWarranties.length > 0 ? (
          <ul className="space-y-4 flex-grow">
            {relevantWarranties.slice(0, 4).map((event, index) => (
              <li key={event.id} className={`flex items-start space-x-3 py-2 ${index < relevantWarranties.slice(0, 4).length - 1 ? 'border-b border-foreground/5' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-2 ${getBadgeColor(event.status)}`} />
                <div>
                  <p className="text-foreground/90 font-medium">{event.productName}</p>
                  <p className="text-foreground/70 text-sm">{event.description} on {event.date}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-foreground/70 flex-grow">No relevant warranty events.</p>
        )}
        <Button
          className="mt-6 px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                     hover:translate-y-[-2px] transition-all duration-200 ease-out
                     shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
        >
          View Full Warranty Tracker
        </Button>
      </Card>
    </motion.div>
  );
};

export default WarrantyTimelineCard;
