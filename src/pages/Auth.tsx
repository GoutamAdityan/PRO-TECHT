import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, Wrench, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/auth.css';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState<number | string>('auto');
  const [maxFormHeight, setMaxFormHeight] = useState<number | string>('auto');
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);

  // Effect to calculate and set max form height on mount and resize
  useEffect(() => {
    const calculateMaxHeight = () => {
      const signInHeight = signInRef.current?.offsetHeight || 0;
      const signUpHeight = signUpRef.current?.offsetHeight || 0;
      const newMaxHeight = Math.max(signInHeight, signUpHeight);
      if (newMaxHeight > 0) {
        setMaxFormHeight(newMaxHeight);
      }
    };

    calculateMaxHeight();
    window.addEventListener('resize', calculateMaxHeight);
    return () => window.removeEventListener('resize', calculateMaxHeight);
  }, []);

  // Effect to set current content height for animation
  useEffect(() => {
    const activeRef = activeTab === 'signin' ? signInRef : signUpRef;
    if (activeRef.current) {
      setContentHeight(activeRef.current.offsetHeight);
    }
  }, [activeTab, maxFormHeight]); // Depend on maxFormHeight to re-evaluate if forms grow

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
    <div className="auth-container pt-[10vh] items-start">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-block p-3 bg-accent/20 rounded-full mb-4"
          >
            <Shield className="w-8 h-8 text-accent" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white">Welcome to Pro-Techt</h1>
          <p className="text-gray-400 mt-2">Your calm place for product lifecycle management.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <TabsList className="relative grid w-full grid-cols-2 bg-white/5 p-1 rounded-lg">
              <TabsTrigger value="signin" className="tabs-trigger">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="tabs-trigger">Sign Up</TabsTrigger>
              {activeTab && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-accent/20 rounded-md -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </TabsList>
          </motion.div>

          <motion.div
            className="mt-6 relative"
            animate={{ height: contentHeight || 'auto' }}
            transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            style={{ minHeight: maxFormHeight }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="signin" ref={signInRef} className="glass-card p-8" tabIndex={-1} aria-hidden={activeTab !== 'signin'} style={{ display: activeTab === 'signin' ? 'block' : 'none' }}>
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input id="signin-email" name="signin-email" type="email" placeholder="Email" required disabled={isSubmitting} className="form-input pl-10" />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input id="signin-password" name="signin-password" type="password" placeholder="Password" required disabled={isSubmitting} className="form-input pl-10" />
                    </div>
                    <Button type="submit" className="submit-button" disabled={isSubmitting}>
                      {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="signup" ref={signUpRef} className="glass-card p-8" tabIndex={-1} aria-hidden={activeTab !== 'signup'} style={{ display: activeTab === 'signup' ? 'block' : 'none' }}>
                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input id="signup-fullname" name="signup-fullname" type="text" placeholder="Full Name" required disabled={isSubmitting} className="form-input pl-10" />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input id="signup-email" name="signup-email" type="email" placeholder="Email" required disabled={isSubmitting} className="form-input pl-10" />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input id="signup-password" name="signup-password" type="password" placeholder="Password (min. 6 characters)" required disabled={isSubmitting} minLength={6} className="form-input pl-10" />
                    </div>
                    <div className="relative">
                      <Label htmlFor="signup-role" className="sr-only">Account Type</Label>
                      <Select name="signup-role" defaultValue="consumer" disabled={isSubmitting}>
                        <SelectTrigger className="form-input">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consumer">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>Consumer</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="business_partner">
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4" />
                              <span>Business Partner</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="service_center">
                            <div className="flex items-center space-x-2">
                              <Wrench className="w-4 h-4" />
                              <span>Service Center</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="submit-button" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Tabs>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 text-center bg-red-500/20 text-red-400 p-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;