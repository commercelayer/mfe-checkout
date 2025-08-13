import { useEffect, useState } from "react"

interface UseExpiryResult {
  expireAt: string | null | undefined
  duration: number | null // ms rimanenti, null se non c'è scadenza
  isExpired: boolean
  hasTimer: boolean
}

export function useExpiry(
  expireAt: string | null | undefined,
): UseExpiryResult {
  const [duration, setDuration] = useState<number | null>(() => {
    if (!expireAt) return null
    return new Date(expireAt).getTime() - Date.now()
  })

  const isExpired = expireAt ? duration !== null && duration <= 0 : false

  useEffect(() => {
    if (!expireAt || isExpired) return
    const interval = setInterval(() => {
      const newDuration = new Date(expireAt).getTime() - Date.now()
      if (newDuration <= 0) {
        setDuration(0)
        clearInterval(interval)
      } else {
        setDuration(newDuration)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [expireAt, isExpired])

  return {
    expireAt,
    duration: expireAt ? Math.max(duration ?? 0, 0) : null,
    hasTimer: Boolean(expireAt),
    isExpired,
  }
}
