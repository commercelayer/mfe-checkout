import "twin.macro"
import { NextPage } from "next"
import { createGlobalStyle, ThemeProvider } from "styled-components"

import { CheckoutHead } from "components/composite/CheckoutTitle"
import { StepComplete } from "components/composite/StepComplete"

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
  const settings = {
    logoUrl:
      "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
    favicon: "/favicon.png",
    primaryColor: "#000000",
    contrastColor: "#ffffff",
    companyName: "Test company",
    supportEmail: "test@extendi.it",
    supportPhone: "+39 055 7311348",
    termsUrl: "https://terms",
    privacyUrl: "https://privacy",
    orderNumber: 123456,
  }

  return (
    <div>
      <CheckoutHead title={settings.companyName} favicon={settings.favicon} />

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
          orderNumber={settings.orderNumber}
        />
      </ThemeProvider>
    </div>
  )
}

export default Home
