import { euAddress, usAddress } from "../support/utils"

describe("Guest Addresses", () => {
  const filename = "checkout-addresses"
  const redirectUrl = "https://www.extendi.it/"
  const customerEmail = "alessani@gmail.it"

  before(() => {
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

  beforeEach(() => {
    cy.setRoutes({
      endpoint: Cypress.env("apiEndpoint"),
      routes: Cypress.env("requests"),
      record: Cypress.env("record"), // @default false
      filename, // @default: 'requests' for reading the data from your cassette
    })

    cy.createOrder("draft", {
      languageCode: "en",
      customerEmail: customerEmail,
    }).then((order) => {
      if (!Cypress.env("record")) {
        cy.newStubData(
          [
            "getOrders1",
            /* "getOrders2",
            "retrieveLineItems1",
            "getOrders3",
            "getOrders4",
            "getCustomerAddresses",
            "retrieveLineItems2",
            "updateOrder1", */
          ],
          filename
        )
      }
      cy.visit(
        `/?accessToken=${Cypress.env("accessToken")}&orderId=${
          order.id
        }&redirectUrl=${redirectUrl}`
      )
    })

    // Customer Email
    cy.get('[data-cy="customer_email"]').as("customerEmail")

    // Billing Address fields
    cy.get('[data-cy="input_billing_address_first_name"]').as(
      "billingFirstName"
    )
    cy.get('[data-cy="input_billing_address_last_name"]').as("billingLastName")
    cy.get('[data-cy="input_billing_address_line_1"]').as("billingLine1")
    cy.get('[data-cy="input_billing_address_city"]').as("billingCity")
    cy.get('[data-cy="input_billing_address_country_code"]').as(
      "billingCountryCode"
    )
    cy.get('[data-cy="input_billing_address_state_code"]').as(
      "billingStateCode"
    )
    cy.get('[data-cy="input_billing_address_zip_code"]').as("billingZipCode")
    cy.get('[data-cy="input_billing_address_phone"]').as("billingPhone")

    cy.get('[data-cy="button-ship-to-different-address"]').as(
      "buttonDifferentAddress"
    )

    // Shipping Address fields
    cy.get('[data-cy="input_shipping_address_first_name"]').as(
      "shippingFirstName"
    )
    cy.get('[data-cy="input_shipping_address_last_name"]').as(
      "shippingLastName"
    )
    cy.get('[data-cy="input_shipping_address_line_1"]').as("shippingLine1")
    cy.get('[data-cy="input_shipping_address_city"]').as("shippingCity")
    cy.get('[data-cy="input_shipping_address_country_code"]').as(
      "shippingCountryCode"
    )
    cy.get('[data-cy="input_shipping_address_state_code"]').as(
      "shippingStateCode"
    )
    cy.get('[data-cy="input_shipping_address_zip_code"]').as("shippingZipCode")
    cy.get('[data-cy="input_shipping_address_phone"]').as("shippingPhone")
    cy.get('[data-cy="button-ship-to-different-address"]').as(
      "buttonDifferentAddress"
    )
    // Save Addresses button
    cy.get('[data-cy="save-addresses-button"]').as("saveAddressesButton")
  })

  // -------------–

  it("Checking default fields", () => {
    cy.wait(["@getOrders", "@retrieveLineItems"])
    cy.get("@customerEmail").should("value", customerEmail)
    cy.get("@billingFirstName").should("contain.value", "")
    cy.get("@billingLastName").should("contain.value", "")
    cy.get("@billingLine1").should("contain.value", "")
    cy.get("@billingCity").should("contain.value", "")
    cy.get("@billingCountryCode").should("contain.text", "Country")
    cy.get("@billingStateCode").should("contain.value", "")
    cy.get("@billingZipCode").should("contain.value", "")
    cy.get("@billingPhone").should("contain.value", "")
    cy.get("@buttonDifferentAddress").should(
      "have.attr",
      "data-status",
      "false"
    )
    cy.get("@saveAddressesButton").should("have.attr", "disabled", "disabled")
  })

  it("Save Customer User with onBlur input", () => {
    cy.wait(["@getOrders", "@retrieveLineItems"])
    cy.get("@customerEmail")
      .type(`{selectall}{backspace}${usAddress.customer_email}`)
      .blur({ force: true })
    cy.wait(["@updateOrder"])
    cy.reload()
    cy.wait(["@getOrders", "@retrieveLineItems"])
    cy.wait(["@getCustomerAddresses"])
    cy.get("@customerEmail").should("value", `${usAddress.customer_email}`)
  })

  it("Filling fields", () => {
    cy.get("@billingFirstName").type("a").type("{backspace}")
    cy.get('[data-cy="error_billing_address_first_name"]').should(
      "contain.text",
      `Can't be blank`
    )
    cy.get("@billingFirstName")
      .type(euAddress.first_name)
      .should("have.value", euAddress.first_name)
    cy.get("@billingLastName")
      .type(euAddress.last_name)
      .should("have.value", euAddress.last_name)
    cy.get("@billingLine1")
      .type(euAddress.line_1)
      .should("have.value", euAddress.line_1)
    cy.get("@billingCity")
      .type(euAddress.city)
      .should("have.value", euAddress.city)
    cy.get("@billingCountryCode")
      .select(euAddress.country)
      .should("have.value", euAddress.country_code)
    cy.get("@billingStateCode")
      .type(euAddress.state_code)
      .should("have.value", euAddress.state_code)
    cy.get("@billingZipCode")
      .type(euAddress.zip_code)
      .should("have.value", euAddress.zip_code)
    cy.get("@saveAddressesButton").should("have.attr", "disabled", "disabled")
    cy.get("@billingPhone")
      .type(euAddress.phone)
      .should("have.value", euAddress.phone)
    cy.get("@saveAddressesButton").should(
      "not.have.attr",
      "disabled",
      "disabled"
    )
    cy.get("@saveAddressesButton").click()
    cy.wait(["@createAddress", "@updateOrder"])
    // cy.get("@billingFirstName").should("contain.value", euAddress.first_name)

    // vedere se sono nella pagina giusta con riassunto dati
  })

  /* it("Ship to different address", () => {
    cy.wait(["@getOrders", "@retrieveLineItems"])
    // riaprire pagina, inserire dati bill and ship
    cy.get('[data-cy="edit-step-1-button"]').as("editStep1Button")
    cy.get("@editStep1Button").click()
    cy.get("@buttonDifferentAddress")
      .click()
      .should("have.attr", "data-status", "true")
    cy.get("@shippingFirstName")
      .type(`{selectall}{backspace}${usAddress.first_name}`)
      .should("have.value", usAddress.first_name)
    cy.get("@shippingLastName")
      .type(`{selectall}{backspace}${usAddress.last_name}`)
      .should("have.value", usAddress.last_name)
    cy.get("@shippingLine1")
      .type(`{selectall}{backspace}${usAddress.line_1}`)
      .should("have.value", usAddress.line_1)
    cy.get("@shippingCity")
      .type(`{selectall}{backspace}${usAddress.city}`)
      .should("have.value", usAddress.city)
    cy.get("@shippingCountryCode")
      .select(usAddress.country)
      .should("have.value", usAddress.country_code)
    cy.get("@shippingStateCode")
      .type(`{selectall}{backspace}${usAddress.state_code}`)
      .should("have.value", usAddress.state_code)
    cy.get("@shippingZipCode")
      .type(`{selectall}{backspace}${usAddress.zip_code}`)
      .should("have.value", usAddress.zip_code)
    cy.get("@shippingPhone")
      .type(`{selectall}{backspace}`)
      .should("have.value", "")
    cy.get("@saveAddressesButton").should("have.attr", "disabled", "disabled")
    cy.get("@shippingPhone")
      .type(`{selectall}{backspace}${usAddress.phone}`)
      .should("have.value", usAddress.phone)
    cy.get("@saveAddressesButton").should(
      "not.have.attr",
      "disabled",
      "disabled"
    )
    // vedere se sono nella pagina giusta con riassunto dati
  })

  it("Saving different shipping address", () => {
    cy.get("@saveAddressesButton").click()
    cy.wait(["@createAddress", "@updateOrder"])
  }) */
})
