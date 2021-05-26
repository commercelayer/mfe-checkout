import { useContext } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { MainHeader } from "components/composite/MainHeader"
import { OrderSummary } from "components/composite/OrderSummary"
import { StepComplete } from "components/composite/StepComplete"
import { StepCustomer } from "components/composite/StepCustomer"
import { StepNav } from "components/composite/StepNav"
import { StepPayment } from "components/composite/StepPayment"
import { StepShipping } from "components/composite/StepShipping"
import { AppContext } from "components/data/AppProvider"
import { useActiveStep } from "components/hooks/useActiveStep"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Logo"
import { SpinnerLoader } from "components/ui/SpinnerLoader"

interface Props {
  logoUrl: string
  orderNumber: number
  companyName: string
  supportEmail: string
  supportPhone: string
  termsUrl: string
  privacyUrl: string
}

export const Checkout: React.FC<Props> = ({
  logoUrl,
  orderNumber,
  companyName,
  supportEmail,
  supportPhone,
  termsUrl,
  privacyUrl,
}) => {
  const ctx = useContext(AppContext)

  const {
    activeStep,
    lastActivableStep,
    setActiveStep,
    // isLoading,
    steps,
  } = useActiveStep()

  if (!ctx || ctx.isFirstLoading) {
    return <SpinnerLoader />
  }
  // console.log(ctx)
  // if (isLoading) {
  //   return <SpinnerLoader />
  // }

  const renderComplete = () => {
    return (
      <StepComplete
        logoUrl={logoUrl}
        companyName={companyName}
        supportEmail={supportEmail}
        supportPhone={supportPhone}
        termsUrl={termsUrl}
        privacyUrl={privacyUrl}
      />
    )
  }

  const renderSteps = () => {
    return (
      <LayoutDefault
        aside={
          <Sidebar>
            <Logo
              logoUrl={logoUrl}
              companyName={companyName}
              className="hidden md:block"
            />
            <SummaryWrapper>
              <OrderSummary />
            </SummaryWrapper>
            <Footer termsUrl={termsUrl} privacyUrl={privacyUrl} />
          </Sidebar>
        }
        main={
          <div>
            <Logo
              logoUrl={logoUrl}
              companyName={companyName}
              className="block md:hidden"
            />
            <MainHeader orderNumber={orderNumber} />
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
              isAcceptanceRequired={Boolean(termsUrl)}
            />
          </div>
        }
      />
    )
  }

  return ctx.isComplete ? renderComplete() : renderSteps()
}

const Sidebar = styled.div`
  ${tw`flex flex-col min-h-full p-5 lg:pl-10 lg:pr-10 lg:pt-10 xl:pl-20 bg-gray-100`}
`
const SummaryWrapper = styled.div`
  ${tw`flex-1`}
`
