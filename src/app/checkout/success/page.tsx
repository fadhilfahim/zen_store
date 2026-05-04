import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <Container className="py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs tracking-[0.28em] text-muted">ORDER PLACED</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Thanks — we’ve recorded your order.
        </h1>
        <p className="mt-3 text-sm text-muted">
          {orderId ? (
            <>
              Your order ID is{" "}
              <span className="font-semibold text-fg">{orderId}</span>.
            </>
          ) : (
            "Your confirmation has been captured."
          )}
        </p>
        <p className="mt-3 text-sm text-muted">
          You’ll receive an email summary. Payment is handled offline based on the
          method you selected.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link href="/shop">Continue shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

