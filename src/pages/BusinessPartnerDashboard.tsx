import React from 'react';
import { motion } from 'framer-motion';
import { ServiceQueueCard, ProductCatalogCard, ActiveAssignmentsCard, QuickActionsRow } from '@/components/BusinessPartner';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
      duration: 0.22,
      ease: 'easeOut',
    },
  },
  exit: { opacity: 0, y: -4, transition: { duration: 0.16, ease: 'easeIn' } },
};

import Header from '@/components/ConsumerDashboard/Header';

const BusinessPartnerDashboard: React.FC = () => {
  const { profile } = useAuth();

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-6 text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-2 rounded-full bg-emerald-800/30 flex items-center justify-center"
        >
          <LayoutDashboard className="w-5 h-5 text-emerald-400" />
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Business Partner Dashboard</h1>
      </div>
      <Header userName={profile?.full_name || 'Partner'} subtitle="Here’s an overview of your business activities." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ServiceQueueCard count={5} />
        <ActiveAssignmentsCard count={3} />
        <ProductCatalogCard count={12} />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Replace with actual components for recent requests and product catalog preview */}
        <motion.div whileHover={{ scale: 1.01, y: -5 }}>
          <div className="p-6 bg-card rounded-lg shadow-lg">Recent Requests</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.01, y: -5 }}>
          <div className="p-6 bg-card rounded-lg shadow-lg">Product Catalog Preview</div>
        </motion.div>
      </div>

      <QuickActionsRow />
    </motion.div>
  );
};

export default BusinessPartnerDashboard;