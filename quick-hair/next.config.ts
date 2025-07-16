import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // skipMiddlewareUrlNormalize: true,
  // experimental: {
  //   serverActions: {
  //     allowedOrigins: ['x9q10w2c-3000.inc1.devtunnels.ms', 'localhost:3000', 'localhost:3001'],
  //   },
  // },
};

export default nextConfig;


