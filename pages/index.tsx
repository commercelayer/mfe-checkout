import { NextPage } from "next"
import "twin.macro"
import Head from "next/head"
import { useContext } from "react"

import { OrderSummary } from "components/composite/OrderSummary"
import { StepCustomer } from "components/composite/StepCustomer"
import { StepNav } from "components/composite/StepNav"
import { StepPayment } from "components/composite/StepPayment"
import { StepShipping } from "components/composite/StepShipping"
import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { useActiveStep } from "components/hooks/useActiveStep"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Logo } from "components/ui/Logo"
import { SpinnerLoader } from "components/ui/SpinnerLoader"

const Home: NextPage<CheckoutPageContextProps> = ({
  logoUrl,
  companyName,
  favicon,
}) => {
  const ctx = useContext(AppContext)

  const { t } = useTranslation()

  const STEPS = [
    t("stepCustomer.customer"),
    t("stepShipping.delivery"),
    t("stepPayment.payment"),
  ]

  const {
    activeStep,
    lastActivableStep,
    setActiveStep,
    isLoading,
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
            <button
              tw="bg-primary text-contrast mt-2 block px-3 rounded mt-10"
              onClick={() => {
                ctx && ctx.refetchOrder()
              }}
            >
              click to refetch order
            </button>
          </div>
        }
        main={
          <div tw="md:pl-7">
            <h1 tw="font-bold mb-4 text-lg">Checkout</h1>
            <StepNav
              steps={STEPS}
              activeStep={activeStep}
              onStepChange={setActiveStep}
              lastActivable={lastActivableStep}
            />
            <StepCustomer
              tw="mb-6"
              isActive={activeStep === 0}
              onToggleActive={() => setActiveStep(0)}
            />
            <StepShipping
              tw="mb-6"
              isActive={activeStep === 1}
              onToggleActive={() => setActiveStep(1)}
            />
            <StepPayment
              tw="mb-6"
              isActive={activeStep === 2}
              onToggleActive={() => setActiveStep(2)}
            />
          </div>
        }
      />
    </div>
  )
}

export default Home
