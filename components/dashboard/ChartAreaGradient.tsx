"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchBarCharts } from "@/lib/data/dashboard/fetchChartsData";
import { useSupabaseClient } from "@/lib/data/client";
import { useCallback, useEffect, useState } from "react";

export const description = "An area chart with gradient fill";

interface ChartDataProps {
  month: string;
  income: number;
  expenses: number;
}

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-2)",
  },
  expenses: {
    label: "Expenses",
    color: "#f43f5e",
  },
} satisfies ChartConfig;

export default function ChartAreaGradient({ refresh }: { refresh?: number }) {
  const { getClient } = useSupabaseClient();
  const [chartData, setChartData] = useState<ChartDataProps[]>([]);

  const loadChartData = useCallback(async () => {
    const supabase = await getClient();
    const data = await fetchBarCharts(supabase);
    setChartData(data);
  }, [getClient]);

  useEffect(() => {
    loadChartData();
  }, [loadChartData, refresh]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>
          Visualizing your income and expenses over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
