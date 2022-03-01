import { getSalesChannelToken } from "@commercelayer/js-auth"
import CommerceLayer, { CommerceLayerClient } from "@commercelayer/sdk"
import { test as base } from "@playwright/test"
import dotenv from "dotenv"

import path from "path"

import { CheckoutPage } from "./CheckoutPage"

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") })

type OrderType =
  | "plain"
  | "no_line_items"
  | "bundle"
  | "bundle+skus"
  | "digital"
  | "gift-card"

interface DefaultParamsProps {
  token?: string
  orderId?: string
  order: OrderType | undefined
  orderAttributes?: object
  giftCardAttributes?: {
    currency_code?: "EUR" | "USD"
    balance_cents?: number
    customer_email?: string
  }
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
  const giftCard = { ...params.giftCardAttributes }
  const order = await cl.orders.create(attributes)
  switch (params.order) {
    case "plain":
      await createDefaultLineItem(cl, order.id)
      break
    case "bundle":
      await createLineItems({
        cl,
        orderId: order.id,
        items: [
          {
            bundle_code: "SHIRTSETSINGLE",
            quantity: 1,
          },
        ],
      })
      break
    case "bundle+skus":
      await createLineItems({
        cl,
        orderId: order.id,
        items: [
          {
            bundle_code: "SHIRTSETSINGLE",
            quantity: 1,
          },
          {
            sku_code: "TESLA5",
            quantity: 2,
          },
        ],
      })
      break

    case "digital": {
      await createLineItems({
        cl,
        orderId: order.id,
        items: [
          {
            sku_code: "NFTEBOOK",
            quantity: 1,
          },
        ],
      })
      break
    }
    case "gift-card": {
      const card = await cl.gift_cards.create({
        currency_code: giftCard.currency_code ? giftCard.currency_code : "EUR",
        balance_cents: giftCard.balance_cents ? giftCard.balance_cents : 10000,
        recipient_email: giftCard.customer_email
          ? giftCard.customer_email
          : "alessani@gmail.com",
      })
      const activeCard = await cl.gift_cards.update({
        id: card.id,
        _purchase: true,
      })
      const lineItem = {
        quantity: 1,
        order: cl.orders.relationship(order.id),
        item: cl.gift_cards.relationship(activeCard),
      }

      await cl.line_items.create(lineItem)

      break
    }
  }
  return { orderId: order.id }
}

const getClient = async (token: string) => {
  return CommerceLayer({
    organization: process.env.NEXT_PUBLIC_SLUG as string,
    accessToken: token,
  })
}

type LineItemObject = {
  quantity: number
} & ({ sku_code: string } | { bundle_code: string })

const createLineItems = async ({
  cl,
  orderId,
  items,
}: {
  cl: CommerceLayerClient
  orderId: string
  items: Array<LineItemObject>
}) => {
  const lineItems = items.map((item) => {
    const lineItem = {
      ...item,
      order: cl.orders.relationship(orderId),
    }

    return cl.line_items.create(lineItem)
  })

  try {
    const promises = await Promise.all(lineItems)
    console.log(promises)
  } catch (e) {
    console.log(e)
  }
}

const createDefaultLineItem = async (
  cl: CommerceLayerClient,
  orderId: string
) => {
  const sku = (await cl.skus.list()).first()

  const lineItem = {
    sku_code: sku?.code,
    quantity: 1,
    order: cl.orders.relationship(orderId),
  }

  await cl.line_items.create(lineItem)
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
