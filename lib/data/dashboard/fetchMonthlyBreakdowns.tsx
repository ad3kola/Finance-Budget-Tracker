import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

// Utility: generate pastel HSL color
function generateColor(index: number, type: "income" | "expense") {
  // Define hue ranges for types
  const hueRange = type === "income" ? [180, 260] : [30, 60]; 
  // Income: cyan to blue-purple hues (180° to 260°)
  // Expense: orange to yellow hues (30° to 60°)

  // Calculate hue evenly spaced in the range based on index
  const hueSpan = hueRange[1] - hueRange[0];
  const hue = hueRange[0] + (index * 47) % hueSpan; // 47 is a prime step for distribution

  // Slight variation in saturation and lightness for vibrancy
  const saturation = 65 + (index % 3) * 10; // 65%, 75%, 85%
  const lightness = 55 + (index % 2) * 10; // 55% or 65%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export async function fetchBreakdown(
  supabase: SupabaseClient<Database>,
  type: "income" | "expense"
) {
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("*")
    .eq("type", type);

  if (catErr || !categories) {
    console.error("Category fetch error:", catErr?.message);
    return { total: 0, percentage: 0, breakdown: [] };
  }

  const { data: transactions, error: txErr } = await supabase
    .from("transactions")
    .select("amount, category")
    .eq("type", type);

  if (txErr || !transactions) {
    console.error("Transaction fetch error:", txErr?.message);
    return { total: 0, percentage: 0, breakdown: [] };
  }

  // Group amounts by parsed category.name
  const grouped: Record<string, number> = {};
  for (const tx of transactions) {
    const parsedCategory =
      typeof tx.category === "string"
        ? JSON.parse(tx.category)
        : tx.category;

    const catName = parsedCategory?.name;
    if (!catName) continue;

    if (!grouped[catName]) grouped[catName] = 0;
    grouped[catName] += tx.amount;
  }

  const totalAmount = Object.values(grouped).reduce((sum, val) => sum + val, 0);

  const breakdown = categories.map((cat, i) => {
  const total = grouped[cat.name] || 0;
  return {
    category: cat.name,
    total: +total.toFixed(2),
    color: generateColor(i, type),
    percentage: totalAmount > 0 ? +(total / totalAmount * 100).toFixed(1) : 0,
  };
});

// Sort descending by total
breakdown.sort((a, b) => b.total - a.total);

return {
  total: +totalAmount.toFixed(2),
  percentage: 100,
  breakdown,
};
}
