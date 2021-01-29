import { internet } from "faker"

import { usAddress } from "../support/utils"

describe("Checkout address", () => {
  const filename = "addresses"

  context.only("Checkout Guest Address", () => {
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

    describe("Empty order address", () => {
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

      /* it.skip("check if exist customer email", () => {
        if (!Cypress.env("record")) {
          cy.newStubData("getOrders1", filename)
        }
        cy.wait(["@getOrders", "@retrieveLineItems"])
        cy.dataCy("customer_email").should("contain.value", "alessani@gmail.tk")
      })

      it.skip("change customer email", () => {
        const emailCustomer = "gigi@buffon.it"

        if (!Cypress.env("record")) {
          cy.newStubData(["getOrders1"], filename)
        }
        cy.wait(["@getOrders", "@retrieveLineItems"])
        cy.dataCy("customer_email")
          .type(`{selectall}{backspace}${emailCustomer}`)
          .blur({ force: true })
        cy.reload()
        cy.dataCy("customer_email").should("contain.value", emailCustomer)
      }) */

      it("fill billing form", function () {
        cy.visit(
          `/?accessToken=${Cypress.env("accessToken")}&orderId=${
            this.newOrder.id
          }&redirectUrl=${redirectUrl}`
        )
        if (!Cypress.env("record")) {
          cy.newStubData(["getOrders1"], filename)
        }

        cy.wait(["@getOrders", "@retrieveLineItems"])
        cy.dataCy("input_billing_address_first_name").type(usAddress.first_name)
        cy.dataCy("input_billing_address_last_name").type(usAddress.last_name)
        cy.dataCy("input_billing_address_line_1").type(usAddress.line_1)
        cy.dataCy("input_billing_address_city").type(usAddress.city)
        cy.dataCy("input_billing_address_country_code").select(
          usAddress.country_code
        )
        cy.dataCy("input_billing_address_state_code").type(usAddress.state_code)
        cy.dataCy("input_billing_address_zip_code").type(usAddress.zip_code)
        cy.dataCy("input_billing_address_phone").type(usAddress.phone)
      })

      it("save form", () => {
        if (!Cypress.env("record")) {
          cy.newStubData(["getOrders2", "getOrders3"], filename)
        }
        cy.dataCy("save-addresses-button").click()
        cy.wait(["@createAddress", "@updateOrder", "@getOrders"])
        cy.dataCy("full_address_same").should("contain", usAddress.line_1)

        cy.wait("@retrieveLineItems")
      })
    })
  })
})
