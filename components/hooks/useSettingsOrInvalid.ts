import { useRouter } from "next/router"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface UseSettingsOrInvalid {
  settings: CheckoutSettings | undefined
  isLoading: boolean
}

export const useSettingsOrInvalid = (): UseSettingsOrInvalid => {
  const router = useRouter()
  const { orderId, accessToken } = router.query

  const { data, error } = useSWR(
    router.isReady
      ? `/api/settings?accessToken=${accessToken}&orderId=${orderId}`
      : null,
    fetcher
  )

  if (!data && !error) {
    return { isLoading: true, settings: undefined }
  }

  if (
    error ||
    (data && !data.validCheckout) ||
    data.slug !== window.location.host.split(":")[0].split(".")[0]
  ) {
    router.push("/invalid")
    return { settings: undefined, isLoading: false }
  }

  return {
    settings: data,
    isLoading: false,
  }
}
