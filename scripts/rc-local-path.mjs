import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
)

const DEFAULT_PATH = "../commercelayer-react-components"

/**
 * Where the local react-components checkout lives.
 *
 * next.config.js reads CL_RC_LOCAL_PATH straight from process.env because Next
 * loads .env.local for us. Plain node scripts get no such treatment, so we read
 * the same file here rather than making you export the variable twice.
 */
export function rcLocalPath() {
  const fromEnv = process.env.CL_RC_LOCAL_PATH ?? fromEnvLocal()
  return path.resolve(repoRoot, fromEnv ?? DEFAULT_PATH)
}

function fromEnvLocal() {
  const envFile = path.join(repoRoot, ".env.local")
  if (!fs.existsSync(envFile)) return undefined
  const match = fs
    .readFileSync(envFile, "utf8")
    .match(/^\s*CL_RC_LOCAL_PATH\s*=\s*(.+?)\s*$/m)
  return match?.[1].replace(/^["']|["']$/g, "")
}
