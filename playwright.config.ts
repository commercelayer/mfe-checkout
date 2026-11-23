// Resolve the env once here, in the main process: workers and the dev server
// started by `webServer` inherit the result instead of each fetching from AWS.
import "varlock/auto-load"
import type { PlaywrightTestConfig } from "@playwright/test"
import { ENV } from "varlock/env"

// Playwright starts its own dev server on this port. It is deliberately not 3000:
// that one is reserved for a dev server started by hand, and `reuseExistingServer`
// silently adopts whatever already listens there — a leftover `pnpm serve` is enough
// to run the whole suite against a stale build without a word of warning.
//
// It is also the origin the payment_sessions tests load Adyen's Drop-in from.
// Adyen validates a client key against an allow-list of origins matched on
// scheme, host *and* port, so the Drop-in only loads on a port registered in the
// Customer Area: change this only together with that allow-list.
//
// E2E_BASE_PORT still drives playwright.config.ci.ts, which attaches to a server
// someone else started instead of starting one.
const E2E_PORT = 4000

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  // Timeout per test
  timeout: 1 * 80 * 1000,
  // Timeout per web-first assertion. Kept well below the test timeout so a
  // failed expect() reports expected-vs-actual instead of eating the whole test.
  expect: { timeout: 10 * 1000 },
  // Test directory
  testDir: "specs/e2e",
  // If a test fails, retry it additional 2 times
  retries: 0,
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: "test-results/",
  workers: 1,
  maxFailures: 2,

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  webServer: {
    command: `PORT=${E2E_PORT} pnpm run dev`,
    port: E2E_PORT,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    // `pnpm run dev` goes through `varlock run`, which starts Next in a process
    // group of its own and forwards SIGTERM/SIGINT to it. Playwright's default
    // SIGKILL ends varlock before it can forward anything and leaves Next
    // listening on E2E_PORT, where the next run would silently reuse it.
    gracefulShutdown: { signal: "SIGTERM", timeout: 10 * 1000 },
  },

  use: {
    // Keep a trace for every failed test so it can be analysed after the fact (DOM,
    // console logs, network traffic). "retry-with-trace" produced nothing here, because
    // retries are 0 locally and that mode only traces a retry. Matches the CI config.
    // More information: https://playwright.dev/docs/trace-viewer
    trace: "retain-on-failure",
    // Headless by default: a full run is 261 tests on a single worker and used
    // to open a browser window for every one of them. Pass --headed to watch a
    // specific test, or --debug / test:ui when you need to drive it by hand.
    viewport: { width: 1280, height: 720 },
    headless: false,
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
        viewport: { width: 1200, height: 900 },
        baseURL: `${ENV.E2E_BASE_PROTOCOL}://${ENV.E2E_BASE_URL}:${E2E_PORT}`,
        launchOptions: {
          // logger: {
          //   isEnabled: (name, severity) => true,
          //   log: (name, severity, message, args) =>
          //     console.log(name, severity, message, args),
          // },
          // slowMo: 100,
          // devtools: true,
        },
      },
    },
    // {
    //   name: "Mobile Safari",
    //   use: devices["iPhone 12"],
    // },
  ],
}
export default config
