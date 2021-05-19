import "twin.macro"
import { CommerceLayer, OrderContainer } from "@commercelayer/react-components"
import { NextPage } from "next"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import { createGlobalStyle } from "styled-components"

import { Checkout } from "components/composite/Checkout"
import { AppProvider } from "components/data/AppProvider"
import { GTMProvider } from "components/data/GTMProvider"
import { RollbarProvider } from "components/data/RollbarProvider"
import { useSettingsOrInvalid } from "components/hooks/useSettingsOrInvalid"
import { SpinnerLoader } from "components/ui/SpinnerLoader"

interface GlobalStyleProps {
  primary: HSLProps
  contrast: HSLProps
}
const GlobalCssStyle = createGlobalStyle<GlobalStyleProps>`
  :root {
    --primary-h: ${({ primary }) => primary.h};
    --primary-s: ${({ primary }) => primary.s};
    --primary-l: ${({ primary }) => primary.l};
    --contrast-h: ${({ contrast }) => contrast.h};
    --contrast-s: ${({ contrast }) => contrast.s};
    --contrast-l: ${({ contrast }) => contrast.l};
    --primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
    --primary-light: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.1);
    --primary-dark: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) * 0.5));
    --contrast: hsl(var(--contrast-h), var(--contrast-s), var(--contrast-l));
  }
`

const Home: NextPage = () => {
  const { t } = useTranslation()

  const { settings, isLoading } = useSettingsOrInvalid()

  if (isLoading) return <SpinnerLoader />
  if (!settings) return <></>

  return (
    <div>
      <Head>
        <title>{t("general.title")}</title>
        <link rel="icon" href={settings.favicon} />
      </Head>
      <RollbarProvider>
        <CommerceLayer
          accessToken={settings.accessToken}
          endpoint={settings.endpoint}
        >
          <GlobalCssStyle
            primary={settings.primaryColor}
            contrast={settings.contrastColor}
          />
          <OrderContainer orderId={settings.orderId}>
            <AppProvider
              orderId={settings.orderId}
              accessToken={settings.accessToken}
              endpoint={settings.endpoint}
            >
              <GTMProvider gtmId={settings.gtmId}>
                <Checkout
                  logoUrl={settings.logoUrl}
                  orderNumber={settings.orderNumber}
                  companyName={settings.companyName}
                  supportEmail={settings.supportEmail}
                  supportPhone={settings.supportPhone}
                />
              </GTMProvider>
            </AppProvider>
          </OrderContainer>
        </CommerceLayer>
      </RollbarProvider>
    </div>
  )
}

export default Home
