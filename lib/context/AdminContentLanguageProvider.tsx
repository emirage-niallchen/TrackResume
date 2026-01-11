'use client';

import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import type { ContentLanguage } from '@/lib/validations/contentLanguage';

const storageKey = 'admin_content_language';

type AdminContentLanguageContextValue = {
  language: ContentLanguage;
  setLanguage: (language: ContentLanguage) => void;
  withLanguage: (url: string) => string;
};

const AdminContentLanguageContext = createContext<AdminContentLanguageContextValue | null>(
  null
);

function withLanguageParam(url: string, language: ContentLanguage) {
  const fullUrl = url.startsWith('http') ? url : `http://localhost${url}`;
  const parsed = new URL(fullUrl);
  parsed.searchParams.set('language', language);
  return url.startsWith('http')
    ? parsed.toString()
    : `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function useAdminContentLanguage() {
  const value = useContext(AdminContentLanguageContext);
  if (!value) {
    throw new Error('useAdminContentLanguage must be used within AdminContentLanguageProvider');
  }
  return value;
}

type AdminContentLanguageProviderProps = {
  children: React.ReactNode;
};

const AdminContentLanguageProvider = ({ children }: AdminContentLanguageProviderProps) => {
  const [language, setLanguageState] = useState<ContentLanguage>('zh');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === 'zh' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLanguage = useCallback((next: ContentLanguage) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // ignore storage errors
    }
  }, []);

  const withLanguage = useCallback(
    (url: string) => withLanguageParam(url, language),
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, withLanguage }),
    [language, setLanguage, withLanguage]
  );

  return (
    <AdminContentLanguageContext.Provider value={value}>
      {children}
    </AdminContentLanguageContext.Provider>
  );
};

AdminContentLanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(AdminContentLanguageProvider);


