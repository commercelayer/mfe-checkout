import { Page } from "@playwright/test"

interface GoToProps {
  orderId: string
  token: string
}

interface AttributesProps {
  giftCard?: string
}

export class CheckoutPage {
  readonly page: Page
  readonly attributes?: AttributesProps

  constructor(page: Page, attributes?: AttributesProps) {
    this.page = page
    this.attributes = attributes || {}
  }

  async goto({ orderId, token }: GoToProps) {
    const url = `/${orderId}?accessToken=${token}`
    await this.page.goto(`${url}`, {
      waitUntil: "networkidle",
    })
  }

  getGiftCard() {
    return this.attributes?.giftCard
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
    await this.page.fill(
      "[data-cy=input_billing_address_billing_info]",
      "LSSXXX78T33D321W"
    )
  }

  async setCoupon(code: string) {
    await this.page.fill("[data-cy=input_giftcard_coupon]", code)
    this.page.click("[data-cy=submit_giftcard_coupon]")
  }

  async removeCoupon() {
    this.page.click("[data-cy=remove_coupon]")
  }

  async removeGiftCard() {
    this.page.click("[data-cy=remove_giftcard]")
  }

  async checkShippingSummary(text: string) {
    await this.page
      .locator(`[data-cy=shipping-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkTaxSummary(text: string) {
    await this.page
      .locator(`[data-cy=tax-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkDiscountAmount(text: string) {
    await this.page
      .locator(`[data-cy=discount-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkGiftCardAmount(text: string) {
    await this.page
      .locator(`[data-cy=giftcard-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkCouponCode(text: string) {
    await this.page
      .locator(`[data-cy=code-coupon] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkTotalAmount(text: string) {
    await this.page
      .locator(`[data-cy=total-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkPaymentSummary(text: string) {
    await this.page
      .locator(`[data-cy=payment-method-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async setPayment(type: "stripe" | "braintree" | "wiretransfer") {
    switch (type) {
      case "stripe": {
        const stripeFrame = this.page.frameLocator("iframe").first()
        await stripeFrame
          .locator("input[name=cardnumber]")
          .fill("4242424242424242")
        await stripeFrame.locator("input[name=exp-date]").fill("0231")
        await stripeFrame.locator("input[name=cvc]").fill("321")
        break
      }
    }
  }

  async continue(step: SingleStepEnum) {
    switch (step) {
      case "Customer":
        this.page.click("[data-cy=save-addresses-button]")
        await this.page
          .locator("[data-cy=step_customer][data-status=false]")
          .waitFor({ state: "visible" })
        break
      case "Shipping":
        this.page.click("[data-cy=save-shipments-button]")
        await this.page
          .locator("[data-cy=step_shipping][data-status=false]")
          .waitFor({ state: "visible" })
        break
      case "Payment":
        this.page.click("[data-cy=place-order-button]")
        await this.page
          .locator("text=Order successfully placed")
          .waitFor({ state: "visible" })
        break
    }
  }
}
