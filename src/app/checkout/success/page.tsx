import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppMessage, getWhatsAppLink } from "@/lib/notifications";
import { getOrder } from "@/lib/store";

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

  const targetPhone =
    process.env.ADMIN_WHATSAPP_PHONE || "94772405835";

  const whatsappLink =
    order
      ? getWhatsAppLink(targetPhone, buildWhatsAppMessage(order))
      : null;

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

        {/* WHATSAPP CTA CARD */}
        {whatsappLink && (
          <div className="mt-10 flex justify-center">

            <div className="relative h-[10em] w-[20em] bg-white rounded-2xl overflow-hidden group shadow-lg border border-gray-100">

              {/* EXPANDING CIRCLE */}
              <div className="absolute h-[6em] w-[6em] -top-[3em] -right-[3em] rounded-full bg-green-500 group-hover:scale-[800%] duration-500 z-0"></div>

              {/* CONTENT */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 p-5 flex flex-col justify-between"
              >

                {/* TITLE */}
                <h1 className="font-semibold text-[1.35em] text-black group-hover:text-white duration-500">
                  WhatsApp us your Order
                </h1>

                {/* SUB TEXT */}
                <p className="text-[0.9em] text-gray-500 group-hover:text-white/90 duration-500 leading-snug">
                  Send your order details instantly to confirm your purchase with ZEN.
                </p>

                {/* CTA */}
                <div className="text-[0.95em] text-green-600 group-hover:text-white duration-500 flex items-center gap-2 font-medium">
                  <span className="relative before:h-[2px] before:absolute before:w-full before:bg-green-600 group-hover:before:bg-white before:bottom-0 before:left-0">
                    Send on WhatsApp
                  </span>

                  {/* ARROW */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                  </svg>
                </div>

              </a>
            </div>
          </div>
        )}

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