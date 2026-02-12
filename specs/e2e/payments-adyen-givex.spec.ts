import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

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
        billingAddress: euAddress,
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

  test("Checkout order with partial givex and reload order", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.partialPayment({})

    await checkoutPage.page.waitForTimeout(15000)

    await checkoutPage.page.reload()

    await checkoutPage.checkGiftCardAmount("-€50,00")

    await checkoutPage.setPayment("adyen")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 1111")
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

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.partialPayment({})

    await checkoutPage.checkTotalAmount("€19,30")

    await checkoutPage.removeCoupon()

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.partialPayment({})

    await checkoutPage.checkGiftCardAmount("-€50,00")

    await checkoutPage.setPayment("adyen")

    await checkoutPage.save("Payment")

    await checkoutPage.checkPaymentRecap("Visa ending in 1111")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Visa ending in 1111")
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
        billingAddress: euAddress,
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

  test("Checkout order only with givex with order expired", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("adyen")

    await checkoutPage.page.waitForTimeout(65000)

    await checkoutPage.partialPayment({})

    await checkoutPage.page.waitForTimeout(15000)

    await checkoutPage.partialPayment({})

    await checkoutPage.checkGiftCardAmount("-€40,00")

    await checkoutPage.checkPaymentRecap("Giftcard ending in 0000")
    await checkoutPage.page.reload()
    await checkoutPage.checkPaymentRecap("Giftcard ending in 0000")
  })
})

test.describe("giftcard covering total amount and single adyen gateway with partial payments", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      giftCardAttributes: {
        balance_cents: 10000,
        apply: false,
      },
      market: "IT4",
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("should execute a free checkout", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.setCustomerMail("customer@tk.com")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.checkTotalAmount("99,00")

    await checkoutPage.page.waitForTimeout(5000)
    await checkoutPage.setCoupon(checkoutPage.getGiftCard() as string)

    await checkoutPage.checkGiftCardAmount("-€99,00")
    await checkoutPage.checkTotalAmount("€0,00")

    await checkoutPage.save("Payment")
    await checkoutPage.checkPaymentRecap("This order did not require a payment")
  })
})
