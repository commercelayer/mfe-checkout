import TotalAmount from "@commercelayer/react-components/orders/TotalAmount"
import type { FC } from "react"
import { useTranslation } from "react-i18next"

interface Props {
  orderNumber: string
}

export const MainHeader: FC<Props> = ({ orderNumber }) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Recap>
        <Title>{t("general.checkoutTitle")}</Title>
        <Order>#{orderNumber}</Order>
      </Recap>
      <Total>
        <TotalAmount />
      </Total>
    </Wrapper>
  )
}

const Wrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className="flex flex-row border-t mb-5 px-5 pt-5 -mx-5 md:px-0 md:-mx-0 md:mb-0 md:border-t-0 md:border-b md:pt-0 justify-between md:items-center pb-2"
  />
)

const Title: FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h1 {...props} className="text-black font-semibold text-xl md:text-3xl" />
)

const Order: FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => (
  <p {...props} className="font-semibold text-sm md:text-base text-gray-400" />
)

const Total: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className="font-bold text-xl md:hidden" />
)

const Recap: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className="flex flex-col flex-1 justify-between md:items-center md:flex-row"
  />
)
