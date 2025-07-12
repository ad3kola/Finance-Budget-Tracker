"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import { TransactionsProps } from "@/lib/types";
import { cn, IconMap } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import {
  // ClipboardEditIcon,
  // TrashIcon ,
  MoreHorizontal,
} from "lucide-react";
// import UpdateDialogBox from "@/components/transactions/UpdateDialogBox";

export const columns = (): // onDelete: (id: number) => void
ColumnDef<TransactionsProps>[] => [
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
        className="h-5 w-5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="h-5 w-5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const formattedDate = format(row.getValue("date"), "PPP");
      return <div className="font-medium ">{formattedDate}</div>;
    },
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
        <div className="flex items-center gap-3 capitalize font-medium">
          <Button>
            {(() => {
              return LucideIcon ? (
                <LucideIcon className="w-4 h-4" />
              ) : null;
            })()}
          </Button>
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
      <div className="text-sm max-w-4xl truncate">
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
            "w-40 bg-input/30 px-4 py-1.5 rounded-md text-center font-medium tracking-wide",
            row.getValue("type") == "income" ? "text-green-500" : "text-red-500"
          )}
        >
          ${value.toFixed(2).toLocaleString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button variant="ghost" asChild>
                <span className="w-full">Edit Transaction</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

{
  /* <AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog> */
}
