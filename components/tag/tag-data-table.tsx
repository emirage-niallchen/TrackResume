"use client"

import { DataTable } from "@/components/ui/data-table"
import { TagDetailDialog } from "./tag-detail-dialog"
import { useState } from "react"
import { Tag } from "@/lib/types"
import { useTagColumns } from "./tag-columns"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface TagDataTableProps {
  data: Tag[]
  mutate: () => void
  onEdit: (tag: Tag) => void
  selectedTagIds: string[]
  setSelectedTagIds: (ids: string[]) => void
}

export function TagDataTable({ data, mutate, onEdit, selectedTagIds, setSelectedTagIds }: TagDataTableProps) {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const { toast } = useToast()
  const columns = useTagColumns({ mutate, onEdit: (tag) => setSelectedTag(tag) })

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        selectedRowIds={selectedTagIds}
        onSelectedRowIdsChange={setSelectedTagIds}
      />
      {selectedTag && (
        <TagDetailDialog
          tag={selectedTag}
          open={!!selectedTag}
          onClose={() => setSelectedTag(null)}
        />
      )}
    </>
  )
} 