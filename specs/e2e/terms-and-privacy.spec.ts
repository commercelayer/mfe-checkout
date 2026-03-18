import { faker } from "@faker-js/faker"

import { expect, test } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

test.describe("terms and privacy", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
        terms_url: "https://www.google.it",
        privacy_url: "https://www.google.it",
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("checkout with stripe", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkTermsAndPrivacyValue(false)
    await checkoutPage.setTermsAndPrivacy(true)
    await checkoutPage.checkTermsAndPrivacyValue(true)

    await checkoutPage.setPayment("stripe")
    await checkoutPage.save("Payment")
  })

  test("checkout with paypal", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("paypal")

    await checkoutPage.checkTermsAndPrivacyValue(false)
    await checkoutPage.setTermsAndPrivacy(true)
    await checkoutPage.checkTermsAndPrivacyValue(true)

    await checkoutPage.save("Payment", "Paga con PayPal")
  })

  test("checkout with paypal interrupted", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("paypal")

    await checkoutPage.checkTermsAndPrivacyValue(false)
    await checkoutPage.setTermsAndPrivacy(true)
    await checkoutPage.checkTermsAndPrivacyValue(true)

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page.click("a#cancelLink")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.checkTermsAndPrivacyValue(false)
    await checkoutPage.checkButton({ type: "Payment", status: "disabled" })
    await checkoutPage.setTermsAndPrivacy(true)
    await checkoutPage.checkButton({ type: "Payment", status: "enabled" })

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page.click("a#cancelLink")

    await checkoutPage.checkTermsAndPrivacyValue(false)
    await checkoutPage.checkButton({ type: "Payment", status: "disabled" })
  })

  test("checkout with paypal interrupted going back", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("paypal")

    await checkoutPage.checkTermsAndPrivacyValue(false)
    await checkoutPage.setTermsAndPrivacy(true)
    await checkoutPage.checkTermsAndPrivacyValue(true)

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page
      .locator("a#cancelLink")
      .waitFor({ state: "visible" })

    await checkoutPage.page.goBack()

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.checkTermsAndPrivacyValue(false)
    await checkoutPage.checkButton({ type: "Payment", status: "disabled" })
    await checkoutPage.setTermsAndPrivacy(true)
    await checkoutPage.checkButton({ type: "Payment", status: "enabled" })

    await checkoutPage.save("Payment", undefined, true)

    await checkoutPage.page.click("a#cancelLink")

    await checkoutPage.checkTermsAndPrivacyValue(false)
    await checkoutPage.checkButton({ type: "Payment", status: "disabled" })
  })
})

test.describe("only terms", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
        terms_url: "https://www.google.it",
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("checkout without accepting terms", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkTermsAndPrivacyValue(undefined)

    await checkoutPage.setPayment("stripe")
    await checkoutPage.save("Payment")
  })
})

test.describe("only privacy", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
        privacy_url: "https://www.google.it",
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("checkout without accepting terms", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkTermsAndPrivacyValue(undefined)

    await checkoutPage.setPayment("stripe")
    await checkoutPage.save("Payment")
  })
})

test.describe("terms and privacy from org config", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      organization: {
        config: {
          mfe: {
            default: {
              urls: {
                terms: "https://www.google.it/terms",
                privacy: "https://www.google.it/privacy",
              },
            },
          },
        },
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("shows terms and privacy from org config when not set on order", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkTermsAndPrivacyValue(false)
    await checkoutPage.checkButton({ type: "Payment", status: "disabled" })
    await checkoutPage.setTermsAndPrivacy(true)
    await checkoutPage.checkButton({ type: "Payment", status: "enabled" })

    await checkoutPage.setPayment("stripe")
    await checkoutPage.save("Payment")
  })
})

test.describe("order terms_url takes precedence over org config", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
        terms_url: "https://www.google.it/order-terms",
        privacy_url: "https://www.google.it/order-privacy",
      },
      organization: {
        config: {
          mfe: {
            default: {
              urls: {
                terms: "https://www.google.it/org-terms",
                privacy: "https://www.google.it/org-privacy",
              },
            },
          },
        },
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("order-level urls override org config urls", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkTermsAndPrivacyValue(false)

    const termsLink = checkoutPage.page.locator(
      'a[href="https://www.google.it/order-terms"]',
    )
    const privacyLink = checkoutPage.page.locator(
      'a[href="https://www.google.it/order-privacy"]',
    )
    await expect(termsLink).toBeVisible()
    await expect(privacyLink).toBeVisible()

    const orgTermsLink = checkoutPage.page.locator(
      'a[href="https://www.google.it/org-terms"]',
    )
    const orgPrivacyLink = checkoutPage.page.locator(
      'a[href="https://www.google.it/org-privacy"]',
    )
    await expect(orgTermsLink).toHaveCount(0)
    await expect(orgPrivacyLink).toHaveCount(0)
  })
})

test.describe(":lang param is replaced in org config urls", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
        language_code: "it",
      },
      organization: {
        config: {
          mfe: {
            default: {
              urls: {
                terms: "https://example.com/:lang/terms",
                privacy: "https://example.com/:lang/privacy",
              },
            },
          },
        },
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("replaces :lang with order language_code in terms and privacy links", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Riepilogo ordine")
    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkTermsAndPrivacyValue(false)

    const termsLink = checkoutPage.page.locator(
      'a[href="https://example.com/it/terms"]',
    )
    const privacyLink = checkoutPage.page.locator(
      'a[href="https://example.com/it/privacy"]',
    )
    await expect(termsLink).toBeVisible()
    await expect(privacyLink).toBeVisible()
  })
})
