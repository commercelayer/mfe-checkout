// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "@commercelayer/cypress-vcr"
import { md5 } from "pure-md5"

import { apiRequestHeaders } from "./utils"

Cypress.Commands.add("dataCy", (value) => {
  return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add("createOrder", (template, options) => {
  const hash = md5(JSON.stringify(options))
  const filename = `${template}_${hash}.json`

  if (Cypress.env("record")) {
    cy.request({
      url: Cypress.env("apiEndpoint") + "/api/orders",
      method: "POST",
      body: {
        data: {
          type: "orders",
          attributes: {
            language_code: options.languageCode,
            customer_email: options.customerEmail,
          },
        },
      },
      headers: apiRequestHeaders(Cypress.env("accessToken")),
    })
      .its("body.data")
      .then((order) => {
        cy.writeFile(`cypress/fixtures/orders/${filename}`, order).then(() => {
          return order
        })
      })
  } else {
    return cy.readFile(`cypress/fixtures/orders/${filename}`)
  }
})

Cypress.Commands.add("createSkuLineItems", (options) => {
  const hash = md5(JSON.stringify(options))
  const filename = `line_items_${hash}.json`

  if (Cypress.env("record")) {
    cy.request({
      url: Cypress.env("apiEndpoint") + "/api/line_items",
      method: "POST",
      body: {
        data: {
          type: "line_items",
          attributes: {
            quantity: "2",
            sku_code: "BABYONBU000000E63E7412MX",
          },
          relationships: {
            order: {
              data: {
                type: "orders",
                id: options.orderId,
              },
            },
          },
        },
      },
      headers: apiRequestHeaders(Cypress.env("accessToken")),
    })
      .its("body.data")
      .then((lineItems) => {
        cy.writeFile(`cypress/fixtures/orders/${filename}`, lineItems).then(
          () => {
            return lineItems
          }
        )
      })
  } else {
    return cy.readFile(`cypress/fixtures/orders/${filename}`)
  }
})

Cypress.Commands.add("createAddress", (options) => {
  cy.request({
    url: Cypress.env("apiEndpoint") + "/api/addresses",
    method: "POST",
    body: {
      data: {
        type: "addresses",
        attributes: {
          first_name: options.firstName,
          last_name: options.lastName,
          line_1: options.line1,
          city: options.city,
          zip_code: options.zipCode,
          state_code: options.stateCode,
          country_code: options.countryCode,
          phone: options.phone,
        },
      },
    },
    headers: apiRequestHeaders(Cypress.env("accessToken")),
  })
    .its("body.data")
    .then((address) => {
      return address
    })
})

Cypress.Commands.add("setSameAddress", (orderId, addressId) => {
  cy.request({
    url: Cypress.env("apiEndpoint") + `/api/orders/${orderId}`,
    method: "PATCH",
    body: {
      data: {
        type: "orders",
        id: orderId,
        attributes: {
          _shipping_address_same_as_billing: true,
        },
        relationships: {
          billing_address: {
            data: {
              type: "addresses",
              id: addressId,
            },
          },
        },
      },
    },
    headers: apiRequestHeaders(Cypress.env("accessToken")),
  })
    .its("body.data")
    .then((orderWithAddress) => {
      return orderWithAddress
    })
})

Cypress.Commands.add(
  "setDifferentAddress",
  (orderId, billingAddressId, shippingAddressId) => {
    cy.request({
      url: Cypress.env("apiEndpoint") + `/api/orders/${orderId}`,
      method: "PATCH",
      body: {
        data: {
          type: "orders",
          id: orderId,
          relationships: {
            billing_address: {
              data: {
                type: "addresses",
                id: billingAddressId,
              },
            },
            shipping_address: {
              data: {
                type: "addresses",
                id: shippingAddressId,
              },
            },
          },
        },
      },
      headers: apiRequestHeaders(Cypress.env("accessToken")),
    })
      .its("body.data")
      .then((orderWithAddress) => {
        return orderWithAddress
      })
  }
)
