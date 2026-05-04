"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";
import { adminLogout } from "@/components/admin/logout-action";

export function AdminLogoutButton() {
  const [pending, start] = React.useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      disabled={pending}
      onClick={() => start(() => adminLogout())}
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}

