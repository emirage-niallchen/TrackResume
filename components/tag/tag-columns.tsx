"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Tag } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAdminContentLanguage } from "@/lib/context/AdminContentLanguageProvider"

interface UseTagColumnsProps {
  mutate: () => void
  onEdit: (tag: Tag) => void
}

export function useTagColumns({ mutate, onEdit }: UseTagColumnsProps) {
  const { withLanguage } = useAdminContentLanguage()

  const handleDelete = async (tag: Tag) => {

    if (!confirm('确定要删除这个标签吗？')) {
      return
    }

    try {
      const response = await fetch(withLanguage(`/api/tags/${tag.id}`), {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('删除失败')
      }
      
      mutate()
    } catch (error) {
      console.error('删除标签失败:', error)
    }
  }

  const columns: ColumnDef<Tag>[] = [
    // Selection column is handled by DataTable, so no need to add here
    {
      accessorKey: "name",
      header: "名称",
    },
    {
      accessorKey: "description",
      header: "描述",
    },
    {
      accessorKey: "color",
      header: "颜色",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div 
            className="h-4 w-4 rounded-full" 
            style={{ backgroundColor: row.original.color }} 
          />
          <span>{row.original.color}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const tag = row.original
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 flex items-center gap-1"
              onClick={() => onEdit(tag)}
            >
              <Pencil className="h-4 w-4" />
              编辑
            </Button>

            <button
              type="button"
              className="flex items-center gap-1 px-3 h-8 border rounded-md text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(tag)}
            >
              <Trash2 className="h-4 w-4" />
              删除
            </button>
          </div>
        )
      },
    },
  ]

  return columns
} 