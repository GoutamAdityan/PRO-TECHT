import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ShieldAlert, MessageSquare, Flag, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// Placeholder data for flagged items
const flaggedItems = [
  {
    id: 'post1',
    type: 'Post',
    content: 'This is a post that was flagged for spam.',
    author: 'user123',
    reason: 'Spam',
    timestamp: '2 hours ago',
    severity: 'Low',
  },
  {
    id: 'comment1',
    type: 'Comment',
    content: 'This comment was reported for being offensive.',
    author: 'user456',
    reason: 'Harassment',
    timestamp: '5 hours ago',
    severity: 'High',
  },
  {
    id: 'review1',
    type: 'Review',
    content: 'Fake review with malicious links.',
    author: 'bot_99',
    reason: 'Malware',
    timestamp: '1 day ago',
    severity: 'Critical',
  },
];

const ModerationDashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-10 relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-border p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Moderation Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Welcome, <span className="text-emerald-400 font-semibold">{profile?.full_name || 'Moderator'}</span>. There are <span className="text-foreground font-bold">{flaggedItems.length} items</span> requiring your attention.
          </p>
          <div className="mt-8 flex gap-4">
            <Button className="btn-neon rounded-full px-6 bg-red-500 hover:bg-red-600 text-white border-none shadow-red-500/20">
              Review High Priority <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" className="btn-subtle rounded-full px-6">
              View All Logs
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Column */}
        <div className="space-y-6">
          <AnimatedCard delay={0.1} hoverEffect="scale" className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-300 mb-1">Pending Reviews</p>
                <h3 className="text-4xl font-bold text-foreground">{flaggedItems.length}</h3>
              </div>
              <div className="p-3 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400">
                <Flag className="w-6 h-6" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2} hoverEffect="scale" className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-300 mb-1">Reports Today</p>
                <h3 className="text-4xl font-bold text-foreground">12</h3>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.3} hoverEffect="scale" className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-300 mb-1">Actions Taken</p>
                <h3 className="text-4xl font-bold text-foreground">45</h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Flagged Items List - Spans 2 Columns */}
        <div className="md:col-span-2 space-y-6">
          <AnimatedCard delay={0.4} className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" /> Flagged Content
              </h3>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400">
                Filter by Severity
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              {flaggedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  className="p-4 rounded-xl bg-card hover:bg-accent transition-colors border border-border group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.type === 'Post' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                        item.type === 'Comment' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' :
                          'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                        }`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-muted-foreground">• {item.timestamp}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.severity === 'Critical' ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30' :
                      item.severity === 'High' ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400' :
                        'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                      }`}>
                      {item.severity}
                    </span>
                  </div>

                  <p className="text-foreground mb-3 font-medium">{item.content}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <p>Reported for: <span className="text-red-600 dark:text-red-300">{item.reason}</span></p>
                    <p>Author: <span className="text-foreground">{item.author}</span></p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-500/10">
                      <CheckCircle className="w-4 h-4 mr-1" /> Keep
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-500/10">
                      <XCircle className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </motion.div>
  );
};

export default ModerationDashboard;
