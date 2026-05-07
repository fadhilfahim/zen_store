import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client that bypasses RLS.
 * Used for admin actions like Storage uploads.
 */
export const supabaseAdmin = createClient(
  (() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
    return url;
  })(),
  (() => {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key)
      throw new Error(
        "Missing SUPABASE_SERVICE_ROLE_KEY (add it to .env.local)"
      );
    return key;
  })(),
);

