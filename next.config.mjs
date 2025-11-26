/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "fonts.gstatic.com",
      "cdn.sanity.io",
      "sacontent.akbartravels.com",
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      // Redirect www to non-www (if you prefer non-www)
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.flymoon.sa", // Updated to your actual www domain
          },
        ],
        destination: "https://flymoon.sa/:path*", // Updated to your actual non-www domain
        permanent: true,
      },
      // Add any other specific redirects you need
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
