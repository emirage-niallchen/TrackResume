import "@/app/globals.css"
import { cn } from "@/lib/utils";
import ClientWrapper from "@/components/common/ClientWrapper";
import { Providers } from "@/components/providers";
import DynamicMetadata from "@/components/common/DynamicMetadata";
import { Metadata } from 'next';

// 动态生成metadata - 使用动态路由确保实时更新
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    console.log('Generating dynamic metadata for layout');
    
    // 在Docker环境中，使用内部服务名或localhost
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const metadataUrl = `${baseUrl}/api/website-settings/metadata`;
    
    console.log('Fetching metadata from:', metadataUrl);
    
    const response = await fetch(metadataUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch metadata, status:', response.status);
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