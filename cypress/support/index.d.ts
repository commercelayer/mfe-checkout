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
      createSkuLineItems(options: {
        orderId: string
        accessToken?: string
        attributes?: {
          quantity: string
          sku_code: string
        }
      }): Chainable<Subject>
      createCustomer(options: {
        email: string
        password: string
      }): Chainable<Subject>
      createOrder(
        template:
          | "draft"
          | "pending"
          | "pending_with_billing_address"
          | "pending_with_billing_and_shipping"
          | "pending_with_customer",
        options: {
          languageCode: "it" | "en"
          customerEmail: string
          shipping_country_code_lock?: string
          reference?: string
          accessToken?: any
        }
      ): Chainable<Subject>
      setSameAddress(
        orderId: string,
        addressId: string,
        accessToken?: string
      ): Chainable<Subject>
      setDifferentAddress(
        orderId: string,
        billingAddressId: string,
        shippingAddressId: string,
        accessToken?: string
      ): Chainable<Subject>
      setShipmentMethod(options: {
        id: string
        accessToken?: string
        type:
          | "Express Delivery EU"
          | "Express Delivery US"
          | "Standard Shipping"
      }): Chainable<Subject>
      createAddress(options: {
        firstName: string
        lastName: string
        line1: string
        city: string
        zipCode: string
        stateCode: string
        countryCode: string
        phone: string
        accessToken?: string
      }): Chainable<Subject>
      getTokenCustomer(options: {
        username: string
        password: string
      }): Chainable<Subject>
      getShipments(options: {
        orderId: string
        accessToken?: string
      }): Chainable<Subject>
      addAddressToBook(
        idAddress: string,
        accessToken: string
      ): Chainable<Subject>
    }
  }
}
