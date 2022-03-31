import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";

import translationsAr from "./locales/ar/translationsAr.json";
import translationsEn from "./locales/en/translationsEn.json";

// Translations
const resources = {
	ar: {
		translation: translationsAr,
	},
	en: {
		translation: translationsEn,
	},
};

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		keySeparator: false,
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	});

export default i18n;
