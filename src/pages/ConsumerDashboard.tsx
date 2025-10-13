import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConsumerDashboardData } from '../hooks/useConsumerDashboardData';
import { useAuth } from '../hooks/useAuth'; // Import useAuth
import { Package, ShieldCheck, Wrench } from 'lucide-react';

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
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const ConsumerDashboard: React.FC = () => {
  const { profile } = useAuth(); // Get profile from useAuth
  const { userName, products, serviceRequests, warrantyHistory } = useConsumerDashboardData(profile?.full_name || 'Guest');

  const activeWarrantiesCount = products.filter(p => new Date(p.warrantyExpiry) > new Date()).length;
  const pendingServiceRequestsCount = serviceRequests.filter(req => req.status === 'Open' || req.status === 'Pending').length;

  // Page-load check for duplicate sidebars
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const sidebars = document.querySelectorAll('[role="navigation"], .sidebar');
      if (sidebars.length > 1) {
        console.warn('Multiple sidebar-like elements detected. Ensure only one global sidebar is mounted.');
        // Optionally hide extra ones, but for now, just warn.
        // For example, to hide all but the first:
        // sidebars.forEach((sb, index) => {
        //   if (index > 0) (sb as HTMLElement).style.display = 'none';
        // });
      }
    }
  }, []);

  return (
      <motion.div
        className="max-w-6xl mx-auto px-6 py-8 text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header
          userName={userName}
          subtitle="Here’s an overview of your registered products and warranty activity."
        />

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Registered Products"
            value={products.length}
            ctaText="Open Vault"
            onCtaClick={() => console.log('Open Vault')}
            icon={Package}
            delay={0.2}
          />
          <SummaryCard
            title="Active Warranties"
            value={activeWarrantiesCount}
            ctaText="View Warranties"
            onCtaClick={() => console.log('View Warranties')}
            icon={ShieldCheck}
            delay={0.3}
          />
          <SummaryCard
            title="Pending Service Requests"
            value={pendingServiceRequestsCount}
            ctaText="Request Service"
            onCtaClick={() => console.log('Request Service')}
            icon={Wrench}
            delay={0.4}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <RecentProductsCard products={products} delay={0.5} />
          <div className="space-y-8">
            <WarrantyTimelineCard warrantyHistory={warrantyHistory} delay={0.6} />
          </div>
        </div>
      </motion.div>

  );
};

export default ConsumerDashboard;