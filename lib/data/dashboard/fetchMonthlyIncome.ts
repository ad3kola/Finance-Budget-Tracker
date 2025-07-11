import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

// Utility function to generate distinct pastel colors based on index
function generateColor() {
  const hue = Math.floor(Math.random() * 360); // 0–359
  const saturation = 60 + Math.random() * 30;  // 60–90%
  const lightness = 60 + Math.random() * 20;   // 60–80%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default async function fetchMonthlyIncome(
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
  const income = data.filter((tx) => tx.type === "income");

  // Total expense amount
  const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);

  // Group by category and sum totals
  const grouped = income.reduce((acc, tx) => {
    if (!acc[tx.category]) acc[tx.category] = 0;
    acc[tx.category] += tx.amount;
    return acc;
  }, {} as Record<string, number>);

  // Build result array with color and percentage
  const breakdown = Object.entries(grouped).map(([category, total]) => ({
    category,
    total: +total.toFixed(2),
    color: generateColor(),
    percentage: +(total / totalIncome * 100).toFixed(1),
  }));

  return {
    total: +totalIncome.toFixed(2),
    percentage: 100,
    breakdown,
  };
}
