import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/api/favicon',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
