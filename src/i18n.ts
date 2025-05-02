import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // load translation using http -> see /public/locales
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // Load both our app translations and apphelper translations
    backend: {
      loadPath: '/locales/{{lng}}.json?v=1',
    },

    // Load apphelper translations as a namespace
    ns: ['translations', 'apphelper'],
    defaultNS: 'translations',
  });

export default i18n;
