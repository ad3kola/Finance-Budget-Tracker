import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

function generateColor(index: number, type: "income" | "expense") {
  const hueRange = type === "income" ? [180, 260] : [30, 60];
  const hueSpan = hueRange[1] - hueRange[0];
  const hue = hueRange[0] + ((index * 47) % hueSpan);
  const saturation = 65 + (index % 3) * 10;
  const lightness = 55 + (index % 2) * 10;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const monthNameToIndex = (monthName: string) =>
  [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ].indexOf(monthName);

export async function fetchMonthlyBreakdown(
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

  // 1. Get all categories of this type (no date filter)
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("*")
    .eq("type", type);

  if (catErr || !categories) {
    console.error("Category fetch error:", catErr?.message);
    return { total: 0, percentage: 0, breakdown: [] };
  }

  // 2. Get transactions of the given month/year and type
  const { data: transactions, error: txErr } = await supabase
    .from("transactions")
    .select("amount, category")
    .eq("type", type)
    .gte("date", start.toISOString())
    .lte("date", end.toISOString());

  if (txErr || !transactions) {
    console.error("Transaction fetch error:", txErr?.message);
    return { total: 0, percentage: 0, breakdown: [] };
  }

  // 3. Group transactions by category name
  const grouped: Record<string, number> = {};
  for (const tx of transactions) {
    const cat = typeof tx.category === "string" ? JSON.parse(tx.category) : tx.category;
    const catName = cat?.name;
    if (!catName) continue;
    grouped[catName] = (grouped[catName] || 0) + tx.amount;
  }

  const totalAmount = Object.values(grouped).reduce((sum, val) => sum + val, 0);

  // 4. Build breakdown only for categories that were used
  const breakdown = categories
    .filter(cat => grouped[cat.name])
    .map((cat, i) => {
      const total = grouped[cat.name] || 0;
      return {
        category: cat.name,
        total: +total.toFixed(2),
        color: generateColor(i, type),
        percentage: totalAmount > 0 ? +((total / totalAmount) * 100).toFixed(1) : 0,
      };
    })
    .sort((a, b) => b.total - a.total);

  return {
    total: +totalAmount.toFixed(2),
    percentage: 100,
    breakdown,
  };
}
