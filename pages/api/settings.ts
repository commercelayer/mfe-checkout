// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import CommerceLayer, { Order } from "@commercelayer/sdk"
import jwt_decode from "jwt-decode"
import type { NextApiRequest, NextApiResponse } from "next"

import hex2hsl, { BLACK_COLOR } from "components/utils/hex2hsl"

interface JWTProps {
  organization: {
    slug: string
    id: string
  }
  application: {
    kind: string
  }
}

function isProduction(env: string): boolean {
  return env === "production"
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { NODE_ENV, DOMAIN, HOSTED } = process.env
  const accessToken = req.query.accessToken as string
  const orderId = req.query.orderId as string
  const domain = isProduction(NODE_ENV)
    ? "commercelayer.io"
    : DOMAIN || "commercelayer.io"
  const paymentReturn = req.query.paymentReturn === "true"

  let cl
  let slug_cl

  function invalidateCheckout() {
    res.statusCode = 200
    return res.json({ validCheckout: false })
  }

  if (!accessToken || !orderId) {
    return invalidateCheckout()
  }

  let endpoint: string
  try {
    const {
      organization: { slug },
    } = jwt_decode(accessToken) as JWTProps
    const {
      application: { kind },
    } = jwt_decode(accessToken) as JWTProps

    slug_cl = slug
    const subdomain = req.headers.host?.split(":")[0].split(".")[0]

    if (
      isProduction(NODE_ENV) &&
      !!HOSTED &&
      (subdomain !== slug || kind !== "sales_channel")
    ) {
      return invalidateCheckout()
    } else if (slug && kind === "sales_channel") {
      endpoint = `https://${slug}.${domain}`
    } else {
      return invalidateCheckout()
    }

    cl = CommerceLayer({
      organization: slug,
      accessToken: accessToken,
      domain,
    })
  } catch (e) {
    console.log(`error decoding access token: ${e}`)
    return invalidateCheckout()
  }

  let order

  try {
    const orderFetched: Order = await cl.orders.retrieve(orderId, {
      fields: {
        orders: [
          "id",
          "autorefresh",
          "status",
          "number",
          "guest",
          "language_code",
          "terms_url",
          "privacy_url",
        ],
      },
      include: ["line_items"],
    })

    if (orderFetched.status === "draft" || orderFetched.status === "pending") {
      const _refresh = !paymentReturn

      order = await cl.orders.update({
        id: orderFetched.id,
        _refresh,
        ...(!orderFetched.autorefresh && { autorefresh: true }),
      })
    } else if (orderFetched.status === "placed") {
      order = await cl.orders.retrieve(orderId)
    }
  } catch (e) {
    console.log("error on retrieving order:")
    console.log(e)
    console.log("access token:")
    console.log(accessToken)
    console.log("orderId")
    console.log(orderId)
    console.log("endpoint")
    console.log(endpoint)
  }

  let organization
  try {
    organization = await cl.organization.retrieve()
  } catch (e) {
    console.log("error on retrieving organization:")
    console.log(e)
  }

  if (!order?.id || !organization?.id) {
    console.log("Invalid: no order or organization")
    return invalidateCheckout()
  }

  const lineItemsCount = (
    await cl.orders.retrieve(orderId, {
      fields: {
        line_items: ["item_type"],
      },
      include: ["line_items"],
    })
  ).line_items?.filter((line_item) => {
    return (
      line_item.item_type === "skus" ||
      line_item.item_type === "gift_cards" ||
      line_item.item_type === "bundles"
    )
  }).length

  // If there are no items to buy we redirect to the invalid page
  if (lineItemsCount === 0) {
    console.log("Invalid: No line items")
    return invalidateCheckout()
  }

  const appSettings: CheckoutSettings = {
    accessToken,
    endpoint,
    domain,
    slug: slug_cl,
    orderNumber: order.number || 0,
    orderId: order.id,
    validCheckout: true,
    logoUrl: organization.logo_url,
    companyName: organization?.name || "Test company",
    language: order.language_code || "en",
    primaryColor: hex2hsl(organization.primary_color as string) || BLACK_COLOR,
    favicon: organization?.favicon_url || "/favicon.png",
    gtmId: organization?.gtm_id,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Organization type not updated on sdk v3
    supportEmail: organization?.support_email,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Organization type not updated on sdk v3
    supportPhone: organization?.support_phone,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Organization type not updated on sdk v3
    termsUrl: order.terms_url,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Organization type not updated on sdk v3
    privacyUrl: order.privacy_url,
  }

  return res
    .setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate")
    .status(200)
    .json(appSettings)
}
