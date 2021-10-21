import { euAddress, euAddress2 } from "../support/utils"

describe("Checkout guest address", () => {
  const filename = "guest-addresses"
  const emailCustomer = "gigi@buffon.it"

  context("initial order empty", () => {
    let requires_billing_info = false
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
      cy.visit(`/${this.newOrder.id}?accessToken=${Cypress.env("accessToken")}`)
      if (!Cypress.env("record")) {
        cy.newStubData("getOrders1", filename)
      }

      cy.wait(
        [
          "@getShippingMethods",
          "@getOrderShipments",
          "@getOrderShipments",
          "@retrieveLineItems",
          "@retrieveLineItems",
          "@getOrders",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("customer_email").should("contain.value", "alessani@gmail.tk")

      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("change customer email", () => {
      cy.dataCy("customer_email")
        .type(`{selectall}{backspace}${emailCustomer}`)
        .blur({ force: true })

      cy.wait(["@updateOrder", "@getOrders", "@retrieveLineItems"], {
        timeout: 100000,
      })

      cy.dataCy("customer_email").should("contain.value", emailCustomer)
    })

    it("fill billing form and save", function () {
      cy.dataCy("input_billing_address_first_name").type(euAddress.firstName)
      cy.dataCy("input_billing_address_last_name").type(euAddress.lastName)
      cy.dataCy("input_billing_address_line_1").type(euAddress.line1)
      cy.dataCy("input_billing_address_city").type(euAddress.city)
      cy.dataCy("input_billing_address_country_code").select(
        euAddress.countryCode
      )
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
        ],
        { timeout: 100000 }
      )

      cy.dataCy("customer-email-step-header").should("contain", emailCustomer)

      // cy.dataCy("full-billing-information")
      //   .should("contain", euAddress.firstName)
      //   .and("contain", euAddress.lastName)
      //   .and("contain", euAddress.line1)
      //   .and("contain", euAddress.phone)
      //   .and("contain", euAddress.city)
      //   .and("contain", euAddress.zipCode)
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
        ],
        { timeout: 100000 }
      )

      // cy.dataCy("full-billing-information")
      //   .should("contain", euAddress.firstName)
      //   .and("contain", euAddress.lastName)
      //   .and("contain", euAddress.line1)
      //   .and("contain", euAddress.phone)
      //   .and("contain", euAddress.city)
      //   .and("contain", euAddress.zipCode)

      // cy.dataCy("full-shipping-information")
      //   .should("contain", euAddress2.firstName)
      //   .and("contain", euAddress2.lastName)
      //   .and("contain", euAddress2.line1)
      //   .and("contain", euAddress2.phone)
      //   .and("contain", euAddress2.city)
      //   .and("contain", euAddress2.zipCode)
    })
  })

  context("initial order with same address", () => {
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
            ...euAddress,
            accessToken: this.newOrder.access_token,
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
      cy.visit(`/${this.newOrder.id}?accessToken=${Cypress.env("accessToken")}`)

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
        ],
        { timeout: 100000 }
      )

      cy.dataCy("customer-email-step-header").should(
        "contain",
        "alessani@gmail.thk"
      )

      // cy.dataCy("full-billing-information")
      //   .should("contain", euAddress.firstName)
      //   .and("contain", euAddress.lastName)
      //   .and("contain", euAddress.line1)
      //   .and("contain", euAddress.phone)
      //   .and("contain", euAddress.city)
      //   .and("contain", euAddress.zipCode)
    })
  })

  context("initial order with differend address", () => {
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
            ...euAddress,
            accessToken: this.newOrder.access_token,
          }).then((billingAddress) => {
            cy.createAddress({
              ...euAddress2,
              accessToken: this.newOrder.access_token,
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
      cy.visit(`/${this.newOrder.id}?accessToken=${Cypress.env("accessToken")}`)

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
        ],
        { timeout: 100000 }
      )

      cy.dataCy("customer-email-step-header").should(
        "contain",
        "alessani@gmail.thk"
      )

      // cy.dataCy("full-billing-information")
      //   .should("contain", euAddress.firstName)
      //   .and("contain", euAddress.lastName)
      //   .and("contain", euAddress.line1)
      //   .and("contain", euAddress.phone)
      //   .and("contain", euAddress.city)
      //   .and("contain", euAddress.zipCode)

      // cy.dataCy("full-shipping-information")
      //   .should("contain", euAddress2.firstName)
      //   .and("contain", euAddress2.lastName)
      //   .and("contain", euAddress2.line1)
      //   .and("contain", euAddress2.phone)
      //   .and("contain", euAddress2.city)
      //   .and("contain", euAddress2.zipCode)
    })
  })
})
