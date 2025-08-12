// next.config.js
const nextBuildId = require("next-build-id");

const shouldAnalyzeBundles = process.env.ANALYZE === "true";

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  eslint: {},
  output: process.env.NODE_ENV === "production" ? "export" : "standalone",
  distDir: "out/dist",
  poweredByHeader: false,
  webpack: (config) => config,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH
    ? `${process.env.NEXT_PUBLIC_BASE_PATH}/`
    : undefined,
  pageExtensions: ["page.tsx"],
  generateBuildId: () => nextBuildId({ dir: __dirname }),
  logging: {
    incomingRequests: process.env.NODE_ENV !== "production", // true in dev
  },
};

// Rewrite: in dev ONLY, riscrivi tutte le richieste tranne API, _next e favicon verso la root per fallback SPA
if (process.env.NODE_ENV !== "production") {
  nextConfig = {
    ...nextConfig,
    async rewrites() {
      return [
        {
          source: "/((?!api|_next|favicon.ico).*)",
          destination: "/",
        },
      ];
    },
  };
}

// Bundle analyzer abilitato con flag ANALYZE=true
if (shouldAnalyzeBundles) {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
