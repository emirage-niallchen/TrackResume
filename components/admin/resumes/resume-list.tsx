"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ResumeForm } from "./resume-form"
import { useResumes } from "@/lib/hooks/use-resumes"
import { formatResumeDate } from "@/lib/utils/dateFormatter"
import { Resume } from "@prisma/client"
import { Edit2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function ResumeList() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingResume, setEditingResume] = useState<Resume | null>(null)
  const [deletingResume, setDeletingResume] = useState<Resume | null>(null)
  const { resumes, isLoading, error, mutate } = useResumes()

  const handleEdit = (resume: Resume) => {
    setEditingResume(resume)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingResume) return

    try {
      const response = await fetch(`/api/resumes/${deletingResume.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("删除失败")
      
      await mutate()
    } catch (error) {
      console.error(error)
    } finally {
      setDeletingResume(null)
    }
  }

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>加载失败</div>

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsFormOpen(true)}>添加履历</Button>
      
      {resumes?.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          暂无履历数据，可点击上方按钮添加
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes?.map((resume: Resume) => (
            <Card key={resume.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{resume.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(resume)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingResume(resume)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    {resume.organization} - {resume.title}
                  </p>
                  <p className="text-sm">
                    {formatResumeDate(resume.startTime)} - {resume.endTime ? formatResumeDate(resume.endTime) : "至今"}
                  </p>
                  <p className="text-sm text-gray-600">{resume.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <ResumeForm 
          onClose={() => {
            setIsFormOpen(false)
            setEditingResume(null)
          }} 
          resume={editingResume}
        />
      )}

      <AlertDialog open={!!deletingResume} onOpenChange={() => setDeletingResume(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该履历记录，确定要继续吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 