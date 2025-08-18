import { Trans } from "react-i18next"

interface Props {
  supportPhone: NullableType<string>
  supportEmail: NullableType<string>
}

export const SupportMessage: React.FC<Props> = ({
  supportPhone,
  supportEmail,
}) => {
  const setI18nKey = () => {
    if (supportPhone && supportEmail) {
      return "stepComplete.fullSupport"
    }
    if (!supportPhone && supportEmail) {
      return "stepComplete.supportEmail"
    }
    if (supportPhone && !supportEmail) {
      return "stepComplete.supportPhone"
    }
  }

  if (!supportPhone && !supportEmail) {
    return <></>
  }

  return (
    <div className="my-8 text-gray-400 [&>br]:hidden [&>br]:md:block [&+div]:mt-0">
      <Trans
        i18nKey={setI18nKey()}
        values={{ email: supportEmail, phone: supportPhone }}
        components={{
          WrapperStyle: (
            <strong className="text-black border-b border-gray-300 cursor-pointer" />
          ),
          WrapperEmail: (
            <a
              data-testid="support-email-link"
              href={`mailto:${supportEmail}`}
            />
          ),
          WrapperPhone: (
            <a
              data-testid="support-phone-link"
              href={`tel:${supportPhone?.replace(/\s+/g, "")}`}
            />
          ),
        }}
      />
    </div>
  )
}
