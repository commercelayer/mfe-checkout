import { useContext } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { MainHeader } from "components/composite/MainHeader"
import { OrderSummary } from "components/composite/OrderSummary"
import { StepComplete } from "components/composite/StepComplete"
import {
  StepCustomer,
  StepHeaderCustomer,
} from "components/composite/StepCustomer"
import { StepNav } from "components/composite/StepNav"
import {
  StepPayment,
  StepHeaderPayment,
} from "components/composite/StepPayment"
import StepPlaceOrder from "components/composite/StepPlaceOrder"
import {
  StepShipping,
  StepHeaderShipping,
} from "components/composite/StepShipping"
import { AppContext } from "components/data/AppProvider"
import { useActiveStep } from "components/hooks/useActiveStep"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Accordion, AccordionItem } from "components/ui/Accordion"
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

const Checkout: React.FC<Props> = ({
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

  const renderComplete = () => {
    return (
      <StepComplete
        logoUrl={logoUrl}
        companyName={companyName}
        supportEmail={supportEmail}
        supportPhone={supportPhone}
        termsUrl={termsUrl}
        privacyUrl={privacyUrl}
        orderNumber={orderNumber}
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
            <Accordion>
              <AccordionItem
                index={1}
                isActive={activeStep === "Customer"}
                onToggleActive={() => setActiveStep("Customer")}
                header={
                  <StepHeaderCustomer
                    isActive={activeStep === "Customer"}
                    step={1}
                  />
                }
              >
                <StepCustomer
                  tw="mb-6"
                  isActive={activeStep === "Customer"}
                  onToggleActive={() => setActiveStep("Customer")}
                  step={1}
                />
              </AccordionItem>
              <AccordionItem
                index={2}
                isActive={activeStep === "Shipping"}
                onToggleActive={() => setActiveStep("Shipping")}
                header={
                  <StepHeaderShipping
                    isActive={activeStep === "Shipping"}
                    step={2}
                  />
                }
              >
                <StepShipping
                  tw="mb-6"
                  isActive={activeStep === "Shipping"}
                  onToggleActive={() => setActiveStep("Shipping")}
                  step={2}
                />
              </AccordionItem>
              <AccordionItem
                index={2}
                isActive={activeStep === "Payment"}
                onToggleActive={() => setActiveStep("Payment")}
                header={
                  <StepHeaderPayment
                    isActive={activeStep === "Payment"}
                    step={3}
                  />
                }
              >
                <StepPayment tw="mb-6" isActive={activeStep === "Payment"} />
              </AccordionItem>
            </Accordion>
            <StepPlaceOrder termsUrl={termsUrl} />
          </div>
        }
      />
    )
  }

  return ctx.isComplete ? renderComplete() : renderSteps()
}

const Sidebar = styled.div`
  ${tw`flex flex-col min-h-full p-5 lg:pl-20 lg:pr-10 lg:pt-10 xl:pl-48 bg-gray-100`}
`
const SummaryWrapper = styled.div`
  ${tw`flex-1`}
`
export default Checkout
