import { AdminProductEditor } from "@/components/admin/AdminProductEditor";
import type { Product } from "@/lib/domain";

const empty: Product = {
  id: "",
  name: "",
  price: 0,
  description: "",
  images: [],
  colors: ["Black", "White", "Grey"],
  sizes: ["S", "M", "L", "XL"],
  stock: 0,
  category: "Essentials",
};

export default function AdminNewProductPage() {
  return <AdminProductEditor product={empty} mode="new" />;
}

