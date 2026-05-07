"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/cart/CartProvider";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { formatMoney } from "@/lib/money";
import { placeOrder, type PlaceOrderState } from "@/app/checkout/actions";

export function CheckoutClient() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const successHandledRef = React.useRef(false);
  const routerRef = React.useRef(router);
  const clearRef = React.useRef(clear);

  React.useEffect(() => {
    routerRef.current = router;
  }, [router]);

  React.useEffect(() => {
    clearRef.current = clear;
  }, [clear]);

  const [state, action, pending] = React.useActionState<
    PlaceOrderState | null,
    FormData
  >(placeOrder, null);

  React.useEffect(() => {
    if (!state?.ok || successHandledRef.current) return;

    successHandledRef.current = true;
    clearRef.current();

    try {
      window.sessionStorage.setItem("zen-last-order", JSON.stringify(state.order));
    } catch {
      // ignore session storage failures
    }

    routerRef.current.push(
      `/checkout/success?orderId=${encodeURIComponent(state.order.id)}`,
    );
  }, [state]);

  if (lines.length === 0) {
    return (
      <Container className="py-14">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs tracking-[0.28em] text-muted">CHECKOUT</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Nothing to checkout.</h1>
          <p className="mt-3 text-sm text-muted">Add a few pieces first.</p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg">
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const itemsJson = JSON.stringify(
    lines.map((l) => ({
      productId: l.productId,
      name: l.name,
      price: l.price,
      image: l.image,
      size: l.size,
      color: l.color,
      quantity: l.quantity,
    })),
  );

  return (
    <Container className="py-10">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-xs tracking-[0.28em] text-muted">CHECKOUT</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Shipping details</h1>

          <form action={action} className="mt-6 grid gap-4">
            <input type="hidden" name="itemsJson" value={itemsJson} />

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-muted">Full Name</label>
                <Input name="fullName" autoComplete="name" required />
              </div>
              <div>
                <label className="mb-2 block text-xs text-muted">Phone Number</label>
                <Input name="phone" inputMode="tel" autoComplete="tel" required />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs text-muted">Email</label>
              <Input name="email" type="email" autoComplete="email" required />
            </div>

            <div>
              <label className="mb-2 block text-xs text-muted">Shipping Address</label>
              <Textarea name="address" autoComplete="street-address" required />
            </div>

            <div>
              <label className="mb-2 block text-xs text-muted">Payment Method</label>
              <Select name="paymentMethod" defaultValue="COD" required>
                <option value="BANK">Bank Deposit</option>
                <option value="COD">Cash on Delivery (COD)</option>
              </Select>
              <p className="mt-2 text-xs text-muted">
                No gateway is integrated — we only record your selection.
              </p>
            </div>

            {state && !state.ok ? (
              <div className="rounded-xl border border-border bg-subtle p-4 text-sm text-muted">
                {state.message}
              </div>
            ) : null}

            <div className="mt-2 flex items-center gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Confirming…" : "Confirm Order"}
              </Button>
              <Button asChild variant="outline" disabled={pending}>
                <Link href="/cart">Back to cart</Link>
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-border bg-subtle p-5">
            <p className="text-xs text-muted">Order summary</p>
            <div className="mt-4 grid gap-3">
              {lines.map((l) => (
                <div
                  key={l.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{l.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {l.size} · {l.color} · x{l.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatMoney(l.price * l.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted">Total</p>
              <p className="text-lg font-semibold">{formatMoney(subtotal)}</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

