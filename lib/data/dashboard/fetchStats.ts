import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import {format} from 'date-fns'

const monthNameToIndex = (monthName: string) =>
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].indexOf(monthName);

export async function fetchStats(
  supabase: SupabaseClient<Database>,
  type: "income" | "expense",
  month: string,
  year: number
) {
  console.log(month, year);
  const monthIndex = monthNameToIndex(month);
  if (monthIndex === -1) throw new Error("Invalid month name");

  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("transactions")
    .select("date, amount")
    .eq("type", type)
    .gte("date", start.toISOString())
    .lte("date", end.toISOString());

  if (error || !data) {
    console.error("Transaction fetch error:", error?.message);
    return {type, data: []};
  }

  // Group by YYYY-MM-DD
  const grouped: Record<string, number> = {};

  for (const tx of data) {
    const day = new Date(tx.date).toISOString().split("T")[0]; // "YYYY-MM-DD"
    grouped[day] = (grouped[day] || 0) + tx.amount;
  }

  const groupedArray = Object.entries(grouped).map(([date, total]) => ({
    date: format(date, 'dd/MM'),
    total: +total.toFixed(2),
  }));

  return { type, data: groupedArray };
}
