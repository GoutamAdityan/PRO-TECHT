
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nnhdsugvixutbgtngflv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uaGRzdWd2aXh1dGJndG5nZmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDIxMDksImV4cCI6MjA3Mzg3ODEwOX0._43p5IMULpJVbvHE33E2GlwMYjD-FpdTtNJd2mo3ZP0";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkData() {
    console.log("Checking Service Center Data...");

    // 1. Check Profiles with role 'service_center'
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'service_center');

    if (profileError) {
        console.error("Error fetching profiles:", profileError);
    } else {
        console.log(`\nFound ${profiles?.length || 0} profiles with role 'service_center':`);
        profiles?.forEach(p => console.log(` - ${p.full_name} (${p.email}) [ID: ${p.id}]`));
    }

    // 2. Check Service Centers
    const { data: centers, error: centerError } = await supabase
        .from('service_centers')
        .select('id, name, is_active, company_id');

    if (centerError) {
        console.error("Error fetching service centers:", centerError);
    } else {
        console.log(`\nFound ${centers?.length || 0} service centers:`);
        centers?.forEach(c => console.log(` - ${c.name} (Active: ${c.is_active}) [ID: ${c.id}]`));
    }
}

checkData();
