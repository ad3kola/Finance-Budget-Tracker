"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { CreditCard } from "./CreditCard"; // Adjust path as needed
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const cards = [
  {
    bank: "RBC",
    cardNumber: "**** **** **** 1234",
    balance: "$3,250.00",
    expiry: "08/27",
    holder: "ADEKOLA ADEDEJI",
  },
  {
    bank: "TD Bank",
    cardNumber: "**** **** **** 5678",
    balance: "$1,480.00",
    expiry: "01/26",
    holder: "ADEKOLA ADEDEJI",
  },
  {
    bank: "Scotiabank",
    cardNumber: "**** **** **** 9101",
    balance: "$2,300.00",
    expiry: "12/25",
    holder: "ADEKOLA ADEDEJI",
  },
  {
    bank: "CIBC",
    cardNumber: "**** **** **** 1121",
    balance: "$4,500.00",
    expiry: "03/28",
    holder: "ADEKOLA ADEDEJI",
  },
  {
    bank: "BMO",
    cardNumber: "**** **** **** 3141",
    balance: "$3,800.00",
    expiry: "07/26",
    holder: "ADEKOLA ADEDEJI",
  },
];

export default function DebitCardCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: {
      perView: 1.25,
      spacing: 5,
    },
    slideChanged: (s) => setCurrentSlide(s.track.details.rel),
  });

  return (
    <Card className="w-full col-span-1">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Debit Cards</CardTitle>
      </CardHeader>{" "}
      <CardContent className="-mt-4">
        <div ref={sliderRef} className="keen-slider px-1">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`keen-slider__slide transition-all duration-100 ${
                idx === currentSlide
                  ? "scale-100 z-10"
                  : "scale-90 opacity-70 z-0"
              }`}
            >
              <CreditCard {...card} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
