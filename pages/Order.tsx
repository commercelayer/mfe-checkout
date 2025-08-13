import CheckoutSkeleton from "components/composite/CheckoutSkeleton"
import { RetryError } from "components/composite/RetryError"
import { useSettingsOrInvalid } from "components/hooks/useSettingsOrInvalid"
import { get } from "http"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { getPartnerSettings } from "utils/getPartnerSettings"

const DynamicCheckoutContainer = dynamic(
  () => import("components/composite/CheckoutContainer"),
  {
    loading: function LoadingSkeleton() {
      return <CheckoutSkeleton />
    },
  },
)
const DynamicCheckout = dynamic(() => import("components/composite/Checkout"), {
  loading: function LoadingSkeleton() {
    return <CheckoutSkeleton />
  },
})

CheckoutSkeleton.displayName = "Skeleton Loader"

const Order: NextPage = () => {
  const { settings, retryOnError, isLoading } = useSettingsOrInvalid()
  const [partnerTheme, setPartnerTheme] = useState<PartnerSettings | undefined>(
    undefined,
  )
  const [isLoadingPartner, setIsLoadingPartner] = useState(true)

  useEffect(() => {
    if (settings?.validCheckout) {
      getPartnerSettings(settings.partnerId).then((partnerSettings) => {
        console.log("Fetched partner settings:", partnerSettings)
        setPartnerTheme(partnerSettings)
        setIsLoadingPartner(false)
      })
    }
  }, [settings])

  if (isLoading || (!settings && !retryOnError) || isLoadingPartner)
    return <CheckoutSkeleton />

  if (!settings) {
    if (retryOnError) {
      return <RetryError />
    }
    return <RetryError />
  }

  return (
    <DynamicCheckoutContainer settings={settings}>
      <pre>{`${JSON.stringify(partnerTheme, null, 2) ?? "content not found"}`}</pre>
      <DynamicCheckout
        logoUrl={settings.logoUrl}
        headerLogo={partnerTheme?.headerLogo}
        primaryColor={settings.primaryColor}
        orderNumber={settings.orderNumber}
        companyName={settings.companyName}
        supportEmail={settings.supportEmail}
        supportPhone={settings.supportPhone}
        thankyouPageUrl={settings.config?.checkout?.thankyou_page}
        hideItemCodes={settings.config?.checkout?.hide_item_codes}
        termsUrl={settings.termsUrl}
        privacyUrl={settings.privacyUrl}
        gtmId={settings.gtmId}
      />
    </DynamicCheckoutContainer>
  )
}

export default Order
