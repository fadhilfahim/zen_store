"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/CartProvider";

export function CartCount() {
  const { itemCount, hydrated } = useCart();
  return (
    <Link className="text-sm text-muted transition hover:text-fg" href="/cart">
      {hydrated ? `(${itemCount})` : "(…)"}
    </Link>
  );
}

