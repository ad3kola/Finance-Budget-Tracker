import { format, parseISO } from "date-fns";
import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchRecentTransactions = async (
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) console.error("Error retrieving data:", error.message);

  const filteredData = data?.slice(0, 5).map((val) => ({
    ...val,
    date: format(parseISO(val.date), "PPP"),
  }));

  console.log(filteredData);
  return filteredData || [];
};
