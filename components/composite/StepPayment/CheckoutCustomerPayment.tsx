import { PaymentMethod, PaymentSource } from "@commercelayer/react-components"
import { CustomerSaveToWalletProps } from "@commercelayer/react-components/dist/components/PaymentSource"
import { MouseEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "twin.macro"

import { Label } from "components/ui/Label"

import { PaymentDetails } from "./PaymentDetails"
import { PaymentSkeleton } from "./PaymentSkeleton"
import { PaymentSummaryList } from "./PaymentSummaryList"
import {
  PaymentWrapper,
  PaymentSourceContainer,
  PaymentDetailsWrapper,
  WalletCheckbox,
} from "./styled"

interface Props {
  refetchOrder: () => Promise<void>
}

export const CheckoutCustomerPayment: React.FC<Props> = ({ refetchOrder }) => {
  const { t } = useTranslation()
  const TemplateCustomerCards = ({
    customerPayments,
    PaymentSourceProvider,
  }: any) => {
    const components = customerPayments.map((p, k) => {
      return (
        <SwiperSlide
          data-cy="customer-card"
          key={k}
          onClick={p.handleClick}
          className="p-3 ml-2 text-sm bg-red-100 border cursor-pointer hover:border-blue-500"
        >
          <PaymentSourceProvider value={{ ...p.card }}>
            <PaymentDetails />
          </PaymentSourceProvider>
        </SwiperSlide>
      )
    })
    return (
      <Swiper
        slidesPerView={2}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
      >
        {components}
      </Swiper>
    )
  }

  const TemplateSaveToWalletCheckbox = ({
    name,
  }: CustomerSaveToWalletProps) => {
    const [checked, setChecked] = useState(false)
    const handleClick = (
      e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>
    ) => e?.stopPropagation()
    const handleChange = () => {
      setChecked(!checked)
    }

    return (
      <div className="flex items-center mt-4">
        <WalletCheckbox
          name={name}
          id={name}
          data-cy="save-to-wallet"
          type="checkbox"
          className="form-checkbox"
          checked={checked}
          onClick={handleClick}
          onChange={handleChange}
        />
        <Label
          htmlFor={name}
          dataCy="payment-save-wallet"
          textLabel={t("stepPayment.saveToWallet")}
        />
      </div>
    )
  }

  return (
    <>
      <PaymentMethod
        activeClass="active"
        className="payment"
        loader={PaymentSkeleton}
        clickableContainer
        onClick={refetchOrder}
      >
        <PaymentWrapper>
          <PaymentSummaryList />
          <PaymentSourceContainer data-cy="payment-source">
            <PaymentSource
              className="flex flex-col"
              templateCustomerCards={(props) => (
                <TemplateCustomerCards {...props} />
              )}
              templateCustomerSaveToWallet={(props) => (
                <TemplateSaveToWalletCheckbox {...props} />
              )}
              loader={PaymentSkeleton}
            >
              <PaymentDetailsWrapper>
                <PaymentDetails hasEditButton />
              </PaymentDetailsWrapper>
            </PaymentSource>
          </PaymentSourceContainer>
        </PaymentWrapper>
      </PaymentMethod>
    </>
  )
}
