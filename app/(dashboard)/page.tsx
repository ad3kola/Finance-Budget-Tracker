"use client";

import { useUser } from "@clerk/nextjs";
import RecentTransactions from "@/components/dashboard/Recents";
import StatsOverview from "@/components/dashboard/Stats";
import { TransactionsProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { fetchRecentTransactions } from "@/lib/data/dashboard/fetchTransactions";
import { useSupabaseClient } from "@/lib/data/client";
import MonthlyBreakdown from "@/components/dashboard/MonthlyBreakdown";
import ChartAreaGradient from "@/components/dashboard/ChartAreaGradient";

function Page() {
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionsProps[] | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useUser();
  const { getClient } = useSupabaseClient();

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  console.log(triggerRefresh);

  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();
      const res = await fetchRecentTransactions(supabase);
      setRecentTransactions(res);
    };
    fetch();
  }, [getClient, refreshKey]);

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
          
          <div>
            <StatsOverview
              refresh={refreshKey}
              onRefresh={() => setRefreshKey((p) => p + 1)}
            />
          </div>
      </div>

      {/* 2nd Row */}
      <div className="w-full grid grid-auto-cols-fr grid-cols-1 lg:grid-cols-3 gap-3">
        <ChartAreaGradient refresh={refreshKey} />
        <MonthlyBreakdown type="income" refresh={refreshKey} />
      </div>
      {/* 3rd Row */}
      <div className="w-full grid grid-auto-cols-fr grid-cols-1 lg:grid-cols-3 gap-3">
        <MonthlyBreakdown type="expense" refresh={refreshKey} />
        <RecentTransactions data={recentTransactions} />
      </div>
    </div>
  );
}

export default Page;
