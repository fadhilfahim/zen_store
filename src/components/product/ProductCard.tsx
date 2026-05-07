import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/domain";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/cn";
import { resolveProductImageUrl } from "@/lib/productsImages";

export async function ProductCard({ product }: { product: Product }) {
  const img = product.images[0] || "/zen-placeholder.svg";
  const resolved = await resolveProductImageUrl(img);
  const isRemote = resolved.startsWith("http");

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-border bg-card",
        // Slightly tighter on mobile, roomy on larger screens
        "transition hover:-translate-y-0.5 hover:border-fg/30 hover:shadow-soft",
      )}
    >
      {/* Slightly shorter cards on small screens */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-subtle">
        {isRemote ? (
          <img
            src={resolved}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <Image
            src={resolved}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
            priority={false}
          />
        )}
      </div>
      <div className="flex items-start justify-between gap-2 p-3 sm:p-4">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium tracking-tight line-clamp-2">
            {product.name}
          </p>
          <p className="text-[10px] sm:text-xs text-muted">
            {product.category ?? "Essentials"}
          </p>
        </div>
        <p className="text-xs sm:text-sm font-semibold whitespace-nowrap">
          {formatMoney(product.price)}
        </p>
      </div>
    </Link>
  );
}

