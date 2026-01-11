'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toContentLanguage, withContentLanguageParam } from '@/lib/utils';

interface WebsiteMetadata {
  websiteTitle: string;
  favicon: string;
}

export default function DynamicMetadata() {
  const { i18n } = useTranslation();
  const language = toContentLanguage(i18n.resolvedLanguage);

  useEffect(() => {
    const updatePageMetadata = async () => {
      try {
        console.log('Updating page metadata on client side');
        
        const url = withContentLanguageParam('/api/website-settings/metadata', language);
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch metadata');
        }
        
        const metadata: WebsiteMetadata = await response.json();
        
        // 更新页面标题
        if (metadata.websiteTitle) {
          document.title = metadata.websiteTitle;
          console.log('Page title updated:', metadata.websiteTitle);
        }
        
        // 更新favicon
        if (metadata.favicon && metadata.favicon !== '/favicon.svg') {
          const faviconElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
          const shortcutElement = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
          const appleElement = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
          
          if (faviconElement) {
            faviconElement.href = metadata.favicon;
          }
          if (shortcutElement) {
            shortcutElement.href = metadata.favicon;
          }
          if (appleElement) {
            appleElement.href = metadata.favicon;
          }
          
          console.log('Favicon updated');
        }
      } catch (error) {
        console.error('Failed to update metadata on client:', error);
      }
    };

    // 延迟执行，确保页面已加载
    const timer = setTimeout(updatePageMetadata, 100);
    
    // 添加页面可见性变化时的重新加载
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updatePageMetadata();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [language]);

  // 这个组件不渲染任何内容
  return null;
}
