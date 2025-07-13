"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useResumes } from "@/lib/hooks/use-resumes"
import { Resume } from "@prisma/client"

interface ResumeFormProps {
  onClose: () => void
  resume?: Resume | null
}

export function ResumeForm({ onClose, resume }: ResumeFormProps) {
  const { mutate } = useResumes()
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get("name"),
      organization: formData.get("organization"),
      title: formData.get("title"),
      location: formData.get("location"),
      description: formData.get("description"),
      startTime: new Date(formData.get("startTime") as string).toISOString(),
      endTime: formData.get("endTime") 
        ? new Date(formData.get("endTime") as string).toISOString()
        : null,
      isPublished: true,
      order: resume?.order || 0,
    }
    
    try {
      const url = resume ? `/api/resumes/${resume.id}` : "/api/resumes"
      const method = resume ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(resume ? "更新失败" : "创建失败")
      }

      await mutate()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{resume ? "编辑履历" : "添加履历"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input 
            name="name" 
            placeholder="名称" 
            required 
            defaultValue={resume?.name || ''}
          />
          <Input 
            name="organization" 
            placeholder="组织" 
            defaultValue={resume?.organization || ''}
          />
          <Input 
            name="title" 
            placeholder="职位" 
            defaultValue={resume?.title || ''}
          />
          <Input 
            name="location" 
            placeholder="地点" 
            defaultValue={resume?.location || ''}
          />
          <Input 
            type="date" 
            name="startTime" 
            required 
            defaultValue={formatDate(resume?.startTime)}
          />
          <Input 
            type="date" 
            name="endTime"
            defaultValue={formatDate(resume?.endTime)}
          />
          <Textarea 
            name="description" 
            placeholder="描述" 
            required
            defaultValue={resume?.description || ''}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "提交中..." : "提交"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 