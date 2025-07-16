import React from "react";
import Carousel from "./Carousel";
import { CreditCard } from "./CreditCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";

function CardCarousel() {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>My Cards</CardTitle>
        <Button variant="outline">
          <PlusCircleIcon />
        </Button>
      </CardHeader>
      <CardContent>
        <Carousel options={{ loop: true }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <CreditCard
              key={i}
              bank="cibc"
              cardNumber="0000 1234 5678 1011"
              cardType="visa"
              expiryDate="07/29"
              holder="Adekola Adedeji"
              usageType="debit"
            />
          ))}
        </Carousel>
      </CardContent>
    </Card>
  );
}

export default CardCarousel;
