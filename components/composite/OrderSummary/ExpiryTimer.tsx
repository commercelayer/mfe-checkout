import { useExpiry } from "components/hooks/useExpiry"
import type React from "react"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export const ExpiryTimer: React.FC<{
  expireAt: string | null
  isFinished?: () => void
}> = ({ expireAt, isFinished }) => {
  const { t } = useTranslation()
  const { duration, isExpired, hasTimer } = useExpiry(expireAt)
  console.log("tempo in expiryTimer component")
  useEffect(() => {
    if (hasTimer && isExpired && isFinished) {
      isFinished()
    }
  }, [hasTimer, isExpired, isFinished])

  if (!hasTimer) {
    return null // No timer set, nothing to display
  }
  if (duration == null) {
    return null // No timer set, nothing to display
  }

  // Format remaining time as hh:mm:ss
  const hours = Math.floor(duration / 60000 / 60)
  const minutes = Math.floor(duration / 60000) % 60
  const seconds = Math.floor((duration % 60000) / 1000)
  return (
    <div className="border border-dashed border-primary-light rounded-lg p-4 mb-8 bg-white max-w">
      <div className="flex items-center justify-between text-xs gap-1 border-b border-dashed pb-2">
        <div className="flex items-center gap-2 font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Timer Icon</title>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {t("orderRecap.timer.title")}
        </div>
        <div className="flex gap-1 text-gray-900 items-center text-md font-bold">
          <div className="flex items-center justify-center px-2 py-1 bg-gray-100 rounded w-9">
            {hours.toString().padStart(2, "0")}
          </div>
          <span>:</span>
          <div className="flex items-center justify-center px-2 py-1 bg-gray-100 rounded w-9">
            {minutes.toString().padStart(2, "0")}
          </div>
          <span>:</span>
          <div className="flex items-center justify-center px-2 py-1 bg-gray-100 rounded w-9">
            {seconds.toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-xs mt-4">
        Allo scadere del tempo i biglietti non saranno più riservati e sarà
        necessario aggiungerli di nuovo all'ordine
      </p>
    </div>
  )
}
