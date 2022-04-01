import { faker } from "@faker-js/faker"

import { test, expect } from "../fixtures/tokenizedPage"
import { euAddress } from "../utils/addresses"

test.describe("multi shipments", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
        terms_url: "https://www.google.it",
        privacy_url: "https://www.google.it",
      },
      organization: {
        gtmId: "GTM-123456",
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
        { sku_code: "TSHIRTMMFFFFFF000000XLXX", quantity: 5 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("check begin and shipments", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    let dataLayer = await checkoutPage.getDataLayer("begin_checkout")
    expect(dataLayer.length).toBe(1)
    expect(dataLayer[0].ecommerce.currency).toBe("EUR")
    expect(dataLayer[0].ecommerce.value).toBe(244)
    expect(dataLayer[0].ecommerce.items?.length).toBe(2)

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })
    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 1,
    })

    await checkoutPage.save("Shipping")

    dataLayer = await checkoutPage.getDataLayer("add_shipping_info")
    expect(dataLayer.length).toBe(2)
    expect(dataLayer[0].ecommerce.currency).toBe("EUR")
    expect(dataLayer[0].ecommerce.shipping_tier).toBe("Standard Shipping")
    expect(dataLayer[0].ecommerce.value).toBe(0)
    expect(dataLayer[0].ecommerce.items?.length).toBe(1)

    expect(dataLayer[1].ecommerce.currency).toBe("EUR")
    expect(dataLayer[1].ecommerce.shipping_tier).toBe("Standard Shipping")
    expect(dataLayer[1].ecommerce.value).toBe(0)
    expect(dataLayer[1].ecommerce.items?.length).toBe(1)

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })
    await checkoutPage.selectShippingMethod({
      text: "Express Delivery",
      shipment: 1,
    })

    await checkoutPage.save("Shipping")

    dataLayer = await checkoutPage.getDataLayer("add_shipping_info")
    expect(dataLayer.length).toBe(4)
    expect(dataLayer[2].ecommerce.currency).toBe("EUR")
    expect(dataLayer[2].ecommerce.shipping_tier).toBe("Express Delivery")
    expect(dataLayer[2].ecommerce.value).toBe(12)
    expect(dataLayer[2].ecommerce.items?.length).toBe(1)

    expect(dataLayer[3].ecommerce.currency).toBe("EUR")
    expect(dataLayer[3].ecommerce.shipping_tier).toBe("Express Delivery")
    expect(dataLayer[3].ecommerce.value).toBe(12)
    expect(dataLayer[3].ecommerce.items?.length).toBe(1)

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.selectShippingMethod({ text: "Express Delivery" })
    await checkoutPage.selectShippingMethod({
      text: "Standard Shipping",
      shipment: 1,
    })

    await checkoutPage.save("Shipping")

    dataLayer = await checkoutPage.getDataLayer("add_shipping_info")
    expect(dataLayer.length).toBe(6)
    expect(dataLayer[4].ecommerce.currency).toBe("EUR")
    expect(dataLayer[4].ecommerce.shipping_tier).toBe("Express Delivery")
    expect(dataLayer[4].ecommerce.value).toBe(12)
    expect(dataLayer[4].ecommerce.items?.length).toBe(1)

    expect(dataLayer[5].ecommerce.currency).toBe("EUR")
    expect(dataLayer[5].ecommerce.shipping_tier).toBe("Standard Shipping")
    expect(dataLayer[5].ecommerce.value).toBe(0)
    expect(dataLayer[5].ecommerce.items?.length).toBe(1)

    await checkoutPage.clickStep("Shipping")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })
    await checkoutPage.selectShippingMethod({
      text: "Express Delivery",
      shipment: 1,
    })

    await checkoutPage.save("Shipping")

    dataLayer = await checkoutPage.getDataLayer("add_shipping_info")
    expect(dataLayer.length).toBe(8)
    expect(dataLayer[6].ecommerce.currency).toBe("EUR")
    expect(dataLayer[6].ecommerce.shipping_tier).toBe("Standard Shipping")
    expect(dataLayer[6].ecommerce.value).toBe(0)
    expect(dataLayer[6].ecommerce.items?.length).toBe(1)

    expect(dataLayer[7].ecommerce.currency).toBe("EUR")
    expect(dataLayer[7].ecommerce.shipping_tier).toBe("Express Delivery")
    expect(dataLayer[7].ecommerce.value).toBe(12)
    expect(dataLayer[7].ecommerce.items?.length).toBe(1)

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.checkTermsAndPrivacyValue(false)
    await checkoutPage.setTermsAndPrivacy(true)
    await checkoutPage.checkTermsAndPrivacyValue(true)

    await checkoutPage.setPayment("stripe")
    await checkoutPage.save("Payment")
  })
})

test.describe("single shipment", () => {
  const customerEmail = faker.internet.email().toLocaleLowerCase()

  test.use({
    defaultParams: {
      order: "with-items",
      orderAttributes: {
        customer_email: customerEmail,
      },
      organization: {
        gtmId: "GTM-123456",
      },
      lineItemsAttributes: [
        { sku_code: "CANVASAU000000FFFFFF1824", quantity: 1 },
        { sku_code: "SWEETHMUB7B7B7000000MXXX", quantity: 4 },
      ],
      addresses: {
        billingAddress: euAddress,
        sameShippingAddress: true,
      },
    },
  })

  test("check payment and purchase", async ({ checkoutPage }) => {
    await checkoutPage.checkOrderSummary("Order Summary")
    let dataLayer = await checkoutPage.getDataLayer("begin_checkout")
    expect(dataLayer.length).toBe(1)
    expect(dataLayer[0].ecommerce.currency).toBe("EUR")
    expect(dataLayer[0].ecommerce.value).toBe(244)
    expect(dataLayer[0].ecommerce.items?.length).toBe(2)

    await checkoutPage.checkStep("Shipping", "open")

    await checkoutPage.selectShippingMethod({ text: "Standard Shipping" })

    await checkoutPage.save("Shipping")

    dataLayer = await checkoutPage.getDataLayer("add_shipping_info")
    expect(dataLayer.length).toBe(1)
    expect(dataLayer[0].ecommerce.currency).toBe("EUR")
    expect(dataLayer[0].ecommerce.shipping_tier).toBe("Standard Shipping")
    expect(dataLayer[0].ecommerce.value).toBe(0)
    expect(dataLayer[0].ecommerce.items?.length).toBe(2)

    await checkoutPage.selectPayment("stripe")

    await checkoutPage.setPayment("stripe")

    await checkoutPage.save("Payment")

    dataLayer = await checkoutPage.getDataLayer("add_payment_info")
    expect(dataLayer.length).toBe(1)
    expect(dataLayer[0].ecommerce.currency).toBe("EUR")
    expect(dataLayer[0].ecommerce.payment_type).toBe("Stripe Payment")
    expect(dataLayer[0].ecommerce.value).toBe(10)
    expect(dataLayer[0].ecommerce.items?.length).toBe(2)

    dataLayer = await checkoutPage.getDataLayer("purchase")
    expect(dataLayer.length).toBe(1)
    expect(dataLayer[0].ecommerce.currency).toBe("EUR")
    expect(dataLayer[0].ecommerce.value).toBe(254)
    expect(dataLayer[0].ecommerce.shipping).toBe(0)
    expect(dataLayer[0].ecommerce.tax).toBe(0)

    const orderNumber = await checkoutPage.getOrderNumber()

    expect(dataLayer[0].ecommerce.transaction_id).toBe(
      parseInt(orderNumber.replace("#", ""))
    )
    expect(dataLayer[0].ecommerce.items?.length).toBe(2)
  })
})
