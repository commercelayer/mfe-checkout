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
    endpoint: process.env.CLAYER_DOMAIN as string,
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

  if (!order?.id || order.status === "placed") {
    res.statusCode = 200
    return res.json({ validCheckout: false })
  }

  res.statusCode = 200

  const appSettings: CheckoutSettings = {
    accessToken,
    orderId: order.id,
    validCheckout: true,
    endpoint: process.env.CLAYER_DOMAIN as string,
    logoUrl:
      "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
    companyName: "Test company",
    language: order.languageCode,
    primaryColor: "#3b82f6",
    favicon:
      "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
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
