import React, { useState, useEffect } from 'react';
import {
  SupportedLanguage,
  translations,
  LanguageContext,
} from '../services/i18n';

interface LanguageProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'mediinfo_user_lang';

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
      // Check browser language
      if (navigator.language && navigator.language.toLowerCase().startsWith('hi')) {
        return 'hi';
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const nextLang: SupportedLanguage = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
