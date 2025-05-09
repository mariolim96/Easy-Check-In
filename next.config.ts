import { env } from "node:process";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true,
  experimental: {
    reactCompiler: env.NODE_ENV === "production",
    // dynamicIO: true,
    ppr: true,
    // useCache: true,
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
