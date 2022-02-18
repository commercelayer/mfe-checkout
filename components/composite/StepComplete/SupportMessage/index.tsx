import { Trans } from "react-i18next"

interface Props {
  supportPhone?: string
  supportEmail?: string
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
    <Trans
      i18nKey={setI18nKey()}
      values={{ email: supportEmail, phone: supportPhone }}
      components={{
        WrapperStyle: (
          <strong className="text-black border-b border-gray-300 cursor-pointer" />
        ),
        WrapperEmail: <a href={`mailto:${supportEmail}`} />,
        WrapperPhone: (
          <a href={`tel:${supportPhone && supportPhone.replace(/\s+/g, "")}`} />
        ),
      }}
    />
  )
}
