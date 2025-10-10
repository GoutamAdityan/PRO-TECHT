import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Package, Users, Wrench, ListChecks, Boxes, BarChart3, LifeBuoy, Rocket, Zap, MessageSquare, FileText, Clock, CheckCircle } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { motion } from 'framer-motion';

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'business_partner':
        return <Shield className="w-8 h-8 text-primary-foreground" />;
      case 'service_center':
        return <Wrench className="w-8 h-8 text-primary-foreground" />;
      default:
        return <Users className="w-8 h-8 text-primary-foreground" />;
    }
  };

  const getRoleTitle = (role?: string) => {
    switch (role) {
      case 'business_partner':
        return 'Business Partner Dashboard';
      case 'service_center':
        return 'Service Center Portal';
      default:
        return 'Consumer Dashboard';
    }
  };

  const getRoleDescription = (role?: string) => {
    switch (role) {
      case 'business_partner':
        return 'Manage your products, service network, and customer support operations.';
      case 'service_center':
        return 'View assigned service requests and manage repair operations.';
      default:
        return 'Track your products, warranties, and service requests.';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 text-center bg-gradient-to-br from-primary/10 via-background to-background rounded-b-3xl shadow-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"
        ></motion.div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-primary rounded-full shadow-lg"
          >
            {getRoleIcon(profile?.role)}
          </motion.div>
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-5xl md:text-6xl font-heading font-bold text-foreground tracking-tight mb-4"
          >
            {getRoleTitle(profile?.role)}
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            {getRoleDescription(profile?.role)}
          </motion.p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* StatCards */}
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" variants={containerVariants}>
          <StatCard
            title="Active Jobs"
            value="12"
            description="+2 since last week"
            icon={<Wrench className="h-5 w-5 text-muted-foreground" />}
            variants={itemVariants}
          />
          <StatCard
            title="Pending Reports"
            value="5"
            description="-1 since yesterday"
            icon={<FileText className="h-5 w-5 text-muted-foreground" />}
            variants={itemVariants}
          />
          <StatCard
            title="Avg. Turnaround"
            value="2.3 days"
            description="Target: 2 days"
            icon={<Clock className="h-5 w-5 text-muted-foreground" />}
            variants={itemVariants}
          />
          <StatCard
            title="SLA Compliance"
            value="98%"
            description="On track"
            icon={<CheckCircle className="h-5 w-5 text-muted-foreground" />}
            variants={itemVariants}
          />
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Create Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Generate a new service report for a completed job.</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" /> Open Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Start a new conversation with a customer or team member.</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" /> Mark Job Complete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Finalize a service job and update its status.</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Activity Feed (Placeholder) */}
        <motion.div variants={containerVariants}>
          <motion.h2 variants={itemVariants} className="text-2xl font-heading font-semibold mb-6">Recent Activity</motion.h2>
          <motion.div className="space-y-4" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="https://i.pravatar.cc/150?img=4" alt="Agent Name" />
                      <AvatarFallback>AN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Agent Sarah</p>
                      <p className="text-sm text-muted-foreground">Completed Job #1234</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Replaced faulty component in Smart Coffee Maker X1.</p>
                  <Button variant="ghost" size="sm" className="mt-2">View Details</Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="Customer Name" />
                      <AvatarFallback>CJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Customer John</p>
                      <p className="text-sm text-muted-foreground">New Service Request</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Robotic Vacuum Cleaner Pro not charging.</p>
                  <Button variant="ghost" size="sm" className="mt-2">Assign Agent</Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Index;