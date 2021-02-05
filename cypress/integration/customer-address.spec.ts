import { internet } from "faker"

import { euAddress, euAddress2 } from "../support/utils"

describe("Checkout customer address", () => {
  const filename = "customer-addresses"
  const redirectUrl = internet.url()

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

  context("initial order empty", () => {
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
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait(["@getOrders", "@retrieveLineItems"])
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("fill billing form", () => {
      cy.dataCy("input_billing_address_first_name").type(euAddress.firstName)
      cy.dataCy("input_billing_address_last_name").type(euAddress.lastName)
      cy.dataCy("input_billing_address_line_1").type(euAddress.line1)
      cy.dataCy("input_billing_address_city").type(euAddress.city)
      cy.dataCy("input_billing_address_country_code").select(
        euAddress.countryCode
      )
      cy.dataCy("input_billing_address_state_code").type(euAddress.stateCode)
      cy.dataCy("input_billing_address_zip_code").type(euAddress.zipCode)
      cy.dataCy("input_billing_address_phone").type(euAddress.phone)
    })

    it("save form", () => {
      cy.dataCy("save-addresses-button").click()
      cy.wait([
        "@createAddress",
        "@updateOrder",
        "@getOrders",
        "@retrieveLineItems",
      ])
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("click to customer tab", () => {
      cy.dataCy("step_customer").click()
      cy.wait(["@getOrders", "@retrieveLineItems"])
      cy.dataCy("input_billing_address_first_name").should(
        "contain.value",
        euAddress.firstName
      ) // da non usare ma usare .should("have.attr" subito dopo click()
    })

    it("ship to different address", () => {
      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")
    })

    it("fill shipping form", () => {
      cy.dataCy("input_shipping_address_first_name").type(euAddress2.firstName)
      cy.dataCy("input_shipping_address_last_name").type(euAddress2.lastName)
      cy.dataCy("input_shipping_address_line_1").type(euAddress2.line1)
      cy.dataCy("input_shipping_address_city").type(euAddress2.city)
      cy.dataCy("input_shipping_address_country_code").select(
        euAddress2.countryCode
      )
      cy.dataCy("input_shipping_address_state_code").type(euAddress2.stateCode)
      cy.dataCy("input_shipping_address_zip_code").type(euAddress2.zipCode)
      cy.dataCy("input_shipping_address_phone").type(euAddress2.phone)
    })

    it("save form", () => {
      cy.dataCy("save-addresses-button").click()
      cy.wait([
        "@createAddress",
        "@updateOrder",
        "@getOrders",
        "@retrieveLineItems",
      ])
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
    })
  })

  context("initial order with same address", () => {
    before(function () {
      cy.getTokenCustomer({
        username: email,
        password: password,
      })
        .as("tokenObj")
        .then((tokenObj) => {
          cy.createOrder("draft", {
            languageCode: "en",
            customerEmail: email,
            accessToken: tokenObj.access_token,
          })
            .as("newOrder")
            .then((order) => {
              cy.createSkuLineItems({
                orderId: order.id,
                accessToken: tokenObj.access_token,
              })
              cy.createAddress({
                ...euAddress,
                accessToken: tokenObj.access_token,
              }).then((address) => {
                cy.setSameAddress(order.id, address.id, tokenObj.access_token)
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
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait(["@getOrders", "@retrieveLineItems"])
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check information", function () {
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })
  })

  context("initial order with differend address", () => {
    before(function () {
      cy.getTokenCustomer({
        username: email,
        password: password,
      })
        .as("tokenObj")
        .then((tokenObj) => {
          cy.createOrder("draft", {
            languageCode: "en",
            customerEmail: email,
            accessToken: tokenObj.access_token,
          })
            .as("newOrder")
            .then((order) => {
              cy.createSkuLineItems({
                orderId: order.id,
                accessToken: tokenObj.access_token,
              })
              cy.createAddress({
                ...euAddress,
                accessToken: tokenObj.access_token,
              }).then((billingAddress) => {
                cy.createAddress({
                  ...euAddress2,
                  accessToken: tokenObj.access_token,
                }).then((shippingAddress) => {
                  cy.setDifferentAddress(
                    order.id,
                    billingAddress.id,
                    shippingAddress.id,
                    tokenObj.access_token
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

    it("valid customer token", function () {
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait(["@getOrders", "@retrieveLineItems"])
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check information", function () {
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
    })
  })

  context("initial order empty with one address on book", () => {
    before(function () {
      cy.getTokenCustomer({
        username: email,
        password: password,
      })
        .as("tokenObj")
        .then((tokenObj) => {
          cy.createAddress({
            ...euAddress,
            accessToken: tokenObj.access_token,
          }).then((address) => {
            // add customer address
            cy.addAddressToBook(address.id, tokenObj.access_token).then(() => {
              cy.createOrder("draft", {
                languageCode: "en",
                customerEmail: email,
                accessToken: tokenObj.access_token,
              })
                .as("newOrder")
                .then((order) => {
                  cy.createSkuLineItems({
                    orderId: order.id,
                    accessToken: tokenObj.access_token,
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
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check information", () => {
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("click to customer tab", () => {
      cy.dataCy("edit-step-1-button").click()
      cy.dataCy("input_billing_address_first_name").should(
        "contain.value",
        euAddress.firstName
      ) // da non usare ma usare .should("have.attr" subito dopo click()
    })

    it("add new address to book", () => {
      cy.dataCy("add_new_billing_address").click()
      cy.dataCy("input_billing_address_first_name").type(euAddress2.firstName)
      cy.dataCy("input_billing_address_last_name").type(euAddress2.lastName)
      cy.dataCy("input_billing_address_line_1").type(euAddress2.line1)
      cy.dataCy("input_billing_address_city").type(euAddress2.city)
      cy.dataCy("input_billing_address_country_code").select(
        euAddress2.countryCode
      )
      cy.dataCy("input_billing_address_state_code").type(euAddress2.stateCode)
      cy.dataCy("input_billing_address_zip_code").type(euAddress2.zipCode)
      cy.dataCy("input_billing_address_phone").type(euAddress2.phone)
    })

    it("ship to different address, select address from book and save", () => {
      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")
      cy.dataCy("customer-shipping-address")
        .contains("p", euAddress.firstName)
        .click()
      cy.dataCy("save-addresses-button").click()
      cy.wait([
        "@createAddress",
        "@updateOrder",
        "@getOrders",
        "@retrieveLineItems",
      ])

      cy.dataCy("full_address_billing")
        .should("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
      cy.dataCy("full_address_shipping")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })
  })

  context.only("initial order empty with two address on book", () => {
    const emailTemp = internet.email().toLocaleLowerCase()
    const passwordTemp = internet.password()
    before(function () {
      cy.createCustomer({ email: emailTemp, password: passwordTemp }).then(
        () => {
          cy.getTokenCustomer({
            username: emailTemp,
            password: passwordTemp,
          })
            .as("tokenObj")
            .then((tokenObj) => {
              cy.createAddress({
                ...euAddress,
                accessToken: tokenObj.access_token,
              }).then((address1) => {
                // add customer address
                cy.addAddressToBook(address1.id, tokenObj.access_token).then(
                  () => {
                    cy.createAddress({
                      ...euAddress2,
                      accessToken: tokenObj.access_token,
                    }).then((address2) => {
                      cy.addAddressToBook(
                        address2.id,
                        tokenObj.access_token
                      ).then(() => {
                        cy.createOrder("draft", {
                          languageCode: "en",
                          customerEmail: emailTemp,
                          accessToken: tokenObj.access_token,
                        })
                          .as("newOrder")
                          .then((order) => {
                            cy.createSkuLineItems({
                              orderId: order.id,
                              accessToken: tokenObj.access_token,
                            })
                          })
                      })
                    })
                  }
                )
              })
            })
        }
      )
    })

    beforeEach(function () {
      console.log(emailTemp, passwordTemp)
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
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("select second address and save", () => {
      cy.dataCy("customer-billing-address")
        .contains("p", euAddress2.firstName)
        .click()
      cy.dataCy("save-addresses-button").click()
      cy.wait(["@getOrders", "@retrieveLineItems"])
      cy.dataCy("full_address_billing")
        .should("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
    })

    it("click tab customer address ship to different address and select first address book", () => {
      cy.dataCy("step_customer").click()
      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")
      cy.dataCy("customer-shipping-address")
        .contains("p", euAddress.firstName)
        .click()
    })

    it("save form", () => {
      cy.dataCy("save-addresses-button").click()
      cy.wait([
        "@createAddress",
        "@updateOrder",
        "@getOrders",
        "@retrieveLineItems",
      ])
      cy.dataCy("full_address_billing")
        .should("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })
  })
})
