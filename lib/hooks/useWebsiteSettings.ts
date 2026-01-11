import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toContentLanguage, withContentLanguageParam } from '@/lib/utils';

interface WebsiteSettings {
  websiteTitle: string;
  favicon: string;
}

export const useWebsiteSettings = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const language = toContentLanguage(i18n.resolvedLanguage);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Website settings: fetch');
        
        const url = withContentLanguageParam('/api/website-settings/metadata', language);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch website settings');
        }
        
        const data = await response.json();
        setSettings(data);
        console.log('Website settings: fetched');
      } catch (err) {
        console.error('Website settings: fetch failed', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // 设置默认值作为fallback
        setSettings({
          websiteTitle: 'Resume Portfolio',
          favicon: '/favicon.svg',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [language]);

  return { settings, loading, error };
};
