import { useTranslation } from "next-i18next"

interface Props {
  cartUrl: NullableType<string>
}

export const ReturnToCart = ({ cartUrl }: Props) => {
  const { t } = useTranslation()

  if (!cartUrl) return <></>

  return (
    <div
      className="flex flex-row justify-between mt-7 pt-6 border-t"
      data-testid="edit-cart-link"
    >
      <a href={cartUrl} className="text-xs font-bold border-b">
        <>&lt;</> {t("orderRecap.returnToCart")}
      </a>
    </div>
  )
}
