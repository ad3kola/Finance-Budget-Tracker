"use client";

import {
  Banknote,
  EllipsisIcon,
  PackagePlusIcon,
  ShoppingCartIcon,
  WalletIcon,
  MoveRightIcon,
  MoveLeftIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { StatsProps, TransactionsProps } from "@/lib/types";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { fetchStats } from "@/lib/data/dashboard/fetchStats";
import { useSupabaseClient } from "@/lib/data/client";
import { format, setMonth, setYear } from "date-fns";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import CreateDialogBox from "@/components/CreateDialogBox";
import { PlusCircleIcon } from "lucide-react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";

interface Stats {
  month: string;
  totalEarnings: number;
  totalExpenses: number;
  transactions: TransactionsProps[];
}

function Stats() {

  
  const { getClient } = useSupabaseClient();
  const [statsData, setStatsData] = useState<Stats | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentIndex, setCurrentIndex] = useState(currentMonth);
  const [supabaseClient, setSupabaseClient] =
    useState<SupabaseClient<Database> | null>(null);

    const monthName = format(new Date(selectedYear, currentIndex, 1), "MMMM");
  const handlePrev = () => {
    if (currentIndex === 0) {
      if (selectedYear > 2023) {
        setSelectedYear((prev) => prev - 1);
        setCurrentIndex(11); // December
      }
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    const isCurrentYear = selectedYear === currentYear;
    const maxMonth = isCurrentYear ? currentMonth : 11;

    if (currentIndex === maxMonth) {
      if (!isCurrentYear) {
        setSelectedYear((prev) => prev + 1);
        setCurrentIndex(0); // January
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();
      setSupabaseClient(supabase);
      const monthName = format(new Date(selectedYear, currentIndex, 1), "MMMM");
      const data = await fetchStats(supabase, monthName, selectedYear);

      setStatsData(data[0]);
    };
    fetch();
  }, [currentIndex, selectedYear, getClient]);

  const allMonths = Array.from({ length: 12 }, (_, i) =>
    format(setMonth(setYear(new Date(), selectedYear), i), "MMMM")
  );

  const data: StatsProps[] = [
    {
      title: "Earnings Overview",
      value: statsData?.totalEarnings ?? 0,
      Icon: Banknote,
      roi: 0,
      valueChange: 0,
    },
    {
      title: "Total Expenses",
      value: statsData?.totalExpenses ?? 0,
      Icon: ShoppingCartIcon,
      roi: 0,
      valueChange: 0,
    },
    {
      title: "Current Savings",
      value: 0,
      Icon: WalletIcon,
      roi: 0,
      valueChange: 0,
    },
    {
      title: "Investment Portfolio",
      value: 0,
      Icon: PackagePlusIcon,
      roi: 0,
      valueChange: 0,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handlePrev}
          >
            <MoveLeftIcon className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className="w-24 h-9 border-b border-foreground rounded-sm cursor-default"
            >
              {allMonths[currentIndex]}
            </Button>

            <Button
              variant="ghost"
              className="w-16 h-9 border-b border-foreground rounded-sm cursor-default"
            >
              {selectedYear}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handleNext}
          >
            <MoveRightIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button className="group cursor-pointer">
                <PlusCircleIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-360 group-hover:scale-125" />
                <span className="hidden md:inline-flex"> New Transaction</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              {supabaseClient && <CreateDialogBox
                supabase={supabaseClient}
                onSuccess={async () => {
                  setIsDialogOpen(false);
                  const refreshed = await fetchStats(
                    supabaseClient,
                    monthName,
                    selectedYear
                  );
                  setStatsData(refreshed[0]);
                }}
              />}
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button className="cursor-pointer group">
            <ArrowPathIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-360" />
            <span className="hidden md:inline-flex">Reset Date</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-auto-cols-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, Icon, roi, valueChange }: StatsProps) {
  return (
    <Card className="py-4">
      <CardHeader className="pr-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button size="sm" className="rounded-full">
              <Icon />
            </Button>
            <CardTitle className="font-medium text-sm">{title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full cursor-pointer"
          >
            <EllipsisIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="-mt-5">
        <h3 className="font-bold text-3xl">
          ${value.toFixed(2).toLocaleString()}
        </h3>
      </CardContent>
      <CardFooter className="flex flex-col -mt-3 w-full gap-2">
        <Separator />
        <div className="flex items-center w-full gap-2">
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

export default Stats;
