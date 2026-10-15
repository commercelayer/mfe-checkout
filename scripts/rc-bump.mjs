import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { rcLocalPath } from "./rc-local-path.mjs"

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
)
const manifest = path.join(repoRoot, "package.json")

// Matches every pkg.pr.new URL for this library, whatever the package name and
// whatever key it sits under.
const URL_PATTERN =
  /(pkg\.pr\.new\/commercelayer\/commercelayer-react-components\/@commercelayer\/[a-z-]+@)([0-9a-f]{7,40})/g

const sha = process.argv[2] ?? currentSha()
const before = fs.readFileSync(manifest, "utf8")
const seen = new Set()

const after = before.replace(URL_PATTERN, (_match, prefix, oldSha) => {
  seen.add(oldSha)
  return `${prefix}${sha}`
})

if (after === before) {
  console.log(`Already at ${sha}, nothing to do.`)
  process.exit(0)
}

fs.writeFileSync(manifest, after)
console.log(`react-components preview: ${[...seen].join(", ")} -> ${sha}`)

execFileSync("pnpm", ["install"], { cwd: repoRoot, stdio: "inherit" })

function currentSha() {
  const target = rcLocalPath()
  const head = execFileSync(
    "git",
    ["-C", target, "rev-parse", "--short=7", "HEAD"],
    { encoding: "utf8" },
  ).trim()
  console.log(`Using HEAD of ${target}: ${head}`)
  return head
}
