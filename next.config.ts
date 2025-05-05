import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    FREE_USER_TTS_LIMIT_PER_MINUTE: process.env.FREE_USER_TTS_LIMIT_PER_MINUTE || '1',
    NEXT_PUBLIC_FREE_USER_TTS_LIMIT_PER_MINUTE: process.env.FREE_USER_TTS_LIMIT_PER_MINUTE || '1',
  },
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
