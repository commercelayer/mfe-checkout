import { faker } from "@faker-js/faker"

import { expect, test } from "../fixtures/tokenizedPage"

/**
 * Safety net for the container -> standalone migration.
 *
 * react-components v5 deprecated nine container components in favour of
 * standalone ones. This walks a checkout far enough to mount all of them and
 * fails when a container that should already be gone still warns.
 *
 * ALLOWED is now empty and should stay that way: all five containers that warn
 * have been migrated. It remains a Set rather than a plain emptiness check so a
 * future deprecation can be parked here while it is being worked through.
 *
 * The one thing this must not be read as is "the migration is complete". Only
 * five of the nine containers ever warned. LineItemsContainer,
 * AddressesContainer, PaymentMethodsContainer and PlaceOrderContainer are
 * silent, so a green run says nothing about them — grep the imports for those.
 * PaymentMethodsContainer in particular is staying: PlaceOrderButton reads
 * PaymentMethodContext with no standalone fallback, and in this tree
 * StepPlaceOrder is a sibling of StepPayment rather than a descendant, so
 * removing the container would leave the button without a payment source.
 *
 * The assertion is one-way on purpose: every warning seen must be allowed, but
 * an allowed warning need not appear.
 */
const ALLOWED = new Set<string>([])

/** The five messages disagree on formatting; the container name is the only constant. */
const DEPRECATION = /(\w+Container)\b[^\n]*\bis deprecated\b/i

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.use({
  defaultParams: {
    order: "with-items",
    lineItemsAttributes: [
      { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
    ],
    orderAttributes: {
      customer_email: customerEmail,
    },
  },
})

test("mounts no deprecated container outside the allowlist", async ({
  checkoutPage,
}) => {
  const { page } = checkoutPage
  const seen = new Set<string>()

  // Not filtered by msg.type(): the five call sites are inconsistent, and a
  // warning demoted to log would silently stop being checked.
  page.on("console", (msg) => {
    const match = DEPRECATION.exec(msg.text())
    if (match?.[1] != null) {
      seen.add(match[1])
    }
  })

  // The fixture already navigated, so the first mount happened before the
  // listener existed. Reload to replay it with the listener attached.
  await page.reload()

  await checkoutPage.checkOrderSummary("Order Summary")

  await checkoutPage.setCustomerMail()
  await checkoutPage.setBillingAddress()
  await checkoutPage.checkStep("Customer", "open")
  await checkoutPage.save("Customer")

  await checkoutPage.checkStep("Shipping", "open")
  await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })
  await checkoutPage.save("Shipping")

  // Stop at Payment: PaymentMethodsContainer and PlaceOrderContainer are
  // mounted by now, and placing the order would add nothing to observe.
  await checkoutPage.checkStep("Payment", "open")
  await checkoutPage.selectPayment("stripe")

  const unexpected = [...seen].filter((name) => !ALLOWED.has(name)).sort()

  expect(
    unexpected,
    `Deprecated containers still mounted after migration: ${unexpected.join(", ")}`,
  ).toEqual([])
})
