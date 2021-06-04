import { NextPage } from "next"
import dynamic from "next/dynamic"

import { useSettingsOrInvalid } from "components/hooks/useSettingsOrInvalid"

const DynamicSpinnerLoader = dynamic(
  () => import("components/ui/SpinnerLoader")
)
const DynamicCheckoutContainer = dynamic(
  () => import("components/composite/CheckoutContainer")
)
const DynamicCheckout = dynamic(() => import("components/composite/Checkout"))

const Home: NextPage = () => {
  const { settings, isLoading } = useSettingsOrInvalid()

  if (isLoading) return <DynamicSpinnerLoader />
  if (!settings) return <></>

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
