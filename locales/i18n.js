import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import numeral from 'numeral';

import Cookies from 'utils/Cookies';

import id from './id';
import en from './en';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  id,
  en,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: Cookies.getData('locale') || 'id',
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

// load a locale
if (numeral.locales.id === undefined) {
  numeral.register('locale', 'id', {
    delimiters: {
      thousands: '.',
      decimal: ',',
    },
    abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't',
    },
    currency: {
      symbol: 'Rp',
    },
  });
}

// switch between locales
numeral.locale('id');

export default i18n;
