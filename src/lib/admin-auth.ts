import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "zen_admin";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev";
}

function b64url(input: Buffer) {
  return input
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function sign(payload: string) {
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest();
  return b64url(sig);
}

export async function setAdminSession(days = 7) {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000;
  const payload = String(exp);
  const value = `${payload}.${sign(payload)}`;
  const c = await cookies();
  c.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(exp),
  });
}

export async function clearAdminSession() {
  const c = await cookies();
  c.set(COOKIE_NAME, "", { path: "/", expires: new Date(0) });
}

export function isAdminFromCookie(cookieValue?: string | null) {
  if (!cookieValue) return false;
  const [payload, sig] = cookieValue.split(".");
  if (!payload || !sig) return false;
  if (sign(payload) !== sig) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp)) return false;
  return Date.now() < exp;
}

export async function isAdmin() {
  const c = await cookies();
  const v = c.get(COOKIE_NAME)?.value;
  return isAdminFromCookie(v);
}

