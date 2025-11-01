import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  // Development optimizations
  experimental: {
    // Optimize CSS processing in development
    optimizePackageImports: ["@tanstack/react-query", "react-hot-toast"]
  },
  // Faster development builds
  ...(process.env.NODE_ENV === "development" && {
    // Disable these in development for faster compilation
    typescript: {
      ignoreBuildErrors: false // Keep false to catch errors
    },
    eslint: {
      ignoreDuringBuilds: false
    }
  }),
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co"
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com"
      }
    ]
  }
};

export default nextConfig;
