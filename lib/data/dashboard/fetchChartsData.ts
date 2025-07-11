import { SupabaseClient } from "@supabase/supabase-js";
import { format } from "date-fns";

export async function fetchBarCharts(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("transactions")
    .select("amount, type, date")

  if (error) {
    console.error("Fetch error:", error.message);
    return [];
  }

  const monthlySummary: Record<
    string,
    { income: number; expense: number }
  > = {};

  data.forEach((tx) => {
    const month = format(new Date(tx.date), "MMM");
    if (!monthlySummary[month]) {
      monthlySummary[month] = { income: 0, expense: 0 };
    }
    if (tx.type === "income") {
      monthlySummary[month].income += tx.amount;
    } else {
      monthlySummary[month].expense += tx.amount;
    }
  });

  return Object.entries(monthlySummary).map(([month, { income, expense }]) => ({
    month,
    income,
    expenses: expense,
  }));
}
