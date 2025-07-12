"use client";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useSupabaseClient } from "@/lib/data/client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { PlusCircleIcon, PlusIcon } from "lucide-react";
import CreateCategory from "./CreateCategory";
import { fetchBreakdown } from "@/lib/data/dashboard/fetchMonthlyBreakdowns";

interface Income {
  total: number;
  percentage: number;
  breakdown: {
    category: string;
    total: number;
    color: string;
    percentage: number;
  }[];
}

function MonthlyBreakdown({ type }: { type: "income" | "expense" }) {
  const { getClient } = useSupabaseClient();

  const [data, setData] = useState<Income | null>(null);
  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();
      const res = await fetchBreakdown(supabase, type);
      setData(res);
    };
    fetch();
  }, [getClient, type]);

  console.log(data);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center items-start justify-between w-full gap-2">
        <CardTitle className="text-lg sm:text-xl font-medium">{`Monthly ${
          type == "income" ? " Earnings" : "Expenses"
        } Breakdown`}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='outline' size='sm' className="group w-fit cursor-pointer">
              <PlusIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-360 group-hover:scale-125" />
              <span className="inline-flex text-xs"> Add Category</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <CreateCategory type={type == "income" ? "income" : "expense"} />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="pb-5 h-full px-4">
        {data ? (
          <>
            <div className="relative flex h-2 w-full overflow-hidden rounded-full mb-4 bg-muted">
              {data.total > 0 &&
                (() => {
                  // Sort descending by percentage
                  const sorted = [...data.breakdown].sort(
                    (a, b) => b.percentage - a.percentage
                  );
                  let cumulativePercent = 0;
                  return sorted.map(({ color, percentage }, i) => {
                    const style = {
                      backgroundColor: color,
                      left: `${cumulativePercent}%`,
                      width: `${percentage}%`,
                    };
                    cumulativePercent += percentage;

                    return (
                      <motion.div
                        key={i}
                        initial={{
                          width: 0,
                          left: `${cumulativePercent - percentage}%`,
                        }}
                        animate={{
                          width: `${percentage}%`,
                          left: `${cumulativePercent - percentage}%`,
                        }}
                        transition={{
                          duration: 0.9,
                          ease: "easeOut",
                          delay: i * 0.1,
                        }}
                        className="absolute h-full"
                        style={style}
                      />
                    );
                  });
                })()}
            </div>
            <div className="w-full flex flex-col h-full justify-between">
              <div className="w-full flex-grow overflow-y-auto px-2">
                {data.breakdown.map(
                  ({ category, color, total, percentage }) => (
                    <div
                      key={category}
                      className="grid grid-cols-3 w-full h-12 border-b tracking-wide capitalize px-2"
                    >
                      <div className="col-span-2 flex items-center w-full justify-start gap-3 text-sm font-medium">
                        <div
                          style={{ backgroundColor: color }}
                          className={`w-3 h-3 rounded-full`}
                        />
                        <h3 className="w-28 sm:w-36 lg:w-full truncate ">{category}</h3>
                      </div>
                      <div className="col-span-1 w-full gap-3 flex items-center justify-between font-medium">
                        <p className="text-left w-full">${total.toFixed(2)}</p>
                        <p className='w-full'>{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="w-full grid grid-cols-3 h-12 bg-input/30 px-2 rounded-lg overflow-y-auto">
                <div className="col-span-2 flex items-center w-full justify-start gap-3 text-sm font-medium pl-2">
                  <div className="w-3 h-3 rounded-full bg-white" />
                  <h3>{`Total ${type == "income" ? "earned" : "spent"}`}</h3>
                </div>
                <div className="col-span-1 w-full gap-3 flex items-center justify-between font-medium">
                  <p className="text-left">${data.total.toFixed(2)}</p>
                  <p>{data.percentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              {" "}
              No categories!! <br /> proboably cos you havent logged any
              transactions. <br /> Do one now :D
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="group w-fit cursor-pointer"
                  variant={"outline"}
                >
                  <PlusCircleIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-360 group-hover:scale-125" />
                  New Transaction
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <CreateCategory
                  type={type}
                  onSuccess={async () => {
                    const supabase = await getClient();
                    const updated = await fetchBreakdown(supabase, type);
                    setData(updated);
                  }}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MonthlyBreakdown;
