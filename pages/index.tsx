import "twin.macro"
import { CommerceLayer, OrderContainer } from "@commercelayer/react-components"
import { NextPage } from "next"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import { createGlobalStyle, ThemeProvider } from "styled-components"

import { Checkout } from "components/composite/Checkout"
import { AppProvider } from "components/data/AppProvider"
import { GTMProvider } from "components/data/GTMProvider"
import { useOrderOrInvalid } from "components/hooks/useOrderOrInvalid"
import { SpinnerLoader } from "components/ui/SpinnerLoader"

interface GlobalStyleProps {
  primaryColor: string
  contrastColor: string
}
const GlobalCssStyle = createGlobalStyle<GlobalStyleProps>`
  :root {
    --primary: ${({ primaryColor }) => primaryColor};
    --contrast: ${({ contrastColor }) => contrastColor};
  }
`

const Home: NextPage = () => {
  const { t } = useTranslation()

  const { data, isLoading } = useOrderOrInvalid()

  if (isLoading) return <SpinnerLoader />
  if (!data) return <></>

  return (
    <div>
      <Head>
        <title>{t("general.title")}</title>
        <link rel="icon" href={data.favicon} />
      </Head>
      <CommerceLayer accessToken={data.accessToken} endpoint={data.endpoint}>
        <GlobalCssStyle
          primaryColor={data.primaryColor}
          contrastColor={data.contrastColor}
        />
        <OrderContainer orderId={data.orderId}>
          <ThemeProvider
            theme={{
              colors: {
                primary: data.primaryColor,
                contrast: data.contrastColor,
              },
            }}
          >
            <AppProvider orderId={data.orderId} accessToken={data.accessToken}>
              <GTMProvider gtmId={data.gtmId}>
                <Checkout
                  logoUrl={data.logoUrl}
                  companyName={data.companyName}
                  supportEmail={data.supportEmail}
                  supportPhone={data.supportPhone}
                />
              </GTMProvider>
            </AppProvider>
          </ThemeProvider>
        </OrderContainer>
      </CommerceLayer>
    </div>
  )
}

export default Home
