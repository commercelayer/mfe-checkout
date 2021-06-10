import "twin.macro"
import { CommerceLayer, OrderContainer } from "@commercelayer/react-components"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import { createGlobalStyle } from "styled-components"

import { AppProvider } from "components/data/AppProvider"
import { GTMProvider } from "components/data/GTMProvider"
import { RollbarProvider } from "components/data/RollbarProvider"

interface GlobalStyleProps {
  primary: HSLProps
}

const GlobalCssStyle = createGlobalStyle<GlobalStyleProps>`
  :root {
    --primary-h: ${({ primary }) => primary.h};
    --primary-s: ${({ primary }) => primary.s};
    --primary-l: ${({ primary }) => primary.l};
    --primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
    --primary-light: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.1);
    --primary-dark: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) * 0.5));
    --contrast-threshold: 50%;
    --switch: calc((var(--primary-l) - var(--contrast-threshold)) * -10000);
    --contrast: hsl(0, 0%, var(--switch));
  }
`

interface Props {
  settings: CheckoutSettings
}

const CheckoutContainer: React.FC<Props> = ({ settings, children }) => {
  const { t } = useTranslation()

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
          <GlobalCssStyle primary={settings.primaryColor} />
          <OrderContainer orderId={settings.orderId}>
            <AppProvider
              orderId={settings.orderId}
              accessToken={settings.accessToken}
              endpoint={settings.endpoint}
            >
              <GTMProvider gtmId={settings.gtmId}>{children}</GTMProvider>
            </AppProvider>
          </OrderContainer>
        </CommerceLayer>
      </RollbarProvider>
    </div>
  )
}

export default CheckoutContainer
