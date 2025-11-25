import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConsumerDashboardData } from '../hooks/useConsumerDashboardData';
import { Package, ShieldCheck, Wrench, Users, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
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
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-10 relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-border p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Welcome back, <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">{userName}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Your product ecosystem is looking healthy. You have <span className="text-foreground font-semibold">{activeWarranties} active warranties</span> and <span className="text-foreground font-semibold">{pendingServiceRequests} pending requests</span>.
          </p>
          <div className="mt-8 flex gap-4">
            <Button onClick={() => navigate('/products/new')} className="btn-neon rounded-full px-6">
              Register Product <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button onClick={() => navigate('/service-requests/new')} variant="outline" className="btn-subtle rounded-full px-6">
              Request Service
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Column */}
        <div className="space-y-6">
          <AnimatedCard delay={0.1} hoverEffect="scale" className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-blue-300 mb-1">Total Products</p>
                <h3 className="text-4xl font-bold text-foreground">{totalProducts}</h3>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2} hoverEffect="scale" className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-emerald-300 mb-1">Active Warranties</p>
                <h3 className="text-4xl font-bold text-foreground">{activeWarranties}</h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.3} hoverEffect="scale" className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border-amber-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-amber-300 mb-1">Pending Requests</p>
                <h3 className="text-4xl font-bold text-foreground">{pendingServiceRequests}</h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                <Wrench className="w-6 h-6" />
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Recent Products - Spans 2 Columns */}
        <div className="md:col-span-2">
          <AnimatedCard delay={0.4} className="h-full flex flex-col bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Clock className="w-5 h-5 text-primary" /> Recent Products
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="text-muted-foreground hover:text-primary">
                View All
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              {recentProducts.length > 0 ? (
                recentProducts.map((product: any, index: number) => (
                  <motion.div
                    key={product.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="flex items-center p-4 rounded-xl bg-card hover:bg-accent/50 transition-colors border border-border group cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-border mr-4 group-hover:border-primary/50 transition-colors">
                      <Package className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category || 'Electronics'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.warrantyStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                        {product.warrantyStatus || 'Active'}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No products registered yet.
                </div>
              )}
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Warranty Timeline / Alerts */}
      <motion.div variants={itemVariants}>
        <AnimatedCard delay={0.6} className="border-l-4 border-l-yellow-500 bg-card border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Warranty Expiration Alert</h3>
              <p className="text-muted-foreground mb-4">
                Your <span className="text-foreground font-medium">MacBook Pro M1</span> warranty expires in <span className="text-yellow-400 font-bold">15 days</span>. Consider extending your coverage.
              </p>
              <Button size="sm" variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                Extend Warranty
              </Button>
            </div>
          </div>
        </AnimatedCard>
      </motion.div>

    </motion.div>
  );
};

export default ConsumerDashboard;