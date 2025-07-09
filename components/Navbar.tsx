"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, {
  useEffect,
  useState,
} from "react";

import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import ModeToggle from "./ModeToggle";
import { UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import Logo from "./Logo";
import { MenuIcon } from "lucide-react";

interface Items {
  label: string;
  link: string;
  clickCallback?: () => void;
}
const items: Items[] = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}
function MobileNavbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="block border-seperate border-b shadow-amber-200 shadow-xs bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8 py-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"}>
              <MenuIcon className="w-6 h-6 scale-125" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <div className="flex flex-col w-full text-center gap-1 justify-center pt-4 ">
              <Logo />
              <div className="pt-6 flex w-full flex-col gap-2">
                {items.map((item) => (
                  <NavbarItem
                    key={item.label}
                    label={item.label}
                    link={item.link}
                    clickCallback={() => setIsOpen((prev) => !prev)}
                  />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-4">
        
          <ModeToggle />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

function DesktopNavbar() {

  return (
    <div className="hidden border-separate border-b bg-background md:block w-full shadow-amber-200 shadow-xs">
      <nav className="w-full flex items-center justify-between px-8 py-2">
        <Logo />
        <div className="flex items-center gap-x-3 flex-1 justify-end">
          <div className="flex items-center">
            {items.map((items) => (
              <NavbarItem
                key={items.label}
                label={items.label}
                link={items.link}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({ link, label, clickCallback }: Items) {
  const pathname = usePathname();
  const isActive = pathname === link;
  useEffect(() => {
    console.log("Current pathname:", pathname);
  }, [pathname]);
  return (
    <div className="relative px-3 flex items-center">
      <Link
        href={`${link}`}
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          "w-full justify-center text-muted-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[70%] rounded-xl md:block -translate-x-1/2 bg-foreground"></div>
      )}
    </div>
  );
}
export default Navbar;
