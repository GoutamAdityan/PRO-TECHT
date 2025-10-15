import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConsumerDashboardData } from '../hooks/useConsumerDashboardData';
import { useAuth } from '../hooks/useAuth'; // Import useAuth
import { Package, ShieldCheck, Wrench, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import the extracted components
import Header from '../components/ConsumerDashboard/Header';
import SummaryCard from '../components/ConsumerDashboard/SummaryCard';
import RecentProductsCard from '../components/ConsumerDashboard/RecentProductsCard'; // Renamed

import WarrantyTimelineCard from '../components/ConsumerDashboard/WarrantyTimelineCard'; // New component



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
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const ConsumerDashboard: React.FC = () => {
  const { userName, totalProducts, activeWarranties, pendingServiceRequests, recentProducts, warrantyHistory, loading } = useConsumerDashboardData();
  const navigate = useNavigate();

  // Page-load check for duplicate sidebars
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const sidebars = document.querySelectorAll('[role="navigation"], .sidebar');
      if (sidebars.length > 1) {
        console.warn('Multiple sidebar-like elements detected. Ensure only one global sidebar is mounted.');
      }
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }

  return (
      <motion.div
        className="max-w-6xl mx-auto px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-2 rounded-full bg-emerald-800/30 flex items-center justify-center"
          >
            <Users className="w-5 h-5 text-emerald-400" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Consumer Dashboard</h1>
        </div>
        <Header
          userName={userName}
          subtitle="Here’s an overview of your registered products and warranty activity."
        />

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Registered Products"
            value={totalProducts}
            icon={Package}
            delay={0.2}
          />
          <SummaryCard
            title="Active Warranties"
            value={activeWarranties}
            icon={ShieldCheck}
            delay={0.3}
          />
          <SummaryCard
            title="Pending Service Requests"
            value={pendingServiceRequests}
            ctaText="Request Service"
            onCtaClick={() => navigate('/service-requests')}
            icon={Wrench}
            delay={0.4}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <RecentProductsCard products={recentProducts} delay={0.5} />
          <div className="space-y-8">
            <WarrantyTimelineCard warrantyHistory={warrantyHistory} delay={0.6} />
          </div>
        </div>
      </motion.div>

  );
};

export default ConsumerDashboard;