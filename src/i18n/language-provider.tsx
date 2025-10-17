"use client";

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import de from './de.json';
import hi from './hi.json';
import ur from './ur.json';

type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ur';

const translations = { en, es, fr, de, hi, ur };

type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: string) => void;
  t: (key: keyof Translations, replacements?: Record<string, string | number>) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Language;
    if (Object.keys(translations).includes(browserLang)) {
      setLanguageState(browserLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (Object.keys(translations).includes(lang)) {
        setLanguageState(lang as Language);
        document.documentElement.lang = lang;
    }
  };

  const t = (key: keyof Translations, replacements?: Record<string, string | number>) => {
    let translation = translations[language][key] || translations.en[key];

    if (typeof translation === 'string' && replacements) {
        Object.keys(replacements).forEach(placeholder => {
            const regex = new RegExp(`{{${placeholder}}}`, 'g');
            translation = translation.replace(regex, String(replacements[placeholder]));
        });
    }

    return translation;
  };
  
  const value = useMemo(() => ({ language, setLanguage, t }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
