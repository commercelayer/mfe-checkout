describe("Get new token", () => {
  let sharedSecret

  beforeEach(() => {
    cy.task("setAccessTokenTest")
  })

  it("get token test", () => {
    sharedSecret = Cypress.env("sharedSecret")
    cy.log(sharedSecret, "accessTokenNew")
  })
})
