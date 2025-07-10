"use client";

// import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";

const chartData = [
  { month: "January", income: 186, expenses: 80 },
  { month: "February", income: 305, expenses: 200 },
  { month: "March", income: 237, expenses: 120 },
  { month: "April", income: 73, expenses: 190 },
  { month: "May", income: 209, expenses: 130 },
  { month: "June", income: 214, expenses: 140 },
];

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--foreground)",
  },
} satisfies ChartConfig;

export default function Activities() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-col sm:md:flex-row w-full items-start justify-between gap-4">
        <div className="flex flex-col w-full gap-2">
          <CardTitle className="text-xl font-medium">
            Income & Expense Overview
          </CardTitle>
          <CardDescription>
            Track your income and expenses over the past 6 months to visualize
            trends and monitor your financial habits.
          </CardDescription>
        </div>
        <Tabs defaultValue="monthly" className="items-end">
          <TabsList>
            <TabsTrigger className="w-[70px]" value="monthly">
              Monthly
            </TabsTrigger>
            <TabsTrigger className="w-[70px]" value="yearly">
              Yearly
            </TabsTrigger>
          </TabsList>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={6} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
