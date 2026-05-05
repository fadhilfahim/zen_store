"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function WhatsAppModal({ link }: { link: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 600); // delay for smooth entry
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* MODAL */}
      <div className="relative z-10 w-[90%] max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-[fadeIn_0.3s_ease]">
        <h2 className="text-xl font-semibold">
          Complete your order via WhatsApp
        </h2>

        <p className="mt-3 text-sm text-muted">
          To finalize your order, send us your order details on WhatsApp. This
          helps us confirm and process it faster.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button asChild className="w-full">
            <a href={link} target="_blank">
              Send via WhatsApp
            </a>
          </Button>

          <button
            onClick={() => setOpen(false)}
            className="text-sm text-muted hover:text-black transition"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}