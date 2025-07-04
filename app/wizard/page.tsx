// 'use client'

import CurrencyComboBox from "@/components/CurrencyComboBox";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/config/supabase-client";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
// import { useState } from "react";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

//   const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);


  const handleSubmit = async (e) => {
    e.preventDefault()
    const userData = {
        user_id: user.id,
        full_name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        profile_image: user.imageUrl,
        currency: '',

    }
    await supabase.from("user_profiles").upsert(userData)
  }

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4 px-4">
      <div>
        <h1 className="text-center text-2xl">
          Welcome,{" "}
          <span className="ml-2 font-bold">
            {user.firstName ?? "Adekola"}!👋
          </span>
        </h1>
        <h2 className="mt-4 text-center text0base text-muted-forgeroung">
          Let &apos;s get started by setting up your currency
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          You can change these settings at any time.
        </h3>
      </div>
      <Separator />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
            <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator />
      <Button className="w-full" asChild>
        <Link href={"/"}>
          I&apos;m done! Take me to the dashboard
        </Link>
      </Button>
      <div className="mt-8">
        <Logo />
      </div>
    </div>
  );
}

export default page;
