import { internet } from "faker"

import { euAddress, euAddress2 } from "../support/utils"

describe("Checkout guest address", () => {
  const filename = "addresses"
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
      cy.wait(["@getOrders"])
      cy.reload()
      cy.wait(["@getOrders", "@retrieveLineItems"])
      cy.dataCy("customer_email").should("contain.value", emailCustomer)
    })

    it("fill billing form", () => {
      cy.dataCy("input_billing_address_first_name").type(euAddress.first_name)
      cy.dataCy("input_billing_address_last_name").type(euAddress.last_name)
      cy.dataCy("input_billing_address_line_1").type(euAddress.line_1)
      cy.dataCy("input_billing_address_city").type(euAddress.city)
      cy.dataCy("input_billing_address_country_code").select(
        euAddress.country_code
      )
      cy.dataCy("input_billing_address_state_code").type(euAddress.state_code)
      cy.dataCy("input_billing_address_zip_code").type(euAddress.zip_code)
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
        .should("contain", euAddress.line_1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zip_code)
        .and("contain", euAddress.state_code)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress.line_1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zip_code)
        .and("contain", euAddress.state_code)
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

    it("fill shipping form", () => {
      cy.dataCy("input_shipping_address_first_name").type(euAddress2.first_name)
      cy.dataCy("input_shipping_address_last_name").type(euAddress2.last_name)
      cy.dataCy("input_shipping_address_line_1").type(euAddress2.line_1)
      cy.dataCy("input_shipping_address_city").type(euAddress2.city)
      cy.dataCy("input_shipping_address_country_code").select(
        euAddress2.country_code
      )
      cy.dataCy("input_shipping_address_state_code").type(euAddress2.state_code)
      cy.dataCy("input_shipping_address_zip_code").type(euAddress2.zip_code)
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
        .should("contain", euAddress.line_1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zip_code)
        .and("contain", euAddress.state_code)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress2.line_1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zip_code)
        .and("contain", euAddress2.state_code)
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
            orderId: order.id,
            firstName: euAddress.first_name,
            lastName: euAddress.last_name,
            city: euAddress.city,
            countryCode: euAddress.country_code,
            line1: euAddress.line_1,
            phone: euAddress.phone,
            stateCode: euAddress.state_code,
            zipCode: euAddress.zip_code,
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
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line_1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zip_code)
        .and("contain", euAddress.state_code)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress.line_1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zip_code)
        .and("contain", euAddress.state_code)
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
            orderId: order.id,
            firstName: euAddress.first_name,
            lastName: euAddress.last_name,
            city: euAddress.city,
            countryCode: euAddress.country_code,
            line1: euAddress.line_1,
            phone: euAddress.phone,
            stateCode: euAddress.state_code,
            zipCode: euAddress.zip_code,
          }).then((billingAddress) => {
            cy.createAddress({
              orderId: order.id,
              firstName: euAddress2.first_name,
              lastName: euAddress2.last_name,
              city: euAddress2.city,
              countryCode: euAddress2.country_code,
              line1: euAddress2.line_1,
              phone: euAddress2.phone,
              stateCode: euAddress2.state_code,
              zipCode: euAddress2.zip_code,
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
      cy.dataCy("full_address_billing")
        .should("contain", euAddress.line_1)
        .and("contain", euAddress.phone)
        .and("contain", euAddress.city)
        .and("contain", euAddress.zip_code)
        .and("contain", euAddress.state_code)

      cy.dataCy("full_address_shipping")
        .should("contain", euAddress2.line_1)
        .and("contain", euAddress2.phone)
        .and("contain", euAddress2.city)
        .and("contain", euAddress2.zip_code)
        .and("contain", euAddress2.state_code)
    })
  })
})
