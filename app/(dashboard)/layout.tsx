import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-screen flex items-start overflow-hidden">
      <Navbar className="min-w-64 h-full" />
      <div className="flex flex-grow relative h-full w-full mx-auto flex-col">
        {children}
      </div>
        {/* <p className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-300 text-sm text-center font-semibold tracking-wider mt-auto">
          © Copyright 2025 Adekola <br /> All Rights Reserved
        </p> */}
    </div>
  );
}

export default layout;
