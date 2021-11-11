import { useRouter } from "next/router"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface UseSettingsOrInvalid {
  settings: CheckoutSettings | undefined
  isLoading: boolean
}

const timestamp = Date.now().toString()

export const useSettingsOrInvalid = (): UseSettingsOrInvalid => {
  const router = useRouter()
  const { orderId, accessToken } = router.query

  const { data, error } = useSWR(
    router.isReady
      ? `/api/settings?accessToken=${accessToken}&orderId=${orderId}&timestamp=${timestamp}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  if (!data && !error) {
    return { isLoading: true, settings: undefined }
  }

  if (error || (data && !data.validCheckout)) {
    router.push("/404")
    return { settings: undefined, isLoading: false }
  }

  return {
    settings: data,
    isLoading: false,
  }
}
