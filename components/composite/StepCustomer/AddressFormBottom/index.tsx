import { LinkButton } from "components/ui/LinkButton"
import { useTranslation } from "react-i18next"
import { AddressSectionSaveOnAddressBook } from "../AddressSectionSaveOnAddressBook"

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
    <div
      className={`flex flex-col-reverse justify-between md:flex-row ${className}`}
    >
      <AddressSectionSaveOnAddressBook addressType={addressType} />
      {hasCustomerAddresses && (
        <LinkButton
          data-testid={`close-${addressType}-form`}
          label={t("stepCustomer.closeForm")}
          onClick={onClick}
        />
      )}
    </div>
  )
}
