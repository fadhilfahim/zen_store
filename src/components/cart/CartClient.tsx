"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/CartProvider";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatMoney } from "@/lib/money";

export function CartClient() {
  const { lines, subtotal, updateQuantity, removeLine } = useCart();

  if (lines.length === 0) {
    return (
      <Container className="py-14">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs tracking-[0.28em] text-muted">CART</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Your cart is empty.</h1>
          <p className="mt-3 text-sm text-muted">
            Start with clean essentials — pick your size, color, and build your uniform.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg">
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.28em] text-muted">CART</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Your cart</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4">
        {lines.map((l) => (
          <div
            key={l.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-16 overflow-hidden rounded-lg border border-border bg-subtle">
                <Image
                  src={l.image || "/zen-placeholder.svg"}
                  alt={l.name}
                  fill
                  className="object-cover"
                  unoptimized={(l.image || "/zen-placeholder.svg").startsWith("http")}
                />
              </div>
              <div>
                <p className="text-sm font-medium">{l.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {l.size} · {l.color}
                </p>
                <p className="mt-2 text-sm font-semibold">{formatMoney(l.price)}</p>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-between gap-4 sm:justify-end">
              <div className="w-[120px]">
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={l.quantity}
                  onChange={(e) => updateQuantity(l.id, Number(e.target.value || 1))}
                />
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Line total</p>
                <p className="text-sm font-semibold">{formatMoney(l.price * l.quantity)}</p>
              </div>
              <Button variant="ghost" onClick={() => removeLine(l.id)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 rounded-xl border border-border bg-subtle p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted">Subtotal</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{formatMoney(subtotal)}</p>
          <p className="mt-2 text-xs text-muted">
            Shipping and taxes (if any) are handled offline.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/shop">Continue shopping</Link>
          </Button>
          <Button asChild>
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

