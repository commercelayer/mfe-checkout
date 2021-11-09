import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout Payments", () => {
  const filename = "payments"

  const email = String(Math.random()).concat(
    internet.email().toLocaleLowerCase()
  )
  const password = internet.password()

  before(() => cy.createCustomer({ email: email, password: password }))

  context("customer order with one payment method not selected", () => {
    before(function () {
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
                    console.log(shipments)
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
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
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
      cy.get("@shippingMethodButton3").click({ force: true })
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

    it("select payment method credit card", () => {
      cy.dataCy("payment-method-item").each((e, i) => {
        cy.wrap(e).as(`paymentMethodItem${i}`)
      })
      cy.get("@paymentMethodItem3").click({ force: true })
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
    })

    it("check if avaible save to wallet", () => {
      cy.wait(5000)
      cy.dataCy("payment-save-wallet").should("exist")
    })

    it("insert data credit card and check data", () => {
      cy.dataCy("payment-source").each((e, i) => {
        cy.wrap(e).as(`paymentSource${i}`)
      })
      cy.get("@paymentSource3").within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242")
        cy.fillElementsInput("cardExpiry", "3333")
        cy.fillElementsInput("cardCvc", "333")
      })
      cy.dataCy("payment-method-amount").should("contain.text", "10,00")
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
              sku_code: "TSHIRTMMFFFFFF000000XLXX",
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
      cy.visit(`/${this.newOrder.id}?accessToken=${Cypress.env("accessToken")}`)
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", Cypress.env("accessToken"))
    })

    it("select shipment and save", () => {
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click({ force: true })
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
      cy.get("@shippingMethodButton3").click({ force: true })
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

    it("check if not avaible save to wallet", () => {
      cy.wait(5000)
      cy.dataCy("payment-save-wallet").should("not.exist")
    })

    it("select payment method credit card", () => {
      cy.dataCy("payment-method-item").each((e, i) => {
        cy.wrap(e).as(`paymentMethodItem${i}`)
      })
      cy.get("@paymentMethodItem3").click({ force: true })
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
    })

    it("insert data credit card and check data", () => {
      cy.dataCy("payment-source").each((e, i) => {
        cy.wrap(e).as(`paymentSource${i}`)
      })
      cy.get("@paymentSource3").within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242")
        cy.fillElementsInput("cardExpiry", "3333")
        cy.fillElementsInput("cardCvc", "333")
      })
      cy.dataCy("payment-method-amount").should("contain.text", "10,00")
    })
  })

  context("select one method and change immediately", () => {
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
              sku_code: "TSHIRTMMFFFFFF000000XLXX",
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
      cy.visit(`/${this.newOrder.id}?accessToken=${Cypress.env("accessToken")}`)
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", Cypress.env("accessToken"))
    })

    it("select shipment and save", () => {
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click({ force: true })
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
      cy.get("@shippingMethodButton3").click({ force: true })
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

    it("check if not avaible save to wallet", () => {
      cy.wait(5000)
      cy.dataCy("payment-save-wallet").should("not.exist")
    })

    it("select payment method credit card", () => {
      cy.dataCy("payment-method-item").each((e, i) => {
        cy.wrap(e).as(`paymentMethodItem${i}`)
      })
      cy.get("@paymentMethodItem3").click({ force: true })
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
    })

    it("insert data credit card and check data", () => {
      cy.dataCy("payment-source").each((e, i) => {
        cy.wrap(e).as(`paymentSource${i}`)
      })
      cy.get("@paymentSource3").within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242")
        cy.fillElementsInput("cardExpiry", "3333")
        cy.fillElementsInput("cardCvc", "333")
      })
      cy.dataCy("payment-method-amount").should("contain.text", "10,00")
    })

    it("change payment method to wire transfer", () => {
      cy.dataCy("payment-method-item").each((e, i) => {
        cy.wrap(e).as(`paymentMethodItem${i}`)
      })
      cy.get("@paymentMethodItem4").click({ force: true })
      cy.dataCy("place-order-button").should("be.disabled")
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
        ],
        { timeout: 100000 }
      )
      cy.dataCy("place-order-button").should("be.enabled")
    })
  })

  context("customer order and braintree select method", () => {
    before(function () {
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
                    console.log(shipments)
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
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
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
      cy.get("@shippingMethodButton3").click({ force: true })
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

    it("select payment method credit card", () => {
      cy.dataCy("payment-method-item").each((e, i) => {
        cy.wrap(e).as(`paymentMethodItem${i}`)
      })
      cy.get("@paymentMethodItem1").click({ force: true })
      cy.wait(
        [
          "@getShipments",
          "@getShipments",
          "@getShipments",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )
    })

    it("check if avaible save to wallet", () => {
      cy.wait(5000)
      cy.dataCy("payment-save-wallet").should("exist")
    })

    it("insert data credit card and check if place order button is enable", () => {
      cy.dataCy("payment-source").each((e, i) => {
        cy.wrap(e).as(`paymentSource${i}`)
      })
      cy.get("@paymentSource0").within(() => {
        cy.fillElementsInput("number", "4111111111111111")
        cy.fillElementsInput("expirationDate", "022022")
        cy.fillElementsInput("cvc", "123")
      })
      cy.wait(2000)
      cy.dataCy("place-order-button").should("be.enabled")
    })
  })

  context(
    "save card to customer wallet, customer order with one payment method not selected",
    () => {
      before(function () {
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
                    sku_code: "SWEETHMUB7B7B7000000XLXX",
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
                      console.log(shipments)
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
            "@getShipments",
            "@getOrderShipments",
            "@getOrderShipments",
            "@availablePaymentMethods",
            "@retrieveLineItems",
            "@retrieveLineItems",
            "@getOrders",
            "@getCustomerAddresses",
            "@availableCustomerPaymentSources",
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
        cy.wait(["@getOrderShipments", "@retrieveLineItems"], {
          timeout: 100000,
        })
      })

      it("select payment method credit card", () => {
        cy.dataCy("payment-method-item").each((e, i) => {
          cy.wrap(e).as(`paymentMethodItem${i}`)
        })
        cy.get("@paymentMethodItem3").click({ force: true })
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
      })

      it("check if avaible save to wallet", () => {
        cy.wait(5000)
        cy.dataCy("payment-save-wallet").should("exist")
      })

      it("insert data credit card and check data", () => {
        cy.dataCy("payment-source").each((e, i) => {
          cy.wrap(e).as(`paymentSource${i}`)
        })
        cy.get("@paymentSource3").within(() => {
          cy.fillElementsInput("cardNumber", "4242424242424242")
          cy.fillElementsInput("cardExpiry", "3333")
          cy.fillElementsInput("cardCvc", "333")
        })
        cy.dataCy("save-to-wallet").click()
        cy.dataCy("payment-method-amount").should("contain.text", "10,00")
      })

      it("place order and redirect", () => {
        cy.wait(2000)
        cy.dataCy("place-order-button").click()
        cy.wait(
          [
            "@getShipments",
            "@getOrderShipments",
            "@getOrderShipments",
            "@retrieveLineItems",
            "@retrieveLineItems",
            "@getOrders",
            "@updateOrder",
            "@getCustomerAddresses",
            "@availableCustomerPaymentSources",
          ],
          { timeout: 100000 }
        )
      })
    }
  )

  context(
    "use card to customer wallet, customer order with one payment method not selected",
    () => {
      before(function () {
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
                    sku_code: "SWEETHMUB7B7B7000000XLXX",
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
                      console.log(shipments)
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
            "@getShipments",
            "@getOrderShipments",
            "@getOrderShipments",
            "@availablePaymentMethods",
            "@retrieveLineItems",
            "@retrieveLineItems",
            "@getOrders",
            "@getCustomerAddresses",
            "@availableCustomerPaymentSources",
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
        cy.wait(["@getOrderShipments", "@retrieveLineItems"], {
          timeout: 100000,
        })
      })

      it("select payment method credit card", () => {
        cy.dataCy("payment-method-item").each((e, i) => {
          cy.wrap(e).as(`paymentMethodItem${i}`)
        })
        cy.get("@paymentMethodItem3").click({ force: true })
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
      })

      it("check if avaible save to wallet", () => {
        cy.wait(5000)
        cy.dataCy("payment-save-wallet").should("exist")
      })

      it("select a card saved into wallet", () => {
        cy.dataCy("customer-card").each((e, i) => {
          cy.wrap(e).as(`customerCard${i}`)
        })
        cy.get("@customerCard0").dblclick()
        cy.wait(
          [
            "@getShipments",
            "@getOrderShipments",
            "@getOrderShipments",
            "@retrieveLineItems",
            "@retrieveLineItems",
            "@getOrders",
            "@getOrders",
          ],
          { timeout: 100000 }
        )
      })

      it("place order and redirect", () => {
        cy.wait(2000)
        cy.dataCy("place-order-button").click()
        cy.wait(["@getOrderShipments", "@retrieveLineItems", "@updateOrder"], {
          timeout: 100000,
        })
      })
    }
  )

  context("customer order select Adyen payment method", () => {
    before(function () {
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
                    console.log(shipments)
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
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@availablePaymentMethods",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
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
      cy.get("@shippingMethodButton3").click({ force: true })
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
      cy.wait("@retrieveLineItems", { timeout: 100000 })
    })

    it("select payment method credit card Adyen", () => {
      cy.dataCy("payment-method-item").each((e, i) => {
        cy.wrap(e).as(`paymentMethodItem${i}`)
      })
      cy.get("@paymentMethodItem0").click({ force: true })
      cy.wait(
        [
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@getOrders",
          "@updateOrder",
        ],
        { timeout: 100000 }
      )
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
        cy.fillElementsInput("encryptedCardNumber", "4111111111111111")
        cy.fillElementsInput("encryptedExpiryDate", "330")
        cy.fillElementsInput("encryptedSecurityCode", "737")
      })
      cy.dataCy("place-order-button").should("be.enabled")
    })
  })
})
