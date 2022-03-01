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

      cy.wait(["@getOrders", "@getOrders", "@getOrders"], {
        timeout: 100000,
      })

      cy.dataCy("customer_email").should("contain.value", "alessani@gmail.tk")

      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("change customer email", () => {
      cy.dataCy("customer_email")
        .type(`{selectall}{backspace}${emailCustomer}`)
        .blur({ force: true })

      cy.dataCy("customer_email").should("contain.value", emailCustomer)
    })

    it("fill billing form and save", function () {
      cy.fillForm({
        type: "billing",
        address: euAddress,
        requiresBillingInfo: requires_billing_info,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(["@getOrders", "@updateOrder", "@createAddress"], {
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
      cy.wait("@deliveryLeadTimes", {
        timeout: 100000,
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

      cy.wait(["@getOrders", "@updateOrder", "@createAddress"], {
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
      cy.wait("@deliveryLeadTimes", {
        timeout: 100000,
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
        ["@getOrders", "@getOrders", "@getOrders", "@deliveryLeadTimes"],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("customer-email-step-header").should(
        "contain",
        "alessani@gmail.thk"
      )

      cy.checkForm({ address: euAddress, type: "billing" })
    })
  })

  context("initial order with different address", () => {
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
        ["@getOrders", "@getOrders", "@getOrders", "@deliveryLeadTimes"],
        {
          timeout: 100000,
        }
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
      cy.wait("@deliveryLeadTimes", {
        timeout: 100000,
      })
    })
  })

  context("initial order with shipping country lock", () => {
    let requires_billing_info = false
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        shipping_country_code_lock: "IT",
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

      cy.wait(["@getOrders", "@getOrders", "@getOrders"], {
        timeout: 100000,
      })

      cy.dataCy("customer_email").should("contain.value", "alessani@gmail.tk")

      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("change customer email", () => {
      cy.dataCy("customer_email")
        .type(`{selectall}{backspace}${emailCustomer}`)
        .blur({ force: true })

      cy.dataCy("customer_email").should("contain.value", emailCustomer)
    })

    it("fill billing form and save", function () {
      cy.fillForm({
        type: "billing",
        address: euAddress,
        requiresBillingInfo: requires_billing_info,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(["@getOrders", "@updateOrder", "@createAddress"], {
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
      cy.wait("@deliveryLeadTimes", {
        timeout: 100000,
      })
    })

    it("click to customer tab", () => {
      cy.dataCy("step_customer").click()
      cy.dataCy("customer_email").should("contain.value", emailCustomer)
    })

    it("should have ship to different address on and enabled", () => {
      cy.dataCy("button-ship-to-different-address").should(
        "have.attr",
        "data-status",
        "false"
      )
      cy.dataCy("button-ship-to-different-address").should("be.enabled")
      cy.dataCy("input_billing_address_country_code").select("FR")
      cy.dataCy("button-ship-to-different-address").should(
        "have.attr",
        "data-status",
        "true"
      )
      cy.dataCy("button-ship-to-different-address").should("be.disabled")
    })

    it("should have country locked to Italy", () => {
      cy.dataCy("input_shipping_address_country_code").should("be.disabled")
    })

    it("should fill the form", () => {
      cy.fillForm({
        type: "shipping",
        countryCodeLock: true,
        address: {
          ...euAddress,
          firstName: "Mario",
          lastName: "Rossi",
          stateCode: "FI",
        },
      })
      cy.dataCy("save-addresses-button").click()
      cy.wait(["@getOrders", "@updateOrder", "@createAddress"], {
        timeout: 100000,
      })
    })

    it("check billing and shipping information", () => {
      cy.wait(1500)
      cy.checkForm({
        type: "billing",
        address: { ...euAddress, countryCode: "FR" },
      })
      cy.checkForm({
        type: "shipping",
        address: {
          ...euAddress,
          firstName: "Mario",
          lastName: "Rossi",
          stateCode: "FI",
        },
      })
      cy.wait("@deliveryLeadTimes", {
        timeout: 100000,
      })
    })
  })

  context("initial order with different address and country lock", () => {
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        shipping_country_code_lock: "IT",
        customerEmail: "alessani@gmail.thk",
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
          })
          cy.createAddress({
            ...euAddress2,
            accessToken: this.newOrder.access_token,
          }).then((billingAddress) => {
            cy.createAddress({
              ...euAddress,
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
        ["@getOrders", "@getOrders", "@getOrders", "@deliveryLeadTimes"],
        {
          timeout: 100000,
        }
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
        address: euAddress2,
      })
      cy.checkForm({
        type: "shipping",
        address: euAddress,
      })
      cy.wait("@deliveryLeadTimes", {
        timeout: 100000,
      })
    })

    it("check ship to different address disabled, shipping form shown", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait(1500)
      cy.dataCy("button-ship-to-different-address").should(
        "have.attr",
        "data-status",
        "true"
      )
      cy.dataCy("button-ship-to-different-address").should("be.disabled")
    })
  })
})
