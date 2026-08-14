import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { getSettings } from "utils/getSettings"
import { getSubdomain } from "utils/getSubdomain"

import { useLocalStorageToken } from "./useLocalStorageToken"

interface UseSettingsOrInvalid {
  settings?: CheckoutSettings
  retryOnError?: boolean
  isLoading: boolean
}

export const useSettingsOrInvalid = (): UseSettingsOrInvalid => {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const accessToken = searchParams.get("accessToken")
  const paymentReturn = searchParams.get("paymentReturn")
  const redirectResult = searchParams.get("redirectResult")
  const paymentIntentClientSecret = searchParams.get(
    "payment_intent_client_secret",
  )
  // Checkout.com stamps the session id on the URL it returns the shopper to after a
  // 3DS challenge, the same way Adyen uses redirectResult and Stripe uses
  // payment_intent_client_secret. Without it here, a return that arrived without an
  // accessToken was treated as a plain visit and redirected to /404.
  const checkoutComSessionId = searchParams.get("cko-session-id")
  const [settings, setSettings] = useState<
    CheckoutSettings | InvalidCheckoutSettings | undefined
  >(undefined)
  const [isFetching, setIsFetching] = useState(true)

  const [savedAccessToken, setAccessToken] = useLocalStorageToken(
    "checkoutAccessToken",
    accessToken as string,
  )

  // `startsWith` rather than `===`: a gateway that appends its own marker with "?" onto
  // a URL that already has a query string yields "?paymentReturn=true?cko-session-id=x",
  // which parses as the single value "true?cko-session-id=x" and leaves cko-session-id
  // unreadable. Both guards would otherwise fail at once and send the shopper to /404.
  const isPaymentReturn =
    paymentReturn?.startsWith("true") === true ||
    !!redirectResult ||
    !!paymentIntentClientSecret ||
    !!checkoutComSessionId

  useEffect(() => {
    if (accessToken && accessToken !== savedAccessToken) {
      setAccessToken(accessToken)
    }
  }, [accessToken])

  const syncedAccessToken =
    accessToken === savedAccessToken || (!accessToken && savedAccessToken)

  useEffect(() => {
    if (syncedAccessToken) {
      setIsFetching(true)
      getSettings({
        accessToken: savedAccessToken,
        orderId: orderId as string,
        paymentReturn: isPaymentReturn,
        subdomain: getSubdomain(window.location.hostname),
      }).then((fetchedSettings) => {
        setSettings(fetchedSettings)
        setIsFetching(false)
      })
    }
  }, [syncedAccessToken])

  // No accessToken in URL
  if (!isPaymentReturn && accessToken === null) {
    navigate("/404")
    return { settings: undefined, isLoading: false }
  }

  if (isFetching) {
    return { isLoading: true, settings: undefined }
  }

  if (settings && !settings.validCheckout) {
    if (!settings.retryOnError) {
      navigate("/404")
    }
    return { settings: undefined, retryOnError: true, isLoading: false }
  }

  return {
    settings,
    isLoading: false,
  }
}
