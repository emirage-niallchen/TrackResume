import { SectionConfig } from '@/lib/types';

export const layoutConfig: SectionConfig = {
  colors: {
    background: 'bg-gray-50 dark:bg-gray-900',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border-gray-200 dark:border-gray-700'
  },
  layout: {
    maxWidth: 'max-w-4xl',
    spacing: 'space-y-8'
  }
};

export const getLayoutConfig = () => {
  return layoutConfig;
}; 