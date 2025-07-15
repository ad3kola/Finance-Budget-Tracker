"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@/lib/data/client";
import { fetchStats } from "@/lib/data/dashboard/fetchStats";
import { Stats } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function StatsGraph({
  title,
  value,
  desc,
  type,
  month,
  year,
}: {
  title: string;
  year: number;
  value: Stats | null;
  month: string;
  desc: string;
  type: "income" | "expense";
}) {
  interface ChartData {
    date: string;
    total: number;
  }
  const [chartData, setChartData] = useState<ChartData[] | []>([]);

  const color = type === "income" ? "#22c55e" : "#f43f5e";
  const gradientId = `fill-${type}`;

  const { getClient } = useSupabaseClient();
  const chartConfig: ChartConfig = {
    total: {
      label: "total",
      color,
    },
  };

  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();
      try {
        const res = await fetchStats(supabase, type, month, year);
        if (res) {
          setChartData(res.data);
          console.log(res);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, [month, year, getClient, type]);

  const selectedValue =
    type == "income" ? value?.totalEarnings : value?.totalExpenses;

  return (
    <Card className="py-4 flex flex-col gap-3">
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-col w-full justify-between gap-1">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {desc}
            </CardDescription>
          </div>
          <div
            className={cn(
              type == "income"
                ? "dark:bg-[#0E2A2C] text-green-700 dark:text-[#0BBD72]"
                : "bg-red-100 dark:bg-[#28202E] text-red-700 dark:text-[#E33A2E]",
              "md:text-xl font-semibold py-1 rounded-md px-3 w-fit h-fit"
            )}
          >
            ${selectedValue}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart data={chartData} margin={{ left: 18, right: 18 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.7} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              interval={0}
              axisLine={false}
              tickMargin={10}
              scale={"point"}
              style={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              type="linear"
              dataKey="total"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
