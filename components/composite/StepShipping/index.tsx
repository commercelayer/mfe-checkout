import {
  AddToCartButton,
  AvailabilityContainer,
  AvailabilityTemplate,
  ItemContainer,
  Price,
  PricesContainer,
  QuantitySelector,
  VariantsContainer,
  VariantSelector,
} from "@commercelayer/react-components"
import { useContext } from "react"

import "twin.macro"
import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

interface Props {
  className?: string
  isActive?: boolean
  onToggleActive: () => void
}

export const StepShipping: React.FC<Props> = ({
  className,
  isActive,
  onToggleActive,
}) => {
  const appCtx = useContext(AppContext)
  const { t } = useTranslation()

  if (!appCtx || !appCtx.hasShippingAddress) {
    return null
  }

  const { hasShippingMethod } = appCtx

  return (
    <div className={className}>
      <StepHeader
        stepNumber={2}
        status={isActive ? "edit" : "done"}
        label={t("stepShipping.delivery")}
        info={
          isActive
            ? t("stepShipping.summary")
            : "Metodo di spedizione selezionato"
        }
        onEditRequest={() => {
          onToggleActive()
        }}
      />
      <StepContent>
        {isActive ? (
          <VariantSelector
            className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
            name="selector-us"
            options={[
              {
                label: "6 months",
                code: "BABYONBU000000E63E746MXX",
              },
              {
                label: "12 months",
                code: "BABYONBU000000E63E7412MX",
              },
              {
                label: "24 months",
                code: "BABYONBU000000E63E746MXXFAKE",
              },
            ]}
          />
        ) : hasShippingMethod ? (
          <div>
            {/* {t("stepShipping.shippingMethod")} */}
            <ItemContainer>
              <PricesContainer>
                <Price skuCode="BABYONBU000000E63E746MXX" />
              </PricesContainer>
              <VariantsContainer>
                <VariantSelector
                  placeholder="Select a size"
                  options={[
                    {
                      label: "6 months",
                      code: "BABYONBU000000E63E746MXX",
                      lineItem: {
                        name: "your-item-name",
                        imageUrl:
                          "https://img.yourdomain.com/your-item-image.png",
                      },
                    },
                  ]}
                />
              </VariantsContainer>
              <QuantitySelector />
              <AddToCartButton />
              <AvailabilityContainer>
                <AvailabilityTemplate />
              </AvailabilityContainer>
            </ItemContainer>
          </div>
        ) : (
          <div>-</div>
        )}
      </StepContent>
    </div>
  )
}
