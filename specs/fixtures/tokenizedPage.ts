import { getSalesChannelToken } from "@commercelayer/js-auth"
import CommerceLayer, { CommerceLayerClient } from "@commercelayer/sdk"
import { test as base } from "@playwright/test"
import dotenv from "dotenv"

import path from "path"

import { CheckoutPage } from "./CheckoutPage"

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") })

type OrderType = "plain" | "no_line_items"

interface DefaultParamsProps {
  token?: string
  orderId?: string
  order: OrderType | undefined
  orderAttributes?: object
}

type FixtureType = {
  checkoutPage: CheckoutPage
  defaultParams: DefaultParamsProps
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
  return accessToken as string
}

const getOrder = async (
  cl: CommerceLayerClient,
  params: DefaultParamsProps
) => {
  const attributes = { ...params.orderAttributes }
  const order = await cl.orders.create(attributes)
  if (params.order === "plain") {
    await createLineItems(cl, order.id)
  }
  return { orderId: order.id }
}

const getClient = async (token: string) => {
  return CommerceLayer({
    organization: process.env.NEXT_PUBLIC_SLUG as string,
    accessToken: token,
  })
}

const createLineItems = async (cl: CommerceLayerClient, orderId: string) => {
  const sku = (await cl.skus.list()).first()

  const lineItem = {
    sku_code: sku?.code,
    quantity: 1,
    order: cl.orders.relationship(orderId),
  }
  const l = await cl.line_items.create(lineItem)
}

export const test = base.extend<FixtureType>({
  defaultParams: { order: "plain" },
  checkoutPage: async ({ page, defaultParams }, use) => {
    const token = await getToken()
    const cl = await getClient(token)
    const { orderId } = await getOrder(cl, defaultParams)
    const checkoutPage = new CheckoutPage(page)
    const id =
      defaultParams.orderId === undefined ? orderId : defaultParams.orderId
    const accessToken =
      defaultParams.token === undefined ? token : defaultParams.token
    await checkoutPage.goto({
      orderId: id,
      token: accessToken,
    })
    await use(checkoutPage)
  },
})

export { expect } from "@playwright/test"
