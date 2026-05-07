import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SuccessWhatsAppSection } from "@/app/checkout/SuccessWhatsAppSection";
import { getOrder } from "@/server/orders";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  const order = orderId ? await getOrder(orderId) : null;

  const targetPhone = process.env.ADMIN_WHATSAPP_PHONE || "94772405835";

  return (
    <Container className="py-24">
      <div className="mx-auto max-w-2xl text-center">

        {/* SUCCESS BADGE */}
        <div className="mx-auto mb-6 flex items-center justify-center">
          <div className="rounded-full bg-green-50 px-4 py-2 text-green-700 text-sm font-medium border border-green-100">
            ✓ Order Confirmed
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[rgb(var(--zen-fg))]">
          Thank you for your order
        </h1>

        {/* ORDER ID */}
        <p className="mt-5 text-sm text-[rgb(var(--zen-muted))]">
          {orderId ? (
            <>
              Your order ID is{" "}
              <span className="font-semibold text-[rgb(var(--zen-fg))]">
                {orderId}
              </span>
            </>
          ) : (
            "Your order has been successfully recorded."
          )}
        </p>

        {/* INFO */}
        <p className="mt-3 text-sm text-[rgb(var(--zen-muted))] leading-relaxed">
          We’ve received your order and are preparing it. You’ll receive an email
          confirmation shortly. Payment will be handled offline based on your selected method.
        </p>

        <SuccessWhatsAppSection order={order} targetPhone={targetPhone} />

        {/* ACTIONS */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-3">
          <Button asChild>
            <Link href="/shop">Continue shopping</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}