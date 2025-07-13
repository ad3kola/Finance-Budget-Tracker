"use client";

import { useEffect, useState, useCallback } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { TransactionsProps } from "@/lib/types";
import { fetchAllTransactions } from "@/lib/data/dashboard/fetchTransactions";
import { useSupabaseClient } from "@/lib/data/client";

export default function DemoPage() {
  const [transactions, setTransactions] = useState<TransactionsProps[] | null>(
    null
  );
  const { getClient } = useSupabaseClient();

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

  const loadTransactions = useCallback(async () => {
    const supabase = await getClient();
    const res = await fetchAllTransactions(supabase);
    if (res) setTransactions(res);
  }, [getClient]);

  const deleteTransactionByID = async (id: number) => {
    const supabase = await getClient();
    await supabase.from("transactions").delete().eq("id", id);
    console.log("Deleted:", id);
    await loadTransactions(); // ⬅️ refetch after delete
  };

  useEffect(() => {
    loadTransactions(); // ⬅️ initial fetch
  }, [getClient, loadTransactions]);

  return (
    <div className="mx-auto p-4 w-full overflow-x-hidden">
      {transactions && (
        <DataTable
          columns={columns(deleteTransactionByID)}
          data={transactions}
        />
      )}
    </div>
  );
}
