import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout Checkout-Digital", () => {
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
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
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
  })
})
