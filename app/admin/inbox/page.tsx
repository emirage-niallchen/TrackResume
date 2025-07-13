"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MessageSquare, Search, Trash2, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { fetcher } from "@/lib/utils"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Inbox } from "@prisma/client"
import { toast } from "sonner"
import { MessageDialog } from "@/components/ui/message-dialog"

interface InboxResponse {
    data: Inbox[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}

export default function InboxPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState<Inbox | null>(null)
    const { data: inboxData, error, mutate } = useSWR<InboxResponse>('/api/admin/inbox', fetcher)

    useEffect(() => {
        if (inboxData) {
            console.log('收件箱数据:', inboxData.data)
        }
    }, [inboxData])

    // 删除单条消息
    const handleDeleteMessage = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/inbox/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) throw new Error('删除失败')
            toast.success('消息已删除')
            mutate()
        } catch (error) {
            toast.error('删除失败')
        }
    }

    // 全部已读
    const handleMarkAllRead = async () => {
        if (isLoading) return
        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/inbox/allread', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                const error = await response.text()
                throw new Error(error || '操作失败')
            }
            toast.success('所有消息已标记为已读')
            await mutate()
        } catch (error) {
            console.error('标记已读失败:', error)
            toast.error('标记已读失败')
        } finally {
            setIsLoading(false)
        }
    }

    // 清空所有消息
    const handleClearAll = async () => {
        if (!confirm('确定要删除所有消息吗？此操作不可恢复。')) return
        try {
            const response = await fetch('/api/admin/inbox', {
                method: 'DELETE',
            })
            if (!response.ok) throw new Error('删除失败')
            toast.success('所有消息已删除')
            mutate()
        } catch (error) {
            toast.error('删除失败')
        }
    }

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
                    <div className="flex items-center space-x-2">
                        <MessageSquare className="w-6 h-6 text-gray-600" />
                        <h2 className="text-2xl font-semibold text-gray-800">收件箱</h2>
                        <span className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                            {inboxData?.data.filter(msg => !msg.isRead).length || 0} 条未读
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleMarkAllRead}
                            className="flex items-center space-x-2"
                            disabled={isLoading}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isLoading ? '处理中...' : '全部已读'}</span>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleClearAll}
                            className="flex items-center space-x-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>清空消息</span>
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {inboxData?.data.map((message: Inbox) => (
                        <Card 
                            key={message.id} 
                            className={`p-4 ${!message.isRead ? 'bg-blue-50' : ''} cursor-pointer hover:bg-gray-50 transition-colors`}
                            onClick={() => setSelectedMessage(message)}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium truncate">{message.value}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    {!message.isRead && (
                                        <span className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded-full whitespace-nowrap">
                                            未读
                                        </span>
                                    )}
                                    
                                    <div className="text-sm text-gray-500 whitespace-nowrap">
                                        {format(new Date(message.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteMessage(message.id)
                                        }}
                                        className="text-gray-500 hover:text-red-600 flex-shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <MessageDialog
                message={selectedMessage}
                isOpen={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                onMutate={mutate}
            />
        </main>
    )
} 