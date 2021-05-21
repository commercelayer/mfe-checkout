// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import CLayer, { Order, Organization } from "@commercelayer/js-sdk"
import jwt_decode from "jwt-decode"
import type { NextApiRequest, NextApiResponse } from "next"

import hex2hsl, { WHITE_COLOR, BLACK_COLOR } from "components/utils/hex2hsl"

interface JWTProps {
  organization: {
    slug: string
    id: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = req.query.accessToken as string
  const orderId = req.query.orderId as string

  if (!accessToken || !orderId) {
    res.statusCode = 200
    return res.json({ validCheckout: false })
  }

  let endpoint: string
  try {
    const slug = (jwt_decode(accessToken) as JWTProps).organization.slug
    if (slug) {
      endpoint = `https://${slug}.${
        process.env.NEXT_PUBLIC_CLAYER_HOSTNAME as string
      }`
    } else {
      endpoint = process.env.NEXT_PUBLIC_CLAYER_DOMAIN as string
    }
  } catch (e) {
    console.log(`error decoding access token: ${e}`)
    res.statusCode = 200
    return res.json({ validCheckout: false })
  }

  CLayer.init({
    accessToken,
    endpoint,
  })

  let order

  try {
    const orderFetched = await Order.select(
      "id",
      "status",
      "number",
      "guest",
      "language_code"
    ).find(orderId)
    order = await orderFetched?.update({ _refresh: true })
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
    organization = await Organization.all()
  } catch (e) {
    console.log("error on retrieving organization:")
    console.log(e)
  }

  if (!order?.id || order.status === "placed") {
    res.statusCode = 200
    return res.json({ validCheckout: false })
  }

  const appSettings: CheckoutSettings = {
    accessToken,
    endpoint,
    orderNumber: order.number,
    orderId: order.id,
    validCheckout: true,
    logoUrl:
      organization?.logoUrl ||
      "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
    companyName: organization?.name || "Test company",
    language: order.languageCode,
    primaryColor: { h: 122, s: "39.44%", l: "49.99%" }, // hex2hsl(organization?.primaryColor as string) || BLACK_COLOR,
    favicon: organization?.faviconUrl || "/favicon.png",
    gtmId: organization?.gtmId,
    supportEmail: "test@extendi.it",
    supportPhone: "+39 111 222 3333",
  }
  res.statusCode = 200

  return res.json(appSettings)
}
