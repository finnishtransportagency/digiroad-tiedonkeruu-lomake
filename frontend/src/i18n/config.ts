import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import fi from './fi/translation'
import sv from './sv/translation'

export const defaultNS = 'fi'

export const resources = {
	fi,
	sv,
}

i18next
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			fi: {
				translation: fi,
			},
			sv: {
				translation: sv,
			},
		},
		fallbackLng: defaultNS,
		detection: {
			order: ['navigator'],
		},
		interpolation: {
			escapeValue: false,
		},
	})
	.catch((e) => {
		console.log('Error while setting up translations: ', e)
	})
