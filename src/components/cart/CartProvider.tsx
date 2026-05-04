"use client";

import * as React from "react";

import { useLocalStorageState } from "@/components/cart/useLocalStorage";
import type { CartLine, CartState } from "@/components/cart/cart-types";

type CartContextValue = {
  hydrated: boolean;
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addLine: (line: Omit<CartLine, "id">) => void;
  removeLine: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

function calcSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { value, setValue, hydrated } = useLocalStorageState<CartState>(
    "zen.cart.v1",
    { lines: [] },
  );

  const ctx = React.useMemo<CartContextValue>(() => {
    const lines = value.lines ?? [];
    return {
      hydrated,
      lines,
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: calcSubtotal(lines),
      addLine: (line) => {
        setValue((prev) => {
          const existing = prev.lines.find(
            (l) =>
              l.productId === line.productId &&
              l.size === line.size &&
              l.color === line.color,
          );
          if (existing) {
            return {
              ...prev,
              lines: prev.lines.map((l) =>
                l.id === existing.id
                  ? { ...l, quantity: l.quantity + line.quantity }
                  : l,
              ),
            };
          }
          const id =
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
          return { ...prev, lines: [{ id, ...line }, ...prev.lines] };
        });
      },
      removeLine: (id) => {
        setValue((prev) => ({ ...prev, lines: prev.lines.filter((l) => l.id !== id) }));
      },
      updateQuantity: (id, quantity) => {
        const q = Math.max(1, Math.min(99, quantity));
        setValue((prev) => ({
          ...prev,
          lines: prev.lines.map((l) => (l.id === id ? { ...l, quantity: q } : l)),
        }));
      },
      clear: () => setValue({ lines: [] }),
    };
  }, [value.lines, setValue, hydrated]);

  return <CartContext.Provider value={ctx}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

