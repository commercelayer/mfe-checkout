import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout Payments", () => {
  const filename = "payments"

  const email = internet.email().toLocaleLowerCase()
  const password = internet.password()

  context("customer order with one payment method not selected", () => {
    before(function () {
      cy.createCustomer({ email: email, password: password }).then(() => {
        cy.getTokenCustomer({
          username: email,
          password: password,
        })
          .as("tokenObj")
          .then(() => {
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
                    }).then((shipments) => {
                      cy.setShipmentMethod({
                        type: "Standard Shipping",
                        id: shipments[0].id,
                        accessToken: this.tokenObj.access_token,
                      })
                      cy.setShipmentMethod({
                        type: "Express Delivery EU",
                        id: shipments[1].id,
                        accessToken: this.tokenObj.access_token,
                      })
                    })
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
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}`
      )
      cy.wait(
        [
          "@getShippingMethods",
          "@getOrderShipments",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check if avaible save to wallet", () => {
      cy.wait(5000)
      cy.dataCy("payment-save-wallet").should("exist")
    })

    it("insert data credit card and check data", () => {
      cy.dataCy("payment-source").each((e, i) => {
        cy.wrap(e).as(`paymentSource${i}`)
      })
      cy.get("@paymentSource0").within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242")
        cy.fillElementsInput("cardExpiry", "3333")
        cy.fillElementsInput("cardCvc", "333")
      })
      cy.get("@paymentSource0")
        .get("button")
        .each((e, i) => {
          cy.wrap(e).as(`paymentSourceButton${i}`)
        })

      cy.get("@paymentSourceButton3").click()

      cy.wait(
        [
          "@getShippingMethods",
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("payment-method-selected").should(
        "contain.text",
        "Stripe Payment"
      )
      cy.dataCy("payment-method-price-selected").should("contain.text", "0,00")
    })
  })

  context("guest order with one payment method not selected", () => {
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
            attributes: {
              quantity: "1",
              sku_code: "CANVASAU000000FFFFFF1824",
            },
          })
          cy.createSkuLineItems({
            orderId: order.id,
            attributes: {
              quantity: "5",
              sku_code: "BABYONBU000000E63E7412MX",
            },
          })
          cy.createAddress({
            ...euAddress,
          }).then((address) => {
            cy.setSameAddress(order.id, address.id).then(() => {
              cy.getShipments({
                orderId: order.id,
              }).then((shipments) => {
                cy.setShipmentMethod({
                  type: "Standard Shipping",
                  id: shipments[0].id,
                })
                cy.setShipmentMethod({
                  type: "Express Delivery EU",
                  id: shipments[1].id,
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
        `/?accessToken=${Cypress.env("accessToken")}&orderId=${
          this.newOrder.id
        }`
      )
      cy.wait(
        [
          "@getShippingMethods",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@getOrders",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", Cypress.env("accessToken"))
    })

    it("check if not avaible save to wallet", () => {
      cy.wait(5000)
      cy.dataCy("payment-save-wallet").should("not.exist")
    })

    it("insert data credit card and check data", () => {
      cy.dataCy("payment-source").each((e, i) => {
        cy.wrap(e).as(`paymentSource${i}`)
      })
      cy.get("@paymentSource0").within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242")
        cy.fillElementsInput("cardExpiry", "3333")
        cy.fillElementsInput("cardCvc", "333")
      })
      cy.get("@paymentSource0")
        .get("button")
        .each((e, i) => {
          cy.wrap(e).as(`paymentSourceButton${i}`)
        })

      cy.get("@paymentSourceButton3").click()

      cy.wait(
        [
          "@getShippingMethods",
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("payment-method-selected").should(
        "contain.text",
        "Stripe Payment"
      )
      cy.dataCy("payment-method-price-selected").should("contain.text", "0,00")
    })
  })
})
