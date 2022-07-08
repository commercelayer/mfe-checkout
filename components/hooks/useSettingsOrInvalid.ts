import { useCallback, useEffect, useRef } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import useSWR from "swr"
import { getSettings } from "utils/getSettings"
import { getSubdomain } from "utils/getSubdomain"

import { useLocalStorageToken } from "./useLocalStorageToken"

interface UseSettingsOrInvalid {
  settings?: CheckoutSettings
  retryOnError?: boolean
  isLoading: boolean
}

export const useSettingsOrInvalid = (): UseSettingsOrInvalid => {
  const random = useRef(Date.now())
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const accessToken = searchParams.get("accessToken")
  const paymentReturn = searchParams.get("paymentReturn")

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

  // setting a custom fetcher to get data from our local async getSettings
  const fetcher = useCallback(
    () =>
      getSettings({
        accessToken: savedAccessToken,
        orderId: orderId as string,
        paymentReturn: isPaymentReturn,
        subdomain: getSubdomain(window.location.hostname),
      }),
    [orderId, savedAccessToken, isPaymentReturn]
  )

  const { data, error } = useSWR(savedAccessToken ? [random] : null, fetcher, {
    revalidateOnFocus: false,
  })

  // No accessToken in URL
  if (isPaymentReturn === null && accessToken === null) {
    navigate("/404")
    return { settings: undefined, isLoading: false }
  }

  if (!data && !error) {
    return { isLoading: true, settings: undefined }
  }

  if (error) {
    return { settings: undefined, retryOnError: true, isLoading: false }
  }

  if (data && !data.validCheckout) {
    if (!data.retryOnError) {
      navigate("/404")
    }
    return { settings: undefined, retryOnError: true, isLoading: false }
  }

  return {
    settings: data,
    isLoading: false,
  }
}
