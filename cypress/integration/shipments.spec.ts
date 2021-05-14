import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout Shipments", () => {
  const filename = "shipments"

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

  context("order with one shipment not selected", () => {
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
          })
          cy.createAddress({
            ...euAddress,
            accessToken: this.tokenObj.access_token,
          }).then((address) => {
            cy.setSameAddress(order.id, address.id, this.tokenObj.access_token)
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
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@getOrders",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("select Standard Shipping and save", () => {
      cy.wait(
        [
          "@retrieveLineItems",
          "@updateOrder",
          "@retrieveLineItems",
          "@getOrderShipments",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click()
      cy.wait(["@retrieveLineItems", "@getShipments", "@getOrders"], {
        timeout: 100000,
      })
      cy.dataCy("save-shipments-button").click()
      cy.wait(
        [
          "@getShippingMethods",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("shipping-method-name-recap").should(
        "contain.text",
        "Standard Shipping"
      )
    })

    it("edit Delivery, select Express Delivery and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton1").click()
      cy.wait(
        [
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getShipments",
          "@getOrderShipments",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@retrieveLineItems",
          "@getShippingMethods",
          "@getOrderShipments",
          "@updateOrder",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("shipping-method-name-recap").should(
        "contain.text",
        "Express Delivery"
      )
    })
  })

  context("order with two shipments not selected", () => {
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
            attributes: { quantity: "1", sku_code: "CANVASAU000000FFFFFF1824" },
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
            cy.setSameAddress(order.id, address.id, this.tokenObj.access_token)
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
          "@retrieveLineItems",
          "@retrieveLineItems",
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
    })

    it("select Standard Shipping to both shipments and save", () => {
      cy.wait(
        [
          "@updateOrder",
          "@retrieveLineItems",
          "@getOrderShipments",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click()
      cy.wait(
        [
          "@retrieveLineItems",
          "@getOrders",
          "@getShipments",
          "@getOrderShipments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.get("@shippingMethodButton2").click()
      cy.wait(
        [
          "@retrieveLineItems",
          "@getOrders",
          "@getShipments",
          "@getOrderShipments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getShippingMethods",
          "@getOrderShipments",
          "@updateOrder",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
        ],
        {
          timeout: 100000,
        }
      )
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
    })

    it("edit Delivery, select Express Delivery to both shipments and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait("@retrieveLineItems", {
        timeout: 100000,
      })
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton1").click()
      cy.wait(
        [
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getShipments",
          "@getOrderShipments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.get("@shippingMethodButton3").click()
      cy.wait(
        [
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getShipments",
          "@getOrderShipments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getShippingMethods",
          "@getOrderShipments",
          "@getOrderShipments",
          "@updateOrder",
          "@availablePaymentMethods",
          "@getCustomerAddresses",
        ],
        {
          timeout: 100000,
        }
      )
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
    })

    it("edit Delivery, select Express Delivery to first shipment and select Standard Shipping to second shipment and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait("@retrieveLineItems", {
        timeout: 100000,
      })
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton1").click()
      cy.wait("@retrieveLineItems", {
        timeout: 100000,
      })
      cy.get("@shippingMethodButton2").click()
      cy.wait(
        [
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getShipments",
          "@getOrderShipments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getShippingMethods",
          "@getOrderShipments",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@updateOrder",
          "@getCustomerAddresses",
        ],
        {
          timeout: 100000,
        }
      )
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
    })

    it("edit Delivery, select Standard Shipping to first shipment and select Express Delivery to second shipment and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait("@retrieveLineItems", {
        timeout: 100000,
      })
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click()
      cy.wait(["@retrieveLineItems", "@getShipments"], {
        timeout: 100000,
      })
      cy.get("@shippingMethodButton3").click()
      cy.wait(
        [
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@getShipments",
          "@getOrderShipments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(
        [
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getShippingMethods",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getCustomerAddresses",
          "@updateOrder",
          "@availablePaymentMethods",
        ],
        {
          timeout: 100000,
        }
      )
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
    })
  })

  context("order with a Standard Shipping", () => {
    before(function () {
      console.log(email, password)
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
            attributes: { quantity: "1", sku_code: "CANVASAU000000FFFFFF1824" },
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
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check both Standard Shipping", () => {
      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@retrieveLineItems",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("shipping-method-name-recap").should(
        "contain.text",
        "Standard Shipping"
      )
    })
  })

  context("order with a Express Delivery EU", () => {
    before(function () {
      console.log(email, password)
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
                  type: "Express Delivery EU",
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
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check both Express Delivery", () => {
      cy.wait(
        [
          "@updateOrder",
          "@retrieveLineItems",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("shipping-method-name-recap").should(
        "contain.text",
        "Express Delivery"
      )
    })
  })

  context("order with 2 shipments both Standard Shipping", () => {
    before(function () {
      console.log(email, password)
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
            attributes: { quantity: "1", sku_code: "CANVASAU000000FFFFFF1824" },
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
                  type: "Standard Shipping",
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
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getShippingMethods",
          "@getOrderShipments",
        ],
        { timeout: 1000000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check both Standard Shipping", () => {
      cy.wait(
        [
          "@updateOrder",
          "@retrieveLineItems",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
        ],
        { timeout: 1000000 }
      )
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
    })
  })

  context("order with 2 shipments both Express Delivery EU", () => {
    before(function () {
      console.log(email, password)
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
            attributes: { quantity: "1", sku_code: "CANVASAU000000FFFFFF1824" },
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
                  type: "Express Delivery EU",
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
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getShippingMethods",
          "@getOrderShipments",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check both Express Delivery", () => {
      cy.wait(
        [
          "@updateOrder",
          "@retrieveLineItems",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getOrders",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )
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
    })
  })

  context(
    "order with 2 shipments: Standard Shipping and Express Delivery EU",
    () => {
      before(function () {
        console.log(email, password)
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
          `/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`
        )
        cy.wait(
          [
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
        cy.url().should("contain", this.tokenObj.access_token)
        cy.url().should("not.contain", Cypress.env("accessToken"))
      })

      it("check shipments: Standard Shipping and Express Delivery", () => {
        cy.wait(
          [
            "@updateOrder",
            "@retrieveLineItems",
            "@getOrderShipments",
            "@availablePaymentMethods",
            "@getOrders",
            "@getOrders",
            "@getOrders",
            "@getOrders",
            "@getOrders",
            "@getOrders",
            "@getOrders",
            "@getCustomerAddresses",
            "@getCustomerAddresses",
          ],
          { timeout: 100000 }
        )
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
      })
    }
  )
})
