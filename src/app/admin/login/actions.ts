"use server";

import { z } from "zod";

import { setAdminSession } from "@/lib/admin-auth";

const LoginSchema = z.object({
  password: z.string().min(1),
});

export type AdminLoginState =
  | { ok: true }
  | { ok: false; message: string };

export async function adminLogin(
  _prev: AdminLoginState | null,
  formData: FormData,
): Promise<AdminLoginState> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return {
      ok: false,
      message: "ADMIN_PASSWORD is not set on the server.",
    };
  }

  try {
    const parsed = LoginSchema.parse({
      password: String(formData.get("password") || ""),
    });

    if (parsed.password !== adminPassword) {
      return { ok: false, message: "Invalid password." };
    }

    await setAdminSession();
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Login failed.";
    return { ok: false, message };
  }
}

