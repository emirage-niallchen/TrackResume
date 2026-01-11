import useSWR from "swr"
import type { Resume } from "@prisma/client"
import type { ContentLanguage } from "@/lib/validations/contentLanguage"

async function fetcher(url: string): Promise<Resume[]> {
  const response = await fetch(url)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && typeof (data as any).error === "string"
        ? (data as any).error
        : "Request failed")
    throw new Error(message)
  }

  if (!Array.isArray(data)) {
    throw new Error("Invalid response")
  }

  return data as Resume[]
}

export function useResumes() {
  return useResumesByLanguage()
}

export function useResumesByLanguage(language?: ContentLanguage) {
  const { data, error, isLoading, mutate } = useSWR<Resume[]>(
    language ? `/api/resumes?language=${language}` : "/api/resumes",
    fetcher
  )

  return {
    resumes: data ?? [],
    isLoading,
    error,
    mutate,
  }
} 