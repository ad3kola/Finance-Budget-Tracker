"use client";

import { PlusCircleIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import CreateDialogBox from "../CreateDialogBox";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@/lib/data/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import Image from "next/image";
import savingsPNG from "@/assets/savings.png";
import { Card, CardContent } from "../ui/card";

function TotalBalance() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [supabaseClient, setSupabaseClient] =
    useState<SupabaseClient<Database> | null>(null);
  const { getClient } = useSupabaseClient();
  useEffect(() => {
    const fetch = async () => {
      const supabase = await getClient();
      setSupabaseClient(supabase);
    };
    fetch();
  }, [getClient]);

  const value = 120000;

  return (
    <Card>
      <CardContent className="flex items-center w-full justify-center gap-4 mx-auto">
        <div className="w-full h-full flex flex-col justify-center gap-4 max-w-xl">
          <h3 className="text-xl font-medium">Total Balance</h3>
          <p className="text-5xl font-bold tracking-wide">
            $
            {value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button className="group cursor-pointer gap-2 w-fit">
                <PlusCircleIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-360 group-hover:scale-125" />
                New Transaction
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              {supabaseClient && (
                <CreateDialogBox
                  supabase={supabaseClient}
                  onSuccess={() => {
                    setIsDialogOpen(false);
                  }}
                />
              )}
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="relative w-52 h-52 md:w-64 md:h-64">
          <Image
            src={savingsPNG}
            alt=""
            fill={true}
            className="object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default TotalBalance;
