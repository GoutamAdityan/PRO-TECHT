
import React from 'react';
import { motion } from 'framer-motion';
import { DURATION_MEDIUM, SMOOTH_EASE } from '@/lib/animations/motion';

// Placeholder data for flagged items
const flaggedItems = [
  {
    id: 'post1',
    type: 'Post',
    content: 'This is a post that was flagged for spam.',
    author: 'user123',
    reason: 'Spam',
    timestamp: '2 hours ago',
  },
  {
    id: 'comment1',
    type: 'Comment',
    content: 'This comment was reported for being offensive.',
    author: 'user456',
    reason: 'Harassment',
    timestamp: '5 hours ago',
  },
];

const FlaggedItemCard = ({ item }) => (
  <motion.div
    className="bg-gray-800/50 border border-red-500/30 rounded-lg p-4 mb-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: DURATION_MEDIUM, ease: SMOOTH_EASE }}
  >
    <div className="flex justify-between items-center">
      <span className="text-sm font-bold text-red-400">{item.type}</span>
      <span className="text-xs text-gray-400">{item.timestamp}</span>
    </div>
    <p className="text-gray-300 my-2">{item.content}</p>
    <div className="text-xs text-gray-400">
      <p><strong>Author:</strong> {item.author}</p>
      <p><strong>Reason:</strong> {item.reason}</p>
    </div>
    <div className="flex justify-end space-x-2 mt-4">
      <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">Restore</button>
      <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Hide</button>
    </div>
  </motion.div>
);

const ModerationDashboard = () => {
  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4 text-green-400">Moderation Dashboard</h1>
      <p className="text-gray-400 mb-6">Items flagged for review are listed below.</p>
      <div>
        {flaggedItems.map(item => (
          <FlaggedItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ModerationDashboard;
