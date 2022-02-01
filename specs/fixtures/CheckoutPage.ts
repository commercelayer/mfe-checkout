import { Page } from "@playwright/test"

interface GoToProps {
  orderId: string
  token: string
}

export class CheckoutPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto({ orderId, token }: GoToProps) {
    const url = `/${orderId}?accessToken=${token}`
    await this.page.goto(`${url}`, {
      waitUntil: "networkidle",
    })
  }

  async setCustomerMail(email: string) {
    await this.page.fill("[data-cy=customer_email]", email)
  }

  async setBillingAddress() {
    await this.page.fill("[data-cy=input_billing_address_first_name]", "Mario")
    await this.page.fill("[data-cy=input_billing_address_last_name]", "Rossi")
    await this.page.fill(
      "[data-cy=input_billing_address_line_1]",
      "Via delle candele 12"
    )
    await this.page.fill("[data-cy=input_billing_address_line_2]", "Interno 1")
    await this.page.fill("[data-cy=input_billing_address_city]", "Firenze")
    await this.page.selectOption(
      "[data-cy=input_billing_address_country_code]",
      "IT"
    )
    await this.page.selectOption(
      "[data-cy=input_billing_address_state_code]",
      "FI"
    )
    await this.page.fill("[data-cy=input_billing_address_zip_code]", "50123")
    await this.page.fill("[data-cy=input_billing_address_phone]", "3331821325")
  }

  async continue() {
    this.page.click("[data-cy=save-addresses-button]")
    await this.page
      .locator("[data-cy=step_customer][data-status=false]")
      .waitFor({ state: "visible" })
  }
}
