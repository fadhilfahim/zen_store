import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium tracking-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-bg shadow-soft hover:bg-fg/90 active:bg-fg/85 border border-fg",
  outline:
    "bg-transparent text-fg border border-border hover:border-fg/40 hover:bg-subtle active:bg-subtle/70",
  ghost: "bg-transparent text-fg hover:bg-subtle active:bg-subtle/70",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3",
  md: "h-11 px-4",
  lg: "h-12 px-5 text-[15px]",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}) {
  if (asChild) {
    const child = props.children as unknown as
      | React.ReactElement<{ className?: string }>
      | undefined;
    if (!child || !React.isValidElement(child)) {
      throw new Error("Button with asChild requires a single React element child.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, ...rest } = props;
    return React.cloneElement(child, {
      ...(rest as any),
      className: cn(
        base,
        variants[variant],
        sizes[size],
        child.props.className,
        className,
      ),
    } as any);
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      href={href}
    >
      {children}
    </Link>
  );
}

