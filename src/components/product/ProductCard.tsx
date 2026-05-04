import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/domain";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/cn";

export function ProductCard({ product }: { product: Product }) {
  const img = product.images[0] || "/zen-placeholder.svg";
  const isRemote = img.startsWith("http");

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-border bg-card",
        "transition hover:-translate-y-0.5 hover:border-fg/30 hover:shadow-soft",
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-subtle">
        <Image
          src={img}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          priority={false}
          unoptimized={isRemote}
        />
      </div>
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <p className="text-sm font-medium tracking-tight">{product.name}</p>
          <p className="mt-1 text-xs text-muted">{product.category ?? "Essentials"}</p>
        </div>
        <p className="text-sm font-semibold">{formatMoney(product.price)}</p>
      </div>
    </Link>
  );
}

