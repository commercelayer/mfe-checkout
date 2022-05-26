import { CommerceLayer } from "@commercelayer/react-components"

import { CheckoutHead } from "components/composite/CheckoutTitle"
import { AppProvider } from "components/data/AppProvider"
import GlobalStylesProvider from "components/data/GlobalStylesProvider"
import { GTMProvider } from "components/data/GTMProvider"
import { RollbarProvider } from "components/data/RollbarProvider"

interface Props {
  settings: CheckoutSettings
}

const CheckoutContainer: React.FC<Props> = ({ settings, children }) => {
  return (
    <div>
      <CheckoutHead title={settings.companyName} favicon={settings.favicon} />
      <RollbarProvider>
        <CommerceLayer
          accessToken={settings.accessToken}
          endpoint={settings.endpoint}
        >
          <GlobalStylesProvider primaryColor={settings.primaryColor} />

          <AppProvider
            orderId={settings.orderId}
            accessToken={settings.accessToken}
            slug={settings.slug}
            domain={settings.domain}
          >
            <GTMProvider gtmId={settings.gtmId}>{children}</GTMProvider>
          </AppProvider>
        </CommerceLayer>
      </RollbarProvider>
    </div>
  )
}

export default CheckoutContainer
