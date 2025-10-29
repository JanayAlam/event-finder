import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      }
    ],
    domains: ["placehold.co", "ui-avatars.com"]
  }
};

export default nextConfig;
