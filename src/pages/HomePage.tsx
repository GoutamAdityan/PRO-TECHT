import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Bell, Wrench, CheckCircle, Zap, Lock, Globe } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import CyberBackground from '@/components/ui/CyberBackground';
import TextReveal from '@/components/ui/TextReveal';
import TiltCard from '@/components/ui/TiltCard';
import MagneticButton from '@/components/ui/MagneticButton';
import CustomCursor from '@/components/ui/CustomCursor';
import ExplainerVideoModal from '@/components/ExplainerVideoModal';
import BinaryMorseLoader from '@/components/ui/BinaryMorseLoader';
import { useState } from 'react';

const HomePage = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <>
      {/* Binary/Morse Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <BinaryMorseLoader
            onComplete={() => setIsLoading(false)}
            duration={4000}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen bg-background text-foreground overflow-hidden relative cursor-none">
        <CustomCursor />
        <CyberBackground />
        <NavBar />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md text-sm font-medium text-primary shadow-[0_0_15px_rgba(0,204,102,0.3)]"
              >
                <Zap className="w-4 h-4" />
                <span>The Future of Warranty Management</span>
              </motion.div>

              <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
                <span className="block text-foreground drop-shadow-2xl">Protect What</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-300 to-primary bg-[length:200%_auto] animate-gradient">
                  <TextReveal text="Matters Most" delay={0.5} />
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md">
                Your centralized hub for warranties, service requests, and device protection.
                Simple, smart, and secure.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div onClick={() => setIsVideoOpen(true)}>
                  <MagneticButton strength={0.3}>
                    <Button size="lg" className="btn-neon text-lg px-10 py-7 rounded-full group relative overflow-hidden">
                      <span className="relative z-10 flex items-center">
                        Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                  </MagneticButton>
                </div>

              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground flex flex-col items-center gap-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Why Choose <span className="text-primary">Pro-Techt?</span></h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We've reimagined how you manage your devices with features designed for peace of mind.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  icon: <Shield className="h-12 w-12 text-primary" />,
                  title: "Centralized Tracking",
                  desc: "One secure location for all your warranties and receipts. Never lose a document again."
                },
                {
                  icon: <Bell className="h-12 w-12 text-emerald-400" />,
                  title: "Smart Reminders",
                  desc: "Automated notifications before your coverage expires. Stay ahead of the curve."
                },
                {
                  icon: <Wrench className="h-12 w-12 text-primary" />,
                  title: "Effortless Service",
                  desc: "One-click service requests with verified partners. Repair made simple."
                }
              ].map((feature, idx) => (
                <TiltCard key={idx} className="h-full">
                  <div className="h-full p-8 rounded-3xl bg-card/50 border border-border/50 backdrop-blur-md hover:bg-card/80 transition-colors group">
                    <div className="mb-6 p-4 bg-primary/10 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 border border-primary/20 shadow-[0_0_15px_rgba(0,204,102,0.2)]">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* Immersive Stats Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 skew-y-3 transform origin-top-left scale-110" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
                  Simple as <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">1, 2, 3</span>
                </h2>
                <div className="space-y-12">
                  {[
                    { title: "Upload", desc: "Scan your receipt or enter details manually." },
                    { title: "Track", desc: "Get notified before your warranty expires." },
                    { title: "Resolve", desc: "Book repairs instantly with verified centers." }
                  ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className="flex items-start gap-6 group"
                    >
                      <div className="h-12 w-12 rounded-full bg-card/50 border border-border/50 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-black transition-colors shadow-[0_0_15px_rgba(0,204,102,0.1)]">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                        <p className="text-muted-foreground">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="relative h-[500px] w-full">
                <motion.div
                  style={{ y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-full max-w-md aspect-square">
                    {/* Abstract 3D Representation */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse-glow" />
                    <motion.div
                      style={{ rotate }}
                      className="absolute inset-10 bg-card/40 backdrop-blur-xl rounded-full border border-border/10 flex items-center justify-center p-8"
                    >
                      <div className="text-center transform -rotate-0">
                        <CheckCircle className="w-24 h-24 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,204,102,0.8)]" />
                      </div>
                    </motion.div>

                    {/* Floating Elements */}
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-10 -right-10 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl"
                    >
                      <Lock className="w-8 h-8 text-emerald-400" />
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, 20, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute -bottom-5 -left-5 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl"
                    >
                      <Globe className="w-8 h-8 text-blue-400" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div >
        </section >

        <ExplainerVideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
