import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn("⚠️ Supabase environment variables are missing. This will cause runtime errors.");
}

export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseServiceRoleKey || "placeholder",
  {
    auth: {
      persistSession: false
    }
  }
);
