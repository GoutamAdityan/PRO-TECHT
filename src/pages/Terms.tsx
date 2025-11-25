import { motion } from 'framer-motion';
import { FileText, Shield, AlertTriangle, HelpCircle, Scale } from 'lucide-react';
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

const TermsOfService = () => {
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
            <FileText className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-emerald-200 to-emerald-400">
            Terms of Service
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
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By using our application, you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the application. These terms constitute a legally binding agreement between you and Pro-Techt regarding your use of the platform.
              </p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1} className="border-border">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-1">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Changes to Terms or Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may modify the Terms at any time, in our sole discretion. If we do so, we’ll let you know either by posting the modified Terms on the Site or through other communications. It’s important that you review the Terms whenever we modify them because if you continue to use the Services after we have posted modified Terms on the Site, you are indicating to us that you agree to be bound by the modified Terms.
              </p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2} className="border-border">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. General Prohibitions</h2>
              <p className="text-muted-foreground mb-4">
                You agree not to do any of the following:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></span>
                  <span>Post, upload, publish, submit or transmit any Content that infringes, misappropriates or violates a third party’s patent, copyright, trademark, trade secret, moral rights or other intellectual property rights.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></span>
                  <span>Violate, or encourage any conduct that would violate, any applicable law or regulation or would give rise to civil liability.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></span>
                  <span>Use, display, mirror or frame the Services or any individual element within the Services without Pro-Techt’s express written consent.</span>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="border-border">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 mt-1">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-card p-4 rounded-xl border border-border inline-block">
                <p className="text-emerald-400 font-medium">terms@pro-techt.com</p>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </motion.div>
  );
};

export default TermsOfService;
