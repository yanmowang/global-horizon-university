import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../i18n';

// 创建语言上下文
const LanguageContext = createContext();

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  // Initialize state from i18n's detected language
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || (i18n.options.fallbackLng && i18n.options.fallbackLng[0]) || 'zh');
  // 添加一个重渲染标记，当语言改变时触发重渲染而不是刷新页面
  const [forceRender, setForceRender] = useState(0);

  // Update DOM and localStorage when currentLanguage state changes or on initial load
  useEffect(() => {
    // Ensure i18n instance reflects the context's language, though it should already if initialized correctly
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }

    try {
      localStorage.setItem('language', currentLanguage);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
    // Dispatch event for other components if needed, though direct context usage is preferred
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));

  }, [currentLanguage]);

  // Listen to i18next's languageChanged event to keep context in sync
  useEffect(() => {
    const handleI18nLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
    };
    i18n.on('languageChanged', handleI18nLanguageChanged);

    // Set initial document lang attribute based on i18n's language
    // This ensures it's set even before the first render's useEffect if i18n initializes faster
    const initialLang = i18n.language || (i18n.options.fallbackLng && i18n.options.fallbackLng[0]) || 'zh';
    document.documentElement.lang = initialLang === 'zh' ? 'zh-CN' : 'en';
    if (localStorage.getItem('language') !== initialLang) {
        localStorage.setItem('language', initialLang);
    }

    return () => {
      i18n.off('languageChanged', handleI18nLanguageChanged);
    };
  }, []);

  // Function to change language
  const changeLanguage = language => {
    if (!language || !['zh', 'en'].includes(language)) {
      console.warn(`Unsupported language: ${language}, defaulting to 'zh'.`);
      language = 'zh';
    }
    
    // Save the language preference
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
    
    // Change the language in i18n
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    
    // Set the language in state
    setCurrentLanguage(language);
    
    // 使用React的状态更新触发重渲染，而不是强制刷新页面
    // 这可以防止DOM操作中的"removeChild"错误
    setForceRender(prev => prev + 1);
  };

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = e => {
      if (e.key === 'language' && e.newValue && e.newValue !== currentLanguage) {
        // 使用更新状态的方式而不是直接调用changeLanguage
        setCurrentLanguage(e.newValue);
        if (i18n.language !== e.newValue) {
          i18n.changeLanguage(e.newValue);
        }
        setForceRender(prev => prev + 1);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentLanguage]); // Rerun if currentLanguage changes to avoid stale closure

  const value = {
    currentLanguage,
    changeLanguage,
    languages: ['zh', 'en'],
    forceRender, // 将重渲染标记添加到上下文中，可以供组件使用
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// 自定义钩子，让组件方便使用语言上下文
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
