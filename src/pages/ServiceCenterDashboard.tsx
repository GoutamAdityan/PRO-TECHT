import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Users, Package, MessageSquare, FileText, ClipboardList, ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { containerVariants, cardVariants, cardHoverVariants, headerIconVariants } from '@/lib/animations';
import PageTransition from '@/components/PageTransition';
import { useNavigate } from 'react-router-dom';

// Placeholder Data
const ACTIVE_JOBS_COUNT = 8;
const UNREAD_MESSAGES_COUNT = 2;
const UNFILED_REPORTS_COUNT = 4;

const activeJobsData = [
  { id: 'J001', product: 'Laptop Pro', customer: 'Alice Smith', eta: '2 days', status: 'In Progress' },
  { id: 'J002', product: 'Smartwatch X', customer: 'Bob Johnson', eta: '1 day', status: 'Pending' },
  { id: 'J003', product: 'Tablet Air', customer: 'Charlie Brown', eta: '3 days', status: 'In Progress' },
  { id: 'J004', product: 'Headphones Z', customer: 'Diana Prince', eta: '5 days', status: 'Pending' },
  { id: 'J005', product: 'Gaming Console', customer: 'Clark Kent', eta: '4 days', status: 'Completed' },
];

const communicationsData = [
  { id: 'M001', customer: 'Alice Smith', snippet: 'Regarding laptop repair...', time: '2 min ago', unread: true },
  { id: 'M002', customer: 'Bob Johnson', snippet: 'Update on smartwatch service.', time: '1 hour ago', unread: true },
  { id: 'M003', customer: 'Charlie Brown', snippet: 'Tablet diagnostic results.', time: 'Yesterday', unread: false },
  { id: 'M004', customer: 'Diana Prince', snippet: 'Headphones warranty claim.', time: '2 days ago', unread: false },
];

// Helper Components (matching Consumer Dashboard styling)

interface StatCardProps {
  title: string;
  value: string | number;
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
                 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]" // Matching bloom effect
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
                 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]" // Matching bloom effect
      role="region"
      aria-labelledby={`${title.toLowerCase().replace(/\s/g, '-')}-heading`}
    >
      <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <Icon className="w-6 h-6 text-emerald-400 mr-3" />
          <h3 id={`${title.toLowerCase().replace(/\s/g, '-')}-heading`} className="text-lg font-medium text-foreground/90">{title}</h3>
        </div>
        <div className="flex-grow overflow-y-auto pr-2"> {/* Added overflow for long lists */}
          {children}
        </div>
        <Button
          onClick={onCtaClick}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
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
                 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]" // Matching bloom effect
      onClick={onCtaClick}
      role="button"
      tabIndex={0}
      aria-label={`${title}. Click to ${ctaText}`}
    >
      <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col items-center justify-center h-full text-center">
        <h3 className="text-lg font-medium text-foreground/90 mb-4">{title}</h3>
        <Button
          onClick={onCtaClick}
          className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
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

interface BadgeProps {
  status: 'Pending' | 'In Progress' | 'Completed' | 'Unread';
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusClasses = {
    'Pending': 'bg-amber-500/20 text-amber-400',
    'In Progress': 'bg-blue-500/20 text-blue-400',
    'Completed': 'bg-emerald-500/20 text-emerald-400',
    'Unread': 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusClasses[status])}>
      {status}
    </span>
  );
};


const ServiceCenterDashboard: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const containerAnimation = shouldReduceMotion ? { opacity: 1 } : containerVariants;
  const headerIconAnimation = shouldReduceMotion ? { opacity: 1, scale: 1 } : headerIconVariants;

  return (
    <PageTransition>
      <motion.div
        className="max-w-6xl mx-auto px-6 py-6 text-white"
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        exit="exit" // Added exit for PageTransition
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

        {/* Subtitle matching consumer dashboard style */}
        <motion.p
          variants={shouldReduceMotion ? { opacity: 1 } : cardVariants} // Using cardVariants for subtitle entry
          initial="hidden"
          animate="show"
          className="text-lg text-foreground/70 mb-8"
        >
          Here’s an overview of active jobs, communications, and reports.
        </motion.p>

        {/* Row of three StatCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Active Jobs"
            value={ACTIVE_JOBS_COUNT}
            subtitle="jobs currently in progress"
            ctaText="View Jobs"
            onCtaClick={() => navigate('/active-jobs')}
            icon={ClipboardList}
            delay={0.2}
          />
          <StatCard
            title="Unread Messages"
            value={UNREAD_MESSAGES_COUNT}
            subtitle="unread customer messages"
            ctaText="Open Inbox"
            onCtaClick={() => navigate('/customer-communication')}
            icon={MessageSquare}
            delay={0.3}
          />
          <StatCard
            title="Unfiled Reports"
            value={UNFILED_REPORTS_COUNT}
            subtitle="reports pending filing"
            ctaText="View Reports"
            onCtaClick={() => navigate('/service-reports')}
            icon={FileText}
            delay={0.4}
          />
        </div>

        {/* Second row of two ListCards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ListCard
            title="Active Jobs (Preview)"
            ctaText="View All Active Jobs"
            onCtaClick={() => navigate('/active-jobs')}
            icon={ClipboardList}
            delay={0.5}
          >
            <ul className="space-y-3">
              {activeJobsData.slice(0, 5).map((job, index) => (
                <li key={job.id} className={cn("flex items-center justify-between py-2", index < activeJobsData.slice(0, 5).length - 1 && "border-b border-foreground/5")}>
                  <div>
                    <p className="text-foreground/90 font-medium">{job.product} - {job.customer}</p>
                    <p className="text-foreground/70 text-sm">ETA: {job.eta}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={job.status as any} /> {/* TODO: Refine status type */}
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Assign Job">
                      <Package className="h-4 w-4 text-muted-foreground" /> {/* Placeholder for Assign icon */}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Job Details">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </li>
              ))}
              {activeJobsData.length === 0 && <p className="text-foreground/70">No active jobs.</p>}
            </ul>
          </ListCard>

          <ListCard
            title="Communications (Preview)"
            ctaText="Open Full Inbox"
            onCtaClick={() => navigate('/customer-communication')}
            icon={MessageSquare}
            delay={0.6}
          >
            <ul className="space-y-3">
              {communicationsData.slice(0, 4).map((comm, index) => (
                <li key={comm.id} className={cn("flex items-center justify-between py-2", index < communicationsData.slice(0, 4).length - 1 && "border-b border-foreground/5")}>
                  <div className="flex items-center gap-2">
                    {comm.unread && <span className="w-2 h-2 bg-emerald-500 rounded-full" aria-hidden="true" />}
                    <div>
                      <p className="text-foreground/90 font-medium">{comm.customer}</p>
                      <p className="text-foreground/70 text-sm">{comm.snippet}</p>
                    </div>
                  </div>
                  <p className="text-foreground/70 text-sm">{comm.time}</p>
                </li>
              ))}
              {communicationsData.length === 0 && <p className="text-foreground/70">No recent communications.</p>}
            </ul>
          </ListCard>
        </div>

        {/* Bottom row: Action Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <ActionCard
            title="Create Service Report"
            ctaText="New Report"
            onCtaClick={() => navigate('/service-reports/new')}
            // TODO: Assuming a new report route for 'Create Service Report'
            delay={0.7}
          />
          <ActionCard
            title="Quick Assign"
            ctaText="Open Service Queue"
            onCtaClick={() => navigate('/service-queue')}
            delay={0.8}
          />
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default ServiceCenterDashboard;