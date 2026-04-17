import { createClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createClient> | null = null;

export const getSupabaseAdmin = () => {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing (URL or Service Role Key).");
  }

  supabase = createClient(url, key, {
    auth: {
      persistSession: false
    }
  });

  return supabase;
};

// For backward compatibility (lazy proxy)
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get: (target, prop) => {
    return (getSupabaseAdmin() as any)[prop];
  }
});
