"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { parse } from "date-fns";
import { cn, IconMap } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/nextjs";

import { format } from "date-fns";
import { z } from "zod";
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
import { CategoryItem, TransactionsProps } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/config/supabase-client";
import { Button } from "../ui/button";
import { fetchCategories } from "@/lib/data/dashboard/fetchCategories";
import { CalendarIcon, ClipboardCheckIcon, DollarSignIcon } from "lucide-react";
import { useSupabaseClient } from "@/lib/data/client";
import { fetchTransactionByID } from "@/lib/data/dashboard/fetchTransactions";

export default function UpdateDialogBox({
  onSuccess,
  id,
}: {
  onSuccess: () => void;
  id: number;
}) {
  const { getToken } = useAuth();
  const { getClient } = useSupabaseClient();

  const { user, isSignedIn } = useUser();

  const [activeCategory, setActiveCategory] = useState<CategoryItem | null>(
    null
  );

  const [activeCategoryList, setActiveCategoryList] = useState<CategoryItem[]>(
    []
  );

  const [transaction, setTransaction] = useState<TransactionsProps | null>(
    null
  );

  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();

      try {
        const res = await fetchTransactionByID(supabase, id);
        if (res) {
          setTransaction(res[0]);
          console.log(res);
        }
      } catch (err) {
        console.error("Error fetching transaction:", err);
      }
    };
    fetch();
  }, [id, getClient]);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      category: null,
      date: new Date(),
      description: "",
      type: "expense",
    },
  });

  const {
    reset,
    formState: { errors },
  } = form;

  console.log(errors);

  useEffect(() => {
    if (transaction) {
      const parsedDate = parse(transaction.date, "MMMM do, yyyy", new Date());
      if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date format:", transaction.date);
        return;
      }

      reset({
        amount: transaction.amount,
        category: transaction.category,
        date: parsedDate,
        description: transaction.description,
        type: transaction.type as "income" | "expense",
      });

      setActiveCategory(transaction.category);

      form.setValue("category", transaction.category);
    }
  }, [transaction, reset, form]);

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    if (!user || !isSignedIn) return;
    const token = await getToken({ template: "supabase" });

    const supabase = createSupabaseClient(token);
    const date = form.getValues("date");
    const isoDate =
      date instanceof Date ? date.toISOString() : new Date(date).toISOString();

    const transactionData = {
      ...values,
      user_id: user.id,
      date: isoDate,
    };
    console.log(transactionData);

    const { data, error } = await supabase
      .from("transactions")
      .insert([transactionData])
      .single();

    if (error) {
      console.error("Error addingtask: ", error.message);
    } else {
      reset();
      onSuccess(); // close modal
    }
    console.log(data);
  }

  console.log(activeCategory);
  const type = form.watch("type");

  const { getValues, setValue } = form;

  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();
      if (supabase) {
        const res = await fetchCategories(supabase, type);
        setActiveCategoryList(res);

        const currentCategory = getValues("category");

        const categoryExists = res.some(
          (cat) =>
            cat.name === currentCategory?.name &&
            cat.Icon === currentCategory?.Icon
        );

        if (!categoryExists) {
          setActiveCategory(null);
          setValue("category", null);
        } else {
          setActiveCategory(currentCategory);
        }
      }
    };
    fetch();
  }, [type, getClient, getValues, setValue]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full flex flex-col"
      >
        <div className="flex flex-col gap-4">
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
                        }}
                      >
                        <TabsList className="w-full">
                          <TabsTrigger
                            className="w-full data-[state=active]:bg-green-500!"
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
                          <TabsContent key={val} value={val} className="mt-1">
                            <FormField
                              control={form.control}
                              name="category"
                              render={() => (
                                <FormItem>
                                  <Select
                                    value={
                                      activeCategory
                                        ? JSON.stringify(activeCategory)
                                        : ""
                                    }
                                    onValueChange={(val) => {
                                      if (!val) {
                                        form.setValue("category", null);
                                        setActiveCategory(null);
                                        return;
                                      }
                                      try {
                                        const parsed = JSON.parse(val);
                                        form.setValue("category", parsed);
                                        setActiveCategory(parsed);
                                      } catch (error) {
                                        console.error(
                                          "Error parsing category:",
                                          error
                                        );
                                      }
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {activeCategoryList.map(
                                        ({ Icon, name }) => {
                                          return (
                                            <SelectItem
                                              key={name}
                                              value={JSON.stringify({
                                                name,
                                                Icon,
                                              })}
                                              className="w-full flex items-center px-4"
                                            >
                                              <Button size="sm">
                                                {(() => {
                                                  const LucideIcon =
                                                    IconMap[
                                                      Icon as keyof typeof IconMap
                                                    ];
                                                  return LucideIcon ? (
                                                    <LucideIcon className="w-4 h-4 text-background/80" />
                                                  ) : null;
                                                })()}
                                              </Button>
                                              <p className="font-medium tracking-wider capitalize">
                                                {name}
                                              </p>
                                            </SelectItem>
                                          );
                                        }
                                      )}
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
                                !field.value && "text-muted-foreground"
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
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
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
        <Button type="submit">Add Transaction</Button>
      </form>
    </Form>
  );
}
