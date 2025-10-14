import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AIAdvisor from "@/components/custom/AIAdvisor";
import { motion, useReducedMotion } from 'framer-motion';
import { Users } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { containerVariants, cardVariants, cardHoverVariants, headerIconVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

// Dummy Data
const serviceRequestData = [
  { name: 'Jan', requests: 65, completed: 40 },
  { name: 'Feb', requests: 59, completed: 45 },
  { name: 'Mar', requests: 80, completed: 55 },
  { name: 'Apr', requests: 81, completed: 60 },
  { name: 'May', requests: 56, completed: 50 },
  { name: 'Jun', requests: 55, completed: 48 },
  { name: 'Jul', requests: 40, completed: 35 },
];

const statusData = [
  { name: 'Pending', value: 120 },
  { name: 'In Progress', value: 210 },
  { name: 'Completed', value: 105 },
];

const categoryData = [
  { name: 'Laptops', value: 150 },
  { name: 'Smartphones', value: 180 },
  { name: 'Headphones', value: 105 },
];

const COLORS = ['#FFBB28', '#0088FE', '#00C49F']; // Recharts default colors, can be customized

const Analytics = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerAnimation = shouldReduceMotion ? { opacity: 1 } : containerVariants;
  const headerIconAnimation = shouldReduceMotion ? { opacity: 1, scale: 1 } : headerIconVariants;
  const cardAnimation = shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : cardVariants;

  return (
    <PageTransition>
      <motion.div
        className="max-w-6xl mx-auto px-6 py-6 text-white relative overflow-hidden bg-gradient-to-br from-background/50 via-background to-background"
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            variants={headerIconAnimation}
            initial="hidden"
            animate="show"
            className="p-2 rounded-full bg-emerald-800/30 flex items-center justify-center"
          >
            <Users className="w-5 h-5 text-emerald-400" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
        </div>

        {/* Subtitle matching consumer dashboard style */}
        <motion.p
          variants={shouldReduceMotion ? { opacity: 1 } : cardVariants} // Using cardVariants for subtitle entry
          initial="hidden"
          animate="show"
          className="text-lg text-foreground/70 mb-8"
        >
          Gain insights into service requests, product performance, and customer satisfaction.
        </motion.p>

        {/* AI Advisor */}
        <motion.div
          variants={cardAnimation}
          initial="hidden"
          animate="show"
          exit="exit"
          whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
          className="rounded-2xl transition-all duration-300 ease-out
                     shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] mb-6"
        >
          <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
            <AIAdvisor />
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
            whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
            className="rounded-2xl transition-all duration-300 ease-out
                       shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
          >
            <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-xl font-semibold text-foreground/90">Total Requests</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow">
                <p className="text-4xl font-bold text-foreground">435</p>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
            whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
            className="rounded-2xl transition-all duration-300 ease-out
                       shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
          >
            <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-xl font-semibold text-foreground/90">Avg. Completion Time</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow">
                <p className="text-4xl font-bold text-foreground">3.2 Days</p>
                <p className="text-xs text-muted-foreground">-5% from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
            whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
            className="rounded-2xl transition-all duration-300 ease-out
                       shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
          >
            <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-xl font-semibold text-foreground/90">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow">
                <p className="text-4xl font-bold text-foreground">4.8/5</p>
                <p className="text-xs text-muted-foreground">Placeholder</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Chart Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-1 lg:grid-cols-2">
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
            whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
            className="rounded-2xl transition-all duration-300 ease-out
                       shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
          >
            <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-xl font-semibold text-foreground/90">Service Request Status</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="show"
            exit="exit"
            whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
            className="rounded-2xl transition-all duration-300 ease-out
                       shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
          >
            <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-xl font-semibold text-foreground/90">Requests by Category</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Service Request Trends Chart */}
        <motion.div
          variants={cardAnimation}
          initial="hidden"
          animate="show"
          exit="exit"
          whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
          className="rounded-2xl transition-all duration-300 ease-out
                     shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
        >
          <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xl font-semibold text-foreground/90">Service Request Trends</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 flex-grow">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceRequestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" fill="#8884d8" name="Total Requests" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default Analytics;