import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout Complete with terms and privacy", () => {
  const filename = "terms-privacy"

  const email = internet.email().toLocaleLowerCase()
  const password = internet.password()

  const returnUrl = "https://www.extendi.it/"

  before(function () {
    cy.createCustomer({ email: email, password: password }).then(() => {
      cy.getTokenCustomer({
        username: email,
        password: password,
      }).as("tokenObj")
    })
  })

  context.only(
    "create order and place order with checkbox privacy and terms",
    () => {
      before(function () {
        cy.createOrder("draft", {
          languageCode: "en",
          customerEmail: email,
          return_url: returnUrl,
          terms_url: "https://www.google.it",
          privacy_url: "https://www.google.it",
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
        cy.visit(
          `/${this.newOrder.id}?accessToken=${this.tokenObj.access_token}`
        )
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
        cy.wait(["@getOrders", "@getCustomerAddresses"], {
          timeout: 100000,
        })
        cy.dataCy("save-shipments-button").click()
        cy.wait(["@getOrders", "@getOrders", "@getOrders", "@getOrders"], {
          timeout: 100000,
        })
      })

      it("select payment method paypal", () => {
        cy.dataCy("payment-method-item").each((e, i) => {
          cy.wrap(e).as(`paymentMethodItem${i}`)
        })
        cy.get("@paymentMethodItem2").click({ force: true })
        cy.wait(
          ["@updateOrder", "@getCustomerAddresses", "@getOrders", "@getOrders"],
          { timeout: 100000 }
        )
      })

      it("set checkbox to checked", () => {
        cy.wait(2000)
        cy.dataCy("checkbox-privacy-and-terms").check()
        cy.wait(1000)
        cy.dataCy("checkbox-privacy-and-terms").should("be.checked")
      })

      it("place order and redirect", () => {
        cy.wait(2000)
        cy.dataCy("place-order-button").click()
        cy.wait(3000)
      })

      it("go back and check if checkbox is disable and place order button is disable", () => {
        cy.wait(2000)
        cy.go("back")
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
          ],
          { timeout: 100000 }
        )
      })

      it("check if checkbox is checked", () => {
        /* cy.wait(2000)
        cy.dataCy("checkbox-privacy-and-terms").check() */
        cy.wait(1000)
        cy.dataCy("checkbox-privacy-and-terms").should("not.be.checked")
        cy.dataCy("place-order-button").should("not.be.enabled")
      })

      it("set checkbox to checked", () => {
        cy.wait(2000)
        cy.dataCy("checkbox-privacy-and-terms").check()
        cy.wait(1000)
        cy.dataCy("checkbox-privacy-and-terms").should("be.checked")
      })

      it("place order and redirect", () => {
        cy.wait(2000)
        cy.dataCy("place-order-button").click()
        cy.wait(3000)
      })

      it("go back and check if checkbox is disable and place order button is disable", () => {
        cy.wait(2000)
        cy.go("back")
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
          ],
          { timeout: 100000 }
        )
      })

      it("check if checkbox is checked", () => {
        /* cy.wait(2000)
        cy.dataCy("checkbox-privacy-and-terms").check() */
        cy.wait(1000)
        cy.dataCy("checkbox-privacy-and-terms").should("not.be.checked")
        cy.dataCy("place-order-button").should("not.be.enabled")
      })
    }
  )
})
