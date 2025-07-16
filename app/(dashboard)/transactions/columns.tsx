"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TransactionsProps } from "@/lib/types";
import { cn, IconMap } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, EditIcon, TrashIcon } from "lucide-react";
import UpdateDialogBox from "@/components/transactions/UpdateDialogBox";

export const columns = (
  onDelete: (id: number) => void
): ColumnDef<TransactionsProps>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <button
        className="text-sm font-medium flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      if (!category) return null;
      const { Icon, name } = category;
      const LucideIcon = IconMap[Icon as keyof typeof IconMap];
      return (
        <div className="flex items-center gap-3 max-w-48 truncate capitalize font-medium">
          <div className="w-6 h-6 flex items-center justify-center text-muted-foreground">
            {(() => {
              return LucideIcon ? <LucideIcon className="w-4 h-4" /> : null;
            })()}
          </div>
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            row.getValue("type") == "income"
              ? "bg-green-100 dark:bg-[#0E2A2C] text-green-700 dark:text-[#0BBD72] ring-1 ring-green-600/10 dark:ring-[#0B4A33]"
              : "bg-red-100 dark:bg-[#28202E] text-red-700 dark:text-[#E33A2E] ring-1 ring-red-600/10 dark:ring-[#532E3A]",
            "flex items-center justify-center w-fit text-xs rounded-sm px-2 h-6 font-medium ring-inset capitalize"
          )}
        >
          {row.getValue("type")}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-sm max-w-80 2xl:max-w-2xl truncate">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="w-40 text-center">Amount</div>,
    cell: ({ row }) => {
      const value = Number(row.getValue("amount"));
      return (
        <div
          className={cn(
            "w-32 bg-input/30 px-4 py-1.5 rounded-md text-center font-medium tracking-wide",
            row.getValue("type") == "income" ? "text-green-500" : "text-red-500"
          )}
        >
          $
          {value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(transaction.id)}
              >
                <TrashIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold tracking-wide medium text-xs">
                Delete
              </p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <EditIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <UpdateDialogBox onSuccess={() => {}} id={transaction.id} />
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs font-semibold tracking-wide">Edit</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
