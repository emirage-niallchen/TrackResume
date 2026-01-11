import "@/app/globals.css"
import { cn } from "@/lib/utils";
import ClientWrapper from "@/components/common/ClientWrapper";
import { Providers } from "@/components/providers";
import DynamicMetadata from "@/components/common/DynamicMetadata";
import { Metadata } from 'next';
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { toContentLanguage } from "@/lib/utils";

// 动态生成metadata - 使用动态路由确保实时更新
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const hdrs = await headers();
    const acceptLanguage = hdrs.get("accept-language") ?? "";
    const language = toContentLanguage(acceptLanguage);

    const settings =
      (await prisma.settings.findFirst({ where: { language } })) ??
      (language !== "zh" ? await prisma.settings.findFirst({ where: { language: "zh" } }) : null);

    const websiteTitle = settings?.websiteTitle ?? "Resume Portfolio";
    const favicon = settings?.favicon || "/favicon.svg";

    console.log("Metadata: generated", { language, hasTitle: !!settings?.websiteTitle, hasFavicon: !!settings?.favicon });
    
    return {
      title: websiteTitle,
      description: 'Professional resume and portfolio showcase',
      icons: {
        icon: favicon,
        shortcut: favicon,
        apple: favicon,
      },
    };
  } catch (error) {
    console.error("Metadata: generate failed", error);
    
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