import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Users, Shield, Package, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import { containerVariants, cardVariants, cardHoverVariants, headerIconVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

const About = () => {
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">About Us</h1>
        </div>

        {/* Subtitle matching consumer dashboard style */}
        <motion.p
          variants={shouldReduceMotion ? { opacity: 1 } : cardVariants} // Using cardVariants for subtitle entry
          initial="hidden"
          animate="show"
          className="text-lg text-foreground/70 mb-8"
        >
          Learn more about our mission, vision, and the values that drive us.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Our Mission Card */}
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
                <CardTitle className="text-xl font-semibold text-foreground/90">Our Mission</CardTitle>
                <CardDescription className="text-foreground/70">What we strive to achieve.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow">
                <p className="text-base leading-relaxed text-foreground/80">
                  To empower product owners and creators with a centralized, intelligent platform that simplifies service management, enhances product value, and fosters lasting relationships built on trust and exceptional care.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Vision Card */}
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
                <CardTitle className="text-xl font-semibold text-foreground/90">Our Vision</CardTitle>
                <CardDescription className="text-foreground/70">Where we see ourselves in the future.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow">
                <p className="text-base leading-relaxed text-foreground/80">
                  To be the leading platform for product lifecycle management, recognized for innovation, reliability, and unparalleled customer satisfaction, creating a seamless ecosystem for product care globally.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Values Card */}
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
                <CardTitle className="text-xl font-semibold text-foreground/90">Our Values</CardTitle>
                <CardDescription className="text-foreground/70">Principles that guide our actions.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow">
                <ul className="list-disc list-inside space-y-2 text-base leading-relaxed text-foreground/80">
                  <li>Customer Centricity: Always putting our users first.</li>
                  <li>Innovation: Continuously seeking better solutions.</li>
                  <li>Integrity: Operating with honesty and transparency.</li>
                  <li>Collaboration: Working together for shared success.</li>
                  <li>Excellence: Striving for the highest quality in everything we do.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Team Card (Placeholder) */}
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
                <CardTitle className="text-xl font-semibold text-foreground/90">Our Team</CardTitle>
                <CardDescription className="text-foreground/70">The people behind Pro-Techt.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow">
                <p className="text-base leading-relaxed text-foreground/80">
                  We are a passionate group of innovators, engineers, and customer service enthusiasts dedicated to revolutionizing product care. Our diverse backgrounds and shared commitment drive us to build a platform that truly makes a difference.
                </p>
                {/* TODO: Add team member profiles or a link to a dedicated team page */}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default About;