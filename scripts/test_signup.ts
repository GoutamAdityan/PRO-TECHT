
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nnhdsugvixutbgtngflv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uaGRzdWd2aXh1dGJndG5nZmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDIxMDksImV4cCI6MjA3Mzg3ODEwOX0._43p5IMULpJVbvHE33E2GlwMYjD-FpdTtNJd2mo3ZP0";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testSignup() {
    const email = `test_sc_${Date.now()}@example.com`;
    const password = "password123";
    const role = "service_center";

    console.log(`Attempting signup for ${email} with role ${role}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: "Test Service Center",
                role: role
            }
        }
    });

    if (error) {
        console.error("Signup error:", error);
        return;
    }

    const userId = data.user?.id;
    console.log("Signup successful. User ID:", userId);

    if (!userId) {
        console.error("No user ID returned!");
        return;
    }

    // Check profile
    // Note: We might not be able to read the profile immediately if we are not logged in as that user, 
    // but RLS "Users can view their own profile" might prevent anonymous read.
    // EXCEPT: we are technically logged in as the new user in the 'supabase' client instance?
    // Actually, 'signUp' usually returns a session if email confirmation is disabled.
    // If email confirmation is enabled, we won't have a session.

    if (data.session) {
        console.log("Session active. Checking profile...");
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError) {
            console.error("Error fetching profile:", profileError);
        } else {
            console.log("Profile created:", profile);
            if (profile.role === 'service_center') {
                console.log("SUCCESS: Role is service_center");
            } else {
                console.error(`FAILURE: Role is ${profile.role}, expected service_center`);
            }
        }
    } else {
        console.log("No session returned (confirm email might be on). Cannot check profile immediately as user.");
        // Try checking via public query (if possible - usually not due to RLS)
        // But since I'm debugging, let's just output this state.
    }
}

testSignup();
