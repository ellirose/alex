'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { dictionaries, type Dictionary } from './dictionaries';
import { LOCALES, type Locale } from './locales';

type I18nValue = { locale: Locale; t: Dictionary; setLocale: (next: Locale) => void };

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = 'ab-portfolio-locale';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'pt' || saved === 'es') setLocaleState(saved);
    } catch {
      /* storage unavailable: keep the default */
    }
  }, []);

  useEffect(() => {
    const meta = LOCALES.find((l) => l.code === locale);
    if (meta) document.documentElement.lang = meta.htmlLang;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      const root = document.documentElement;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setLocaleState(next);
        return;
      }
      // Soft cross-fade: dim the page, swap copy, bring it back.
      root.classList.add('lang-swap');
      window.setTimeout(() => {
        setLocaleState(next);
        window.setTimeout(() => root.classList.remove('lang-swap'), 60);
      }, 200);
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
