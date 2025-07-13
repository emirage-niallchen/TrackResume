"use client"

import { Card } from "@/components/ui/card"
import { 
  MessageSquare, 
  Briefcase, 
  Code2, 
  FileBox,
  ArrowRight 
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { fetcher } from "@/lib/utils"

interface DashboardStats {
  unreadMessages: number
  projectCount: number
  techCount: number
  fileCount: number
}

export default function DashboardPage() {
  const { data: stats, error, isLoading } = useSWR<DashboardStats>('/api/dashboard/stats', fetcher)
  const router = useRouter();

  const dashboardItems = [
    {
      title: "未读消息",
      value: stats?.unreadMessages || 0,
      icon: MessageSquare,
      href: "/admin/inbox",
      color: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      title: "项目数量",
      value: stats?.projectCount || 0,
      icon: Briefcase,
      href: "/admin/projects",
      color: "bg-purple-50",
      iconColor: "text-purple-500"
    },
    {
      title: "技术栈",
      value: stats?.techCount || 0,
      icon: Code2,
      href: "/admin/techs",
      color: "bg-orange-50",
      iconColor: "text-orange-500"
    },
    {
      title: "附件管理",
      value: stats?.fileCount || 0,
      icon: FileBox,
      href: "/admin/attachments",
      color: "bg-pink-50",
      iconColor: "text-pink-500"
    }
  ]

  const handleNavigation = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  if (error) return (
    <main className="flex-1 overflow-y-auto p-6 bg-white shadow-sm rounded-lg m-4">
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <div className="text-red-500">数据加载失败</div>
        <div className="text-sm text-gray-500">请检查网络连接或联系管理员</div>
      </div>
    </main>
  )

  if (isLoading) return (
    <main className="flex-1 overflow-y-auto p-6 bg-white shadow-sm rounded-lg m-4">
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    </main>
  )

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-white shadow-sm rounded-lg m-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">仪表盘</h2>
          <div className="text-sm text-gray-500">数据概览</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item) => (
            <Link href={item.href} key={item.title} onClick={handleNavigation(item.href)}>
              <Card className={`${item.color} p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-none`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">{item.title}</div>
                    <div className="text-3xl font-bold mt-2 text-gray-800">{item.value}</div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                    <ArrowRight className="w-4 h-4 text-gray-400 hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}