import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The original BloodAid frontend is intentionally retained as static assets
  // so its existing visual design and interactions remain unchanged.
};

export default nextConfig;
