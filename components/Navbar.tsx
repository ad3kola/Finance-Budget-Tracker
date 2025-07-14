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
    <div className="fixed top-0 left-0 right-0 w-full h-14 border-b bg-background shadow-md z-50 md:hidden">
      <nav className="container flex items-center justify-between px-8 py-2">
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

function DesktopNavbar() {
  return (
    <div className="hidden fixed top-0 left-0 right-0 h-14 border-b bg-background shadow-md z-50 md:flex items-center px-8">
      <Logo />
      <div className="flex items-center gap-x-3 flex-1 justify-end">
        <div className="flex items-center">
          {items.map((item) => (
            <NavbarItem key={item.label} label={item.label} link={item.link} />
          ))}
        </div>
        <div className="flex items-center gap-4">
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
    <div className="relative px-3 flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
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
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[70%] rounded-xl md:block -translate-x-1/2 bg-foreground" />
      )}
    </div>
  );
}

export default Navbar;
