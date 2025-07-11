import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex h-full w-full mx-auto flex-col overflow-y-auto mb-5">
      <Navbar />
      {children}
    </div>
  );
}

export default layout;
