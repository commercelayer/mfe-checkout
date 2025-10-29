import { faker } from "@faker-js/faker"

import { expect, test } from "../fixtures/tokenizedPage"
import { euAddressNoBillingInfo } from "../utils/addresses"

const customerEmail = faker.internet.email().toLocaleLowerCase()

test.describe("with different tax calculators", () => {
  test.use({
    defaultParams: {
      order: "with-items",
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
      ],
      orderAttributes: {
        customer_email: customerEmail,
      },
      market: "NO",
    },
  })

  test("Checkout address changing from Italy to Norway", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    let email = checkoutPage.getCustomerMail()

    await expect(email).toHaveValue(customerEmail)

    await checkoutPage.changeCustomerEmail("customer@example.com")
    await checkoutPage.blurCustomerEmail()
    email = checkoutPage.getCustomerMail()

    await expect(email).toHaveValue("customer@example.com")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.setBillingAddress(euAddressNoBillingInfo)

    await checkoutPage.save("Customer")
    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.checkCustomerEmail("customer@example.com")

    await checkoutPage.checkTaxSummary("0,00 Kr")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.selectCountry("billing_address", "NO")

    await checkoutPage.save("Customer")

    await checkoutPage.checkTaxSummary("2,75 Kr")
  })

  test("Checkout address changing from Italy to Norway on shipping address", async ({
    checkoutPage,
  }) => {
    await checkoutPage.checkOrderSummary("Order Summary")

    let email = checkoutPage.getCustomerMail()

    await expect(email).toHaveValue(customerEmail)

    await checkoutPage.changeCustomerEmail("customer@example.com")
    await checkoutPage.blurCustomerEmail()
    email = checkoutPage.getCustomerMail()

    await expect(email).toHaveValue("customer@example.com")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.setBillingAddress(euAddressNoBillingInfo)

    await checkoutPage.save("Customer")

    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.checkCustomerEmail("customer@example.com")

    await checkoutPage.checkTaxSummary("0,00 Kr")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.selectCountry("billing_address", "NO")

    await checkoutPage.save("Customer")
    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.checkTaxSummary("2,75 Kr")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.shipToDifferentAddress()

    await checkoutPage.setShippingAddress(euAddressNoBillingInfo)

    await checkoutPage.save("Customer")
    await checkoutPage.page.waitForTimeout(1000)
    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.checkTaxSummary("0,00 Kr")

    await checkoutPage.clickStep("Customer")
    await checkoutPage.checkStep("Customer", "open")

    await checkoutPage.selectCountry("shipping_address", "NO")
    await checkoutPage.save("Customer")
    await checkoutPage.page.waitForTimeout(1000)

    await checkoutPage.checkStep("Customer", "close")

    await checkoutPage.checkTaxSummary("2,75 Kr")
  })
})
