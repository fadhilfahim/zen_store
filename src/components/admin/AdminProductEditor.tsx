"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Product } from "@/lib/domain";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

import {
  adminSaveProduct,
  adminUploadProductImage,
  adminRemoveProductImage,
} from "@/app/admin/(protected)/products/actions";

export function AdminProductEditor({
  product,
  mode,
}: {
  product: Product;
  mode: "new" | "edit";
}) {
  const router = useRouter();

  const [images, setImages] = useState<string[]>(product.images ?? []);

  // ✅ FIX: always safe JSON (never undefined/null)
  const imagesJson = JSON.stringify(images || []);

  useEffect(() => {
    setImages(product.images ?? []);
  }, [product.images]);

  return (
    <Container className="py-10">
      {/* HEADER */}
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
        {/* FORM */}
        <div className="lg:col-span-7">
          <form
            action={adminSaveProduct}
            className="grid gap-4 rounded-xl border border-border bg-card p-5"
          >
            {/* FIX: always valid string */}
            {/* <input
              type="hidden"
              name="imagesJson"
              value={imagesJson}
            /> */}

            {/* ID + CATEGORY */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-muted">
                  Product ID
                </label>
                {mode === "edit" ? (
                  <Input
                    name="id"
                    defaultValue={product.id}
                    readOnly
                  />
                ) : (
                  <Input
                    value="Auto-generated"
                    readOnly
                  />
                )}
              </div>
              

              <div>
                <label className="mb-2 block text-xs text-muted">
                  Category
                </label>
                <Input
                  name="category"
                  defaultValue={product.category || ""}
                />
              </div>
            </div>

            {/* NAME */}
            <div>
              <label className="mb-2 block text-xs text-muted">
                Name
              </label>
              <Input
                name="name"
                defaultValue={product.name || ""}
                required
              />
            </div>

            {/* PRICE + STOCK */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-muted">
                  Price
                </label>
                <Input
                  name="price"
                  type="number"
                  min={0}
                  defaultValue={product.price ?? 0}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-muted">
                  Stock
                </label>
                <Input
                  name="stock"
                  type="number"
                  min={0}
                  defaultValue={product.stock ?? 0}
                  required
                />
              </div>
            </div>

            {/* COLORS + SIZES */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-muted">
                  Colors (CSV)
                </label>
                <Input
                  name="colors"
                  defaultValue={(product.colors ?? []).join(", ")}
                  placeholder="Black, White, Grey"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-muted">
                  Sizes (CSV)
                </label>
                <Input
                  name="sizes"
                  defaultValue={(product.sizes ?? []).join(", ")}
                  placeholder="S, M, L, XL"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-xs text-muted">
                Description
              </label>
              <Textarea
                name="description"
                defaultValue={product.description || ""}
                required
              />
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <Button type="submit">
                {mode === "new" ? "Create product" : "Save changes"}
              </Button>

              <Button asChild type="button" variant="outline">
                <Link
                  href={
                    mode === "new"
                      ? "/shop"
                      : `/product/${product.id}`
                  }
                >
                  Preview
                </Link>
              </Button>
            </div>
          </form>
        </div>

        {/* IMAGES */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-semibold">Images</p>

            <p className="mt-1 text-xs text-muted">
              Upload product images
            </p>

            {/* UPLOAD */}
            {mode === "edit" ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const fileInput = e.currentTarget.querySelector(
                    'input[type="file"]'
                  ) as HTMLInputElement;

                  const file = fileInput?.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("id", product.id);
                  formData.append("image", file);

                  const updated =
                    await adminUploadProductImage(formData);

                  setImages(updated.images ?? []);
                }}
                className="mt-4 grid gap-3"
              >
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  className="block w-full text-sm"
                />

                <Button type="submit" variant="outline">
                  Upload image
                </Button>
              </form>
            ) : (
              <div className="mt-4 text-sm text-muted">
                Create product first
              </div>
            )}

            {/* IMAGE GRID */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {images.map((url) => (
                <div
                  key={url}
                  className="rounded-xl border border-border bg-subtle p-2"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    {/* Use plain <img> to avoid next/image domain restrictions for Supabase public URLs. */}
                    <img
                      src={url}
                      alt="product"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  {mode === "edit" && (
                    <button
                      onClick={async () => {
                        const formData = new FormData();
                        formData.append("id", product.id);
                        formData.append("url", url);

                        const updated =
                          await adminRemoveProductImage(formData);

                        setImages(updated.images ?? []);
                      }}
                      className="w-full mt-2 text-sm text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="mt-4 text-sm text-muted">
                No images yet
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}