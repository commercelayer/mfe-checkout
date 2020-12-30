import NextI18Next from "next-i18next"

const defaultLanguage = "en"
const otherLanguages = ["it"]
const allLanguages = [defaultLanguage, ...otherLanguages]

const NextI18NextIntance = new NextI18Next({
  defaultLanguage: defaultLanguage,
  otherLanguages: otherLanguages,
  defaultNS: "common",
  fallbackLng: defaultLanguage,
  localePath: "public/static/locales",
})

export const { appWithTranslation, useTranslation } = NextI18NextIntance

export function changeLanguage(languageCode: string) {
  if (allLanguages.includes(languageCode)) return languageCode
  return defaultLanguage
}

export default NextI18NextIntance
