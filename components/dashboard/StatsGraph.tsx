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

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

export default function StatsGraph({
  title,
  desc,
  type,
}: {
  title: string;
  desc: string;
  type: "income" | "expense";
}) {
  const color = type === "income" ? "#22c55e" : "#f43f5e"; 
  const gradientId = `fill-${type}`;

  const chartConfig: ChartConfig = {
    desktop: {
      label: "Desktop",
      color,
    },
  };

  return (
    <Card className="py-4 flex flex-col gap-3">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{desc}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.7} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value.slice(0, 3)}
              style={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              type="linear"
              dataKey="desktop"
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
