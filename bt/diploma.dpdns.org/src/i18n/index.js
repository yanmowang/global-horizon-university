import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import enMainTranslation from './locales/en.json';
import zhMainTranslation from './locales/zh.json';

// 准备翻译对象
let enTranslation = { ...enMainTranslation };
let zhTranslation = { ...zhMainTranslation };

// Optionally import translations from nested directories
try {
  // These might not exist or might be empty, which is fine
  const enNestedTranslation = require('./locales/en/translation.json');
  const zhNestedTranslation = require('./locales/zh/translation.json');
  
  // Merge nested translations with main translations if they exist
  if (enNestedTranslation) {
    enTranslation = { ...enTranslation, ...enNestedTranslation };
  }
  
  if (zhNestedTranslation) {
    zhTranslation = { ...zhTranslation, ...zhNestedTranslation };
  }
} catch (error) {
  console.log('No nested translations found, using main translation files only');
}

// 添加额外的调试日志
const missingKeyHandler = (lng, ns, key) => {
  console.warn(`[i18n] Missing translation key: "${key}" in language: ${lng}, namespace: ${ns}`);
  return key; // 返回键名本身作为后备
};

i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false, // 不转义
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      zh: {
        translation: zhTranslation,
      },
    },
    saveMissing: true,
    missingKeyHandler: missingKeyHandler,
    // Configure LanguageDetector
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language', // Key to use in localStorage
    },
    react: {
      useSuspense: false, // This ensures translations are loaded before rendering
      wait: true
    }
  });

// This is important for debugging
if (process.env.NODE_ENV === 'development') {
  window.i18n = i18n; // Expose i18n to browser console for debugging
}

// 确保默认语言设置正确
// const savedLanguage = localStorage.getItem('language');
// if (savedLanguage && ['zh', 'en'].includes(savedLanguage)) {
//   i18n.changeLanguage(savedLanguage);
// } else {
//   // 默认使用中文
//   i18n.changeLanguage('zh');
//   localStorage.setItem('language', 'zh');
// }

export default i18n;
