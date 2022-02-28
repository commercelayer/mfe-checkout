import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import useSWR from "swr"

import { useLocalStorageToken } from "./useLocalStorageToken"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface UseSettingsOrInvalid {
  settings: CheckoutSettings | undefined
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

  const paymentReturnQuery =
    paymentReturn === "true" ? "&paymentReturn=true" : ""

  useEffect(() => {
    if (router.isReady && accessToken && accessToken !== savedAccessToken) {
      setAccessToken(accessToken)
    }
  }, [router])

  const { data, error } = useSWR(
    router.isReady
      ? [
          `/api/settings?accessToken=${savedAccessToken}&orderId=${orderId}${paymentReturnQuery}`,
          random,
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  if (!data && !error) {
    return { isLoading: true, settings: undefined }
  }

  if (error || (data && !data.validCheckout)) {
    if (!data?.retryOnError) {
      router.push("/404")
    }
    return { settings: undefined, retryOnError: true, isLoading: false }
  }

  return {
    settings: data,
    isLoading: false,
  }
}
