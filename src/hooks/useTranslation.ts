import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { TFunction } from 'i18next';

export const useTranslation = () => {
  const { t, i18n } = useTranslationOriginal();

  // Helper function to get nested translations
  const translate = (key: string, options?: any): string => t(key, options) as string;

  // Helper function to change language
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  return {
    t: translate,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language
  };
};
