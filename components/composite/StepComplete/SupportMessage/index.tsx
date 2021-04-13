import { Trans } from "react-i18next"
import "twin.macro"

interface Props {
  supportPhone?: string
  supportEmail?: string
}

export const SupportMessage: React.FC<Props> = ({
  supportPhone,
  supportEmail,
}) => {
  const handleEmail = () => {
    return window.open(`mailto:${supportEmail}`)
  }

  const handlePhone = () => {
    return window.open(`tel:${supportEmail}`)
  }

  if (supportPhone && supportEmail) {
    return (
      <Trans
        i18nKey={"stepComplete.fullSupport"}
        values={{ email: supportEmail, phone: supportPhone }}
        components={{
          WrapperEmail: <strong tw="cursor-pointer" onClick={handleEmail} />,
          WrapperPhone: <strong tw="cursor-pointer" onClick={handlePhone} />,
        }}
      />
    )
  }

  if (!supportPhone && supportEmail) {
    return (
      <Trans
        i18nKey={"stepComplete.supportEmail"}
        values={{ email: supportEmail }}
        components={{
          WrapperEmail: <strong tw="cursor-pointer" onClick={handleEmail} />,
        }}
      />
    )
  }

  if (supportPhone && !supportEmail) {
    return (
      <Trans
        i18nKey={"stepComplete.supportPhone"}
        values={{ phone: supportPhone }}
        components={{
          WrapperPhone: <strong tw="cursor-pointer" onClick={handlePhone} />,
        }}
      />
    )
  }

  return <></>
}
