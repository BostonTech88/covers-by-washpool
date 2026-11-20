import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build-time opt-in: enable only after verifying that the hosting proxy
  // preserves the visitor's Host for BOTH apex and www. See docs/www-redirect.md.
  redirects: async () =>
    process.env.ENABLE_WWW_HOST_REDIRECT === "true"
      ? [
          {
            source: "/:path*",
            has: [{ type: "host", value: "coversbywashpool\\.com" }],
            destination: "https://www.coversbywashpool.com/:path*",
            permanent: true,
          },
        ]
      : [],

  generateBuildId: async () => {
    return Date.now().toString();
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  headers: async () => [
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
      ],
    },
  ],
};

export default nextConfig;
