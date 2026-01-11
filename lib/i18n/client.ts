'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from '@/lib/i18n/resources';

export const supportedLanguages = ['zh', 'en'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const isSupportedLanguage = (value: string): value is SupportedLanguage =>
  (supportedLanguages as readonly string[]).includes(value);

export const languageStorageKey = 'trackresume_lang';

export function getStoredLanguage(): SupportedLanguage | null {
  try {
    const value = window.localStorage.getItem(languageStorageKey);
    if (!value) return null;
    return isSupportedLanguage(value) ? value : null;
  } catch {
    return null;
  }
}

export function setStoredLanguage(lang: SupportedLanguage) {
  try {
    window.localStorage.setItem(languageStorageKey, lang);
  } catch {
    // ignore storage errors
  }
}

export function detectPreferredLanguage(): SupportedLanguage {
  const stored = getStoredLanguage();
  if (stored) return stored;

  const navLang = typeof navigator !== 'undefined' ? navigator.language : '';
  if (navLang.toLowerCase().startsWith('en')) return 'en';
  return 'zh';
}

function toTitleCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatMissingKey(key: string) {
  const last = key.split('.').pop() || key;
  return toTitleCase(last);
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    supportedLngs: supportedLanguages as unknown as string[],
    interpolation: {
      escapeValue: false,
    },
    parseMissingKeyHandler: (key) => {
      console.warn('i18n missing key:', key);
      return formatMissingKey(key);
    },
    react: {
      useSuspense: false,
    },
  });
}

export { i18n };


