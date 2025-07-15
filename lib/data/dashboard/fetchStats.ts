import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { format, parseISO } from "date-fns";

const monthNameToIndex = (monthName: string) =>
  [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ].indexOf(monthName);

export async function fetchStats(
  supabase: SupabaseClient<Database>,
  type: "income" | "expense",
  month: string,
  year: number
) {
  const monthIndex = monthNameToIndex(month);
  if (monthIndex === -1) throw new Error("Invalid month name");

  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);
  end.setHours(23, 59, 59, 999);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("date, amount")
      .eq("type", type)
      .gte("date", start.toISOString())
      .lte("date", end.toISOString());

    if (error) {
      if (error.message.includes("JWT expired")) {
        // Attempt refresh
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        console.log(refreshData)
        if (refreshError) {
          console.error("Refresh token error:", refreshError.message);
          throw error; // Can't refresh, throw original error
        }
        return null; // Indicate to retry fetch
      }
      console.error("Transaction fetch error:", error.message);
      throw error;
    }
    return data;
  };

  let data = await fetchData();

  // Retry once after refresh
  if (data === null) {
    data = await fetchData();
  }
  if (!data) {
    return { type, data: [] };
  }

  // Group by YYYY-MM-DD
  const grouped: Record<string, number> = {};

  for (const tx of data) {
    const day = new Date(tx.date).toISOString().split("T")[0]; // "YYYY-MM-DD"
    grouped[day] = (grouped[day] || 0) + tx.amount;
  }

  const groupedArray = Object.entries(grouped)
  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()) // sort by date
  .map(([date, total]) => ({
    date: format(parseISO(date), "dd/MM"),
    total: +total.toFixed(2),
  }));

  return { type, data: groupedArray };
}
