import TotalAmount from "@commercelayer/react-components/orders/TotalAmount"
import type { FC } from "react"
import { useTranslation } from "react-i18next"

interface Props {
  orderNumber: string
}

export const MainHeader: FC<Props> = ({ orderNumber }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-row border-t mb-5 px-5 pt-5 -mx-5 md:px-0 md:-mx-0 md:mb-0 md:border-t-0 md:border-b md:pt-0 justify-between md:items-center pb-2">
      {/* Recap */}
      <div className="flex flex-col flex-1 justify-between md:items-center md:flex-row">
        <h1 className="text-black font-semibold text-xl md:text-3xl">
          {t("general.checkoutTitle")}
        </h1>
        <p className="font-semibold text-sm md:text-base text-gray-400">
          #{orderNumber}
        </p>
      </div>
      {/* Total */}
      <div className="font-bold text-xl md:hidden">
        <TotalAmount />
      </div>
    </div>
  )
}
