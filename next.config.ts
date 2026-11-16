import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The demo-mode route checks which lookbook photos exist, so ship them with it.
  outputFileTracingIncludes: {
    "/api/generate": ["./public/lookbook/**"],
  },
};

export default nextConfig;
