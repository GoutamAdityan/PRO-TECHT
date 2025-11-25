import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const Contact = () => {
  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-border p-8 md:p-16 mb-12 text-center">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Mail className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-emerald-200 to-emerald-400">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Have questions or need assistance? We're here to help you get the most out of Pro-Techt.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <AnimatedCard className="border-border hover:border-emerald-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Our Office</h3>
                <p className="text-muted-foreground leading-relaxed">
                  123 Tech Street<br />
                  Innovation District<br />
                  San Francisco, CA 94105
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.1} className="border-border hover:border-blue-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-2">General Inquiries:</p>
                <a href="mailto:hello@pro-techt.com" className="text-blue-400 hover:text-blue-300 transition-colors block mb-4">hello@pro-techt.com</a>
                <p className="text-muted-foreground mb-2">Support:</p>
                <a href="mailto:support@pro-techt.com" className="text-blue-400 hover:text-blue-300 transition-colors block">support@pro-techt.com</a>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="border-border hover:border-purple-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-2">Mon-Fri from 8am to 5pm PST.</p>
                <a href="tel:+15551234567" className="text-purple-400 hover:text-purple-300 transition-colors text-lg font-semibold">+1 (555) 123-4567</a>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Contact Form */}
        <AnimatedCard delay={0.3} className="border-border bg-card backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-foreground">Send a Message</h2>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
                <Input id="name" placeholder="Your name" className="bg-card border-border focus:border-emerald-500/50" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
                <Input id="email" type="email" placeholder="your@email.com" className="bg-card border-border focus:border-emerald-500/50" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">Subject</label>
              <Input id="subject" placeholder="How can we help?" className="bg-card border-border focus:border-emerald-500/50" />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
              <Textarea id="message" placeholder="Tell us more about your inquiry..." className="min-h-[150px] bg-card border-border focus:border-emerald-500/50" />
            </div>

            <Button className="w-full btn-neon rounded-full py-6 text-lg mt-4">
              <Send className="w-5 h-5 mr-2" /> Send Message
            </Button>
          </form>
        </AnimatedCard>
      </div>
    </motion.div>
  );
};

export default Contact;
