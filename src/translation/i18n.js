/* eslint-disable prettier/prettier */
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
// eslint-disable-next-line import/extensions
import translationEN from 'locales/en/translation';
// eslint-disable-next-line import/extensions
import translationVI from 'locales/vi/translation';
// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};
const lg = localStorage.getItem('language');
let defaultLg = 'vi';
if (lg) {
  defaultLg = lg;
}
i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLg,
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
