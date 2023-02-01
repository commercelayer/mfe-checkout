import { useTranslation } from "react-i18next"

import { AddressSectionSaveOnAddressBook } from "../AddressSectionSaveOnAddressBook"

import { LinkButton } from "components/ui/LinkButton"

import { Wrapper } from "./styled"

interface Props {
  addressType: "billing" | "shipping"
  hasCustomerAddresses: boolean
  onClick?: () => void
  className?: string
}

export const AddressFormBottom: React.FC<Props> = ({
  addressType,
  hasCustomerAddresses,
  onClick,
  className,
}) => {
  const { t } = useTranslation()

  return (
    <Wrapper className={className}>
      <AddressSectionSaveOnAddressBook addressType={addressType} />
      {hasCustomerAddresses && (
        <LinkButton
          data-testid={`close-${addressType}-form`}
          label={t("stepCustomer.closeForm")}
          onClick={onClick}
        />
      )}
    </Wrapper>
  )
}
