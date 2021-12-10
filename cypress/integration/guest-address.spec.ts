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
        ["@getOrders", "@getOrders", "@getOrders", "@getOrders", "@getOrders"],
        { timeout: 100000 }
      )

      cy.dataCy("customer_email").should("contain.value", "alessani@gmail.tk")

      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("change customer email", () => {
      cy.dataCy("customer_email")
        .type(`{selectall}{backspace}${emailCustomer}`)
        .blur({ force: true })

      cy.wait(["@updateOrder"], {
        timeout: 100000,
      })

      cy.dataCy("customer_email").should("contain.value", emailCustomer)
    })

    it("fill billing form and save", function () {
      cy.fillForm({
        type: "billing",
        address: euAddress,
        requiresBillingInfo: requires_billing_info,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(["@getOrders", "@getOrders", "@updateOrder", "@createAddress"], {
        timeout: 100000,
      })

      cy.dataCy("customer-email-step-header").should("contain", emailCustomer)
    })

    it("check billing information", () => {
      cy.wait(1500)
      cy.checkForm({
        type: "billing",
        address: euAddress,
      })
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
      cy.fillForm({ type: "shipping", address: euAddress2 })

      cy.dataCy("save-addresses-button").click()

      cy.wait(["@getOrders", "@getOrders", "@updateOrder", "@createAddress"], {
        timeout: 100000,
      })
    })

    it("check billing and shipping information", () => {
      cy.wait(1500)
      cy.checkForm({
        type: "billing",
        address: euAddress,
      })
      cy.checkForm({
        type: "shipping",
        address: euAddress2,
      })
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
        ["@getOrders", "@getOrders", "@getOrders", "@getOrders", "@getOrders"],
        { timeout: 100000 }
      )

      cy.dataCy("customer-email-step-header").should(
        "contain",
        "alessani@gmail.thk"
      )

      cy.checkForm({ address: euAddress, type: "billing" })
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
        ["@getOrders", "@getOrders", "@getOrders", "@getOrders", "@getOrders"],
        { timeout: 100000 }
      )

      cy.dataCy("customer-email-step-header").should(
        "contain",
        "alessani@gmail.thk"
      )
    })

    it("check billing and shipping information", () => {
      cy.wait(1500)
      cy.checkForm({
        type: "billing",
        address: euAddress,
      })
      cy.checkForm({
        type: "shipping",
        address: euAddress2,
      })
    })
  })
})
