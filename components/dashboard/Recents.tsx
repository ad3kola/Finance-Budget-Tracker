"use client";

import {format} from "date-fns";

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


export default function RecentTransactions({data}: {data: TransactionsProps[]}) {

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
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[130px]">Type</TableHead>
              <TableHead className="w-[130px]">Category</TableHead>
              <TableHead className="hidden lg:flex">Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.map(
              ({ date, Icon, category, type, description, amount }, index) => (
                <TableRow key={index} className="h-12">
                  <TableCell className="w-[150px] font-medium">{format(date, "PPP")}</TableCell>
                  <TableCell
                    className={cn(
                      type == "income"
                        ? " bg-green-100 text-green-700 ring-1 ring-green-600/10"
                        : "bg-red-100 text-red-700 ring-1 ring-red-600/10",
                      "flex mt-3.5 w-fit text-xs items-center rounded-sm px-2 py-0.5 font-bold ring-inset capitalize "
                    )}
                  >
                    {type}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 w-[130px] capitalize font-medium">
                      {Icon && <Icon className="w-4 h-4" />}
                      {category}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:flex">
                    {description}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    <span className="w-full px-3 py-1 bg-input/30 rounded-md text-center">${amount}</span>
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
