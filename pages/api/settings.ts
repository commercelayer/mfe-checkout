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

  // CLayer.init({
  //   accessToken,
  //   endpoint,
  // })

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
    } else {
      res.statusCode = 200
      return res.json({ validCheckout: false })
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
    primaryColor: hex2hsl(organization?.primaryColor as string) || BLACK_COLOR,
    favicon: organization?.faviconUrl || "/favicon.png",
    gtmId: organization?.gtmId,
    supportEmail: "test@extendi.it",
    supportPhone: "+39 111 222 3333",
    termsUrl: order.termsUrl,
    privacyUrl: order.privacyUrl,
  }
  res.statusCode = 200

  return res.json(appSettings)
}
