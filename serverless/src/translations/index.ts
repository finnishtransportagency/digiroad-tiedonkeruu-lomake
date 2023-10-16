import fi from './fi'
import sv from './sv'
export const SUPPORTED_LANGUAGES = ['fi', 'sv'] as const

export type Translations = {
  title: string
  reporter: string
  email: string
  project: string
  municipality: string
  opening_date: string
}

const t = (lang: (typeof SUPPORTED_LANGUAGES)[number]) => {
  const translations = {
    fi,
    sv,
  }

  return translations[lang]
}

export default t
