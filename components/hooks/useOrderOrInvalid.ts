import { useRouter } from "next/router"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface UseOrderOrInvalid {
  data: CheckoutSettings | undefined
  isLoading: boolean
}

export const useOrderOrInvalid = (): UseOrderOrInvalid => {
  const router = useRouter()

  const { data, error } = useSWR(
    router.isReady ? `/api/settings${router.asPath}` : null,
    fetcher
  )

  if (!data && !error) {
    return { isLoading: true, data: undefined }
  }

  if (error || (data && !data.validCheckout)) {
    router.push("/invalid")
    return { data: undefined, isLoading: false }
  }

  return {
    data,
    isLoading: false,
  }
}
