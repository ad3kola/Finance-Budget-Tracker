import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-full w-full mx-auto flex-col overflow-y-auto mt-14 mb-5">
      <Navbar />
      {children}
      <p className="bg-clip-text text-transparent  bg-gradient-to-r from-sky-500 to-sky-300 text-sm text-center font-semibold tracking-wider">
        © Copyright 2025 Adekola <br /> All Rights Reserved
      </p>
    </div>
  );
}

export default layout;
