import { PlaywrightTestConfig, devices } from "@playwright/test"
import dotenv from "dotenv"

import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") })

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

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  // webServer: {
  //   command: "yarn start",
  //   port: 5000,
  //   timeout: 120 * 1000,
  //   reuseExistingServer: false,
  // },

  use: {
    trace: "on-first-retry",
    // Browser options
    // headless: true,
    // slowMo: 50,
    // Context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // Artifacts
    screenshot: "only-on-failure",
    video: "retry-with-video",
  },
  forbidOnly: false,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          devtools: false,
        },
      },
    },
  ],
}
export default config
