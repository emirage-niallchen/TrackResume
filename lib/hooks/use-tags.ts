import useSWR from "swr"
import { fetcher } from "@/lib/utils"
import type { Tag } from "@/lib/types/models"

export function useTagsData() {
  const { data, error, isLoading, mutate } = useSWR<Tag[]>('/api/tags', fetcher)
  return { data, error, isLoading, mutate }
}

export function useTagRelations(tagId: string) {
  return useSWR(tagId ? `/api/tags/${tagId}` : null, fetcher)
} 