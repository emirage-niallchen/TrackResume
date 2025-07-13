import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Inbox } from "@prisma/client"
import { toast } from "sonner"

interface MessageDialogProps {
  message: Inbox | null
  isOpen: boolean
  onClose: () => void
  onMutate: () => void
}

export function MessageDialog({ message, isOpen, onClose, onMutate }: MessageDialogProps) {
  if (!message) return null

  const handleClose = async () => {
    try {
      const response = await fetch(`/api/admin/inbox/${message.id}/read`, {
        method: 'PUT',
      })
      if (!response.ok) throw new Error('标记已读失败')
      toast.success('消息已标记为已读')
      onMutate() // 刷新列表
      onClose()
    } catch (error) {
      console.error('标记已读失败:', error)
      toast.error('标记已读失败')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-800 text-center">
            邮件消息
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            <div className="text-sm text-gray-500 text-right">
              {format(new Date(message.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
            </div>
            <div className="text-gray-700">
              {message.value && (
                <>
                  <div className="font-medium mb-2 text-2xl mt-8">留言内容：</div>
                  <div className="whitespace-pre-wrap mt-4">        {message.value}</div>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="bg-gray-800 text-white hover:bg-gray-900 text-lg px-8 w-32"
          >
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 