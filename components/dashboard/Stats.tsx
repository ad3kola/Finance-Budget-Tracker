import {
  Banknote,
  EllipsisIcon,
  PackagePlusIcon,
  ShoppingCartIcon,
  WalletIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { StatsProps } from "@/lib/types";
import { Separator } from "../ui/separator";

function Stats() {
  const data: StatsProps[] = [
    {
      title: "Earnings Overview",
      value: 0,
      Icon: Banknote,
      roi: 0,
      valueChange: 0,
    },
    {
      title: "Total Expenses",
      value: 0,
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
    <div className="grid grid-auto-cols-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {data.map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </div>
  );
}

function StatCard({ title, value, Icon, roi, valueChange }: StatsProps) {
  return (
    <Card className="py-4">
      <CardHeader className=" pr-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button size="sm" className="rounded-full">
              <Icon />
            </Button>{" "}
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
        <h3 className="font-bold text-3xl">${value.toFixed(2)}</h3>
      </CardContent>
      <CardFooter className="flex flex-col -mt-3 w-full gap-2">
        <Separator className="" />
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
