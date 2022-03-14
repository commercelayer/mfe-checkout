import {
  getCustomerToken,
  getIntegrationToken,
  getSalesChannelToken,
} from "@commercelayer/js-auth"
import CommerceLayer, {
  CommerceLayerClient,
  Address,
  AddressCreate,
} from "@commercelayer/sdk"
import { test as base } from "@playwright/test"
import dotenv from "dotenv"
import jwt_decode from "jwt-decode"

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
  | "with-items"

type LineItemObject = {
  quantity: number
} & ({ sku_code: string } | { bundle_code: string })

interface GiftCardProps {
  currency_code?: "EUR" | "USD"
  balance_cents?: number
  customer_email?: string
  apply?: boolean
}

interface JWTProps {
  owner: {
    id: string
  }
}

interface DefaultParamsProps {
  token?: string
  orderId?: string
  order: OrderType | undefined
  market?: string
  customer?: {
    email: string
    password: string
  }
  orderAttributes?: {
    language_code?: "en" | "it"
    customer_email?: string
    shipping_country_code_lock?: "IT" | "GB" | "US"
    terms_url?: string
    privacy_url?: string
  }
  lineItemsAttributes?: LineItemObject[]
  giftCardAttributes?: GiftCardProps
  customerAddresses?: Partial<Address>[]
  shippingMethods?: Array<
    "Standard Shipping" | "Express Delivery EU" | "Express Delivery US"
  >
  addresses?: {
    billingAddress?: Partial<Address>
    shippingAddress?: Partial<Address>
    sameShippingAddress?: boolean
  }
  couponCode?: string
}

type FixtureType = {
  checkoutPage: CheckoutPage
  defaultParams: DefaultParamsProps
}

const getToken = async (market?: string) => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT as string
  const scope = market || (process.env.NEXT_PUBLIC_MARKET_ID as string)

  const data = await getSalesChannelToken({
    clientId,
    endpoint,
    scope,
  })
  return data?.accessToken as string
}

const getCustomerUserToken = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const token = await getSuperToken()
  const cl = await getClient(token)
  const existingUser = await cl.customers.list({
    filters: {
      email_eq: email,
    },
  })

  if (existingUser.length === 0) {
    await cl.customers.create({ email, password })
  }
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT as string
  const scope = process.env.NEXT_PUBLIC_MARKET_ID as string

  const data = await getCustomerToken(
    {
      clientId,
      endpoint,
      scope,
    },
    {
      username: email,
      password: password,
    }
  )
  return data?.accessToken as string
}

const getSuperToken = async () => {
  const clientId = process.env.NEXT_PUBLIC_INTEGRATION_CLIENT_ID as string
  const clientSecret = process.env
    .NEXT_PUBLIC_INTEGRATION_CLIENT_SECRET as string
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT as string
  const scope = process.env.NEXT_PUBLIC_MARKET_ID as string
  const data = await getIntegrationToken({
    clientId,
    clientSecret,
    endpoint,
    scope,
  })
  return data?.accessToken as string
}

const getOrder = async (
  cl: CommerceLayerClient,
  params: DefaultParamsProps
) => {
  const email = params.customer?.email || params.orderAttributes?.customer_email
  const attributes = {
    ...params.orderAttributes,
    customer_email: email,
  }
  const giftCard = params.giftCardAttributes
  const order = await cl.orders.create(attributes)
  let giftCardCode

  switch (params.order) {
    case "plain":
      await createDefaultLineItem(cl, order.id)
      break
    case "with-items": {
      await createLineItems({
        cl,
        orderId: order.id,
        items: params.lineItemsAttributes || [],
      })
      if (giftCard) {
        const superToken = await getSuperToken()
        const superCl = await getClient(superToken)
        const card = await createAndPurchaseGiftCard(cl, giftCard)
        const activeCard = await superCl.gift_cards.update({
          id: card.id,
          _activate: true,
        })
        if (giftCard.apply) {
          await cl.orders.update({
            id: order.id,
            gift_card_code: activeCard.code,
          })
        } else {
          giftCardCode = activeCard.code
        }
      }
      if (params.couponCode) {
        await cl.orders.update({
          id: order.id,
          coupon_code: params.couponCode,
        })
      }
      if (params.addresses && params.addresses.billingAddress) {
        const { billingAddress, shippingAddress, sameShippingAddress } =
          params.addresses
        const addressToAttach = await cl.addresses.create(
          billingAddress as AddressCreate
        )
        await cl.orders.update({
          id: order.id,
          billing_address: cl.addresses.relationship(addressToAttach),
          _shipping_address_same_as_billing: sameShippingAddress,
        })
        if (!sameShippingAddress && shippingAddress) {
          const addressToAttach = await cl.addresses.create(
            shippingAddress as AddressCreate
          )
          await cl.orders.update({
            id: order.id,
            shipping_address: cl.addresses.relationship(addressToAttach),
          })
        }
      }
      if (
        params.customer &&
        params.customerAddresses &&
        params.customerAddresses.length > 0
      ) {
        const token = await getCustomerUserToken({
          email: params.customer.email,
          password: params.customer.password,
        })
        const customerCl = await getClient(token)
        const {
          owner: { id },
        } = jwt_decode(token) as JWTProps

        const promises = params.customerAddresses.map(async (address) => {
          const a = await customerCl.addresses.create({
            ...address,
          } as AddressCreate)
          await customerCl.addresses.update({
            id: a.id,
            reference: a.id,
          })
          return customerCl.customer_addresses.create({
            customer: customerCl.customers.relationship(id),
            address: customerCl.addresses.relationship(a),
          })
        })
        await Promise.all(promises)
      }
      // Not used due to refresh at the beginning
      // if (params.shippingMethods && params.shippingMethods.length > 0) {
      //   const shipments = (
      //     await cl.orders.retrieve(order.id, {
      //       fields: {
      //         orders: ["id"],
      //         shipments: ["shipping_method"],
      //       },
      //       include: ["shipments", "shipments.shipping_method"],
      //     })
      //   ).shipments
      //   const shippingMethods = await cl.shipping_methods.list()
      //   if (shippingMethods && shippingMethods.length > 0) {
      //     const promises = shipments?.map((shipment, index) => {
      //       const shippingMethod = shippingMethods.find((s) => {
      //         const name = (params.shippingMethods || [])[index]
      //         return s.name === name
      //       })
      //       if (shippingMethod) {
      //         return cl.shipments.update({
      //           id: shipment.id,
      //           shipping_method: cl.shipping_methods.relationship(
      //             shippingMethod.id
      //           ),
      //         })
      //       } else {
      //         return 1
      //       }
      //     })
      //     if (promises && promises?.length > 0) {
      //       await Promise.all(promises)
      //     }
      //   }
      // }

      break
    }
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
      const activeCard = await createAndPurchaseGiftCard(cl, giftCard)

      const lineItem = {
        quantity: 1,
        order: cl.orders.relationship(order),
        item: cl.gift_cards.relationship(activeCard),
      }

      await cl.line_items.create(lineItem)

      break
    }
  }
  return { orderId: order.id, attributes: { giftCard: giftCardCode } }
}

const createAndPurchaseGiftCard = async (
  cl: CommerceLayerClient,
  props?: GiftCardProps
) => {
  const card = await cl.gift_cards.create({
    currency_code: props?.currency_code ? props.currency_code : "EUR",
    balance_cents: props?.balance_cents ? props.balance_cents : 10000,
    recipient_email: props?.customer_email
      ? props.customer_email
      : "customer@tk.com",
  })
  const activeCard = await cl.gift_cards.update({
    id: card.id,
    _purchase: true,
  })
  return activeCard
}

const getClient = async (token: string) => {
  return CommerceLayer({
    organization: process.env.NEXT_PUBLIC_SLUG as string,
    accessToken: token,
    domain: process.env.DOMAIN,
  })
}

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
    await Promise.all(lineItems)
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
    const token = await (defaultParams.customer
      ? getCustomerUserToken(defaultParams.customer)
      : getToken(defaultParams.market))
    const cl = await getClient(token)
    const { orderId, attributes } = await getOrder(cl, defaultParams)
    const checkoutPage = new CheckoutPage(page, attributes)
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
