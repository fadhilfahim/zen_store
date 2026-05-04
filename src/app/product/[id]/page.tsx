import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { formatMoney } from "@/lib/money";
import { getProduct } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const images = product.images.length ? product.images : ["/zen-placeholder.svg"];

  return (
    <Container className="py-10">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((src, idx) => {
              const isRemote = src.startsWith("http");
              return (
                <div
                  key={`${src}_${idx}`}
                  className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-subtle"
                >
                  <Image
                    src={src}
                    alt={`${product.name} image ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={idx === 0}
                    unoptimized={isRemote}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="text-xs tracking-[0.28em] text-muted">{product.category}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-3 text-lg font-semibold">{formatMoney(product.price)}</p>
          <p className="mt-5 text-sm text-muted">{product.description}</p>

          <AddToCartForm product={product} />
        </div>
      </div>
    </Container>
  );
}

