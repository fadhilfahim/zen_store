import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md">
        <p className="text-xs tracking-[0.28em] text-muted">ADMIN</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Enter the admin password to manage products and orders.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-5">
          <AdminLoginForm />
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-muted">
          <Link className="hover:text-fg" href="/">
            Back to storefront
          </Link>
          <span>ZEN</span>
        </div>
      </div>
    </Container>
  );
}

