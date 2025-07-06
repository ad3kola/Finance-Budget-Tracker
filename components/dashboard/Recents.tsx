"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  BookPlusIcon,
  ChevronDown,
  GraduationCapIcon,
  LucideProps,
  MoreHorizontal,
  ShoppingCartIcon,
  UtensilsIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { createSupabaseClient } from "@/config/supabase-client";
import z from "zod";
import { transactionSchema } from "@/config/zod/transactions.schema";
import { TransactionsProps } from "@/lib/types";

interface Transactions {
  date: string;
  category: string;
  description: string;
  amount: string;
  type: "Income" | "Expenses";
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export default function RecentTransactions() {
  const { user } = useUser();
  const [data, setData] = useState<TransactionsProps[] | []>([])
  const { getToken, isSignedIn } = useAuth();
  useEffect(() => {
    const fetchTransactions = async () => {
      const token = await getToken({ template: "supabase" });
      const supabase = createSupabaseClient(token);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error addingtask: ", error.message);
        return;
      }

      console.log(data);
      setData(data)
    };
    fetchTransactions();
  }, [user]);

  const transactions: Transactions[] = [
    {
      date: "2025-10-01",
      category: "Shopping",
      Icon: ShoppingCartIcon,
      type: "Expenses",
      description:
        "Purchased a new pair of Nike running shoes for daily workouts and casual wear.",
      amount: "$192.64",
    },
    {
      date: "2025-10-02",
      category: "Food",
      Icon: UtensilsIcon,
      type: "Expenses",
      description:
        "Enjoyed a family dinner at Olive Garden, including appetizers, main courses, and drinks.",
      amount: "$45.00",
    },
    {
      date: "2025-10-03",
      category: "Education",
      Icon: GraduationCapIcon,
      type: "Income",
      description:
        "Received payment for completing a freelance web development project for a client.",
      amount: "$500.00",
    },
    {
      date: "2025-10-04",
      category: "Books",
      Icon: BookPlusIcon,
      type: "Expenses",
      description:
        "Bought a comprehensive React programming book to enhance development skills.",
      amount: "$29.99",
    },
    {
      date: "2025-10-05",
      category: "Salary",
      Icon: ArrowUpDown,
      type: "Income",
      description:
        "Received monthly salary from full-time employment, including all benefits and bonuses.",
      amount: "$3,000.00",
    },
    {
      date: "2025-10-06",
      category: "Shopping",
      Icon: ShoppingCartIcon,
      type: "Expenses",
      description:
        "Did weekly grocery shopping for household essentials and fresh produce.",
      amount: "$120.50",
    },
  ];
  return (
    <Card className="w-full col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="-mt-4">
        <Table className="w-full min-w-xl">
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[130px]">Date</TableHead>
              <TableHead className="w-[130px]">Type</TableHead>
              <TableHead className="w-[130px]">Category</TableHead>
              <TableHead className="hidden lg:block">Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.map(
              ({ date, Icon, category, type, description, amount }, index) => (
                <TableRow key={index} className="h-12">
                  <TableCell className="w-[130px]">{date}</TableCell>
                  <TableCell
                    className={cn(
                      type == "income"
                        ? " bg-green-100 text-green-700 ring-1 ring-green-600/10"
                        : "bg-red-100 text-red-700 ring-1 ring-red-600/10",
                      "flex mt-3.5 w-fit text-xs items-center rounded-sm px-2 py-0.5 font-medium ring-inset"
                    )}
                  >
                    {type}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 w-[130px]">
                      {Icon && <Icon className="w-4 h-4" />}
                      {category}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:block">
                    {description}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {amount}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
