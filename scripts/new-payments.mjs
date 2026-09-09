/**
 * Fixtures for the payment_sessions payment components.
 *
 * Two subcommands, both printing one line to stdout and everything else to
 * stderr:
 *
 *   pnpm np:order              -> /<orderId>?accessToken=<jwt>
 *   pnpm np:gift-card 25       -> <CODE>
 *
 * To pipe the result, call node directly:
 *
 *   URL=$(node scripts/new-payments.mjs order)
 *
 * `pnpm run` writes its own "Already up to date / Done in Nms" to stdout — even
 * under `-s` — so capturing the pnpm form gives you those lines glued to the
 * value. The pnpm scripts are for reading, the node form is for capturing.
 *
 * Why this exists: driving the checkout by hand means a fresh order for every
 * run — placing one is not repeatable — and a fresh gift card whenever the last
 * was spent. See CLAUDE.md.
 *
 * The order sequence mirrors the one validated in the examples-new-payments
 * playground (`src/actions/create-order.ts`), including the last step: a
 * shipment with no shipping method leaves the checkout stuck on Delivery and
 * the payment step never renders.
 */

import path from "node:path"
import { fileURLToPath } from "node:url"
import { authenticate } from "@commercelayer/js-auth"
import { CommerceLayer } from "@commercelayer/sdk"
import dotenv from "dotenv"

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
)

dotenv.config({ path: path.join(repoRoot, ".env.local"), quiet: true })

// Every client instantiation pins the version. Omitted, the SDK builds
// unversioned URLs and talks to a different API surface than the app does.
const API_VERSION = "2026-05"

const DEFAULT_SKU_CODE = "SHIRTWLS000000FFFFFFLXXX"
const CUSTOMER_EMAIL = "john.doe@example.com"

// No fallback market: an unknown code must fail loudly rather than quietly
// billing a US order to an Italian address.
const ADDRESSES = {
  US: {
    first_name: "John",
    last_name: "Doe",
    line_1: "123 Main St",
    city: "New York",
    zip_code: "10001",
    state_code: "NY",
    country_code: "US",
    phone: "+1 212 000 0000",
  },
  EU: {
    first_name: "John",
    last_name: "Doe",
    line_1: "Via Roma 1",
    city: "Milano",
    zip_code: "20121",
    state_code: "MI",
    country_code: "IT",
    phone: "+39 02 0000000",
  },
}

const MARKET_CURRENCY = { US: "USD", EU: "EUR" }

function required(name) {
  const value = process.env[name]
  if (!value) {
    fail(
      `${name} is not set in .env.local.\n` +
        "These are the new-payments organization's credentials and are NOT the " +
        "E2E_* ones, which belong to a different organization — see .env.local.sample.",
    )
  }
  return value
}

function fail(message) {
  console.error(`\n${message}\n`)
  process.exit(1)
}

function marketCode() {
  const code = required("NP_MARKET_CODE")
  if (!(code in ADDRESSES)) {
    fail(
      `NP_MARKET_CODE is "${code}", which has no address in this script. ` +
        `Known: ${Object.keys(ADDRESSES).join(", ")}. Add one rather than ` +
        "letting it fall back — a mismatched country silently changes tax and shipping.",
    )
  }
  return code
}

/** A sales-channel token: public client id, no secret. What the checkout uses. */
async function salesChannelToken() {
  const { accessToken } = await authenticate("client_credentials", {
    domain: required("NP_DOMAIN"),
    clientId: required("NP_CLIENT_ID"),
    scope: `market:code:${marketCode()}`,
  })
  return accessToken
}

/**
 * A customer token: the same public client id, plus someone's credentials.
 *
 * The distinction matters to more than the greeting. `payment_wallets` are
 * grantable only to the customer who owns them, so saving a card — and every
 * flow that reuses one — is unreachable with the guest token above. Adyen's
 * tokenization is gated the same way, on the token rather than on the order.
 */
async function customerToken() {
  const auth = await authenticate("password", {
    domain: required("NP_DOMAIN"),
    clientId: required("NP_CLIENT_ID"),
    username: required("NP_CUSTOMER_EMAIL"),
    password: required("NP_CUSTOMER_PASSWORD"),
    scope: `market:code:${marketCode()}`,
  })
  // `authenticate` reports a bad password in `errors` rather than throwing, so
  // without this the failure surfaces much later as an unauthorized order
  // create — which reads as a broken script rather than a wrong password.
  if (auth.errors?.length) {
    fail(
      `Could not sign in as ${process.env.NP_CUSTOMER_EMAIL}: ` +
        `${auth.errors[0]?.detail ?? "authentication failed"}\n` +
        "Check NP_CUSTOMER_EMAIL and NP_CUSTOMER_PASSWORD in .env.local.",
    )
  }
  return auth.accessToken
}

/** An integration token: client id + secret. Gift cards cannot be minted without it. */
async function integrationToken() {
  const { accessToken } = await authenticate("client_credentials", {
    domain: required("NP_DOMAIN"),
    clientId: required("NP_INTEGRATION_CLIENT_ID"),
    clientSecret: required("NP_INTEGRATION_CLIENT_SECRET"),
  })
  return accessToken
}

function client(accessToken) {
  return CommerceLayer({
    organization: required("NP_SLUG"),
    domain: required("NP_DOMAIN"),
    accessToken,
    apiVersion: API_VERSION,
  })
}

async function createOrder({ asCustomer = false } = {}) {
  const market = marketCode()
  const skuCode = process.env.NP_SKU_CODE ?? DEFAULT_SKU_CODE
  const accessToken = asCustomer ? await customerToken() : await salesChannelToken()
  const cl = client(accessToken)

  const address = await cl.addresses.create(ADDRESSES[market])

  const order = await cl.orders.create({
    // The customer's own address, on a customer token: the order is associated
    // with whoever the token belongs to, and an email that disagreed with it
    // would put the checkout's Customer step at odds with the order.
    customer_email: asCustomer ? required("NP_CUSTOMER_EMAIL") : CUSTOMER_EMAIL,
    billing_address: cl.addresses.relationship(address.id),
    shipping_address: cl.addresses.relationship(address.id),
  })

  await cl.line_items.create({
    quantity: 1,
    sku_code: skuCode,
    order: cl.orders.relationship(order.id),
  })

  // Without a shipping method the checkout stops at Delivery and never reaches
  // the payment step, which is the whole point of the fixture.
  const { shipments } = await cl.orders.retrieve(order.id, {
    include: ["shipments.available_shipping_methods"],
  })

  for (const shipment of shipments ?? []) {
    const [shippingMethod] = shipment.available_shipping_methods ?? []
    if (!shippingMethod) {
      fail(
        `Shipment ${shipment.id} has no available shipping method. ` +
          `Check the shipping methods configured for market ${market}.`,
      )
    }
    await cl.shipments.update({
      id: shipment.id,
      shipping_method: cl.shipping_methods.relationship(shippingMethod.id),
    })
  }

  const placed = await cl.orders.retrieve(order.id)

  console.error(
    `\norder ${placed.number} · ${skuCode} · market ${market} · ` +
      `${placed.formatted_total_amount_with_taxes ?? placed.formatted_total_amount} · ` +
      `${asCustomer ? `customer ${process.env.NP_CUSTOMER_EMAIL}` : "guest"}`,
  )
  console.error("append this to your checkout origin:\n")
  console.log(`/${order.id}?accessToken=${accessToken}`)
}

async function createGiftCard(amountArg) {
  const amount = Number.parseFloat(amountArg ?? "")
  if (!Number.isFinite(amount) || amount <= 0) {
    fail("Usage: pnpm np:gift-card <amount>   e.g. pnpm np:gift-card 25")
  }

  const market = marketCode()
  const cl = client(await integrationToken())

  const code = randomCode()
  const giftCard = await cl.gift_cards.create({
    code,
    currency_code: MARKET_CURRENCY[market],
    balance_cents: Math.round(amount * 100),
  })

  // A created gift card is not spendable. Both triggers are required: without
  // them the code exists but every attempt to use it comes back as
  // "doesn't match any active gift card", which reads like a typo.
  await cl.gift_cards._purchase(giftCard.id)
  await cl.gift_cards._activate(giftCard.id)

  console.error(
    `\ngift card ${amount.toFixed(2)} ${MARKET_CURRENCY[market]} · purchased · activated\n`,
  )
  console.log(code)
}

/**
 * Gift card codes must be unique within the organization, and a spent one
 * cannot be topped up here — so every run mints a new code rather than reusing
 * a memorable one.
 */
function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 10; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return code
}

const [command, ...args] = process.argv.slice(2)

try {
  switch (command) {
    case "order":
      // A flag rather than a second subcommand: everything about the order is
      // the same but the token, and the end-to-end fixture asks for one by
      // passing this through.
      await createOrder({ asCustomer: args.includes("--customer") })
      break
    case "gift-card":
      await createGiftCard(args[0])
      break
    default:
      fail(
        "Usage:\n" +
          "  pnpm np:order              create a guest order, print /<id>?accessToken=<jwt>\n" +
          "  pnpm np:order:customer     the same, signed in as NP_CUSTOMER_EMAIL\n" +
          "  pnpm np:gift-card <amount> mint an active gift card, print its code",
      )
  }
} catch (error) {
  // SDK errors carry the API's wording in `errors`, not in `message`. Anything
  // that never reached the API — a DNS or connection failure, a bug in here —
  // has no `errors` at all, and assuming it does used to replace the real cause
  // with "error?.errors?.map is not a function".
  const apiErrors = Array.isArray(error?.errors) ? error.errors : []
  const detail = apiErrors
    .map((e) => e.detail ?? e.title)
    .filter(Boolean)
    .join("\n  ")
  if (detail) {
    fail(`Commerce Layer refused this:\n  ${detail}`)
  }
  fail(error instanceof Error ? `${error.message}\n\n${error.stack ?? ""}` : String(error))
}
