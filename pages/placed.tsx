import "twin.macro"
import { NextPage } from "next"
import Head from "next/head"
import { useTranslation } from "react-i18next"
import { createGlobalStyle, ThemeProvider } from "styled-components"

import { StepComplete } from "components/composite/StepComplete"
import { Footer } from "components/ui/Footer"

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

  const settings = {
    logoUrl:
      "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
    favicon: "/favicon.png",
    primaryColor: "#000000",
    contrastColor: "#ffffff",
    companyName: "Test company",
    supportEmail: "test@extendi.it",
    supportPhone: "+39 055 7311348",
  }

  return (
    <div>
      <Head>
        <title>{t("general.title")}</title>
        <link rel="icon" href={settings.favicon} />
      </Head>

      <GlobalCssStyle
        primaryColor={settings.primaryColor}
        contrastColor={settings.contrastColor}
      />

      <ThemeProvider
        theme={{
          colors: {
            primary: settings.primaryColor,
            contrast: settings.contrastColor,
          },
        }}
      >
        <StepComplete
          logoUrl={settings.logoUrl}
          companyName={settings.companyName}
          supportEmail={settings.supportEmail}
          supportPhone={settings.supportPhone}
        />
      </ThemeProvider>
    </div>
  )
}

export default Home
