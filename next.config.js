// next.config.js
const nextBuildId = require("next-build-id");

const shouldAnalyzeBundles = process.env.ANALYZE === "true";

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  eslint: {},
  output: process.env.NODE_ENV === "production" ? "export" : "standalone",
  distDir: "out/dist",
  images: {
    remotePatterns: [
 new URL ("https://a-us.storyblok.com/**")
    ],
  },
  poweredByHeader: false,
  webpack: (config) => config,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH
    ? `${process.env.NEXT_PUBLIC_BASE_PATH}/`
    : undefined,
  pageExtensions: ["page.tsx", "route.ts"],
  generateBuildId: () => nextBuildId({ dir: __dirname }),
  logging: {
    incomingRequests: process.env.NODE_ENV !== "production", // true in dev
  },
};

// rewrite rules affect only development mode, since Next router will return 404 for paths that only exist in react-router
if (process.env.NODE_ENV !== "production") {
  nextConfig = {
    ...nextConfig,
    async rewrites() {
      return [
        {
          source: "/((?!api|_next|favicon.ico).*)",
          destination: "/",
        },
      ]
    },
  }
}

// Bundle analyzer abilitato con flag ANALYZE=true
if (shouldAnalyzeBundles) {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
