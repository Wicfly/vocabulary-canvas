// Language Context for i18n
import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext({})

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Load from localStorage or default to 'en'
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language')
      return saved || 'en'
    }
    return 'en'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en')
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

