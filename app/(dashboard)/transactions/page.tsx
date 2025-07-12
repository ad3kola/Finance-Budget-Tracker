"use client";

import { useEffect, useState } from "react";
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
    const fetch = async () => {
      const supabase = await getClient();
      const res = await fetchAllTransactions(supabase);
      if (res) setTransactions(res);
    };
    fetch();
  });

  return (
    <div className="mx-auto p-4 w-full overflow-x-hidden">
      {transactions && <DataTable columns={columns()} data={transactions} />}
    </div>
  );
}
