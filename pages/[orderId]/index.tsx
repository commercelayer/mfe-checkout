import "twin.macro"
import { CommerceLayer, OrderContainer } from "@commercelayer/react-components"
import { NextPage } from "next"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import { createGlobalStyle, ThemeProvider } from "styled-components"

import { Checkout } from "components/composite/Checkout"
import { AppProvider } from "components/data/AppProvider"
import { GTMProvider } from "components/data/GTMProvider"
import { RollbarProvider } from "components/data/RollbarProvider"
import { useSettingsOrInvalid } from "components/hooks/useSettingsOrInvalid"
import { SpinnerLoader } from "components/ui/SpinnerLoader"

interface GlobalStyleProps {
  // TO REMOVE
  primaryColor: string
  // TO REMOVE
  contrastColor: string
  primary: HSLProps
  contrast: HSLProps
}
const GlobalCssStyle = createGlobalStyle<GlobalStyleProps>`
  :root {
    --primary: ${({ primaryColor }) => primaryColor};
    --contrast: ${({ contrastColor }) => contrastColor};
    --primary-h: ${({ primary }) => primary.h};
    --primary-s: ${({ primary }) => primary.s};
    --primary-l: ${({ primary }) => primary.l};
    --contrast-h: ${({ contrast }) => contrast.h};
    --contrast-s: ${({ contrast }) => contrast.s};
    --contrast-l: ${({ contrast }) => contrast.l};
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
            primaryColor="#4CAF50"
            contrastColor="#FFFFFF"
            primary={settings.primaryColor}
            contrast={settings.contrastColor}
          />
          <OrderContainer orderId={settings.orderId}>
            <ThemeProvider
              theme={{
                colors: {
                  primary: settings.primaryColor,
                  contrast: settings.contrastColor,
                },
              }}
            >
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
            </ThemeProvider>
          </OrderContainer>
        </CommerceLayer>
      </RollbarProvider>
    </div>
  )
}

export default Home
