"use client";

import { PackagePlusIcon, WalletIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Stats, StatsProps } from "@/lib/types";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { fetchStats } from "@/lib/data/dashboard/fetchStats";
import { useSupabaseClient } from "@/lib/data/client";
import StatsGraph from "./StatsGraph";

const getTotal = (arr: { total: number }[]) =>
  arr.reduce((sum, item) => sum + item.total, 0);

function StatsOverview({
  refresh,
  month,
  year,
}: {
  refresh?: number;
  month: string;
  year: number;
  onRefresh?: () => void;
}) {
  const { getClient } = useSupabaseClient();
  const [statsData, setStatsData] = useState<Stats | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();

      const [incomeStats, expenseStats] = await Promise.all([
        fetchStats(supabase, "income", month, year),
        fetchStats(supabase, "expense", month, year),
      ]);

      setStatsData({
        month,
        totalEarnings: getTotal(incomeStats.data),
        totalExpenses: getTotal(expenseStats.data),
        transactions: [],
      });
    };

    fetch();
  }, [year, month, getClient, refresh]);

  const data: StatsProps[] = [
    {
      title: "Current Savings",
      value: 0,
      Icon: WalletIcon,
      roi: 0,
      valueChange: 0,
    },
    {
      title: "My Investments",
      value: 0,
      Icon: PackagePlusIcon,
      roi: 0,
      valueChange: 0,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="w-full grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-3">
          <StatsGraph
            month={month}
            type="income"
            value={statsData}
            year={year}
            title="Earnings Breakdown"
            desc="Monthly income allocation overview."
          />
          <StatsGraph
            month={month}
            year={year}
            value={statsData}
            title="Spending Breakdown"
            type="expense"
            desc="How your expenses are split this month."
          />
        </div>
        <div className="w-full grid grid-auto-cols-fr grid-cols-2 md:grid-cols-1 gap-3">
          {data.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, Icon, roi, valueChange }: StatsProps) {
  return (
    <Card className="py-4">
      <CardHeader className="pr-4">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button size="sm" className="rounded-full">
            <Icon />
          </Button>
          <CardTitle className="font-medium text-sm">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="-mt-5">
        <h3 className="font-bold text-3xl text-center sm:text-left">
          ${value.toFixed(2).toLocaleString()}
        </h3>
      </CardContent>
      <CardFooter className="flex flex-col -mt-3 w-full gap-2">
        <Separator />
        <div className="flex items-center justify-center sm:justify-start w-full gap-2">
          <span className="inline-flex text-xs items-center rounded-sm bg-amber-50 px-2 py-0.5 font-medium text-amber-700 ring-1 ring-amber-600/10 ring-inset">
            +${valueChange}
          </span>
          <span className="inline-flex text-xs items-center rounded-sm bg-amber-50 px-2 py-0.5 font-medium text-amber-700 ring-1 ring-amber-600/10 ring-inset">
            {roi * 100}%
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default StatsOverview;
