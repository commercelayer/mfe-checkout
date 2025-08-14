import CheckoutSkeleton from "components/composite/CheckoutSkeleton"
import { RetryError } from "components/composite/RetryError"
import { useSettingsOrInvalid } from "components/hooks/useSettingsOrInvalid"
import { get } from "http"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { getPartnerSettings } from "utils/getPartnerSettings"
import {
  DEFAULT_PARTNER_SETTINGS,
  mapPartnerSettingsWithDefaults,
} from "utils/mapPartnerSettingsWithDefaults"

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
  const [partnerTheme, setPartnerTheme] = useState<PartnerSettings>({
    ...DEFAULT_PARTNER_SETTINGS,
  })
  const [isLoadingPartner, setIsLoadingPartner] = useState(true)

  useEffect(() => {
    if (settings?.validCheckout) {
      getPartnerSettings(settings.partnerId).then((partnerSettings) => {
        console.log("Fetched partner settings:", partnerSettings)
        const mappedSettings = mapPartnerSettingsWithDefaults(partnerSettings)
        setPartnerTheme(mappedSettings)
        setIsLoadingPartner(false)
      })
    } else {
      console.warn("Invalid checkout settings, skipping partner theme fetch.")
      console.info("Using default settings for partner theme.")
      setIsLoadingPartner(false)
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
    <DynamicCheckoutContainer
      settings={settings}
      brandColors={partnerTheme.brandColors}
    >
      <DynamicCheckout
        logoUrl={settings.logoUrl}
        headerLogo={partnerTheme?.headerLogo}
        primaryColor={
          partnerTheme?.brandColors?.accent || settings.primaryColor
        }
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
