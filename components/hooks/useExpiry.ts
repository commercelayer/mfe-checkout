import { useEffect, useState } from "react"

interface UseExpiryResult {
  expiresAt: string | null | undefined
  duration: number | null // ms remaining, null if no expiry
  isExpired: boolean
  hasTimer: boolean
}

export function useExpiry(
  expiresAt: string | null | undefined,
): UseExpiryResult {
  const [duration, setDuration] = useState<number | null>(() => {
    if (!expiresAt) return null
    return new Date(expiresAt).getTime() - Date.now()
  })

  const isExpired = expiresAt ? duration !== null && duration <= 0 : false

  useEffect(() => {
    if (!expiresAt || isExpired) return
    const interval = setInterval(() => {
      const newDuration = new Date(expiresAt).getTime() - Date.now()
      if (newDuration <= 0) {
        setDuration(0)
        clearInterval(interval)
      } else {
        setDuration(newDuration)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt, isExpired])

  return {
    expiresAt,
    duration: expiresAt ? Math.max(duration ?? 0, 0) : null,
    hasTimer: Boolean(expiresAt),
    isExpired,
  }
}
