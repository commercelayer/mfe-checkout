import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout Coupon", () => {
  const filename = "coupon"

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

  context("order with coupon", () => {
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
              quantity: "9",
              sku_code: "SWEETSMUB7B7B7E63E74LXXX",
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
                cy.setCoupon({
                  orderId: order.id,
                  couponCode: "testcoupon",
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
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@deliveryLeadTimes",
          "@paymentMethods",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("select shipment and save", () => {
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click({ force: true })
      cy.wait(
        [
          "@patchShipments",
          "@getOrders",
          "@deliveryLeadTimes",
          "@getCustomerAddresses",
        ],
        {
          timeout: 100000,
        }
      )
      cy.get("@shippingMethodButton3").click({ force: true })
      cy.wait(
        [
          "@patchShipments",
          "@getOrders",
          "@deliveryLeadTimes",
          "@getCustomerAddresses",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(["@getOrders", "@getOrders"], {
        timeout: 100000,
      })
    })

    it("check coupon", function () {
      cy.dataCy("code-coupon").should("contain", "testcoupon")
      cy.dataCy("discount-amount").should("contain", "124,20")
      cy.dataCy("total-amount").should("contain", "301,80")
    })
  })

  context("order without coupon", () => {
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
              quantity: "9",
              sku_code: "SWEETSMUB7B7B7E63E74LXXX",
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
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@paymentMethods",
          "@deliveryLeadTimes",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("select shipment and save", () => {
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click({ force: true })
      cy.wait(
        [
          "@getOrders",
          "@getCustomerAddresses",
          "@patchShipments",
          "@deliveryLeadTimes",
        ],
        {
          timeout: 100000,
        }
      )
      cy.get("@shippingMethodButton3").click({ force: true })
      cy.wait(
        [
          "@getOrders",
          "@getCustomerAddresses",
          "@patchShipments",
          "@deliveryLeadTimes",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(["@getOrders", "@getOrders", "@paymentMethods"], {
        timeout: 100000,
      })
    })

    it("check amount", () => {
      cy.dataCy("total-amount").should("contain", "426,00")
    })

    it("set coupon and check amount", () => {
      cy.dataCy("input_giftcard_coupon").type("testcoupon")
      cy.dataCy("submit_giftcard_coupon").click()
      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@getCustomerAddresses",
          "@updateOrder",
          "@paymentMethods",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("code-coupon").should("contain", "testcoupon")
      cy.dataCy("discount-amount").should("contain", "124,20")
      cy.dataCy("total-amount").should("contain", "301,80")
    })
    it("remove coupon and check amount", () => {
      cy.dataCy("remove_coupon").click({ force: true })
      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@getCustomerAddresses",
          "@updateOrder",
          "@paymentMethods",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("total-amount").should("contain", "426,00")
    })
  })
})
