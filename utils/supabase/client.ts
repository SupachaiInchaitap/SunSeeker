// utils/supabase/client.ts

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true, // 🔹 Keep the session alive in the browser
      autoRefreshToken: true, // 🔹 Automatically refresh tokens when they expire
    },
  });
}
