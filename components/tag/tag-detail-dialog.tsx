"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tag, FileTag, TechTag, ProjectTag } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface TagDetailDialogProps {
  tag: Tag & {
    files?: FileTag[]
    techs?: TechTag[]
    projects?: ProjectTag[]
  }
  open: boolean
  onClose: () => void
}

export function TagDetailDialog({ tag, open, onClose }: TagDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>标签详情</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div 
              className="h-4 w-4 rounded-full" 
              style={{ backgroundColor: tag.color }} 
            />
            <h3 className="text-lg font-semibold">{tag.name}</h3>
          </div>
          
          {tag.description && (
            <div>
              <h4 className="font-medium mb-1">描述</h4>
              <p className="text-sm text-muted-foreground">{tag.description}</p>
            </div>
          )}

          {tag.files?.map((fileTag) => (
            <Badge key={fileTag.fileId}>
              {fileTag.file?.name}
            </Badge>
          ))}

          {tag.techs?.map((techTag) => (
            <Badge key={techTag.techId}>
              {techTag.tech?.name}
            </Badge>
          ))}

          {tag.projects?.map((projectTag) => (
            <Badge key={projectTag.projectId}>
              {projectTag.project?.name}
            </Badge>
          ))}

          <div className="text-sm text-muted-foreground">
            <p>创建时间：{new Date(tag.createdAt).toLocaleString()}</p>
            <p>更新时间：{new Date(tag.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 