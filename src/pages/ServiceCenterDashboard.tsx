import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Users, Package, MessageSquare, FileText, ClipboardList } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { containerVariants, cardVariants, cardHoverVariants, headerIconVariants } from '@/lib/animations';
import PageTransition from '@/components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const communicationsData = [
  { id: 'M001', customer: 'Alice Smith', snippet: 'Regarding laptop repair...', time: '2 min ago', unread: true },
  { id: 'M002', customer: 'Bob Johnson', snippet: 'Update on smartwatch service.', time: '1 hour ago', unread: true },
  { id: 'M003', customer: 'Charlie Brown', snippet: 'Tablet diagnostic results.', time: 'Yesterday', unread: false },
  { id: 'M004', customer: 'Diana Prince', snippet: 'Headphones warranty claim.', time: '2 days ago', unread: false },
];

interface ActiveJobsCardProps {
  activeCount: number;
  pendingCount: number;
  onClick: () => void;
  delay?: number;
}

const ActiveJobsCard: React.FC<ActiveJobsCardProps> = ({ activeCount, pendingCount, onClick, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const cardAnimation = shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : cardVariants;

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
      transition={{ delay: shouldReduceMotion ? 0 : delay }}
      className="col-span-1 md:col-span-2 h-full cursor-pointer rounded-2xl transition-all duration-300 ease-out
                 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
      onClick={onClick}
    >
      <Card className="bg-[#052e16] border border-emerald-800/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between h-full relative overflow-hidden group">
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex items-center gap-4 z-10 w-full md:w-auto mb-4 md:mb-0">
          <div className="p-3 rounded-xl bg-emerald-800/50 border border-emerald-500/20">
            <ClipboardList className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Active Jobs</h3>
            <p className="text-emerald-100/60 text-sm">Track and manage ongoing service requests and assignments.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 z-10 w-full md:w-auto justify-center md:justify-end">
          <div className="flex flex-col items-center justify-center bg-[#0f1f18] border border-emerald-500/20 rounded-xl px-6 py-3 min-w-[120px]">
            <span className="text-3xl font-bold text-emerald-400">{activeCount}</span>
            <span className="text-xs font-medium text-emerald-100/50 uppercase tracking-wider mt-1">In Progress</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-[#0f1f18] border border-emerald-500/20 rounded-xl px-6 py-3 min-w-[120px]">
            <span className="text-3xl font-bold text-blue-400">{pendingCount}</span>
            <span className="text-xs font-medium text-blue-100/50 uppercase tracking-wider mt-1">Pending</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
  icon: React.ElementType;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, ctaText, onCtaClick, icon: Icon, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const cardAnimation = shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : cardVariants;

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
      transition={{ delay: shouldReduceMotion ? 0 : delay }}
      className="h-full cursor-pointer rounded-2xl transition-all duration-300 ease-out
                 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
      onClick={onCtaClick}
      role="button"
      tabIndex={0}
      aria-label={`${title}: ${value} ${subtitle}. Click to ${ctaText}`}
    >
      <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col items-start justify-between h-full">
        <div className="flex items-center mb-3">
          <Icon className="w-6 h-6 text-emerald-400 mr-3" />
          <h3 className="text-lg font-medium text-foreground/90">{title}</h3>
        </div>
        <p className="text-4xl font-bold text-foreground mb-2">{value}</p>
        <p className="text-sm text-foreground/70 mb-4">{subtitle}</p>
        <Button
          onClick={onCtaClick}
          className="mt-auto px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                     hover:translate-y-[-2px] transition-all duration-200 ease-out
                     shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
          aria-label={ctaText}
        >
          {ctaText}
        </Button>
      </Card>
    </motion.div>
  );
};

interface ListCardProps {
  title: string;
  children: React.ReactNode;
  ctaText: string;
  onCtaClick: () => void;
  icon: React.ElementType;
  delay?: number;
}

const ListCard: React.FC<ListCardProps> = ({ title, children, ctaText, onCtaClick, icon: Icon, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const cardAnimation = shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : cardVariants;

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
      transition={{ delay: shouldReduceMotion ? 0 : delay }}
      className="h-full rounded-2xl transition-all duration-300 ease-out
                 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
    >
      <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
        <div className="flex items-center mb-6">
          <Icon className="w-6 h-6 text-emerald-400 mr-3" />
          <h3 className="text-lg font-medium text-foreground/90">{title}</h3>
        </div>
        <div className="flex-1 overflow-y-auto mb-4">
          {children}
        </div>
        <Button
          onClick={onCtaClick}
          className="w-full px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                     hover:translate-y-[-2px] transition-all duration-200 ease-out
                     shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
          aria-label={ctaText}
        >
          {ctaText}
        </Button>
      </Card>
    </motion.div>
  );
};

interface ActionCardProps {
  title: string;
  ctaText: string;
  onCtaClick: () => void;
  delay?: number;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, ctaText, onCtaClick, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const cardAnimation = shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : cardVariants;

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
      transition={{ delay: shouldReduceMotion ? 0 : delay }}
      className="h-full cursor-pointer rounded-2xl transition-all duration-300 ease-out
                 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
      onClick={onCtaClick}
      role="button"
      tabIndex={0}
      aria-label={`${title}. Click to ${ctaText}`}
    >
      <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col items-center justify-center h-full text-center">
        <FileText className="w-12 h-12 text-emerald-400 mb-4" />
        <h3 className="text-lg font-medium text-foreground/90 mb-4">{title}</h3>
        <Button
          onClick={onCtaClick}
          className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                     hover:translate-y-[-2px] transition-all duration-200 ease-out
                     shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
        >
          {ctaText}
        </Button>
      </Card>
    </motion.div>
  );
};

type JobStatus = "submitted" | "in_progress" | "completed" | "Unread";

interface StatusBadgeProps {
  status: JobStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClasses = {
    'submitted': 'bg-amber-500/20 text-amber-400',
    'in_progress': 'bg-blue-500/20 text-blue-400',
    'completed': 'bg-emerald-500/20 text-emerald-400',
    'Unread': 'bg-red-500/20 text-red-400',
  };
  const displayText = {
    'submitted': 'Submitted',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'Unread': 'Unread',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusClasses[status])}>
      {displayText[status]}
    </span>
  );
};


const ServiceCenterDashboard: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [unfiledReportsCount, setUnfiledReportsCount] = useState(0);
  const [activeJobsData, setActiveJobsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Get current user's Service Center ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Find the company owned by this user
        const { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        let serviceCenterId = null;

        if (company) {
          // Find the service center for this company
          const { data: serviceCenter } = await supabase
            .from('service_centers')
            .select('id')
            .eq('company_id', company.id)
            .single();

          if (serviceCenter) {
            serviceCenterId = serviceCenter.id;
          }
        }

        if (!serviceCenterId) {
          console.error("No service center found for this user");
          setLoading(false);
          return;
        }

        // 2. Fetch service requests filtered by service_center_id
        const { data: requests, error } = await supabase
          .from('service_requests' as any)
          .select(`
            id,
            status,
            created_at,
            products (
              brand,
              model
            ),
            profiles (
              full_name
            )
          `)
          .eq('service_center_id', serviceCenterId) // Added filter
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Calculate counts
        const inProgressCount = (requests as any[])?.filter(r => r.status === 'in_progress').length || 0;
        const submittedCount = (requests as any[])?.filter(r => r.status === 'submitted').length || 0;

        setActiveJobsCount(inProgressCount);
        setPendingRequestsCount(submittedCount);
        setUnfiledReportsCount(0); // No reports data yet

        // Format first 5 requests for display
        const formatted = (requests || []).slice(0, 5).map((req: any) => {
          const daysSince = Math.floor((Date.now() - new Date(req.created_at).getTime()) / (1000 * 60 * 60 * 24));
          return {
            id: req.id.substring(0, 8).toUpperCase(),
            product: `${req.products?.brand || 'Unknown'} ${req.products?.model || ''}`.trim(),
            customer: req.profiles?.full_name || 'Unknown',
            eta: daysSince === 0 ? 'Today' : `${daysSince} day${daysSince > 1 ? 's' : ''} ago`,
            status: req.status
          };
        });

        setActiveJobsData(formatted);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Real-time subscription - Filtered?
    // Note: RLS should ideally handle filtering, but since we are fixing client-side:
    // We can't easily filter channel events by a joined column (owner -> company -> sc).
    // So we'll just refetch and let the fetch logic handle filtering.
    const channel = supabase
      .channel('dashboard_updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'service_requests' },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const containerAnimation = shouldReduceMotion ? { opacity: 1 } : containerVariants;
  const headerIconAnimation = shouldReduceMotion ? { opacity: 1, scale: 1 } : headerIconVariants;
  const textAnimation = shouldReduceMotion ? { opacity: 1 } : cardVariants;

  return (
    <PageTransition>
      <motion.div
        className="max-w-6xl mx-auto px-6 py-6 text-white"
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            variants={headerIconAnimation}
            initial="hidden"
            animate="show"
            className="p-2 rounded-full bg-emerald-800/30 flex items-center justify-center"
          >
            <Users className="w-5 h-5 text-emerald-400" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Service Center Dashboard</h1>
        </div>

        <motion.p
          variants={textAnimation}
          initial="hidden"
          animate="show"
          className="text-lg text-foreground/70 mb-8"
        >
          Here's an overview of active jobs, communications, and reports.
        </motion.p>

        {/* Row of three StatCards - Modified to include ActiveJobsCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* New Active Jobs Card spanning 2 columns */}
          <ActiveJobsCard
            activeCount={activeJobsCount}
            pendingCount={pendingRequestsCount}
            onClick={() => navigate('/service-queue')}
            delay={0.2}
          />

          <StatCard
            title="Unfiled Reports"
            value={unfiledReportsCount}
            subtitle="reports pending filing"
            ctaText="View Reports"
            onCtaClick={() => navigate('/service-reports')}
            icon={FileText}
            delay={0.4}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Recent Jobs List */}
          <ListCard
            title="Recent Service Requests"
            ctaText="View All"
            onCtaClick={() => navigate('/service-queue')}
            icon={Package}
            delay={0.5}
          >
            {loading ? (
              <div className="text-center text-muted-foreground py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              </div>
            ) : activeJobsData.length > 0 ? (
              <div className="space-y-3">
                {activeJobsData.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{job.product}</p>
                      <p className="text-sm text-foreground/70">{job.customer}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={job.status} />
                      <p className="text-xs text-foreground/50 mt-1">{job.eta}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                No service requests yet
              </div>
            )}
          </ListCard>

          {/* Recent Communications List */}
          <ListCard
            title="Recent Communications"
            ctaText="Open Inbox"
            onCtaClick={() => navigate('/customer-communication')}
            icon={MessageSquare}
            delay={0.6}
          >
            <div className="space-y-3">
              {communicationsData.map((comm) => (
                <div key={comm.id} className="flex items-start justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{comm.customer}</p>
                    <p className="text-sm text-foreground/70">{comm.snippet}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-foreground/50">{comm.time}</p>
                    {comm.unread && <StatusBadge status="Unread" />}
                  </div>
                </div>
              ))}
            </div>
          </ListCard>
        </div>

        {/* Bottom Action Card */}
        <div className="grid grid-cols-1">
          <ActionCard
            title="Create New Service Report"
            ctaText="Create Report"
            onCtaClick={() => navigate('/service-reports/new')}
            delay={0.7}
          />
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default ServiceCenterDashboard;