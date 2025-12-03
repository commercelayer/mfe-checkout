import { faker } from "@faker-js/faker"

import { test } from "../fixtures/tokenizedPage"
import { euAddress, euAddressNoBillingInfo } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("optional billing info enabled", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "IE",
      lineItemsAttributes: [
        { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      organization: {
        config: {
          mfe: {
            default: {
              checkout: {
                optional_billing_info: true,
              },
            },
          },
        },
      },
    },
  })

  test("should display billing info", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.isVisibleBillingInfo(true)
  })

  test("should save billing address without billing info", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.isVisibleBillingInfo(true)
    await checkoutPage.setBillingAddress(euAddressNoBillingInfo)
    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
  })

  test("should save billing address with billing info", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.isVisibleBillingInfo(true)
    await checkoutPage.setBillingAddress({
      ...euAddressNoBillingInfo,
      billing_info: "00CDEFGHIJKLMNOPQRSTUVWYXZ",
    })
    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
  })

  test("should save billing address with billing info and remove it", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.isVisibleBillingInfo(true)
    await checkoutPage.setBillingAddress({
      ...euAddressNoBillingInfo,
      billing_info: "00CDEFGHIJKLMNOPQRSTUVWYXZ",
    })
    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.clickStep("Customer")
    await checkoutPage.page.fill(
      "[data-testid=input_billing_address_billing_info]",
      "",
    )
    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "close")
    await checkoutPage.checkStep("Payment", "open")
    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkAddress({
      address: euAddressNoBillingInfo,
      type: "billing_address",
    })
  })
})

test.describe("optional billing info disabled", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      market: "IE",
      lineItemsAttributes: [
        { sku_code: "BABYONBU000000E63E7412MX", quantity: 2 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      organization: {
        config: {
          mfe: {
            default: {
              checkout: {
                optional_billing_info: false,
              },
            },
          },
        },
      },
    },
  })

  test("should display billing info", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "open")
    await checkoutPage.isVisibleBillingInfo(false)
  })
})

test.describe("with optional company name", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      organization: {
        config: {
          mfe: {
            default: {
              checkout: {
                optional_company_name: true,
              },
            },
          },
        },
      },
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("Check field in billing and shipping address", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkOptionalCompanyName({
      presence: true,
      type: "billing_address",
    })

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.checkOptionalCompanyName({
      presence: true,
      type: "shipping_address",
    })
  })

  test("Check optional field in billing address", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.setBillingAddress(euAddress)

    await checkoutPage.checkOptionalCompanyName({
      presence: true,
      type: "billing_address",
    })
    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
  })

  test("Save optional field in billing address", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkOptionalCompanyName({
      presence: true,
      type: "billing_address",
    })

    await checkoutPage.setBillingAddress({ ...euAddress, company: "Acme Corp" })

    await checkoutPage.save("Customer")

    await checkoutPage.checkStep("Customer", "close")
    await checkoutPage.checkStep("Shipping", "open")
    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkAddress({
      address: { ...euAddress, company: "Acme Corp" },
      type: "billing_address",
    })

    await checkoutPage.page.reload()

    await checkoutPage.clickStep("Customer")

    await checkoutPage.checkAddress({
      address: { ...euAddress, company: "Acme Corp" },
      type: "billing_address",
    })
  })
})

test.describe("without optional company name", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      organization: {
        config: {
          mfe: {
            default: {
              checkout: {
                optional_company_name: false,
              },
            },
          },
        },
      },
      orderAttributes: {
        customer_email: customerEmail,
      },
    },
  })

  test("Check absence in billing and shipping address", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.checkOptionalCompanyName({
      presence: false,
      type: "billing_address",
    })

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.checkOptionalCompanyName({
      presence: false,
      type: "shipping_address",
    })
  })
})
