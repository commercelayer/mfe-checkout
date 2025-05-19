// eslint-disable-next-line import/order
import { useTranslation } from "next-i18next"

import { CartLinkWrapper, LinkWrapper } from "./styled"

interface Props {
  cartUrl: NullableType<string>
}

export const ReturnToCart = ({ cartUrl }: Props) => {
  const { t } = useTranslation()

  if (!cartUrl) return <></>

  return (
    <CartLinkWrapper data-testid="edit-cart-link">
      <a href={cartUrl}>
        <LinkWrapper>
          <>&lt;</> {t("orderRecap.returnToCart")}
        </LinkWrapper>
      </a>
    </CartLinkWrapper>
  )
}
