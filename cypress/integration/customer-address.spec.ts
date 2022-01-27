import { faker } from "@faker-js/faker"

import { euAddress, euAddress2, euAddress3 } from "../support/utils"

describe("Checkout customer address", () => {
  const filename = "customer-addresses"

  const email = faker.internet.email().toLocaleLowerCase()
  const password = faker.internet.password()

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
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("fill billing form and save", () => {
      cy.fillForm({
        type: "billing",
        address: euAddress,
        requiresBillingInfo: requires_billing_info,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@deliveryLeadTimes",
          "@updateOrder",
          "@createAddress",
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )

      cy.dataCy("customer-email-step-header").should("contain", email)
    })

    it("check billing information", () => {
      cy.checkForm({
        type: "billing",
        address: euAddress,
        requiresBillingInfo: requires_billing_info,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("ship to different address, fill shipping form and save", function () {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")

      cy.fillForm({
        type: "shipping",
        address: euAddress2,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@getCustomerAddresses",
          "@updateOrder",
          "@createAddress",
          "@createAddress",
        ],
        { timeout: 100000 }
      )
    })

    it("check shipping information", () => {
      cy.checkForm({
        type: "shipping",
        address: euAddress2,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("edit billing address, fill billing form with  and save", function () {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.fillForm({
        type: "billing",
        address: euAddress3,
        requiresBillingInfo: requires_billing_info,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@getCustomerAddresses",
          "@updateOrder",
          "@createAddress",
          "@createAddress",
        ],
        { timeout: 100000 }
      )
    })

    it("check billing information", () => {
      cy.checkForm({
        type: "billing",
        address: euAddress3,
      })
      cy.wait("@deliveryLeadTimes")
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
          "@getOrders",
          "@getOrders",
          "@getCustomerAddresses",
          "@updateOrder",
          "@createAddress",
        ],
        { timeout: 100000 }
      )
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
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("check customer email and form", () => {
      cy.dataCy("customer-email-step-header").should("contain", email)
      cy.checkForm({
        type: "billing",
        address: euAddress,
        requiresBillingInfo: requires_billing_info,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("edit billing address, fill billing form and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.fillForm({
        type: "billing",
        address: euAddress3,
        requiresBillingInfo: requires_billing_info,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@createAddress",
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )
    })

    it("check billing information", () => {
      cy.checkForm({
        type: "billing",
        address: euAddress3,
        requiresBillingInfo: requires_billing_info,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("ship to different address, fill shipping form and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "true")

      cy.fillForm({
        type: "shipping",
        address: euAddress2,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@createAddress",
          "@createAddress",
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )
    })

    it("check shipping information", () => {
      cy.checkForm({
        type: "shipping",
        address: euAddress2,
      })
      cy.wait("@deliveryLeadTimes")
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
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@createAddress",
          "@deliveryLeadTimes",
          "@getCustomerAddresses",
        ],
        { timeout: 100000 }
      )
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
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check customer email and form", function () {
      cy.dataCy("customer-email-step-header").should("contain", email)

      cy.checkForm({
        type: "billing",
        address: euAddress,
        requiresBillingInfo: requires_billing_info,
      })
      cy.checkForm({
        type: "shipping",
        address: euAddress2,
      })
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
          "@getOrders",
          "@getOrders",
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
          "@deliveryLeadTimes",
          "@updateOrder",
          "@updateOrder",
          "@updateAddress",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
      requires_billing_info = this.newOrder.attributes.requires_billing_info
    })

    it("check customer email and form", () => {
      cy.dataCy("customer-email-step-header").should("contain", email)
      cy.checkAddressBook({
        type: "billing",
        address: euAddress,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("add custom billing address and save", function () {
      cy.dataCy("step_customer").click()

      cy.wait(1500)

      cy.dataCy("add_new_billing_address").click()

      cy.fillForm({
        type: "billing",
        address: euAddress2,
        requiresBillingInfo: requires_billing_info,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(["@getOrders", "@getOrders", "@updateOrder", "@createAddress"], {
        timeout: 100000,
      })
    })

    it("check billing information", () => {
      cy.checkForm({
        type: "billing",
        address: euAddress2,
        requiresBillingInfo: requires_billing_info,
      })
      cy.wait("@deliveryLeadTimes")
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

      cy.fillForm({
        type: "shipping",
        address: euAddress,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(["@getOrders", "@getOrders", "@updateOrder", "@createAddress"], {
        timeout: 100000,
      })
    })

    it("check shipping information", () => {
      cy.checkForm({
        type: "shipping",
        address: euAddress,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("select first shipping address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("close-shipping-form").click()

      cy.wait(1500)

      cy.dataCy("customer-shipping-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait("@updateAddress", { timeout: 100000 })

      cy.dataCy("save-addresses-button").click()

      cy.wait(["@getOrders", "@getOrders", "@updateOrder", "@createAddress"], {
        timeout: 100000,
      })
    })

    it("check billing and shipping information", () => {
      cy.wait(1500)
      cy.checkForm({
        type: "billing",
        address: euAddress2,
      })
      cy.checkAddressBook({
        type: "shipping",
        address: euAddress,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("select first billing address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("close-billing-form").click()

      cy.wait(1500)

      cy.dataCy("customer-billing-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait("@updateAddress", {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(["@getOrders", "@getOrders", "@updateOrder"], {
        timeout: 100000,
      })
    })

    it("check billing information", () => {
      cy.checkAddressBook({
        type: "billing",
        address: euAddress,
      })
      cy.wait("@deliveryLeadTimes")
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

      cy.wait("@updateAddress", { timeout: 100000 })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        ["@getOrders", "@getOrders", "@updateOrder", "@deliveryLeadTimes"],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("customer-email-step-header").should("contain", emailTemp)
    })

    it("check billing information", () => {
      cy.wait(1500)
      cy.checkAddressBook({
        type: "billing",
        address: euAddress,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("select second address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("customer-billing-address")
        .contains("p", euAddress2.firstName)
        .click()

      cy.wait("@updateAddress", { timeout: 100000 })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        ["@getOrders", "@getOrders", "@updateOrder", "@deliveryLeadTimes"],
        {
          timeout: 100000,
        }
      )
    })

    it("check billing information", () => {
      cy.wait(1500)
      cy.checkAddressBook({
        type: "billing",
        address: euAddress2,
        index: 1,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("add custom billing address and save", function () {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("add_new_billing_address").click()

      cy.fillForm({
        type: "billing",
        address: euAddress2,
        requiresBillingInfo: requires_billing_info,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        ["@getOrders", "@getOrders", "@updateOrder", "@deliveryLeadTimes"],
        {
          timeout: 100000,
        }
      )
    })

    it("check billing information", () => {
      cy.checkForm({
        type: "billing",
        address: euAddress2,
        requiresBillingInfo: requires_billing_info,
      })
      cy.wait("@deliveryLeadTimes")
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

      cy.fillForm({
        type: "shipping",
        address: euAddress3,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@createAddress",
          "@createAddress",
          "@deliveryLeadTimes",
        ],
        {
          timeout: 100000,
        }
      )
    })

    it("check billing and shipping information", () => {
      cy.checkForm({
        type: "billing",
        address: euAddress2,
        requiresBillingInfo: requires_billing_info,
      })
      cy.checkForm({
        type: "shipping",
        address: euAddress3,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("select second shipping address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("close-shipping-form").click()

      cy.wait(1500)

      cy.dataCy("customer-shipping-address")
        .contains("p", euAddress2.firstName)
        .click()

      cy.wait(["@updateAddress"], {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@updateOrder",
          "@createAddress",
          "@deliveryLeadTimes",
        ],
        {
          timeout: 100000,
        }
      )
    })

    it("check billing information", () => {
      cy.checkForm({
        type: "billing",
        address: euAddress2,
        requiresBillingInfo: requires_billing_info,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("select first billing address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("close-billing-form").click()

      cy.wait(1500)

      cy.dataCy("customer-billing-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait(["@updateAddress"], {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        ["@getOrders", "@getOrders", "@updateOrder", "@deliveryLeadTimes"],
        {
          timeout: 100000,
        }
      )
    })

    it("check billing information", () => {
      cy.checkAddressBook({
        type: "billing",
        address: euAddress,
      })
      cy.wait("@deliveryLeadTimes")
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
      console.log(email, password, this.newOrder.id)

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
        ],
        { timeout: 100000 }
      )

      cy.url().should("contain", this.tokenObj.access_token)
      requires_billing_info = this.newOrder.attributes.requires_billing_info
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("select first address and save", () => {
      cy.dataCy("customer-billing-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait("@updateAddress", {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        ["@getOrders", "@getOrders", "@updateOrder", "@deliveryLeadTimes"],
        {
          timeout: 100000,
        }
      )

      cy.dataCy("customer-email-step-header").should("contain", emailTemp)
    })

    it("check billing information", () => {
      cy.wait(1500)
      cy.checkAddressBook({
        type: "billing",
        address: euAddress,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("select second address and save is disabled", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("customer-billing-address")
        .contains("p", euAddress2.firstName)
        .click()

      cy.wait("@updateAddress", {
        timeout: 100000,
      })

      cy.dataCy("save-addresses-button").should("be.disabled")
    })

    it("check billing information", () => {
      cy.wait(1500)
      cy.checkAddressBook({
        type: "billing",
        address: euAddress2,
        index: 1,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("add custom billing address and save is disabled", function () {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("add_new_billing_address").click()

      cy.fillForm({
        type: "billing",
        address: euAddress2,
        requiresBillingInfo: requires_billing_info,
      })

      cy.dataCy("save-addresses-button").should("be.disabled")
    })

    it("change billing address country code and save", () => {
      cy.dataCy("input_billing_address_country_code").select(countryCode)
      cy.wait(3000)
      cy.dataCy("input_billing_address_state_code").select(euAddress.stateCode)

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@deliveryLeadTimes",
          "@updateOrder",
          "@createAddress",
        ],
        { timeout: 100000 }
      )

      // cy.dataCy("full-billing-information")
      //   .should("contain", euAddress2.firstName)
      //   .and("contain", euAddress2.lastName)
      //   .and("contain", euAddress2.line1)
      //   .and("contain", euAddress2.phone)
      //   .and("contain", euAddress2.city)
      //   .and("contain", euAddress2.zipCode)
      //   .and("contain", countryCode)
      //   .and("contain", euAddress2.billingInfo)
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

      cy.fillForm({
        type: "shipping",
        address: euAddress3,
        countryCodeLock: true,
      })

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        [
          "@getOrders",
          "@getOrders",
          "@deliveryLeadTimes",
          "@updateOrder",
          "@createAddress",
        ],
        { timeout: 100000 }
      )
    })

    it("check shipping information", () => {
      cy.checkForm({
        type: "shipping",
        address: euAddress3,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("select second shipping address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("close-shipping-form").click()

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

      cy.wait(["@updateAddress"], {
        timeout: 100000,
      })

      cy.wait(2000)

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        ["@getOrders", "@getOrders", "@updateOrder", "@deliveryLeadTimes"],
        {
          timeout: 100000,
        }
      )
    })

    it("check shipping information", () => {
      cy.checkAddressBook({
        type: "shipping",
        address: euAddress,
      })
      cy.wait("@deliveryLeadTimes")
    })

    it("select first billing address, ship to same address and save", () => {
      cy.dataCy("step_customer")
        .click()
        .should("have.attr", "data-status", "true")

      cy.wait(1500)

      cy.dataCy("close-billing-form").click()

      cy.wait(1500)

      cy.dataCy("customer-billing-address")
        .contains("p", euAddress.firstName)
        .click()

      cy.wait(["@updateAddress"], {
        timeout: 100000,
      })

      cy.dataCy("button-ship-to-different-address")
        .click()
        .should("have.attr", "data-status", "false")

      cy.dataCy("save-addresses-button").click()

      cy.wait(
        ["@getOrders", "@getOrders", "@updateOrder", "@deliveryLeadTimes"],
        {
          timeout: 100000,
        }
      )

      // cy.dataCy("full-billing-information")
      //   .should("contain", euAddress.firstName)
      //   .and("contain", euAddress.lastName)
      //   .and("contain", euAddress.line1)
      //   .and("contain", euAddress.phone)
      //   .and("contain", euAddress.city)
      //   .and("contain", euAddress.zipCode)
    })

    it("check billing information", () => {
      cy.checkAddressBook({
        type: "billing",
        address: euAddress,
      })
      cy.wait("@deliveryLeadTimes")
    })
  })
})
