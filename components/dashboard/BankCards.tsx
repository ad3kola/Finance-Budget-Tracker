import React from "react";
import { CreditCard } from "./CreditCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import CreateDialogBox from "../CreateDialogBox";

function BankCards() {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex items-center w-full justify-between">
        <CardTitle>My Card</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="group w-fit cursor-pointer" variant={"outline"}>
              <PlusCircleIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-360 group-hover:scale-125" />
              Add Card
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <CreateDialogBox onSuccess={() => {}} />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <CreditCard
          bank="bmo"
          cardNumber="5510 2901 3470 2967"
          cardType="visa"
          expiryDate="07/29"
          holder="Adekola Adedeji"
          usageType="debit"
        />
      </CardContent>
    </Card>
  );
}

export default BankCards;
