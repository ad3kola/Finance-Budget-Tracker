import { useAuth } from "@clerk/nextjs";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useRef, useCallback } from "react";
import { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function useSupabaseAuthedClient() {
  const { getToken } = useAuth();
  const clientRef = useRef<SupabaseClient<Database> | null>(null);

  const getClient = useCallback(async () => {
    if (!clientRef.current) {
      const token = await getToken({ template: "supabase" });
      clientRef.current = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
    }
    return clientRef.current;
  }, [getToken]);

  return { getClient };
}
