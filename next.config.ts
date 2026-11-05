import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera una web estática (carpeta "out") lista para subir a Netlify.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
