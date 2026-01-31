import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'consumer' | 'business_partner' | 'service_center';
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string, role?: string, additionalData?: any) => Promise<{ user: any; session: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  updateEmail: (newEmail: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer profile fetching to avoid auth state callback issues
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(async () => {
          await fetchUserProfile(session.user.id);
        }, 0);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile({
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          role: (data as any).role || 'consumer',
          avatar_url: data.avatar_url
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string, role?: string, additionalData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || '',
            role: role || 'consumer'
          }
        }
      });

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive"
        });
        return { user: null, session: null, error };
      } else {
        // If role is service_center, manually create Company and Service Center
        if (role === 'service_center' && authData.user) {
          try {
            // 1. Create Company
            // Use Center Name if provided, otherwise fallback to user's name + "Company"
            const companyName = additionalData?.centerName || `${fullName || 'My'} Company`;

            const { data: company, error: companyError } = await supabase
              .from('companies')
              .insert({
                owner_id: authData.user.id,
                name: companyName,
                // Store generic registration number if we had a column, or just metadata if needed
                // For now, schema typically just has 'name' and 'owner_id' as core
              })
              .select()
              .single();

            if (companyError) throw companyError;

            // 2. Create Service Center
            if (company) {
              // Construct address from parts
              const addressParts = [
                additionalData?.streetAddress,
                additionalData?.city,
                additionalData?.zipCode
              ].filter(Boolean);

              const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Default Address';

              const { error: scError } = await supabase
                .from('service_centers')
                .insert({
                  company_id: company.id,
                  name: additionalData?.centerName || `${fullName || 'My'} Service Center`,
                  address: fullAddress,
                  phone: additionalData?.supportPhone || additionalData?.mobileNumber || '',
                  email: additionalData?.officialEmail || email,
                  is_active: true
                });

              if (scError) throw scError;
            }
          } catch (provisionError: any) {
            console.error("Error provisioning service center:", provisionError);
            toast({
              title: "Setup incomplete",
              description: "Account created but failed to set up Service Center details. Please contact support.",
              variant: "destructive"
            });
          }
        }

        toast({
          title: "Account created",
          description: "Your account has been created successfully."
        });
      }

      return { user: authData.user, session: authData.session, error: null };
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive"
      });
      return { user: null, session: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Google Sign In failed",
          description: error.message
        });
      }
      return { error };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign In failed",
        description: error.message
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
      window.location.href = '/';
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: error.message
        });
      } else {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully."
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message
      });
      return { error };
    }
  };

  const updateEmail = async (newEmail: string) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });

      if (error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: error.message
        });
      } else {
        toast({
          title: "Email update requested",
          description: "Please check your new email address to confirm the change."
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message
      });
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: error.message
        });
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully."
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    updateEmail,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};