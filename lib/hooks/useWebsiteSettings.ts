import { useState, useEffect } from 'react';

interface WebsiteSettings {
  websiteTitle: string;
  favicon: string;
}

export const useWebsiteSettings = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching website settings for component');
        
        const response = await fetch('/api/website-settings/metadata');
        if (!response.ok) {
          throw new Error('Failed to fetch website settings');
        }
        
        const data = await response.json();
        setSettings(data);
        console.log('Website settings fetched successfully');
      } catch (err) {
        console.error('Failed to fetch website settings:', err);
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
  }, []);

  return { settings, loading, error };
};
