import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Emit directory-style routes (out/privacy/index.html) so the static export
  // resolves cleanly on GitHub Pages.
  trailingSlash: true,
  reactCompiler: true,
};

export default nextConfig;
