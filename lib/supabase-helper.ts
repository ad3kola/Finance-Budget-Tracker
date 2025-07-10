// lib/supabase-helper.ts
import { getToken } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/config/supabase-client";

export const getSupabaseClient = async () => {
  const token = await getToken({ template: "supabase" });
  return createSupabaseClient(token);
};
