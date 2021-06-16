describe("Checkout entrypoint", () => {
  context("missing accessToken and orderId", () => {
    it("redirect to invalid page", () => {
      cy.visit(`/`)
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This order is no longer accessible."
      )
    })
  })

  context("missing orderId", () => {
    it("redirect to invalid page", () => {
      cy.visit(`/?accessToken=123123`)
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This order is no longer accessible."
      )
    })
  })

  context("missing accessToken", () => {
    it("redirect to invalid page", () => {
      cy.visit(`/abc123`)
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This order is no longer accessible."
      )
    })
  })

  context("Invalid token", () => {
    beforeEach(() => {
      cy.intercept("GET", {
        statusCode: 500,
        body: {},
      })
      cy.visit("/wrongOrderId?accessToken=wrongAccessToken")
    })

    it("redirect to invalid", () => {
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This order is no longer accessible."
      )
    })
  })

  context("valid token and valid orderId", () => {
    const filename = "entrypoint"

    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: "alessani@gmail.com",
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
          })
        })
    })

    describe("with single order", function () {
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

      it("redirect to valid checkout", function () {
        cy.visit(
          `/${this.newOrder.id}?accessToken=${Cypress.env("accessToken")}`
        )

        if (!Cypress.env("record")) {
          cy.newStubData(["getOrders1"], filename)
        }

        cy.wait(
          [
            "@getShippingMethods",
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

        cy.dataCy("test-summary").should("have.text", "Order summary")
      })
    })
  })
})
