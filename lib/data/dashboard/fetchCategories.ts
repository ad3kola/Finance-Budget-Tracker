import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchCategories(
  supabase: SupabaseClient<Database>,
  type: "income" | "expense",
  onTokenExpired?: () => Promise<void> // optional callback to refresh token or handle logout
) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("type", type);

  if (error) {
    console.error("Category fetch error:", error.message);

    // Handle JWT expired error specifically
    if (error.message.toLowerCase().includes("jwt expired") && onTokenExpired) {
      console.log("JWT expired, attempting token refresh...");
      await onTokenExpired();
      // Optionally retry fetching here after token refresh
      // return fetchCategories(supabase, type, onTokenExpired);
    }
  }

  if (data) {
    return data.map((val) => ({
      name: val.name,
      Icon: val.Icon,
    }));
  }

  return [];
}
