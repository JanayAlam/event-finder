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
    domains: [
      "bhalothaki001.s3.ap-south-1.amazonaws.com",
      "placehold.co",
      "ui-avatars.com"
    ]
  }
};

export default nextConfig;
