import { Metadata } from "next"
import { ResumeList } from "@/components/admin/resumes/resume-list"

export const metadata: Metadata = {
  title: "履历管理",
  description: "管理个人履历信息，包括工作经历、教育背景等",
}

export default function ResumesPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">履历管理</h1>
      </div>
      <ResumeList />
    </div>
  )
} 