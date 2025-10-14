import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { ActivityEvent } from '../../hooks/useConsumerDashboardData';

interface RecentActivityProps {
  activity: ActivityEvent[];
  delay?: number;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activity, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, delay: delay, ease: "easeOut" }}
    whileHover={{ translateY: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
    className="col-span-full"
  >
    <Card className="bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-2xl p-5">
      <h3 className="text-lg font-medium text-foreground mb-4">Recent Activity</h3>
      {activity.length > 0 ? (
        <ul className="space-y-3">
          {activity.slice(0, 5).map((event) => (
            <li key={event.id} className="flex justify-between items-center text-gray-300">
              <span>{event.description}</span>
              <span className="text-sm text-gray-500">{event.date}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No recent activity.</p>
      )}
    </Card>
  </motion.div>
);

export default RecentActivity;
