import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      },
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
