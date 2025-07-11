import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

// Utility function to generate distinct pastel colors based on index
function generateColor(index: number) {
  // Extended color hues: green, teal, cyan, sky blue, blue, indigo, purple, violet
  const hues = [140, 170, 190, 200, 220, 240, 260, 280];
  const hue = hues[index % hues.length];

  const saturation = 70 + (index % 2) * 10; // 70–80%
  const lightness = 50 + (index % 3) * 5;   // 50–60%

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
  const breakdown = Object.entries(grouped).map(([category, total], index) => ({
    category,
    total: +total.toFixed(2),
    color: generateColor(index),
    percentage: +(total / totalIncome * 100).toFixed(1),
  }));

  return {
    total: +totalIncome.toFixed(2),
    percentage: 100,
    breakdown,
  };
}
