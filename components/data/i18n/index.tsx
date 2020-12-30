import NextI18Next from "next-i18next"

const NextI18NextIntance = new NextI18Next({
  defaultLanguage: "en",
  otherLanguages: ["it"],
  defaultNS: "common",
  localePath: "public/static/locales",
})

export const { appWithTranslation, useTranslation, i18n } = NextI18NextIntance

export default NextI18NextIntance
