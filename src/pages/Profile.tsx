import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    },
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: profile?.email || "",
    },
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
    setShowEmailForm(false);
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    await updatePassword(data.password);
    setShowPasswordForm(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">Details</h2>
          <p className="text-sm text-muted-foreground">Your personal information.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      </div>

      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
          <FormField
            control={profileForm.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
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
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update Profile</Button>
        </form>
      </Form>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">Change Email</h2>
        </div>
        {!showEmailForm ? (
          <Button onClick={() => setShowEmailForm(true)}>Change Email</Button>
        ) : (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-8">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your new email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit">Confirm Change</Button>
                <Button variant="outline" onClick={() => setShowEmailForm(false)}>Cancel</Button>
              </div>
            </form>
          </Form>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">Change Password</h2>
        </div>
        {!showPasswordForm ? (
          <Button onClick={() => setShowPasswordForm(true)}>Change Password</Button>
        ) : (
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-8">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="New password" {...field} />
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
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit">Change Password</Button>
                <Button variant="outline" onClick={() => setShowPasswordForm(false)}>Cancel</Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Profile;
