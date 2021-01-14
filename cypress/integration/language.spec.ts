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

      cy.createOrder({ languageCode: "en" }).then((order) => {
        cy.visit(
          `/?accessToken=${Cypress.env("accessToken")}&orderId=${order.id}`
        )
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("redirect to english checkout order", () => {
      if (!Cypress.env("record")) {
        cy.newStubData("getOrders1", filename)
      }
      cy.wait(["@getOrders", "@orders", "@retrieveLineItems"])
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

    it("redirect to italian checkout order", () => {
      cy.createOrder({ languageCode: "it" }).then((order) => {
        cy.visit(
          `/?accessToken=${Cypress.env("accessToken")}&orderId=${order.id}`
        )
        if (!Cypress.env("record")) {
          cy.newStubData("getOrders1", filename)
        }
        cy.wait(["@getOrders", "@orders", "@retrieveLineItems"])
      })
      cy.dataCy("step-header-customer").should("have.text", "Cliente")
    })
  })
})
