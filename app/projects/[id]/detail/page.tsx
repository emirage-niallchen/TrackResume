"use client";

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Card, CardContent } from "@/components/ui/card";
import { Components } from 'react-markdown';
import { markdownStyles } from '@/lib/styles/markdown';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  jobRole?: string;
  jobTech?: string;
  startTime?: Date;
  endTime?: Date;
  description: string;
  images: { id: string; path: string; alt?: string }[];
  links: { id: string; label: string; url: string }[];
  tags: { tag: { id: string; name: string; color: string } }[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}/detail`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '获取详情失败');
        }

        setProject(data.project);
        setContent(data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">{error || '项目不存在'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const components: Components = {
    code({ className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <SyntaxHighlighter
          style={vscDarkPlus as any}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }) => <h1 className={markdownStyles.prose.h1}>{children}</h1>,
    h2: ({ children }) => <h2 className={markdownStyles.prose.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={markdownStyles.prose.h3}>{children}</h3>,
    h4: ({ children }) => <h4 className={markdownStyles.prose.h4}>{children}</h4>,
    h5: ({ children }) => <h5 className={markdownStyles.prose.h5}>{children}</h5>,
    h6: ({ children }) => <h6 className={markdownStyles.prose.h6}>{children}</h6>,
    p: ({ children }) => <p className={markdownStyles.prose.p}>{children}</p>,
    a: ({ href, children }) => <a href={href} className={markdownStyles.prose.a}>{children}</a>,
    blockquote: ({ children }) => <blockquote className={markdownStyles.prose.blockquote}>{children}</blockquote>,
    ul: ({ children }) => <ul className={markdownStyles.prose.ul}>{children}</ul>,
    ol: ({ children }) => <ol className={markdownStyles.prose.ol}>{children}</ol>,
    li: ({ children }) => <li className={markdownStyles.prose.li}>{children}</li>,
    pre: ({ children }) => <pre className={markdownStyles.prose.pre}>{children}</pre>,
    table: ({ children }) => <table className={markdownStyles.prose.table}>{children}</table>,
    th: ({ children }) => <th className={markdownStyles.prose.th}>{children}</th>,
    td: ({ children }) => <td className={markdownStyles.prose.td}>{children}</td>,
    img: ({ src, alt }) => <img src={src} alt={alt} className={markdownStyles.prose.img} />,
    hr: () => <hr className={markdownStyles.prose.hr} />,
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return format(new Date(date), 'yyyy年MM月', { locale: zhCN });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          {/* 项目基本信息 */}
          <div className="mb-8">
            {/* 项目标题和标签 */}
            <div className="flex flex-col gap-4 mb-6">
              <h1 className="text-4xl font-bold text-primary">{project.name}</h1>
            </div>

            {/* 项目时间和角色信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                {project.jobRole && (
                  <p className="text-lg">
                    <span className="font-semibold">职位：</span>
                    {project.jobRole}
                  </p>
                )}
                {project.jobTech && (
                  <p className="text-lg">
                    <span className="font-semibold">技术栈：</span>
                    {project.jobTech}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {project.startTime && (
                  <p className="text-lg">
                    <span className="font-semibold">时间：</span>
                    {formatDate(project.startTime)}
                    {project.endTime ? ` - ${formatDate(project.endTime)}` : ' - 至今'}
                  </p>
                )}
              </div>
            </div>



            {/* 项目图片 */}
            {project.images.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-1 gap-4">
                  {project.images.map((image) => (
                    <div key={image.id} className="relative aspect-[21/9] w-full">
                      <Image
                        src={image.path}
                        alt={image.alt || project.name}
                        fill
                        className="object-cover rounded-lg"
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* 项目描述 */}
            <div className="mb-6">
              <p className="text-lg leading-relaxed">{project.description}</p>
            </div>
            {/* 项目链接 */}
            {project.links.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-4">
                  {project.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Markdown 内容 */}
          {content && (
            <div className="border-t pt-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 