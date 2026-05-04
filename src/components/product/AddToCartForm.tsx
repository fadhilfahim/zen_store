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

  const [size, setSize] = React.useState<"S" | "M" | "L" | "XL">(
    product.sizes[0] ?? "M",
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

      <div className="max-w-[220px]">
        <label className="mb-2 block text-xs text-muted">Quantity</label>
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
          disabled={!inStock}
        />
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

