import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export function AdminHeader() {
  return (
    <header className="border-b border-border/80 bg-bg/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="text-sm font-semibold tracking-[0.22em] text-fg"
          >
            ZEN · ADMIN
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted">
            <Link className="hover:text-fg" href="/admin/products/new">
              Add product
            </Link>
            <Link className="hover:text-fg" href="/shop">
              View store
            </Link>
          </nav>
        </div>
        <AdminLogoutButton />
      </Container>
    </header>
  );
}

