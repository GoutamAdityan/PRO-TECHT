import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// IMPORTANT: Replace these placeholders with your actual email service provider's details.
// You should store your API key as a secret in your Supabase project: `npx supabase secrets set RESEND_API_KEY your_key_here`
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? 'YOUR_RESEND_API_KEY_HERE';
const EMAIL_API_URL = 'https://api.resend.com/emails'; // Example for Resend
const FROM_EMAIL = 'noreply@yourdomain.com'; // Replace with your verified "from" email

serve(async (req) => {
  try {
    // Create a Supabase client with the service_role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Fetch products that need an alert today by calling the database function
    const { data: products, error } = await supabase.rpc('get_expiring_products_for_alerting');

    if (error) {
      throw new Error(`Error fetching products for alerting: ${error.message}`);
    }

    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ message: 'No expiring warranties to notify today.' }), {
        headers: { 'Content-Type': 'application/json' }, status: 200,
      });
    }

    // 2. For each product, send an email alert
    for (const product of products) {
      if (!product.email) continue;

      const emailBody = {
        from: FROM_EMAIL,
        to: product.email,
        subject: `Warranty Expiry Alert: ${product.brand} ${product.model}`,
        html: `<h1>Hi ${product.full_name || 'there'},</h1><p>This is a reminder that the warranty for your <strong>${product.brand} ${product.model}</strong> is expiring on <strong>${new Date(product.warranty_expiry).toLocaleDateString()}</strong>.</p><p>You can view more details on your dashboard.</p>`,
      };

      // Use fetch to send the email via your provider's API
      const res = await fetch(EMAIL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(emailBody),
      });

      if (!res.ok) {
        console.error(`Failed to send email for product ${product.product_id}:`, await res.text());
      } else {
        console.log(`Email sent successfully for product ${product.product_id} to ${product.email}`);
      }
    }

    return new Response(JSON.stringify({ message: `Processed ${products.length} notifications.` }), {
      headers: { 'Content-Type': 'application/json' }, status: 200,
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
