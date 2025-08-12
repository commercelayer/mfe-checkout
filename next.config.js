// @ts-check

const nextBuildId = require("next-build-id")

const shouldAnalyzeBundles = process.env.ANALYZE === "true"

/** @type { import('next').NextConfig } */
let nextConfig = {
  reactStrictMode: true,
  output: process.env.NODE_ENV === "production" ? "export" : "standalone",
  distDir: "out/dist",
  poweredByHeader: false,
  // When when app is exported as SPA and served in a sub-folder
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH
    ? `${process.env.NEXT_PUBLIC_BASE_PATH}/`
    : undefined,
  generateBuildId: () => nextBuildId({ dir: __dirname }),
}

// rewrite rules affect only development mode, since Next router will return 404 for paths that only exist in react-router
if (process.env.NODE_ENV !== "production") {
  nextConfig = {
    ...nextConfig,
    async rewrites() {
      return [
        {
          source: "/:any*",
          destination: "/",
        },
      ]
    },
  }
}

if (shouldAnalyzeBundles) {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  })
  nextConfig = withBundleAnalyzer(nextConfig)
}

module.exports = nextConfig
