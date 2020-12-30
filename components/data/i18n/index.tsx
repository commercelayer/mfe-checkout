import NextI18Next from "next-i18next"

const NextI18NextIntance = new NextI18Next({
  defaultLanguage: "en",
  otherLanguages: ["it"],
  defaultNS: "common",
  fallbackLng: "en",
  localePath: "public/static/locales",
})

export const { appWithTranslation, useTranslation } = NextI18NextIntance

export function changeLanguage(languageCode: string) {
  const languagesCode = ["it", "en"]
  if (languagesCode.includes(languageCode)) return languageCode
  return "en"
}

export default NextI18NextIntance
