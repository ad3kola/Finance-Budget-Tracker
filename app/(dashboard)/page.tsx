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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from "lucide-react";
import CreateDialogBox from "@/components/CreateDialogBox";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

function Page() {
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionsProps[] | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [supabaseClient, setSupabaseClient] =
    useState<SupabaseClient<Database> | null>(null);

  const { user } = useUser();
  const { getClient } = useSupabaseClient();

  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();
      setSupabaseClient(supabase);
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
        setCurrentIndex(11);
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
        setCurrentIndex(0);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const allMonths = Array.from({ length: 12 }, (_, i) =>
    format(setMonth(setYear(new Date(), selectedYear), i), "MMMM")
  );

  return (
    <div className="w-full h-full flex flex-col gap-3 overflow-auto">
      <div className="flex flex-col-reverse gap-2 sm:flex-row items-center w-full justify-between sticky top-0 right-0 border-b z-40 backdrop-blur-md bg-white/10 dark:bg-zinc-900/10 sm:px-4 py-2">
        <div className="flex items-center gap-2">
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="group cursor-pointer"
              >
                <PlusCircleIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-360 group-hover:scale-125" />
                New Transaction
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              {supabaseClient && (
                <CreateDialogBox
                  supabase={supabaseClient}
                  onSuccess={() => {
                    setIsDialogOpen(false);
                    setRefreshKey((prev) => prev + 1);
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
            onClick={() => {
              setSelectedYear(currentYear);
              setCurrentIndex(currentMonth);
              setRefreshKey((p) => p + 1);
            }}
          >
            <ArrowPathIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-360" />
            Reset Date
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline" size={'sm'}
            className="cursor-pointer "
            onClick={handlePrev}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="outline" size={'sm'}
              className="w-24 rounded-sm cursor-default"
            >
              {allMonths[currentIndex]}
            </Button>
            <Button
              variant="outline" size={'sm'}
              className="w-18 rounded-sm cursor-default"
            >
              {selectedYear}
            </Button>
          </div>
          <Button
            variant="outline" size={'sm'}
            className="cursor-pointer "
            onClick={handleNext}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className='flex flex-col w-full gap-4 p-3 pb-10'>

      <div className="flex flex-col w-full gap-4">
        {/* Sticky Date Picker Below Navbar */}

        <h3 className="w-full text-2xl">
          Welcome,
          <span className="ml-2 font-bold uppercase">{user?.username}!👋</span>
        </h3>

        {/* Main content */}
        <StatsOverview
          month={monthName}
          year={selectedYear}
          refresh={refreshKey}
          onRefresh={() => setRefreshKey((p) => p + 1)}
        />
      </div>
      <div className="w-full grid grid-auto-cols-fr grid-cols-1 lg:grid-cols-3 gap-3">
        <ChartAreaGradient refresh={refreshKey} />
        <MonthlyBreakdown
          month={monthName}
          year={selectedYear}
          type="income"
          refresh={refreshKey}
        />
      </div>

      <div className="w-full flex flex-col-reverse gap-3 lg:grid lg:grid-cols-3">
        <RecentTransactions data={recentTransactions} />
        <MonthlyBreakdown
          month={monthName}
          year={selectedYear}
          type="expense"
          refresh={refreshKey}
        />
      </div>
      </div>
    </div>
  );
}

export default Page;
