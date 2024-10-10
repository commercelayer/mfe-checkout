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

test.describe("override token", () => {
  test.use({
    defaultParams: {
      token:
        "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImFiYTRjYzYyOGQxZmNlM2ZiOTNhM2VlNTU4MjZlNDFjZmFmMThkYzJkZmYzYjA3MjIyNzQwMzgwZTkxOTlkNWQifQ.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJXWGxFT0Zyam5yIiwic2x1ZyI6ImFsZXNzYW5pIiwiZW50ZXJwcmlzZSI6dHJ1ZSwicmVnaW9uIjoiZXUtd2VzdC0xIn0sImFwcGxpY2F0aW9uIjp7ImlkIjoiRE5PdllpclJwbiIsImNsaWVudF9pZCI6IlJmc0FIMGpUekZoZ3lyZGtqZ2VmWHB5VFlhYm9jWVRPd0FHbUMzSTFOcGMiLCJraW5kIjoic2FsZXNfY2hhbm5lbCIsInB1YmxpYyI6dHJ1ZX0sIm1hcmtldCI6eyJpZCI6WyJkbFFiUGhOTm9wIl0sInN0b2NrX2xvY2F0aW9uX2lkcyI6WyJabllxWHVxUG5ZIiwiUWt4b2V1WFpHVyJdLCJnZW9jb2Rlcl9pZCI6bnVsbCwiYWxsb3dzX2V4dGVybmFsX3ByaWNlcyI6dHJ1ZX0sIm93bmVyIjp7ImlkIjoieVFCckJobVhtUSIsInR5cGUiOiJDdXN0b21lciJ9LCJzY29wZSI6Im1hcmtldDozNTAiLCJleHAiOjE3Mjg0OTE4MzksInRlc3QiOnRydWUsInJhbmQiOjAuOTg4MDE2OTI0NjI3MzcyMSwiaWF0IjoxNzI4NDc3NDM5LCJpc3MiOiJodHRwczovL2F1dGguY29tbWVyY2VsYXllci5jbyJ9.gbWYd8gKlX5oFLjEukEzCQtkiyfs5RT82xTZedJi3b8ZvAG1MtIXyFiUjF_12rnlsy_oQhb0Yjd_Eu2ioV7ZpWXN7c5r9oaPuFj0wMEgDQbeb1ga-K3hVIessGhGSOueSrWroQVVMrDv7TXihlzVMZAOs-OsIQZYMn3fCGBIffErtRicsRQJLRxHMZqWIX1nhFqewWcKY6paPJ5M5WdB_1GBhWujh7HQk0YsVAlL67OyLAoZCyDxPP577sTYnCTXZZep2MZQ9mxO5NYRqMjJlcZ9E_to7iGgwaypGx52G7y05Grk6z6GJQPOCUtDRibcl6I2FBOsB0Jf1_CsHXaD7Qjj55mBvHeWK1aMNzPqnHy8AC7iZsw03NpTBtKZZAX9bapzsS9oPIFcVC9qAKu81zoC027DvgLTrVH_16fZ3ivu-zFKUNTDw8tNP6e7U9Tqu1qxh5hE0gnkJpeukqKQIOFB_wIEQNOWETpLTo7-ZyTxNvj_s7XDZMnD4BWsDKkKGclkGK7EYr0_4TI48CCM848XK_wfE-hpAkSbi3J_AtxsuaZEX3mE0ub3yH0qusLln7kYcLCEEiYW_u2GIlFddk4evWflwlqRjhkALPDSLrGLPDG4zzZkd1XsT_ALm-08X9QmF1mLIPA5Oc25X7Ok7aei1cQH_wlu33M2JDzOVqQ",
      order: "plain",
    },
  })

  test("should navigate to the 404 page with valid order, expired token", async ({
    checkoutPage,
  }) => {
    await expect(
      checkoutPage.page.locator("text=This order is not accessible.")
    ).toBeVisible()
  })
})
