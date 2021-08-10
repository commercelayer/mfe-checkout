import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout Checkout-Digital", () => {
  const returnUrl = "https://www.extendi.it/"

  const filename = "checkout-digital"

  const email = internet.email().toLocaleLowerCase()
  const password = internet.password()

  before(function () {
    cy.createCustomer({ email: email, password: password }).then(() => {
      cy.getTokenSuperuser().as("tokenObj")
    })
  })

  context("order with digital order", function () {
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        return_url: returnUrl,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createGiftCard({
            balanceCents: 10000,
            recipientEmail: email,
            accessToken: this.tokenObj.access_token,
          }).then((e) =>
            cy
              .activeGiftCard({
                giftcardId: e.id,
                accessToken: this.tokenObj.access_token,
              })
              .as("newGiftCardCode")
              .then(() => {
                cy.createSkuLineItems({
                  orderId: order.id,
                  attributes: {
                    quantity: "1",
                  },
                  relationships: {
                    item: {
                      data: {
                        type: "gift_card",
                        id: this.newGiftCardCode.id,
                      },
                    },
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
          )
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

    it("valid customer token and check if digital", function () {
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
        ],
        {
          timeout: 100000,
        }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
      cy.dataCy("step-header-info").should(
        "contain.text",
        "This order does not require shipping"
      )
    })

    it("check step header badge", () => {
      cy.dataCy("step-header-badge").each((e, i) => {
        cy.wrap(e).as(`stepHeaderBadge${i}`)
      })
      cy.get("@stepHeaderBadge0").get("svg")
      cy.get("@stepHeaderBadge1").get("svg")
      cy.get("@stepHeaderBadge2").should("contain.text", "3")
    })

    it("select payment method credit card", () => {
      cy.dataCy("payment-method-item").each((e, i) => {
        cy.wrap(e).as(`paymentMethodItem${i}`)
      })
      cy.get("@paymentMethodItem1").click({ force: true })
      cy.wait(
        [
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@stripePayments",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("payment-method-amount").should("contain.text", "10,00")
    })

    it("insert data credit card and check data", () => {
      cy.dataCy("payment-source").each((e, i) => {
        cy.wrap(e).as(`paymentSource${i}`)
      })
      cy.get("@paymentSource1").within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242")
        cy.fillElementsInput("cardExpiry", "3333")
        cy.fillElementsInput("cardCvc", "333")
      })
    })

    it("check step header badge", () => {
      cy.dataCy("step-header-badge").each((e, i) => {
        cy.wrap(e).as(`stepHeaderBadge${i}`)
      })
      cy.get("@stepHeaderBadge0").get("svg")
      cy.get("@stepHeaderBadge1").get("svg")
      cy.get("@stepHeaderBadge2").get("svg")
    })

    it("place order and redirect", () => {
      cy.wait(2000)
      cy.dataCy("place-order-button").click()
      cy.wait(
        [
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("button-continue-to-shop").click()
      cy.wait(2000)
      cy.url().should("eq", returnUrl)
    })
  })
})
