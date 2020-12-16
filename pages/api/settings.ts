// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { accessToken } = req.body

  if (!accessToken) {
    res.statusCode = 200
    return res.json({ validCheckout: false })
  }
  const checkToken = await fetch(
    `https://${process.env.CLAYER_DOMAIN}.commercelayer.io/oauth/token`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.CLAYER_CLIENT_ID,
        scope: process.env.CLAYER_SCOPE,
      }),
    }
  )
  const json = await checkToken.json()

  res.statusCode = 200
  res.json({ accessToken: json.access_token, validCheckout: true })
}
