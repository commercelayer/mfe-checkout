import { NextPage } from "next"
import "twin.macro"
import Head from "next/head"
import { useContext } from "react"

import { OrderSummary } from "components/composite/OrderSummary"
import { StepCustomer } from "components/composite/StepCustomer"
import { StepNav } from "components/composite/StepNav"
import { StepShipping } from "components/composite/StepShipping"
import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { useActiveStep } from "components/hooks/useActiveStep"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Logo } from "components/ui/Logo"
import { SpinnerLoader } from "components/ui/SpinnerLoader"

const STEPS = ["Customer", "Shipping Method", "Payment"]

const Home: NextPage<CheckoutPageContextProps> = ({ logoUrl, companyName }) => {
  const ctx = useContext(AppContext)
  // const isLoading = !ctx || (ctx && ctx.isLoading)
  const { t } = useTranslation()
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
      </Head>
      <LayoutDefault
        aside={
          <div>
            <Logo logoUrl={logoUrl} companyName={companyName} />
            <OrderSummary />
            <button
              tw="bg-blue-600 mt-2 text-white block px-3 rounded mt-10"
              onClick={() => {
                ctx && ctx.refetchOrder()
              }}
            >
              click to refetch order
            </button>
          </div>
        }
        main={
          <div>
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
            {activeStep === 2 && <div>Payment methods</div>}
          </div>
        }
      />
    </div>
  )
}

export default Home
