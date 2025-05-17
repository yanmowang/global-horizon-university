import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <div className="relative">
      <select
        className="appearance-none bg-white border border-gray-300 text-gray-800 py-1 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer text-sm shadow-sm"
        style={{ color: '#111827 !important', backgroundColor: 'white !important' }}
        value={currentLanguage}
        onChange={e => changeLanguage(e.target.value)}
        aria-label="Select language"
      >
        {languages.map(language => (
          <option key={language} value={language}>
            {t(`language.${language}`)}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
