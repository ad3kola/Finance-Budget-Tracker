"use client";

import { useUser } from "@clerk/nextjs";
import Activities from "@/components/dashboard/Activities";
import RecentTransactions from "@/components/dashboard/Recents";
import Stats from "@/components/dashboard/Stats";
import { TransactionsProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { fetchRecentTransactions } from "@/lib/data/dashboard/fetchTransactions";
import { useSupabaseClient } from "@/lib/data/client";
import MonthlyBreakdown from "@/components/dashboard/MonthlyBreakdown";

function Page() {
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionsProps[] | null
  >(null);

  const { user } = useUser();
  const { getClient } = useSupabaseClient();

  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();
      const res = await fetchRecentTransactions(supabase);
      setRecentTransactions(res);
      console.log(res);
    };
    fetch();
  }, [getClient]);

  return (
    <div className="w-full h-full p-3 flex flex-col gap-3">
      <div className="flex flex-col w-full gap-4">
        {/* 1st Row */}
        <h3 className="w-full text-2xl">
          Welcome,
          <span className="ml-2 font-bold uppercase">
            {user?.firstName ?? "Adekola"}!👋
          </span>
        </h3>

        <Stats />
      </div>

      {/* 2nd Row */}
      <div className="w-full grid grid-auto-cols-fr grid-cols-1 xl:grid-cols-3 gap-3">
        <Activities />
        <MonthlyBreakdown type='income' />
      </div>
      {/* 3rd Row */}
      <div className="w-full grid grid-auto-cols-fr grid-cols-1 xl:grid-cols-3 gap-3">
        <MonthlyBreakdown type='expense' />
        <RecentTransactions data={recentTransactions} />
      </div>
    </div>
  );
}

export default Page;
