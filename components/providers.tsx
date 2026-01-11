"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"
import { I18nextProvider } from "react-i18next"
import { useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { detectPreferredLanguage, i18n, setStoredLanguage } from "@/lib/i18n"

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const enableI18n = useMemo(() => {
    if (!pathname) return true
    return !pathname.startsWith("/admin")
  }, [pathname])

  useEffect(() => {
    if (!enableI18n) return
    const preferred = detectPreferredLanguage()
    setStoredLanguage(preferred)
    if (i18n.resolvedLanguage !== preferred) {
      i18n.changeLanguage(preferred)
    }
  }, [enableI18n])

  const content = enableI18n ? (
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  ) : (
    children
  )

  return (
    <SessionProvider>
      {content}
      <Toaster />
    </SessionProvider>
  );
} 