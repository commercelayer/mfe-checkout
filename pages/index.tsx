import { NextPage } from "next"
import "twin.macro"
import Head from "next/head"
import { useContext, useState, useEffect } from "react"

import { OrderRecap } from "components/composite/OrderRecap"
import { StepCustomer } from "components/composite/StepCustomer"
import { StepNav } from "components/composite/StepNav"
import { StepShipping } from "components/composite/StepShipping"
import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Logo } from "components/ui/Logo"
import { SpinnerLoader } from "components/ui/SpinnerLoader"

const STEPS = ["Customer Email", "Address", "Shipping Method", "Payment"]

const Home: NextPage<CheckoutPageContextProps> = ({ logoUrl, companyName }) => {
  const ctx = useContext(AppContext)
  const isLoading = !ctx || (ctx && ctx.isLoading)
  const { t } = useTranslation()

  const [activeStep, setActiveStep] = useState(0)
  const [lastCompletedStep, setLastCompletedStep] = useState(0)

  useEffect(() => {
    if (ctx) {
      const canSelectShippingAddress = ctx.hasEmailAddress
      const canSelectShippingMethod = ctx.hasShippingAddress
      const canSelectPayment = ctx.hasShippingAddress && ctx.hasShippingMethod
      const canPlaceOrder =
        ctx.hasShippingAddress && ctx.hasShippingMethod && ctx.hasPaymentMethod

      if (canPlaceOrder) {
        setActiveStep(3)
        setLastCompletedStep(3)
      } else if (canSelectPayment) {
        setActiveStep(3)
        setLastCompletedStep(3)
      } else if (canSelectShippingMethod) {
        setActiveStep(2)
        setLastCompletedStep(2)
      } else if (canSelectShippingAddress) {
        setActiveStep(1)
        setLastCompletedStep(1)
      } else {
        setActiveStep(0)
        setLastCompletedStep(0)
      }
    }
  }, [ctx])

  if (!ctx) {
    return null
  }

  return (
    <div>
      <Head>
        <title>{t("general.title")}</title>
      </Head>
      {isLoading && <SpinnerLoader />}
      <LayoutDefault
        aside={
          <div>
            <Logo logoUrl={logoUrl} companyName={companyName} />
            <OrderRecap />
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
              lastCompleted={lastCompletedStep}
            />
            {activeStep === 0 && <div> CUSTOMER EMAIL </div>}
            {activeStep === 1 && <StepCustomer tw="mb-6" />}
            {activeStep === 2 && <StepShipping tw="mb-6" />}
            {activeStep === 3 && <div>Payment methods</div>}
          </div>
        }
      />
    </div>
  )
}

export default Home
