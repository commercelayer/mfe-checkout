// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TypeAccepted } from "@commercelayer/react-components/lib/utils/getLineItemsCount"
import CommerceLayer, {
  CommerceLayerClient,
  Organization,
  Order,
} from "@commercelayer/sdk"
import jwt_decode from "jwt-decode"
import type { NextApiRequest, NextApiResponse } from "next"

import { LINE_ITEMS_SHOPPABLE } from "components/utils/constants"
import hex2hsl, { BLACK_COLOR } from "components/utils/hex2hsl"

interface JWTProps {
  organization: {
    slug: string
    id: string
  }
  application: {
    kind: string
  }
  test: boolean
}

function isProduction(env: string): boolean {
  return env === "production"
}

async function getOrganization(
  cl: CommerceLayerClient
): Promise<Organization | undefined> {
  try {
    return await cl.organization.retrieve({
      fields: {
        organizations: [
          "id",
          "logo_url",
          "name",
          "primary_color",
          "favicon_url",
          "gtm_id",
          "gtm_id_test",
          "support_email",
          "support_phone",
        ],
      },
    })
  } catch (e) {
    console.log("error on retrieving organization")
    console.log(e)
  }
}

async function getOrder(
  cl: CommerceLayerClient,
  orderId: string
): Promise<Order | undefined> {
  try {
    return await cl.orders.retrieve(orderId, {
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
          "line_items",
        ],
        line_items: ["item_type"],
      },
      include: ["line_items"],
    })
  } catch (e) {
    console.log("error on retrieving order")
    console.log(e)
  }
}

function getTokenInfo(accessToken: string) {
  try {
    const {
      organization: { slug },
      application: { kind },
      test,
    } = jwt_decode(accessToken) as JWTProps

    return { slug, kind, isTest: test }
  } catch (e) {
    console.log(`error decoding access token: ${e}`)
    return {}
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { NODE_ENV, DOMAIN, HOSTED } = process.env
  const accessToken = req.query.accessToken as string
  const orderId = req.query.orderId as string
  const domain = isProduction(NODE_ENV)
    ? "commercelayer.io"
    : DOMAIN || "commercelayer.io"
  const paymentReturn = req.query.paymentReturn === "true"

  function invalidateCheckout() {
    res.statusCode = 200
    console.log("access token:")
    console.log(accessToken)
    console.log("orderId")
    console.log(orderId)
    return res.json({ validCheckout: false })
  }

  if (!accessToken || !orderId) {
    return invalidateCheckout()
  }

  const subdomain = req.headers.host?.split(":")[0].split(".")[0]

  const { slug, kind, isTest } = getTokenInfo(accessToken)

  if (!slug) {
    return invalidateCheckout()
  }

  if (
    isProduction(NODE_ENV) &&
    !!HOSTED &&
    (subdomain !== slug || kind !== "sales_channel")
  ) {
    return invalidateCheckout()
  } else if (kind !== "sales_channel") {
    return invalidateCheckout()
  }

  const cl = CommerceLayer({
    organization: slug,
    accessToken: accessToken,
    domain,
  })

  const organization = await getOrganization(cl)

  if (!organization?.id) {
    console.log("Invalid: organization")
    return invalidateCheckout()
  }

  const order = await getOrder(cl, orderId)

  if (!order?.id) {
    console.log("Invalid: order")
    return invalidateCheckout()
  }

  const lineItemsShoppable = order.line_items?.filter((line_item) => {
    return LINE_ITEMS_SHOPPABLE.includes(line_item.item_type as TypeAccepted)
  })

  // If there are no shoppable items we redirect to the invalid page
  if ((lineItemsShoppable || []).length === 0) {
    console.log("Invalid: No shoppable line items")
    return invalidateCheckout()
  }

  if (order.status === "draft" || order.status === "pending") {
    const _refresh = !paymentReturn
    try {
      await cl.orders.update({
        id: order.id,
        _refresh,
        payment_method: cl.payment_methods.relationship(null),
        ...(!order.autorefresh && { autorefresh: true }),
      })
    } catch {
      console.log("error refreshing order")
    }
  } else if (order.status !== "placed") {
    return invalidateCheckout()
  }

  const appSettings: CheckoutSettings = {
    accessToken,
    endpoint: `https://${slug}.${domain}`,
    domain,
    slug,
    orderNumber: order.number || 0,
    orderId: order.id,
    validCheckout: true,
    logoUrl: organization.logo_url,
    companyName: organization.name || "Test company",
    language: order.language_code || "en",
    primaryColor: hex2hsl(organization.primary_color as string) || BLACK_COLOR,
    favicon: organization.favicon_url || "/favicon.png",
    gtmId: isTest ? organization.gtm_id_test : organization.gtm_id,
    supportEmail: organization.support_email,
    supportPhone: organization.support_phone,
    termsUrl: order.terms_url,
    privacyUrl: order.privacy_url,
  }

  return res
    .setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate")
    .status(200)
    .json(appSettings)
}
