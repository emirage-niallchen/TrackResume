import { ResumeData, SectionConfig } from '@/lib/types';
import dynamic from 'next/dynamic';
import { layoutConfig } from './config';

// 组件映射表
const COMPONENTS: Record<string, React.ComponentType<any>> = {
  profile: dynamic(() => import('./sections/Profile')),
  projects: dynamic(() => import('./sections/Projects')),
  techs: dynamic(() => import('./sections/Techs')),
  customFields: dynamic(() => import('./sections/CustomFields')),
};

// 扩展布局配置
export const config: SectionConfig = {
  ...layoutConfig,
  layout: {
    maxWidth: 'max-w-4xl',
    spacing: 'space-y-8'
  }
};

interface LayoutProps {
  data: ResumeData[];
}

export default function Layout({ data }: LayoutProps) {
  // 过滤启用的部分并按order排序
  const enabledSections = data
    .filter(section => section.isEnabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={`${config.colors.background} min-h-screen`}>
      <main className={`${config.layout.maxWidth} mx-auto px-4 py-8 ${config.layout.spacing}`}>
        {enabledSections.map((section) => {
          const Component = COMPONENTS[section.name];
          if (!Component) {
            console.warn(`未找到组件: ${section.name}`);
            return null;
          }

          return (
            <Component
              key={section.name}
              data={section.data}
              config={config}
            />
          );
        })}
      </main>
    </div>
  );
} 