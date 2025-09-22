import { AppContext } from "components/data/AppProvider"
import { Button } from "components/ui/Button"
import { Logo } from "components/ui/Logo"
import { useContext, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

import { ExpiredIcon } from "./ExpiredIcon"

interface Props {
  logoUrl: NullableType<string>
  companyName: string
  thankyouPageUrl: NullableType<string>
  expirationInfo: NullableType<ExpirationInfo>
}

export const StepExpired: React.FC<Props> = ({
  logoUrl,
  companyName,
  expirationInfo,
}) => {
  const { t } = useTranslation()

  const ctx = useContext(AppContext)
  const topRef = useRef<HTMLDivElement | null>(null)
  const returnExpireUrl = expirationInfo?.return_url || ctx?.returnUrl

  useEffect(() => {
    if (topRef.current != null) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
      })
    }
  }, [topRef.current])

  if (!ctx) return null

  const handleClick = () => {
    if (returnExpireUrl) {
      document.location.href = returnExpireUrl
    }
  }

  return (
    <div data-testid="expired-page" className="bg-white min-h-screen">
      <div ref={topRef}>
        <div className="flex flex-col p-5 md:p-10 lg:px-20 2xl:max-w-screen-2xl 2xl:mx-auto">
          <Logo
            logoUrl={logoUrl}
            companyName={companyName}
            className="self-center pt-10 pl-4 mb-10 md:self-auto"
          />
          <div className="flex flex-col justify-center items-center text-center">
            <div className="p-8">
              <ExpiredIcon />
            </div>
            <h1 className="text-black text-2xl lg:text-4xl font-semibold mb-4">
              {t("orderRecap.timer.error")}
            </h1>
            <p data-testid="expired-message" className="py-2 text-gray-400">
              {expirationInfo?.expired_message ||
                t("orderRecap.timer.expiration_message")}
            </p>

            {returnExpireUrl != null && (
              <div className="flex items-center justify-center w-full mt-8">
                <Button
                  data-testid="button-expire-url-to-shop"
                  onClick={handleClick}
                >
                  {t("stepComplete.continue")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
