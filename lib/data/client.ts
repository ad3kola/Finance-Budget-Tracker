import { useAuth } from "@clerk/nextjs";
import { createSupabaseClient } from "@/config/supabase-client";
import { useRef, useCallback } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";

export const useSupabaseClient = () => {
  const { getToken } = useAuth();
  const clientRef = useRef<SupabaseClient<Database> | null>(null);

  const getClient = useCallback(async () => {
    if (!clientRef.current) {
      const token = await getToken({ template: "supabase" });
      clientRef.current = createSupabaseClient(token);
    }
    return clientRef.current;
  }, [getToken]);

  return { getClient };
};
