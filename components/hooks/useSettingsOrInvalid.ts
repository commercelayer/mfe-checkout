import { useRouter } from "next/router"
import { useCallback, useEffect, useRef } from "react"
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
  const router = useRouter()
  const { orderId, accessToken, paymentReturn } = router.query

  const [savedAccessToken, setAccessToken] = useLocalStorageToken(
    "checkoutAccessToken",
    accessToken as string
  )

  const isPaymentReturn = paymentReturn === "true"

  useEffect(() => {
    if (router.isReady && accessToken && accessToken !== savedAccessToken) {
      setAccessToken(accessToken)
    }
  }, [router])

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

  const { data, error } = useSWR(
    router.isReady && savedAccessToken ? [random] : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  // No accessToken in URL
  if (router.isReady && !isPaymentReturn && !accessToken) {
    router.push("/404")
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
      router.push("/404")
    }
    return { settings: undefined, retryOnError: true, isLoading: false }
  }

  return {
    settings: data,
    isLoading: false,
  }
}
