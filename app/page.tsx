'use client';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { HeroSection } from "@/components/sections/hero-section";
import { ResumeTimeline } from "@/components/sections/resume-timeline";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { ContactSection } from "@/components/sections/contact-section";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { FooterSection } from "@/components/sections/footer-section";



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
  const searchParams = useSearchParams();
  const tags = searchParams.get('tags') || undefined;
  
  // 使用SWR分别获取各个部分的数据
  const { data: profileData, error: profileError } = useSWR(
    `/api/profile`, 
    fetcher
  );

  
  const { data: projectsData, error: projectsError } = useSWR(
    `/api/projects${buildQuery('tags', tags)}`, 
    fetcher
  );

  
  const { data: techsData, error: techsError } = useSWR(
    `/api/techs${buildQuery('tags', tags)}`,
    fetcher
  );
  
  const { data: customFieldsData, error: customFieldsError } = useSWR(
    `/api/custom-fields${buildQuery('tags', tags)}`,
    fetcher
  );
  
  const { data: resumesData, error: resumesError } = useSWR(
    `/api/resumes${buildQuery('tags', tags)}`, 
    fetcher
  );
  
  const { data: filesData, error: filesError } = useSWR(
    `/api/files${buildQuery('tags', tags)}`, 
    fetcher
  );
  
  // 导航项配置
  const navItems: NavItem[] = [
    { id: 'hero-section', title: '个人信息' },
    { id: 'resume-timeline', title: '简历时间线' },
    { id: 'projects-showcase', title: '项目展示' },
    { id: 'tech-stack', title: '技术栈' },
    { id: 'contact-section', title: '联系方式' },
  ];
  

  return (
    <main className="min-h-screen flex flex-col">
      {/* 页面导航 */}
      <PageNavigation items={navItems} />
      
      {/* 个人信息展示区域 */}
      {profileData ? (
        <div id="hero-section">
          <HeroSection adminData={profileData.admin} customFields={profileData.customFields} files={filesData || []}/>
        </div>
      ) : profileError ? (
        <div className="text-center py-8">获取个人信息失败</div>
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