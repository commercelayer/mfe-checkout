import { spawn } from "node:child_process"
import fs from "node:fs"
import { rcLocalPath } from "./rc-local-path.mjs"

const target = rcLocalPath()

if (!fs.existsSync(target)) {
  console.error(
    `No react-components checkout at ${target}.\n` +
      "Set CL_RC_LOCAL_PATH in .env.local to point at yours.",
  )
  process.exit(1)
}

console.log(`Watching ${target} (all three packages, in parallel)\n`)

spawn("pnpm", ["--dir", target, "build:watch"], { stdio: "inherit" }).on(
  "exit",
  (code) => process.exit(code ?? 0),
)
