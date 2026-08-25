// @ts-check

const fs = require("node:fs")
const path = require("node:path")
const nextBuildId = require("next-build-id")

const shouldAnalyzeBundles = process.env.ANALYZE === "true"

// --- react-components local mode --------------------------------------------
// Set CL_RC_LOCAL_PATH in .env.local to the path of a commercelayer-react-
// components checkout (relative to this repo, or absolute) and the three
// @commercelayer/* packages resolve from that checkout's dist/ instead of
// node_modules. Keep `pnpm rc:watch` running alongside `pnpm dev`.
// package.json is deliberately untouched, so deploys keep using pkg.pr.new.
// Next skips .env.local entirely when NODE_ENV is "test", which is how Playwright runs the
// dev server — so relying on Next to load this would leave local mode silently off in the
// one scenario it exists for. Read the file ourselves when the variable is not already set.
function readLocalPathFromEnvFile() {
  const envFile = path.join(__dirname, ".env.local")
  if (!fs.existsSync(envFile)) return undefined
  const match = fs
    .readFileSync(envFile, "utf8")
    .match(/^\s*CL_RC_LOCAL_PATH\s*=\s*(.+?)\s*$/m)
  return match?.[1].replace(/^["']|["']$/g, "")
}

const rcLocalPathSetting =
  process.env.CL_RC_LOCAL_PATH ?? readLocalPathFromEnvFile()

const rcLocalRoot = rcLocalPathSetting
  ? path.resolve(__dirname, rcLocalPathSetting)
  : undefined

const rcPackages = [
  "@commercelayer/core-components",
  "@commercelayer/react-hooks-components",
  "@commercelayer/react-components",
]

// The local dist requests these by bare specifier, which would resolve against
// the library checkout's own node_modules and give us a second copy. The SDK in
// particular is what the "@commercelayer/sdk" override in pnpm-workspace.yaml is
// holding together; two copies and Order stops being assignable again.
const rcSingletons = [
  "@commercelayer/sdk",
  "@commercelayer/organization-config",
]

/** @returns {Record<string, string> | undefined} */
function resolveRcLocalEntries() {
  if (!rcLocalRoot) return undefined

  if (process.env.NODE_ENV === "production" || process.env.CI) {
    throw new Error(
      `CL_RC_LOCAL_PATH is set (${rcLocalRoot}) during a production/CI build. ` +
        "That would bundle a path from a developer machine. Unset it and rebuild.",
    )
  }

  if (process.env.TURBOPACK) {
    throw new Error(
      "react-components local mode only works with webpack. Turbopack ignores " +
        "resolveAlias for these packages and silently serves the published copy " +
        "from node_modules, so you would be testing the wrong code. Use " +
        "`pnpm dev`, which passes --webpack.",
    )
  }

  /** @type {Record<string, string>} */
  const entries = {}
  for (const name of rcPackages) {
    const entry = path.join(
      rcLocalRoot,
      "packages",
      name.replace("@commercelayer/", ""),
      "dist/index.js",
    )
    if (!fs.existsSync(entry)) {
      throw new Error(
        `react-components local mode: ${entry} does not exist. ` +
          `Run \`pnpm rc:watch\` (or \`pnpm build\` inside ${rcLocalRoot}) first.`,
      )
    }
    entries[name] = entry
  }
  return entries
}

const rcLocalEntries = resolveRcLocalEntries()

const rcSingletonAliases = rcLocalEntries
  ? Object.fromEntries(
      rcSingletons.map((name) => [
        name,
        path.resolve(__dirname, "node_modules", name),
      ]),
    )
  : {}

if (rcLocalEntries) {
  console.log(`\n▲ @commercelayer/react-components: LOCAL -> ${rcLocalRoot}\n`)
}

/** @type { import('next').NextConfig } */
let nextConfig = {
  reactStrictMode: true,
  // Force a single copy of React/React-DOM to avoid duplicate-React issues.
  // Mirrored across both bundlers: `turbopack` (Next 16 default) and `webpack`
  // (used when building with the `--webpack` flag).
  turbopack: {
    resolveAlias: {
      react: "./node_modules/react",
      "react-dom": "./node_modules/react-dom",
    },
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      // `$` marks an exact match. Without it these aliases swallow deep paths
      // too, and `@commercelayer/sdk/bundle` — which this app imports — would
      // resolve to a directory that has no such file, bypassing the exports map.
      ...Object.fromEntries(
        Object.entries({ ...rcLocalEntries, ...rcSingletonAliases }).map(
          ([name, target]) => [`${name}$`, target],
        ),
      ),
    }
    return config
  },
  // The local dist lives outside this project's root.
  ...(rcLocalEntries ? { experimental: { externalDir: true } } : {}),
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
