import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  reactCompiler: true,
};

export default nextConfig;
