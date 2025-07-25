import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


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

export const IconMap = {
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