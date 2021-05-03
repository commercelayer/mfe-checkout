// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import CLayer, { Order, Organization } from "@commercelayer/js-sdk"
import jwt_decode from "jwt-decode"
import type { NextApiRequest, NextApiResponse } from "next"

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
      "guest",
      "language_code"
    ).find(orderId)
    order = await orderFetched?.update({ _refresh: true })
  } catch (e) {
    console.log(`error on retrieving order: ${e}`)
  }

  let organization
  try {
    organization = await Organization.all()
  } catch (e) {
    console.log(`error on retrieving organization: ${e}`)
  }

  if (!order?.id || order.status === "placed") {
    res.statusCode = 200
    return res.json({ validCheckout: false })
  }

  const appSettings: CheckoutSettings = {
    accessToken,
    endpoint,
    orderId: order.id,
    validCheckout: true,
    logoUrl:
      organization?.logoUrl ||
      "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
    companyName: organization?.name || "Test company",
    language: order.languageCode,
    primaryColor: organization?.primaryColor || "#000000",
    contrastColor: organization?.contrastColor || "#ffffff",
    favicon:
      organization?.faviconUrl ||
      "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
    gtmId: organization?.gtmId || "GTM-TGCQ5BM",
    supportEmail: "test@extendi.it",
    supportPhone: "+39 111 222 3333",
  }
  res.statusCode = 200

  return res.json(appSettings)
}
