import { ErrorContainer } from "components/composite/ErrorContainer"
import { ErrorCode, Text } from "components/composite/ErrorContainer/styled"
import type { NextPage } from "next"
import { useTranslation } from "react-i18next"

const Invalid: NextPage<{ errorCode?: 404 | 419; message?: string }> = ({
  errorCode = 404,
  message = "general.invalid",
}) => {
  const { t } = useTranslation()

  return (
    <ErrorContainer>
      <ErrorCode>{errorCode}</ErrorCode>
      <Text data-testid="invalid-checkout">
        {message === "general.invalid" ? t(message) : message}
      </Text>
    </ErrorContainer>
  )
}

export default Invalid
