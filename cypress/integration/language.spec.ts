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
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: "alessani@gmail.com",
      }).then((order) => {
        cy.createSkuLineItems({
          orderId: order.id,
        })
        if (!Cypress.env("record")) {
          cy.newStubData("getOrders1", filename)
        }

        cy.visit(`/${order.id}?accessToken=${Cypress.env("accessToken")}`)

        cy.wait(
          [
            "@getOrderShipments",
            "@getOrderShipments",
            "@retrieveLineItems",
            "@retrieveLineItems",
            "@getOrders",
          ],
          {
            timeout: 100000,
          }
        )
      })
      cy.dataCy("step-header-customer").should("contain.text", "Customer")
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
      cy.createOrder("draft", {
        languageCode: "it",
        customerEmail: "alessani@gmail.com",
      }).then((order) => {
        cy.createSkuLineItems({
          orderId: order.id,
        })
        if (!Cypress.env("record")) {
          cy.newStubData("getOrders1", filename)
        }

        cy.visit(`/${order.id}?accessToken=${Cypress.env("accessToken")}`)

        cy.wait(
          [
            "@getOrderShipments",
            "@getOrderShipments",
            "@retrieveLineItems",
            "@retrieveLineItems",
            "@getOrders",
          ],
          { timeout: 100000 }
        )
      })
      cy.dataCy("step-header-customer").should("contain.text", "Cliente")
    })
  })
})
