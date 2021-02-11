import { internet } from "faker"

import { euAddress, euAddress2 } from "../support/utils"

describe("Checkout guest address", () => {
  const filename = "guest-addresses"
  const emailCustomer = "gigi@buffon.it"

  context("initial order empty", () => {
    const redirectUrl = internet.url()

    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: "alessani@gmail.tk",
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
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

    it("exist customer email", function () {
      cy.visit(
        `/?accessToken=${Cypress.env("accessToken")}&orderId=${
          this.newOrder.id
        }&redirectUrl=${redirectUrl}`
      )
      if (!Cypress.env("record")) {
        cy.newStubData("getOrders1", filename)
      }

      cy.wait(["@getOrders", "@retrieveLineItems"])

      cy.dataCy("customer_email").should("contain.value", "alessani@gmail.tk")
    })

    it("change customer email", () => {
      cy.dataCy("customer_email")
        .type(`{selectall}{backspace}${emailCustomer}`)
        .blur({ force: true })

      cy.wait(["@updateOrder", "@getOrders", "@retrieveLineItems"])

      cy.reload()

      cy.wait(["@getOrders", "@retrieveLineItems"])

      cy.dataCy("customer_email").should("contain.value", emailCustomer)
    })

    it("fill billing form and save", () => {
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

      cy.dataCy("save-addresses-button").click()

      cy.wait([
        "@createAddress",
        "@updateOrder",
        "@getOrders",
        "@retrieveLineItems",
      ])

      cy.dataCy("fullname_billing")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("fullname_shipping")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
      cy.dataCy("full_address_shipping")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })

    it("click to customer tab", () => {
      cy.dataCy("step_customer").click()
      cy.dataCy("customer_email").should("contain.value", emailCustomer)
    })

    it("ship to different address", () => {
      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")
    })

    it("fill shipping form and save", () => {
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

      cy.dataCy("save-addresses-button").click()

      cy.wait([
        "@createAddress",
        "@updateOrder",
        "@getOrders",
        "@retrieveLineItems",
      ])

      cy.dataCy("fullname_billing")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("fullname_shipping")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
      cy.dataCy("full_address_shipping")
        .should("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
    })
  })

  context("initial order with same address", () => {
    const redirectUrl = internet.url()

    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: "alessani@gmail.thk",
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
          })
          cy.createAddress({
            firstName: euAddress.firstName,
            lastName: euAddress.lastName,
            city: euAddress.city,
            countryCode: euAddress.countryCode,
            line1: euAddress.line1,
            phone: euAddress.phone,
            stateCode: euAddress.stateCode,
            zipCode: euAddress.zipCode,
          }).then((address) => {
            cy.setSameAddress(order.id, address.id)
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

    it("check information", function () {
      cy.visit(
        `/?accessToken=${Cypress.env("accessToken")}&orderId=${
          this.newOrder.id
        }&redirectUrl=${redirectUrl}`
      )
      cy.wait(["@getOrders", "@retrieveLineItems"])

      cy.dataCy("fullname_billing")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("fullname_shipping")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
      cy.dataCy("full_address_shipping")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)
    })
  })

  context("initial order with differend address", () => {
    const redirectUrl = internet.url()

    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: "alessani@gmail.thk",
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
          })
          cy.createAddress({
            firstName: euAddress.firstName,
            lastName: euAddress.lastName,
            city: euAddress.city,
            countryCode: euAddress.countryCode,
            line1: euAddress.line1,
            phone: euAddress.phone,
            stateCode: euAddress.stateCode,
            zipCode: euAddress.zipCode,
          }).then((billingAddress) => {
            cy.createAddress({
              firstName: euAddress2.firstName,
              lastName: euAddress2.lastName,
              city: euAddress2.city,
              countryCode: euAddress2.countryCode,
              line1: euAddress2.line1,
              phone: euAddress2.phone,
              stateCode: euAddress2.stateCode,
              zipCode: euAddress2.zipCode,
            }).then((shippingAddress) => {
              cy.setDifferentAddress(
                order.id,
                billingAddress.id,
                shippingAddress.id
              )
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

    it("check information", function () {
      cy.visit(
        `/?accessToken=${Cypress.env("accessToken")}&orderId=${
          this.newOrder.id
        }&redirectUrl=${redirectUrl}`
      )
      cy.wait(["@getOrders", "@retrieveLineItems"])

      cy.dataCy("fullname_billing")
        .should("contain", euAddress.firstName)
        .and("contain", euAddress.lastName)
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zipCode)
        .and("contain", euAddress.stateCode)

      cy.dataCy("fullname_shipping")
        .should("contain", euAddress2.firstName)
        .and("contain", euAddress2.lastName)
      cy.dataCy("full_address_shipping")
        .should("contain", euAddress2.line1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zipCode)
        .and("contain", euAddress2.stateCode)
    })
  })
})
