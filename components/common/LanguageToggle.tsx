'use client';

import { memo } from 'react';
import PropTypes from 'prop-types';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { setStoredLanguage, type SupportedLanguage } from '@/lib/i18n';

interface LanguageToggleProps {
  className?: string;
  fixed?: boolean;
}

/**
 * Language toggle button (ZH/EN) for public pages.
 */
const LanguageToggle = ({ className, fixed = true }: LanguageToggleProps) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const currentLang = i18n.resolvedLanguage === 'en' ? 'en' : 'zh';
    const nextLang: SupportedLanguage = currentLang === 'en' ? 'zh' : 'en';
    setStoredLanguage(nextLang);
    await i18n.changeLanguage(nextLang);
  };

  return (
    <div
      className={cn(
        fixed ? 'fixed right-6 top-6 z-50' : undefined,
        className
      )}
    >
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={toggleLanguage}
        aria-label={t('common.action.toggleLang')}
      >
        <Languages className="h-4 w-4" />
        {i18n.resolvedLanguage === 'en'
          ? t('common.lang.zh')
          : t('common.lang.enShort')}
      </Button>
    </div>
  );
};

LanguageToggle.propTypes = {
  className: PropTypes.string,
  fixed: PropTypes.bool,
};

export default memo(LanguageToggle);


