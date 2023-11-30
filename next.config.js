// @ts-check

const nextBuildId = require("next-build-id")

const shouldAnalyzeBundles = process.env.ANALYZE === "true"

/** @type { import('next').NextConfig } */
let nextConfig = {
  reactStrictMode: true,
  eslint: {},
  output: process.env.NODE_ENV === "production" ? "export" : "standalone",
  distDir: "out/dist",
  poweredByHeader: false,
  swcMinify: false,
  webpack: (config, { webpack }) => {
    const AdyenWebExcludedLocales = new Set([
      "cs-CZ",
      "el-GR",
      "es-ES",
      "hr-HR",
      "ja-JP",
      "ko-KR",
      "ru-RU",
      "zh-TW",
      "zh-CN",
      "hu-HU",
      "ro-RO",
      "sk-SK",
      "pt-PT",
      "pt-BR",
      "sl-SI",
      "fi-FI",
      "ar",
      "nl-NL",
      "sv-SE",
      "da-DK",
      "no-NO",
    ])

    const adyenIgnorePluginConfig = new webpack.IgnorePlugin({
      checkResource(resource, context) {
        if (!/@adyen\/adyen-web\/dist\/es/.test(context)) return false

        // Extract the filename from the resource path
        const parts = resource.split("/")
        const filenameWithExtension = parts[parts.length - 1]

        // Remove the file extension
        const filename = filenameWithExtension.replace(/\.[^/.]+$/, "")

        return AdyenWebExcludedLocales.has(filename)
      },
    })

    config.plugins.push(adyenIgnorePluginConfig)
    return config
  },
  // When when app is exported as SPA and served in a sub-folder
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH
    ? `${process.env.NEXT_PUBLIC_BASE_PATH}/`
    : undefined,
  // https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory
  pageExtensions: ["page.tsx"],
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
