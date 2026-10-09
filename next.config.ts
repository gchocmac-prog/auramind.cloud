import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Emit directory-style routes (out/privacy/index.html) so the static export
  // resolves cleanly on GitHub Pages.
  trailingSlash: true,
  // A static export has no server, so the default next/image loader emits
  // `/_next/image?url=...` URLs that 404 in production (the optimizer endpoint
  // only exists when a server runs). This broke every next/image on the site:
  // the header logo, the footer logo and the hero background. `unoptimized`
  // makes next/image emit the real static path (`/logo/...`) instead.
  images: { unoptimized: true },
  reactCompiler: true,
};

export default nextConfig;
