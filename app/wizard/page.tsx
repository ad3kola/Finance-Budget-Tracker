"use client";

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
import { createSupabaseClient } from "@/config/supabase-client"; // change this to a factory function
import { useUser, useAuth } from "@clerk/nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function Page() {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const router = useRouter();

  if (!user) {
    redirect("/sign-in");
  }

  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    async function initSupabase() {
      if (isSignedIn) {
        const token = await getToken({ template: "supabase" });
        const client = createSupabaseClient(token);
        setSupabase(client);
      }
    }
    initSupabase();
  }, [isSignedIn, getToken]);

  const handleSubmit = async () => {
    if (!user || !selectedCurrency || !supabase) return;

    const userData = {
      user_id: user.id,
      full_name: user.fullName ?? user.username,
      email: user.primaryEmailAddress?.emailAddress,
      profile_image: user.imageUrl,
      currency: selectedCurrency,
    };

    try {
      await toast.promise(
        (async () => {
          const { error } = await supabase
            .from("user_profiles")
            .upsert(userData, { onConflict: "user_id" });

          if (error) throw new Error(error.message);
        })(),
        {
          loading: "Saving your preferences...",
          success: "Transaction has been logged",
          error: "Error logging transaction",
        }
      );

      router.push("/");
    } catch (error) {
      console.error("Upsert error:", error);
    }
  };

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4 px-4">
      <div>
        <h1 className="text-center text-2xl">
          Welcome,{" "}
          <span className="ml-2 font-bold">
            {user.username}!👋
          </span>
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Let&apos;s get started by setting up your currency
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
          <CurrencyComboBox
            value={selectedCurrency}
            onValueChange={setSelectedCurrency}
          />
        </CardContent>
      </Card>
      <Separator />
      <Button onClick={handleSubmit} className="w-full">
        I&apos;m done! Take me to the dashboard
      </Button>
      <div className="mt-8">
        <Logo />
      </div>
    </div>
  );
}

export default Page;
