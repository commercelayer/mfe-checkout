import { NextPage } from "next"
import "twin.macro"
import Head from "next/head"
import { useContext } from "react"

import { OrderRecap } from "components/composite/OrderRecap"
import { StepCustomer } from "components/composite/StepCustomer"
import { StepShipping } from "components/composite/StepShipping"
import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { LayoutDefault } from "components/layouts/LayoutDefault"
import { Logo } from "components/ui/Logo"
import { SpinnerLoader } from "components/ui/SpinnerLoader"

const Home: NextPage<CheckoutPageContextProps> = ({ logoUrl, companyName }) => {
  const ctx = useContext(AppContext)
  const isLoading = !ctx || (ctx && ctx.isLoading)
  const { t } = useTranslation()

  return (
    <div>
      <Head>
        <title>{t("general.title")}</title>
      </Head>
      {isLoading && <SpinnerLoader />}
      <LayoutDefault
        aside={
          <div>
            <Logo logoUrl={logoUrl} companyName={companyName} />
            <OrderRecap />
            <button
              tw="bg-blue-600 mt-2 text-white block px-3 rounded mt-10"
              onClick={() => {
                ctx && ctx.refetchOrder()
              }}
            >
              click to refetch order
            </button>
          </div>
        }
        main={
          <div>
            <StepCustomer tw="mb-6" />
            <StepShipping tw="mb-6" />
          </div>
        }
      />
    </div>
  )
}

export default Home
