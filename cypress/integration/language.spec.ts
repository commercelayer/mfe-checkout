describe("Checkout language", () => {
  context("validate english order", () => {
    const filename = "language/en"

    beforeEach(() => {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename, // @default: 'requests' for reading the data from your cassette
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("redirect to english checkout order", () => {
      cy.createOrder({ languageCode: "en" }).then((order) => {
        if (!Cypress.env("record")) {
          cy.newStubData("getOrders1", filename)
        }

        cy.visit(
          `/?accessToken=${Cypress.env("accessToken")}&orderId=${order.id}`
        )

        cy.wait(["@getOrders", "@retrieveLineItems"])
      })
      cy.dataCy("step-header-customer").should("have.text", "Customer")
    })
  })

  context("validate italian order", () => {
    const filename = "language/it"

    beforeEach(() => {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename, // @default: 'requests' for reading the data from your cassette
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("redirect to english checkout order", () => {
      cy.createOrder({ languageCode: "it" }).then((order) => {
        if (!Cypress.env("record")) {
          cy.newStubData("getOrders1", filename)
        }

        cy.visit(
          `/?accessToken=${Cypress.env("accessToken")}&orderId=${order.id}`
        )

        cy.wait(["@getOrders", "@retrieveLineItems"])
      })
      cy.dataCy("step-header-customer").should("have.text", "Cliente")
    })
  })
})
