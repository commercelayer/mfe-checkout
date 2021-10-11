// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Order, Organization } from "@commercelayer/js-sdk"
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = req.query.accessToken as string
  const orderId = req.query.orderId as string

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

    const subdomain = req.headers.host?.split(":")[0].split(".")[0]

    if (subdomain !== slug || kind !== "sales_channel") {
      return invalidateCheckout()
    } else if (slug) {
      endpoint = `https://${slug}.commercelayer.io`
    } else {
      return invalidateCheckout()
    }
  } catch (e) {
    console.log(`error decoding access token: ${e}`)
    return invalidateCheckout()
  }

  let order

  try {
    const orderFetched = await Order.withCredentials({ accessToken, endpoint })
      .select(
        "id",
        "status",
        "number",
        "guest",
        "language_code",
        "terms_url",
        "privacy_url"
      )
      .find(orderId)

    if (orderFetched.status === "draft" || orderFetched.status === "pending") {
      order = await orderFetched
        ?.withCredentials({ accessToken, endpoint })
        .update({ _refresh: true })
    } else if (orderFetched.status === "placed") {
      order = orderFetched?.withCredentials({ accessToken, endpoint })
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
    organization = await Organization.withCredentials({
      accessToken,
      endpoint,
    }).all()
  } catch (e) {
    console.log("error on retrieving organization:")
    console.log(e)
  }

  if (!order?.id || !organization?.id) {
    return invalidateCheckout()
  }

  const lineItemsCount = (
    await order
      .withCredentials({
        accessToken,
        endpoint,
      })
      .lineItems()
      ?.where({ itemTypeMatchesAny: "skus,bundle,gift_card" }) //, "bundle", "gift_card"] })
      .select("item_type")
      .all()
  )?.toArray().length

  // If there are no items to buy we redirect to the invalid page
  if (lineItemsCount === 0) {
    return invalidateCheckout()
  }

  const appSettings: CheckoutSettings = {
    accessToken,
    endpoint,
    orderNumber: order.number,
    orderId: order.id,
    validCheckout: true,
    logoUrl: organization?.logoUrl,
    companyName: organization?.name || "Test company",
    language: order.languageCode,
    primaryColor: hex2hsl(organization?.primaryColor as string) || BLACK_COLOR,
    favicon: organization?.faviconUrl || "/favicon.png",
    gtmId: organization?.gtmId,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Organization type not updated on sdk v3
    supportEmail: organization?.supportEmail,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Organization type not updated on sdk v3
    supportPhone: organization?.supportPhone,
    termsUrl: order.termsUrl,
    privacyUrl: order.privacyUrl,
  }
  res.statusCode = 200

  return res.json(appSettings)
}
