import { OrderSummary } from "components/composite/OrderSummary"
import { StepCustomer } from "components/composite/StepCustomer"
import { StepNav } from "components/composite/StepNav"
import { StepPayment } from "components/composite/StepPayment"
import { StepShipping } from "components/composite/StepShipping"
import { AppContext } from "components/data/AppProvider"
import { useActiveStep } from "components/hooks/useActiveStep"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Logo } from "components/ui/Logo"
import { SpinnerLoader } from "components/ui/SpinnerLoader"
import { NextPage } from "next"
import Head from "next/head"
import "twin.macro"
import { useContext } from "react"
import { useTranslation } from "react-i18next"

const Home: NextPage<CheckoutPageContextProps> = ({
  logoUrl,
  companyName,
  favicon,
}) => {
  const ctx = useContext(AppContext)

  const { t } = useTranslation()

  const {
    activeStep,
    lastActivableStep,
    setActiveStep,
    isLoading,
    steps,
  } = useActiveStep()

  if (!ctx || isLoading) {
    return <SpinnerLoader />
  }

  return (
    <div>
      <Head>
        <title>{t("general.title")}</title>
        <link rel="icon" href={favicon} />
      </Head>
      <LayoutDefault
        aside={
          <div>
            <Logo logoUrl={logoUrl} companyName={companyName} />
            <OrderSummary />
          </div>
        }
        main={
          <div tw="md:pl-7">
            <h1 tw="font-bold mb-4 text-lg">Checkout</h1>
            <StepNav
              steps={steps}
              activeStep={activeStep}
              onStepChange={setActiveStep}
              lastActivable={lastActivableStep}
            />
            <StepCustomer
              tw="mb-6"
              isActive={activeStep === "Customer"}
              onToggleActive={() => setActiveStep("Customer")}
            />
            <StepShipping
              tw="mb-6"
              isActive={activeStep === "Shipping"}
              onToggleActive={() => setActiveStep("Shipping")}
            />
            <StepPayment
              tw="mb-6"
              isActive={activeStep === "Payment"}
              onToggleActive={() => setActiveStep("Payment")}
            />
          </div>
        }
      />
    </div>
  )
}

export default Home
