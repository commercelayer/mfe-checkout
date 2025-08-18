import CustomerInput from "@commercelayer/react-components/customers/CustomerInput"
import Errors from "@commercelayer/react-components/errors/Errors"
import classNames from "classnames"
import { ErrorCss } from "components/ui/form/Error"
import { InputCss } from "components/ui/form/Input"
import { Label } from "components/ui/form/Label"
import type { FC } from "react"
import { useTranslation } from "react-i18next"

interface Props {
  readonly?: boolean
  setCustomerEmail?: (email: string) => void
  emailAddress: NullableType<string>
}

export const AddressSectionEmail: React.FC<Props> = ({
  readonly,
  setCustomerEmail,
  emailAddress,
}) => {
  const { t } = useTranslation()

  const messages: Parameters<typeof Errors>[0]["messages"] = [
    {
      code: "EMPTY_ERROR",
      resource: "orders",
      field: "customer_email",
      message: t("input.cantBlank"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "orders",
      field: "customer_email",
      message: t("input.mustBeValidEmail"),
    },
  ]
  const saveEmail = (email: string) => {
    if (setCustomerEmail) {
      setCustomerEmail(email)
    }
  }

  return (
    <Wrapper>
      <div className="relative">
        {readonly ? (
          <ReadOnlyEmail data-testid="current-customer-email">
            {emailAddress}
          </ReadOnlyEmail>
        ) : (
          <>
            <StyledCustomInput
              className="block w-full border-gray-300 form-input shadow-xs focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              data-testid="customer_email"
              errorClassName="hasError"
              saveOnBlur={true}
              // @ts-expect-error: No compatible type in CustomerInput
              onBlur={saveEmail}
              value={emailAddress ?? ""}
            />
            <StyledErrors
              data-testid="customer_email_error"
              resource="orders"
              field="customer_email"
              messages={messages}
            />
          </>
        )}
        <Label htmlFor="customer_email">
          {t("addressForm.customer_email")}
        </Label>
      </div>
    </Wrapper>
  )
}

const Wrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className="mt-6 mb-2" />
)

const ReadOnlyEmail: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={classNames(InputCss, "w-full inline-block bg-gray-50")}
  />
)

const StyledCustomInput: FC<React.ComponentProps<typeof CustomerInput>> = ({
  className,
  errorClassName,
  ...props
}) => {
  return (
    <CustomerInput
      {...props}
      errorClassName={errorClassName}
      className={classNames(InputCss, className)}
    />
  )
}

const StyledErrors: FC<React.ComponentProps<typeof Errors>> = (props) => (
  <Errors {...props} className={`${ErrorCss} mt-1`} />
)
