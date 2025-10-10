import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { Camera, Mail, Lock, Save } from 'lucide-react';

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

  const onProfileSubmit = async (data: ProfileFormValues) => {
    await updateProfile(data);
  };

  const onEmailSubmit = async (data: EmailFormValues) => {
    await updateEmail(data.email);
    // Close dialog after successful update
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    await updatePassword(data.password);
    // Close dialog after successful update
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8"
    >
      <h1 className="text-3xl font-bold font-heading">Profile Settings</h1>

      <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50">
        <CardHeader>
          <CardTitle className="font-heading">Your Profile</CardTitle>
          <CardDescription>Manage your personal information and account settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Avatar and Upload */}
            <div className="flex flex-col items-center gap-4">
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

            {/* Right: Profile Details Form */}
            <div className="md:col-span-2 space-y-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary" />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" /> Update Profile
                  </Button>
                </form>
              </Form>

              {/* Change Email Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start hover:bg-accent/10 hover:text-accent-foreground border-border/50">
                    <Mail className="h-4 w-4 mr-2" /> Change Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card/90 backdrop-blur-sm shadow-lg border border-border/50">
                  <DialogHeader>
                    <DialogTitle className="font-heading">Change Email Address</DialogTitle>
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
                              <Input placeholder="Your new email" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Confirm Change</Button>
                        <Button variant="outline" onClick={() => emailForm.reset()} className="hover:bg-accent/10 hover:text-accent-foreground border-border/50">Cancel</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Change Password Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start hover:bg-accent/10 hover:text-accent-foreground border-border/50">
                    <Lock className="h-4 w-4 mr-2" /> Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card/90 backdrop-blur-sm shadow-lg border border-border/50">
                  <DialogHeader>
                    <DialogTitle className="font-heading">Change Password</DialogTitle>
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
                              <Input type="password" placeholder="New password" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary" />
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
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm new password" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Change Password</Button>
                        <Button variant="outline" onClick={() => passwordForm.reset()} className="hover:bg-accent/10 hover:text-accent-foreground border-border/50">Cancel</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Profile;