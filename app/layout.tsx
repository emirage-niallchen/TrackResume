import "@/app/globals.css"
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Metadata } from 'next';
import { prisma } from "@/lib/prisma";

// 动态生成metadata - 使用动态路由确保实时更新
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    // 优先查询 zh 语言的设置（最新的），如果没有则查询任意设置
    const settings = await prisma.settings.findFirst({
      where: { language: "zh" },
      orderBy: { updatedAt: "desc" },
    }) ?? await prisma.settings.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    
    const websiteTitle = settings?.websiteTitle ?? "Resume Portfolio";
    const favicon = settings?.favicon ?? null;

    console.log("Metadata: generated", { hasTitle: !!settings?.websiteTitle, hasFavicon: !!settings?.favicon });
    
    return {
      title: websiteTitle,
      description: 'Professional resume and portfolio showcase',
      ...(favicon
        ? {
            icons: {
              icon: favicon,
              shortcut: favicon,
              apple: favicon,
            },
          }
        : {}),
    };
  } catch (error) {
    console.error("Metadata: generate failed", error);
    
    return {
      title: 'Resume Portfolio',
      description: 'Professional resume and portfolio showcase',
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