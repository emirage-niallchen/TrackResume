import { z } from 'zod';
import type { NextRequest } from 'next/server';

export const contentLanguageSchema = z.enum(['zh', 'en']);
export type ContentLanguage = z.infer<typeof contentLanguageSchema>;

export function getContentLanguageFromRequest(
  request: Request | NextRequest,
  fallback: ContentLanguage = 'zh'
): ContentLanguage {
  try {
    const url = new URL(request.url);
    const fromQuery = url.searchParams.get('language') ?? url.searchParams.get('lang');
    if (fromQuery) {
      const parsed = contentLanguageSchema.safeParse(fromQuery);
      if (parsed.success) return parsed.data;
    }
  } catch {
    // ignore url parse errors
  }

  try {
    const fromHeader = request.headers.get('x-content-language');
    if (fromHeader) {
      const parsed = contentLanguageSchema.safeParse(fromHeader);
      if (parsed.success) return parsed.data;
    }
  } catch {
    // ignore header errors
  }

  return fallback;
}


