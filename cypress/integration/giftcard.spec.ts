import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout GiftCard", () => {
  const filename = "giftcdard"

  const email = internet.email().toLocaleLowerCase()
  const password = internet.password()

  before(function () {
    cy.createCustomer({ email: email, password: password }).then(() => {
      cy.getTokenCustomer({
        username: email,
        password: password,
      }).as("tokenObj")
      cy.getTokenSuperuser().as("tokenObjSuperuser")
    })
  })

  context("order with gift card", function () {
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
              sku_code: "TSHIRTMMFFFFFF000000XLXX",
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
                cy.createGiftCard({
                  balanceCents: 10000,
                  recipientEmail: email,
                  accessToken: this.tokenObjSuperuser.access_token,
                }).then((e) =>
                  cy
                    .activeGiftCard({
                      giftcardId: e.id,
                      accessToken: this.tokenObjSuperuser.access_token,
                    })
                    .as("newGiftCardCode")
                    .then(() => {
                      cy.setGiftCard({
                        orderId: order.id,
                        giftCardCode: this.newGiftCardCode.attributes.code,
                        accessToken: this.tokenObjSuperuser.access_token,
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
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getShippingMethods",
          "@getOrderShipments",
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
      cy.dataCy("code-giftcard").should(
        "contain",
        this.newGiftCardCode.attributes.code
      )
    })

    it("select shipment and save", () => {
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
      cy.get("@shippingMethodButton3").click()
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
      cy.wait(
        ["@getShippingMethods", "@getOrderShipments", "@retrieveLineItems"],
        { timeout: 100000 }
      )
    })

    it("check total", () => {
      cy.dataCy("giftcard-amount").should("contain", "100,00")
      cy.dataCy("total-amount").should("contain", "156,00")
    })
  })

  context("order without giftcard", () => {
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
              sku_code: "TSHIRTMMFFFFFF000000XLXX",
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
                cy.createGiftCard({
                  balanceCents: 10000,
                  recipientEmail: email,
                  accessToken: this.tokenObjSuperuser.access_token,
                }).then((e) =>
                  cy
                    .activeGiftCard({
                      giftcardId: e.id,
                      accessToken: this.tokenObjSuperuser.access_token,
                    })
                    .as("newGiftCardCode")
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

    it("valid customer token, set manual gift card and check", function () {
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getShippingMethods",
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
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
      cy.dataCy("input_giftcard_coupon").type(
        this.newGiftCardCode.attributes.code
      )
      cy.dataCy("submit_giftcard_coupon").click()
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
        ],
        {
          timeout: 100000,
        }
      )
    })

    it("select shipment and save", () => {
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
      cy.get("@shippingMethodButton3").click()
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
      cy.wait(
        ["@getShippingMethods", "@getOrderShipments", "@retrieveLineItems"],
        { timeout: 100000 }
      )
    })

    it("check amount", () => {
      cy.dataCy("giftcard-amount").should("contain", "100,00")
      cy.dataCy("total-amount").should("contain", "156,00")
    })

    it("remove Gift Card and check amount", () => {
      cy.dataCy("remove_giftcard").click()
      cy.wait(
        [
          "@getShippingMethods",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@updateOrder",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("total-amount").should("contain", "256,00")
    })
  })
})
