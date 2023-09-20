import { useTranslation } from "next-i18next"

import { ErrorContainer } from "components/composite/ErrorContainer"
import { ErrorCode, Text } from "components/composite/ErrorContainer/styled"

export const RetryError = () => {
  const { t } = useTranslation()

  return (
    <ErrorContainer>
      <ErrorCode>{t("general.retry_error_code")}</ErrorCode>
      <Text data-testid="invalid-checkout">
        {t("general.retry_error_description")}
      </Text>
    </ErrorContainer>
  )
}
