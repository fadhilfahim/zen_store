"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { Product } from "@/lib/domain";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

export function AddToCartForm({ product }: { product: Product }) {
  const router = useRouter();
  const { addLine } = useCart();

  type Size = "S" | "M" | "L" | "XL";

  const isSize = (v: string): v is Size =>
    ["S", "M", "L", "XL"].includes(v);

  const [size, setSize] = React.useState<Size>(
    isSize(product.sizes?.[0]) ? product.sizes[0] : "M"
  );
  const [color, setColor] = React.useState(product.colors[0] ?? "Black");
  const [quantity, setQuantity] = React.useState(1);

  const inStock = product.stock > 0;

  function addToCart() {
    addLine({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      color,
      quantity,
    });
  }

  return (
    <div className="mt-8 grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs text-muted">Size</label>
          <Select
            value={size}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "S" || v === "M" || v === "L" || v === "XL") setSize(v);
            }}
            disabled={!inStock}
          >
            {product.sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-xs text-muted">Color</label>
          <Select value={color} onChange={(e) => setColor(e.target.value)} disabled={!inStock}>
            {product.colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs text-muted">Quantity</label>

        <div className="flex items-center overflow-hidden rounded-xl border border-border bg-card w-fit">
          <button
            type="button"
            disabled={!inStock}
            className="flex h-11 w-11 items-center justify-center text-xl font-semibold transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          >
            −
          </button>

          <div className="flex h-11 min-w-[56px] items-center justify-center border-x border-border px-4 text-sm font-medium">
            {quantity}
          </div>

          <button
            type="button"
            disabled={!inStock}
            className="flex h-11 w-11 items-center justify-center text-xl font-semibold transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setQuantity((prev) => Math.min(99, prev + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          onClick={() => {
            addToCart();
            router.push("/cart");
          }}
          disabled={!inStock}
        >
          Add to Cart
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            addToCart();
            router.push("/checkout");
          }}
          disabled={!inStock}
        >
          Buy Now
        </Button>
      </div>

      {!inStock ? (
        <p className="text-sm text-muted">Out of stock.</p>
      ) : (
        <p className="text-xs text-muted">In stock: {product.stock}</p>
      )}
    </div>
  );
}

