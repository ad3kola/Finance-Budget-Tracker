"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { createSupabaseClient } from "@/config/supabase-client";
import { useAuth } from "@clerk/nextjs";
import { TransactionsProps } from "@/lib/types";

export default function DemoPage() {
  const [transactions, setTransactions] = useState<TransactionsProps[] | []>(
    []
  );
  const { getToken } = useAuth();

  const fetchTransactions = async () => {
    const token = await getToken({ template: "supabase" });
    const supabase = createSupabaseClient(token);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });
    if (error) console.error("Error retrieving data:", error.message);
    if (data) setTransactions(data);
  };

  // const updateTransactionByID = async (id: number) => {
  //   const token = await getToken({ template: "supabase" });
  //   const supabase = createSupabaseClient(token);
  //   console.log(id);
  //   await supabase
  //     .from("transactions")
  //     .delete()
  //     .eq('id', id);

  //   fetchTransactions();
  //   console.log('done')
  // };

  // const deleteTransactionByID = async (id: number) => {
  //   const token = await getToken({ template: "supabase" });
  //   const supabase = createSupabaseClient(token);
  //   console.log(id);
  //   await supabase
  //     .from("transactions")
  //     .delete()
  //     .eq('id', id);

  //   fetchTransactions();
  //   console.log('done')
  // };




  
  useEffect(() => {
    fetchTransactions();
  });

  return (
    <div className="mx-auto p-2 md:p-4 w-full overflow-x-hidden">
      <DataTable columns={columns()} data={transactions} />
    </div>
  );
}