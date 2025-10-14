import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { motion, useReducedMotion } from 'framer-motion';
import { Camera, Mail, Lock, Save, Users } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { containerVariants, cardVariants, cardHoverVariants, headerIconVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

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
  const shouldReduceMotion = useReducedMotion();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    },
    values: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    }, // Ensure form updates when profile changes
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: user?.email || "",
    },
    values: {
      email: user?.email || "",
    }, // Ensure form updates when user email changes
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Update form values when profile data changes
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
    // TODO: Close dialog after successful update
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    await updatePassword(data.password);
    // TODO: Close dialog after successful update
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const containerAnimation = shouldReduceMotion ? { opacity: 1 } : containerVariants;
  const headerIconAnimation = shouldReduceMotion ? { opacity: 1, scale: 1 } : headerIconVariants;
  const cardAnimation = shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : cardVariants;

  return (
    <PageTransition>
      <motion.div
        className="max-w-6xl mx-auto px-6 py-6 text-white"
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        </div>

        {/* Subtitle matching consumer dashboard style */}
        <motion.p
          variants={shouldReduceMotion ? { opacity: 1 } : cardVariants} // Using cardVariants for subtitle entry
          initial="hidden"
          animate="show"
          className="text-lg text-foreground/70 mb-8"
        >
          Manage your personal information, email, and password.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Details Card */}
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
                <CardTitle className="text-xl font-semibold text-foreground/90">Your Profile</CardTitle>
                <CardDescription className="text-foreground/70">Manage your personal information and account settings.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 border-2 border-primary/50 shadow-lg">
                      <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name || user?.email}`} alt={profile.full_name || user?.email || "User"} />
                      <AvatarFallback className="text-4xl font-heading">{(profile.full_name || user?.email || "U").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" size="icon" className="absolute bottom-0 right-0 bg-background/80 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera className="h-5 w-5" />
                      <span className="sr-only">Change avatar</span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Click to change avatar</p>
                </div>

                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/90">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0" />
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
                          <FormLabel className="text-foreground/90">Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="mt-6 px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                                               hover:translate-y-[-2px] transition-all duration-200 ease-out
                                               shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]">
                      <Save className="h-4 w-4 mr-2" /> Update Profile
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings Card */}
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
                <CardTitle className="text-xl font-semibold text-foreground/90">Security Settings</CardTitle>
                <CardDescription className="text-foreground/70">Manage your email address and password.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0 flex-grow space-y-4">
                {/* Change Email Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                                       hover:translate-y-[-2px] transition-all duration-200 ease-out
                                       shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
                            aria-label="Change Email">
                      <Mail className="h-4 w-4 mr-2" /> Change Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6">
                    <DialogHeader>
                      <DialogTitle className="font-semibold text-foreground/90">Change Email Address</DialogTitle>
                      <DialogDescription className="text-foreground/70">Enter your new email address. A verification link will be sent.</DialogDescription>
                    </DialogHeader>
                    <Form {...emailForm}>
                      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/90">New Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Your new email" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="submit" className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                                                     hover:translate-y-[-2px] transition-all duration-200 ease-out
                                                     shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]">Confirm Change</Button>
                          <Button type="button" variant="outline" onClick={() => emailForm.reset()} className="px-6 py-2 rounded-full border-border/50 hover:bg-accent/10 hover:text-accent-foreground">Cancel</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                {/* Change Password Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                                       hover:translate-y-[-2px] transition-all duration-200 ease-out
                                       shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
                            aria-label="Change Password">
                      <Lock className="h-4 w-4 mr-2" /> Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6">
                    <DialogHeader>
                      <DialogTitle className="font-semibold text-foreground/90">Change Password</DialogTitle>
                      <DialogDescription className="text-foreground/70">Enter your new password. You will be logged out after changing.</DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/90">New Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="New password" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0" />
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
                              <FormLabel className="text-foreground/90">Confirm New Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm new password" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="submit" className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                                                     hover:translate-y-[-2px] transition-all duration-200 ease-out
                                                     shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]">Change Password</Button>
                          <Button type="button" variant="outline" onClick={() => passwordForm.reset()} className="px-6 py-2 rounded-full border-border/50 hover:bg-accent/10 hover:text-accent-foreground">Cancel</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default Profile;
