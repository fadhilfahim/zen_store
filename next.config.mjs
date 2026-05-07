/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob public URLs
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "public.blob.vercel-storage.com" },
      // Local dev conveniences (optional)
      { protocol: "https", hostname: "*.vercel-storage.com" },
      // Supabase Storage public URLs
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;

