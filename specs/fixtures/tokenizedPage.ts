import { getSalesChannelToken } from "@commercelayer/js-auth"
import CommerceLayer from "@commercelayer/sdk"
import { test as base } from "@playwright/test"
import dotenv from "dotenv"

import path from "path"

import { CheckoutPage } from "./CheckoutPage"

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") })

type FixtureType = {
  checkoutPage: CheckoutPage
}

const getToken = async () => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT as string
  const scope = process.env.NEXT_PUBLIC_MARKET_ID as string
  const { accessToken } = await getSalesChannelToken({
    clientId,
    endpoint,
    scope,
  })
  return accessToken
}

const getOrderId = async () => {
  const token = await getToken()

  const cl = CommerceLayer({
    organization: "the-brown-brand-252",
    accessToken: token,
  })
  const sku = (await cl.skus.list()).first()
  const order = await cl.orders.create({})

  const lineItem = {
    sku_code: sku?.code,
    quantity: 1,
    order: order,
  }
  await cl.line_items.create(lineItem)
  return { orderId: order.id, token }
}

export const test = base.extend<FixtureType>({
  checkoutPage: async ({ page }, use) => {
    const { orderId, token } = await getOrderId()
    const checkoutPage = new CheckoutPage(page)
    await checkoutPage.goto(orderId, token)
    await use(checkoutPage)
  },
})

export { expect } from "@playwright/test"
