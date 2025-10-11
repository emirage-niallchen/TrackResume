import "@/app/globals.css"
import { cn } from "@/lib/utils";
import ClientWrapper from "@/components/common/ClientWrapper";
import { Providers } from "@/components/providers";
import DynamicMetadata from "@/components/common/DynamicMetadata";
import { Metadata } from 'next';

// 动态生成metadata
export async function generateMetadata(): Promise<Metadata> {
  try {
    console.log('Generating dynamic metadata for layout');
    
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/website-settings/metadata`, {
      cache: 'no-store', // 确保获取最新数据
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const { websiteTitle, favicon } = await response.json();
    
    console.log('Dynamic metadata generated', { websiteTitle, hasFavicon: !!favicon });
    
    return {
      title: websiteTitle || 'Resume Portfolio',
      description: 'Professional resume and portfolio showcase',
      icons: {
        icon: favicon || '/favicon.svg',
        shortcut: favicon || '/favicon.svg',
        apple: favicon || '/favicon.svg',
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    
    // 返回默认metadata作为fallback
    return {
      title: 'Resume Portfolio',
      description: 'Professional resume and portfolio showcase',
      icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
      },
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <Providers>
          <DynamicMetadata />
          <div className={cn(
            "min-h-screen bg-background antialiased"
          )}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
} 