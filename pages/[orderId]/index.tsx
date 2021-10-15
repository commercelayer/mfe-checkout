import { NextPage } from "next"
import dynamic from "next/dynamic"

import CheckoutSkeleton from "components/composite/CheckoutSkeleton"
import { useSettingsOrInvalid } from "components/hooks/useSettingsOrInvalid"

const DynamicCheckoutContainer = dynamic(
  () => import("components/composite/CheckoutContainer"),
  {
    loading: function LoadingSkeleton() {
      return <CheckoutSkeleton />
    },
  }
)
const DynamicCheckout = dynamic(() => import("components/composite/Checkout"), {
  loading: function LoadingSkeleton() {
    return <CheckoutSkeleton />
  },
})

CheckoutSkeleton.displayName = "Skeleton Loader"
const Home: NextPage = () => {
  const { settings, isLoading } = useSettingsOrInvalid()

  if (isLoading || !settings) return <CheckoutSkeleton />

  return (
    <DynamicCheckoutContainer settings={settings}>
      <DynamicCheckout
        logoUrl={settings.logoUrl}
        orderNumber={settings.orderNumber}
        companyName={settings.companyName}
        supportEmail={settings.supportEmail}
        supportPhone={settings.supportPhone}
        termsUrl={settings.termsUrl}
        privacyUrl={settings.privacyUrl}
      />
    </DynamicCheckoutContainer>
  )
}

export default Home
