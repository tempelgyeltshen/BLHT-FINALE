import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, translateText } from '../data/translations';

export interface Language {
  code: string;
  name: string;
  native: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'dz', name: 'Dzongkha', native: 'རྫོང་ཁ' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'zh', name: 'Chinese', native: '中文' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (langCode: string) => void;
  languages: Language[];
  t: (key: string, fallback?: string) => string;
  translateText: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(() => {
    const savedCode = localStorage.getItem('bhutan_app_lang');
    if (savedCode) {
      const found = SUPPORTED_LANGUAGES.find(l => l.code === savedCode || l.name.toLowerCase() === savedCode.toLowerCase());
      if (found) return found;
    }
    return SUPPORTED_LANGUAGES[0]; // English default
  });

  const setLanguage = (langCode: string) => {
    const found = SUPPORTED_LANGUAGES.find(
      l => l.code === langCode || l.name.toLowerCase() === langCode.toLowerCase()
    );
    if (found) {
      const isDifferent = found.code !== currentLanguage.code;
      setCurrentLanguageState(found);
      localStorage.setItem('bhutan_app_lang', found.code);
      document.documentElement.setAttribute('lang', found.code);
      if (isDifferent) {
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', currentLanguage.code);
  }, [currentLanguage.code]);

  // Translate helper function
  const t = (key: string, fallback?: string): string => {
    const langCode = currentLanguage.code;
    if (TRANSLATIONS[langCode] && TRANSLATIONS[langCode][key]) {
      return TRANSLATIONS[langCode][key];
    }
    // Fallback to English dictionary
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
      return TRANSLATIONS['en'][key];
    }
    return translateText(fallback || key, langCode);
  };

  const boundTranslateText = (text: string) => translateText(text, currentLanguage.code);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages: SUPPORTED_LANGUAGES, t, translateText: boundTranslateText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
