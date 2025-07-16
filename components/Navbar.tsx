"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

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

function Navbar({ className }: { className?: string }) {
  return (
    <>
      <DesktopNavbar className={className} />
      <MobileNavbar className={className} />
    </>
  );
}

function MobileNavbar({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={cn(
        className,
        "w-full h-full border-b bg-background shadow-md z-50 md:hidden"
      )}
    >
      <nav className="container flex items-center justify-between p-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost">
              <MenuIcon className="w-6 h-6 scale-125" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <div className="flex flex-col w-full text-center gap-1 justify-center pt-4">
              <Logo />
              <div className="pt-6 flex w-full flex-col gap-2">
                {items.map((item) => (
                  <NavbarItem
                    key={item.label}
                    label={item.label}
                    link={item.link}
                    clickCallback={() => setIsOpen(false)}
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

function DesktopNavbar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        className,
        "hidden border-r bg-background shadow-md z-50 md:flex flex-col items-start p-4 gap-4 border"
      )}
    >
      {/* <Logo /> */}
      <h3 className="font-bold text-2xl bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-300 text-transparent flex-shrink-0">
        Budget Tracker
      </h3>
      <div className="flex flex-col items-start gap-3 flex-grow h-full w-full">
        <div className="flex flex-col items-start flex-grow gap-2 w-full">
          {items.map((item) => (
            <NavbarItem key={item.label} label={item.label} link={item.link} />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-auto">
          <ModeToggle />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </div>
  );
}

function NavbarItem({ link, label, clickCallback }: Items) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative px-3 flex items-center w-full">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: isActive ? 'outline' : 'ghost' }),
          "w-full justify-center h-10 text-base text-muted-foreground rounded-md",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="bg-input/30 " />
      )}
    </div>
  );
}

export default Navbar;
