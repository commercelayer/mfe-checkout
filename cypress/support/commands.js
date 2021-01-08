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

import '@commercelayer/cypress-vcr'
import { apiRequestHeaders } from "./utils"

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('createOrder', options => {
  cy.request({
    url: Cypress.env('apiEndpoint') + '/api/orders',
    method: 'POST',
    body: {
      data: {
        type: 'orders',
        attributes: {
          language_code: options.languageCode,
        }
      }
    },
    headers: apiRequestHeaders(Cypress.env('accessToken'))
  }).its('body.data')
})