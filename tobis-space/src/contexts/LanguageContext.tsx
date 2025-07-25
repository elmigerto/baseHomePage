import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang } from '../i18n/translations'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function useTranslation() {
  const { lang } = useLanguage()
  return (key: string): string => {
    const parts = key.split('.')
    let value: any = translations[lang]
    for (const p of parts) {
      value = value?.[p]
    }
    return value ?? key
  }
}
