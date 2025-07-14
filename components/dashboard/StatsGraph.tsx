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

export default function StatsGraph({
  title,
  desc,
  type,
  month,
  year,
}: {
  title: string;
  year: number;
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
      }
      catch (err) {
        console.log(err)
      }
    };
    fetch();
  }, [month, year, getClient, type]);

  return (
    <Card className="py-4 flex flex-col gap-3">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {desc}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
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
              axisLine={false}
              tickMargin={10}
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
