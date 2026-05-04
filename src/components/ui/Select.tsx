import * as React from "react";

import { cn } from "@/lib/cn";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full appearance-none rounded-xl border border-border bg-card px-3 text-sm outline-none transition focus:border-fg/40 focus:ring-2 focus:ring-ring/40",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

