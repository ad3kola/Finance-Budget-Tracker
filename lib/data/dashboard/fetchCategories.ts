import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchCategories(
  supabase: SupabaseClient<Database>,
  type: "income" | "expense"
) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("type", type);

  if (error || !data) {
    console.error("Category fetch error:", error?.message);
  }

  if (data) {
    return data.map((val) => ({
      name: val.name,
      Icon: val.Icon,
    }));
  }
  return []
}
