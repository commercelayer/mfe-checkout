import { AddressInput } from "@commercelayer/react-components"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import { CheckCss } from "components/ui/form/CheckBox"
import { Label } from "components/ui/Label"

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
    <>
      <StyledAddressInput
        data-cy={dataCy}
        name={fieldName}
        id={fieldName}
        type="checkbox"
        required={false}
        className="form-checkbox"
      />
      <Label
        htmlFor={fieldName}
        dataCy={dataCy}
        textLabel={t("stepCustomer.saveAddressBook")}
      />
    </>
  )
}

const StyledAddressInput = styled(AddressInput)`
  ${CheckCss}
`
