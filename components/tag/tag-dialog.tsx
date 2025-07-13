"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TagForm } from "./tag-form"

interface TagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TagDialog({ open, onOpenChange, onSuccess }: TagDialogProps) {
  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("提交失败")
      }

      onSuccess()
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建标签</DialogTitle>
        </DialogHeader>
        <TagForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
} 