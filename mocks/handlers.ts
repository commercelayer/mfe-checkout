import { rest } from "msw"

export const handlers = [
  rest.post("http://localhost:3000/api/settings", (req, res, ctx) => {
    if (!req.body.orderId || req.body.orderId === "wrongOrderId") {
      return res(ctx.json({ validCheckout: false }))
    }
    if (!req.body.accessToken || req.body.accessToken === "wrongAccessToken") {
      return res(ctx.json({ validCheckout: false }))
    }
    return res(
      ctx.json({
        accessToken: req.body.accessToken,
        orderId: req.body.orderId,
        validCheckout: true,
        endpoint: process.env.CLAYER_DOMAIN,
        logoUrl:
          "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
        companyName: "Test company",
        language: "en",
        primaryColor: "#000000",
        contrastColor: "#ffffff",
        favicon:
          "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
        gtmId: "GTM-TGCQ5BM",
      })
    )
  }),
]
