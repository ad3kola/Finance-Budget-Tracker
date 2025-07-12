import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, IconMap } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TransactionsProps } from "@/lib/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { MoveRightIcon } from "lucide-react";

export default function RecentTransactions({
  data,
}: {
  data: TransactionsProps[] | null;
}) {
  return (
    <Card className="w-full col-span-2">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between w-full">
        <CardTitle className="text-xl font-medium">
          Recent Transactions
        </CardTitle>
        <Button variant={'outline'} asChild size={'sm'} className="text-xs">
          <Link href="/transactions">
          View all transactions <MoveRightIcon className="w-4 h-4" />
        </Link>
        </Button>
      </CardHeader>
      <CardContent className="-mt-4">
        <Table className="w-full min-w-xl">
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="">Category</TableHead>
              <TableHead className="hidden lg:table-cell">
                Description
              </TableHead>
              <TableHead className="text-center">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data
                .slice(0, 5)
                .map(({ date, category, type, description, amount }, index) => (
                  <TableRow key={index} className="h-12">
                    <TableCell className="w-[100px] font-medium">
                      {date}
                    </TableCell>
                    <TableCell
                      className={cn(
                        type == "income"
                          ? " bg-green-100 dark:bg-[#0E2A2C] text-green-700 dark:text-[#0BBD72] ring-1 ring-green-600/10 dark:ring-[#0B4A33]"
                          : "bg-red-100 dark:bg-[#28202E] text-red-700 dark:text-[#E33A2E] ring-1 ring-red-600/10 dark:ring-[#532E3A]",
                        "flex mt-3.5 w-fit text-xs items-center rounded-sm px-2 py-0.5 font- ring-inset capitalize"
                      )}
                    >
                      {type}
                    </TableCell>
                    <TableCell>
                      {category && (
                        <div className="flex items-center gap-3 max-w-48 truncate capitalize font-medium">
                          <Button size="sm" variant="outline">
                            {" "}
                            {(() => {
                              const Icon = category.Icon;
                              const LucideIcon =
                                IconMap[Icon as keyof typeof IconMap];
                              return LucideIcon ? (
                                <LucideIcon className="w-4 h-4" />
                              ) : null;
                            })()}
                          </Button>
                          {category.name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:flex max-w-[480px] truncate">
                      {description}
                    </TableCell>
                    <TableCell className="text-right font-bold w-40">
                      <span
                        className={cn(
                          "inline-block w-full bg-input/30 px-4 py-1.5 rounded-md text-center font-medium tracking-wide",
                          type == "income" ? "text-green-500" : "text-red-500"
                        )}
                      >
                        ${amount.toFixed(2).toLocaleString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
