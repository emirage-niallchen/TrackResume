"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 使用 next-auth 自带的 signOut 功能
      await signOut({ 
        redirect: true,
        callbackUrl: "/login"
      });
      
      toast.success('登出成功');
    } catch (error) {
      console.error("登出错误:", error);
      toast.error('登出失败，请稍后重试');
      // 即使出错也尝试重定向到登录页面
      router.push("/login");
    }
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="destructive"
    >
      登出
    </Button>
  );
} 