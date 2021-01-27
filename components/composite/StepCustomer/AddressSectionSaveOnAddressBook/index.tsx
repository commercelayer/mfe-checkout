import { AddressInput } from "@commercelayer/react-components"
import styled from "styled-components"
import tw from "twin.macro"

import { useTranslation } from "components/data/i18n"

interface Props {
  addressType: "billing" | "shipping"
}

export const AddressSectionSaveOnAddressBook: React.FC<Props> = ({
  addressType,
}) => {
  const { t } = useTranslation()

  const fieldName =
    addressType === "billing"
      ? "billing_address_save_to_customer_book"
      : "shipping_address_save_to_customer_book"
  const dataCy =
    addressType === "billing"
      ? "billing_address_save_to_customer_address_book"
      : "shipping_address_save_to_customer_address_book"

  return (
    <Wrapper>
      <AddressInput
        data-cy={dataCy}
        name={fieldName}
        type="checkbox"
        tw="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 align-middle mr-3"
        required={false}
      />
      {t("stepCustomer.saveAddressBook")}
    </Wrapper>
  )
}

const Wrapper = styled.label`
  ${tw`mb-4 text-sm text-gray-500 leading-6 cursor-pointer items-center flex`}
`
