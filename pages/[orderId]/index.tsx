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
import hex2hsl from "components/utils/hex2hsl"

interface GlobalStyleProps {
  primaryColor: string
  contrastColor: string
  primaryH?: number
  primaryS?: number
  primaryL?: number
  contrastH?: number
  contrastS?: number
  contrastL?: number
}
const GlobalCssStyle = createGlobalStyle<GlobalStyleProps>`
  :root {
    --primary: ${({ primaryColor }) => primaryColor};
    --contrast: ${({ contrastColor }) => contrastColor};
    --primary-h: ${({ primaryH }) => primaryH};
    --primary-s: ${({ primaryS }) => primaryS};
    --primary-l: ${({ primaryL }) => primaryL};
    --contrast-h: ${({ contrastH }) => contrastH};
    --contrast-s: ${({ contrastS }) => contrastS};
    --contrast-l: ${({ contrastL }) => contrastL};
  }
`

const Home: NextPage = () => {
  const { t } = useTranslation()

  const { settings, isLoading } = useSettingsOrInvalid()

  if (isLoading) return <SpinnerLoader />
  if (!settings) return <></>

  const primaryColor = hex2hsl(settings.primaryColor)
  const primaryH = primaryColor?.h
  const primaryS = primaryColor?.s
  const primaryL = primaryColor?.l
  const contrastColor = hex2hsl(settings.contrastColor)
  const contrastH = contrastColor?.h
  const contrastS = contrastColor?.s
  const contrastL = contrastColor?.l

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
            primaryColor={settings.primaryColor}
            contrastColor={settings.contrastColor}
            primaryH={primaryH}
            primaryS={primaryS}
            primaryL={primaryL}
            contrastH={contrastH}
            contrastS={contrastS}
            contrastL={contrastL}
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
