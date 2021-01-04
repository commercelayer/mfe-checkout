/// <reference types="cypress" />

import {
  SetRoutes,
  NewStubData,
  SaveRequests,
} from "@commercelayer/cypress-vcr"

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      setRoutes: SetRoutes
      newStubData: NewStubData
      saveRequests: SaveRequests
      dataCy(attribute: string): Chainable<Subject>
      // typescript OrderCollection
      createOrder(options: { languageCode: "it" | "en" }): Chainable<Subject>
    }
  }
}
