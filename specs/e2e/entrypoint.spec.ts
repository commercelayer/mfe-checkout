import { test, expect } from "../fixtures/tokenizedPage"

test("should navigate to the 404 page with no params", async ({ page }) => {
  page.goto(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`)
  await expect(page.locator("text=This order is not accessible.")).toBeVisible()
})

test("should navigate to the 404 page with wrong orderId, no token", async ({
  page,
}) => {
  page.goto(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/Asdakfrsf`)
  await expect(page.locator("text=This order is not accessible.")).toBeVisible()
})

test.describe("add default params to page", () => {
  test.use({
    defaultParams: {
      orderId: "",
      order: undefined,
    },
  })

  test("should navigate to the 404 page with no order, valid token", async ({
    checkoutPage,
  }) => {
    await expect(
      checkoutPage.page.locator("text=This order is not accessible.")
    ).toBeVisible()
  })

  test.use({
    defaultParams: {
      token: "",
      order: "plain",
    },
  })

  test("should navigate to the 404 page with valid order, no token", async ({
    checkoutPage,
  }) => {
    await expect(
      checkoutPage.page.locator("text=This order is not accessible.")
    ).toBeVisible()
  })

  test.use({
    defaultParams: {
      orderId: "wrongOrderId",
      order: "plain",
    },
  })

  test("should navigate to the 404 page with wrong orderId, valid token", async ({
    checkoutPage,
  }) => {
    await expect(
      checkoutPage.page.locator("text=This order is not accessible.")
    ).toBeVisible()
  })

  test.use({
    defaultParams: {
      orderId: "wrongOrderId",
      token: "wrongToken",
      order: undefined,
    },
  })

  test("should navigate to the 404 page with wrong orderId, wrong token", async ({
    page,
  }) => {
    page.goto(
      `${
        process.env.NEXT_PUBLIC_BASE_PATH || ""
      }/wrongOrderId?accessToken=wrongToken`
    )
    await expect(
      page.locator("text=This order is not accessible.")
    ).toBeVisible()
  })

  test.use({
    defaultParams: {
      order: "no_line_items",
    },
  })

  test("should navigate to the 404 with valid token and valid orderId, no line items", async ({
    checkoutPage,
  }) => {
    await expect(
      checkoutPage.page.locator("text=This order is not accessible.")
    ).toBeVisible()
  })
})

test("should navigate to checkout with valid token and valid orderId", async ({
  checkoutPage,
}) => {
  await expect(checkoutPage.page.locator("text=Order Summary")).toBeVisible()
})
