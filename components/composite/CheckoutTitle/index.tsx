import Head from "next/head"
import { useTranslation } from "react-i18next"

interface Props {
  title: string
  favicon: string
}

export const CheckoutHead: React.FC<Props> = (props) => {
  const { t } = useTranslation()

  return (
    <Head>
      <title>{t("general.title", { companyName: props.title })}</title>
      <link rel="icon" type="image/x-icon" href={props.favicon} />
    </Head>
  )
}
