import { put, list, del } from "@vercel/blob";

export type BlobJsonOptions = {
  pathname: string;
  fallback: unknown;
};

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch blob: ${res.status}`);
  return (await res.json()) as T;
}

export async function readJsonBlob<T>({ pathname, fallback }: BlobJsonOptions) {
  if (!hasBlobToken()) return fallback as T;

  const { blobs } = await list({ prefix: pathname, limit: 10 });
  const exact = blobs.find((b) => b.pathname === pathname);
  if (!exact) return fallback as T;
  return await fetchJson<T>(exact.url);
}

export async function writeJsonBlob(pathname: string, data: unknown) {
  if (!hasBlobToken()) {
    throw new Error(
      "Missing BLOB_READ_WRITE_TOKEN. Set it in .env.local to enable persistence.",
    );
  }
  const body = JSON.stringify(data, null, 2);
  const blob = await put(pathname, body, {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json; charset=utf-8",
  });
  return blob;
}

export async function deleteBlobByUrl(url: string) {
  if (!hasBlobToken()) return;
  if (!url.startsWith("https://")) return;
  await del(url);
}

