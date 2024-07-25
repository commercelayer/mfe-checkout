import TotalAmount from "@commercelayer/react-components/orders/TotalAmount"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  orderNumber: string
}

export const MainHeader: React.FC<Props> = ({ orderNumber }) => {
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

const Wrapper = styled.div`
  ${tw`flex flex-row border-t mb-5 px-5 pt-5 -mx-5 md:px-0 md:-mx-0 md:mb-0 md:border-t-0 md:border-b md:pt-0 justify-between md:items-center pb-2`}
`
const Title = styled.h1`
  ${tw`text-black font-semibold text-xl md:text-3xl`}
`
const Order = styled.p`
  ${tw`font-semibold text-sm md:text-base text-gray-400`}
`
const Total = styled.div`
  ${tw`font-bold text-xl md:hidden`}
`
const Recap = styled.div`
  ${tw`flex flex-col flex-1 justify-between md:items-center md:flex-row`}
`
