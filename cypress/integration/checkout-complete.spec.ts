import { faker } from "@faker-js/faker"

import { euAddress } from "../support/utils"

describe("Checkout Complete", () => {
  const filename = "checkout-complete"

  const email = faker.internet.email().toLocaleLowerCase()
  const password = faker.internet.password()

  const returnUrl = "https://commercelayer.io/"

  before(function () {
    cy.createCustomer({ email: email, password: password }).then(() => {
      cy.getTokenCustomer({
        username: email,
        password: password,
      }).as("tokenObj")
    })
  })

  context("create order and place order", () => {
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        return_url: returnUrl,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: {
              quantity: "1",
              sku_code: "TESLA5",
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
          "@deliveryLeadTimes",
        ],
        { timeout: 100000 }
      )
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("select Standard Shipping and save", () => {
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click({ force: true })
      cy.wait(
        [
          "@patchShipments",
          "@getOrders",
          "@getCustomerAddresses",
          "@deliveryLeadTimes",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("save-shipments-button").click()
      cy.wait(["@getOrders"], {
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
          "@getOrders",
          "@updateOrder",
          "@getCustomerAddresses",
          "@getCustomerAddresses",
          "@stripePayments",
        ],
        {
          timeout: 100000,
        }
      )
      cy.dataCy("payment-method-amount").should("contain.text", "10,00")
    })

    it("insert data credit card and check data", () => {
      cy.dataCy("payment-source").each((e, i) => {
        cy.wrap(e).as(`paymentSource${i}`)
      })
      cy.get("@paymentSource3").within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242")
        cy.fillElementsInput("cardExpiry", "0333")
        cy.fillElementsInput("cardCvc", "333")
      })
    })

    it("place order and visit thankyou page", () => {
      cy.wait(2000)
      cy.dataCy("place-order-button").click()
      cy.wait(
        ["@getOrders", "@updateOrder", "@getCustomerAddresses", "@getOrders"],
        {
          timeout: 100000,
        }
      )
      cy.wait(2000)
      cy.dataCy("order-summary").should("contain", "TESLA5")
      cy.dataCy("billing-address-recap").should("contain", "Billed to:")
      cy.dataCy("billing-address-recap").should("contain", euAddress.firstName)
      cy.dataCy("shipping-address-recap").should("contain", "Shipped to:")
      cy.dataCy("shipping-address-recap").should("contain", euAddress.firstName)
      cy.dataCy("payment-recap").should("contain", "Payment")
      cy.dataCy("payment-recap").should("contain", "Visa ending in")
    })

    it("redirect to returnUrl", () => {
      cy.wait(2000)
      cy.dataCy("button-continue-to-shop").click()
      cy.wait(2000)
      cy.url().should("eq", returnUrl)
    })
  })
})
