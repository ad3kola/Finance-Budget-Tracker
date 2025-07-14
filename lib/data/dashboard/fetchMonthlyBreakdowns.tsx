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
  year: number,
  onTokenExpired?: () => Promise<void>  // optional token refresh callback
) {
  const monthIndex = monthNameToIndex(month);
  if (monthIndex === -1) throw new Error("Invalid month name");

  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);
  end.setHours(23, 59, 59, 999);

  // Fetch categories
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("*")
    .eq("type", type);

  if (catErr) {
    console.error("Category fetch error:", catErr.message);
    if (catErr.message.toLowerCase().includes("jwt expired") && onTokenExpired) {
      await onTokenExpired();
      // Retry after refresh
      return fetchMonthlyBreakdown(supabase, type, month, year, onTokenExpired);
    }
    return { total: 0, percentage: 0, breakdown: [] };
  }
  if (!categories) return { total: 0, percentage: 0, breakdown: [] };

  // Fetch transactions
  const { data: transactions, error: txErr } = await supabase
    .from("transactions")
    .select("amount, category")
    .eq("type", type)
    .gte("date", start.toISOString())
    .lte("date", end.toISOString());

  if (txErr) {
    console.error("Transaction fetch error:", txErr.message);
    if (txErr.message.toLowerCase().includes("jwt expired") && onTokenExpired) {
      await onTokenExpired();
      // Retry after refresh
      return fetchMonthlyBreakdown(supabase, type, month, year, onTokenExpired);
    }
    return { total: 0, percentage: 0, breakdown: [] };
  }
  if (!transactions) return { total: 0, percentage: 0, breakdown: [] };

  // Group transactions by category name
  const grouped: Record<string, number> = {};
  for (const tx of transactions) {
    const cat = typeof tx.category === "string" ? JSON.parse(tx.category) : tx.category;
    const catName = cat?.name;
    if (!catName) continue;
    grouped[catName] = (grouped[catName] || 0) + tx.amount;
  }

  const totalAmount = Object.values(grouped).reduce((sum, val) => sum + val, 0);

  // Build breakdown only for categories with transactions
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
