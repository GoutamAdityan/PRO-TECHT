import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, Mail, Lock, ArrowRight, CheckCircle, Zap, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/auth.css';
import CyberBackground from '@/components/ui/CyberBackground';
import TextReveal from '@/components/ui/TextReveal';

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('signin-email') as string;
    const password = formData.get('signin-password') as string;
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('signup-email') as string;
    const password = formData.get('signup-password') as string;
    const fullName = formData.get('signup-fullname') as string;
    const role = formData.get('signup-role') as string;
    const { error } = await signUp(email, password, fullName, role);
    if (error) {
      setError(error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden relative">
      <CyberBackground />

      <Link to="/" className="absolute top-4 right-4 z-50">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
          <Home className="w-4 h-4" />
          Home
        </Button>
      </Link>

      {/* Left Side - Animated Visuals */}
      <motion.div
        className="hidden lg:flex w-1/2 relative items-center justify-center p-12 overflow-hidden z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-md">
              <Shield className="h-4 w-4" />
              <span>Secure & Reliable</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight text-foreground drop-shadow-xl">
              Manage your devices with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300"><TextReveal text="confidence." delay={1} /></span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join thousands of users who trust Pro-Techt for their warranty and service needs.
            </p>

            <div className="space-y-6">
              {[
                "Bank-grade encryption for your data",
                "24/7 automated warranty tracking",
                "Verified service partner network"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm hover:bg-card/70 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shadow-[0_0_10px_rgba(0,204,102,0.3)]">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20">
                <Zap className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to access your account</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="signin" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-medium transition-all">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-medium transition-all">Sign Up</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="signin" className="space-y-6">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-muted-foreground">Email</Label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input id="signin-email" name="signin-email" type="email" placeholder="name@example.com" className="pl-10 bg-background border-border focus:border-primary/50 focus:ring-primary/20 transition-all" required disabled={isSubmitting} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-muted-foreground">Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input id="signin-password" name="signin-password" type="password" placeholder="••••••••" className="pl-10 bg-background border-border focus:border-primary/50 focus:ring-primary/20 transition-all" required disabled={isSubmitting} />
                        </div>
                      </div>
                      <Button type="submit" className="w-full btn-neon h-11 rounded-xl text-base" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing In...' : 'Sign In'} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-fullname" className="text-muted-foreground">Full Name</Label>
                        <div className="relative group">
                          <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input id="signup-fullname" name="signup-fullname" placeholder="John Doe" className="pl-10 bg-background border-border focus:border-primary/50 focus:ring-primary/20 transition-all" required disabled={isSubmitting} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-muted-foreground">Email</Label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input id="signup-email" name="signup-email" type="email" placeholder="name@example.com" className="pl-10 bg-background border-border focus:border-primary/50 focus:ring-primary/20 transition-all" required disabled={isSubmitting} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-muted-foreground">Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input id="signup-password" name="signup-password" type="password" placeholder="••••••••" className="pl-10 bg-background border-border focus:border-primary/50 focus:ring-primary/20 transition-all" required disabled={isSubmitting} minLength={6} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-role" className="text-muted-foreground">I am a...</Label>
                        <Select name="signup-role" defaultValue="consumer" disabled={isSubmitting}>
                          <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary/20">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border text-popover-foreground">
                            <SelectItem value="consumer">Consumer</SelectItem>
                            <SelectItem value="business_partner">Business Partner</SelectItem>
                            <SelectItem value="service_center">Service Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full btn-neon h-11 rounded-xl text-base" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Account...' : 'Create Account'} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;