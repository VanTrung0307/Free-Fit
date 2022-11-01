import i18n from 'translation/i18n';
// ----------------------------------------------------------------------

export default function useLocales() {
  const langStorage = localStorage.getItem('language');

  const currentLang = langStorage || 'vi';

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return {
    onChangeLang: handleChangeLanguage,
    currentLang,
  };
}
