import { Page } from "@playwright/test"

export class CheckoutPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(orderId, token) {
    await this.page.goto(`/${orderId}?accessToken=${token}`, {
      waitUntil: "networkidle",
    })
  }
}
