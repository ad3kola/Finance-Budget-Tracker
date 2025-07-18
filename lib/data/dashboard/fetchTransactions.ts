import { format, parseISO } from "date-fns";
import { Database } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchTransactionByID = async (
  supabase: SupabaseClient<Database>,
  id: number
) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .order("date", { ascending: false });


  if (error) console.error("Error retrieving data:", error.message);

  return data?.map((val) => ({
    ...val,
    date: format(parseISO(val.date), "PPP"),
    category:
      typeof val.category === "string"
        ? JSON.parse(val.category)
        : val.category,
  })) || [];

};

export const fetchRecentTransactions = async (
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) console.error("Error retrieving data:", error.message);

  const filteredData = data?.slice(0, 5).map((val) => ({
    ...val,
    date: format(parseISO(val.date), "PPP"),
    category:
      typeof val.category === "string"
        ? JSON.parse(val.category)
        : val.category,
  }));

  return filteredData || [];
};

export const fetchAllTransactions = async (
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) console.error("Error retrieving data:", error.message);

  return data?.map((val) => ({
    ...val,
    date: format(parseISO(val.date), "PPP"),
    category:
      typeof val.category === "string"
        ? JSON.parse(val.category)
        : val.category,
  })) || [];

};

