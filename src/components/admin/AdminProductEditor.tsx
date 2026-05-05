"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Product } from "@/lib/domain";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { adminRemoveProductImage, adminSaveProduct, adminUploadProductImage } from "@/app/admin/(protected)/products/actions";

export function AdminProductEditor({
  product,
  mode,
}: {
  product: Product;
  mode: "new" | "edit";
}) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product.images ?? []);
  const imagesJson = JSON.stringify(images);

  useEffect(() => {
    setImages(product.images ?? []);
  }, [product.images]);

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.28em] text-muted">PRODUCT</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {mode === "new" ? "Add product" : "Edit product"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Keep it clean — black, white, grey palette only.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">Back</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <form action={adminSaveProduct} className="grid gap-4 rounded-xl border border-border bg-card p-5">
            <input type="hidden" name="imagesJson" value={imagesJson} />

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-muted">Product ID</label>
                <Input name="id" defaultValue={product.id} readOnly={mode === "edit"} />
                <p className="mt-2 text-xs text-muted">
                  {mode === "new"
                    ? "Leave blank to auto-generate."
                    : "IDs are immutable once created."}
                </p>
              </div>
              <div>
                <label className="mb-2 block text-xs text-muted">Category</label>
                <Input name="category" defaultValue={product.category ?? ""} />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs text-muted">Name</label>
              <Input name="name" defaultValue={product.name} required />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-muted">Price</label>
                <Input name="price" type="number" min={0} defaultValue={product.price} required />
              </div>
              <div>
                <label className="mb-2 block text-xs text-muted">Stock</label>
                <Input name="stock" type="number" min={0} defaultValue={product.stock} required />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-muted">Colors (CSV)</label>
                <Input
                  name="colors"
                  defaultValue={(product.colors ?? []).join(", ")}
                  placeholder="Black, White, Grey"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-xs text-muted">Sizes (CSV)</label>
                <Input
                  name="sizes"
                  defaultValue={(product.sizes ?? ["S", "M", "L", "XL"]).join(", ")}
                  placeholder="S, M, L, XL"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs text-muted">Description</label>
              <Textarea name="description" defaultValue={product.description} required />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit">{mode === "new" ? "Create product" : "Save changes"}</Button>
              <Button asChild type="button" variant="outline">
                <Link href={mode === "new" ? "/shop" : `/product/${product.id}`}>Preview</Link>
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-semibold">Images</p>
            <p className="mt-1 text-xs text-muted">
              Uploads go to Vercel Blob (requires `BLOB_READ_WRITE_TOKEN`).
            </p>

            {mode === "edit" ? (
              <form
                action={async (formData) => {
                  const updated = await adminUploadProductImage(formData);
                  setImages(updated.images);
                }}
                className="mt-4 grid gap-3"
              >
                <input type="hidden" name="id" value={product.id} />
                <input
                  className="block w-full text-sm text-muted file:mr-4 file:rounded-xl file:border file:border-border file:bg-subtle file:px-4 file:py-2 file:text-sm file:font-medium file:text-fg hover:file:border-fg/40"
                  type="file"
                  name="image"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  required
                />
                <Button type="submit" variant="outline">
                  Upload image
                </Button>
              </form>
            ) : (
              <div className="mt-4 rounded-xl border border-border bg-subtle p-4 text-sm text-muted">
                Create the product first, then upload images.
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              {images.map((url) => {
                const isRemote = url.startsWith("http");
                return (
                  <div key={url} className="rounded-xl border border-border bg-subtle p-2">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-subtle">
                      <Image
                        src={url}
                        alt="Product image"
                        fill
                        className="object-cover"
                        unoptimized={isRemote}
                      />
                    </div>
                  {mode === "edit" ? (
                    <form
                      action={async (formData) => {
                        const updated = await adminRemoveProductImage(formData);
                        setImages(updated.images);
                      }}
                      className="mt-2"
                    >
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="url" value={url} />
                      <Button type="submit" variant="ghost" size="sm" className="w-full">
                        Remove
                      </Button>
                    </form>
                  ) : null}
                </div>
              );
            })}
            </div>

            {images.length === 0 ? (
              <div className="mt-4 rounded-xl border border-border bg-subtle p-4 text-sm text-muted">
                No images yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Container>
  );
}

