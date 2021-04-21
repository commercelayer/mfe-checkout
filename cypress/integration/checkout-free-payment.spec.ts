import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout Free Payment", () => {
  const filename = "checkout-free-payment"

  const email = internet.email().toLocaleLowerCase()
  const password = internet.password()

  const returnUrl = "https://www.extendi.it/"

  before(function () {
    cy.createCustomer({ email: email, password: password }).then(() => {
      cy.getTokenCustomer({
        username: email,
        password: password,
      }).as("tokenObj")
      cy.getTokenSuperuser().as("tokenSuperuserObj")
    })
  })

  context("order with shipment and free payment", () => {
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
                cy.createGiftCard({
                  balanceCents: 50000,
                  recipientEmail: email,
                  accessToken: this.tokenSuperuserObj.access_token,
                }).then((e) =>
                  cy
                    .activeGiftCard({
                      giftcardId: e.id,
                      accessToken: this.tokenSuperuserObj.access_token,
                    })
                    .as("newGiftCardCode")
                    .then(() => {
                      cy.setGiftCard({
                        orderId: order.id,
                        giftCardCode: this.newGiftCardCode.attributes.code,
                        accessToken: this.tokenSuperuserObj.access_token,
                      })
                    })
                )
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

    it("valid customer token and check giftcard", function () {
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}`
      )
      cy.wait(
        [
          "@getShippingMethods",
          "@getShipments",
          "@getOrderShipments",
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
        ],
        {
          timeout: 100000,
        }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
      if (this.newGiftCardCode.attributes) {
        cy.dataCy("code-giftcard").should(
          "contain",
          this.newGiftCardCode.attributes.code
        )
      }
      cy.dataCy("giftcard-amount").should("contain", "30,00")
      cy.dataCy("total-amount").should("contain", "0,00")
      cy.dataCy("step-header-info").each((e, i) => {
        cy.wrap(e).as(`stepHeaderInfo${i}`)
      })
      cy.get("@stepHeaderInfo2").should(
        "contain.text",
        "This order does not require payment"
      )
    })

    it("place order and redirect", () => {
      cy.dataCy("place-order-button").click()
      cy.wait(
        [
          "@updateOrder",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getShippingMethods",
          "@getOrderShipments",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("button-continue-to-shop").click()
      cy.wait(200)
      cy.url().should("eq", returnUrl)
    })
  })

  context.skip("order without shipment and free payment", () => {
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createGiftCard({
            balanceCents: 0,
            recipientEmail: email,
            accessToken: this.tokenSuperuserObj.access_token,
          }).then((e) =>
            cy
              .activeGiftCard({
                giftcardId: e.id,
                accessToken: this.tokenSuperuserObj.access_token,
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
                  )
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

    it("valid customer token and check giftcard", function () {
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}`
      )
      cy.wait(
        [
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
        ],
        {
          timeout: 100000,
        }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
      cy.dataCy("total-amount").should("contain", "0,00")
      cy.dataCy("step-header-info").each((e, i) => {
        cy.wrap(e).as(`stepHeaderInfo${i}`)
      })
      cy.get("@stepHeaderInfo1").should(
        "contain.text",
        "This order does not require shipping"
      )
      cy.get("@stepHeaderInfo2").should(
        "contain.text",
        "This order does not require payment"
      )
    })

    it("place order and redirect", () => {
      cy.dataCy("place-order-button").click()
      cy.wait(
        [
          "@getOrders",
          "@retrieveLineItems",
          "@getShippingMethods",
          "@getOrderShipments",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("button-continue-to-shop").click()
      cy.wait(200)
      cy.url().should("eq", returnUrl)
    })
  })
})
