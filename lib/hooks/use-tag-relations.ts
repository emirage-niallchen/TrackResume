import useSWR from "swr"
import { fetcher } from "@/lib/utils"

interface TagRelations {
  projects: Array<{
    name: string
    description: string
  }>
  techs: Array<{
    name: string
    description: string
  }>
  files: Array<{
    name: string
    type: string
  }>
}

export function useTagRelations(tagId: string) {
  const { data, error, isLoading } = useSWR<TagRelations>(
    `/api/tags/${tagId}/relations`,
    fetcher
  )

  return {
    data,
    error,
    isLoading,
  }
} 