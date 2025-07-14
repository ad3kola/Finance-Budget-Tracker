"use client";

import { useUser } from "@clerk/nextjs";
import RecentTransactions from "@/components/dashboard/Recents";
import { format, setMonth, setYear } from "date-fns";
import StatsOverview from "@/components/dashboard/Stats";
import { TransactionsProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { fetchRecentTransactions } from "@/lib/data/dashboard/fetchTransactions";
import { useSupabaseClient } from "@/lib/data/client";
import MonthlyBreakdown from "@/components/dashboard/MonthlyBreakdown";
import ChartAreaGradient from "@/components/dashboard/ChartAreaGradient";
import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  // PlusCircleIcon,
} from "lucide-react";
// import CreateDialogBox from "@/components/CreateDialogBox";

function Page() {
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionsProps[] | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useUser();
  const { getClient } = useSupabaseClient();

  // const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();
      const res = await fetchRecentTransactions(supabase);
      setRecentTransactions(res);
    };
    fetch();
  }, [getClient, refreshKey]);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentIndex, setCurrentIndex] = useState(currentMonth);
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

  const allMonths = Array.from({ length: 12 }, (_, i) =>
    format(setMonth(setYear(new Date(), selectedYear), i), "MMMM")
  );

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
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="outline"
              className="cursor-pointer border-none"
              onClick={handlePrev}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                className="w-24 border-none h-9 rounded-sm cursor-default"
              >
                {allMonths[currentIndex]}
              </Button>

              <Button
                variant="outline"
                className="w-24 border-none h-9 rounded-sm cursor-default"
              >
                {selectedYear}
              </Button>
            </div>
            <Button
              variant="outline"
              className="cursor-pointer border-none"
              onClick={handleNext}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
          {/* <div className="flex items-center gap-2">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="group cursor-pointer"
                >
                  <PlusCircleIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-360 group-hover:scale-125" />
                  <span className="hidden md:inline-flex">
                    {" "}
                    New Transaction
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                {supabaseClient && (
                  <CreateDialogBox
                    supabase={supabaseClient}
                    onSuccess={async () => {
                      setIsDialogOpen(false);
                      const refreshed = await fetchStats(
                        supabaseClient,
                        monthName,
                        selectedYear
                      );
                      setStatsData(refreshed[0]);
                      onRefresh?.(); // trigger external refresh (e.g., RecentTransactions, ChartAreaGradient)
                    }}
                  />
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              className="cursor-pointer group"
              variant="outline"
              size="sm"
            >
              <ArrowPathIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-360" />
              <span className="hidden md:inline-flex">Reset Date</span>
            </Button>
          </div> */}
        </div>
        <div>
          <StatsOverview
            month={monthName}
            year={selectedYear}
            refresh={refreshKey}
            onRefresh={() => setRefreshKey((p) => p + 1)}
          />
        </div>
      </div>

      {/* 2nd Row */}
      <div className="w-full grid grid-auto-cols-fr grid-cols-1 lg:grid-cols-3 gap-3">
        <ChartAreaGradient refresh={refreshKey} />
        <MonthlyBreakdown
          month={monthName}
          year={selectedYear}
          type="income"
          refresh={refreshKey}
        />
      </div>
      {/* 3rd Row */}
      <div className="w-full grid grid-auto-cols-fr grid-cols-1 lg:grid-cols-3 gap-3">
        <RecentTransactions data={recentTransactions} />
        <MonthlyBreakdown
          month={monthName}
          year={selectedYear}
          type="expense"
          refresh={refreshKey}
        />
      </div>
    </div>
  );
}

export default Page;
