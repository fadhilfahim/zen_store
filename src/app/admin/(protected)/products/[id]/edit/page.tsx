import { notFound } from "next/navigation";

import { AdminProductEditor } from "@/components/admin/AdminProductEditor";
import { getProduct } from "@/lib/store";

export const dynamic = 'force-dynamic';

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  return <AdminProductEditor product={product} mode="edit" />;
}

