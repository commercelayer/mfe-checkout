import { internet } from "faker"

import { euAddress, euAddress2, euAddress3 } from "../support/utils"

describe("Checkout customer address", () => {
  const filename = "customer-addresses"

  const email = internet.email().toLocaleLowerCase()
  const password = internet.password()

  let requires_billing_info = false

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
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getShippingMethods",
          "@getOrderShipments",
          "@getOrderShipments",
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
      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("fill billing form and save", () => {
      cy.dataCy("input_billing_address_first_name").type(euAddress.firstName)
      cy.dataCy("input_billing_address_last_name").type(euAddress.lastName)
      cy.dataCy("input_billing_address_line_1").type(euAddress.line1)
      cy.dataCy("input_billing_address_city").type(euAddress.city)
      cy.dataCy("input_billing_address_country_code").select(
        euAddress.countryCode
      )
      cy.wait(2000)
      cy.dataCy("input_billing_address_state_code").select(euAddress.stateCode)
      cy.dataCy("input_billing_address_zip_code").type(euAddress.zipCode)
      cy.dataCy("input_billing_address_phone").type(euAddress.phone)

      if (requires_billing_info) {
        cy.dataCy("input_billing_address_billing_info").type(
          euAddress.billingInfo
        )
      }

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("ship to different address, fill shipping form and save", function () {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")

      cy.dataCy("input_shipping_address_first_name").type(euAddress2.firstName)
      cy.dataCy("input_shipping_address_last_name").type(euAddress2.lastName)
      cy.dataCy("input_shipping_address_line_1").type(euAddress2.line1)
      cy.dataCy("input_shipping_address_city").type(euAddress2.city)
      cy.dataCy("input_shipping_address_country_code").select(
        euAddress2.countryCode
      )
      cy.wait(2000)
      cy.dataCy("input_shipping_address_state_code").select(
        euAddress2.stateCode
      )
      cy.dataCy("input_shipping_address_zip_code").type(euAddress2.zipCode)
      cy.dataCy("input_shipping_address_phone").type(euAddress2.phone)

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@createAddress",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("full-shipping-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
    })

    it("edit billing address, fill billing form and save", function () {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("input_billing_address_first_name").type(
        `{selectall}{backspace}${euAddress3.firstName}`
      )
      cy.dataCy("input_billing_address_last_name").type(
        `{selectall}{backspace}${euAddress3.lastName}`
      )
      cy.dataCy("input_billing_address_line_1").type(
        `{selectall}{backspace}${euAddress3.line1}`
      )
      cy.dataCy("input_billing_address_city").type(
        `{selectall}{backspace}${euAddress3.city}`
      )
      cy.dataCy("input_billing_address_country_code").select(
        euAddress3.countryCode
      )
      cy.wait(2000)
      cy.dataCy("input_billing_address_state_code").select(euAddress3.stateCode)
      cy.dataCy("input_billing_address_zip_code").type(
        `{selectall}{backspace}${euAddress3.zipCode}`
      )
      cy.dataCy("input_billing_address_phone").type(
        `{selectall}{backspace}${euAddress3.phone}`
      )

      if (requires_billing_info) {
        cy.dataCy("input_billing_address_billing_info").type(
          euAddress3.billingInfo
        )
      }

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@createAddress",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress3.firstName)
        .and("contain", euAddress3.lastName)
        .and("contain", euAddress3.line1)
        .and("contain", euAddress3.phone)
        .and("contain", euAddress3.city)
        .and("contain", euAddress3.zipCode)
        .and("contain", euAddress3.stateCode)
        .and("contain", euAddress3.billingInfo)

      cy.dataCy("full-shipping-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
    })

    it("ship to different address disable and save", () => {
      cy.dataCy("step_customer")
        .click({ force: true })
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "false")

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress3.firstName)
        .and("contain", euAddress3.lastName)
        .and("contain", euAddress3.line1)
        .and("contain", euAddress3.phone)
        .and("contain", euAddress3.city)
        .and("contain", euAddress3.zipCode)
        .and("contain", euAddress3.stateCode)
        .and("contain", euAddress3.billingInfo)
    })
  })

  context("initial order with same address", () => {
    let requires_billing_info = false
    beforeEach(function () {
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
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getShippingMethods",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
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
      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("check information", () => {
      cy.dataCy("full-billing-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("edit billing address, fill billing form and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("input_billing_address_first_name").type(
        `{selectall}{backspace}${euAddress3.firstName}`
      )
      cy.dataCy("input_billing_address_last_name").type(
        `{selectall}{backspace}${euAddress3.lastName}`
      )
      cy.dataCy("input_billing_address_line_1").type(
        `{selectall}{backspace}${euAddress3.line1}`
      )
      cy.dataCy("input_billing_address_city").type(
        `{selectall}{backspace}${euAddress3.city}`
      )
      cy.dataCy("input_billing_address_country_code").select(
        euAddress3.countryCode
      )
      cy.wait(2000)
      cy.dataCy("input_billing_address_state_code").select(euAddress3.stateCode)
      cy.dataCy("input_billing_address_zip_code").type(
        `{selectall}{backspace}${euAddress3.zipCode}`
      )
      cy.dataCy("input_billing_address_phone").type(
        `{selectall}{backspace}${euAddress3.phone}`
      )

      if (requires_billing_info) {
        cy.dataCy("input_billing_address_billing_info").type(
          `{selectall}{backspace}${euAddress3.billingInfo}`
        )
      }

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress3.firstName)
        .and("contain", euAddress3.lastName)
        .and("contain", euAddress3.line1)
        .and("contain", euAddress3.phone)
        .and("contain", euAddress3.city)
        .and("contain", euAddress3.zipCode)
        .and("contain", euAddress3.stateCode)
        .and("contain", euAddress3.billingInfo)
    })

    it("ship to different address, fill shipping form and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")

      cy.dataCy("input_shipping_address_first_name").type(euAddress2.firstName)
      cy.dataCy("input_shipping_address_last_name").type(euAddress2.lastName)
      cy.dataCy("input_shipping_address_line_1").type(euAddress2.line1)
      cy.dataCy("input_shipping_address_city").type(euAddress2.city)
      cy.dataCy("input_shipping_address_country_code").select(
        euAddress2.countryCode
      )
      cy.wait(2000)
      cy.dataCy("input_shipping_address_state_code").select(
        euAddress2.stateCode
      )
      cy.dataCy("input_shipping_address_zip_code").type(euAddress2.zipCode)
      cy.dataCy("input_shipping_address_phone").type(euAddress2.phone)

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@createAddress",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress3.firstName)
        .and("contain", euAddress3.lastName)
        .and("contain", euAddress3.line1)
        .and("contain", euAddress3.phone)
        .and("contain", euAddress3.city)
        .and("contain", euAddress3.zipCode)
        .and("contain", euAddress3.stateCode)
        .and("contain", euAddress3.billingInfo)

      cy.dataCy("full-shipping-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
    })

    it("ship to different address disable and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "false")

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress3.firstName)
        .and("contain", euAddress3.lastName)
        .and("contain", euAddress3.line1)
        .and("contain", euAddress3.phone)
        .and("contain", euAddress3.city)
        .and("contain", euAddress3.zipCode)
        .and("contain", euAddress3.stateCode)
        .and("contain", euAddress3.billingInfo)
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
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getShippingMethods",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
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

    it("check information", function () {
      cy.dataCy("full-billing-information")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("full-shipping-information")
        .should("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
    })
  })

  context("initial order empty with one address on book", () => {
    let requires_billing_info = false
    beforeEach(function () {
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
      cy.visit(`/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`)
      cy.wait(
        [
          "@getShippingMethods",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@updateOrder",
          "@updateAddress",
          "@updateAddress",
          "@getCustomerAddresses",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("check information", () => {
      cy.dataCy("full-billing-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("add custom billing address and save", function () {
      cy.dataCy("step_customer").click()

      cy.wait(1500)

      cy.dataCy("add_new_billing_address").click()

      cy.dataCy("input_billing_address_first_name").type(euAddress2.firstName)
      cy.dataCy("input_billing_address_last_name").type(euAddress2.lastName)
      cy.dataCy("input_billing_address_line_1").type(euAddress2.line1)
      cy.dataCy("input_billing_address_city").type(euAddress2.city)
      cy.dataCy("input_billing_address_country_code").select(
        euAddress2.countryCode
      )
      cy.wait(2000)
      cy.dataCy("input_billing_address_state_code").select(euAddress2.stateCode)
      cy.dataCy("input_billing_address_zip_code").type(euAddress2.zipCode)
      cy.dataCy("input_billing_address_phone").type(euAddress2.phone)

      if (requires_billing_info) {
        cy.dataCy("input_billing_address_billing_info").type(
          euAddress2.billingInfo
        )
      }

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
        .and("contain", euAddress2.billingInfo)
    })

    it("add custom shipping address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")

      cy.dataCy("add_new_shipping_address").click()

      cy.dataCy("input_shipping_address_first_name").type(euAddress3.firstName)
      cy.dataCy("input_shipping_address_last_name").type(euAddress3.lastName)
      cy.dataCy("input_shipping_address_line_1").type(euAddress3.line1)
      cy.dataCy("input_shipping_address_city").type(euAddress3.city)
      cy.dataCy("input_shipping_address_country_code").select(
        euAddress3.countryCode
      )
      cy.wait(2000)
      cy.dataCy("input_shipping_address_state_code").select(
        euAddress3.stateCode
      )
      cy.dataCy("input_shipping_address_zip_code").type(euAddress3.zipCode)
      cy.dataCy("input_shipping_address_phone").type(euAddress3.phone)

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@createAddress",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
        .and("contain", euAddress2.billingInfo)

      cy.dataCy("full-shipping-information")
        .should("contain", euAddress3.firstName)
        .and("contain", euAddress3.lastName)
        .and("contain", euAddress3.line1)
        .and("contain", euAddress3.phone)
        .and("contain", euAddress3.city)
        .and("contain", euAddress3.zipCode)
        .and("contain", euAddress3.stateCode)
    })

    it("select first shipping address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("customer-shipping-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait(["@getAddress", "@updateAddress"], { timeout: 100000 })

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
        .and("contain", euAddress2.billingInfo)

      cy.dataCy("full-shipping-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("select first billing address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("customer-billing-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait("@getAddress", {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@availableCustomerPaymentSources",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("ship to different address is disable", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("button-ship-to-different-address").should(
        "have.attr",
        "data-status",
        "false"
      )
    })
  })

  context("initial order empty with two address on book", () => {
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

    let requires_billing_info = false

    beforeEach(function () {
      console.log(emailTemp, passwordTemp)
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"),
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
      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("select first address and save", () => {
      cy.dataCy("customer-billing-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait(["@getAddress", "@updateAddress"], {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("select second address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("customer-billing-address")
        .contains("p", euAddress2.firstName)
        .click()

      cy.wait(["@getAddress", "@updateAddress"], {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
        .and("contain", euAddress2.billingInfo)
    })

    it("add custom billing address and save", function () {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("add_new_billing_address").click()

      cy.dataCy("input_billing_address_first_name").type(euAddress2.firstName)
      cy.dataCy("input_billing_address_last_name").type(euAddress2.lastName)
      cy.dataCy("input_billing_address_line_1").type(euAddress2.line1)
      cy.dataCy("input_billing_address_city").type(euAddress2.city)
      cy.dataCy("input_billing_address_country_code").select(
        euAddress2.countryCode
      )
      cy.wait(2000)
      cy.dataCy("input_billing_address_state_code").select(euAddress2.stateCode)
      cy.dataCy("input_billing_address_zip_code").type(euAddress2.zipCode)
      cy.dataCy("input_billing_address_phone").type(euAddress2.phone)

      if (requires_billing_info) {
        cy.dataCy("input_billing_address_billing_info").type(
          euAddress2.billingInfo
        )
      }

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        [
          "@getShippingMethods",
          "@getShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
          "@updateOrder",
          "@createAddress",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
        .and("contain", euAddress2.billingInfo)
    })

    it("add custom shipping address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")

      cy.dataCy("add_new_shipping_address").click()

      cy.dataCy("input_shipping_address_first_name").type(euAddress3.firstName)
      cy.dataCy("input_shipping_address_last_name").type(euAddress3.lastName)
      cy.dataCy("input_shipping_address_line_1").type(euAddress3.line1)
      cy.dataCy("input_shipping_address_city").type(euAddress3.city)
      cy.dataCy("input_shipping_address_country_code").select(
        euAddress3.countryCode
      )
      cy.wait(2000)
      cy.dataCy("input_shipping_address_state_code").select(
        euAddress3.stateCode
      )
      cy.dataCy("input_shipping_address_zip_code").type(euAddress3.zipCode)
      cy.dataCy("input_shipping_address_phone").type(euAddress3.phone)

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@createAddress",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
        .and("contain", euAddress2.billingInfo)

      cy.dataCy("full-shipping-information")
        .should("contain", euAddress3.firstName)
        .and("contain", euAddress3.lastName)
        .and("contain", euAddress3.line1)
        .and("contain", euAddress3.phone)
        .and("contain", euAddress3.city)
        .and("contain", euAddress3.zipCode)
        .and("contain", euAddress3.stateCode)
    })

    it("select second shipping address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("customer-shipping-address")
        .contains("p", euAddress2.firstName)
        .click()

      cy.wait(["@getAddress"], {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
        .and("contain", euAddress2.billingInfo)
    })

    it("select first billing address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("customer-billing-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait(["@getAddress"], {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })
  })

  context("initial order empty with country lock", () => {
    let requires_billing_info = false
    const emailTemp = internet.email().toLocaleLowerCase()
    const passwordTemp = internet.password()
    const countryCode = "IT"
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
                          languageCode: "it",
                          customerEmail: emailTemp,
                          accessToken: tokenObj.access_token,
                          shipping_country_code_lock: countryCode,
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
      requires_billing_info = this.newOrder.attributes.requires_billing_info
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("select first address and save", () => {
      cy.dataCy("customer-billing-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait(["@getAddress", "@updateAddress"], {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("select second address and save is disabled", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("customer-billing-address")
        .contains("p", euAddress2.firstName)
        .click()

      cy.wait(["@getAddress", "@updateAddress"], {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").should("be.disabled")
    })

    it("add custom billing address and save is disabled", function () {
      cy.dataCy("add_new_billing_address").click()

      cy.dataCy("input_billing_address_first_name").type(euAddress2.firstName)
      cy.dataCy("input_billing_address_last_name").type(euAddress2.lastName)
      cy.dataCy("input_billing_address_line_1").type(euAddress2.line1)
      cy.dataCy("input_billing_address_city").type(euAddress2.city)
      cy.dataCy("input_billing_address_country_code").select(
        euAddress2.countryCode
      )
      cy.wait(2000)
      cy.dataCy("input_billing_address_state_code").select(euAddress2.stateCode)
      cy.dataCy("input_billing_address_zip_code").type(euAddress2.zipCode)
      cy.dataCy("input_billing_address_phone").type(euAddress2.phone)

      if (requires_billing_info) {
        cy.dataCy("input_billing_address_billing_info").type(
          euAddress2.billingInfo
        )
      }

      cy.dataCy("save-addresses-button").should("be.disabled")
    })

    it("change billing address country code and save", () => {
      cy.dataCy("input_billing_address_country_code").select(countryCode)
      cy.wait(3000)
      cy.dataCy("input_billing_address_state_code").select(euAddress2.stateCode)

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
        .and("contain", countryCode)
        .and("contain", euAddress2.billingInfo)
    })

    it("add custom shipping address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")

      cy.dataCy("add_new_shipping_address").click()

      cy.dataCy("input_shipping_address_first_name").type(euAddress3.firstName)
      cy.dataCy("input_shipping_address_last_name").type(euAddress3.lastName)
      cy.dataCy("input_shipping_address_line_1").type(euAddress3.line1)
      cy.dataCy("input_shipping_address_city").type(euAddress3.city)
      cy.dataCy("input_shipping_address_country_code").should("be.disabled")
      cy.wait(3000)
      cy.dataCy("input_shipping_address_state_code").select(
        euAddress3.stateCode
      )
      cy.dataCy("input_shipping_address_zip_code").type(euAddress3.zipCode)
      cy.dataCy("input_shipping_address_phone").type(euAddress3.phone)

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@createAddress",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
        .and("contain", euAddress2.billingInfo)

      cy.dataCy("full-shipping-information")
        .should("contain", euAddress3.firstName)
        .and("contain", euAddress3.lastName)
        .and("contain", euAddress3.line1)
        .and("contain", euAddress3.phone)
        .and("contain", euAddress3.city)
        .and("contain", euAddress3.zipCode)
        .and("contain", euAddress3.stateCode)
    })

    it("select second shipping address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("customer-shipping-address")
        .contains("p", euAddress2.firstName)
        .click()

      cy.dataCy("save-addresses-button").should("be.disabled")
    })

    it("select first shipping address and save", () => {
      cy.dataCy("customer-shipping-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait(["@getAddress"], {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@createAddress",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
        .and("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
        .and("contain", euAddress2.billingInfo)

      cy.dataCy("full-shipping-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("select first billing address, ship to same address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("customer-billing-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait(["@getAddress"], {
        timeout: 100000,
      })

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "false")

      cy.dataCy("save-addresses-button").click()

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
          "@updateOrder",
          "@availableCustomerPaymentSources",
        ],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("full-billing-information")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
        .and("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })
  })
})
