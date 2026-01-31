import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, Mail, Lock, ArrowRight, CheckCircle, Zap, Home, Wrench, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/auth.css';
import CyberBackground from '@/components/ui/CyberBackground';
import TextReveal from '@/components/ui/TextReveal';

const Auth = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupRole, setSignupRole] = useState("consumer");
  const [signupStep, setSignupStep] = useState(1);

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

    // Collect additional data for Service Centers
    let additionalData = {};
    if (signupRole === 'service_center') {
      additionalData = {
        centerName: formData.get('center-name'),
        registrationNo: formData.get('registration-no'),
        mobileNumber: formData.get('mobile-number'),
        supportPhone: formData.get('support-phone'),
        streetAddress: formData.get('street-address'),
        city: formData.get('city'),
        zipCode: formData.get('zip-code'),
        officialEmail: formData.get('signup-email'), // reused
      };
    }

    // Use the state value instead of getting from formData
    const { error } = await signUp(email, password, fullName, signupRole, additionalData);
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

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 rounded-xl border-border hover:bg-muted"
                        onClick={() => signInWithGoogle()}
                        disabled={isSubmitting}
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6">
                    <AnimatePresence mode="wait">
                      {signupStep === 1 ? (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-foreground">Choose your Account Type</h3>
                            <p className="text-sm text-muted-foreground">Select how you want to use Pro-Techt</p>
                          </div>

                          <div className="grid gap-4">
                            <div
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50 flex items-center gap-4 ${signupRole === 'consumer' ? 'border-primary bg-primary/5' : 'border-border'}`}
                              onClick={() => { setSignupRole('consumer'); setSignupStep(2); }}
                            >
                              <div className={`p-3 rounded-full ${signupRole === 'consumer' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <Users className="w-6 h-6" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-foreground">Consumer</h4>
                                <p className="text-xs text-muted-foreground">Manage personal devices & warranties</p>
                              </div>
                              <ArrowRight className={`w-5 h-5 ml-auto ${signupRole === 'consumer' ? 'text-primary' : 'text-muted-foreground/50'}`} />
                            </div>

                            <div
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50 flex items-center gap-4 ${signupRole === 'business_partner' ? 'border-primary bg-primary/5' : 'border-border'}`}
                              onClick={() => { setSignupRole('business_partner'); setSignupStep(2); }}
                            >
                              <div className={`p-3 rounded-full ${signupRole === 'business_partner' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <Shield className="w-6 h-6" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-foreground">Business Partner</h4>
                                <p className="text-xs text-muted-foreground">Retailers & Insurance Providers</p>
                              </div>
                              <ArrowRight className={`w-5 h-5 ml-auto ${signupRole === 'business_partner' ? 'text-primary' : 'text-muted-foreground/50'}`} />
                            </div>

                            <div
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50 flex items-center gap-4 ${signupRole === 'service_center' ? 'border-primary bg-primary/5' : 'border-border'}`}
                              onClick={() => { setSignupRole('service_center'); setSignupStep(2); }}
                            >
                              <div className={`p-3 rounded-full ${signupRole === 'service_center' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <Wrench className="w-6 h-6" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-foreground">Service Center</h4>
                                <p className="text-xs text-muted-foreground">Manage repairs & service requests</p>
                              </div>
                              <ArrowRight className={`w-5 h-5 ml-auto ${signupRole === 'service_center' ? 'text-primary' : 'text-muted-foreground/50'}`} />
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                        >
                          <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-foreground">Complete your Profile</h3>
                            <p className="text-sm text-muted-foreground">Signing up as <span className="text-primary font-medium capitalize">{signupRole.replace('_', ' ')}</span></p>
                          </div>

                          <form onSubmit={handleSignUp} className="space-y-4">
                            {signupRole === 'service_center' ? (
                              <>
                                {/* Business Identity Section */}
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-emerald-400 font-semibold border-b border-white/10 pb-2">
                                    <Home className="w-4 h-4" /> BUSINESS IDENTITY
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="center-name" className="text-muted-foreground">Center Name *</Label>
                                      <Input id="center-name" name="center-name" placeholder="Quick Fix Repairs" className="bg-background border-border" required disabled={isSubmitting} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="registration-no" className="text-muted-foreground">Registration No. (CIN/GST) *</Label>
                                      <Input id="registration-no" name="registration-no" placeholder="GSTIN12345" className="bg-background border-border" required disabled={isSubmitting} />
                                    </div>
                                  </div>
                                </div>

                                {/* Owner / Proprietor Section */}
                                <div className="space-y-4 pt-2">
                                  <div className="flex items-center gap-2 text-emerald-400 font-semibold border-b border-white/10 pb-2">
                                    <Users className="w-4 h-4" /> OWNER / PROPRIETOR
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="signup-fullname" className="text-muted-foreground">Full Name *</Label>
                                      <Input id="signup-fullname" name="signup-fullname" placeholder="John Smith" className="bg-background border-border" required disabled={isSubmitting} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="mobile-number" className="text-muted-foreground">Mobile Number *</Label>
                                      <Input id="mobile-number" name="mobile-number" placeholder="+91 98765 43210" className="bg-background border-border" required disabled={isSubmitting} />
                                    </div>
                                  </div>
                                </div>

                                {/* Contact & Location Section */}
                                <div className="space-y-4 pt-2">
                                  <div className="flex items-center gap-2 text-emerald-400 font-semibold border-b border-white/10 pb-2">
                                    <Zap className="w-4 h-4" /> CONTACT & LOCATION
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="signup-email" className="text-muted-foreground">Official Email *</Label>
                                      <Input id="signup-email" name="signup-email" type="email" placeholder="support@quickfix.com" className="bg-background border-border" required disabled={isSubmitting} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="support-phone" className="text-muted-foreground">Support Phone</Label>
                                      <Input id="support-phone" name="support-phone" placeholder="044-12345678" className="bg-background border-border" disabled={isSubmitting} />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="street-address" className="text-muted-foreground">Street Address *</Label>
                                    <Input id="street-address" name="street-address" placeholder="123 Main St, Tech Park" className="bg-background border-border" required disabled={isSubmitting} />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="city" className="text-muted-foreground">City *</Label>
                                      <Input id="city" name="city" placeholder="Chennai" className="bg-background border-border" required disabled={isSubmitting} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="zip-code" className="text-muted-foreground">Zip Code *</Label>
                                      <Input id="zip-code" name="zip-code" placeholder="600001" className="bg-background border-border" required disabled={isSubmitting} />
                                    </div>
                                  </div>
                                </div>

                                {/* Credentials Section */}
                                <div className="space-y-4 pt-2">
                                  <div className="flex items-center gap-2 text-emerald-400 font-semibold border-b border-white/10 pb-2">
                                    <Lock className="w-4 h-4" /> CREDENTIALS
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-muted-foreground">Password *</Label>
                                    <Input id="signup-password" name="signup-password" type="password" placeholder="••••••••" className="bg-background border-border" required disabled={isSubmitting} minLength={6} />
                                  </div>
                                </div>
                              </>
                            ) : (
                              // ORIGINAL SIMPLE FORM for Consumer / Business Partner
                              <>
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
                              </>
                            )}

                            <div className="flex gap-3 pt-2">
                              <Button type="button" variant="outline" onClick={() => setSignupStep(1)} className="w-1/3 border-border hover:bg-muted" disabled={isSubmitting}>
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                              </Button>
                              <Button type="submit" className="w-2/3 btn-neon h-11 rounded-xl text-base" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating Account...' : 'Create Account'} <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>

                            {signupRole === 'consumer' && (
                              <>
                                <div className="relative my-4">
                                  <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border"></span>
                                  </div>
                                  <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                                  </div>
                                </div>

                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full h-11 rounded-xl border-border hover:bg-muted"
                                  onClick={() => signInWithGoogle()}
                                  disabled={isSubmitting}
                                >
                                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                  </svg>
                                  Google
                                </Button>
                              </>
                            )}
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
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