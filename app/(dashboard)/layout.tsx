import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="relative flex h-full w-full mx-auto flex-col overflow-y-auto pt-14 mb-5">
        {children}
        <p className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-300 text-sm text-center font-semibold tracking-wider">
          © Copyright 2025 Adekola <br /> All Rights Reserved
        </p>
      </div>
    </>
  );
}

export default layout;
