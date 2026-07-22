import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    domains: ["media.istockphoto.com"],
  },
};

export default nextConfig;
