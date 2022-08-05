import { PlaywrightTestConfig, devices } from "@playwright/test"
import dotenv from "dotenv"

import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") })

console.log(process.env.CI)

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  // Timeout per test
  timeout: 60 * 1000,
  // Test directory
  testDir: "specs/e2e",
  // If a test fails, retry it additional 2 times
  retries: 2,
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: "test-results/",
  workers: 2,
  maxFailures: 2,

  use: {
    // Retry a test if its failing with enabled tracing. This allows you to analyse the DOM, console logs, network traffic etc.
    // More information: https://playwright.dev/docs/trace-viewer
    trace: "retry-with-trace",
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // Artifacts
    screenshot: "only-on-failure",
    video: "retry-with-video",
  },

  projects: [
    {
      name: "Chromium",
      use: {
        // Configure the browser to use.
        browserName: "chromium",
        // Any Chromium-specific options.
        headless: true,
        viewport: { width: 1200, height: 900 },
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        ignoreHTTPSErrors: true,
        launchOptions: {
          devtools: true,
        },
      },
    },
  ],
}
export default config
