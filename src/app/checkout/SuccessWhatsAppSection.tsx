"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/domain";
import { buildWhatsAppMessage, getWhatsAppLink } from "@/lib/whatsapp";

type Props = {
  order: Order | null;
  targetPhone: string;
};

export function SuccessWhatsAppSection({ order, targetPhone }: Props) {
  const [effectiveOrder, setEffectiveOrder] = useState<Order | null>(order);
  const [link, setLink] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (order) {
      setEffectiveOrder(order);
      try {
        window.sessionStorage.setItem("zen-last-order", JSON.stringify(order));
      } catch {
        // ignore storage failures
      }
      return;
    }

    const saved = window.sessionStorage.getItem("zen-last-order");
    if (!saved) return;

    try {
      setEffectiveOrder(JSON.parse(saved) as Order);
    } catch {
      // ignore malformed data
    }
  }, [order]);

  useEffect(() => {
    if (!effectiveOrder) return;

    const message = buildWhatsAppMessage(effectiveOrder);
    const waLink = getWhatsAppLink(targetPhone, message);

    const timer = window.setTimeout(() => {
      setLink(waLink);
      setReady(true);
    }, 100);

    return () => window.clearTimeout(timer);
  }, [effectiveOrder, targetPhone]);

  if (!effectiveOrder) return null;
  if (!ready || !link) {
    return (
      <div className="mt-10 flex justify-center">
        <div className="h-[10em] w-[20em] rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col items-center justify-center text-center p-5">
          <div className="h-6 w-6 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-700">Creating receipt for WhatsApp</p>
          <p className="mt-1 text-xs text-gray-400">Preparing your order summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 flex justify-center">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative h-[10em] w-[20em] bg-white rounded-2xl overflow-hidden group shadow-lg border border-gray-100"
      >
        <div className="absolute h-[6em] w-[6em] -top-[3em] -right-[3em] rounded-full bg-green-500 group-hover:scale-[800%] duration-500 z-0"></div>
        <div className="absolute inset-0 z-10 p-5 flex flex-col justify-between">
          <h1 className="text-[1.3em] font-semibold group-hover:text-white duration-500">WhatsApp Receipt Ready</h1>
          <p className="text-[0.9em] text-gray-500 group-hover:text-white/90 duration-500">
            Your order summary is ready to send instantly.
          </p>
          <div className="text-[0.95em] text-green-600 group-hover:text-white duration-500 flex items-center gap-2">
            <span className="underline underline-offset-4">Open WhatsApp</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}
