import { faker } from "@faker-js/faker"

import { expect, test } from "../fixtures/tokenizedPage"

/**
 * Safety net for the container -> standalone migration.
 *
 * react-components v5 deprecated nine container components in favour of
 * standalone ones. This walks a checkout far enough to mount all of them and
 * fails when a container that should already be gone still warns.
 *
 * Shrink ALLOWED by one entry per migration commit. Two caveats, both of them
 * easy to misread as "we're done":
 *
 * 1. Only five of the nine warn at all. LineItemsContainer,
 *    AddressesContainer, PaymentMethodsContainer and PlaceOrderContainer are
 *    silent, so a green run here says nothing about them — grep the imports.
 * 2. A container warns only on the path that mounts it. BillingAddressContainer
 *    and ShippingAddressContainer live in CheckoutCustomerAddresses, which a
 *    guest checkout never renders. They stay in ALLOWED so that the address
 *    book path cannot regress unnoticed if a later spec exercises it.
 *
 * The assertion is one-way on purpose: every warning seen must be allowed, but
 * an allowed warning need not appear.
 */
const ALLOWED = new Set([
  "OrderContainer",
  "CustomerContainer",
  "BillingAddressContainer",
  "ShippingAddressContainer",
  "ShipmentsContainer",
])

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
