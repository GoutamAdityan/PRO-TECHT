
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nnhdsugvixutbgtngflv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uaGRzdWd2aXh1dGJndG5nZmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDIxMDksImV4cCI6MjA3Mzg3ODEwOX0._43p5IMULpJVbvHE33E2GlwMYjD-FpdTtNJd2mo3ZP0";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkData() {
    console.log("Checking Data for Visibility Debugging...");

    // 1. List Service Centers
    const { data: centers } = await supabase.from('service_centers').select('id, name, company_id');
    console.log(`\nService Centers (${centers?.length}):`);
    centers?.forEach(c => console.log(` - [${c.id}] ${c.name}`));

    // 2. List Profiles (Service Centers only)
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, email').eq('role', 'service_center');
    console.log(`\nService Center Users (${profiles?.length}):`);
    profiles?.forEach(p => console.log(` - [${p.id}] ${p.full_name} (${p.email})`));

    // 3. List Service Requests
    const { data: requests } = await supabase.from('service_requests').select('id, status, service_center_id, created_at, user_id');
    console.log(`\nService Requests (${requests?.length}):`);

    const centerMap = new Map(centers?.map(c => [c.id, c.name]));

    requests?.forEach(r => {
        const centerName = r.service_center_id ? centerMap.get(r.service_center_id) : "NULL";
        console.log(` - [${r.id.substring(0, 8)}] Status: ${r.status}, Assigned To: ${centerName} (${r.service_center_id})`);
    });
}

checkData();
