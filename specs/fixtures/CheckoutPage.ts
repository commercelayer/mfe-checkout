import { Address } from "@commercelayer/sdk"
import { faker } from "@faker-js/faker"
import { Page, expect } from "@playwright/test"

import { EcommerceProps } from "../../components/data/GTMProvider/typings"
import { composeForCheck, euAddress, euAddress2 } from "../utils/addresses"

interface GoToProps {
  orderId: string
  token: string
}

interface DataLayerWindowProps {
  event: string
  ecommerce: EcommerceProps
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
    await this.page.fill("[data-test-id=customer_email]", customerEmail)
  }

  async blurCustomerEmail() {
    await this.page
      .locator("[data-test-id=customer_email]")
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
    await this.clearInput("[data-test-id=customer_email]")
    await this.setCustomerMail(text)
  }

  async checkCustomerEmail(text: string) {
    await this.page
      .locator(`[data-test-id=customer-email-step-header] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkStep(
    step: SingleStepEnum,
    status: "close" | "open" | "not_present"
  ) {
    const element = await this.page.locator(
      `[data-test-id=step_${step.toLocaleLowerCase()}]`
    )
    if (status === "not_present") {
      await expect(element).toHaveCount(0)
      return
    }

    await expect(element).toHaveCount(1)

    await expect(element).toHaveAttribute(
      "data-status",
      status === "close" ? "false" : "true"
    )
  }

  async clickStep(step: SingleStepEnum) {
    this.page.click(`[data-test-id=step_${step.toLocaleLowerCase()}]`, {
      force: true,
    })
  }

  async clickAccordion(step: SingleStepEnum) {
    this.page.click(`[data-test-id=accordion_${step.toLocaleLowerCase()}]`, {
      force: true,
    })
  }

  async shipToDifferentAddress() {
    this.page.click(`[data-test-id=button-ship-to-different-address]`)
  }

  async getDataLayer(
    eventToTrack:
      | "begin_checkout"
      | "add_shipping_info"
      | "add_payment_info"
      | "purchase"
  ) {
    await this.page.waitForTimeout(2000)
    const dataLayer: DataLayerWindowProps[] = await this.page.evaluate(
      "window.dataLayer"
    )
    return dataLayer.filter(
      ({ event }: DataLayerWindowProps) => event === eventToTrack
    )
  }

  async getOrderNumber() {
    const element = await this.page.locator(
      "[data-test-id=complete-checkout-summary] >> strong"
    )
    return element.innerText()
  }

  async checkTermsAndPrivacyValue(value: boolean | undefined) {
    const element = this.page.locator(
      "[data-test-id=checkbox-privacy-and-terms]"
    )
    if (value === undefined) {
      await expect(element).toHaveCount(0)
      return
    }
    if (value) {
      await expect(element).toBeChecked()
    } else {
      await expect(element).not.toBeChecked()
    }
  }

  async setTermsAndPrivacy(value: boolean) {
    const element = this.page.locator(
      "[data-test-id=checkbox-privacy-and-terms]"
    )
    if (value) {
      await element.check()
    } else {
      await element.uncheck()
    }
  }

  async checkShipToDifferentAddressValue(value: boolean) {
    const element = this.page.locator(
      "[data-test-id=button-ship-to-different-address]"
    )
    await expect(element).toHaveAttribute(
      "data-status",
      value ? "true" : "false"
    )
  }

  async checkShipToDifferentAddressEnabled(value: boolean) {
    const element = this.page.locator(
      "[data-test-id=button-ship-to-different-address]"
    )
    if (value) {
      await expect(element).toBeEnabled()
    } else {
      await expect(element).toBeDisabled()
    }
  }

  getSaveAddressBookCheckbox(type: "billing" | "shipping") {
    return this.page.locator(
      `input[data-test-id=${type}_address_save_to_customer_address_book]`
    )
  }

  async selectCountry(
    type: "billing_address" | "shipping_address",
    country: "IT" | "US" | "GB" | "FR"
  ) {
    await this.page.selectOption(
      `[data-test-id=input_${type}_country_code]`,
      country
    )
  }

  async selectState(
    type: "billing_address" | "shipping_address",
    state: "FI" | "NA" | "MI"
  ) {
    await this.page.selectOption(
      `[data-test-id=input_${type}_state_code]`,
      state
    )
  }

  async selectShippingMethod({
    text,
    shipment = 0,
  }: {
    text: string
    shipment?: number
  }) {
    await this.page.click(
      `[data-test-id=shipments-container] >> nth=${shipment} >> [data-test-id=shipping-methods-container] >> text=${text}`
    )
  }

  async checkSelectedShippingMethod({
    index = 0,
    shipment = 0,
    value,
  }: {
    index?: number
    shipment?: number
    value: boolean
  }) {
    const element = await this.page.locator(
      `[data-test-id=shipments-container] >> nth=${shipment} >> [data-test-id=shipping-methods-container] >> nth=${index} >> input[type=checkbox]`
    )
    if (value) {
      await expect(element).toBeTruthy()
    } else {
      await expect(element).toBeFalsy()
    }
  }

  async setAddress({
    address,
    type,
  }: {
    address: Partial<Address>
    type: "billing_address" | "shipping_address"
  }) {
    await this.page.fill(
      `[data-test-id=input_${type}_first_name]`,
      (address.first_name as string) || ""
    )
    await this.page.fill(
      `[data-test-id=input_${type}_last_name]`,
      (address.last_name as string) || ""
    )
    await this.page.fill(
      `[data-test-id=input_${type}_line_1]`,
      (address.line_1 as string) || ""
    )
    await this.page.fill(
      `[data-test-id=input_${type}_line_2]`,
      (address.line_2 as string) || ""
    )
    await this.page.fill(
      `[data-test-id=input_${type}_city]`,
      (address.city as string) || ""
    )

    const countrySelect = this.page.locator(
      `[data-test-id=input_${type}_country_code]`
    )
    const countrySelectEnabled = await countrySelect.isEnabled()
    if (countrySelectEnabled) {
      await this.page.selectOption(
        `[data-test-id=input_${type}_country_code]`,
        (address.country_code as string) || "",
        { force: true }
      )
    }

    const command =
      address.country_code && ["IT", "US"].includes(address.country_code)
        ? "selectOption"
        : "fill"

    await this.page[command](
      `[data-test-id=input_${type}_state_code]`,
      (address.state_code as string) || ""
    )

    await this.page.fill(
      `[data-test-id=input_${type}_zip_code]`,
      (address.zip_code as string) || ""
    )
    await this.page.fill(
      `[data-test-id=input_${type}_phone]`,
      (address.phone as string) || ""
    )
    if (address.billing_info) {
      await this.page.fill(
        `[data-test-id=input_${type}_billing_info]`,
        (address.billing_info as string) || ""
      )
    }
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
    this.page.click(`[data-test-id=add_new_${type}_address]`)
  }

  async closeNewAddress(type: "shipping" | "billing") {
    this.page.click(`[data-test-id=close-${type}-form]`)
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
    this.page.click(`[data-test-id=customer-${type}-address] >> nth=${index}`)
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
      `[data-test-id=customer-${type}-address]:near(:text("${titleizeType} Address")) >> text=${composeForCheck(
        address
      )}`
    )
    await expect(element).toHaveCount(1)
  }

  async checkBadgeIndex(step: SingleStepEnum, value: string) {
    const element = await this.page.locator(
      `[data-test-id=step-header-badge]:near(:text("${step}")) >> text=${value}`
    )
    await expect(element).toHaveCount(1)
  }

  async setCoupon(code: string) {
    await this.page.fill("[data-test-id=input_giftcard_coupon]", code)
    this.page.click("[data-test-id=submit_giftcard_coupon]")
  }

  async removeCoupon() {
    this.page.click("[data-test-id=remove_coupon]")
  }

  async removeGiftCard() {
    this.page.click("[data-test-id=remove_giftcard]")
  }

  async checkOrderSummary(text: string) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible()
  }

  async checkShippingSummary(text: string | undefined) {
    if (text === undefined) {
      const element = await this.page.locator("[data-test-id=shipping-amount]")
      await expect(element).toHaveCount(0)
    } else {
      await this.page
        .locator(`[data-test-id=shipping-amount] >> text=${text}`)
        .waitFor({ state: "visible" })
    }
  }

  async checkPaymentRecap(text: string) {
    await expect(
      this.page.locator(`[data-test-id=payment-recap] >> text=${text}`)
    ).toBeVisible()
  }

  async checkTaxSummary(text: string) {
    await this.page
      .locator(`[data-test-id=tax-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkDiscountAmount(text: string) {
    await this.page
      .locator(`[data-test-id=discount-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkGiftCardAmount(text: string) {
    await this.page
      .locator(`[data-test-id=giftcard-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkCouponCode(text: string) {
    await this.page
      .locator(`[data-test-id=code-coupon] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkTotalAmount(text: string) {
    await this.page
      .locator(`[data-test-id=total-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkPaymentSummary(text: string) {
    await this.page
      .locator(`[data-test-id=payment-method-amount] >> text=${text}`)
      .waitFor({ state: "visible" })
  }

  async checkButton({
    type,
    status,
  }: {
    type: SingleStepEnum
    status: "enabled" | "disabled"
  }) {
    const element = await this.page.locator(
      `[data-test-id=save-${type.toLocaleLowerCase()}-button]`
    )
    if (status === "disabled") {
      return expect(element).toBeDisabled()
    } else {
      return expect(element).toBeEnabled()
    }
  }

  async selectPayment(
    type: "stripe" | "braintree" | "wire" | "paypal" | "adyen"
  ) {
    let paymentMethod
    if (type === "wire") {
      paymentMethod = `${type}_transfers`
    } else {
      paymentMethod = `${type}_payments`
    }

    await this.page.click(`[data-test-id=${paymentMethod}]`, { force: true })
  }

  async setPayment(type: "stripe" | "braintree" | "paypal" | "adyen") {
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
        this.page.click("[data-test-id=save-customer-button]")
        await this.page
          .locator("[data-test-id=step_customer][data-status=false]")
          .waitFor({ state: "visible" })
        break
      case "Shipping":
        this.page.click("[data-test-id=save-shipping-button]")
        await this.page
          .locator("[data-test-id=step_shipping][data-status=false]")
          .waitFor({ state: "visible" })
        break
      case "Payment": {
        const text = waitText || "Order successfully placed"
        this.page.click("[data-test-id=save-payment-button]")

        if (waitText === "Paga con PayPal") {
          await this.page.fill(
            "input[name=login_email]",
            process.env.NEXT_PUBLIC_PAYPAL_EMAIL as string
          )

          await this.page.click("#btnNext")

          await this.page.fill(
            "input[name=login_password]",
            process.env.NEXT_PUBLIC_PAYPAL_PASSWORD as string
          )

          await this.page.click("#btnLogin")
          await this.page.click('[data-testid="submit-button-initial"]')

          await this.page
            .locator("text=Order successfully placed!")
            .waitFor({ state: "visible", timeout: 15000 })
          return
        }

        if (skipWait) {
          return
        }
        await this.page
          .locator(`text=${text}`)
          .waitFor({ state: "visible", timeout: 15000 })
        break
      }
    }
  }
}
