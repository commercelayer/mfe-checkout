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
      createSkuLineItems(options: { orderId: string }): Chainable<Subject>
      createOrder(
        template:
          | "draft"
          | "pending"
          | "pending_with_billing_address"
          | "pending_with_billing_and_shipping"
          | "pending_with_customer",
        options: { languageCode: "it" | "en"; customerEmail: string }
      ): Chainable<Subject>
    }
  }
}
