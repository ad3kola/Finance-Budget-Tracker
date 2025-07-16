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
    <div className="flex flex-col gap-2 items-start p-2 md:p-4">
      <div className="flex flex-col gap-1 items-start">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage your transactions.
        </p>
      </div>
      <div className="mx-auto w-full overflow-x-hidden">
        {transactions && (
          <DataTable
            columns={columns(deleteTransactionByID)}
            data={transactions}
          />
        )}
      </div>
    </div>
  );
}
