import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["@tanstack/react-query"]
  },
  ...(process.env.NODE_ENV === "development" && {
    typescript: {
      ignoreBuildErrors: false
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
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000"
      }
    ]
  }
};

export default nextConfig;
