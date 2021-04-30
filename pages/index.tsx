import { CommerceLayer, OrderContainer } from "@commercelayer/react-components"
import { Checkout } from "components/composite/Checkout"
import { AppProvider } from "components/data/AppProvider"
import { GTMProvider } from "components/data/GTMProvider"
import { SpinnerLoader } from "components/ui/SpinnerLoader"
import { NextPage } from "next"
import Head from "next/head"
import "twin.macro"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { createGlobalStyle, ThemeProvider } from "styled-components"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

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
  const router = useRouter()

  const { t } = useTranslation()

  const { data, error } = useSWR(
    router.isReady ? `/api/settings${router.asPath}` : null,
    fetcher
  )

  if (!data && !error) {
    return <SpinnerLoader />
  }

  if (error) {
    router.push("/invalid")
  }

  if (data && !data.validCheckout) {
    router.push("/invalid")
  }

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
                <Checkout {...(data as CheckoutSettings)} />
              </GTMProvider>
            </AppProvider>
          </ThemeProvider>
        </OrderContainer>
      </CommerceLayer>
    </div>
  )
}

export default Home
