import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatMoney } from "@/lib/money";
import { getProducts } from "@/server/products";
import { getOrders } from "@/server/orders";
import { adminDeleteProduct, adminUpdateOrderStatus } from "@/app/admin/(protected)/actions";

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.28em] text-muted">DASHBOARD</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-2 text-sm text-muted">
            Manage products, inventory, and view incoming orders.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Products</h2>
        <div className="mt-4 grid gap-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {p.id} · {p.category} · Stock: {p.stock}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{formatMoney(p.price)}</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/products/${p.id}/edit`}>Edit</Link>
                </Button>
                <form action={adminDeleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <Button variant="ghost" size="sm" type="submit">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
          {products.length === 0 ? (
            <div className="rounded-xl border border-border bg-subtle p-5 text-sm text-muted">
              No products yet.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">Orders</h2>
        <div className="mt-4 grid gap-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{o.id}</p>
                  <p className="mt-1 text-xs text-muted">
                    {o.created_at ? new Date(o.created_at).toLocaleString() : "—"} · {o.email} · {o.phone}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold">
                    {formatMoney(o.total_amount)}
                  </p>

                  <form action={adminUpdateOrderStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={o.id} />

                    <Select name="status" defaultValue={o.status} className="h-9">
                      {["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>

                    <Button type="submit" variant="outline" size="sm">
                      Update
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 ? (
            <div className="rounded-xl border border-border bg-subtle p-5 text-sm text-muted">
              No orders yet.
            </div>
          ) : null}
        </div>
      </section>
    </Container>
  );
}

