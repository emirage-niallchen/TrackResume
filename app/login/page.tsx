"use client";

import { useState, useEffect } from 'react';
import { LoginForm } from "@/components/auth/login-form";
import Image from 'next/image';
import { InitForm } from "@/components/auth/init-form";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isInitialSetup, setIsInitialSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminExists = async () => {
    try {
      const response = await fetch('/api/admin/check');
      if (!response.ok) {
        throw new Error('检查管理员失败');
      }
      const data = await response.json();
      setIsInitialSetup(!data.exists);
    } catch (error) {
      console.error('检查管理员失败:', error);
      setIsInitialSetup(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 如果用户已登录，重定向到管理面板
    if (status === 'authenticated' && session) {
      router.push('/admin/dashboard');
      return;
    }
    
    // 如果会话状态已确定且未登录，检查管理员是否存在
    if (status === 'unauthenticated') {
      checkAdminExists();
    }
  }, [status, session, router]);

  // 如果正在检查会话状态，显示加载状态
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pattern">
        <div className="mb-8">
          <Image
            src="/Track-Resume.svg"
            alt="Track Resume Logo"
            width={600}
            height={240}
            priority
          />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果用户已登录，不显示登录页面
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pattern">
      <div className="mb-8">
        <Image
          src="/Track-Resume.svg"
          alt="Track Resume Logo"
          width={600}
          height={240}
          priority
        />
      </div>
      {isInitialSetup ? <InitForm /> : <LoginForm />}
    </div>
  );
} 