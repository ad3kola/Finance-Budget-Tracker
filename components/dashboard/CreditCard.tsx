"use client";

interface CreditCardProps {
  bank: string;
  cardNumber: string;
  expiry: string;
  balance: string;
  holder: string;
}

export const CreditCard: React.FC<CreditCardProps> = ({
  bank,
  cardNumber,
  expiry,
  balance,
  holder,
}) => (
  <div className="relative text-white rounded-2xl p-5 h-52 shadow-lg overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col justify-between">
    <div className="flex justify-between text-sm">
      <span className="uppercase tracking-wide">{bank}</span>
      <span className="text-xs opacity-80">{expiry}</span>
    </div>
    <div className="mt-6 font-mono text-xl tracking-widest">{cardNumber}</div>
    <div className="flex justify-between items-end text-sm mt-4">
      <div>
        <div className="uppercase text-xs opacity-70">Card Holder</div>
        <div className="font-semibold">{holder}</div>
      </div>
      <div className="text-right">
        <div className="uppercase text-xs opacity-70">Balance</div>
        <div className="font-semibold">{balance}</div>
      </div>
    </div>
  </div>
);
