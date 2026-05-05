"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function WhatsAppModal({ link }: { link: string }) {
  const [open, setOpen] = useState(false);

  // Open only when link is available (avoids hydration issues in production)
  useEffect(() => {
    if (link) {
      setOpen(true);
    }
  }, [link]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open || !link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen(false)}
      />

      {/* MODAL */}
      <div className="relative z-10 w-[90%] max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-[fadeIn_0.25s_ease]">

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-black">
          Complete your order via WhatsApp
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-3 text-sm text-gray-500">
          Send your order details to our team on WhatsApp to confirm and process it quickly.
        </p>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-col gap-3">

          {/* PRIMARY CTA */}
          <Button asChild className="w-full">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              Send via WhatsApp
            </a>
          </Button>

          {/* SECONDARY ACTION */}
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}