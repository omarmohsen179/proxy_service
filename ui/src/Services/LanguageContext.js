import React, { createContext, useState } from "react";
import i18next from "i18next";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  let [language, setLanguage] = useState(i18next.language);
  let changeLanguage = (lang) => {
    setLanguage(lang);
  };
  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
