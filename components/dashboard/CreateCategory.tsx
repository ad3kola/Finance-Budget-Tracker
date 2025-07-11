"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import {
  AppleIcon,
  BadgeDollarSignIcon,
  BanknoteIcon,
  BatteryChargingIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BrushIcon,
  BuildingIcon,
  CalendarCheckIcon,
  CameraIcon,
  CarIcon,
  CoinsIcon,
  CreditCardIcon,
  DollarSignIcon,
  DropletIcon,
  DumbbellIcon,
  FlameIcon,
  GamepadIcon,
  GiftIcon,
  GraduationCapIcon,
  HandCoinsIcon,
  HandshakeIcon,
  HeartIcon,
  HeartPulseIcon,
  HomeIcon,
  LandmarkIcon,
  LaptopIcon,
  Layers3Icon,
  MusicIcon,
  PiggyBankIcon,
  PlaneIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  ShirtIcon,
  ShoppingCartIcon,
  SmartphoneIcon,
  StoreIcon,
  TrendingUpIcon,
  TvIcon,
  UserCheckIcon,
  UserIcon,
  UtensilsIcon,
  WalletIcon,
  WifiIcon,
  WrenchIcon,
} from "lucide-react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSupabaseClient } from "@/config/supabase-client";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { CategorySchema } from "@/config/zod/categories.schema";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CreateCategory({
  type,
}: {
  type: "income" | "expense";
}) {
  const { getToken } = useAuth();

  const { user, isSignedIn } = useUser();

  type IconKey = keyof typeof IconMap;

  interface CategoryIcons {
    name: string;
    Icon: IconKey;
  }
  const expenseCategoryIcons: CategoryIcons[] = [
    { name: "Shopping", Icon: "ShoppingCartIcon" },
    { name: "Food & Dining", Icon: "UtensilsIcon" },
    { name: "Rent / Housing", Icon: "HomeIcon" },
    { name: "Transport", Icon: "CarIcon" },
    { name: "Travel", Icon: "PlaneIcon" },
    { name: "Healthcare", Icon: "HeartPulseIcon" },
    { name: "Education", Icon: "GraduationCapIcon" },
    { name: "Phone / Mobile", Icon: "SmartphoneIcon" },
    { name: "Entertainment", Icon: "TvIcon" },
    { name: "Internet", Icon: "WifiIcon" },
    { name: "Water Bill", Icon: "DropletIcon" },
    { name: "Gas / Heating", Icon: "FlameIcon" },
    { name: "Electricity", Icon: "BatteryChargingIcon" },
    { name: "Savings", Icon: "PiggyBankIcon" },
    { name: "Bank Fees", Icon: "BanknoteIcon" },
    { name: "Credit Card", Icon: "CreditCardIcon" },
    { name: "Work Expenses", Icon: "BriefcaseIcon" },
    { name: "Clothing", Icon: "ShirtIcon" },
    { name: "Personal Care", Icon: "BrushIcon" },
    { name: "Gifts / Donations", Icon: "GiftIcon" },
    { name: "Groceries", Icon: "AppleIcon" },
    { name: "Fitness / Gym", Icon: "DumbbellIcon" },
    { name: "Insurance", Icon: "ShieldCheckIcon" },
    { name: "Repairs", Icon: "WrenchIcon" },
    { name: "Taxes", Icon: "LandmarkIcon" },
  ];

  const incomeCategoryIcons: CategoryIcons[] = [
    { name: "Salary / Wages", Icon: "BadgeDollarSignIcon" },
    { name: "Freelance / Side Hustle", Icon: "WalletIcon" },
    { name: "Savings Interest", Icon: "PiggyBankIcon" },
    { name: "Bank Transfers", Icon: "BanknoteIcon" },
    { name: "Cashback / Rewards", Icon: "CreditCardIcon" },
    { name: "Crypto Earnings", Icon: "CoinsIcon" },
    { name: "Investments", Icon: "TrendingUpIcon" },
    { name: "Real Estate", Icon: "BuildingIcon" },
    { name: "Gifts Received", Icon: "GiftIcon" },
    { name: "Business Income", Icon: "BriefcaseIcon" },
    { name: "Loan Received", Icon: "HandCoinsIcon" },
    { name: "General Income", Icon: "DollarSignIcon" },
    { name: "Consulting / Services", Icon: "UserCheckIcon" },
    { name: "Reimbursements", Icon: "ReceiptIcon" },
    { name: "Partnerships", Icon: "HandshakeIcon" },
    { name: "Scheduled Income", Icon: "CalendarCheckIcon" },
    { name: "Personal Support", Icon: "UserIcon" },
    { name: "Royalties / Courses", Icon: "BookOpenIcon" },
    { name: "Online Jobs", Icon: "LaptopIcon" },
    { name: "Creative Income", Icon: "MusicIcon" },
    { name: "Media / Photography", Icon: "CameraIcon" },
    { name: "Gaming / Streaming", Icon: "GamepadIcon" },
    { name: "Insurance Payouts", Icon: "ShieldCheckIcon" },
    { name: "Donations Received", Icon: "HeartIcon" },
    { name: "E-commerce Sales", Icon: "StoreIcon" },
  ];

  const IconMap = {
    ShoppingCartIcon,
    UtensilsIcon,
    HomeIcon,
    CarIcon,
    PlaneIcon,
    HeartPulseIcon,
    GraduationCapIcon,
    SmartphoneIcon,
    TvIcon,
    WifiIcon,
    DropletIcon,
    FlameIcon,
    BatteryChargingIcon,
    PiggyBankIcon,
    BanknoteIcon,
    CreditCardIcon,
    BriefcaseIcon,
    ShirtIcon,
    BrushIcon,
    GiftIcon,
    AppleIcon,
    DumbbellIcon,
    ShieldCheckIcon,
    WrenchIcon,
    LandmarkIcon,
    BadgeDollarSignIcon,
    WalletIcon,
    CoinsIcon,
    TrendingUpIcon,
    BuildingIcon,
    HandCoinsIcon,
    DollarSignIcon,
    UserCheckIcon,
    ReceiptIcon,
    HandshakeIcon,
    CalendarCheckIcon,
    UserIcon,
    BookOpenIcon,
    LaptopIcon,
    MusicIcon,
    CameraIcon,
    GamepadIcon,
    HeartIcon,
    StoreIcon,
  } as const;

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      Icon: expenseCategoryIcons[0].Icon,
    },
  });
  const {
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CategorySchema>>();

  console.log(errors);

  async function onSubmit(values: z.infer<typeof CategorySchema>) {
    if (!user || !isSignedIn) return;
    const token = await getToken({ template: "supabase" });
    const supabase = createSupabaseClient(token);

    const categoryData = {
        ...values,
        user_id: user.id,
    }
    const { data, error } = await supabase
      .from("categories")
      .insert([categoryData])
      .single();

    if (error) {
      console.error("Error creating category: ", error.message);
    } else {
      reset();
    }
    console.log(data);
  }

  const category =
    type == "income" ? incomeCategoryIcons : expenseCategoryIcons;
  const [selectedCategory, setSelectedCategory] = useState<IconKey>(
    category[0].Icon
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full flex flex-col"
      >
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Category</CardTitle>
            </CardHeader>
            <CardContent className="-mt-3 flex flex-col gap-2">
              <div className="grid grid-cols-2 items-center w-full bg-muted p-1 rounded-lg">
                <div
                  className={cn(
                    "text-sm font-medium h-9 capitalize w-full flex items-center justify-center rounded-lg bg-input/30",
                    type.toLowerCase() == "income" && "bg-green-500"
                  )}
                >
                  Income{" "}
                </div>
                <div
                  className={cn(
                    "text-sm font-medium h-9 capitalize w-full flex items-center justify-center rounded-lg bg-input/30",
                    type.toLowerCase() == "expense" && "bg-red-500"
                  )}
                >
                  Expense{" "}
                </div>
              </div>
              <div className="flex flex-col w-full gap-3 mt-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="w-full flex items-center gap-3 border-input relative">
                          <Layers3Icon className="w-5 h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <Input
                            type="text"
                            className="w-full h-11 pl-10 font-medium tracking-wider"
                            {...field}
                            placeholder="Enter category name"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <div className="flex flex-col gap-2 w-[80%] mx-auto">
                 <p className='w-full text-sm text-muted-foreground font-medium'>Hover over icons for name suggestions</p>
                  <div className="w-full grid grid-cols-5 gap-1 items-center">
                    {category.map(({ name, Icon }) => {
                      const LucideIcon = IconMap[Icon];
                      return (
                        <Tooltip key={name}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                selectedCategory == Icon ? "default" : "ghost"
                              } className="cursor-pointer rounded-full w-fit p-5"
                              onClick={() => {
                                setSelectedCategory(Icon);
                                form.setValue("Icon", Icon);
                              }}
                            >
                              <LucideIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{name}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button type="submit">Add Category</Button>
      </form>
    </Form>
  );
}
