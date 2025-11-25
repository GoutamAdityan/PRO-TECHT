import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Briefcase, ShoppingBag, Clock, ArrowRight, BarChart3, Users } from 'lucide-react';
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
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const BusinessPartnerDashboard: React.FC = () => {
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
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Partner Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Welcome back, <span className="text-emerald-400 font-semibold">{profile?.full_name || 'Partner'}</span>. Manage your service queue, product catalog, and business insights.
          </p>
          <div className="mt-8 flex gap-4">
            <Button onClick={() => navigate('/product-catalog')} className="btn-neon rounded-full px-6">
              Manage Catalog <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button onClick={() => navigate('/service-queue')} variant="outline" className="btn-subtle rounded-full px-6">
              View Service Queue
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Column */}
        <div className="space-y-6">
          <AnimatedCard delay={0.1} hoverEffect="scale" className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-purple-300 mb-1">Service Queue</p>
                <h3 className="text-4xl font-bold text-foreground">5</h3>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2} hoverEffect="scale" className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-blue-300 mb-1">Active Assignments</p>
                <h3 className="text-4xl font-bold text-foreground">3</h3>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.3} hoverEffect="scale" className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-emerald-300 mb-1">Product Catalog</p>
                <h3 className="text-4xl font-bold text-foreground">12</h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Recent Requests / Activity - Spans 2 Columns */}
        <div className="md:col-span-2 space-y-6">
          <AnimatedCard delay={0.4} className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" /> Recent Activity
              </h3>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-emerald-400">
                View All
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              {[1, 2, 3].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  className="flex items-center p-4 rounded-xl bg-card hover:bg-accent transition-colors border border-border group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mr-4">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">New Service Request #{100 + item}</h4>
                    <p className="text-sm text-muted-foreground">Customer requested maintenance for Product X</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">2h ago</span>
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

export default BusinessPartnerDashboard;