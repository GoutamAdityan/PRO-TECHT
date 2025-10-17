import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { OpenAI } from "npm:openai";
import { KNOWLEDGE_BASE } from "./knowledge.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

declare const Deno: any;

console.log("Edge function initialized with RAG capabilities");

const HUGGING_FACE_TOKEN = Deno.env.get("HUGGING_FACE_TOKEN");
const HF_MODEL_NAME = "meta-llama/Llama-3.1-8B-Instruct:nebius";

// Create a Supabase client with the service role key
const adminClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: HUGGING_FACE_TOKEN,
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

serve(async (req) => {
  console.log("--- New Request Received (v3) ---");

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const serviceKeyStatus = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ? "Set" : "NOT SET";
    console.log(`Service Role Key Status: ${serviceKeyStatus}`);

    const { query } = await req.json();
    console.log(`Received query: "${query}"`);

    if (!query) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const authHeader = req.headers.get("Authorization");
    let user = null;

    if (authHeader) {
      const jwt = authHeader.replace("Bearer ", "");
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(jwt);
      if (userError) {
        console.error("Error getting user:", userError);
      } else {
        user = authUser;
        if (user) {
          console.log(`Authenticated as user: ${user.id}`);
        } else {
          console.log("Could not authenticate user from token.");
        }
      }
    }

    let responseContent = "";

    if (query.toLowerCase().includes("how many products")) {
      if (!user) {
        responseContent = "I need you to be logged in to tell you how many products you have.";
      }
      else {
        console.log(`Querying product count for user_id: ${user.id}`);
        const { count, error } = await adminClient
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);
        
        if (error) {
          console.error("Database error fetching product count:", error.message);
          throw error;
        }
        
        console.log(`Query returned count: ${count}`);
        responseContent = `You have **${count}** products in your vault.`;
      }
    } else if (query.toLowerCase().includes("my products") || query.toLowerCase().includes("list products")) {
      if (!user) {
        responseContent = "I need you to be logged in to list your products.";
      } else {
        const { data, error } = await adminClient
          .from("products")
          .select("*")
          .eq("user_id", user.id);
        if (error) throw error;
        if (data && data.length > 0) {
          responseContent = JSON.stringify({ type: 'product_list', products: data });
        } else {
          responseContent = "You don't have any products registered.";
        }
      }
    } else if (query.toLowerCase().includes("service requests") || query.toLowerCase().includes("my requests")) {
      if (!user) {
        responseContent = "I need you to be logged in to list your service requests.";
      } else {
        let statusFilter = null;
        if (query.toLowerCase().includes("completed")) statusFilter = "completed";
        else if (query.toLowerCase().includes("pending")) statusFilter = "submitted";
        else if (query.toLowerCase().includes("in progress")) statusFilter = "in_progress";

        let serviceQuery = adminClient
          .from("service_requests")
          .select("*")
          .eq("user_id", user.id);
        
        if (statusFilter) {
          serviceQuery = serviceQuery.eq("status", statusFilter);
        }

        const { data, error } = await serviceQuery;
        if (error) throw error;

        if (data && data.length > 0) {
          responseContent = `Here are your ${statusFilter ? `**${statusFilter}** ` : ""}service requests:\n\n` + data.map(sr => `- **${sr.issue_description}** (Status: ${sr.status})`).join("\n");
        } else {
          responseContent = `You don't have any ${statusFilter ? `**${statusFilter}** ` : ""}service requests.`;
        }
      }
    } else if (query.toLowerCase().includes("warranty status")) {
      if (!user) {
        responseContent = "I need you to be logged in to check warranty status.";
      } else {
        const productIdMatch = query.match(/product id (\S+)/i);
        if (productIdMatch && productIdMatch[1]) {
          const product_id = productIdMatch[1];
          const { data, error } = await adminClient
            .from("products")
            .select("warranty_expiry")
            .eq("id", product_id)
            .single();
          if (error) throw error;
          if (data) {
            responseContent = `The warranty for product **${product_id}** expires on **${data.warranty_expiry}**.`;
          } else {
            responseContent = `Product with ID **${product_id}** not found.`;
          }
        } else {
          responseContent = "Please provide the product ID to check its warranty status.";
        }
      }
    } else {
      // Fallback to LLM for general knowledge and knowledge base
      const messages = [
        {
          role: "system",
          content: `You are a helpful assistant for the Pro-Techt website. Your knowledge base is provided below. First, try to answer the user's questions based on this information. If the answer is not in the knowledge base, use your general knowledge to answer. Be friendly and concise. KNOWLEDGE BASE: --- ${KNOWLEDGE_BASE} ---`,
        },
        { role: "user", content: query },
      ];

      const chatCompletion = await client.chat.completions.create({
        model: HF_MODEL_NAME,
        messages,
      });

      responseContent = chatCompletion.choices[0].message.content;
    }

    console.log("Successfully got response:", responseContent);

    return new Response(JSON.stringify({ generated_text: responseContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Normalize unknown errors to a string message
    const message = error instanceof Error ? error.message : String(error);
    console.error("An unexpected error occurred:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});