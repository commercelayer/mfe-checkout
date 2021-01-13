describe("Checkout entrypoint", () => {
  const redirectUrl = "https://www.extendi.it/"

  context("missing accessToken and orderId", () => {
    it("redirect to invalid with redirectUrl", () => {
      cy.visit(`/?redirectUrl=${redirectUrl}`)
      cy.url().should("eq", redirectUrl)
    })

    it("redirect to invalid without redirectUrl", () => {
      cy.visit(`/`)
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This checkout is not valid"
      )
    })
  })

  context("missing orderId", () => {
    it("redirect to invalid with redirectUrl", () => {
      cy.visit(`/?accessToken=123123&redirectUrl=${redirectUrl}`)
      cy.url().should("eq", redirectUrl)
    })

    it("redirect to invalid without redirectUrl", () => {
      cy.visit(`/?accessToken=123123`)
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This checkout is not valid"
      )
    })
  })

  context("missing accessToken", () => {
    it("redirect to invalid with redirectUrl", () => {
      cy.visit(`/?orderId=123123&redirectUrl=${redirectUrl}`)
      cy.url().should("eq", redirectUrl)
    })

    it("redirect to invalid without redirectUrl", () => {
      cy.visit(`/?orderId=123123`)
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This checkout is not valid"
      )
    })
  })

  context("Invalid token", () => {
    beforeEach(() => {
      cy.intercept("GET", {
        statusCode: 500,
        body: {},
      })
      cy.visit("/?accessToken=wrongAccessToken&orderId=wrongOrderId")
    })

    it("redirect to invalid", () => {
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This checkout is not valid"
      )
    })
  })

  context("valid token and valid orderId with redirectUrl", () => {
    const filename = "entrypoint"

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

    it("redirect to valid checkout with redirectUrl", () => {
      cy.visit(
        `/?accessToken=${Cypress.env(
          "accessToken"
        )}&orderId=NbQLhWYXZO&redirectUrl=${redirectUrl}`
      )
      if (!Cypress.env("record")) {
        cy.newStubData("getOrders1", filename)
      }

      cy.wait(["@getOrders", "@retrieveLineItems"])
      cy.url().should("include", `redirectUrl=${redirectUrl}`)
    })

    it("redirect to valid checkout without redirectUrl", () => {
      cy.visit(`/?accessToken=${Cypress.env("accessToken")}&orderId=NbQLhWYXZO`)
      if (!Cypress.env("record")) {
        cy.newStubData("getOrders1", filename)
      }

      cy.wait(["@getOrders", "@retrieveLineItems"])
      cy.dataCy("test-summary").should(
        "have.text",
        "Your shopping cart contains 3 items"
      )
    })
  })
})
