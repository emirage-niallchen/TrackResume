'use client';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { toContentLanguage, withContentLanguageParam } from '@/lib/utils';
import { HeroSection } from "@/components/sections/hero-section";
import { ResumeTimeline } from "@/components/sections/resume-timeline";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { ContactSection } from "@/components/sections/contact-section";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { FooterSection } from "@/components/sections/footer-section";
import LanguageToggle from '@/components/common/LanguageToggle';



// 获取简历分段数据
const fetcher = (url: string) => fetch(url).then(res => res.json());

// 构建查询字符串的简化函数
const buildQuery = (param: string, value: string | string[] | undefined | null) => {
  if (!value) return '';
  if (Array.isArray(value)) return `?${value.map(v => `${param}=${v}`).join('&')}`;
  return `?${param}=${value}`;
};

// 页面导航项定义
interface NavItem {
  id: string;
  title: string;
}

// 页面导航组件
const PageNavigation = ({ items }: { items: NavItem[] }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-36 top-1/3 transform -translate-y-1/2 z-10">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id}>
            <button 
              onClick={() => scrollToSection(item.id)}
              className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const tags = searchParams.get('tags') || undefined;
  const language = toContentLanguage(i18n.resolvedLanguage);
  
  // 使用SWR分别获取各个部分的数据
  const { data: profileData, error: profileError } = useSWR(
    withContentLanguageParam(`/api/profile`, language),
    fetcher
  );

  
  const { data: projectsData, error: projectsError } = useSWR(
    withContentLanguageParam(`/api/projects${buildQuery('tags', tags)}`, language),
    fetcher
  );

  
  const { data: techsData, error: techsError } = useSWR(
    withContentLanguageParam(`/api/techs${buildQuery('tags', tags)}`, language),
    fetcher
  );
  
  const { data: customFieldsData, error: customFieldsError } = useSWR(
    withContentLanguageParam(`/api/custom-fields${buildQuery('tags', tags)}`, language),
    fetcher
  );
  
  const { data: resumesData, error: resumesError } = useSWR(
    withContentLanguageParam(`/api/resumes${buildQuery('tags', tags)}`, language),
    fetcher
  );
  
  const { data: filesData, error: filesError } = useSWR(
    withContentLanguageParam(`/api/files${buildQuery('tags', tags)}`, language),
    fetcher
  );
  
  // 导航项配置
  const navItems: NavItem[] = [
    { id: 'hero-section', title: t('home.nav.basic') },
    { id: 'resume-timeline', title: t('home.nav.timeline') },
    { id: 'projects-showcase', title: t('home.nav.projects') },
    { id: 'tech-stack', title: t('home.nav.tech') },
    { id: 'contact-section', title: t('home.nav.contact') },
  ];
  

  return (
    <main className="min-h-screen flex flex-col">
      <LanguageToggle />
      {/* 页面导航 */}
      <PageNavigation items={navItems} />
      
      {/* 基础信息展示区域 */}
      {profileData?.admin ? (
        <div id="hero-section">
          <HeroSection adminData={profileData.admin} customFields={profileData.customFields} files={filesData || []}/>
        </div>
      ) : profileError ? (
        <div className="text-center py-8">{t('home.error.profileFetchFailed')}</div>
      ) : (
        <SectionSkeleton height="300px" />
      )}
      
      {/* 依次渲染所有区块 */}
      <div className="container mx-auto px-4 py-8 flex-grow">
       
        {/* 简历时间线 */}
        {resumesData ? (
          <div id="resume-timeline">
            <ResumeTimeline resumes={resumesData} />
          </div>
        ) : (
          <SectionSkeleton height="200px" />
        )}

        {/* 项目展示 */}
        {projectsData ? (
          <div id="projects-showcase">
            <ProjectsShowcase projects={projectsData} />
          </div>
        ) : (
          <SectionSkeleton height="200px" />
        )}

        {/* 技术栈 */}
        {techsData ? (
          <div id="tech-stack">
            <TechStackGrid techs={techsData} />
          </div>
        ) : (
          <SectionSkeleton height="200px" />
        )}

        {/* 联系方式 */}
        <div id="contact-section">
          <ContactSection />
        </div>

      </div>

      {/* 添加页脚 */}
      <FooterSection />
    </main>
  );
} 