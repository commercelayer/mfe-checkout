import { NextPage } from "next"

import Checkout from "components/composite/Checkout"
import CheckoutContainer from "components/composite/CheckoutContainer"
import CheckoutSkeleton from "components/composite/CheckoutSkeleton"
import { useSettingsOrInvalid } from "components/hooks/useSettingsOrInvalid"

const Home: NextPage = () => {
  const { settings, isLoading } = useSettingsOrInvalid()

  if (isLoading || !settings) return <CheckoutSkeleton />

  return (
    <CheckoutContainer settings={settings}>
      <Checkout
        logoUrl={settings.logoUrl}
        orderNumber={settings.orderNumber}
        companyName={settings.companyName}
        supportEmail={settings.supportEmail}
        supportPhone={settings.supportPhone}
        termsUrl={settings.termsUrl}
        privacyUrl={settings.privacyUrl}
      />
    </CheckoutContainer>
  )
}

export default Home
