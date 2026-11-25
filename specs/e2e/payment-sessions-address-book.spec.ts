import {
  expect,
  expectPaymentToCoverTheOrder,
  readBillingAddress,
  readCustomerAddresses,
  test,
} from "../fixtures/newPaymentsPage"

/**
 * Saving an address to the customer's address book on the `payment_sessions`
 * model.
 *
 * Ticking "save to address book" only records the choice in localStorage. The
 * library sends it to the order when the order is placed, and the API then adds
 * the address to the customer's address book. The payment_sessions place button
 * used to skip that, so the choice was lost.
 *
 * A customer of its own, so the address book starts empty and an address in it
 * can only have come from this order.
 */
test.describe("saving addresses to the address book on the payment_sessions model", {
  tag: "@payment-sessions",
}, () => {
  test.use({ customerOrder: "fresh" })

  test("saves the billing address the customer chose to keep", async ({
    page,
    checkout,
    newPaymentsOrder,
  }) => {
    test.setTimeout(120_000)
    const billing = await readBillingAddress(newPaymentsOrder)
    expect(await readCustomerAddresses(newPaymentsOrder)).toEqual([])

    await page.click("[data-testid=step_customer]", { force: true })
    const saveToBook = page.locator(
      "input[data-testid=billing_address_save_to_customer_address_book]",
    )
    await expect(saveToBook).not.toBeChecked()
    await saveToBook.check()
    await page.getByTestId("save-customer-button").click()
    await page
      .locator("[data-testid=step_customer][data-status=false]")
      .waitFor({ state: "visible" })

    // Saving the addresses again resets the shipment, so Delivery opens again.
    const saveShipping = page.getByTestId("save-shipping-button")
    await expect(async () => {
      await page.getByText("Standard (NP)").click()
      await expect(saveShipping).toBeEnabled({ timeout: 2_000 })
    }).toPass({ timeout: 20_000 })
    await saveShipping.click()
    await page
      .locator("[data-testid=step_shipping][data-status=false]")
      .waitFor({ state: "visible" })

    await checkout.waitForPaymentStep()
    await checkout.selectPaymentSetting("Pay with Wire Transfer")
    await checkout.acceptTerms()
    await checkout.placeOrder()

    await expectPaymentToCoverTheOrder(newPaymentsOrder, { sessions: 1 })
    await expect
      .poll(async () => await readCustomerAddresses(newPaymentsOrder), {
        message: "the billing address in the customer's address book",
        timeout: 15_000,
      })
      .toEqual([billing])
  })
})
