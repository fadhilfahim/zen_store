import * as React from "react";

import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-fg/40 focus:ring-2 focus:ring-ring/40",
        className,
      )}
      {...props}
    />
  );
}

