import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Server, Bell } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';

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

const PrivacyPolicy = () => {
  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-border p-8 md:p-12 mb-12 text-center">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-glow"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-emerald-200 to-emerald-400">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: October 14, 2025
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <AnimatedCard className="border-border">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-1">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Pro-Techt ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1} className="border-border">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-1">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We may collect information about you in a variety of ways. The information we may collect via the Application includes:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                  <span><strong className="text-foreground">Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Application.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                  <span><strong className="text-foreground">Product Information:</strong> Information about your products, including purchase date, warranty details, and service history, that you provide to us.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                  <span><strong className="text-foreground">Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, browser type, operating system, access times, and pages viewed.</span>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2} className="border-border">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-1">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Use of Your Information</h2>
              <p className="text-muted-foreground mb-4">
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
                {[
                  "Create and manage your account",
                  "Email you regarding your account or order",
                  "Notify you of updates to your warranties",
                  "Monitor and analyze usage and trends",
                  "Prevent fraudulent transactions",
                  "Request feedback and contact you"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="border-border">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 mt-1">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Security of Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.4} className="border-border">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 mt-1">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-card p-4 rounded-xl border border-border inline-block">
                <p className="text-foreground font-semibold">Pro-Techt Inc.</p>
                <p className="text-muted-foreground">123 Tech Street</p>
                <p className="text-muted-foreground">San Francisco, CA 94105</p>
                <p className="text-emerald-400 mt-2">privacy@pro-techt.com</p>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
