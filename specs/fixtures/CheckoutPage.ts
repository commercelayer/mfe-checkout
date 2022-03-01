import { Address } from "@commercelayer/sdk"
import { faker } from "@faker-js/faker"
import { Page, expect } from "@playwright/test"

import { euAddress } from "../utils/addresses"

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

  async setCustomerMail(email?: string) {
    let customerEmail = email || ""
    if (!email) {
      customerEmail = faker.internet.email().toLocaleLowerCase()
    }
    await this.page.fill("[data-cy=customer_email]", customerEmail)
  }

  async blurCustomerEmail() {
    await this.page
      .locator("[data-cy=customer_email]")
      .evaluate((e) => e.blur())
  }

  async getCustomerMail() {
    return this.page.locator("input[name=customer_email]")
  }

  async checkCustomerEmail(text: string) {
    await this.page
      .locator(`[data-cy=customer-email-step-header] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async clickStep(step: "step_customer") {
    this.page.click(`[data-cy=${step}]`)
  }

  async setAddress({
    address,
    type,
  }: {
    address?: Partial<Address>
    type: "billing_address" | "shipping_address"
  }) {
    const addressToFill = address || euAddress
    await this.page.fill(
      `[data-cy=input_${type}_first_name]`,
      addressToFill.first_name as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_last_name]`,
      addressToFill.last_name as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_line_1]`,
      addressToFill.line_1 as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_line_2]`,
      addressToFill.line_2 as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_city]`,
      addressToFill.city as string
    )
    await this.page.selectOption(
      `[data-cy=input_${type}_country_code]`,
      addressToFill.country_code as string
    )
    await this.page.selectOption(
      `[data-cy=input_${type}_state_code]`,
      addressToFill.state_code as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_zip_code]`,
      addressToFill.zip_code as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_phone]`,
      addressToFill.phone as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_billing_info]`,
      addressToFill.billing_info as string
    )

    // const promises = Object.keys(addressToFill).map(async (key) => {
    //   const command = ["country_code", "state_code"].includes(key)
    //     ? "selectOption"
    //     : "fill"
    //   return await this.page[command](
    //     `[data-cy=input_${type}_${key}]`,
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     addressToFill[key]
    //   )
    // })

    // await Promise.all(promises)
  }

  async setBillingAddress(address?: Partial<Address>) {
    await this.setAddress({ address, type: "billing_address" })
  }

  async checkBillingAddress(address: Partial<Address>) {
    const promises = Object.keys(address).map(async (key) => {
      const fieldType = ["country_code", "state_code"].includes(key)
        ? "select"
        : "input"
      const element = this.page.locator(
        `${fieldType}[name=billing_address_${key}]`
      )
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return expect(element).toHaveValue(address[key])
    })
    await Promise.all(promises)
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
