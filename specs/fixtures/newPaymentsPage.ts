import { execFile } from "node:child_process"
import path from "node:path"
import { promisify } from "node:util"
import {
  CommerceLayer,
  type CommerceLayerClient,
  type Order,
  type PaymentSession,
} from "@commercelayer/sdk"
import { test as base, expect } from "@playwright/test"
import dotenv from "dotenv"

import { PaymentSessionsCheckoutPage } from "./PaymentSessionsCheckoutPage"

const repoRoot = path.resolve(__dirname, "../..")

dotenv.config({ path: path.join(repoRoot, ".env.local"), quiet: true })

/**
 * Every client pins the version. Omitted, the SDK builds unversioned URLs and
 * talks to a different API surface than the application does — `payment_sessions`
 * do not exist there at all.
 */
const API_VERSION = "2026-05"

/** Attempts before a fixture that cannot be minted fails the test. */
const MINT_ATTEMPTS = 3

/**
 * Waits between minting attempts, in milliseconds.
 *
 * They grow because the failure worth retrying is `Too Many Requests`: this
 * suite mints an order per test and a gift card for most of them, and the limit
 * is counted per organization. Retrying straight away spends more of the quota
 * that has just run out — so the first retry backs off and the second backs off
 * properly, which is the difference between recovering and failing three times
 * in a row.
 */
const MINT_BACKOFF_MS = [3_000, 15_000]

/** Session states that count toward the order's paid amount. */
const PAYMENT_TAKEN_STATES = ["authorized", "paid", "partially_paid"]

const run = promisify(execFile)

export interface NewPaymentsOrder {
  id: string
  accessToken: string
}

/**
 * Mint fixtures by running `scripts/new-payments.mjs`.
 *
 * The script is the single place that knows the order this checkout needs — an
 * address, a line item and, crucially, an assigned shipping method, without
 * which the checkout stops on Delivery and the payment step never renders. It
 * prints one line to stdout and everything else to stderr precisely so it can
 * be captured, so running it beats re-implementing the sequence here and
 * letting the two drift.
 *
 * It is *not* `tokenizedPage.ts`: that harness builds orders against the `E2E_*`
 * organization, which has no `payment_sessions` setup at all. These use the
 * `NP_*` block.
 */
async function mint(...args: string[]): Promise<string> {
  // Minting is setup, not the behaviour under test, and it talks to a shared
  // staging organization over the network — where a connection failure is
  // something that happens. A bounded retry keeps a blip from failing a test
  // that never got as far as opening the checkout; the flow itself is not
  // retried, so a checkout that genuinely does not work still fails.
  let lastError: unknown
  for (let attempt = 1; attempt <= MINT_ATTEMPTS; attempt++) {
    try {
      const { stdout } = await run(
        "node",
        ["scripts/new-payments.mjs", ...args],
        { cwd: repoRoot },
      )
      const value = stdout.trim()
      if (value.length === 0) {
        throw new Error(
          `scripts/new-payments.mjs ${args.join(" ")} printed nothing. ` +
            "Check the NP_* credentials in .env.local.",
        )
      }
      return value
    } catch (error) {
      lastError = error
      const backoff = MINT_BACKOFF_MS[attempt - 1]
      if (backoff != null) {
        await new Promise((resolve) => setTimeout(resolve, backoff))
      }
    }
  }
  throw new Error(
    `Could not mint a fixture with \`new-payments.mjs ${args.join(" ")}\` ` +
      `after ${MINT_ATTEMPTS} attempts:\n\n${describe(lastError)}`,
  )
}

/** The script prints the API's own wording to stderr, so keep it. */
function describe(error: unknown): string {
  const stderr = (error as { stderr?: string })?.stderr
  if (typeof stderr === "string" && stderr.trim().length > 0)
    return stderr.trim()
  return error instanceof Error ? error.message : String(error)
}

async function mintOrder({
  asCustomer = false,
} = {}): Promise<NewPaymentsOrder> {
  const printed = asCustomer
    ? await mint("order", "--customer")
    : await mint("order")
  // Positional groups: this package targets es5, where named ones are a
  // compile error.
  const match = printed.match(/^\/([^?]+)\?accessToken=(.+)$/)
  if (match == null) {
    throw new Error(`Could not read an order out of: ${printed}`)
  }
  return { id: match[1], accessToken: match[2] }
}

function client(accessToken: string): CommerceLayerClient {
  return CommerceLayer({
    organization: process.env.NP_SLUG as string,
    domain: process.env.NP_DOMAIN,
    accessToken,
    apiVersion: API_VERSION,
  })
}

/**
 * Read the order back with its payment sessions.
 *
 * The token minted with the order is a sales-channel token and is enough for
 * this, so no integration credentials are involved.
 *
 * `payment_sessions.payment_setting` is included because a session's own
 * attributes cannot say which setting it belongs to: without the include,
 * `payment_setting` comes back as a bare linkage and `.type` is `undefined` —
 * which reads as an assertion failure about the wrong thing.
 */
export async function readOrder(order: NewPaymentsOrder): Promise<Order> {
  return await client(order.accessToken).orders.retrieve(order.id, {
    include: ["payment_sessions", "payment_sessions.payment_setting"],
  })
}

/**
 * Assert the order was placed and that the money taken matches it exactly.
 *
 * This is the assertion the suite exists for. The UI is not the source of
 * truth for what was charged — a checkout that looks entirely correct can still
 * have taken the wrong amount — and a payment setting added later (Stripe,
 * Adyen) gets its session sized by the same rules, so a sum that stops matching
 * the total is the first thing that will break.
 *
 * `payment_status` is checked against both taken states rather than pinned to
 * `authorized`: a setting that captures immediately reports `paid`, and that is
 * not a regression.
 */
export async function expectPaymentToCoverTheOrder(
  order: NewPaymentsOrder,
  expected: { sessions: number },
): Promise<void> {
  const placed = await readOrder(order)
  const sessions: PaymentSession[] = placed.payment_sessions ?? []
  const total = placed.total_amount_with_taxes_cents

  expect(placed.status).toBe("placed")
  expect(["authorized", "paid"]).toContain(placed.payment_status)
  expect(sessions).toHaveLength(expected.sessions)

  for (const session of sessions) {
    expect(
      PAYMENT_TAKEN_STATES,
      `session ${session.id} did not take its money`,
    ).toContain(session.status)
  }

  const taken = sessions.reduce(
    (sum, session) => sum + (session.amount_cents ?? 0),
    0,
  )
  expect(taken, `payment sessions took ${taken} for an order of ${total}`).toBe(
    total,
  )
}

interface FixtureType {
  /**
   * Whether the order is minted with a **customer** token rather than a guest
   * one, from `test.use({ customerOrder: true })`.
   *
   * It changes more than the greeting: `payment_wallets` are grantable only to
   * the customer who owns them, so a saved card — and every flow that reuses
   * one — is unreachable on a guest order. Adyen's tokenization is gated the
   * same way, on the token rather than on the order.
   */
  customerOrder: boolean
  /** A fresh order on the `payment_sessions` model, already open on Payment. */
  checkout: PaymentSessionsCheckoutPage
  /** The order the checkout is showing, for reading back over the API. */
  newPaymentsOrder: NewPaymentsOrder
  /** Mint a purchased, activated gift card of `amount` and return its code. */
  mintGiftCard: (amount: number) => Promise<string>
}

export const test = base.extend<FixtureType>({
  // An option rather than a fixture, so a describe block can ask for one with
  // `test.use({ customerOrder: true })` and every test in it gets it.
  customerOrder: [false, { option: true }],

  /**
   * One order per test, never shared.
   *
   * Placing is not repeatable: a placed order renders the thank-you page
   * instead of the payment step, so a second test reusing it would assert
   * against the wrong screen. That rules out minting in `beforeAll`.
   */
  newPaymentsOrder: async ({ customerOrder }, use) => {
    await use(await mintOrder({ asCustomer: customerOrder }))
  },

  /**
   * Also one gift card per call, for the same reason in reverse: a spent code
   * comes back as "doesn't match any active gift card". A test that retries, or
   * that applies a card twice, needs a new one each time — so this is a
   * function rather than a value.
   */
  // Playwright reads the destructuring pattern to work out what a fixture
  // depends on and rejects any other form at runtime, so an empty pattern is
  // how it is told "nothing" — `(_, use)` fails with "First argument must use
  // the object destructuring pattern".
  // biome-ignore lint/correctness/noEmptyPattern: required by Playwright, see above
  mintGiftCard: async ({}, use) => {
    await use(async (amount: number) => await mint("gift-card", String(amount)))
  },

  checkout: async ({ page, newPaymentsOrder }, use) => {
    // Uncaught errors are collected rather than inspected in the DOM.
    // `next dev` renders its overlay into a <nextjs-portal> that is present on
    // every page whether anything went wrong or not, so its existence proves
    // nothing — but when it *is* showing an error it covers the page and
    // absorbs every click, and the test then fails as a click timing out on an
    // element Playwright can see perfectly well. `pageerror` fires for exactly
    // the uncaught exceptions and unhandled rejections that put it there.
    const pageErrors: string[] = []
    page.on("pageerror", (error) => {
      pageErrors.push(error.message)
    })

    const checkout = new PaymentSessionsCheckoutPage(page)
    await page.goto(
      `/${newPaymentsOrder.id}?accessToken=${newPaymentsOrder.accessToken}`,
    )
    await checkout.waitForPaymentStep()

    expect(
      pageErrors,
      "the checkout raised an uncaught error while loading, so the dev overlay is covering the page",
    ).toEqual([])

    await use(checkout)
  },
})

export { expect } from "@playwright/test"
// Re-exported so a test that has to control navigation itself — one installing
// a route before the first load — can build its own page object.
export {
  ADYEN_3DS_CARD,
  ADYEN_3DS_PASSWORD,
  PaymentSessionsCheckoutPage,
  payPalCredentials,
  STRIPE_CARD,
} from "./PaymentSessionsCheckoutPage"
