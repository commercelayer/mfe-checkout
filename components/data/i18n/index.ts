import i18n from "i18next"
import translationEN from "public/static/locales/en/common.json"
import translationIT from "public/static/locales/it/common.json"
import { initReactI18next } from "react-i18next"

const languages = ["en", "it"]

const resources = {
  en: {
    translation: translationEN,
  },
  it: {
    translation: translationIT,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: languages[0],
  fallbackLng: languages,
})

export default i18n
