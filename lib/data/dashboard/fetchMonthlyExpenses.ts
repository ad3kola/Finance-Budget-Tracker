import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

// Utility function to generate distinct pastel colors based on index
function generateColor(index: number) {
  const hue = (index * 47) % 360;
  return `hsl(${hue}, 100%, 75%)`;
}

export default async function fetchMonthlyExpenses(
  supabase: SupabaseClient<Database>
) {
  // Fetch all transactions (no date filtering)
  const { data, error } = await supabase
    .from("transactions")
    .select("amount, type, category");

  // Handle fetch error
  if (error) {
    console.error("Transactions fetch error:", error.message);
return { total: 0, percentage: 0, breakdown: [] };
  }

  // Filter only expense transactions
  const expenses = data.filter((tx) => tx.type === "expense");

  // Total expense amount
  const totalExpenses = expenses.reduce((sum, tx) => sum + tx.amount, 0);

  // Group by category and sum totals
  const grouped = expenses.reduce((acc, tx) => {
    if (!acc[tx.category]) acc[tx.category] = 0;
    acc[tx.category] += tx.amount;
    return acc;
  }, {} as Record<string, number>);

  // Build result array with color and percentage
  const breakdown = Object.entries(grouped).map(([category, total], index) => ({
    category,
    total: +total.toFixed(2),
    color: generateColor(index),
    percentage: +(total / totalExpenses * 100).toFixed(1),
  }));

  return {
    total: +totalExpenses.toFixed(2),
    percentage: 100,
    breakdown,
  };
}
