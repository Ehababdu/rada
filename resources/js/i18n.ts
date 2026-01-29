import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';


const resources = {
  en: {
    common: enCommon,
    
  },
  ar: {
    common: arCommon,
        // martyrs: arMartyrs,
        // promotions: arPromotions,
  },
};

// Clear any cached language
localStorage.removeItem('i18nextLng');

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // Force Arabic
    fallbackLng: 'en',
    ns: ['common'], // Add other namespaces as needed
    defaultNS: 'common',
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Set document direction and language based on current language
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Set initial direction
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language;

console.log('i18n initialized with language:', i18n.language);
console.log('Available resources:', Object.keys(resources.ar));

export default i18n;