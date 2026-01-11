import useSWR from "swr"
import { fetcher } from "@/lib/utils"
import type { Tag } from "@/lib/types/models"
import type { ContentLanguage } from "@/lib/validations/contentLanguage"

export function useTagsData(language?: ContentLanguage) {
  const key = language ? `/api/tags?language=${language}` : "/api/tags"
  const { data, error, isLoading, mutate } = useSWR<Tag[]>(key, fetcher)
  return { data, error, isLoading, mutate }
}

export function useTagRelations(tagId: string, language?: ContentLanguage) {
  const key = tagId
    ? language
      ? `/api/tags/${tagId}?language=${language}`
      : `/api/tags/${tagId}`
    : null
  return useSWR(key, fetcher)
} 