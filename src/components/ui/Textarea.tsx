import * as React from "react";

import { cn } from "@/lib/cn";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none transition placeholder:text-muted/70 focus:border-fg/40 focus:ring-2 focus:ring-ring/40",
        className,
      )}
      {...props}
    />
  );
}

