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
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
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

    it("check step header badge", () => {
      cy.dataCy("step-header-badge").each((e, i) => {
        cy.wrap(e).as(`stepHeaderBadge${i}`)
      })
      cy.get("@stepHeaderBadge0").get("svg")
      cy.get("@stepHeaderBadge1").get("svg")
      cy.get("@stepHeaderBadge2").get("svg")
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

    it("place order and redirect", () => {
      cy.wait(3000)
      cy.dataCy("place-order-button").click()
      cy.wait(["@getOrderShipments", "@retrieveLineItems", "@updateOrder"], {
        timeout: 100000,
      })
      cy.dataCy("button-continue-to-shop").click()
      cy.wait(2000)
      cy.url().should("eq", returnUrl)
    })
  })

  context("order without shipment and free payment", () => {
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
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
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
        "This order does not require payment"
      )
    })

    it("check step header badge", () => {
      cy.dataCy("step-header-badge").each((e, i) => {
        cy.wrap(e).as(`stepHeaderBadge${i}`)
      })
      cy.get("@stepHeaderBadge0").get("svg")
      cy.get("@stepHeaderBadge1").get("svg")
    })

    it("place order and redirect", () => {
      cy.wait(3000)
      cy.dataCy("place-order-button").click()
      cy.wait(["@retrieveLineItems", "@updateOrder"], {
        timeout: 100000,
      })
      cy.dataCy("button-continue-to-shop").click()
      cy.wait(2000)
      cy.url().should("eq", returnUrl)
    })
  })

  context("order with free sku, with shipment and free payment", () => {
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
              sku_code: "TESLAFREE",
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

    it("valid customer token and check giftcard", function () {
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
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
      cy.get("@stepHeaderInfo2").should(
        "contain.text",
        "This order does not require payment"
      )
    })

    it("check step header badge", () => {
      cy.dataCy("step-header-badge").each((e, i) => {
        cy.wrap(e).as(`stepHeaderBadge${i}`)
      })
      cy.get("@stepHeaderBadge0").get("svg")
      cy.get("@stepHeaderBadge1").get("svg")
      cy.get("@stepHeaderBadge2").get("svg")
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

    it("place order and redirect", () => {
      cy.wait(3000)
      cy.dataCy("place-order-button").click()
      cy.wait(["@getOrderShipments", "@retrieveLineItems", "@updateOrder"], {
        timeout: 100000,
      })
      cy.dataCy("button-continue-to-shop").click()
      cy.wait(2000)
      cy.url().should("eq", returnUrl)
    })
  })
})
