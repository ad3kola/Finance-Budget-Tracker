import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex h-screen items-center justify-center flex-col "
    >
      {children}
    </div>
  );
}

export default layout;
