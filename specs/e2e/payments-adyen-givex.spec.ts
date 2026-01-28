import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress2 } from "../utils/addresses"

test.setTimeout(3 * 60 * 1000)

test.describe("guest with Adyen using givex", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      incognito: true,
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress2,
        sameShippingAddress: true,
      },
      market: "IT4",
    },
  })

  test("Checkout order with givex and credit card", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.partialPayment({})

    await checkoutPage.checkGiftCardAmount("-€50,00")

    await checkoutPage.setPayment("adyen")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 1111")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Visa ending in 1111")
  })

  test("Checkout order with givex and credit card and expired order", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.partialPayment({})

    await checkoutPage.page.waitForTimeout(65000)

    await checkoutPage.partialPayment({})

    await checkoutPage.page.waitForTimeout(5000)

    await checkoutPage.partialPayment({})

    await checkoutPage.checkGiftCardAmount("-€50,00")

    await checkoutPage.setPayment("adyen")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 1111")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Visa ending in 1111")
  })


test("Checkout order with givex, coupon and credit card and expired order", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.page.waitForTimeout(65000)

    await checkoutPage.setCoupon("testcoupon")

    await checkoutPage.checkDiscountAmount("-€29,70")

  })
})

test.describe("guest with Adyen using givex", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      incognito: true,
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      lineItemsAttributes: [
        { sku_code: "BASEBHAT000000FFFFFFXXXX", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress2,
        sameShippingAddress: true,
      },
      market: "IT4",
    },
  })

  test("Checkout order only with givex", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.partialPayment({})

    await checkoutPage.checkGiftCardAmount("-€40,00")

    await checkoutPage.checkPaymentRecap("Giftcard ending in 0000")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Giftcard ending in 0000")
  })

  test("Checkout order only with givex with order expired", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.page.waitForTimeout(65000)

    await checkoutPage.partialPayment({})

    await checkoutPage.checkGiftCardAmount("-€40,00")

    await checkoutPage.checkPaymentRecap("Giftcard ending in 0000")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Giftcard ending in 0000")
  })
})
