"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  ArrowLeftCircleIcon,
  ChevronsLeftIcon,
  BanknoteIcon,
  Building2Icon,
  CalendarIcon,
  CarIcon,
  ClipboardCheckIcon,
  DollarSignIcon,
  GiftIcon,
  HeartPlusIcon,
  HomeIcon,
  LaptopIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  TvIcon,
  UserCircleIcon,
  UtensilsIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { subMonths, addMonths, format, startOfMonth } from "date-fns";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "@/config/zod/transactions.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryMap } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { createSupabaseClient } from "@/config/supabase-client";

// interface Items {
//   label: string;
//   link: string;
//   clickCallback?: () => void;
// }
// const items: Items[] = [
//   { label: "Dashboard", link: "/" },
//   { label: "Transactions", link: "/transactions" },
//   { label: "Manage", link: "/manage" },
// ];

const categories: CategoryMap = {
  Income: [
    { name: "Salary", Icon: BanknoteIcon },
    { name: "Freelance", Icon: UserCircleIcon },
    { name: "Business", Icon: Building2Icon },
    { name: "Side Hustle", Icon: LaptopIcon },
    { name: "Gifts", Icon: GiftIcon },
    { name: "Refunds", Icon: ArrowLeftCircleIcon },
    { name: "Other Income", Icon: PlusCircleIcon },
  ],
  Expense: [
    { name: "Shopping", Icon: ShoppingCartIcon },
    { name: "Food & Groceries", Icon: UtensilsIcon },
    { name: "Home & Rentals", Icon: HomeIcon },
    { name: "Transport", Icon: CarIcon },
    { name: "Health", Icon: HeartPlusIcon },
    { name: "Entertainment", Icon: TvIcon },
  ],
};

import Activities from "@/components/dashboard/Activities";
import RecentTransactions from "@/components/dashboard/Recents";
// import SalesOverview from "@/components/dashboard/SalesOverview";
import Stats from "@/components/dashboard/Stats";
import { TransactionsProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function Page() {
  // const debitCards = [
  //   {
  //     bank: "RBC",
  //     cardNumber: "**** **** **** 1234",
  //     balance: "$3,250.00",
  //     expiry: "08/27",
  //     holder: "ADEKOLA ADEDEJI",
  //   },
  //   {
  //     bank: "TD Bank",
  //     cardNumber: "**** **** **** 5678",
  //     balance: "$1,480.00",
  //     expiry: "01/26",
  //     holder: "ADEKOLA ADEDEJI",
  //   },
  // ];
  const [incomeCategory, setIncomeCategory] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");

  const [transactions, setTransactions] = useState<TransactionsProps[]>([]);
  const { getToken } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      txDate.getFullYear() === selectedMonth.getFullYear() &&
      txDate.getMonth() === selectedMonth.getMonth()
    );
  });
  const { user, isSignedIn } = useUser();

  const fetchTransactions = async () => {
    const token = await getToken({ template: "supabase" });
    const supabase = createSupabaseClient(token);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });
    if (error) console.error("Error retrieving data:", error.message);
    if (data) setTransactions(data);
  };

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0.0,
      category: "",
      date: new Date(),
      description: "",
      type: "income",
    },
  });
  const {
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof transactionSchema>>();

  useEffect(() => {
    fetchTransactions();
  });

  console.log(errors);

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    if (!user || !isSignedIn) return;
    const token = await getToken({ template: "supabase" });
    const supabase = createSupabaseClient(token);

    const transactionData = {
      ...values,
      user_id: user.id,
    };
    console.log(transactionData);

    const { data, error } = await supabase
      .from("transactions")
      .insert([transactionData])
      .single();

    if (error) {
      console.error("Error addingtask: ", error.message);
    }

    console.log(data);

    fetchTransactions();
    reset();
  }

  const type = form.getValues("type");

  return (
    <div className="w-full h-full p-8 flex flex-col gap-3">
      <div className="flex flex-col w-full gap-2">
        {/* 1st Row */}
        <div className="grid grid-auto-cols-fr grid-cols-1 sm:grid-cols-2 w-full gap-2 justify-between">
          <h3 className="w-full text-center md:text-left whitespace-nowrap flex-1 text-2xl">
            Welcome,{" "}
            <span className="ml-2 font-bold">
              {user?.firstName ?? "Adekola"}!👋
            </span>
          </h3>
          <div className="w-full flex items-center justify-center sm:justify-end gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                className="cursor-pointer"
                size="sm"
              >
                <ChevronsLeftIcon className="w-4 h-4" />
              </Button>
              <Button
                asChild
                variant="default"
                disabled
                className="w-32 cursor-not-allowed"
              >
                <span className="font-semibold tracking-wide">
                  {format(selectedMonth, "MMMM yyyy")}
                </span>
              </Button>
              <Button
                variant="default"
                onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
                className="cursor-pointer"
                size="sm"
              >
                <ChevronsRightIcon className="w-4 h-4" />
              </Button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-fit">
                  <PlusCircleIcon className="h-5 w-5" />
                  New Transaction
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and reChevrons your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="w-full flex flex-col gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Transaction Details</CardTitle>
                        </CardHeader>
                        <CardContent className="-mt-3">
                          <div className="flex flex-col w-full gap-3">
                            <FormField
                              control={form.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="w-full flex items-center gap-2 border-input relative">
                                      <DollarSignIcon className="w-5 h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                                      <Input
                                        type="number"
                                        min={0}
                                        step="0.001"
                                        className="w-full h-11 text-base! pl-10 font-medium tracking-wider"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="w-full flex items-center gap-2 border-input relative">
                                      <ClipboardCheckIcon className="w-5 h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                                      <Input
                                        type="text"
                                        className="w-full h-11 pl-10 font-medium tracking-wider"
                                        {...field}
                                        placeholder="Description"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Category & Date</CardTitle>
                        </CardHeader>
                        <CardContent className="-mt-3">
                          <div className="flex flex-col w-full gap-3">
                            <FormField
                              control={form.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <Tabs
                                    value={field.value}
                                    onValueChange={(val) => {
                                      field.onChange(val);
                                      form.setValue(
                                        "category",
                                        val === "income"
                                          ? incomeCategory
                                          : expenseCategory
                                      );
                                    }}
                                  >
                                    <TabsList className="w-full">
                                      <TabsTrigger
                                        className="w-
full data-[state=active]:bg-green-500!"
                                        value="income"
                                      >
                                        Income
                                      </TabsTrigger>
                                      <TabsTrigger
                                        className="w-full data-[state=active]:bg-red-500!"
                                        value="expense"
                                      >
                                        Expense
                                      </TabsTrigger>
                                    </TabsList>
                                    {["income", "expense"].map((val) => (
                                      <TabsContent
                                        key={val}
                                        value={val}
                                        className="mt-1"
                                      >
                                        <FormField
                                          control={form.control}
                                          name="category"
                                          render={({ field }) => (
                                            <FormItem>
                                              <Select
                                                onValueChange={(val) => {
                                                  field.onChange(val);
                                                  if (type === "income") {
                                                    setIncomeCategory(val);
                                                  } else {
                                                    setExpenseCategory(val);
                                                  }
                                                }}
                                                defaultValue={
                                                  type === "income"
                                                    ? incomeCategory
                                                    : expenseCategory
                                                }
                                              >
                                                <FormControl>
                                                  <SelectTrigger className="w-full">
                                                    <SelectValue
                                                      placeholder={`Select an ${
                                                        val == "income"
                                                          ? "income"
                                                          : "expense"
                                                      } category`}
                                                    />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  {categories[
                                                    val == "income"
                                                      ? "Income"
                                                      : "Expense"
                                                  ].map(({ Icon, name }) => (
                                                    <SelectItem
                                                      key={name}
                                                      value={name.toLowerCase()}
                                                      className="w-full flex items-center px-4"
                                                    >
                                                      <Button size="sm">
                                                        <Icon className="w-4 h-4 text-background/80" />{" "}
                                                      </Button>{" "}
                                                      <p className="font-medium tracking-wider">
                                                        {name}
                                                      </p>
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </TabsContent>
                                    ))}
                                  </Tabs>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full h-11 pl-3 text-left text-sm font-medium tracking-wide",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date > new Date() ||
                                          date < new Date("1900-01-01")
                                        }
                                        captionLayout="dropdown"
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button type="submit" variant={"ghost"}>
                          Add Transaction
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </Form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <Stats transactions={filteredTransactions} month={selectedMonth} />
      </div>

      {/* 2nd Row */}
      <div className="w-full grid grid-auto-cols-fr grid-cols-1 xl:grid-cols-3 gap-3">
        <Activities />
        {/* <SalesOverview /> */}
      </div>
      {/* 3rd Row */}
      <div className="w-full">
        <RecentTransactions data={transactions} />
      </div>
    </div>
  );
}

export default Page;
