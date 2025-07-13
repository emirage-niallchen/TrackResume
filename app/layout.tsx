import "@/app/globals.css"
import { cn } from "@/lib/utils";
import ClientWrapper from "@/components/common/ClientWrapper";
import { Providers } from "@/components/providers";

export const metadata = {
  title: 'XXX-简历',
  description: '简历',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

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