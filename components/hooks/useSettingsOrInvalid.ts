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
  const [settings, setSettings] = useState<
    CheckoutSettings | InvalidCheckoutSettings | undefined
  >(undefined)

  const [savedAccessToken, setAccessToken] = useLocalStorageToken(
    "checkoutAccessToken",
    accessToken as string
  )

  const isPaymentReturn = paymentReturn === "true"

  useEffect(() => {
    if (accessToken && accessToken !== savedAccessToken) {
      setAccessToken(accessToken)
    }
  }, [accessToken])

  useEffect(() => {
    if (savedAccessToken && orderId) {
      getSettings({
        accessToken: savedAccessToken,
        orderId: orderId as string,
        paymentReturn: isPaymentReturn,
        subdomain: getSubdomain(window.location.hostname),
      }).then((s) => setSettings(s))
    }
  }, [orderId, savedAccessToken, isPaymentReturn])

  // No accessToken in URL
  if (isPaymentReturn === null && accessToken === null) {
    navigate("/404")
    return { settings: undefined, isLoading: false }
  }

  if (!settings) {
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
