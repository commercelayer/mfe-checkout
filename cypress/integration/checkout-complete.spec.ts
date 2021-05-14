import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout Checkout Complete", () => {
  const filename = "checkout-complete"

  const email = internet.email().toLocaleLowerCase()
  const password = internet.password()

  const returnUrl = "https://www.extendi.it/"

  before(function () {
    cy.createCustomer({ email: email, password: password }).then(() => {
      cy.getTokenCustomer({
        username: email,
        password: password,
      }).as("tokenObj")
    })
  })

  context("create order and place order", () => {
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        return_url: returnUrl,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: {
              quantity: "1",
              sku_code: "TESLA5",
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
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
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
          "@getOrderShipments",
          "@getOrderShipments",
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
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("payment-method-selected").should("contain.text", "Visa")
      cy.dataCy("payment-method-price-selected").should("contain.text", "0,00")
    })

    it("place order and redirect", () => {
      cy.wait(2000)
      cy.dataCy("place-order-button").click()
      cy.wait(
        [
          "@getShippingMethods",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("button-continue-to-shop").click()
      cy.wait(200)
      cy.url().should("eq", returnUrl)
    })
  })
})
