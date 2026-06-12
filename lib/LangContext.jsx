'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext({ lang: 'en', setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    const saved = typeof localStorage !== 'undefined' && localStorage.getItem('lang');
    if (saved === 'th') setLangState('th');
  }, []);

  function setLang(l) {
    setLangState(l);
    if (typeof localStorage !== 'undefined') localStorage.setItem('lang', l);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('lang-th', l === 'th');
      document.documentElement.lang = l === 'th' ? 'th' : 'en';
    }
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
