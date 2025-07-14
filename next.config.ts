import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    skipMiddlewareUrlNormalize: true,
    experimental: {
    serverActions: {
      // trustedHosts: ['localhost:3000', 'x9q10w2c-3000.inc1.devtunnels.ms'],
      allowedOrigins:['x9q10w2c-3000.inc1.devtunnels.ms' , 'localhost:3000','localhost:3001'],
    },
  },
};

export default nextConfig;
// https://x9q10w2c-3000.inc1.devtunnels.ms/