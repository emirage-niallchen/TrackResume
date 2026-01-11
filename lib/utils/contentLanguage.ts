import type { ContentLanguage } from '@/lib/validations/contentLanguage';

/**
 * Convert any i18n language-like value to ContentLanguage.
 */
export function toContentLanguage(value?: string | null): ContentLanguage {
  if (!value) return 'zh';
  return value.toLowerCase().startsWith('en') ? 'en' : 'zh';
}

/**
 * Append/override `language` query param on a relative/absolute URL.
 */
export function withContentLanguageParam(url: string, language: ContentLanguage): string {
  const fullUrl = url.startsWith('http') ? url : `http://localhost${url}`;
  const parsed = new URL(fullUrl);
  parsed.searchParams.set('language', language);

  return url.startsWith('http')
    ? parsed.toString()
    : `${parsed.pathname}${parsed.search}${parsed.hash}`;
}


