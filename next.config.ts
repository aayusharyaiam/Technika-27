import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { cpus: 2, webpackMemoryOptimizations: true },
};

export default nextConfig;
