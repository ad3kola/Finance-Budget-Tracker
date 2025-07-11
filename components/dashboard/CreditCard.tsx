"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import chip from '@/assets/chip-logo.png'
import visa from '@/assets/visa-logo.png'
import mastercard from '@/assets/mastercard-logo.png'
import rbc from '@/assets/rbc-logo.png'
import cibc from '@/assets/cibc-logo.png'
import td from '@/assets/td-logo.png'
import bmo from '@/assets/bmo-logo.png'
import { cn } from "@/lib/utils";

interface CreditCardProps {
  bank: string;
  cardType: 'visa' | 'mastercard';
  usageType: 'debit' | 'credit';  
  cardNumber: string;
  expiryDate: string;
  holder: string;
}


const bankLogos: { [key: string]: StaticImageData } = {
  rbc,
  cibc,
  td,
  bmo,
};

export const CreditCard: React.FC<CreditCardProps> = ({
  bank,
  cardNumber,
  expiryDate,
  cardType,
  usageType,
  holder

}) => {
  
  const bankLogo = bankLogos[bank.toLowerCase()] || null;
  return (

  <div className="relative text-white rounded-2xl p-5 h-60 shadow-lg overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col justify-between">
    <div className="flex justify-between text-sm">
      <div className="flex items-center ">
        <span className="uppercase tracking-wider text-2xl font-bold">{bank}</span>
         {bankLogo && (
            <div className="relative w-16 h-10">
              <Image src={bankLogo} alt={`${bank} logo`} fill className="object-contain" />
            </div>
          )}
      </div>
      <div className="flex flex-col relative w-20 h-10"><Image src =  {chip} alt='card chip' className="object-contain "/>
      <span className="text-center font-medium -mt-3">{usageType}</span></div>
    </div>
    <div className="mt-6 font-mono font-semibold text-2xl tracking-widest">{cardNumber}</div>
    <div className="text-sm font-semibold tracking-wide font-sans underline"><span className="text-xs font-medium uppercase">Valid thru last day of: </span>{expiryDate}</div>
    <div className="flex justify-between items-end text-sm mt-4">
      <div>
        <div className="uppercase text-xs opacity-70">Card Holder</div>
        <div className="font-semibold text-lg uppercase">{holder}</div>
      </div>
      <div className="text-right">
        <div className={cn("relative h-12", cardType == 'visa' ? 'w-[88px]' : 'w-20')}>
          <Image src={cardType == 'visa' ? visa : mastercard} alt='' className={cn(cardType == 'visa' &&  'brightness-0 invert ')} fill />
        </div>
      </div>
    </div>
  </div>
);
}
