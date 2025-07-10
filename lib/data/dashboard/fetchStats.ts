import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

const monthNameToIndex = (monthName: string): number => {
  return new Date(`${monthName} 1, 2000`).getMonth();
};

export const fetchStats = async (
  supabase: SupabaseClient<Database>,
  month: string,
  year: number
) => {
  const monthIndex = monthNameToIndex(month);
  const yearNum = year;

  const start = new Date(yearNum, monthIndex, 1);
  const end = new Date(yearNum, monthIndex + 1, 0);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .gte("date", start.toISOString())
    .lte("date", end.toISOString());

  if (error) {
    console.error("Transactions fetch error:", error.message);
    return [];
  }

  const totalEarnings = (data ?? [])
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = (data ?? [])
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  console.log({
    month: `${month} ${year}`,
    totalEarnings,
    totalExpenses,
    transactions: data ?? [],
  });

  return [
      {month: `${month} ${year}`,
      totalEarnings,
      totalExpenses,
      transactions: data ?? [],}
  ];
};
