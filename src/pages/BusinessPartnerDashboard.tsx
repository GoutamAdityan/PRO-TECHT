import React from 'react';
import { motion } from 'framer-motion';
import { ServiceQueueCard, ProductCatalogCard, ActiveAssignmentsCard, QuickActionsRow, RecentRequestsCard, CatalogPreviewCard } from '@/components/BusinessPartner';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard } from 'lucide-react';

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.3 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

import Header from '@/components/ConsumerDashboard/Header';

const BusinessPartnerDashboard: React.FC = () => {
  const { profile } = useAuth();

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-6"
      variants={pageVariants}
      initial="hidden"
      animate="enter"
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
        <h1 className="text-4xl font-bold text-foreground">Business Partner Dashboard</h1>
      </div>
      <Header userName={profile?.full_name || 'Partner'} subtitle="Here’s an overview of your business activities." />

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={containerVariants}>
        <ServiceQueueCard count={5} />
        <ActiveAssignmentsCard count={3} />
        <ProductCatalogCard count={12} />
      </motion.div>

      <motion.div className="grid md:grid-cols-2 gap-8 mb-8" variants={containerVariants}>
        <RecentRequestsCard />
        <CatalogPreviewCard />
      </motion.div>
    </motion.div>
  );
};

export default BusinessPartnerDashboard;