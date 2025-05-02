import React, { createContext, useContext } from 'react';
import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { TFunction } from 'i18next';

interface TranslationContextType {
  t: (key: string, options?: any) => string;
  changeLanguage: (lng: string) => Promise<TFunction>;
  currentLanguage: string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslationOriginal();

  const translate = (key: string, options?: any): string => t(key, options) as string;

  const value = {
    t: translate,
    changeLanguage: i18n.changeLanguage,
    currentLanguage: i18n.language
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useAppTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useAppTranslation must be used within a TranslationProvider');
  }
  return context;
};
