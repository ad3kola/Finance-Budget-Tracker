"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useSupabaseClient } from "@/lib/data/client";
import fetchMonthlyExpenses from "@/lib/data/dashboard/fetchMonthlyExpenses";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import CreateDialogBox from "../CreateDialogBox";

interface Expense {
  total: number;
  percentage: number;
  breakdown: {
    category: string;
    total: number;
    color: string;
    percentage: number;
  }[];
}

function MonthlyExpenses() {
  const { getClient } = useSupabaseClient();

  const [expenseBreakdown, setExpenseBreakdown] = useState<Expense | null>(
    null
  );
  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();
      const res = await fetchMonthlyExpenses(supabase);
      console.log(res);
      setExpenseBreakdown(res);
    };
    fetch();
  }, [getClient]);

  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="text-xl">Monthly Expenses Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full px-4">
        {expenseBreakdown ? (
          <>
            <div className="flex h-2 w-full overflow-hidden rounded-full mb-4">
              {expenseBreakdown.breakdown.map(({ color, percentage }, i) => (
                <div
                  key={i}
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                  className="h-full"
                />
              ))}
            </div>
            <div className="w-full flex flex-col h-full justify-between">
              <div className="w-full flex-grow overflow-y-auto px-2">
                {expenseBreakdown.breakdown.map(
                  ({ category, color, total, percentage }) => (
                    <div
                      key={category}
                      className="grid grid-cols-3 w-full h-12 border-b tracking-wide capitalize"
                    >
                      <div className="col-span-2 flex items-center w-full justify-start gap-3 text-sm font-medium">
                        <div
                          style={{ backgroundColor: color }}
                          className={`w-3 h-3 rounded-full`}
                        />
                        <h3>{category}</h3>
                      </div>
                      <div className="col-span-1 w-full gap-3 flex items-center justify-between font-medium">
                        <p className="text-left">${total.toFixed(2)}</p>
                        <p>{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="w-full grid grid-cols-3 h-11 bg-input/30 px-2 rounded-lg">
                <div className="col-span-2" />
                <div className="col-span-1 w-full gap-3 flex items-center justify-between font-medium">
                  <p className="text-left">
                    ${expenseBreakdown.total.toFixed(2)}
                  </p>
                  <p>{expenseBreakdown.percentage.toFixed(1)}%</p>
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
                <CreateDialogBox onSuccess={() => {}} />
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

export default MonthlyExpenses;
