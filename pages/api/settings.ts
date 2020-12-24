// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import CLayer, { Order } from "@commercelayer/js-sdk"
import type { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { accessToken, orderId } = req.body

  if (!accessToken || !orderId) {
    res.statusCode = 200
    return res.json({ validCheckout: false })
  }

  CLayer.init({
    accessToken: accessToken,
    endpoint: process.env.CLAYER_DOMAIN,
  })

  let order

  try {
    order = await Order.includes(
      "shippingAddress",
      "billingAddress",
      "shipments"
    ).find(orderId)
  } catch (e) {
    console.log(`error on retrieving order: ${e}`)
  }

  if (!order?.id || order.status === "placed") {
    res.statusCode = 200
    return res.json({ validCheckout: false })
  }

  // console.log("shipping", order.shippingAddress()?.line1)
  // console.log("billing", (await order.billingAddress()).line1)
  // console.log("shipments", order.shipments())

  res.statusCode = 200

  const appSettings: CheckoutSettings = {
    accessToken,
    orderId: order.id,
    validCheckout: true,
    endpoint: process.env.CLAYER_DOMAIN,
    logoUrl:
      "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
    companyName: "Test company",
  }
  return res.json(appSettings)
}

// const checkToken = await fetch(
//   `https://${process.env.CLAYER_DOMAIN}.commercelayer.io/api/token`,
//   {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       grant_type: "client_credentials",
//       client_id: process.env.CLAYER_CLIENT_ID,
//       scope: process.env.CLAYER_SCOPE,
//     }),
//   }
// )
// const json = await checkToken.json()
