"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { adminLogin, type AdminLoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AdminLoginForm() {
  const router = useRouter();
  const [state, action, pending] = React.useActionState<
    AdminLoginState | null,
    FormData
  >(
    adminLogin,
    null,
  );

  React.useEffect(() => {
    if (state?.ok) {
      router.push("/admin");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={action} className="grid gap-4">
      <div>
        <label className="mb-2 block text-xs text-muted">Password</label>
        <Input name="password" type="password" autoComplete="current-password" required />
      </div>
      {state && !state.ok ? (
        <div className="rounded-xl border border-border bg-subtle p-3 text-sm text-muted">
          {state.message}
        </div>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

