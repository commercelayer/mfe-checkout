import { Address } from "@commercelayer/sdk"
import { faker } from "@faker-js/faker"
import { Page, expect } from "@playwright/test"

import { composeForCheck, euAddress, euAddress2 } from "../utils/addresses"

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

  async clearInput(name: string) {
    await this.page.click(name, {
      clickCount: 3,
    })
    await this.page.keyboard.press("Backspace")
  }

  async changeCustomerEmail(text: string) {
    await this.clearInput("[data-cy=customer_email]")
    await this.setCustomerMail(text)
  }

  async checkCustomerEmail(text: string) {
    await this.page
      .locator(`[data-cy=customer-email-step-header] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkStep(step: SingleStepEnum, status: "close" | "open") {
    const element = await this.page.locator(
      `[data-cy=step_${step.toLocaleLowerCase()}]`
    )
    await expect(element).toHaveAttribute(
      "data-status",
      status === "close" ? "false" : "true"
    )
  }

  async clickStep(step: SingleStepEnum) {
    this.page.click(`[data-cy=step_${step.toLocaleLowerCase()}]`)
  }

  async shipToDifferentAddress() {
    this.page.click(`[data-cy=button-ship-to-different-address]`)
  }

  async selectCountry(
    type: "billing_address" | "shipping_address",
    country: "IT" | "US" | "GB" | "FR"
  ) {
    await this.page.selectOption(
      `[data-cy=input_${type}_country_code]`,
      country
    )
  }

  async setAddress({
    address,
    type,
  }: {
    address: Partial<Address>
    type: "billing_address" | "shipping_address"
  }) {
    await this.page.fill(
      `[data-cy=input_${type}_first_name]`,
      address.first_name as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_last_name]`,
      address.last_name as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_line_1]`,
      address.line_1 as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_line_2]`,
      address.line_2 as string
    )
    await this.page.fill(`[data-cy=input_${type}_city]`, address.city as string)

    const countrySelect = this.page.locator(
      `[data-cy=input_${type}_country_code]`
    )
    const countrySelectEnabled = await countrySelect.isEnabled()
    if (countrySelectEnabled) {
      await this.page.selectOption(
        `[data-cy=input_${type}_country_code]`,
        address.country_code as string,
        { force: true }
      )
    }

    const command =
      address.country_code && ["IT", "US"].includes(address.country_code)
        ? "selectOption"
        : "fill"

    await this.page[command](
      `[data-cy=input_${type}_state_code]`,
      address.state_code as string
    )

    await this.page.fill(
      `[data-cy=input_${type}_zip_code]`,
      address.zip_code as string
    )
    await this.page.fill(
      `[data-cy=input_${type}_phone]`,
      address.phone as string
    )
    if (address.billing_info) {
      await this.page.fill(
        `[data-cy=input_${type}_billing_info]`,
        address.billing_info as string
      )
    }

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
    const addressToFill = address || euAddress
    await this.setAddress({ address: addressToFill, type: "billing_address" })
  }

  async setShippingAddress(address?: Partial<Address>) {
    const { billing_info, ...addressToFill } = address || euAddress2
    await this.setAddress({ address: addressToFill, type: "shipping_address" })
  }

  async checkAddress({
    address,
    type,
  }: {
    address: Partial<Address>
    type: "billing_address" | "shipping_address"
  }) {
    const promises = Object.keys(address).map(async (key) => {
      if (type === "shipping_address" && key === "billing_info") {
        return
      }
      const fieldType =
        key === "country_code" ||
        (key === "state_code" &&
          address.country_code &&
          ["IT", "US"].includes(address.country_code))
          ? "select"
          : "input"
      const element = this.page.locator(`${fieldType}[name=${type}_${key}]`)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return expect(element).toHaveValue(address[key])
    })
    await Promise.all(promises)
  }

  async openNewAddress(type: "shipping" | "billing") {
    this.page.click(`[data-cy=add_new_${type}_address]`)
  }

  async closeNewAddress(type: "shipping" | "billing") {
    this.page.click(`[data-cy=close-${type}-form]`)
  }

  async checkBillingAddress(address: Partial<Address>) {
    await this.checkAddress({ address, type: "billing_address" })
  }

  async checkShippingAddress(address: Partial<Address>) {
    await this.checkAddress({ address, type: "shipping_address" })
  }

  async selectAddressOnBook({
    type,
    index = 0,
  }: {
    type: "billing" | "shipping"
    index: number
  }) {
    this.page.click(`[data-cy=customer-${type}-address] >> nth-${index}`)
  }

  async checkSelectedAddressBook({
    type,
    address,
  }: {
    type: "billing" | "shipping"
    address: Partial<Address>
  }) {
    const titleizeType = type[0].toLocaleUpperCase() + type.slice(1)

    const element = await this.page.locator(
      `[data-cy=customer-${type}-address]:near(:text("${titleizeType} Address")) >> text=${composeForCheck(
        address
      )}`
    )
    await expect(element).toHaveCount(1)
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

  async checkPlaceOrder(status: "enabled" | "disabled") {
    const element = await this.page.locator("[data-cy=place-order-button]")
    if (status === "disabled") {
      return expect(element).toBeDisabled()
    } else {
      return expect(element).toBeEnabled()
    }
  }

  async setPayment(
    type: "stripe" | "braintree" | "wiretransfer" | "paypal" | "adyen"
  ) {
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
      case "braintree": {
        // await this.page.pause()
        const cardFrame = this.page.frameLocator(
          'iframe[name="braintree-hosted-field-number"]'
        )
        const expFrame = this.page.frameLocator(
          'iframe[name="braintree-hosted-field-expirationDate"]'
        )
        const cvvFrame = this.page.frameLocator(
          'iframe[name="braintree-hosted-field-cvv"]'
        )
        await cardFrame.locator("#credit-card-number").fill("4111111111111111")
        await expFrame.locator("#expiration").fill("102030")
        await cvvFrame.locator("#cvv").fill("123")
        break
      }
      case "adyen": {
        // await this.page.pause()
        const cardFrame = this.page.frameLocator("iframe >> nth=0")
        // .first()
        await cardFrame
          .locator("[data-fieldtype=encryptedCardNumber]")
          .fill("4111111111111111")

        const expFrame = this.page.frameLocator("iframe >> nth=1")
        // .first()
        await expFrame
          .locator("[data-fieldtype=encryptedExpiryDate]")
          .fill("0330")
        const cvvFrame = this.page.frameLocator("iframe >> nth=2") // .first()
        await cvvFrame
          .locator("[data-fieldtype=encryptedSecurityCode]")
          .fill("737")

        break
      }
      case "paypal": {
        await this.page.click("[data-test-id=paypal_payments] >> text=PayPal", {
          force: true,
        })
      }
    }
  }

  async save(step: SingleStepEnum, waitText?: string, skipWait?: boolean) {
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
      case "Payment": {
        const text = waitText || "Order successfully placed"
        this.page.click("[data-cy=place-order-button]")
        if (skipWait) {
          return
        }
        await this.page.locator(`text=${text}`).waitFor({ state: "visible" })
        break
      }
    }
  }
}
