"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

interface TagDeleteDialogProps {
  tag: {
    id: string
    name: string
  }
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

interface Association {
  id: string
  name: string
}

interface AssociationResponse {
  hasAssociations: boolean
  associations: {
    files: Association[]
    techs: Association[]
    projects: Association[]
  }
}

export function TagDeleteDialog({ tag, open, onClose, onConfirm }: TagDeleteDialogProps) {
  const [checking, setChecking] = useState(false)
  const [associations, setAssociations] = useState<AssociationResponse | null>(null)

  const checkAssociations = async () => {
    try {
      setChecking(true)
      const response = await fetch(`/api/tags/${tag.id}/check`)
      const data = await response.json()
      setAssociations(data)
    } catch {
      toast.error("检查标签关联失败")
    } finally {
      setChecking(false)
    }
  }

  // 当对话框打开时检查关联
  if (open && !checking && !associations) {
    checkAssociations()
  }

  const handleClose = () => {
    setAssociations(null)
    onClose()
  }

  const handleConfirmClick = () => {
    onConfirm()
    handleClose()
  }

  const renderAssociations = () => {
    if (!associations?.hasAssociations) return null

    const { files, techs, projects } = associations.associations
    return (
      <div className="mt-4 space-y-2">
        <p className="text-sm text-destructive">此标签已被以下项目关联，无法删除：</p>
        {files.length > 0 && (
          <div>
            <p className="text-sm font-medium">文件：</p>
            <ul className="text-sm list-disc list-inside">
              {files.map(file => (
                <li key={file.id}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        {techs.length > 0 && (
          <div>
            <p className="text-sm font-medium">技术栈：</p>
            <ul className="text-sm list-disc list-inside">
              {techs.map(tech => (
                <li key={tech.id}>{tech.name}</li>
              ))}
            </ul>
          </div>
        )}
        {projects.length > 0 && (
          <div>
            <p className="text-sm font-medium">项目：</p>
            <ul className="text-sm list-disc list-inside">
              {projects.map(project => (
                <li key={project.id}>{project.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除标签</DialogTitle>
          <DialogDescription>
            {`确定要删除标签 ${tag.name} 吗？此操作不可撤销。`}
          </DialogDescription>
        </DialogHeader>

        {checking ? (
          <div className="py-4 text-center">正在检查标签关联...</div>
        ) : (
          renderAssociations()
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          {associations && !associations.hasAssociations && (
            <Button 
              variant="destructive" 
              onClick={handleConfirmClick}
              className="hover:bg-destructive/90"
            >
              删除
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}