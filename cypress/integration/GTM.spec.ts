import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("check Data Layers GTM", () => {
  const filename = "GTM"

  const email = internet.email().toLocaleLowerCase()
  const password = internet.password()

  before(function () {
    cy.createCustomer({ email: email, password: password }).then(() => {
      cy.getTokenCustomer({
        username: email,
        password: password,
      }).as("tokenObj")
    })
  })

  context("starting from the delivery step", () => {
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order?.id,
            accessToken: this.tokenObj.access_token,
            attributes: {
              quantity: "1",
              sku_code: "CANVASAU000000FFFFFF1824",
            },
          })
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: {
              quantity: "4",
              sku_code: "SWEETHMUB7B7B7000000MXXX",
            },
          })
          cy.createAddress({
            ...euAddress,
            accessToken: this.tokenObj.access_token,
          }).then((address) => {
            cy.setSameAddress(
              order.id,
              address.id,
              this.tokenObj.access_token
            ).then(() => {
              cy.getShipments({
                accessToken: this.tokenObj.access_token,
                orderId: order.id,
              })
            })
          })
        })
    })

    beforeEach(function () {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename,
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("valid customer token", function () {
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check begin_checkout GTM", () => {
      cy.getDataLayer({ gtm: "begin_checkout" }).then((dataLayer) => {
        assert.equal(dataLayer.length, 1)
        assert.equal(dataLayer[0].ecommerce.currency, "EUR")
        assert.equal(dataLayer[0].ecommerce.value, 244)
        assert.equal(dataLayer[0].ecommerce.items.length, 2)
      })
    })

    it("select Standard Shipping to both shipments, save and check add_shipping_info", () => {
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click()
      cy.get("@shippingMethodButton2").click()
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(
        ["@getOrderShipments", "@getOrderShipments", "@retrieveLineItems"],
        {
          timeout: 100000,
        }
      )
      cy.getDataLayer({ gtm: "add_shipping_info" }).then((dataLayer) => {
        assert.equal(dataLayer.length, 2)
        assert.equal(dataLayer[0].event, "add_shipping_info")
        assert.equal(dataLayer[0].ecommerce.currency, "EUR")
        assert.equal(dataLayer[0].ecommerce.shipping_tier, "Standard Shipping")
        assert.equal(dataLayer[0].ecommerce.value, 0)
        assert.equal(dataLayer[0].ecommerce.items.length, 1)
        assert.equal(dataLayer[1].event, "add_shipping_info")
        assert.equal(dataLayer[1].ecommerce.currency, "EUR")
        assert.equal(dataLayer[1].ecommerce.shipping_tier, "Standard Shipping")
        assert.equal(dataLayer[1].ecommerce.value, 0)
        assert.equal(dataLayer[1].ecommerce.items.length, 1)
      })
    })

    it("edit Delivery, select Express Delivery to both shipments and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait(["@retrieveLineItems", "@retrieveLineItems"], {
        timeout: 100000,
      })
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton1").click()
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getShipments",
          "@getOrders",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrderShipments",
          "@getOrderShipments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.get("@shippingMethodButton3").click()
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getShipments",
          "@getOrders",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrderShipments",
          "@getOrderShipments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(
        ["@getOrderShipments", "@getOrderShipments", "@retrieveLineItems"],
        {
          timeout: 100000,
        }
      )
      cy.getDataLayer({ gtm: "add_shipping_info" }).then((dataLayer) => {
        assert.equal(dataLayer.length, 4)
        assert.equal(dataLayer[2].event, "add_shipping_info")
        assert.equal(dataLayer[2].ecommerce.currency, "EUR")
        assert.equal(dataLayer[2].ecommerce.shipping_tier, "Express Delivery")
        assert.equal(dataLayer[2].ecommerce.value, 12)
        assert.equal(dataLayer[2].ecommerce.items.length, 1)
        assert.equal(dataLayer[3].event, "add_shipping_info")
        assert.equal(dataLayer[3].ecommerce.currency, "EUR")
        assert.equal(dataLayer[3].ecommerce.shipping_tier, "Express Delivery")
        assert.equal(dataLayer[3].ecommerce.value, 12)
        assert.equal(dataLayer[3].ecommerce.items.length, 1)
      })
    })

    it("edit Delivery, select Express Delivery to first shipment and select Standard Shipping to second shipment and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait(
        ["@getOrderShipments", "@retrieveLineItems", "@retrieveLineItems"],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton1").click()
      cy.get("@shippingMethodButton2").click()
      cy.dataCy("save-shipments-button").click()
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getShipments",
          "@getOrders",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )
      cy.getDataLayer({ gtm: "add_shipping_info" }).then((dataLayer) => {
        assert.equal(dataLayer.length, 6)
        assert.equal(dataLayer[4].event, "add_shipping_info")
        assert.equal(dataLayer[4].ecommerce.currency, "EUR")
        assert.equal(dataLayer[4].ecommerce.shipping_tier, "Express Delivery")
        assert.equal(dataLayer[4].ecommerce.value, 12)
        assert.equal(dataLayer[4].ecommerce.items.length, 1)
        assert.equal(dataLayer[5].event, "add_shipping_info")
        assert.equal(dataLayer[5].ecommerce.currency, "EUR")
        assert.equal(dataLayer[5].ecommerce.shipping_tier, "Standard Shipping")
        assert.equal(dataLayer[5].ecommerce.value, 0)
        assert.equal(dataLayer[5].ecommerce.items.length, 1)
      })
    })

    it("edit Delivery, select Standard Shipping to first shipment and select Express Delivery to second shipment and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait(
        ["@getOrderShipments", "@retrieveLineItems", "@retrieveLineItems"],
        { timeout: 100000 }
      )
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click()
      cy.wait(
        [
          "@getShipments",
          "@getOrders",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrderShipments",
        ],
        { timeout: 100000 }
      )
      cy.get("@shippingMethodButton3").click()
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getShipments",
          "@getOrders",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(
        [
          "@retrieveLineItems",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@getShipments",
          "@getShipments",
          "@retrieveLineItems",

          "@getOrderShipments",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
          "@getOrderShipments",
        ],
        { timeout: 100000 }
      )
      cy.getDataLayer({ gtm: "add_shipping_info" }).then((dataLayer) => {
        assert.equal(dataLayer.length, 8)
        assert.equal(dataLayer[6].event, "add_shipping_info")
        assert.equal(dataLayer[6].ecommerce.currency, "EUR")
        assert.equal(dataLayer[6].ecommerce.shipping_tier, "Standard Shipping")
        assert.equal(dataLayer[6].ecommerce.value, 0)
        assert.equal(dataLayer[6].ecommerce.items.length, 1)
        assert.equal(dataLayer[7].event, "add_shipping_info")
        assert.equal(dataLayer[7].ecommerce.currency, "EUR")
        assert.equal(dataLayer[7].ecommerce.shipping_tier, "Express Delivery")
        assert.equal(dataLayer[7].ecommerce.value, 12)
        assert.equal(dataLayer[7].ecommerce.items.length, 1)
      })
    })
  })

  context("starting from the payment step", () => {
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: {
              quantity: "1",
              sku_code: "CANVASAU000000FFFFFF1824",
            },
          })
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: {
              quantity: "5",
              sku_code: "TSHIRTMMFFFFFFE63E74MXXX",
            },
          })
          cy.createAddress({
            ...euAddress,
            accessToken: this.tokenObj.access_token,
          }).then((address) => {
            cy.setSameAddress(
              order.id,
              address.id,
              this.tokenObj.access_token
            ).then(() => {
              cy.getShipments({
                accessToken: this.tokenObj.access_token,
                orderId: order.id,
              }).then((shipments) => {
                cy.setShipmentMethod({
                  type: "Standard Shipping",
                  id: shipments[0].id,
                  accessToken: this.tokenObj.access_token,
                })
              })
            })
          })
        })
    })

    beforeEach(function () {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename,
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("valid customer token", function () {
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("select Standard Shipping and save", () => {
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click()
      cy.wait(
        [
          "@getShipments",
          "@getOrders",
          "@retrieveLineItems",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@getOrderShipments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(["@getOrderShipments", "@retrieveLineItems"], { timeout: 100000 })
    })

    it("check begin_checkout GTM without add_shipping_info GTM", () => {
      cy.getDataLayer({ gtm: "begin_checkout" }).then((dataLayer) => {
        assert.equal(dataLayer.length, 1)
        assert.equal(dataLayer[0].event, "begin_checkout")
        assert.equal(dataLayer[0].ecommerce.currency, "EUR")
        assert.equal(dataLayer[0].ecommerce.value, 244)
        assert.equal(dataLayer[0].ecommerce.items.length, 2)
      })
    })

    it("select payment method credit card", () => {
      cy.dataCy("payment-method-item").each((e, i) => {
        cy.wrap(e).as(`paymentMethodItem${i}`)
      })
      cy.get("@paymentMethodItem2").click({ force: true })
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@stripePayments",
          "@availableCustomerPaymentSources",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )
    })

    it("insert data card, save and check add_shipping_info", () => {
      cy.dataCy("payment-source").each((e, i) => {
        cy.wrap(e).as(`paymentSource${i}`)
      })
      cy.get("@paymentSource2").within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242")
        cy.fillElementsInput("cardExpiry", "1025")
        cy.fillElementsInput("cardCvc", "123")
      })
      cy.get("@paymentSource1")
        .get("button")
        .each((e, i) => {
          cy.wrap(e).as(`paymentSourceButton${i}`)
        })
      cy.dataCy("place-order-button").click()
      cy.wait(
        [
          "@getOrders",
          "@getCustomerAddresses",
          "@retrieveLineItems",
          "@availableCustomerPaymentSources",
          "@updateOrder",
          "@getOrderShipments",
          "@getShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",

          "@getOrderShipments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.getDataLayer({ gtm: "add_payment_info" }).then((dataLayer) => {
        assert.equal(dataLayer.length, 1)
        assert.equal(dataLayer[0].ecommerce.currency, "EUR")
        assert.equal(dataLayer[0].ecommerce.value, 10)
        assert.equal(dataLayer[0].ecommerce.payment_type, "Stripe Payment")
        assert.equal(dataLayer[0].ecommerce.items.length, 2)
      })
      cy.getDataLayer({ gtm: "purchase" }).then((dataLayer) => {
        assert.equal(dataLayer.length, 1)
        assert.equal(dataLayer[0].ecommerce.currency, "EUR")
        assert.equal(dataLayer[0].ecommerce.value, 254)
        assert.equal(dataLayer[0].ecommerce.shipping, 0)
        assert.equal(dataLayer[0].ecommerce.tax, 0)
        // assert.equal(dataLayer[0].ecommerce.transaction_id, null)
        assert.equal(dataLayer[0].ecommerce.items.length, 2)
      })
    })
  })
})
