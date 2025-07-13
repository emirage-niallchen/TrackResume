import useSWR from "swr"
import { Resume } from "@prisma/client"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useResumes() {
  const { data, error, isLoading, mutate } = useSWR<Resume[]>(
    "/api/resumes",
    fetcher
  )

  return {
    resumes: data || [],
    isLoading,
    error,
    mutate,
  }
} 