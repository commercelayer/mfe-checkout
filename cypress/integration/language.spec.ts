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

        cy.visit(
          `/?accessToken=${Cypress.env("accessToken")}&orderId=${order.id}`
        )

        cy.wait(
          [
            "@getShippingMethods",
            "@getOrderShipments",
            "@getOrderShipments",
            "@retrieveLineItems",
            "@retrieveLineItems",
            "@retrieveLineItems",
            "@getOrders",
            "@getOrders",
            "@getOrders",
            "@getOrders",
            "@updateOrder",
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

        cy.visit(
          `/?accessToken=${Cypress.env("accessToken")}&orderId=${order.id}`
        )

        cy.wait(
          [
            "@getShippingMethods",
            "@getOrderShipments",
            "@getOrderShipments",
            "@retrieveLineItems",
            "@retrieveLineItems",
            "@retrieveLineItems",
            "@getOrders",
            "@getOrders",
            "@getOrders",
            "@getOrders",
            "@updateOrder",
          ],
          { timeout: 100000 }
        )
      })
      cy.dataCy("step-header-customer").should("contain.text", "Cliente")
    })
  })
})
