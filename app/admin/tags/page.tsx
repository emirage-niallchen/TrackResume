"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TagDataTable } from "@/components/tag/tag-data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTagsData } from "@/lib/hooks/use-tags"
import { Tag } from "@/lib/types"
import { TagForm } from "@/components/tag/tag-form"
import { useToast } from "@/hooks/use-toast"
import { useAdminContentLanguage } from "@/lib/context/AdminContentLanguageProvider"

export default function TagsPage() {
  const [open, setOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const { language } = useAdminContentLanguage()
  const { data: tags, isLoading, mutate } = useTagsData(language) as {
    data: Tag[] | undefined,
    isLoading: boolean,
    mutate: () => void
  }
  const { toast } = useToast()

  //查询对应字段

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setOpen(true)
  }

  const handleSuccess = () => {
    setOpen(false)
    setEditingTag(null)
    mutate()
  }

  const selectedTags = (tags || []).filter(tag => selectedTagIds.includes(tag.id))

  const handleGenerateLink = async () => {
    if (selectedTags.length === 0) return
    const params = selectedTags.map(tag => `tags=${encodeURIComponent(tag.name)}`).join('&')
    try {
      const res = await fetch('/api/admin/profile/endpoint')
      const data = await res.json()
      console.log("data", data)
      if (!data || !data.endpoint) {
      //提示用户，没有配置站点网址
        toast({ title: "Error", description: "站点网址未配置，请先在个人资料中设置。" })
        return

      }
      const url = data.endpoint+ "?" + params || ""

      await navigator.clipboard.writeText(url)
      toast({ title: "Link copied", description: "The link has been copied to clipboard." })
      setSelectedTagIds([])
    } catch (error) {
      toast({ title: "Error", description: "Failed to copy link." })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">标签管理</h2>
          <p className="text-muted-foreground">
            标签用于对您所有展示的内容进行分类
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateLink} disabled={selectedTagIds.length === 0}>
            生成链接
          </Button>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新建标签
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <TagDataTable
          data={tags || []}
          mutate={mutate}
          onEdit={handleEdit}
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
        />
      </div>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "编辑标签" : "新建标签"}
            </DialogTitle>
          </DialogHeader>
          <TagForm
            onSubmit={handleSuccess}
            defaultValues={editingTag || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
