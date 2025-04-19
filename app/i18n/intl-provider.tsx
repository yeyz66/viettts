'use client';

import { IntlProvider } from 'next-intl';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { defaultLocale, Locale, locales } from './config';

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a I18nProvider');
  }
  return context;
}

const localeKey = 'ttl-locale';

// Define a recursive type for nested messages
type MessageValue = string | number | boolean | MessageObject | Array<MessageValue>;
type MessageObject = {
  [key: string]: MessageValue;
};

type IntlProviderProps = {
  children: ReactNode;
  messages: Record<Locale, MessageObject>;
};

export default function I18nProvider({ children, messages }: IntlProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const savedLocale = localStorage.getItem(localeKey) as Locale | null;
    if (savedLocale && locales.includes(savedLocale as Locale)) {
      setLocaleState(savedLocale as Locale);
    } else {
      const browserLocale = navigator.language.split('-')[0] as Locale;
      if (locales.includes(browserLocale)) {
        setLocaleState(browserLocale);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(localeKey, newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider 
        locale={locale} 
        messages={messages[locale]}
        timeZone="UTC"
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
} 