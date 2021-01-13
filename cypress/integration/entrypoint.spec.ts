describe("Checkout entrypoint", () => {
  const redirectUrl = "https://www.extendi.it/"
  const redirectUrlTitle = "Extendi - Rails + React web development"

  context("missing accessToken and orderId", () => {
    it("redirect to invalid", () => {
      cy.visit("/")
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This checkout is not valid"
      )
    })
    it("redirect to invalid with redirectUrl", () => {
      cy.visit("/?redirectUrl=" + redirectUrl)
      cy.title().should("eq", redirectUrlTitle)
    })
  })

  context("missing orderId", () => {
    it("redirect to invalid", () => {
      cy.visit("/?accessToken=123123")
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This checkout is not valid"
      )
    })
    it("redirect to invalid with redirectUrl", () => {
      cy.visit("/?accessToken=123123&redirectUrl=" + redirectUrl)
      cy.title().should("eq", redirectUrlTitle)
    })
  })

  context("missing accessToken", () => {
    it("redirect to invalid", () => {
      cy.visit("/?orderId=123123")
      cy.dataCy("invalid-checkout").should(
        "have.text",
        "This checkout is not valid"
      )
    })
    it("redirect to invalid with redirectUrl", () => {
      cy.visit("/?orderId=123123&redirectUrl=" + redirectUrl)
      cy.title().should("eq", redirectUrlTitle)
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

  context("valid token and valid orderId", () => {
    const filename = "entrypoint"

    beforeEach(() => {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename, // @default: 'requests' for reading the data from your cassette
      })
      cy.visit(`/?accessToken=${Cypress.env("accessToken")}&orderId=NbQLhWYXZO`)
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("redirect to valid checkout", () => {
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
