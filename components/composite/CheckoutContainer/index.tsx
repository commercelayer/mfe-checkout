import CommerceLayer from "@commercelayer/react-components/auth/CommerceLayer"
import { CheckoutHead } from "components/composite/CheckoutTitle"
import { AppProvider } from "components/data/AppProvider"
import GlobalStylesProvider from "components/data/GlobalStylesProvider"
import hex2hsl from "components/utils/hex2hsl"

interface Props {
  settings: CheckoutSettings
  brandColors: BrandColors
  children: JSX.Element[] | JSX.Element
}

const CheckoutContainer = ({
  settings,
  brandColors,
  children,
}: Props): JSX.Element => {
  const primaryColor = hex2hsl(brandColors.accent)

  return (
    <div>
      <CheckoutHead title={settings.companyName} favicon={settings.favicon} />
      <CommerceLayer
        accessToken={settings.accessToken}
        endpoint={settings.endpoint}
      >
        <GlobalStylesProvider
          primaryColor={primaryColor}
          brandDark={brandColors.dark}
          brandBase={brandColors.base}
        />

        <AppProvider
          orderId={settings.orderId}
          isGuest={settings.isGuest}
          isShipmentRequired={settings.isShipmentRequired}
          accessToken={settings.accessToken}
          slug={settings.slug}
          domain={settings.domain}
        >
          {children}
        </AppProvider>
      </CommerceLayer>
    </div>
  )
}

export default CheckoutContainer
