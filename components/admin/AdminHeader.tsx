"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { useState } from "react";
import ChangePasswordDialog from "./ChangePasswordDialog";

export default function AdminHeader() {
  const router = useRouter();
  const { data: unreadCount } = useSWR<number>('/api/inbox/unread', fetcher);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      // 使用 next-auth 自带的 signOut 功能
      await signOut({ 
        redirect: true,
        callbackUrl: "/login"
      });
      
      // 清除所有 SWR 缓存
      await mutate(() => true, undefined, { revalidate: false });
      toast.success('登出成功');
    } catch (error) {
      console.error("登出错误:", error);
      toast.error('登出失败，请稍后重试');
      // 即使出错也尝试重定向到登录页面
      router.push("/login");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-gray-400">
        <div className="flex h-14 items-center justify-between px-4">
          {/* 左侧 Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/Track-Resume.svg"
                alt="Track Resume Logo"
                width={200}
                height={320}
              />
            </Link>
          </div>

          {/* 右侧导航 */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
                首页
              </Button>
            </Link>
            <Link href="/admin/inbox">
              <Button variant="ghost" className="relative hover:bg-accent hover:text-accent-foreground">
                <Bell className="h-5 w-5" />
                {unreadCount && unreadCount > 0 ? (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                ) : null}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => setIsChangePasswordOpen(true)}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              修改密码
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              登出
            </Button>
          </div>
        </div>
      </header>

      <ChangePasswordDialog 
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </>
  );
} 

