const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

module.exports = withBundleAnalyzer({
  eslint: {},
  swcMinify: true,
  webpack: (config) => {
    return config
  },
})
