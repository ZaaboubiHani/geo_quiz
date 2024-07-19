import React, { createContext, useState, useEffect } from 'react';
export const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') ?? 'ar');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language',lang);
  };

  return <LanguageContext.Provider value={{language,changeLanguage}}>
    {children}
  </LanguageContext.Provider>;
};

export default LanguageProvider;
