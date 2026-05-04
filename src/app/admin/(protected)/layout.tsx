import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { isAdmin } from "@/lib/admin-auth";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div>
      <AdminHeader />
      {children}
    </div>
  );
}

