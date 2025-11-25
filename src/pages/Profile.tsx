import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mail, Lock, Save, Users, Shield, User } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';

const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().optional(),
});

const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const passwordFormSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type EmailFormValues = z.infer<typeof emailFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const Profile = () => {
  const { user, profile, updateProfile, updateEmail, updatePassword } = useAuth();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    },
    values: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    },
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: user?.email || "",
    },
    values: {
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
    if (user) {
      emailForm.reset({
        email: user.email || "",
      });
    }
  }, [profile, user]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    await updateProfile(data);
  };

  const onEmailSubmit = async (data: EmailFormValues) => {
    await updateEmail(data.email);
    setIsEmailDialogOpen(false);
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    await updatePassword(data.password);
    setIsPasswordDialogOpen(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your personal information and security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-2">
          <AnimatedCard className="h-full border-border hover:border-emerald-500/30 transition-colors">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Avatar className="h-32 w-32 border-2 border-emerald-500/30 shadow-2xl relative z-10">
                    <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name || user?.email}`} alt={profile.full_name || "User"} />
                    <AvatarFallback className="text-4xl bg-emerald-900 text-emerald-100">{(profile.full_name || "U").charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="icon" className="absolute bottom-0 right-0 bg-background/80 text-foreground rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300 border border-border hover:bg-emerald-600 z-20">
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground">{profile.full_name || 'User'}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                  <User className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-foreground">Personal Details</h3>
                </div>

                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} className="bg-background border-border focus:border-emerald-500/50 h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} className="bg-background border-border focus:border-emerald-500/50 h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-2">
                      <Button type="submit" className="btn-neon rounded-full px-8">
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Right Column: Security Settings */}
        <div>
          <AnimatedCard delay={0.2} className="h-full border-border hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-foreground">Security</h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Email Address</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 pl-8">
                  Update the email address associated with your account.
                </p>
                <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full btn-subtle justify-start pl-8">
                      Change Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-panel border-border">
                    <DialogHeader>
                      <DialogTitle>Change Email Address</DialogTitle>
                      <DialogDescription>Enter your new email address. A verification link will be sent.</DialogDescription>
                    </DialogHeader>
                    <Form {...emailForm}>
                      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Your new email" {...field} className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="ghost" onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
                          <Button type="submit" className="btn-neon">Update Email</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Password</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 pl-8">
                  Ensure your account is secure by using a strong password.
                </p>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full btn-subtle justify-start pl-8">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-panel border-border">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>Enter your new password. You will be logged out after changing.</DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="New password" {...field} className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm password" {...field} className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="ghost" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
                          <Button type="submit" className="btn-neon">Change Password</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
