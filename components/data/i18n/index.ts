import NextI18Next from "next-i18next"

const defaultLanguage = "en"
const otherLanguages = ["it"]
const allLanguages = [defaultLanguage, ...otherLanguages]

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: defaultLanguage,
  otherLanguages: otherLanguages,
  defaultNS: "common",
  fallbackLng: allLanguages,
  localePath: "public/static/locales",
  strictMode: false,
  debug: true,
})

export const { appWithTranslation, useTranslation, Trans } = NextI18NextInstance

export function changeLanguage(languageCode: string) {
  return NextI18NextInstance.i18n.changeLanguage(
    allLanguages.includes(languageCode) ? languageCode : defaultLanguage
  )
}

export default NextI18NextInstance
