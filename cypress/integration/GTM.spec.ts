import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("check Data Layers GTM", () => {
  const filename = "GTM"
  const redirectUrl = internet.url()

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
              sku_code: "BABYONBU000000E63E7412MX",
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
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
      ])
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
      cy.wait(["@getOrders", "@getShipments"])
      cy.dataCy("save-shipments-button").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
        "@updateOrder",
      ])
      cy.dataCy("shipping-method-name-recap").each((e, i) => {
        cy.wrap(e).as(`shippingMethodNameRecap${i}`)
      })
      cy.get("@shippingMethodNameRecap0").should(
        "contain.text",
        "Standard Shipping"
      )
      cy.get("@shippingMethodNameRecap1").should(
        "contain.text",
        "Standard Shipping"
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
        assert.equal(dataLayer[1].ecommerce.items.length, 2)
      })
    })

    it("edit Delivery, select Express Delivery to both shipments and save", () => {
      cy.dataCy("step_delivery")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait("@retrieveLineItems")
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton1").click()
      cy.wait(["@getOrders", "@retrieveLineItems", "@getOrderShipments"])
      cy.get("@shippingMethodButton3").click()
      cy.wait(["@getOrders", "@retrieveLineItems", "@getOrderShipments"])
      cy.dataCy("save-shipments-button").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getOrderShipments",
        "@updateOrder",
      ])
      cy.dataCy("shipping-method-name-recap").each((e, i) => {
        cy.wrap(e).as(`shippingMethodNameRecap${i}`)
      })
      cy.get("@shippingMethodNameRecap0").should(
        "contain.text",
        "Express Delivery"
      )
      cy.get("@shippingMethodNameRecap1").should(
        "contain.text",
        "Express Delivery"
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
        assert.equal(dataLayer[3].ecommerce.items.length, 2)
      })
    })

    it("edit Delivery, select Express Delivery to first shipment and select Standard Shipping to second shipment and save", () => {
      cy.dataCy("step_delivery")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait("@retrieveLineItems")
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton1").click()
      cy.get("@shippingMethodButton2").click()
      cy.dataCy("save-shipments-button").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getOrderShipments",
        "@updateOrder",
      ])
      cy.dataCy("shipping-method-name-recap").each((e, i) => {
        cy.wrap(e).as(`shippingMethodNameRecap${i}`)
      })
      cy.get("@shippingMethodNameRecap0").should(
        "contain.text",
        "Express Delivery"
      )
      cy.get("@shippingMethodNameRecap1").should(
        "contain.text",
        "Standard Shipping"
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
        assert.equal(dataLayer[5].ecommerce.items.length, 2)
      })
    })

    it("edit Delivery, select Standard Shipping to first shipment and select Express Delivery to second shipment and save", () => {
      cy.dataCy("step_delivery")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait("@retrieveLineItems")
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click()
      cy.get("@shippingMethodButton3").click()
      cy.dataCy("save-shipments-button").click()
      cy.wait(["@getOrders", "@retrieveLineItems", "@getOrderShipments"])
      cy.dataCy("shipping-method-name-recap").each((e, i) => {
        cy.wrap(e).as(`shippingMethodNameRecap${i}`)
      })
      cy.get("@shippingMethodNameRecap0").should(
        "contain.text",
        "Standard Shipping"
      )
      cy.get("@shippingMethodNameRecap1").should(
        "contain.text",
        "Express Delivery"
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
        assert.equal(dataLayer[7].ecommerce.items.length, 2)
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
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
        "@availablePaymentMethods",
      ])
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
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

    it("insert data card, save and check add_shipping_info", () => {
      cy.dataCy("payment-source").each((e, i) => {
        cy.wrap(e).as(`paymentSource${i}`)
      })
      cy.get("@paymentSource0").within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242")
        cy.fillElementsInput("cardExpiry", "1025")
        cy.fillElementsInput("cardCvc", "123")
      })
      cy.get("@paymentSource0")
        .get("button")
        .each((e, i) => {
          cy.wrap(e).as(`paymentSourceButton${i}`)
        })
      cy.get("@paymentSourceButton2").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
      ])
      cy.getDataLayer({ gtm: "add_payment_info" }).then((dataLayer) => {
        assert.equal(dataLayer.length, 1)
        assert.equal(dataLayer[0].ecommerce.currency, "EUR")
        assert.equal(dataLayer[0].ecommerce.value, 0)
        assert.equal(dataLayer[0].ecommerce.payment_type, "Stripe Payment")
        assert.equal(dataLayer[0].ecommerce.items.length, 2)
      })
      cy.dataCy("place-order-button").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
      ])
      cy.getDataLayer({ gtm: "purchase" }).then((dataLayer) => {
        assert.equal(dataLayer.length, 1)
        assert.equal(dataLayer[0].ecommerce.currency, "EUR")
        assert.equal(dataLayer[0].ecommerce.value, 244)
        assert.equal(dataLayer[0].ecommerce.shipping, 0)
        assert.equal(dataLayer[0].ecommerce.tax, 0)
        // assert.equal(dataLayer[0].ecommerce.transaction_id, null)
        assert.equal(dataLayer[0].ecommerce.items.length, 2)
      })
    })
  })
})
