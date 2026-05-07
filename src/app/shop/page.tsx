import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { Select } from "@/components/ui/Select";
import { getProducts } from "@/server/products";

export const metadata: Metadata = {
  title: "Shop",
};

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : "";
  const size =
    typeof sp.size === "string" && ["S", "M", "L", "XL"].includes(sp.size)
      ? (sp.size as "S" | "M" | "L" | "XL")
      : "";

  let products = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Optionally return a custom error UI or an empty state
    return <Container className="py-10">Error loading products. Please check database connection.</Container>;
  }

  const categories = uniq(products.map((p) => p.category ?? "Essentials")).sort();

  const filtered = products.filter((p) => {
    const catOk = !category || (p.category ?? "Essentials") === category;
    const sizeOk = !size || p.sizes.includes(size);
    return catOk && sizeOk;
  });

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shop</h1>
          <p className="mt-2 text-sm text-muted">
            Minimal staples for modern wardrobes.
          </p>
        </div>

        <form className="grid grid-cols-2 gap-3 sm:w-[420px]" action="/shop">
          <div>
            <label className="mb-2 block text-xs text-muted">Category</label>
            <Select name="category" defaultValue={category}>
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-xs text-muted">Size</label>
            <Select name="size" defaultValue={size}>
              <option value="">All</option>
              {["S", "M", "L", "XL"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-span-2 text-xs text-muted">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
          </div>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </Container>
  );
}
